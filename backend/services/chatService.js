/**
 * Chat Service — Evidence-Grounded RAG Engine
 * Builds a live evidence store from the uploaded resume (SQLite), real GitHub
 * repositories, and resume-extracted projects/certifications. Each question
 * retrieves only the sources that actually match it; the LLM (Groq primary,
 * Gemini failover, offline engine last) is constrained to cite those sources
 * by index. Verdicts (verified / unverified / no evidence) are derived from
 * retrieval results — never hard-coded.
 */

import ResumeModel from '../models/resumeModel.js';
import { ResumeAnalysisService } from './resumeAnalysisService.js';
import { fetchGitHubInsights } from './githubService.js';
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'rounithrathesh-coder';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'are', 'was', 'were',
  'you', 'your', 'their', 'they', 'its', 'into', 'using', 'used', 'use', 'can', 'will',
  'all', 'any', 'our', 'out', 'how', 'what', 'when', 'where', 'who', 'why', 'did', 'does',
  'not', 'but', 'about', 'more', 'than', 'many', 'much', 'some', 'also', 'been', 'being',
  'over', 'under', 'very', 'just', 'like', 'them', 'then', 'there', 'here', 'one', 'two',
  'per', 'via', 'etc', 'any', 'people', 'things'
]);

const tokenize = (text) =>
  (String(text || '').toLowerCase().match(/[a-z0-9+#.]{2,}/g) || []).filter((t) => !STOPWORDS.has(t));

const shortDate = (value) => {
  const d = new Date(value);
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Evidence store is rebuilt at most every 10 minutes (GitHub fetch is expensive)
let evidenceCache = { builtAt: 0, store: null };
const EVIDENCE_TTL_MS = 10 * 60 * 1000;

export class ChatService {
  /**
   * Main entry: retrieve evidence for the question, then answer with
   * Groq ➔ Gemini ➔ offline evidence engine, citing retrieved sources only.
   */
  static async processMessage(userMessage, role = 'pro') {
    const store = await ChatService.buildEvidenceStore();
    const matched = ChatService.retrieveSources(userMessage, store);
    const { mentioned, missing } = ChatService.findTechGaps(userMessage, store);

    // No evidence: every technology the question names is absent from the
    // candidate's repos, resume, projects, and certs — refuse rather than
    // let a generic section keyword-match imply support.
    if (mentioned.length > 0 && missing.length === mentioned.length) {
      return ChatService.formatRefusal(missing, store);
    }

    const retrieved = matched.length > 0 ? matched : ChatService.defaultSources(store);
    const formatted = retrieved.map((s, idx) => ({
      ...s,
      index: idx + 1,
      title: s.source_name,
      typeName: s.source_type.toUpperCase()
    }));

    // If every matching source is a resume-only claim with no code behind it,
    // the answer is honest but flagged as unverified.
    const answerType = formatted.length > 0 && formatted.every((s) => !s.corroborated)
      ? 'unverified'
      : 'verified';

    const contextInfo = ChatService.buildContext(formatted, missing, store);

    let answerText = null;
    let provider = null;

    if (process.env.GROQ_API_KEY) {
      try {
        answerText = await ChatService.callGroqAPI(userMessage, contextInfo);
        if (answerText) provider = 'Groq AI (llama-3.3-70b)';
      } catch (err) {
        console.warn('[ChatService] Groq API call skipped/rate-limited:', err.message);
      }
    }

    if (!answerText && process.env.GEMINI_API_KEY) {
      try {
        answerText = await ChatService.callGeminiAPI(userMessage, contextInfo);
        if (answerText) provider = 'Google Gemini (2.0-flash)';
      } catch (err) {
        console.warn('[ChatService] Gemini API call skipped/rate-limited:', err.message);
      }
    }

    if (!answerText) {
      answerText = ChatService.composeOfflineAnswer(formatted);
      provider = 'Evidence Engine (offline)';
    }

    // Normalize grouped citations "[1, 4]" into "[1] [4]" so the UI renders each chip
    answerText = answerText.replace(/\[(\d+(?:\s*,\s*\d+)+)\]/g, (m, nums) =>
      nums.split(/\s*,\s*/).map((n) => `[${n}]`).join(' ')
    );

    // Citation chips reflect the [n] markers actually present in the answer
    const cited = new Set(
      [...answerText.matchAll(/\[(\d+)\]/g)]
        .map((m) => parseInt(m[1], 10))
        .filter((n) => n >= 1 && n <= formatted.length)
    );
    const citationIndexes = cited.size > 0
      ? [...cited].sort((a, b) => a - b)
      : formatted.map((s) => s.index);

    const confidence = answerType === 'unverified'
      ? {
          type: 'unverified',
          label: `Resume-claimed · not corroborated by code · ${formatted.length} sources`,
          count: formatted.length
        }
      : {
          type: 'verified',
          label: `${matched.length > 0 ? 'Verified evidence' : 'Grounded in profile'} · ${provider} · ${formatted.length} sources`,
          count: formatted.length
        };

    return {
      answerType,
      answer: answerText,
      confidence,
      citationIndexes,
      sources: formatted
    };
  }

  /**
   * Builds the evidence store from live data:
   * GitHub repos (code-verified) + resume sections, projects, certifications.
   */
  static async buildEvidenceStore() {
    if (evidenceCache.store && Date.now() - evidenceCache.builtAt < EVIDENCE_TTL_MS) {
      return evidenceCache.store;
    }

    const sources = [];
    const techIndex = new Set();

    const latestResume = await ResumeModel.getLatest().catch(() => null);
    const resumeText = latestResume?.extracted_text || '';
    const analysis = ResumeAnalysisService.analyzeText(resumeText);

    let repos = [];
    try {
      const gh = await fetchGitHubInsights(GITHUB_USERNAME);
      repos = gh?.topRepos || [];
    } catch {
      // GitHub unreachable — evidence store falls back to resume-only sources
    }

    for (const repo of repos.slice(0, 8)) {
      const repoText = `${repo.name.replace(/[-_]/g, ' ')} ${repo.description || ''} ${repo.language || ''}`;
      sources.push({
        source_type: 'repo',
        source_name: repo.name,
        detail: `${repo.language || 'Code'} · ★ ${repo.stars ?? 0} · updated ${shortDate(repo.updatedAt)}`,
        url: repo.url,
        corroborated: true,
        keywords: [...tokenize(repoText), 'repo', 'repository', 'repositories', 'github', 'code', 'commit', 'commits'],
        excerpt: repo.description || `${repo.language || ''} repository`.trim()
      });
      if (repo.language) techIndex.add(repo.language.toLowerCase());
      for (const skills of Object.values(ResumeAnalysisService.extractSkills(repoText))) {
        skills.forEach((s) => techIndex.add(s.toLowerCase()));
      }
    }

    if (resumeText) {
      const uploadedLabel = `${latestResume.original_filename} · uploaded ${shortDate(latestResume.uploaded_at)}`;
      const allSkills = Object.values(analysis.skills || {}).flat();
      allSkills.forEach((s) => techIndex.add(s.toLowerCase()));

      if (allSkills.length > 0) {
        sources.push({
          source_type: 'resume',
          source_name: 'Résumé — Skills & Summary',
          detail: uploadedLabel,
          url: null,
          corroborated: false,
          keywords: [...tokenize(allSkills.join(' ')), 'skill', 'skills', 'strongest', 'strengths', 'technical', 'summary', 'profile'],
          excerpt: allSkills.slice(0, 12).join(', ')
        });
      }

      const sections = ResumeAnalysisService.segmentSections(resumeText);
      if (sections.experience) {
        sources.push({
          source_type: 'resume',
          source_name: 'Résumé — Experience',
          detail: uploadedLabel,
          url: null,
          corroborated: false,
          keywords: [...tokenize(sections.experience).slice(0, 60), 'experience', 'led', 'lead', 'team', 'intern', 'internship', 'work', 'role'],
          excerpt: sections.experience.replace(/\s+/g, ' ').slice(0, 180)
        });
      }
      if (sections.education) {
        sources.push({
          source_type: 'resume',
          source_name: 'Résumé — Education',
          detail: uploadedLabel,
          url: null,
          corroborated: false,
          keywords: [...tokenize(sections.education).slice(0, 40), 'education', 'degree', 'college', 'university', 'cgpa', 'gpa', 'school'],
          excerpt: sections.education.replace(/\s+/g, ' ').slice(0, 180)
        });
      }

      // Resume projects count as corroborated only when a GitHub repo matches by name
      for (const proj of (analysis.projects || []).slice(0, 5)) {
        if (!proj.technologies || proj.technologies.length === 0) continue;
        // Heuristic extraction sometimes mistakes tech lists ("React, Node.js")
        // for project titles — those aren't real project names, skip them
        if (proj.name.includes(',')) continue;
        const squash = (s) => s.toLowerCase().replace(/[-_\s]/g, '');
        const repoMatch = repos.find(
          (r) => squash(r.name).includes(squash(proj.name)) || squash(proj.name).includes(squash(r.name))
        );
        sources.push({
          source_type: 'project',
          source_name: proj.name,
          detail: `${proj.technologies.join(', ')} · listed on resume`,
          url: repoMatch?.url || null,
          corroborated: Boolean(repoMatch),
          keywords: [...tokenize(`${proj.name} ${proj.description} ${proj.technologies.join(' ')}`), 'project', 'projects', 'built', 'showcase'],
          excerpt: proj.description || proj.name
        });
        proj.technologies.forEach((t) => techIndex.add(t.toLowerCase()));
      }

      for (const cert of (analysis.certifications || []).slice(0, 4)) {
        sources.push({
          source_type: 'certification',
          source_name: cert.replace(/\s+/g, ' ').slice(0, 70),
          detail: 'Listed on resume',
          url: null,
          corroborated: false,
          keywords: [...tokenize(cert), 'certification', 'certifications', 'certificate', 'certified', 'course', 'coursera'],
          excerpt: cert.replace(/\s+/g, ' ').slice(0, 160)
        });
      }
    }

    const store = {
      sources,
      techIndex,
      repoCount: repos.length,
      certCount: (analysis.certifications || []).length,
      hasResume: Boolean(resumeText),
      candidateName: analysis.personal?.name || 'the candidate'
    };

    evidenceCache = { builtAt: Date.now(), store };
    return store;
  }

  /**
   * Scores every source against the question; returns the top matches only.
   */
  static retrieveSources(question, store) {
    const qTokens = new Set(tokenize(question));
    return store.sources
      .map((source) => {
        let score = 0;
        for (const kw of source.keywords) if (qTokens.has(kw)) score += 1;
        for (const t of tokenize(source.source_name)) if (qTokens.has(t)) score += 2;
        return { source, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.source);
  }

  /**
   * Detects technologies named in the question that have zero presence
   * anywhere in the evidence store (the honest "no evidence" trigger).
   */
  static findTechGaps(question, store) {
    const mentioned = Object.values(ResumeAnalysisService.extractSkills(question)).flat();
    const missing = mentioned.filter((t) => !store.techIndex.has(t.toLowerCase()));
    return { mentioned, missing };
  }

  /**
   * For generic questions with no keyword match: ground in the strongest
   * overall sources rather than fabricating relevance.
   */
  static defaultSources(store) {
    const repos = store.sources.filter((s) => s.source_type === 'repo').slice(0, 3);
    const resume = store.sources.filter((s) => s.source_type !== 'repo').slice(0, 2);
    return [...repos, ...resume];
  }

  /**
   * LLM context listing only the retrieved sources, numbered as cited.
   */
  static buildContext(formattedSources, missingTech, store) {
    const sourceLines = formattedSources.map((s) => {
      const status = s.corroborated ? 'code-verified' : 'resume-claimed, NOT code-verified';
      return `[${s.index}] (${s.typeName}, ${status}) ${s.source_name} — ${s.excerpt} (${s.detail})`;
    }).join('\n');

    const gapLine = missingTech.length > 0
      ? `\nNO EVIDENCE EXISTS for: ${missingTech.join(', ')}. If asked about these, state plainly that no evidence was found — never infer or assume.`
      : '';

    return `CANDIDATE: ${store.candidateName} (@${GITHUB_USERNAME})

EVIDENCE SOURCES (the ONLY facts you may use about the candidate):
${sourceLines || '(no matching sources retrieved)'}
${gapLine}`;
  }

  /**
   * Primary Provider: Groq API call constrained to retrieved evidence
   */
  static async callGroqAPI(userMessage, contextInfo) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 450,
        messages: [
          {
            role: 'system',
            content: `You are the CareerTwin AI Mentor. Answer recruiter and candidate questions using ONLY the numbered evidence sources provided — no outside knowledge about the candidate.

RULES:
1. Cite a source as [n] immediately after every claim it supports. Only use the numbers provided. Cite each source in its own brackets — write [1] [4], never [1, 4].
2. Sources marked "resume-claimed, NOT code-verified" must be presented as resume claims, not verified facts.
3. If the evidence does not answer the question, say so plainly instead of guessing.

FORMATTING:
- Start with a direct 1-sentence summary.
- Short bullet points (•), key technologies and project names in **bold**.
- Keep it clean and readable; no walls of text.`
          },
          {
            role: 'user',
            content: `${contextInfo}\n\nQuestion: ${userMessage}`
          }
        ]
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content;
    }
    return null;
  }

  /**
   * Secondary Provider Failover: Google Gemini API call
   */
  static async callGeminiAPI(userMessage, contextInfo) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are CareerTwin AI Mentor. Answer using ONLY the numbered evidence sources below — no outside knowledge about the candidate. Cite as [n] after each claim, using only provided numbers. Present "resume-claimed" sources as claims, not verified facts. If evidence is missing, say so plainly.
Format: 1-sentence summary, then bullet points (•) with **bold** keywords and inline [n] citations.

${contextInfo}\n\nQuestion: ${userMessage}`
              }
            ]
          }
        ]
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }
    return null;
  }

  /**
   * Offline fallback: composes the answer directly from retrieved sources.
   */
  static composeOfflineAnswer(formattedSources) {
    if (formattedSources.length === 0) {
      return 'I could not retrieve any evidence sources for this question. Try asking about skills, projects, repositories, or certifications on the profile.';
    }
    const bullets = formattedSources
      .map((s) => `• **${s.source_name}** [${s.index}] — ${s.excerpt}${s.corroborated ? '' : ' *(resume-claimed, not code-verified)*'}`)
      .join('\n');
    return `Here is what the retrieved evidence shows for this question:\n\n${bullets}`;
  }

  /**
   * Honest refusal with a real audit of what was searched.
   */
  static formatRefusal(missingTech, store) {
    const list = missingTech.join(', ');
    const auditLines = [
      `• Scanned **${store.repoCount} GitHub repositories** for @${GITHUB_USERNAME}`,
      store.hasResume
        ? `• Searched the uploaded resume text and **${store.certCount} certification records**`
        : '• No resume uploaded — resume evidence unavailable',
      `• Found **0 supporting sources** for ${list}`
    ].join('\n');

    return {
      answerType: 'refusal',
      answer: `No evidence found for **${list}** in the candidate's profile.\n\n🔍 **Verification audit (live):**\n${auditLines}\n\n*This claim is treated as unproven to keep every answer evidence-grounded.*`,
      confidence: {
        type: 'no_evidence',
        label: 'No evidence found',
        count: 0
      },
      citationIndexes: [],
      sources: []
    };
  }
}

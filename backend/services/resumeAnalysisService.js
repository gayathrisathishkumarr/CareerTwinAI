/**
 * Resume Analysis Service
 * Rule-based text processing and pattern extraction for Career Twin profile generation.
 */

const SKILL_DICTIONARY = {
  programmingLanguages: [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C\\+\\+', 'C#', '\\bC\\b', 'Rust', 'Go', 'Golang',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Scala', 'SQL', 'HTML', 'CSS', 'Bash', 'Shell'
  ],
  frameworks: [
    'React', 'React Native', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Express', 'Express.js',
    'Node.js', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Ruby on Rails', 'Laravel', 'ASP.NET', 'Svelte'
  ],
  libraries: [
    'Redux', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow',
    'PyTorch', 'Keras', 'OpenCV', 'Matplotlib', 'Seaborn', 'GraphQL', 'Axios', 'Chart.js'
  ],
  databases: [
    'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Cassandra', 'Oracle', 'Firebase',
    'DynamoDB', 'MariaDB', 'Neo4j', 'Elasticsearch'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Jenkins', 'VS Code', 'Postman',
    'Webpack', 'Vite', 'npm', 'yarn', 'JIRA', 'Linux'
  ],
  cloud: [
    'AWS', 'Amazon Web Services', 'GCP', 'Google Cloud', 'Azure', 'Vercel', 'Netlify',
    'Heroku', 'DigitalOcean', 'Cloudflare'
  ],
  softSkills: [
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Critical Thinking',
    'Time Management', 'Agile', 'Scrum', 'Mentorship', 'Collaboration'
  ]
};

export class ResumeAnalysisService {
  /**
   * Main entry point to convert raw resume text to structured Career Twin JSON
   */
  static analyzeText(rawText = '') {
    if (!rawText || typeof rawText !== 'string') {
      return this.getEmptyProfile();
    }

    const text = rawText.replace(/\r\n/g, '\n');

    const personal = this.extractPersonal(text);
    const skills = this.extractSkills(text);
    const sections = this.segmentSections(text);

    const education = this.extractEducation(sections.education || text);
    const experience = this.extractExperience(sections.experience || text);
    const projects = this.extractProjects(sections.projects || text);
    const certifications = this.extractListItems(sections.certifications || '');
    const achievements = this.extractListItems(sections.achievements || '');

    return {
      personal,
      education,
      skills,
      experience,
      projects,
      certifications,
      achievements
    };
  }

  static getEmptyProfile() {
    return {
      personal: { fullName: '', email: '', phone: '', linkedIn: '', gitHub: '', portfolio: '' },
      education: [],
      skills: {
        programmingLanguages: [],
        frameworks: [],
        libraries: [],
        databases: [],
        tools: [],
        cloud: [],
        softSkills: []
      },
      experience: [],
      projects: [],
      certifications: [],
      achievements: []
    };
  }

  static extractPersonal(text) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';

    // Phone Number
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // LinkedIn
    const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const linkedIn = linkedInMatch ? linkedInMatch[0] : '';

    // GitHub
    const gitHubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    const gitHub = gitHubMatch ? gitHubMatch[0] : '';

    // Portfolio
    const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:dev|io|me|app)\b/i);
    const portfolio = portfolioMatch ? portfolioMatch[0] : '';

    // Full Name heuristics (first line that isn't a generic header or link)
    let fullName = '';
    for (const line of lines.slice(0, 5)) {
      if (
        !line.includes('@') &&
        !line.toLowerCase().includes('resume') &&
        !line.toLowerCase().includes('curriculum') &&
        !line.toLowerCase().includes('page') &&
        line.length > 2 &&
        line.length < 40 &&
        /^[a-zA-Z\s.-]+$/.test(line)
      ) {
        fullName = line;
        break;
      }
    }

    return { fullName, email, phone, linkedIn, gitHub, portfolio };
  }

  static extractSkills(text) {
    const extracted = {
      programmingLanguages: [],
      frameworks: [],
      libraries: [],
      databases: [],
      tools: [],
      cloud: [],
      softSkills: []
    };

    for (const [category, keywords] of Object.entries(SKILL_DICTIONARY)) {
      const found = new Set();
      for (const kw of keywords) {
        const cleanKw = kw.replace(/\\b/g, '').replace(/\\/g, '');
        if (this.matchesKeyword(text, cleanKw)) {
          found.add(cleanKw);
        }
      }
      extracted[category] = Array.from(found);
    }

    return extracted;
  }

  /**
   * Whole-word keyword match. Keywords like "C++" and "C#" contain regex
   * metacharacters and end in non-word chars, where \b boundaries fail —
   * so we escape the keyword and use lookarounds instead.
   */
  static matchesKeyword(text, keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\w+#])${escaped}(?![\\w+#])`, 'i').test(text);
  }

  static segmentSections(text) {
    const headings = [
      { key: 'education', regex: /\b(education|academic background|qualification)\b/i },
      { key: 'experience', regex: /\b(experience|work experience|employment history|work history)\b/i },
      { key: 'projects', regex: /\b(projects|personal projects|academic projects|key projects)\b/i },
      { key: 'certifications', regex: /\b(certifications|certificates|licenses)\b/i },
      { key: 'achievements', regex: /\b(achievements|honors|awards|accomplishments)\b/i }
    ];

    const lines = text.split('\n');
    const sections = {};
    let currentKey = null;

    for (const line of lines) {
      const trimmed = line.trim();
      let matchedKey = null;

      for (const h of headings) {
        if (h.regex.test(trimmed) && trimmed.length < 35) {
          matchedKey = h.key;
          break;
        }
      }

      if (matchedKey) {
        currentKey = matchedKey;
        if (!sections[currentKey]) sections[currentKey] = '';
      } else if (currentKey) {
        sections[currentKey] += line + '\n';
      }
    }

    return sections;
  }

  static extractEducation(text) {
    if (!text) return [];
    const degrees = text.match(/(bachelor|master|phd|b\.s|m\.s|b\.e|b\.tech|m\.tech|associate|diploma)[^\n,]*/gi) || [];
    const institutions = text.match(/(university|college|institute|school|academy)[^\n,]*/gi) || [];
    const years = text.match(/\b(19|20)\d{2}\b/g) || [];

    const result = [];
    const count = Math.max(degrees.length, institutions.length, 1);

    for (let i = 0; i < count; i++) {
      if (degrees[i] || institutions[i] || years[i]) {
        result.push({
          degree: (degrees[i] || 'Degree / Qualification').trim(),
          institution: (institutions[i] || 'Educational Institution').trim(),
          graduationYear: years[i] || ''
        });
      }
    }

    return result;
  }

  static extractExperience(text) {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = [];

    let currentItem = null;
    for (const line of lines) {
      const dateMatch = line.match(/(?:\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4}\s*(?:-|–|to)\s*(?:Present|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4})/i);
      
      if (dateMatch || line.match(/(engineer|developer|manager|intern|lead|consultant|analyst|architect)/i)) {
        if (currentItem) items.push(currentItem);
        currentItem = {
          role: line.replace(dateMatch ? dateMatch[0] : '', '').trim() || 'Role',
          company: 'Company / Organization',
          duration: dateMatch ? dateMatch[0].trim() : ''
        };
      }
    }
    if (currentItem) items.push(currentItem);

    return items.slice(0, 5);
  }

  static extractProjects(text) {
    if (!text) return [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const projects = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 3 && line.length < 50 && !line.endsWith('.')) {
        const desc = lines[i + 1] || '';
        const techFound = [];

        const combined = `${line} ${desc}`;
        for (const keywords of Object.values(SKILL_DICTIONARY)) {
          for (const kw of keywords) {
            const cleanKw = kw.replace(/\\b/g, '').replace(/\\/g, '');
            if (this.matchesKeyword(combined, cleanKw)) {
              techFound.push(cleanKw);
            }
          }
        }

        projects.push({
          name: line,
          description: desc,
          technologies: Array.from(new Set(techFound)).slice(0, 5)
        });
        i++;
      }
    }

    return projects.slice(0, 5);
  }

  static extractListItems(text) {
    if (!text) return [];
    return text
      .split('\n')
      .map((l) => l.replace(/^[-•*]\s*/, '').trim())
      .filter((l) => l.length > 3)
      .slice(0, 5);
  }
}

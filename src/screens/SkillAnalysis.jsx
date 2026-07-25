import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto'

// Descriptions and learning outcomes for known gap topics (describe the skill, not the user)
const GAP_DETAILS = {
  'typescript': {
    why: 'Close this gap to write safer, more maintainable frontend and backend code at scale.',
    outcomes: ['Type complex React props and API responses', 'Use generics and utility types confidently', 'Migrate an existing JS project to TS']
  },
  'next.js': {
    why: 'Close this gap to ship production-grade full-stack React applications.',
    outcomes: ['Build SSR and static pages with App Router', 'Implement API routes and server actions', 'Deploy an optimized production build']
  },
  'docker': {
    why: 'Close this gap to package, ship, and run applications reliably anywhere.',
    outcomes: ['Containerize a full-stack application', 'Write multi-stage production Dockerfiles', 'Orchestrate services with Compose']
  },
  'redis': {
    why: 'Close this gap to add fast caching and real-time data layers to your backends.',
    outcomes: ['Implement caching for hot API routes', 'Use pub/sub for real-time features', 'Design TTL and eviction strategies']
  },
  'aws / cloud infrastructure': {
    why: 'Close this gap to deploy and operate applications on production cloud infrastructure.',
    outcomes: ['Deploy services on core AWS primitives', 'Configure IAM roles and permissions', 'Design a basic scalable architecture']
  },
  'system architecture': {
    why: 'Close this gap to design systems that scale beyond a single server.',
    outcomes: ['Design APIs and data models for scale', 'Reason about caching and queues', 'Draw and defend an architecture diagram']
  },
  'ci/cd pipelines': {
    why: 'Close this gap to ship changes quickly and safely with automation.',
    outcomes: ['Set up automated build and test pipelines', 'Add deploy gates and rollbacks', 'Wire status checks into pull requests']
  }
}
const DEFAULT_GAP = {
  why: 'Closing this gap strengthens your fit for your target role.',
  outcomes: ['Build a hands-on project using it', 'Apply it in your existing codebase', 'Add verifiable evidence to GitHub']
}

// Fixed axis order keeps the radar shape stable and comparable between users,
// rather than reshuffling as scores change. Short labels keep the axes readable.
const DOMAIN_ORDER = [
  'Frontend Development',
  'Web Development',
  'Backend Development',
  'Cloud Computing',
  'Data Science',
  'Artificial Intelligence'
]
const DOMAIN_LABELS = {
  'Frontend Development': 'Frontend',
  'Web Development': 'Web',
  'Backend Development': 'Backend',
  'Cloud Computing': 'Cloud',
  'Data Science': 'Data',
  'Artificial Intelligence': 'AI / ML'
}

// Whole-word mention count — substring counting breaks on short names like "R"
const countMentions = (text, skill) => {
  const esc = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (text.match(new RegExp(`(?<![\\w+#])${esc}(?![\\w+#])`, 'gi')) || []).length
}

const statusFor = (fit) =>
  fit >= 90 ? { label: 'Expert', bg: '#ccfbf1', fg: '#0f766e', bar: '#14b8a6' }
  : fit >= 70 ? { label: 'Advanced', bg: '#dcfce7', fg: '#15803d', bar: '#22c55e' }
  : fit >= 45 ? { label: 'Proficient', bg: '#e0e7ff', fg: '#4338ca', bar: '#6366F1' }
  : { label: 'Emerging', bg: '#f1f5f9', fg: '#64748b', bar: '#94a3b8' }

export default function SkillAnalysis() {
  const navigate = useNavigate()
  const radarRef = useRef(null)
  const [twinProfile, setTwinProfile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [gh, setGh] = useState(null)
  const [hasResume, setHasResume] = useState(false)
  const [targetRole, setTargetRole] = useState('')

  useEffect(() => {
    fetch('http://localhost:5001/api/resume/latest?t=' + Date.now())
      .then((r) => r.json())
      .then((r) => {
        setHasResume(Boolean(r.data?.id))
        setExtractedText(r.data?.extracted_text || '')
      })
      .catch(() => setHasResume(false))

    fetch('http://localhost:5001/api/twin/profile')
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 'success' && r.data) {
          setTwinProfile(r.data)
          setTargetRole((r.data.recommendedRoles || [])[0] || 'Software Engineer')
        }
      })
      .catch(() => {})

    fetch('http://localhost:5001/api/resume/analyze')
      .then((r) => r.json())
      .then((r) => setAnalysis(r.data || null))
      .catch(() => {})

    fetch('http://localhost:5001/api/github/insights?username=rounithrathesh-coder')
      .then((r) => r.json())
      .then((r) => setGh(r?.data || r || null))
      .catch(() => {})
  }, [])

  const readiness = hasResume ? (twinProfile?.careerReadiness || 0) : 0
  const readinessLabel = readiness >= 70 ? 'Above average' : readiness >= 50 ? 'On track' : 'Building'
  const domainScores = twinProfile?.domainScores || []
  // Same data, fixed axis order — keeps the radar shape stable as scores change
  const radarDomains = DOMAIN_ORDER
    .map((name) => domainScores.find((d) => d.domain === name))
    .filter(Boolean)
  const coveredDomains = domainScores.filter((d) => d.evidence > 0).length
  const roles = twinProfile?.recommendedRoles || []
  const strengths = (twinProfile?.strengths || []).slice(0, 3)
  const skillGaps = twinProfile?.skillGaps || []

  // Readiness breakdown: real skills ranked by how often the resume mentions them,
  // normalized against the strongest; gaps appended with zero evidence
  const skillsObj = analysis?.skills || {}
  const allSkills = [
    ...(skillsObj.programmingLanguages || []),
    ...(skillsObj.frameworks || []),
    ...(skillsObj.libraries || []),
    ...(skillsObj.databases || []),
    ...(skillsObj.tools || [])
  ]
  const mentioned = allSkills
    .map((s) => ({ name: s, evidence: countMentions(extractedText, s) }))
    .sort((a, b) => b.evidence - a.evidence)
  const maxEvidence = Math.max(1, ...mentioned.map((m) => m.evidence))
  const breakdownRows = [
    ...mentioned.slice(0, 4).map((m) => {
      const fit = Math.round((m.evidence / maxEvidence) * 100)
      return { ...m, fit, status: statusFor(fit) }
    }),
    ...skillGaps.slice(0, 1).map((g) => ({
      name: g, evidence: 0, fit: 0,
      status: { label: 'Gap', bg: '#ffedd5', fg: '#c2410c', bar: '#f97316' }
    }))
  ]

  // Momentum from real GitHub signals
  const commitActivity = gh?.commitActivity || []
  const prevCommits = commitActivity.length >= 2 ? commitActivity[commitActivity.length - 2].commits : 0
  const curCommits = commitActivity.length >= 1 ? commitActivity[commitActivity.length - 1].commits : 0
  const commitDelta = prevCommits > 0 ? Math.round(((curCommits - prevCommits) / prevCommits) * 100) : null
  const activeRepos = (gh?.topRepos || []).filter(
    (r) => r.updatedAt && Date.now() - new Date(r.updatedAt).getTime() < 30 * 86400000
  ).length
  const totalStars = gh?.stats?.totalStars ?? null

  const topGap = skillGaps[0]
  const gapInfo = topGap ? (GAP_DETAILS[topGap.toLowerCase()] || DEFAULT_GAP) : DEFAULT_GAP

  // Capability radar: your real domain evidence vs a flat role benchmark
  useEffect(() => {
    let chart = null
    if (radarRef.current && radarDomains.length >= 3) {
      const ctx = radarRef.current.getContext('2d')
      const fill = ctx.createLinearGradient(0, 0, 0, 300)
      fill.addColorStop(0, 'rgba(99, 102, 241, 0.28)')
      fill.addColorStop(1, 'rgba(124, 58, 237, 0.10)')

      chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: radarDomains.map((d) => DOMAIN_LABELS[d.domain] || d.domain),
          datasets: [
            {
              label: 'You',
              data: radarDomains.map((d) => d.score),
              borderColor: '#6366F1',
              backgroundColor: fill,
              borderWidth: 2.5,
              pointBackgroundColor: '#6366F1',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4.5,
              pointHoverRadius: 6.5,
              pointHoverBorderWidth: 3
            },
            {
              label: 'Target role',
              data: radarDomains.map(() => 85),
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderDash: [5, 5],
              pointBackgroundColor: '#f59e0b',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              pointRadius: 2.5,
              pointHoverRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: 4 },
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f1024',
              padding: 11,
              cornerRadius: 8,
              titleFont: { size: 12.5, family: 'Inter', weight: '600' },
              bodyFont: { size: 12, family: 'Inter' },
              displayColors: false,
              callbacks: {
                title: (items) => radarDomains[items[0].dataIndex].domain,
                label: (item) => {
                  if (item.datasetIndex === 1) return 'Target benchmark · 85'
                  const d = radarDomains[item.dataIndex]
                  return d.evidence === 0
                    ? 'No evidence found yet'
                    : `Coverage ${d.score} · ${d.evidence} matching skill${d.evidence === 1 ? '' : 's'}`
                }
              }
            }
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 25 },
              grid: { color: '#e8ebf3', circular: true },
              angleLines: { color: '#e8ebf3' },
              pointLabels: {
                font: { size: 11.5, family: 'Inter', weight: '600' },
                color: '#475569',
                padding: 8
              }
            }
          }
        }
      })
    }
    return () => { if (chart) chart.destroy() }
  }, [radarDomains])

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Header */}
      <div className="page-h" style={{ marginBottom: 0 }}>
        <div>
          <h1>Skill intelligence</h1>
          <p>See how your skills compare to the target role and what to focus on next.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="skill2-role-select">
            <i className="ti ti-target" />
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
              {(roles.length > 0 ? roles : ['Software Engineer']).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="skill2-readiness-chip">
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="17" cy="17" r="14" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(readiness / 100) * 88} 88`} transform="rotate(-90 17 17)"
              />
              <text x="17" y="21" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0f172a">{readiness}%</text>
            </svg>
            <div>
              <b>Role readiness</b>
              <span>{hasResume ? readinessLabel : 'Upload resume'}</span>
            </div>
          </div>
          <button className="btn pri" onClick={() => navigate('/learning-path')}>
            <i className="ti ti-trending-up" /> View growth plan
          </button>
        </div>
      </div>

      {!hasResume ? (
        <div className="card pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--indigo-soft)', color: 'var(--indigo)', display: 'grid', placeItems: 'center', fontSize: '28px', margin: '0 auto 14px' }}>
            <i className="ti ti-radar-2" />
          </div>
          <h3 style={{ fontSize: '17px' }}>No skill intelligence yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--ink3)', margin: '6px 0 16px' }}>
            Upload your resume and your skill map will be built from real extracted evidence.
          </p>
          <button className="btn pri" onClick={() => navigate('/resume')}>
            <i className="ti ti-file-upload" /> Upload Resume
          </button>
        </div>
      ) : (
        <>
          {/* Row 1: radar + readiness breakdown */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1.6fr', gap: '18px', alignItems: 'stretch' }}>
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div className="sec-t" style={{ marginBottom: 0 }}>
                  <i className="ti ti-chart-radar" /><h3>Capability radar</h3>
                </div>
                <i className="ti ti-info-circle" style={{ color: 'var(--ink3)' }} title="You = evidence extracted from your resume & repos. Target = role benchmark." />
              </div>
              <div className="legend" style={{ marginTop: 0, marginBottom: '8px' }}>
                <span><i style={{ background: '#6366F1' }} /> You</span>
                <span><i style={{ background: '#f59e0b' }} /> Target role</span>
              </div>
              <div style={{ flex: 1, minHeight: '290px', position: 'relative' }}>
                {radarDomains.length >= 3
                  ? <canvas ref={radarRef} />
                  : <p style={{ fontSize: '12.5px', color: 'var(--ink3)', textAlign: 'center', paddingTop: '110px' }}>Not enough evidence yet for a domain map.</p>}
              </div>

              {radarDomains.length >= 3 && (
                <div className="skill2-radar-stats">
                  <div>
                    <b>{DOMAIN_LABELS[domainScores[0]?.domain] || '—'}</b>
                    <span>Strongest domain</span>
                  </div>
                  <div>
                    <b>{coveredDomains}<small>/{domainScores.length}</small></b>
                    <span>Domains covered</span>
                  </div>
                  <div>
                    <b>{domainScores.reduce((sum, d) => sum + d.evidence, 0)}</b>
                    <span>Evidence points</span>
                  </div>
                </div>
              )}

              <span style={{ fontSize: '11px', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                <i className="ti ti-info-circle" /> Scores are normalized · target is a role benchmark
              </span>
            </div>

            <div className="card pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div className="sec-t" style={{ marginBottom: 0 }}>
                  <i className="ti ti-list-details" /><h3>Readiness breakdown</h3>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--indigo)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/resume')}>
                  View all skills
                </span>
              </div>

              <div className="skill2-table-head">
                <span>Skill</span><span>Role fit</span><span>Evidence</span><span>Status</span>
              </div>
              {breakdownRows.map((row) => (
                <div className="skill2-table-row" key={row.name}>
                  <span className="skill2-name"><i className="ti ti-code" style={{ color: 'var(--ink3)' }} /> {row.name}</span>
                  <span className="skill2-fit">
                    <span className="skill2-fit-bar"><span style={{ width: `${row.fit}%`, background: row.status.bar }} /></span>
                    <b style={{ color: row.status.bar }}>{row.fit}%</b>
                  </span>
                  <span className="skill2-evidence">{row.evidence}</span>
                  <span><span className="skill2-status" style={{ background: row.status.bg, color: row.status.fg }}>{row.status.label}</span></span>
                </div>
              ))}
              <span style={{ fontSize: '11px', color: 'var(--ink3)', display: 'block', marginTop: '10px' }}>
                Role fit is normalized to your strongest skill · evidence = mentions found in your resume
              </span>
            </div>
          </div>

          {/* Row 2: highest-impact skill + strengths & momentum */}
          <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '18px', alignItems: 'stretch' }}>
            {/* Highest-impact gap card */}
            <div className="card skill2-impact">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div className="skill2-rocket"><i className="ti ti-rocket" /></div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--ink2)' }}>Your next highest-impact skill</span>
                  <h3 style={{ fontSize: '19px', marginTop: '2px' }}>{topGap || 'All core gaps closed'}</h3>
                </div>
                <div className="skill2-ct">
                  <div><span>Current</span><b style={{ color: '#c2410c' }}>0%</b></div>
                  <div><span>Target</span><b>80%</b></div>
                </div>
              </div>

              <div>
                <b style={{ fontSize: '13px' }}>Why it matters</b>
                <p style={{ fontSize: '12.5px', color: 'var(--ink2)', margin: '4px 0 0' }}>{gapInfo.why}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '18px', borderTop: '1px solid rgba(194, 120, 3, 0.15)', paddingTop: '14px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink2)' }}>Estimated time</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 700, fontSize: '13.5px' }}>
                    <i className="ti ti-calendar" style={{ color: '#c2410c' }} /> 2–3 weeks
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink2)' }}>Top outcomes</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {gapInfo.outcomes.map((o) => (
                      <span key={o} style={{ fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-check" style={{ color: '#16a34a' }} /> {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn pri" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={() => navigate('/learning-path')}>
                Start learning path <i className="ti ti-arrow-right" />
              </button>
            </div>

            {/* Strengths + momentum */}
            <div className="card pad" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="sec-t" style={{ marginBottom: '12px' }}>
                  <i className="ti ti-trophy" /><h3 style={{ fontSize: '14.5px' }}>Strengths to leverage</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {strengths.length > 0 ? strengths.map((s) => (
                    <div key={s} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <i className="ti ti-circle-check" style={{ color: '#16a34a', fontSize: '16px', marginTop: '1px' }} />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>{s}</span>
                    </div>
                  )) : (
                    <span style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>No strengths inferred yet.</span>
                  )}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '20px' }}>
                <div className="sec-t" style={{ marginBottom: '12px' }}>
                  <i className="ti ti-trending-up" /><h3 style={{ fontSize: '14.5px' }}>Recent momentum</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="skill2-momentum">
                    <span className="skill2-mo-icon" style={{ background: '#e6f6ec', color: '#16a34a' }}><i className="ti ti-arrow-up" /></span>
                    <div>
                      <b>{commitDelta !== null ? `${commitDelta >= 0 ? '+' : ''}${commitDelta}%` : `${curCommits} commits`}</b>
                      <span>GitHub commits · last 30 days</span>
                    </div>
                  </div>
                  <div className="skill2-momentum">
                    <span className="skill2-mo-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}><i className="ti ti-folder" /></span>
                    <div>
                      <b>{activeRepos}</b>
                      <span>Repos active · this month</span>
                    </div>
                  </div>
                  {totalStars !== null && (
                    <div className="skill2-momentum">
                      <span className="skill2-mo-icon" style={{ background: '#fef3c7', color: '#b45309' }}><i className="ti ti-star" /></span>
                      <div>
                        <b>{totalStars}</b>
                        <span>Stars across repositories</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: growth roadmap */}
          <div className="card pad">
            <div className="sec-t" style={{ marginBottom: '18px' }}>
              <i className="ti ti-route" /><h3>Your 3-step growth roadmap</h3>
            </div>
            <div className="skill2-roadmap">
              <div className="skill2-step done">
                <div className="skill2-step-head">
                  <span className="skill2-step-dot done"><i className="ti ti-check" /></span>
                  <span className="skill2-step-label" style={{ color: '#16a34a' }}>Completed</span>
                </div>
                <b>Foundations & Core Skills</b>
                <p>{allSkills.length} skills verified from your resume{domainScores[0] ? ` — strongest in ${domainScores[0].domain}` : ''}.</p>
                <span className="chip" style={{ background: '#e6f6ec', color: '#16a34a', fontSize: '10.5px' }}>Completed</span>
              </div>

              <div className="skill2-step current">
                <div className="skill2-step-head">
                  <span className="skill2-step-dot current">2</span>
                  <span className="skill2-step-label" style={{ color: 'var(--indigo)' }}>In progress</span>
                </div>
                <b>{topGap ? `Close the ${topGap} gap` : 'Deepen your strongest domain'}</b>
                <p>{gapInfo.why}</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="chip" style={{ background: 'var(--indigo-soft)', color: 'var(--indigo)', fontSize: '10.5px' }}>2–3 weeks</span>
                  <span className="chip" style={{ background: '#fef3c7', color: '#b45309', fontSize: '10.5px' }}>High impact</span>
                </div>
              </div>

              <div className="skill2-step">
                <div className="skill2-step-head">
                  <span className="skill2-step-dot">3</span>
                  <span className="skill2-step-label">Upcoming</span>
                </div>
                <b>{skillGaps[1] ? `Learn ${skillGaps[1]}` : 'Scale & Leadership'}</b>
                <p>{skillGaps[1] ? (GAP_DETAILS[skillGaps[1].toLowerCase()] || DEFAULT_GAP).why : 'Design scalable systems and lead technical initiatives.'}</p>
                <span className="chip" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '10.5px' }}>Not started</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto'
import Ring from '../components/Ring.jsx'

// Relative time label for real activity timestamps.
// SQLite CURRENT_TIMESTAMP is UTC without a zone marker ("2026-07-25 01:23:45"),
// so normalize to ISO-UTC before parsing to avoid a timezone offset.
function timeAgo(dateStr) {
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(String(dateStr))
    ? dateStr
    : String(dateStr).replace(' ', 'T') + 'Z'
  const then = new Date(iso)
  if (isNaN(then)) return ''
  const mins = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

// Descriptions/icons for known skill-gap topics (describes the skill, not the user)
const GAP_INFO = {
  'typescript': { desc: 'Advanced typing, generics, utility types', icon: 'ti-brand-typescript' },
  'next.js': { desc: 'SSR, routing, and full-stack React', icon: 'ti-brand-nextjs' },
  'docker': { desc: 'Containers, images, and deployment', icon: 'ti-brand-docker' },
  'mlops / docker': { desc: 'Model packaging, deployment, and ops', icon: 'ti-brand-docker' },
  'redis': { desc: 'Caching and fast data access', icon: 'ti-database' },
  'aws / cloud infrastructure': { desc: 'Core services, IAM, and architecture', icon: 'ti-cloud' },
  'system architecture': { desc: 'Design scalable systems and APIs', icon: 'ti-sitemap' },
  'ci/cd pipelines': { desc: 'Automated build, test, and deploy', icon: 'ti-refresh' },
  'pytorch': { desc: 'Deep learning model development', icon: 'ti-brain' }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const momentumRef = useRef(null)
  const [dbData, setDbData] = useState(null)
  const [twinProfile, setTwinProfile] = useState(null)
  const [latestResume, setLatestResume] = useState(null)
  const [jobMatches, setJobMatches] = useState([])
  const [commitActivity, setCommitActivity] = useState([])

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard')
      .then((res) => res.json())
      .then((data) => setDbData(data))
      .catch((err) => console.warn('Failed to fetch dashboard:', err))

    fetch('http://localhost:5001/api/resume/latest')
      .then((res) => res.json())
      .then((res) => setLatestResume(res.data || null))
      .catch((err) => console.warn('Failed to fetch latest resume:', err))

    fetch('http://localhost:5001/api/jobs/matched')
      .then((res) => res.json())
      .then((res) => setJobMatches(Array.isArray(res.data) ? res.data.slice(0, 2) : []))
      .catch((err) => console.warn('Failed to fetch job matches:', err))

    // Real GitHub commit history drives the momentum chart
    fetch('http://localhost:5001/api/github/insights?username=rounithrathesh-coder')
      .then((res) => res.json())
      .then((res) => setCommitActivity(res?.data?.commitActivity || res?.commitActivity || []))
      .catch((err) => console.warn('Failed to fetch GitHub activity:', err))

    fetch('http://localhost:5001/api/twin/profile')
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) setTwinProfile(res.data)
      })
      .catch((err) => console.warn('Failed to fetch twin profile:', err))
  }, [])

  // All values derived from real resume analysis — zero/gated when no resume
  const hasResume = !!dbData?.hasResume
  const readiness = hasResume ? (twinProfile?.careerReadiness || 0) : 0
  const completeness = hasResume ? (twinProfile?.confidence || 0) : 0
  const careerPotential = !hasResume ? 'Pending'
    : twinProfile?.experienceLevel === 'Advanced' ? 'High'
    : twinProfile?.experienceLevel === 'Intermediate' ? 'Growing'
    : 'Emerging'
  const skillGaps = hasResume ? (twinProfile?.skillGaps || []).slice(0, 3) : []
  const primaryDomain = twinProfile?.primaryDomain
  const firstName = (dbData?.livingProfile?.name || 'Rounith R.').split(' ')[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Month-over-month change computed from actual commit counts
  const momentumDelta = (() => {
    if (commitActivity.length < 2) return null
    const prev = commitActivity[commitActivity.length - 2].commits
    const cur = commitActivity[commitActivity.length - 1].commits
    if (!prev) return null
    return Math.round(((cur - prev) / prev) * 100)
  })()

  // Momentum line chart (real GitHub commits, last 6 months)
  useEffect(() => {
    let chart = null
    if (momentumRef.current && commitActivity.length > 0) {
      const ctx = momentumRef.current.getContext('2d')
      const grad = ctx.createLinearGradient(0, 0, 0, 170)
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.28)')
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)')

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: commitActivity.map((m) => m.month),
          datasets: [
            {
              label: 'Commits',
              data: commitActivity.map((m) => m.commits),
              borderColor: '#6366F1',
              backgroundColor: grad,
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 3.5,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#6366F1',
              pointBorderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#eef0f7' },
              ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 3 }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 10 } }
            }
          }
        }
      })
    }
    return () => { if (chart) chart.destroy() }
  }, [commitActivity])

  return (
    <div className="dash2 fade">
      {/* Greeting */}
      <div className="dash2-greet">
        <h1>{greeting}, {firstName}! 👋</h1>
        <p>Here's your career overview and suggested next steps.</p>
      </div>

      {/* Career momentum hero */}
      <div className="card dash2-hero">
        <div className="dash2-hero-head">
          <i className="ti ti-trending-up" /> Career momentum
        </div>
        <div className="dash2-hero-body">
          <div className="dash2-hero-ring">
            <Ring
              value={readiness}
              size={132}
              thickness={12}
              color="#6366F1"
              track="#e8eaf6"
              inner="#fff"
              label="Readiness"
              valueColor="#0f172a"
              labelColor="#94a3b8"
              suffix="%"
            />
          </div>

          <div className="dash2-hero-copy">
            {hasResume ? (
              <>
                <h3>You're on the right track!</h3>
                <p>
                  Keep building in <b>{primaryDomain || 'your domain'}</b>
                  {skillGaps[0] ? <> and <b>{skillGaps[0]}</b></> : null} to unlock top opportunities.
                </p>
                <button className="btn pri" onClick={() => navigate('/learning-path')}>
                  Continue learning <i className="ti ti-arrow-right" />
                </button>
              </>
            ) : (
              <>
                <h3>Let's get you started</h3>
                <p>Upload your resume and your twin will map your readiness from real evidence.</p>
                <button className="btn pri" onClick={() => navigate('/resume')}>
                  Upload resume <i className="ti ti-arrow-right" />
                </button>
              </>
            )}
          </div>

          <div className="dash2-chart-wrap">
            {momentumDelta !== null && (
              <span className={`dash2-chart-chip ${momentumDelta >= 0 ? '' : 'down'}`}>
                <i className={`ti ${momentumDelta >= 0 ? 'ti-trending-up' : 'ti-trending-down'}`} />
                {Math.abs(momentumDelta)}% vs last month
              </span>
            )}
            <div className="dash2-chart-canvas">
              {commitActivity.length > 0
                ? <canvas ref={momentumRef} />
                : <p className="dash2-chart-empty">GitHub activity unavailable</p>}
            </div>
            <span className="dash2-chart-cap">GitHub commits · last 6 months</span>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="dash2-kpis">
        <div className="card dash2-kpi">
          <div className="tile tile-purple"><i className="ti ti-user-check" /></div>
          <div className="dash2-kpi-body">
            <span className="lbl">Profile completeness</span>
            <div className="val">{completeness}%</div>
            <div className="bar"><div style={{ width: `${completeness}%`, background: '#6366F1' }} /></div>
            <span className="sub">{hasResume ? 'Keep it up!' : 'Upload resume to start'}</span>
          </div>
        </div>

        <div className="card dash2-kpi">
          <div className="tile tile-green"><i className="ti ti-chart-line" /></div>
          <div className="dash2-kpi-body">
            <span className="lbl">Overall skill score</span>
            <div className="val">{readiness} <small>/100</small></div>
            <div className="bar"><div style={{ width: `${readiness}%`, background: '#16a34a' }} /></div>
            <span className="sub">{hasResume ? 'Computed from resume evidence' : 'Pending upload'}</span>
          </div>
        </div>

        <div className="card dash2-kpi">
          <div className="tile tile-blue"><i className="ti ti-trending-up" /></div>
          <div className="dash2-kpi-body">
            <span className="lbl">Career potential</span>
            <div className="val">{careerPotential}</div>
            <span className="sub">{hasResume ? 'Strong potential for growth' : '0 evidence points'}</span>
            {hasResume && <span className="chip-keep">Keep growing</span>}
          </div>
        </div>
      </div>

      {/* Bottom 3-column row */}
      <div className="dash2-3col">
        {/* Skill gap roadmap */}
        <div className="card dash2-panel">
          <div className="dash2-panel-h">
            <h3>Skill gap roadmap</h3>
            <span className="lnk" onClick={() => navigate('/skills')}>View full analysis</span>
          </div>
          <span className="dash2-sub">Top skills to focus on</span>

          {skillGaps.length > 0 ? (
            <>
              <div className="dash2-panel-list">
                {skillGaps.map((gap, idx) => {
                  const info = GAP_INFO[gap.toLowerCase()] || { desc: 'Recommended for your target domain', icon: 'ti-code' }
                  return (
                    <div className="gap-item" key={gap}>
                      <div className="gap-icon"><i className={`ti ${info.icon}`} /></div>
                      <div>
                        <b>{gap}</b>
                        <p>{info.desc}</p>
                      </div>
                      <span className={`gap-priority ${idx < 2 ? 'high' : 'med'}`}>
                        {idx < 2 ? 'High priority' : 'Medium priority'}
                      </span>
                    </div>
                  )
                })}
              </div>
              <button className="btn dash2-panel-btn" onClick={() => navigate('/learning-path')}>
                <i className="ti ti-book" /> View learning path
              </button>
            </>
          ) : (
            <p className="dash2-empty">Upload your resume and your twin will map the skill gaps for your target domain.</p>
          )}
        </div>

        {/* Recommended jobs */}
        <div className="card dash2-panel">
          <div className="dash2-panel-h">
            <h3>Recommended for you</h3>
            <span className="lnk" onClick={() => navigate('/job-matches')}>View all matches</span>
          </div>

          {hasResume && jobMatches.length > 0 ? (
            <>
              <div className="dash2-panel-list">
                {jobMatches.map((job) => (
                  <div className="job2-card" key={job.id} onClick={() => navigate('/job-matches')}>
                    <div className="job2-top">
                      <div className="job2-logo" style={{ background: job.logoBg || '#eef2ff', color: job.logoColor || '#6366F1' }}>
                        <i className={`ti ${job.logoIcon || 'ti-briefcase'}`} />
                      </div>
                      <div>
                        <h4>{job.title}</h4>
                        <span className="job2-meta">{job.company}</span>
                        <span className="job2-meta"> · {job.location}{job.type ? ` · ${job.type}` : ''}</span>
                      </div>
                      <div className="job2-match">{job.matchPct}%<small>Match</small></div>
                    </div>
                    {Array.isArray(job.skills) && job.skills.length > 0 && (
                      <div className="job2-tags">
                        {job.skills.slice(0, 4).map((sk) => <span key={sk}>{sk}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn dash2-panel-btn" onClick={() => navigate('/job-matches')}>
                <i className="ti ti-briefcase" /> Explore more jobs
              </button>
            </>
          ) : (
            <p className="dash2-empty">
              {hasResume ? 'No job matches available right now.' : 'Upload your resume to see personalized job matches.'}
            </p>
          )}
        </div>

        {/* Recent activity */}
        <div className="card dash2-panel">
          <div className="dash2-panel-h">
            <h3>Recent activity</h3>
            <span className="lnk" onClick={() => navigate('/resume')}>View all</span>
          </div>

          {latestResume ? (
            <div className="dash2-panel-list act2-list">
              <div className="act2-item">
                <div className="act2-icon" style={{ background: '#e6f6ec', color: '#16a34a' }}><i className="ti ti-file-upload" /></div>
                <div>
                  <b>Resume uploaded</b>
                  <p>{latestResume.original_filename}</p>
                  <small>{timeAgo(latestResume.uploaded_at)}</small>
                </div>
              </div>
              <div className="act2-item">
                <div className="act2-icon" style={{ background: '#eef2ff', color: '#6366F1' }}><i className="ti ti-refresh" /></div>
                <div>
                  <b>AI Twin profile regenerated</b>
                  <p>{twinProfile?.headline || 'Profile rebuilt from resume evidence'}</p>
                  <small>{timeAgo(latestResume.uploaded_at)}</small>
                </div>
              </div>
              {(twinProfile?.topSkills || []).length > 0 && (
                <div className="act2-item">
                  <div className="act2-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="ti ti-plus" /></div>
                  <div>
                    <b>{twinProfile.topSkills.length} skills extracted from resume</b>
                    <p>{twinProfile.topSkills.join(', ')}</p>
                    <small>{timeAgo(latestResume.uploaded_at)}</small>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="dash2-empty">No activity yet — upload your resume to get started.</p>
          )}
        </div>
      </div>

      {/* Privacy footer */}
      <p className="dash2-privacy">
        <i className="ti ti-shield-check" /> Your data is private and secure. We'll never share it.
        <span className="dash2-privacy-link" onClick={() => navigate('/privacy')}>Read our Privacy Policy →</span>
      </p>
    </div>
  )
}

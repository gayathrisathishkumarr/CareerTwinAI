import React, { useState, useEffect, useCallback } from 'react'
import Ring from '../components/Ring.jsx'

// Language color palette
const LANG_COLORS = [
  '#f59e0b', '#4f46e5', '#0ea5e9', '#10b981', '#ef4444',
  '#8b5cf6', '#f97316', '#06b6d4', '#84cc16', '#ec4899'
]

export default function GitHubSync() {
  const [isManualInput, setIsManualInput] = useState(false)
  const [inputUrl, setInputUrl] = useState('')
  const [manualUsername, setManualUsername] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [insights, setInsights] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)

  const fetchInsights = useCallback((username = '') => {
    setLoading(true)
    setError('')
    const url = username
      ? `http://localhost:5001/api/github/insights?username=${encodeURIComponent(username)}`
      : 'http://localhost:5001/api/github/insights'

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false)
        if (res.status === 'success' && res.data) {
          setInsights(res.data)
          setLastSynced(new Date())
        } else {
          setError(res.message || 'Failed to load GitHub insights.')
        }
      })
      .catch(() => {
        setLoading(false)
        setError('Could not reach the backend server. Make sure it is running on port 5001.')
      })
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  const handleSaveManualUrl = (e) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      const cleanUrl = inputUrl.trim().replace(/^https?:\/\//, '').replace(/^www\./, '')
      const user = cleanUrl.startsWith('github.com/')
        ? cleanUrl.split('github.com/')[1].split('/')[0]
        : cleanUrl.split('/')[0]
      setManualUsername(user)
      setIsManualInput(false)
      setInputUrl('')
      fetchInsights(user)
    }
  }

  const profile = insights?.profile
  const stats = insights?.stats
  const languages = insights?.languages || []
  const commitActivity = insights?.commitActivity || []
  const topRepos = insights?.topRepos || []
  const totalCommits = commitActivity.reduce((s, m) => s + m.commits, 0)
  const maxCommits = Math.max(...commitActivity.map((m) => m.commits), 1)

  const timeSince = lastSynced
    ? Math.round((Date.now() - lastSynced.getTime()) / 1000) < 60
      ? 'just now'
      : `${Math.round((Date.now() - lastSynced.getTime()) / 60000)} min ago`
    : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Header */}
      <div className="page-h">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>GitHub Sync</h1>
            {profile && (
              <span className="chip ver" style={{ fontSize: '11.5px' }}>
                <i className="ti ti-check" /> Extracted from Resume
              </span>
            )}
          </div>
          <p>
            {profile
              ? `Showing live data for @${profile.username}`
              : 'We extracted your GitHub profile from your resume and analyzed your code signals.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" onClick={() => fetchInsights(manualUsername || undefined)} disabled={loading}>
            <i className={`ti ${loading ? 'ti-loader-2 ti-spin' : 'ti-refresh'}`} />
            {loading ? 'Syncing…' : 'Sync Now'}
          </button>
          <button className="btn pri" onClick={() => setIsManualInput(!isManualInput)}>
            <i className="ti ti-brand-github" /> {isManualInput ? 'Cancel' : 'Connect Different Account'}
          </button>
        </div>
      </div>

      {/* Manual Input Bar */}
      {isManualInput && (
        <form
          onSubmit={handleSaveManualUrl}
          className="card pad"
          style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc' }}
        >
          <i className="ti ti-brand-github" style={{ fontSize: '20px', color: 'var(--indigo)' }} />
          <input
            type="text"
            placeholder="e.g. github.com/your-username"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '13.5px',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn pri">
            Load Profile
          </button>
        </form>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div
          className="card pad"
          style={{ background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <i className="ti ti-alert-circle" style={{ color: '#ef4444', fontSize: '20px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="card pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px' }}>
          <i className="ti ti-loader-2 ti-spin" style={{ fontSize: '24px', color: 'var(--indigo)' }} />
          <span style={{ fontSize: '14px', color: 'var(--ink2)' }}>Fetching live GitHub data…</span>
        </div>
      )}

      {!loading && insights && (
        <>
          {/* Section 1: GitHub Profile Card */}
          <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="chip ver" style={{ background: '#e6f6ec', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
                <i className="ti ti-circle-check-filled" /> GitHub Connected
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>
                Last Synced: <strong style={{ color: '#16a34a' }}>● {timeSince}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              {/* Avatar & Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: '2px solid var(--line)',
                      boxShadow: '0 4px 12px rgba(15,16,36,0.15)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#0f1024', color: '#fff', display: 'grid',
                    placeItems: 'center', fontSize: '28px'
                  }}>
                    <i className="ti ti-brand-github" />
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
                      {profile?.name || profile?.username}
                    </h3>
                    <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>
                      {manualUsername ? 'Manual Entry' : 'Extracted from resume'}
                    </span>
                  </div>
                  {profile?.bio && (
                    <p style={{ fontSize: '12.5px', color: 'var(--ink2)', marginTop: '2px', maxWidth: '320px' }}>{profile.bio}</p>
                  )}
                  <a
                    href={profile?.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '13px', color: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}
                  >
                    github.com/{profile?.username} <i className="ti ti-external-link" style={{ fontSize: '12px' }} />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                {[
                  { label: 'Repositories', value: stats?.totalRepos ?? '—' },
                  { label: 'Followers', value: profile?.followers ?? '—' },
                  { label: 'Following', value: profile?.following ?? '—' },
                  { label: 'Stars Earned', value: stats?.totalStars ?? '—' }
                ].map((item, idx, arr) => (
                  <React.Fragment key={item.label}>
                    <div style={{ textAlign: 'center' }}>
                      <span className="eyebrow" style={{ fontSize: '11px' }}>{item.label}</span>
                      <b style={{ display: 'block', fontSize: '18px', color: 'var(--ink)', marginTop: '2px' }}>{item.value}</b>
                    </div>
                    {idx < arr.length - 1 && <div style={{ width: '1px', height: '30px', background: 'var(--line)' }} />}
                  </React.Fragment>
                ))}
                <a
                  href={profile?.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ padding: '8px 14px', fontSize: '12.5px', marginLeft: '10px' }}
                >
                  Open GitHub <i className="ti ti-external-link" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2 & 3: AI Coding Summary + Language Breakdown */}
          <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* AI Coding Summary */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="sec-t" style={{ marginBottom: '18px' }}>
                  <i className="ti ti-sparkles" style={{ color: 'var(--indigo)' }} />
                  <h3>AI Coding Summary</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
                  <Ring
                    value={Math.min(100, Math.round(30 + (stats?.totalRepos || 0) * 1.5 + (stats?.totalStars || 0) * 0.5))}
                    size={135}
                    thickness={12}
                    color="var(--indigo)"
                    track="var(--line)"
                    inner="#fff"
                    label="Overall Score"
                    valueColor="var(--indigo)"
                    labelColor="var(--ink3)"
                    suffix="/100"
                  />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--indigo)', marginBottom: '6px' }}>
                      {languages[0]?.language || 'Developer'} Specialist
                    </h4>
                    <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '16px' }}>
                      {[1,2,3,4].map(i => <i key={i} className="ti ti-star-filled" />)}
                      <i className="ti ti-star" style={{ color: '#d1d5db' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12.5px' }}>
                      <div>
                        <span className="eyebrow" style={{ fontSize: '10.5px', color: '#16a34a', marginBottom: '8px', display: 'block' }}>
                          Top Strengths
                        </span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--ink2)' }}>
                          {languages.slice(0, 4).map((l) => (
                            <li key={l.language} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a' }} /> {l.language}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', marginBottom: '8px', display: 'block' }}>
                          Top Repos
                        </span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--ink2)' }}>
                          {topRepos.slice(0, 4).map((r) => (
                            <li key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                              <i className="ti ti-git-branch" style={{ color: 'var(--indigo)', flexShrink: 0 }} />
                              <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--ink2)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {r.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="card pad">
              <div className="sec-t" style={{ marginBottom: '18px' }}>
                <i className="ti ti-code" style={{ color: 'var(--indigo)' }} />
                <h3>Language Breakdown</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {languages.length > 0 ? languages.map((lang, idx) => (
                  <div key={lang.language}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: LANG_COLORS[idx % LANG_COLORS.length] }} />
                        {lang.language}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>{lang.percent}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${lang.percent}%`, height: '100%', background: LANG_COLORS[idx % LANG_COLORS.length], borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--ink3)', fontSize: '13px' }}>No language data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4, 5, 6: AI Insights, Coding Activity, Recommended Steps */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1.1fr 1fr', gap: '20px' }}>
            {/* AI Insights */}
            <div className="card pad">
              <div className="sec-t" style={{ marginBottom: '16px' }}>
                <i className="ti ti-bulb" style={{ color: 'var(--indigo)' }} />
                <h3>AI Insights</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.5 }}>
                {[
                  `${profile?.name || profile?.username} has ${stats?.totalRepos} public repositories with ${stats?.totalStars} stars earned.`,
                  languages[0] ? `Primary language is ${languages[0].language} (${languages[0].percent}% of all code).` : 'Upload a resume to detect primary language.',
                  totalCommits > 0 ? `${totalCommits} commits tracked over the last 6 months.` : 'Commit history being analyzed.',
                  `${stats?.totalForks || 0} forks across repositories — others are building on your work.`,
                  profile?.location ? `Based in ${profile.location}.` : 'Maintains clean Git commit histories and documentation.'
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coding Activity Chart */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="sec-t" style={{ marginBottom: '16px' }}>
                  <i className="ti ti-chart-bar" style={{ color: 'var(--indigo)' }} />
                  <h3>Coding Activity <small style={{ fontWeight: 400, color: 'var(--ink3)' }}>(Last 6 Months)</small></h3>
                </div>
                <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  {commitActivity.map((item, idx) => {
                    const pct = maxCommits > 0 ? Math.max(5, (item.commits / maxCommits) * 100) : 5
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                        <div
                          title={`${item.commits} commits`}
                          style={{
                            width: '100%',
                            maxWidth: '24px',
                            height: `${pct}%`,
                            background: idx % 2 === 0 ? 'var(--indigo)' : 'linear-gradient(180deg, #7c3aed, #4f46e5)',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.5s ease'
                          }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--ink2)' }}>
                <span><strong style={{ color: 'var(--indigo)' }}>{totalCommits}</strong> total commits</span>
                <span style={{ color: '#16a34a', fontWeight: 500 }}>● {totalCommits > 50 ? 'Active Contributor' : 'Getting Started'}</span>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="sec-t" style={{ marginBottom: '16px' }}>
                  <i className="ti ti-target" style={{ color: 'var(--indigo)' }} />
                  <h3>Recommended Next Steps</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { title: 'Learn Docker', desc: 'Improve deployment skills', score: '+6' },
                    { title: 'Contribute to Open Source', desc: 'Increase code reviews', score: '+8' },
                    { title: 'Build a REST API Project', desc: 'Strengthen backend skills', score: '+4' }
                  ].map((step) => (
                    <div key={step.title} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>{step.title}</b>
                        <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>{step.desc}</span>
                      </div>
                      <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>{step.score} Score</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '12.5px', color: 'var(--indigo)' }}>
                View Full Learning Path →
              </button>
            </div>
          </div>

          {/* Top Repos Section */}
          {topRepos.length > 0 && (
            <div className="card pad">
              <div className="sec-t" style={{ marginBottom: '16px' }}>
                <i className="ti ti-git-branch" style={{ color: 'var(--indigo)' }} />
                <h3>Top Repositories</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--line)', transition: 'border-color 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--indigo)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <b style={{ fontSize: '13.5px', color: 'var(--indigo)' }}>{repo.name}</b>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '11.5px', color: 'var(--ink3)' }}>
                          <span><i className="ti ti-star" /> {repo.stars}</span>
                          <span><i className="ti ti-git-fork" /> {repo.forks}</span>
                        </div>
                      </div>
                      {repo.description && (
                        <p style={{ fontSize: '12px', color: 'var(--ink2)', margin: '0 0 8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {repo.description}
                        </p>
                      )}
                      {repo.language && (
                        <span style={{ fontSize: '11px', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: LANG_COLORS[topRepos.indexOf(repo) % LANG_COLORS.length] }} />
                          {repo.language}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA Banner */}
          <div
            className="card pad"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(79, 70, 229, 0.03))',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--indigo)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', flexShrink: 0 }}>
                <i className="ti ti-brand-github" />
              </div>
              <div>
                <b style={{ fontSize: '14.5px', color: 'var(--ink)', display: 'block' }}>
                  Your GitHub is synced with your AI Twin
                </b>
                <span style={{ fontSize: '13px', color: 'var(--ink2)' }}>
                  We'll continue analyzing your code and updating insights as you commit.
                </span>
              </div>
            </div>
            <button className="btn pri" style={{ whiteSpace: 'nowrap' }}>
              <i className="ti ti-message-chatbot" /> Ask AI about my GitHub
            </button>
          </div>
        </>
      )}
    </div>
  )
}

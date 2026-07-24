import React, { useState, useEffect } from 'react'
import Ring from '../components/Ring.jsx'

export default function GitHubSync() {
  const [gitHubUrl, setGitHubUrl] = useState('github.com/gayathrisathishkumarr')
  const [username, setUsername] = useState('gayathrisathishkumarr')
  const [isManualInput, setIsManualInput] = useState(false)
  const [inputUrl, setInputUrl] = useState('')

  useEffect(() => {
    // Attempt to fetch latest extracted GitHub URL from uploaded resume in backend
    fetch('http://localhost:5001/api/resume/latest')
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data && res.data.extracted_text) {
          const text = res.data.extracted_text
          const ghMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i)
          if (ghMatch) {
            const url = ghMatch[0].replace(/^https?:\/\//, '')
            setGitHubUrl(url)
            const user = url.split('/')[1] || url
            setUsername(user)
          }
        }
      })
      .catch(() => {
        // Fallback silently to default profile
      })
  }, [])

  const handleConnectDifferent = () => {
    setIsManualInput(!isManualInput)
  }

  const handleSaveManualUrl = (e) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      const cleanUrl = inputUrl.trim().replace(/^https?:\/\//, '')
      setGitHubUrl(cleanUrl)
      const user = cleanUrl.split('/')[1] || cleanUrl
      setUsername(user)
      setIsManualInput(false)
      setInputUrl('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Header */}
      <div className="page-h">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>GitHub Sync</h1>
            <span className="chip ver" style={{ fontSize: '11.5px' }}>
              <i className="ti ti-check" /> Extracted from Resume
            </span>
          </div>
          <p>We extracted your GitHub profile from your resume and analyzed your code signals.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn">
            <i className="ti ti-refresh" /> Sync Now
          </button>
          <button className="btn pri" onClick={handleConnectDifferent}>
            <i className="ti ti-brand-github" /> {isManualInput ? 'Cancel' : 'Connect Different Account'}
          </button>
        </div>
      </div>

      {/* Manual Input Fallback Bar */}
      {isManualInput && (
        <form onSubmit={handleSaveManualUrl} className="card pad" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc' }}>
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
          <button type="submit" className="btn pri">Save Profile</button>
        </form>
      )}

      {/* Section 1: GitHub Connected Card */}
      <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="chip ver" style={{ background: '#e6f6ec', color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
            <i className="ti ti-circle-check-filled" /> GitHub Connected
          </span>
          <span style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>
            Last Synced: <strong style={{ color: '#16a34a' }}>● 5 minutes ago</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {/* Left Avatar & Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#0f1024',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '28px',
                boxShadow: '0 4px 12px rgba(15, 16, 36, 0.25)',
                border: '2px solid var(--line)'
              }}
            >
              <i className="ti ti-brand-github" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>{username}</h3>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>
                  Extracted from your resume
                </span>
              </div>
              <a
                href={`https://${gitHubUrl}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '13px', color: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}
              >
                {gitHubUrl} <i className="ti ti-external-link" style={{ fontSize: '12px' }} />
              </a>
            </div>
          </div>

          {/* Right Stats Columns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="eyebrow" style={{ fontSize: '11px' }}>Repositories</span>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--ink)', marginTop: '2px' }}>26</b>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--line)' }} />
            <div style={{ textAlign: 'center' }}>
              <span className="eyebrow" style={{ fontSize: '11px' }}>Followers</span>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--ink)', marginTop: '2px' }}>38</b>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--line)' }} />
            <div style={{ textAlign: 'center' }}>
              <span className="eyebrow" style={{ fontSize: '11px' }}>Following</span>
              <b style={{ display: 'block', fontSize: '18px', color: 'var(--ink)', marginTop: '2px' }}>24</b>
            </div>
            <a
              href={`https://${gitHubUrl}`}
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

      {/* Sections 2 & 3: Two Column Row (AI Coding Summary & Language Breakdown) */}
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* AI Coding Summary Card */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="sec-t" style={{ marginBottom: '18px' }}>
              <i className="ti ti-sparkles" style={{ color: 'var(--indigo)' }} />
              <h3>AI Coding Summary</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
              {/* Score Donut */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Ring
                  value={91}
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
              </div>

              {/* Summary Highlights */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--indigo)' }}>
                    Strong Full Stack Developer
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '16px' }}>
                  <i className="ti ti-star-filled" />
                  <i className="ti ti-star-filled" />
                  <i className="ti ti-star-filled" />
                  <i className="ti ti-star-filled" />
                  <i className="ti ti-star" style={{ color: '#d1d5db' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12.5px' }}>
                  <div>
                    <span className="eyebrow" style={{ fontSize: '10.5px', color: '#16a34a', marginBottom: '8px', display: 'block' }}>
                      Top Strengths
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--ink2)' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-circle-check-filled" style={{ color: '#16a34a' }} /> React Development
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-circle-check-filled" style={{ color: '#16a34a' }} /> Node.js &amp; Express
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-circle-check-filled" style={{ color: '#16a34a' }} /> RESTful APIs
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-circle-check-filled" style={{ color: '#16a34a' }} /> MongoDB &amp; SQL
                      </li>
                    </ul>
                  </div>

                  <div>
                    <span className="eyebrow" style={{ fontSize: '10.5px', color: '#dc2626', marginBottom: '8px', display: 'block' }}>
                      Needs Improvement
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--ink2)' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-alert-circle" style={{ color: '#dc2626' }} /> Docker Containerization
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-alert-circle" style={{ color: '#dc2626' }} /> Unit Testing (Jest)
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-alert-circle" style={{ color: '#dc2626' }} /> CI/CD Automation
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-alert-circle" style={{ color: '#dc2626' }} /> Microservices Architecture
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Breakdown Card */}
        <div className="card pad">
          <div className="sec-t" style={{ marginBottom: '18px' }}>
            <i className="ti ti-code" style={{ color: 'var(--indigo)' }} />
            <h3>Language Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} /> JavaScript
                </span>
                <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>45%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} /> Python
                </span>
                <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>30%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0ea5e9' }} /> TypeScript
                </span>
                <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>15%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#0ea5e9', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} /> HTML / CSS
                </span>
                <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>10%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: '#ef4444', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} /> C / C++
                </span>
                <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>5%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '5%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections 4, 5 & 6: Three Column Row (AI Insights, Coding Activity, Recommended Next Steps) */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.1fr 1fr', gap: '20px' }}>
        {/* AI Insights */}
        <div className="card pad">
          <div className="sec-t" style={{ marginBottom: '16px' }}>
            <i className="ti ti-bulb" style={{ color: 'var(--indigo)' }} />
            <h3>AI Insights</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>You build mostly full-stack web applications with modern JS/TS frameworks.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>Your commits show strong MERN stack proficiency and component modularity.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>Frontend architecture is your strongest technical capability.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>Backend and database schema management skills are growing steadily.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0 }} />
              <span>You maintain clean Git commit histories and meaningful documentation.</span>
            </div>
          </div>
        </div>

        {/* Coding Activity Chart (Last 6 Months) */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="sec-t" style={{ marginBottom: '16px' }}>
              <i className="ti ti-chart-bar" style={{ color: 'var(--indigo)' }} />
              <h3>Coding Activity <small style={{ fontWeight: 400, color: 'var(--ink3)' }}>(Last 6 Months)</small></h3>
            </div>

            {/* Custom Bar Graph Visual */}
            <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              {[
                { month: 'Jan', height: '40%' },
                { month: 'Feb', height: '70%' },
                { month: 'Mar', height: '45%' },
                { month: 'Apr', height: '60%' },
                { month: 'May', height: '85%' },
                { month: 'Jun', height: '35%' },
                { month: 'Jul', height: '90%' }
              ].map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '24px',
                      height: item.height,
                      background: idx % 2 === 0 ? 'var(--indigo)' : 'linear-gradient(180deg, #7c3aed, #4f46e5)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--ink2)' }}>
            <span><strong style={{ color: 'var(--indigo)' }}>842</strong> total commits</span>
            <span style={{ color: '#16a34a', fontWeight: 500 }}>● Active Contributor</span>
          </div>
        </div>

        {/* Recommended Learning Path */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="sec-t" style={{ marginBottom: '16px' }}>
              <i className="ti ti-target" style={{ color: 'var(--indigo)' }} />
              <h3>Recommended Next Steps</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>Learn Docker</b>
                  <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Improve deployment skills</span>
                </div>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>+6 Score</span>
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>Contribute to Open Source</b>
                  <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Increase code reviews</span>
                </div>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>+8 Score</span>
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>Build a REST API Project</b>
                  <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Strengthen backend skills</span>
                </div>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>+4 Score</span>
              </div>
            </div>
          </div>

          <button className="btn" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '12.5px', color: 'var(--indigo)' }}>
            View Full Learning Path →
          </button>
        </div>
      </div>

      {/* Section 7: Bottom CTA Banner */}
      <div
        className="card pad"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(79, 70, 229, 0.03))',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--indigo)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              flexShrink: 0
            }}
          >
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
    </div>
  )
}

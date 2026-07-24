import React, { useState, useEffect } from 'react'
import Ring from '../components/Ring.jsx'

export default function Resume() {
  const [latestResume, setLatestResume] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5001/api/resume/latest')
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setLatestResume(res.data)
        }
      })
      .catch((err) => {
        // Silently fallback to clean mock profile if backend is not queried
      })
  }, [])

  return (
    <>
      {/* Top Section */}
      <div className="page-h">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Resume Sync</h1>
            <span className="chip ver" style={{ fontSize: '11.5px' }}>
              <i className="ti ti-check" /> Up to date
            </span>
          </div>
          <p>Upload and cross-reference your PDF resume with your AI twin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn pri">
            <i className="ti ti-upload" /> Upload New Resume
          </button>
          <button className="btn">
            <i className="ti ti-refresh" /> Resync Now
          </button>
        </div>
      </div>

      {/* Top Grid: Resume Details + Career Resume Score & AI Resume Analysis */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>
        {/* Left Card: Resume Info & Center Focal Score */}
        <div className="card pad" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
          {/* Left Sub-Section: Uploaded File Info */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            {/* Visual PDF Icon Box */}
            <div
              style={{
                width: '80px',
                height: '105px',
                background: '#f8fafc',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ width: '100%', height: '4px', background: '#cbd5e1', borderRadius: '2px' }} />
                <div style={{ width: '70%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                <div style={{ width: '85%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                <div style={{ width: '60%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                <div style={{ width: '90%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'var(--indigo)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  width: 'fit-content'
                }}
              >
                PDF
              </span>
            </div>

            {/* Resume Info Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--ink)' }}>
                    {latestResume ? latestResume.original_filename || latestResume.filename : 'Rounith_R_Resume.pdf'}
                  </h3>
                  <span className="chip ver" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                    <i className="ti ti-check" /> Latest
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: '#16a34a', fontSize: '13px', fontWeight: 500 }}>
                  <i className="ti ti-circle-check-filled" />
                  <span>Successfully synced</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--ink2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-calendar" style={{ color: 'var(--ink3)' }} />
                  <span>Uploaded on: <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>24 Jul 2025, 05:44 PM</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-refresh" style={{ color: 'var(--ink3)' }} />
                  <span>Sync Status: <strong style={{ color: '#16a34a', fontWeight: 600 }}>● Up to date</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sub-Section: Primary Focal Score */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              paddingLeft: '20px',
              borderLeft: '1px solid var(--line)',
              height: '100%'
            }}
          >
            <span className="eyebrow" style={{ marginBottom: '10px', fontSize: '11.5px' }}>
              Career Resume Score
            </span>
            <Ring
              value={96}
              size={130}
              thickness={12}
              color="var(--indigo)"
              track="var(--line)"
              inner="#fff"
              label="Excellent"
              valueColor="var(--indigo)"
              labelColor="var(--indigo)"
              suffix="%"
            />
          </div>
        </div>

        {/* Right Card: AI Resume Analysis */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="sec-t" style={{ marginBottom: '14px' }}>
              <i className="ti ti-sparkles" style={{ color: 'var(--indigo)' }} />
              <h3>AI Resume Analysis</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-shield-check" /> Overall Strength
                </span>
                <span className="chip ver" style={{ background: '#e6f6ec', color: '#16a34a', fontWeight: 600 }}>
                  Strong
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-briefcase" /> Years of Experience (Est.)
                </span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>1+ years</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-chart-bar" /> Career Readiness
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>98%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '98%', height: '100%', background: 'var(--indigo)', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-file-text" /> Resume Quality Score
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>92%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: 'var(--indigo)', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-circle-check" /> Completeness
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>94%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '94%', height: '100%', background: 'var(--indigo)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center', fontSize: '12.5px', color: 'var(--indigo)' }}>
            View Full Analysis <i className="ti ti-arrow-right" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Extracted Information & Bottom CTA on Left, Skills & Status on Right */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Extracted Information Card */}
          <div className="card pad">
            <div className="sec-t" style={{ marginBottom: '20px' }}>
              <i className="ti ti-user-check" style={{ color: 'var(--indigo)' }} />
              <h3>Extracted Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Personal Details */}
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  Personal Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-user" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>Name</span>
                    <strong style={{ color: 'var(--ink)' }}>Rounith Rathesh</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-mail" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>Email</span>
                    <span style={{ color: 'var(--ink)' }}>rounithr@email.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-phone" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>Phone</span>
                    <span style={{ color: 'var(--ink)' }}>+91 98765 43210</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-map-pin" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>Location</span>
                    <span style={{ color: 'var(--ink)' }}>Chennai, India</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-brand-linkedin" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>LinkedIn</span>
                    <a href="https://linkedin.com/in/rounith-r" target="_blank" rel="noreferrer" style={{ color: 'var(--indigo)', fontWeight: 500 }}>
                      linkedin.com/in/rounith-r
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-brand-github" style={{ color: 'var(--ink3)', width: '16px' }} />
                    <span style={{ color: 'var(--ink2)', width: '60px' }}>GitHub</span>
                    <a href="https://github.com/RounithR" target="_blank" rel="noreferrer" style={{ color: 'var(--indigo)', fontWeight: 500 }}>
                      github.com/RounithR
                    </a>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-school" /> Education
                </h4>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                  <strong style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
                    B.Tech - Computer Science Engineering
                  </strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--ink2)', display: 'block', marginTop: '2px' }}>
                    Rajalakshmi Engineering College
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink3)', display: 'block', marginTop: '4px' }}>
                    2024 – 2028 (Expected)
                  </span>
                  <span className="chip ver" style={{ marginTop: '8px', fontSize: '11px', background: '#e6f6ec', color: '#16a34a' }}>
                    CGPA: 8.45 / 10
                  </span>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-briefcase" /> Experience
                </h4>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                  <strong style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
                    Web Development Intern
                  </strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--ink2)', display: 'block', marginTop: '2px' }}>
                    CodeAlpha
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink3)', display: 'block', marginTop: '4px' }}>
                    May 2025 – Jun 2025
                  </span>
                  <span className="chip" style={{ marginTop: '8px', fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>
                    2 Months
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-file-description" /> Professional Summary
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.6 }}>
                Enthusiastic CSE student skilled in full-stack development, AI/ML, and problem solving. Passionate about building real-world applications and learning new technologies.
              </p>
            </div>
          </div>

          {/* Bottom CTA Section (Moved directly below Extracted Information) */}
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
                <i className="ti ti-robot" />
              </div>
              <div>
                <b style={{ fontSize: '14.5px', color: 'var(--ink)', display: 'block' }}>
                  Your resume is in sync with your AI twin
                </b>
                <span style={{ fontSize: '13px', color: 'var(--ink2)' }}>
                  We'll keep analyzing and updating your profile as you grow.
                </span>
              </div>
            </div>
            <button className="btn pri" style={{ whiteSpace: 'nowrap' }}>
              <i className="ti ti-message-chatbot" /> Ask AI about my resume
            </button>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Skills Extracted (Top 5 only) */}
          <div className="card pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>Skills Extracted</h3>
              <span style={{ fontSize: '12px', color: 'var(--indigo)', cursor: 'pointer', fontWeight: 500 }}>+12 More</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-brand-javascript" style={{ color: '#f59e0b' }} /> JavaScript
                </span>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>Advanced</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-brand-react" style={{ color: '#0ea5e9' }} /> React.js
                </span>
                <span className="chip" style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>Advanced</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-brand-nodejs" style={{ color: '#16a34a' }} /> Node.js
                </span>
                <span className="chip ver" style={{ fontSize: '11px', background: '#e6f6ec', color: '#16a34a' }}>Intermediate</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-database" style={{ color: '#10b981' }} /> MongoDB
                </span>
                <span className="chip ver" style={{ fontSize: '11px', background: '#e6f6ec', color: '#16a34a' }}>Intermediate</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-brand-python" style={{ color: '#3b82f6' }} /> Python
                </span>
                <span className="chip ver" style={{ fontSize: '11px', background: '#e6f6ec', color: '#16a34a' }}>Intermediate</span>
              </div>
            </div>

            <button className="btn" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '12.5px', color: 'var(--indigo)' }}>
              View All Skills →
            </button>
          </div>

          {/* Verification Status */}
          <div className="card pad">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px' }}>
              Verification Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-check" style={{ color: '#16a34a' }} /> Resume Parsed
                </span>
                <strong style={{ color: '#16a34a', fontSize: '12px' }}>Verified</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-check" style={{ color: '#16a34a' }} /> Information Extracted
                </span>
                <strong style={{ color: '#16a34a', fontSize: '12px' }}>Verified</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-check" style={{ color: '#16a34a' }} /> Cross Reference (AI)
                </span>
                <strong style={{ color: '#16a34a', fontSize: '12px' }}>Verified</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-clock" style={{ color: 'var(--ink3)' }} /> Last Verified
                </span>
                <span style={{ color: 'var(--ink)', fontSize: '12px' }}>24 Jul 2025</span>
              </div>
            </div>

            <button className="btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center', fontSize: '12.5px' }}>
              <i className="ti ti-download" /> Download Analysis Report
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

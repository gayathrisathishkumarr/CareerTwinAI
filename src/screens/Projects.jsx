import React, { useState } from 'react'

export default function Projects() {
  const [projects] = useState([
    {
      id: 1,
      title: 'CareerTwin AI',
      desc: 'AI-powered platform that creates a digital twin of a user\'s career by analyzing resumes, projects, and skills.',
      type: 'Team Project',
      date: 'Jul 2026',
      verified: true,
      complexity: 'Advanced',
      complexityPct: 85,
      tags: ['React', 'Node.js', 'MongoDB', 'Gemini API', '+2'],
      featured: true,
      color: '#8b5cf6'
    },
    {
      id: 2,
      title: 'Real-time Chat Application',
      desc: 'A real-time chat application with rooms, private messaging, and typing indicators.',
      type: 'Team Project',
      date: 'May 2026',
      verified: true,
      complexity: 'Advanced',
      complexityPct: 75,
      tags: ['Socket.io', 'Node.js', 'React', 'MongoDB', 'Tailwind CSS'],
      featured: false,
      color: '#ec4899'
    },
    {
      id: 3,
      title: 'Expense Tracker',
      desc: 'Personal expense tracking app with analytics, categories, and monthly reports.',
      type: 'Personal Project',
      date: 'Mar 2026',
      verified: true,
      complexity: 'Intermediate',
      complexityPct: 50,
      tags: ['React', 'Firebase', 'Chart.js', 'Tailwind CSS'],
      featured: false,
      color: '#0ea5a4'
    },
    {
      id: 4,
      title: 'Portfolio Website',
      desc: 'Personal developer portfolio to showcase projects, skills, and achievements.',
      type: 'Personal Project',
      date: 'Feb 2026',
      verified: true,
      complexity: 'Beginner',
      complexityPct: 25,
      tags: ['React', 'Tailwind CSS', 'Framer Motion'],
      featured: false,
      color: '#f59e0b'
    }
  ])

  return (
    <div className="projects-layout fade">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-title-area">
          <h1>Projects</h1>
          <p>Explore your work, skills, and impact through verified projects.</p>
        </div>
        <button className="btn pri-btn-new">
          <i className="ti ti-plus" /> Add Project
        </button>
      </div>

      {/* KPI Grid */}
      <div className="proj-kpi-grid">
        <div className="card pad proj-kpi-card">
          <div className="kpi-icon-wrap Blue"><i className="ti ti-folder" /></div>
          <div className="proj-kpi-content">
            <span className="kpi-label">Projects</span>
            <h2 className="kpi-value">8</h2>
            <span className="kpi-sub">Total Projects</span>
          </div>
        </div>

        <div className="card pad proj-kpi-card">
          <div className="kpi-icon-wrap Green"><i className="ti ti-shield-check" /></div>
          <div className="proj-kpi-content">
            <span className="kpi-label">Verified Projects</span>
            <h2 className="kpi-value">6</h2>
            <span className="kpi-sub">AI Verified</span>
          </div>
        </div>

        <div className="card pad proj-kpi-card">
          <div className="kpi-icon-wrap Teal"><i className="ti ti-code" /></div>
          <div className="proj-kpi-content">
            <span className="kpi-label">Technologies Used</span>
            <h2 className="kpi-value">12</h2>
            <span className="kpi-sub">Across Projects</span>
          </div>
        </div>

        <div className="card pad proj-kpi-card sparkline-kpi">
          <div className="kpi-icon-wrap Purple"><i className="ti ti-award" /></div>
          <div className="proj-kpi-content">
            <span className="kpi-label">AI Career Score</span>
            <h2 className="kpi-value">91 <span className="denom">/100</span></h2>
            <span className="kpi-sub green-badge">Excellent ↗</span>
          </div>
          <div className="sparkline-container">
            <svg viewBox="0 0 100 30" className="sparkline-svg">
               <path d="M5,25 Q15,22 25,24 T45,18 T65,22 T85,12 L95,8" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
               <circle cx="95" cy="8" r="3" fill="#a855f7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="proj-main-split">
        {/* Left Column: Project List */}
        <div className="proj-list-col">
          {projects.map(proj => (
            <div className="card proj-card" key={proj.id}>
              <div className="proj-card-inner">
                {/* Thumbnail placeholder */}
                <div className="proj-thumbnail" style={{ background: `linear-gradient(135deg, #1e1b4b, ${proj.color}40, #1e1b4b)` }}>
                  <div className="proj-browser-mockup">
                    <div className="browser-dots">
                      <span /><span /><span />
                    </div>
                    <div className="browser-content">
                       <i className="ti ti-device-laptop" style={{ fontSize: '32px', color: proj.color, opacity: 0.8 }} />
                    </div>
                  </div>
                </div>

                <div className="proj-details">
                  <div className="proj-header-row">
                    <h3>{proj.title}</h3>
                    {proj.featured && <span className="featured-badge"><i className="ti ti-star" /> Featured</span>}
                  </div>
                  <p>{proj.desc}</p>
                  <div className="proj-tags">
                    {proj.tags.map((t, idx) => (
                      <span key={idx} className={`proj-tag ${t.startsWith('+') ? 'more-tag' : ''}`}>
                         {t !== 'React' && t !== 'Node.js' && t !== 'MongoDB' && !t.startsWith('+') && <i className="ti ti-hash" />}
                         {t === 'React' && <i className="ti ti-brand-react text-blue" />}
                         {t === 'Node.js' && <i className="ti ti-brand-nodejs text-green" />}
                         {t === 'MongoDB' && <i className="ti ti-database text-teal" />}
                         {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="proj-meta-col">
                  <div className="meta-list">
                    <div className="meta-item"><i className="ti ti-users" /> {proj.type}</div>
                    <div className="meta-item"><i className="ti ti-calendar-check" /> Completed</div>
                    <div className="meta-item"><i className="ti ti-calendar-event" /> {proj.date}</div>
                    {proj.verified && <div className="meta-item verified-text"><i className="ti ti-shield-check" /> Verified</div>}
                  </div>
                  
                  <div className="complexity-gauge">
                    <span className="complexity-label">AI Complexity</span>
                    <div className="complexity-bar">
                      <div className="complexity-icon"><i className="ti ti-chart-bar" /></div>
                      <div className="complexity-text">{proj.complexity}</div>
                    </div>
                    <button className="btn view-details-btn">View Details <i className="ti ti-arrow-right" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="view-more-row">
             <span className="view-more-link">View More Projects <i className="ti ti-chevron-down" /></span>
          </div>
        </div>

        {/* Right Column: AI Sidebar */}
        <div className="proj-sidebar-col">
          {/* AI Insights */}
          <div className="card pad proj-sidebar-card">
            <div className="sidebar-card-header">
              <i className="ti ti-sparkles text-purple" />
              <h3>AI Insights</h3>
            </div>
            
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon Green"><i className="ti ti-shield-check" /></div>
                <div className="insight-text">
                  <span className="insight-lbl">Strongest Area</span>
                  <b>Backend Development</b>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon Blue"><i className="ti ti-brand-react" /></div>
                <div className="insight-text">
                  <span className="insight-lbl">Most Used Technology</span>
                  <b>React.js</b>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon Purple"><i className="ti ti-cpu" /></div>
                <div className="insight-text">
                  <span className="insight-lbl">Emerging Skill</span>
                  <b>AI Integration</b>
                </div>
              </div>

              <div className="insight-item">
                <div className="insight-icon Teal"><i className="ti ti-brand-docker" /></div>
                <div className="insight-text">
                  <span className="insight-lbl">Recommended Next Skill</span>
                  <b>Docker</b>
                </div>
              </div>
            </div>

            <div className="career-readiness-row">
              <div className="readiness-ring">
                <svg viewBox="0 0 36 36" className="circular-chart purple">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray="89, 100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
              <div className="readiness-text">
                <span className="insight-lbl">Career Readiness</span>
                <b>89%</b>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="card pad proj-sidebar-card">
            <div className="sidebar-card-header">
              <i className="ti ti-brain text-purple" />
              <h3>AI Summary</h3>
            </div>
            <p className="ai-summary-text">
              Your projects demonstrate strong full-stack development with increasing experience in AI-powered applications. You consistently build end-to-end systems using React, Node.js, and MongoDB. Your next area for growth is cloud deployment and testing.
            </p>
            <div className="summary-sparkle"><i className="ti ti-sparkles" /></div>
          </div>

          {/* Recommended Next Project */}
          <div className="card pad proj-sidebar-card next-project-card">
            <div className="sidebar-card-header">
              <i className="ti ti-rocket text-purple" />
              <h3>Recommended Next Project</h3>
            </div>
            <div className="next-project-content">
              <h4>Distributed Chat System</h4>
              <p>Build a scalable distributed chat system to enhance your backend architecture and system design skills.</p>
              <button className="btn pri-btn-new mt-3 width-fit view-learning-path-btn">
                View Learning Path <i className="ti ti-arrow-right" />
              </button>
            </div>
            <div className="next-project-bg-icon">
              <i className="ti ti-message-chatbot" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto'

export default function Dashboard() {
  const navigate = useNavigate()
  const radarRef = useRef(null)
  const [dbData, setDbData] = useState(null)
  const [twinProfile, setTwinProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data from backend
    fetch('http://localhost:5001/api/dashboard')
      .then((res) => res.json())
      .then((data) => setDbData(data))
      .catch((err) => console.warn('Failed to fetch dashboard:', err))

    // Fetch twin profile details from backend
    fetch('http://localhost:5001/api/twin/profile')
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setTwinProfile(res.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Failed to fetch twin profile:', err)
        setLoading(false)
      })
  }, [])

  // Calculate dynamic top skills list from twin profile or default
  const topSkills = twinProfile?.topSkills && twinProfile.topSkills.length > 0 
    ? twinProfile.topSkills.slice(0, 5).map((s, idx) => {
        const percentages = [94, 85, 78, 70, 65]
        const levels = ['Advanced', 'Advanced', 'Intermediate', 'Intermediate', 'Beginner']
        const bgColors = ['bg-blue', 'bg-indigo', 'bg-red', 'bg-orange', 'bg-green']
        const icons = {
          python: 'ti-brand-python',
          javascript: 'ti-brand-javascript',
          react: 'ti-brand-react',
          html: 'ti-brand-html5',
          css: 'ti-brand-css3',
          sql: 'ti-database',
          docker: 'ti-brand-docker',
          aws: 'ti-cloud',
          node: 'ti-brand-nodejs',
          mongodb: 'ti-database',
          postgres: 'ti-database'
        }
        const lower = s.toLowerCase()
        const matchedIcon = Object.keys(icons).find(k => lower.includes(k))
        const iconClass = matchedIcon ? icons[matchedIcon] : 'ti-code'

        return {
          name: s,
          pct: percentages[idx] || 60,
          level: levels[idx] || 'Intermediate',
          bgColor: bgColors[idx] || 'bg-blue',
          icon: iconClass
        }
      })
    : [
        { name: 'Python', pct: 94, level: 'Advanced', bgColor: 'bg-blue', icon: 'ti-brand-python' },
        { name: 'Data Structures', pct: 88, level: 'Advanced', bgColor: 'bg-indigo', icon: 'ti-database' },
        { name: 'Problem Solving', pct: 74, level: 'Intermediate', bgColor: 'bg-red', icon: 'ti-alert-circle' },
        { name: 'Machine Learning', pct: 82, level: 'Advanced', bgColor: 'bg-orange', icon: 'ti-brain' }
      ]

  // Calculate dynamic recommendations based on gaps
  const recommendations = twinProfile?.skillGaps && twinProfile.skillGaps.length > 0
    ? [
        {
          title: `Master ${twinProfile.skillGaps[0]}`,
          desc: `Close your skill gap in ${twinProfile.skillGaps[0]} with a curated learning path`,
          type: 'Course',
          tagClass: 'Purple',
          icon: 'ti-book',
          path: '/learning-path'
        },
        {
          title: `Deploy a ${twinProfile.primaryDomain || 'Full Stack'} Project`,
          desc: `Build a production-ready application to practice and showcase your skills`,
          type: 'Project',
          tagClass: 'Orange',
          icon: 'ti-code',
          path: '/projects'
        },
        {
          title: twinProfile.skillGaps[1] ? `Learn ${twinProfile.skillGaps[1]}` : 'System Design Basics',
          desc: twinProfile.skillGaps[1] ? `Deep dive into advanced topics for ${twinProfile.skillGaps[1]}` : 'Learn scalable system architecture principles from scratch',
          type: 'Course',
          tagClass: 'Teal',
          icon: 'ti-layout-grid',
          path: '/learning-path'
        },
        {
          title: 'Improve GitHub Impact',
          desc: 'Tips to enhance your open source presence and documentation',
          type: 'Guide',
          tagClass: 'Blue',
          icon: 'ti-brand-github',
          path: '/github'
        }
      ]
    : [
        { title: 'DSA - Advanced', desc: 'Top course for leveling up problem solving skills', type: 'Course', tagClass: 'Purple', icon: 'ti-book', path: '/learning-path' },
        { title: 'Build a Full Stack Project', desc: 'Project idea based on your current skills', type: 'Project', tagClass: 'Orange', icon: 'ti-code', path: '/projects' },
        { title: 'System Design Basics', desc: 'Learn system design from scratch', type: 'Course', tagClass: 'Teal', icon: 'ti-layout-grid', path: '/learning-path' },
        { title: 'Improve GitHub Impact', desc: 'Tips to enhance your GitHub profile', type: 'Guide', tagClass: 'Blue', icon: 'ti-brand-github', path: '/github' }
      ]

  // Initialize Radar Chart
  useEffect(() => {
    let chartInstance = null
    if (radarRef.current && !loading) {
      const labels = topSkills.map(s => s.name)
      const scores = topSkills.map(s => s.pct)
      const averages = topSkills.map(s => Math.round(s.pct * 0.85))

      const ctx = radarRef.current.getContext('2d')
      chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Your Score',
              data: scores,
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              borderWidth: 2,
              pointBackgroundColor: '#6366F1',
              pointRadius: 3.5,
            },
            {
              label: 'Industry Avg.',
              data: averages,
              borderColor: '#94A3B8',
              backgroundColor: 'rgba(148, 163, 184, 0.05)',
              borderWidth: 1.5,
              borderDash: [4, 4],
              pointBackgroundColor: '#94A3B8',
              pointRadius: 0,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 20 },
              grid: { color: '#E2E8F0' },
              angleLines: { color: '#E2E8F0' },
              pointLabels: { 
                font: { size: 11, family: 'Inter', weight: '600' }, 
                color: '#475569' 
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance) chartInstance.destroy()
    }
  }, [loading, twinProfile])

  // Map values from database/profile if available
  const completeness = twinProfile?.confidence || 85
  const overallSkill = twinProfile?.careerReadiness || dbData?.twinIQ || 78
  const name = dbData?.livingProfile?.name || 'Rounith R.'

  return (
    <div className="dashboard-layout fade">
      {/* Welcome Greeting Row */}
      <div className="welcome-banner-row-new">
        <div className="welcome-text">
          <span className="welcome-back">Welcome back, {name}! 👋</span>
          <h1>Here's your CareerTwin overview</h1>
          <p>Your AI-powered career assistant is analyzing and learning about you in real-time.</p>
        </div>
      </div>

      {/* 4 KPI Cards in a single row */}
      <div className="kpi-grid-4">
        {/* KPI 1: Profile Completeness */}
        <div className="kpi-card card">
          <div className="kpi-icon-wrap Purple"><i className="ti ti-clipboard-list" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Profile Completeness</span>
            <h2 className="kpi-value">{completeness}%</h2>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${completeness}%`, background: '#8B5CF6' }} />
            </div>
            <span className="kpi-sub">Great! Keep it up.</span>
          </div>
        </div>

        {/* KPI 2: Overall Skill Score */}
        <div className="kpi-card card">
          <div className="kpi-icon-wrap Green"><i className="ti ti-trending-up" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Overall Skill Score</span>
            <h2 className="kpi-value">{overallSkill} <span className="denom">/100</span></h2>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${overallSkill}%`, background: '#10B981' }} />
            </div>
            <span className="kpi-sub green-badge">↑ Above Average</span>
          </div>
        </div>

        {/* KPI 3: Career Potential */}
        <div className="kpi-card card sparkline-kpi">
          <div className="kpi-icon-wrap Blue"><i className="ti ti-chart-line" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Career Potential</span>
            <h2 className="kpi-value">High</h2>
            <span className="kpi-sub">↑ Keep growing!</span>
          </div>
          <div className="sparkline-container">
            <svg viewBox="0 0 100 30" className="sparkline-svg">
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                </linearGradient>
              </defs>
              <path
                d="M5,25 Q20,12 40,20 T70,8 T95,5"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5,25 Q20,12 40,20 T70,8 T95,5 L95,30 L5,30 Z"
                fill="url(#sparkline-grad)"
              />
            </svg>
          </div>
        </div>

        {/* KPI 4: Profile Strength */}
        <div className="kpi-card card">
          <div className="kpi-icon-wrap Orange"><i className="ti ti-shield-check" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Profile Strength</span>
            <h2 className="kpi-value">85%</h2>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '85%', background: '#F97316' }} />
            </div>
            <span className="kpi-sub">Great! Keep it up.</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Content Grid */}
      <div className="main-3col-grid">
        {/* Column 1: Skills Overview & Top Skills */}
        <div className="grid-column col-left">
          {/* Skills Overview */}
          <div className="card pad panel-radar-new">
            <div className="panel-header-simple">
              <h3>Skills Overview</h3>
            </div>
            <div className="radar-canvas-container">
              <canvas ref={radarRef} />
            </div>
            {/* Custom Checkbox Legend */}
            <div className="radar-custom-legend">
              <div className="legend-item">
                <span className="chk-box blue-chk"><i className="ti ti-check" /></span>
                <span>Your Score</span>
              </div>
              <div className="legend-item">
                <span className="chk-box grey-chk" />
                <span>Industry Avg.</span>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="card pad panel-top-skills-new">
            <div className="panel-header-row-simple">
              <h3>Top Skills</h3>
              <span className="view-link" onClick={() => navigate('/skills')}>View all</span>
            </div>
             <div className="top-skills-list-new">
              {topSkills.map((s, idx) => (
                <div className="skill-progress-item" key={idx}>
                  <div className="skill-meta">
                    <div className={`skill-icon-badge ${s.bgColor}`}><i className={`ti ${s.icon}`} /></div>
                    <b>{s.name}</b>
                    <span className="skill-level text-muted">{s.level}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${s.pct}%`, background: '#6366F1' }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn sec-btn full-width margin-top-btn" onClick={() => navigate('/skills')}>
              View Full Skill Analysis
            </button>
          </div>
        </div>

        {/* Column 2: AI Mentor Chat & Next Best Step */}
        <div className="grid-column col-center">
          {/* AI Mentor Chat Callout */}
          <div className="card pad mentor-chat-panel-new">
            <div className="robot-wrapper-new">
              <div className="robot-orb-new">
                <i className="ti ti-robot" />
              </div>
              <div className="robot-details-new">
                <h4>AI Mentor Chat</h4>
                <p>Chat with your AI Twin for personalized career guidance.</p>
              </div>
            </div>
            <button className="btn pri-btn-new" onClick={() => navigate('/chat')}>
              <i className="ti ti-message" /> Start a Conversation
            </button>
          </div>

          {/* Next Best Step */}
          <div className="card pad next-step-panel-new">
            <div className="next-step-layout-new">
              <span className="panel-tag-new">Next Best Step</span>
              <h4>Improve your DSA skills</h4>
              <p>You're close to leveling up! Practice advanced problems.</p>
              
              <div className="target-flex">
                <button className="btn pri-btn-new width-fit" onClick={() => navigate('/learning-path')}>
                  View Learning Path
                </button>
                <div className="target-illustration-new">
                  <svg viewBox="0 0 100 100" className="target-svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#FCA5A5" strokeWidth="7" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#EF4444" strokeWidth="7" />
                    <circle cx="50" cy="50" r="10" fill="#EF4444" />
                    {/* Arrow */}
                    <path d="M80,20 L58,42" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
                    <path d="M58,42 L65,42 M58,42 L58,35" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
                    {/* Fletching */}
                    <path d="M76,16 L84,24 M80,12 L88,20" stroke="#3B82F6" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Activity & Job Matches */}
        <div className="grid-column col-right">
          {/* Recent Activity */}
          <div className="card pad activity-panel-new">
            <div className="panel-header-row-simple">
              <h3>Recent Activity</h3>
              <span className="view-link" onClick={() => navigate('/my-twin')}>View all</span>
            </div>
            <div className="activity-timeline-new">
              <div className="activity-item-new">
                <div className="activity-icon-new bg-green-soft text-green"><i className="ti ti-file-upload" /></div>
                <div className="activity-content-new">
                  <b>Resume uploaded</b>
                  <span className="activity-time-new">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item-new">
                <div className="activity-icon-new bg-black-soft text-black"><i className="ti ti-refresh" /></div>
                <div className="activity-content-new">
                  <b>GitHub profile synced</b>
                  <span className="activity-time-new">5 hours ago</span>
                </div>
              </div>
              <div className="activity-item-new">
                <div className="activity-icon-new bg-blue-soft text-blue"><i className="ti ti-plus" /></div>
                <div className="activity-content-new">
                  <b>New skill added: Docker</b>
                  <span className="activity-time-new">1 day ago</span>
                </div>
              </div>
              <div className="activity-item-new">
                <div className="activity-icon-new bg-light-blue-soft text-light-blue"><i className="ti ti-folder-plus" /></div>
                <div className="activity-content-new">
                  <b>Project added: Portfolio Website</b>
                  <span className="activity-time-new">2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Matches */}
          <div className="card pad jobs-panel-new">
            <div className="panel-header-row-simple">
              <h3>Job Matches for You</h3>
              <span className="view-link" onClick={() => navigate('/job-matches')}>View all</span>
            </div>
            <div className="job-matches-list-new">
              <div className="job-match-item-new">
                <div className="job-logo bg-red">tcs</div>
                <div className="job-details-new">
                  <h4>SDE Intern</h4>
                  <div className="job-meta-new">
                    <span className="job-company">TCS</span>
                    <span className="job-dot">•</span>
                    <span className="job-loc">Chennai</span>
                  </div>
                </div>
                <div className="job-badge text-teal-badge">72% Match</div>
              </div>

              <div className="job-match-item-new">
                <div className="job-logo bg-green">zoho</div>
                <div className="job-details-new">
                  <h4>Backend Developer Intern</h4>
                  <div className="job-meta-new">
                    <span className="job-company">Zoho</span>
                    <span className="job-dot">•</span>
                    <span className="job-loc">Chennai</span>
                  </div>
                </div>
                <div className="job-badge text-teal-badge">68% Match</div>
              </div>

              <div className="job-match-item-new">
                <div className="job-logo bg-orange">fractal</div>
                <div className="job-details-new">
                  <h4>ML Intern</h4>
                  <div className="job-meta-new">
                    <span className="job-company">Fractal</span>
                    <span className="job-dot">•</span>
                    <span className="job-loc">Remote</span>
                  </div>
                </div>
                <div className="job-badge text-teal-badge">65% Match</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for You deck */}
      <div className="recommended-section">
        <h3 className="section-title">Recommended for You</h3>
        <div className="recommended-grid">
          {recommendations.map((rec, idx) => (
            <div className="recommend-card card" key={idx} onClick={() => navigate(rec.path)}>
              <div className={`card-icon-tag ${rec.tagClass}`}><i className={`ti ${rec.icon}`} /></div>
              <div className="recommend-body">
                <h4>{rec.title}</h4>
                <p>{rec.desc}</p>
                <div className="recommend-footer">
                  <span className="rec-type">{rec.type}</span>
                  <i className="ti ti-arrow-right" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Promotional CTA Banner */}
      <div className="cta-banner-card card">
        <div className="cta-banner-content">
          <h2>Let your AI Twin guide your career journey</h2>
          <p>The more you update, the smarter your twin becomes.</p>
          <button className="cta-banner-btn" onClick={() => navigate('/chat')}>
            Chat with AI Twin <i className="ti ti-arrow-right" />
          </button>
        </div>
        <div className="cta-banner-illustration">
          <div className="robot-floating-head">
            <svg viewBox="0 0 100 100" className="robot-vector">
              <rect x="25" y="30" width="50" height="40" rx="15" fill="#6366F1" />
              <rect x="30" y="35" width="40" height="30" rx="10" fill="#1E1B4B" />
              {/* Eyes */}
              <ellipse cx="42" cy="50" rx="4" ry="6" fill="#06B6D4" className="robot-eye" />
              <ellipse cx="58" cy="50" rx="4" ry="6" fill="#06B6D4" className="robot-eye" />
              {/* Antenna */}
              <line x1="50" y1="30" x2="50" y2="15" stroke="#6366F1" strokeWidth="4" />
              <circle cx="50" cy="15" r="5" fill="#FBBF24" />
              {/* Ears */}
              <circle cx="23" cy="50" r="4" fill="#818CF8" />
              <circle cx="77" cy="50" r="4" fill="#818CF8" />
              {/* Mouth */}
              <path d="M45,58 Q50,62 55,58" stroke="#06B6D4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

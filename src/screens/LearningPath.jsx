import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Ring from '../components/Ring.jsx'

export default function LearningPath() {
  const navigate = useNavigate()
  const [goal, setGoal] = useState('Full Stack Developer')
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(goal)

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      desc: 'Learn core JavaScript concepts and ES6+ features',
      progress: 75,
      status: 'In Progress',
      hours: '15h',
      icon: 'ti-code',
      iconBg: '#e0e7ff',
      iconColor: '#4f46e5'
    },
    {
      id: 2,
      title: 'React.js Basics',
      desc: 'Build interactive UIs with components and hooks',
      progress: 40,
      status: 'In Progress',
      hours: '20h',
      icon: 'ti-brand-react',
      iconBg: '#dbeafe',
      iconColor: '#2563eb'
    },
    {
      id: 3,
      title: 'Node.js & Express',
      desc: 'Build REST APIs and handle databases',
      progress: 0,
      status: 'Not Started',
      hours: '25h',
      icon: 'ti-brand-nodejs',
      iconBg: '#dcfce7',
      iconColor: '#16a34a'
    },
    {
      id: 4,
      title: 'MongoDB Basics',
      desc: 'Work with NoSQL databases and Mongoose',
      progress: 0,
      status: 'Not Started',
      hours: '15h',
      icon: 'ti-database',
      iconBg: '#ccfbf1',
      iconColor: '#0d9488'
    },
    {
      id: 5,
      title: 'Deployment & DevOps',
      desc: 'Deploy your full stack applications with Docker & Vercel',
      progress: 0,
      status: 'Not Started',
      hours: '10h',
      icon: 'ti-cloud-upload',
      iconBg: '#f3e8ff',
      iconColor: '#9333ea'
    }
  ])

  const topSkills = [
    { name: 'JavaScript', percent: 40, color: '#f59e0b' },
    { name: 'React.js', percent: 30, color: '#3b82f6' },
    { name: 'Node.js', percent: 20, color: '#10b981' },
    { name: 'MongoDB', percent: 20, color: '#14b8a6' },
    { name: 'Express.js', percent: 10, color: '#8b5cf6' }
  ]

  const recommendedResources = [
    {
      id: 1,
      title: 'JavaScript Crash Course',
      provider: 'freeCodeCamp',
      type: 'Video',
      typeBg: '#f3e8ff',
      typeColor: '#7c3aed',
      icon: 'ti-brand-youtube',
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      id: 2,
      title: 'React - The Complete Guide',
      provider: 'Udemy',
      type: 'Course',
      typeBg: '#dbeafe',
      typeColor: '#2563eb',
      icon: 'ti-certificate',
      iconBg: '#e0e7ff',
      iconColor: '#4f46e5'
    },
    {
      id: 3,
      title: 'Node.js Tutorial',
      provider: 'W3Schools',
      type: 'Article',
      typeBg: '#dcfce7',
      typeColor: '#16a34a',
      icon: 'ti-article',
      iconBg: '#dbeafe',
      iconColor: '#0284c7'
    },
    {
      id: 4,
      title: 'MongoDB Fundamentals',
      provider: 'MongoDB University',
      type: 'Course',
      typeBg: '#dbeafe',
      typeColor: '#2563eb',
      icon: 'ti-database',
      iconBg: '#d1fae5',
      iconColor: '#059669'
    }
  ]

  const overallProgress = Math.round(
    steps.reduce((sum, item) => sum + item.progress, 0) / steps.length
  )

  const handleSaveGoal = (e) => {
    e.preventDefault()
    if (goalInput.trim()) {
      setGoal(goalInput.trim())
      setIsEditingGoal(false)
    }
  }

  const toggleStepStatus = (id) => {
    setSteps(prevSteps =>
      prevSteps.map(step => {
        if (step.id === id) {
          if (step.status === 'Not Started') {
            return { ...step, status: 'In Progress', progress: 50 }
          } else if (step.status === 'In Progress') {
            return { ...step, status: 'Completed', progress: 100 }
          } else {
            return { ...step, status: 'Not Started', progress: 0 }
          }
        }
        return step
      })
    )
  }

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Header */}
      <div className="page-h">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            background: 'var(--indigo-soft)', color: 'var(--indigo)',
            display: 'grid', placeItems: 'center', fontSize: '22px'
          }}>
            <i className="ti ti-route" />
          </div>
          <div>
            <h1>Learning Path</h1>
            <p>Personalized roadmap to bridge your skill gaps and achieve your goals.</p>
          </div>
        </div>
        <button className="btn" onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left" /> Back to Dashboard
        </button>
      </div>

      {/* Goal Edit Banner Modal */}
      {isEditingGoal && (
        <form onSubmit={handleSaveGoal} className="card pad" style={{ background: '#f8fafc', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <i className="ti ti-target" style={{ fontSize: '20px', color: 'var(--indigo)' }} />
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g. Full Stack Developer, AI Engineer..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '13.5px',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn pri">Save Goal</button>
          <button type="button" className="btn" onClick={() => setIsEditingGoal(false)}>Cancel</button>
        </form>
      )}

      {/* Top KPI Cards Row (5 Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(4, minmax(170px, 1fr))',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {/* Card 1: Your Goal */}
        <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#f3e8ff', color: '#7c3aed',
            display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0
          }}>
            <i className="ti ti-target" />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>YOUR GOAL</span>
            <b style={{ fontSize: '14px', color: 'var(--ink)', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {goal}
            </b>
            <button
              onClick={() => { setGoalInput(goal); setIsEditingGoal(true); }}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--indigo)', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', marginTop: '3px' }}
            >
              Edit Goal →
            </button>
          </div>
        </div>

        {/* Card 2: Overall Progress */}
        <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>OVERALL PROGRESS</span>
            <b style={{ fontSize: '22px', color: 'var(--ink)', marginTop: '2px', display: 'block' }}>{overallProgress}%</b>
            <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>Overall completion</span>
          </div>
          <Ring
            value={overallProgress}
            size={50}
            thickness={6}
            color="var(--indigo)"
            track="#e2e8f0"
            inner="#fff"
            valueColor="var(--indigo)"
            suffix="%"
          />
        </div>

        {/* Card 3: Skills to Improve */}
        <div className="card pad" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SKILLS TO IMPROVE</span>
          <b style={{ fontSize: '22px', color: 'var(--ink)', margin: '2px 0 3px', display: 'block' }}>8</b>
          <span style={{ fontSize: '11.5px', color: 'var(--indigo)', fontWeight: 600, cursor: 'pointer' }}>View Details →</span>
        </div>

        {/* Card 4: Hours to Goal */}
        <div className="card pad" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>HOURS TO GOAL</span>
          <b style={{ fontSize: '22px', color: 'var(--ink)', margin: '2px 0 3px', display: 'block' }}>120h</b>
          <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>Estimated time</span>
        </div>

        {/* Card 5: Learning Streak */}
        <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#ffedd5', color: '#ea580c',
            display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0
          }}>
            <i className="ti ti-flame" />
          </div>
          <div>
            <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>LEARNING STREAK</span>
            <b style={{ fontSize: '22px', color: 'var(--ink)', marginTop: '2px', display: 'block' }}>7</b>
            <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>days in a row</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Roadmap (2/3) + Right Sidebar (1/3) */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Learning Roadmap */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                Your Learning Roadmap
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--ink3)', margin: '2px 0 0' }}>
                Step-by-step path to achieve your goal
              </p>
            </div>
            <button className="btn" style={{ fontSize: '12.5px', color: 'var(--indigo)' }}>
              View Full Roadmap →
            </button>
          </div>

          {/* Timeline List */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '14px' }}>
            {/* Continuous Vertical Line */}
            <div style={{
              position: 'absolute',
              left: '26px',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: '#e2e8f0',
              zIndex: 0
            }} />

            {steps.map((step) => {
              const isCompleted = step.status === 'Completed'
              const isInProgress = step.status === 'In Progress'

              return (
                <div key={step.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Step Number Node */}
                  <div
                    onClick={() => toggleStepStatus(step.id)}
                    title="Click to toggle step status"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCompleted ? '#16a34a' : isInProgress ? 'var(--indigo)' : '#cbd5e1',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      boxShadow: isInProgress ? '0 0 0 4px rgba(79, 70, 229, 0.15)' : 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCompleted ? <i className="ti ti-check" style={{ fontSize: '14px' }} /> : step.id}
                  </div>

                  {/* Step Card Body */}
                  <div
                    className="card"
                    onClick={() => toggleStepStatus(step.id)}
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--indigo)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                  >
                    {/* Left Icon & Text */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: step.iconBg,
                        color: step.iconColor,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '20px',
                        flexShrink: 0
                      }}>
                        <i className={`ti ${step.icon}`} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                          {step.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--ink2)', margin: '2px 0 6px' }}>
                          {step.desc}
                        </p>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', maxWidth: '220px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${step.progress}%`, height: '100%', background: isCompleted ? '#16a34a' : 'var(--indigo)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    </div>

                    {/* Right Status Badge & Time */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                      <span className="chip" style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: isCompleted ? '#dcfce7' : isInProgress ? '#f3e8ff' : '#f1f5f9',
                        color: isCompleted ? '#15803d' : isInProgress ? '#7c3aed' : '#64748b'
                      }}>
                        {step.status}
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ti ti-clock" /> {step.hours}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Roadmap Banner */}
          <div style={{
            marginTop: '8px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #fef3c7, #fef08a)',
            borderRadius: '10px',
            border: '1px solid #fde047',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: '#854d0e',
            fontWeight: 500
          }}>
            <span style={{ fontSize: '18px' }}>🏆</span>
            <span>Complete all steps to achieve your goal!</span>
          </div>
        </div>

        {/* Right Column: Top Skills to Improve + Recommended Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Top Skills to Improve */}
          <div className="card pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                Top Skills to Improve
              </h3>
              <button className="btn" style={{ padding: '4px 10px', fontSize: '11.5px' }}>
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topSkills.map((skill) => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{skill.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink3)' }}>{skill.percent}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${skill.percent}%`, height: '100%', background: skill.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Recommended Resources */}
          <div className="card pad">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '14px' }}>
              Recommended Resources
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendedResources.map((res) => (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid var(--line)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      background: res.iconBg, color: res.iconColor,
                      display: 'grid', placeItems: 'center', fontSize: '16px', flexShrink: 0
                    }}>
                      <i className={`ti ${res.icon}`} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <b style={{ fontSize: '12.5px', color: 'var(--ink)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {res.title}
                      </b>
                      <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>{res.provider}</span>
                    </div>
                  </div>
                  <span className="chip" style={{ fontSize: '10.5px', background: res.typeBg, color: res.typeColor, flexShrink: 0 }}>
                    {res.type}
                  </span>
                </div>
              ))}
            </div>

            <button className="btn" style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '12px', color: 'var(--indigo)' }}>
              View All Resources →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

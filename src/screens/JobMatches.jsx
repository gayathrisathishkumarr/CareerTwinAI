import React, { useState, useEffect } from 'react'
import Ring from '../components/Ring.jsx'

export default function JobMatches() {
  const [isMatched, setIsMatched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [matchStep, setMatchStep] = useState(1)

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'high' | 'recent'
  const [locationFilter, setLocationFilter] = useState('All')
  const [experienceFilter, setExperienceFilter] = useState('All')
  const [savedJobIds, setSavedJobIds] = useState([1, 3])

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Development Engineer',
      company: 'Flipkart',
      matchPct: 95,
      location: 'Bengaluru, Karnataka',
      type: 'Full-time',
      experience: '2-4 Yrs',
      skills: ['JavaScript', 'React.js', 'Node.js', 'System Design'],
      moreSkillsCount: 3,
      salary: '₹18 – ₹28 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 2 days ago',
      logoBg: '#fef9c3',
      logoColor: '#ca8a04',
      logoIcon: 'ti-shopping-bag'
    },
    {
      id: 2,
      title: 'System Engineer',
      company: 'Tata Consultancy Services (TCS)',
      matchPct: 89,
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      experience: '1-3 Yrs',
      skills: ['Java', 'SQL', 'DSA', 'Spring Boot'],
      moreSkillsCount: 2,
      salary: '₹7 – ₹12 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 1 day ago',
      logoBg: '#fbcfe8',
      logoColor: '#be185d',
      logoIcon: 'ti-building-skyscraper'
    },
    {
      id: 3,
      title: 'Associate Developer',
      company: 'Infosys',
      matchPct: 86,
      location: 'Bengaluru, Karnataka',
      type: 'Full-time',
      experience: '1-2 Yrs',
      skills: ['Python', 'Django', 'REST API', 'MySQL'],
      moreSkillsCount: 2,
      salary: '₹6 – ₹10 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 3 days ago',
      logoBg: '#dbeafe',
      logoColor: '#1d4ed8',
      logoIcon: 'ti-cpu'
    },
    {
      id: 4,
      title: 'Project Engineer',
      company: 'Wipro',
      matchPct: 82,
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      experience: '1-3 Yrs',
      skills: ['Java', 'HTML', 'CSS', 'JavaScript'],
      moreSkillsCount: 2,
      salary: '₹6 – ₹9 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 5 days ago',
      logoBg: '#dcfce7',
      logoColor: '#15803d',
      logoIcon: 'ti-world'
    },
    {
      id: 5,
      title: 'Backend Engineer',
      company: 'Zomato',
      matchPct: 78,
      location: 'Gurugram, Haryana',
      type: 'Full-time',
      experience: '2-4 Yrs',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      moreSkillsCount: 3,
      salary: '₹15 – ₹24 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 4 days ago',
      logoBg: '#fee2e2',
      logoColor: '#dc2626',
      logoIcon: 'ti-soup'
    }
  ])

  const inDemandSkills = [
    { name: 'React.js', percent: 92 },
    { name: 'Node.js', percent: 88 },
    { name: 'Python', percent: 85 },
    { name: 'System Design', percent: 80 },
    { name: 'SQL', percent: 76 }
  ]

  useEffect(() => {
    handleStartMatching()
  }, [])

  const handleStartMatching = async () => {
    setLoading(true)
    setIsMatched(false)

    try {
      const res = await fetch('http://localhost:5001/api/jobs/matched')
      const data = await res.json()
      if (data.status === 'success' && data.data) {
        setJobs(data.data)
      }
    } catch {
      // Keep existing default fallback list if API fails
    }

    setLoading(false)
    setIsMatched(true)
  }

  const toggleSaveJob = (id) => {
    setSavedJobIds(prev =>
      prev.includes(id) ? prev.filter(jId => jId !== id) : [...prev, id]
    )
  }

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'high') return job.matchPct >= 80
    if (activeTab === 'recent') return job.postedAgo.includes('1 day') || job.postedAgo.includes('2 days')
    return true
  })

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Header */}
      <div className="page-h">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Job Matches</h1>
            <span
              className="chip"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.1))',
                color: '#7c3aed',
                border: '1px solid rgba(124,58,237,0.2)',
                fontWeight: 600,
                fontSize: '11.5px',
                padding: '3px 10px'
              }}
            >
              <i className="ti ti-sparkles" /> AI Powered
            </span>
          </div>
          <p>Discover roles that match your skills, experience, and career goals.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn">
            <i className="ti ti-adjustments-horizontal" /> Job Preferences
          </button>
          <button className="btn pri" onClick={handleStartMatching} disabled={loading} style={{ background: '#4f46e5' }}>
            <i className={`ti ${loading ? 'ti-loader-2 ti-spin' : 'ti-refresh'}`} /> {loading ? 'Calculating…' : isMatched ? 'Refresh Matches' : 'Calculate Job Matches'}
          </button>
        </div>
      </div>

      {/* BEFORE MATCHING (0 State): Top KPI Cards */}
      {!isMatched ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'stretch' }}>
          {/* Card 1: Top Match */}
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef08a', color: '#a16207', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
              ?
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>TOP MATCH</span>
              <b style={{ fontSize: '22px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>0%</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Not Calculated</span>
            </div>
          </div>

          {/* Card 2: Strong Matches */}
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', color: '#94a3b8', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-target-arrow" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>STRONG MATCHES</span>
              <b style={{ fontSize: '22px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>0</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Above 70%</span>
            </div>
          </div>

          {/* Card 3: Applications Ready */}
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', color: '#94a3b8', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-file-text" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>APPLICATIONS READY</span>
              <b style={{ fontSize: '22px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>0</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Pending Resume</span>
            </div>
          </div>

          {/* Card 4: Saved Jobs */}
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ffe4e6', color: '#e11d48', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-heart" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SAVED JOBS</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px' }}>{savedJobIds.length}</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>For Later</span>
            </div>
          </div>

          {/* Card 5: Profile Strength */}
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>PROFILE STRENGTH</span>
              <b style={{ fontSize: '22px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>0%</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>Pending Upload</span>
            </div>
            <Ring value={0} size={50} thickness={6} color="#cbd5e1" track="#e2e8f0" inner="#fff" valueColor="#94a3b8" suffix="%" />
          </div>
        </div>
      ) : (
        /* AFTER MATCHING: Top KPI Cards Row */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'stretch' }}>
          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef08a', color: '#a16207', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
              F
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>TOP MATCH</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px', lineHeight: 1.1 }}>95%</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>Flipkart</span>
            </div>
          </div>

          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-target-arrow" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>STRONG MATCHES</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px', lineHeight: 1.1 }}>12</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>Above 70%</span>
            </div>
          </div>

          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-file-text" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>APPLICATIONS READY</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px', lineHeight: 1.1 }}>8</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>Updated Resume</span>
            </div>
          </div>

          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ffe4e6', color: '#e11d48', display: 'grid', placeItems: 'center', fontSize: '20px', flexShrink: 0 }}>
              <i className="ti ti-heart" />
            </div>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>SAVED JOBS</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px', lineHeight: 1.1 }}>{savedJobIds.length}</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>For Later</span>
            </div>
          </div>

          <div className="card pad" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>PROFILE STRENGTH</span>
              <b style={{ fontSize: '22px', color: 'var(--ink)', display: 'block', marginTop: '2px', lineHeight: 1.1 }}>96%</b>
              <span style={{ fontSize: '11.5px', color: 'var(--ink3)', display: 'block', marginTop: '2px' }}>Excellent</span>
            </div>
            <Ring value={96} size={50} thickness={6} color="#3b82f6" track="#e2e8f0" inner="#fff" valueColor="#3b82f6" suffix="%" />
          </div>
        </div>
      )}

      {loading && (
        <div
          className="card"
          style={{
            padding: '48px 30px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(79, 70, 229, 0.02))',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--indigo-soft)', display: 'grid', placeItems: 'center' }}>
            <i className="ti ti-loader-2 ti-spin" style={{ fontSize: '32px', color: 'var(--indigo)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18.5px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Matching candidate vector signals against job listings...
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink2)', marginTop: '6px' }}>
              Calculating role fit scores & ranking top matches in real-time.
            </p>
          </div>
        </div>
      )}

      {/* BEFORE MATCHING (0 State): Prominent Call-to-Action Card */}
      {!isMatched && !loading && (
        <div
          className="card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.04), rgba(79, 70, 229, 0.02))',
            border: '2px dashed rgba(124, 58, 237, 0.35)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'var(--indigo-soft)',
              color: 'var(--indigo)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '34px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)'
            }}
          >
            <i className="ti ti-briefcase" />
          </div>

          <div style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Calculate Job Matches from Verified Signals
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink2)', marginTop: '6px', lineHeight: 1.5 }}>
              Click below to parse your uploaded PDF resume, GitHub commit logs, and projects against live job openings to reveal your match scores.
            </p>
          </div>

          <button
            className="btn pri"
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
              background: '#4f46e5'
            }}
            onClick={handleStartMatching}
          >
            <i className="ti ti-sparkles" style={{ fontSize: '18px' }} /> Calculate Job Matches
          </button>
        </div>
      )}

      {/* AFTER MATCHING: Tabs, Job Stream & Insights Sidebar */}
      {isMatched && !loading && (
        <>
          {/* Tabs & Filter Bar Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { id: 'all', label: `All Matches (${jobs.length})` },
                { id: 'high', label: `High Match (80%+)` },
                { id: 'recent', label: `Recent Openings` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    color: activeTab === tab.id ? '#4f46e5' : 'var(--ink3)',
                    borderBottom: activeTab === tab.id ? '2.5px solid #4f46e5' : '2.5px solid transparent',
                    paddingBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12.5px', color: 'var(--ink2)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
              </select>

              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontSize: '12.5px', color: 'var(--ink2)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">Experience Level</option>
                <option value="0-2">0-2 Years</option>
                <option value="2-4">2-4 Years</option>
              </select>
            </div>
          </div>

          {/* Main Grid: Left Jobs Stream (2/3) + Right Insights Sidebar (1/3) */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
            {/* Left Column: Job Cards Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id)

                return (
                  <div
                    key={job.id}
                    className="card pad"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: job.logoBg,
                            color: job.logoColor,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '22px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            flexShrink: 0
                          }}
                        >
                          <i className={`ti ${job.logoIcon}`} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                              {job.title}
                            </h3>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink2)' }}>
                              {job.company}
                            </span>
                            <span
                              className="chip ver"
                              style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', background: '#dcfce7', color: '#15803d' }}
                            >
                              {job.matchPct}% Match
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '12.5px', color: 'var(--ink3)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <i className="ti ti-map-pin" /> {job.location}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <i className="ti ti-briefcase" /> {job.type}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <i className="ti ti-user-check" /> {job.experience}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <b style={{ fontSize: '16px', color: 'var(--ink)', fontWeight: 700 }}>
                            {job.salary}
                          </b>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid var(--line)',
                              borderRadius: '8px',
                              padding: '6px 8px',
                              color: isSaved ? '#e11d48' : 'var(--ink3)',
                              cursor: 'pointer',
                              display: 'grid',
                              placeItems: 'center',
                              transition: 'all 0.15s'
                            }}
                            title={isSaved ? 'Remove from saved' : 'Save job'}
                          >
                            <i className={`ti ${isSaved ? 'ti-bookmark-filled' : 'ti-bookmark'}`} style={{ fontSize: '16px' }} />
                          </button>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>{job.salaryType}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--line)', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {job.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              padding: '3px 10px',
                              fontSize: '11.5px',
                              fontWeight: 500,
                              borderRadius: '6px',
                              background: '#f1f5f9',
                              color: 'var(--ink2)'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.moreSkillsCount > 0 && (
                          <span
                            style={{
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '6px',
                              background: '#e0e7ff',
                              color: '#4f46e5'
                            }}
                          >
                            +{job.moreSkillsCount} more
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--ink3)' }}>
                          {job.postedAgo}
                        </span>
                        <button
                          className="btn"
                          style={{
                            padding: '7px 14px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#4f46e5',
                            background: '#f5f3ff',
                            border: '1px solid #e0e7ff',
                            borderRadius: '8px'
                          }}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column: Sidebar Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                  Why these matches?
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: 'var(--ink2)' }}>
                  {[
                    'Skills match from your resume, GitHub & projects',
                    'Verified skills with high confidence',
                    'Role aligns with your career goal',
                    'Active job openings and recent listings'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                      <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', marginTop: '2px', flexShrink: 0, fontSize: '14px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  How matching works →
                </span>
              </div>

              <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                  Top In-Demand Skills
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {inDemandSkills.map((sk) => (
                    <div key={sk.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{sk.name}</span>
                        <span style={{ fontWeight: 600, color: 'var(--ink3)' }}>{sk.percent}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${sk.percent}%`, height: '100%', background: '#6366f1', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card pad" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', fontSize: '16px' }}>
                    <i className="ti ti-bulb" />
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', margin: 0 }}>
                    Application Tips
                  </h3>
                </div>
                <p style={{ fontSize: '12.5px', color: '#166534', margin: 0, lineHeight: 1.45 }}>
                  Tailor your resume for each role and highlight relevant projects for better responses.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

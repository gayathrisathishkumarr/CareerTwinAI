import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './screens/Dashboard.jsx'
import SkillAnalysis from './screens/SkillAnalysis.jsx'
import Chat from './screens/Chat.jsx'
import Setup from './screens/Setup.jsx'
import Discover from './screens/Discover.jsx'
import Candidate from './screens/Candidate.jsx'
import Projects from './screens/Projects.jsx'
import Resume from './screens/Resume.jsx'

const ComingSoon = ({ title, description, icon }) => {
  const navigate = useNavigate();
  return (
    <div className="placeholder-screen fade">
      <div className="page-h">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className="btn sec-btn" onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left" /> Back to Dashboard
        </button>
      </div>
      <div className="placeholder-content card pad" style={{ textAlign: 'center', padding: '40px' }}>
        <i className={`ti ${icon || 'ti-rocket'} main-icon`} style={{ fontSize: '48px', color: 'var(--brand)', marginBottom: '16px' }} />
        <h2>{title} features are currently syncing</h2>
        <p style={{ color: 'var(--ink2)' }}>Your AI digital twin is processing your workspace integrations.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="canvas fade">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-twin" element={<Setup />} />
            <Route path="/skills" element={<SkillAnalysis />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/github" element={
              <ComingSoon 
                title="GitHub Sync" 
                description="Connect repos to analyze commits and code complexity." 
                icon="ti-brand-github" 
              />
            } />
            <Route path="/learning-path" element={
              <ComingSoon 
                title="Learning Path" 
                description="Personalized roadmap to bridge your skill gaps." 
                icon="ti-route" 
              />
            } />
            <Route path="/chat" element={<Chat />} />
            <Route path="/job-matches" element={
              <ComingSoon 
                title="Job Matches" 
                description="Discover roles matching your twin's verified skill signals." 
                icon="ti-briefcase" 
              />
            } />
            <Route path="/settings" element={
              <ComingSoon 
                title="Settings" 
                description="Manage privacy, notifications, and integration settings." 
                icon="ti-settings" 
              />
            } />
            <Route path="/discover" element={<Discover />} />
            <Route path="/candidate" element={<Candidate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

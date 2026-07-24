import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './screens/Dashboard.jsx'
import SkillAnalysis from './screens/SkillAnalysis.jsx'
import Chat from './screens/Chat.jsx'
import Setup from './screens/Setup.jsx'
import Discover from './screens/Discover.jsx'
import Candidate from './screens/Candidate.jsx'
import PlaceholderScreen from './screens/PlaceholderScreen.jsx'

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
            <Route path="/projects" element={
              <PlaceholderScreen 
                title="Projects" 
                description="Showcase and verify your engineering projects." 
                icon="ti-folder" 
              />
            } />
            <Route path="/resume" element={
              <PlaceholderScreen 
                title="Resume Sync" 
                description="Upload and cross-reference your PDF resume with your twin." 
                icon="ti-file-text" 
              />
            } />
            <Route path="/github" element={
              <PlaceholderScreen 
                title="GitHub Sync" 
                description="Connect repos to analyze commits and code complexity." 
                icon="ti-brand-github" 
              />
            } />
            <Route path="/learning-path" element={
              <PlaceholderScreen 
                title="Learning Path" 
                description="Personalized roadmap to bridge your skill gaps." 
                icon="ti-route" 
              />
            } />
            <Route path="/chat" element={<Chat />} />
            <Route path="/job-matches" element={
              <PlaceholderScreen 
                title="Job Matches" 
                description="Discover roles matching your twin's verified skill signals." 
                icon="ti-briefcase" 
              />
            } />
            <Route path="/settings" element={
              <PlaceholderScreen 
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

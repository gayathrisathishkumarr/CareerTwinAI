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

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="canvas fade">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/skills" element={<SkillAnalysis />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/candidate" element={<Candidate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

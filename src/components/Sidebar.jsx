import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

const proNav = [
  { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/my-twin', icon: 'ti-user', label: 'My Twin' },
  { to: '/skills', icon: 'ti-chart-radar', label: 'Skill Analysis' },
  { to: '/projects', icon: 'ti-folder', label: 'Projects' },
  { to: '/resume', icon: 'ti-file-text', label: 'Resume' },
  { to: '/github', icon: 'ti-brand-github', label: 'GitHub' },
  { to: '/learning-path', icon: 'ti-route', label: 'Learning Path' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'AI Mentor Chat' },
  { to: '/job-matches', icon: 'ti-briefcase', label: 'Job Matches' },
  { to: '/settings', icon: 'ti-settings', label: 'Settings' },
]

const recNav = [
  { to: '/discover', icon: 'ti-users-group', label: 'Discover' },
  { to: '/candidate', icon: 'ti-user-scan', label: 'Candidate' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'Interview the Twin' },
]

export default function Sidebar() {
  const { role, setRole } = useRole()
  const nav = role === 'pro' ? proNav : recNav
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function switchRole(next) {
    setRole(next)
    setDropdownOpen(false)
    navigate(next === 'pro' ? '/' : '/discover')
  }

  return (
    <aside className="side">
      <div className="brand">
        <div className="mark"><i className="ti ti-brain" /></div>
        <div>
          <b>CareerTwin AI</b>
          <span>Your AI Career Twin</span>
        </div>
      </div>

      <div className="nav-list">
        {nav.map((item, i) => (
          <NavLink
            key={item.to + i}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}
          >
            <i className={'ti ' + item.icon} />
            {item.label}
          </NavLink>
        ))}
      </div>



      {/* Sidebar Footer Profile */}
      <div className="side-foot-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div className="av">R</div>
        <div className="profile-info">
          <b>Rounith R.</b>
          <span>Student</span>
        </div>
        <i className={`ti ti-chevron-${dropdownOpen ? 'up' : 'down'} chevron`} />

        {dropdownOpen && (
          <div className="sidebar-dropdown">
            <div className="dropdown-header">Account Mode</div>
            <button 
              className={`dropdown-item ${role === 'pro' ? 'active' : ''}`}
              onClick={() => switchRole('pro')}
            >
              <i className="ti ti-user" /> Professional Mode
            </button>
            <button 
              className={`dropdown-item ${role === 'rec' ? 'active' : ''}`}
              onClick={() => switchRole('rec')}
            >
              <i className="ti ti-briefcase" /> Recruiter Mode
            </button>
            <hr />
            <button className="dropdown-item" onClick={() => navigate('/settings')}>
              <i className="ti ti-settings" /> Settings
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

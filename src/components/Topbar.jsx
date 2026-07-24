import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

export default function Topbar() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  function switchRole(next) {
    setRole(next)
    setDropdownOpen(false)
    navigate(next === 'pro' ? '/' : '/discover')
  }

  return (
    <div className="topbar">
      {/* Search Input Box */}
      <div className="search">
        <i className="ti ti-search" />
        <input type="text" placeholder="Search skills, projects, roles..." disabled />
        <span className="search-kbd">⌘K</span>
      </div>

      <div className="topbar-actions">
        {/* Sun Icon for Theme Toggling */}
        <button 
          className="theme-toggle-btn" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Theme"
        >
          <i className={`ti ti-${isDarkMode ? 'moon' : 'sun'}`} />
        </button>

        {/* Blue Notification Badge (3) */}
        <div className="notification-bell">
          <i className="ti ti-bell" />
          <span className="bell-badge-blue">3</span>
        </div>

        {/* User Profile Selector Dropdown */}
        <div className="profile-selector" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="av">R</div>
          <div className="profile-info">
            <b>Rounith R.</b>
            <span>Student</span>
          </div>
          <i className={`ti ti-chevron-${dropdownOpen ? 'up' : 'down'} chevron`} />

          {dropdownOpen && (
            <div className="profile-dropdown">
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
      </div>
    </div>
  )
}

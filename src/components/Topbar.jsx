import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

export default function Topbar() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function switchRole(next) {
    setRole(next)
    setDropdownOpen(false)
    navigate(next === 'pro' ? '/' : '/discover')
  }

  let user = null
  try { user = JSON.parse(localStorage.getItem('ct_user') || 'null') } catch { /* corrupt entry */ }
  const displayName = user?.name || 'Rounith R.'

  function logout() {
    localStorage.removeItem('ct_token')
    localStorage.removeItem('ct_user')
    window.location.href = '/login'
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
        {/* Blue Notification Badge (3) */}
        <div className="notification-bell">
          <i className="ti ti-bell" />
          <span className="bell-badge-blue">3</span>
        </div>

        {/* User Profile Selector Dropdown */}
        <div className="profile-selector" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="av">{displayName.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <b>{displayName}</b>
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
              <button className="dropdown-item" onClick={() => navigate('/privacy')}>
                <i className="ti ti-shield-lock" /> Privacy Policy
              </button>
              <button className="dropdown-item" onClick={logout} style={{ color: '#dc2626' }}>
                <i className="ti ti-logout" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

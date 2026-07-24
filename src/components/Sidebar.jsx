import React from 'react'
import { NavLink } from 'react-router-dom'
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
  const { role } = useRole()
  const nav = role === 'pro' ? proNav : recNav

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
    </aside>
  )
}

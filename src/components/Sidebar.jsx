import React from 'react'
import { NavLink } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'
import { profile, recruiter } from '../data/mock.js'

const proNav = [
  { group: 'Your twin' },
  { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/skills', icon: 'ti-chart-radar', label: 'Skill analysis' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'Ask your twin', dot: 'live' },
  { to: '/setup', icon: 'ti-plug-connected', label: 'Sources & setup' },
]

const recNav = [
  { group: 'Talent' },
  { to: '/discover', icon: 'ti-users-group', label: 'Discover' },
  { to: '/candidate', icon: 'ti-user-scan', label: 'Candidate' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'Interview the twin' },
]

export default function Sidebar() {
  const { role } = useRole()
  const nav = role === 'pro' ? proNav : recNav
  const who = role === 'pro' ? profile : recruiter

  return (
    <aside className="side">
      <div className="brand">
        <div className="mark"><i className="ti ti-brain" /></div>
        <div>
          <b>CareerTwin</b>
          <span>AI digital twin</span>
        </div>
      </div>

      {nav.map((item, i) =>
        item.group ? (
          <div className="navlabel" key={i}>{item.group}</div>
        ) : (
          <NavLink
            key={item.to + i}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}
          >
            <i className={'ti ' + item.icon} />
            {item.label}
            {item.dot && <span className="dot">{item.dot}</span>}
          </NavLink>
        )
      )}

      <div className="side-foot">
        <div className="av">{who.initials}</div>
        <div>
          <b>{who.name}</b>
          <small>{who.role}</small>
        </div>
      </div>
    </aside>
  )
}

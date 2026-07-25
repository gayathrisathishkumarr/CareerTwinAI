import React from 'react'
import { NavLink } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

const proNavItems = [
  { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/resume', icon: 'ti-file-text', label: 'Resume' },
  { to: '/github', icon: 'ti-brand-github', label: 'GitHub' },
  { to: '/skills', icon: 'ti-chart-radar', label: 'Skill Analysis' },
  { to: '/learning-path', icon: 'ti-route', label: 'Learning Path' },
  { to: '/job-matches', icon: 'ti-briefcase', label: 'Job Matches' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'AI Mentor Chat', isKeyFeature: true }
]

const recNav = [
  { to: '/discover', icon: 'ti-users-group', label: 'Discover' },
  { to: '/candidate', icon: 'ti-user-scan', label: 'Candidate' },
  { to: '/chat', icon: 'ti-message-circle-2', label: 'Interview the Twin', isKeyFeature: true }
]

export default function Sidebar() {
  const { role } = useRole()
  const isRec = role === 'rec'

  return (
    <aside className="side" style={{ overflowY: 'auto' }}>
      <div className="brand">
        <div className="mark"><i className="ti ti-brain" /></div>
        <div>
          <b>CareerTwin AI</b>
          <span>Your AI Career Twin</span>
        </div>
      </div>

      <div className="nav-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {isRec ? (
          recNav.map((item, i) => (
            <NavLink
              key={item.to + i}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}
            >
              <i className={'ti ' + item.icon} />
              {item.label}
            </NavLink>
          ))
        ) : (
          proNavItems.map((item) => {
            if (item.isKeyFeature) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}
                  style={({ isActive }) => ({
                    background: isActive
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : 'linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(79, 70, 229, 0.15))',
                    border: '1px solid rgba(124, 58, 237, 0.45)',
                    boxShadow: isActive ? '0 6px 18px rgba(124, 58, 237, 0.45)' : '0 4px 12px rgba(124, 58, 237, 0.15)',
                    color: '#ffffff',
                    fontWeight: 600,
                    marginTop: '6px'
                  })}
                >
                  <i className={'ti ' + item.icon} style={{ color: '#c4b5fd', fontSize: '18px' }} />
                  <span>{item.label}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    background: '#7c3aed',
                    color: '#fff',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    letterSpacing: '0.04em'
                  }}>
                    KEY
                  </span>
                </NavLink>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}
              >
                <i className={'ti ' + item.icon} />
                {item.label}
              </NavLink>
            )
          })
        )}
      </div>

      {/* Bottom Promo Widget */}
      {!isRec && (
        <div
          style={{
            marginTop: 'auto',
            padding: '16px 14px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(79, 70, 229, 0.12))',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#fff', fontWeight: 600 }}>
            <i className="ti ti-star-filled" style={{ color: '#f59e0b', fontSize: '13px' }} />
            <span>Get better matches</span>
          </div>
          <p style={{ fontSize: '11.5px', color: '#b9bcda', margin: 0, lineHeight: 1.4 }}>
            Complete your skills profile and projects to improve match accuracy.
          </p>
          <NavLink
            to="/skills"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              marginTop: '4px'
            }}
          >
            Improve Profile →
          </NavLink>
        </div>
      )}
    </aside>
  )
}

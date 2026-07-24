import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

export default function Topbar() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()

  function switchRole(next) {
    setRole(next)
    navigate(next === 'pro' ? '/' : '/discover')
  }

  return (
    <div className="topbar">
      <div className="search">
        <i className="ti ti-search" />
        <span>
          {role === 'pro'
            ? 'Ask anything about your career twin…'
            : "Describe the person you're looking for…"}
        </span>
      </div>

      <div className="role-switch">
        <button className={role === 'pro' ? 'on' : ''} onClick={() => switchRole('pro')}>
          <i className="ti ti-user" /> Professional
        </button>
        <button className={role === 'rec' ? 'on' : ''} onClick={() => switchRole('rec')}>
          <i className="ti ti-briefcase" /> Recruiter
        </button>
      </div>

      <div className="pill-sync">
        <span className="lp" /> Twin synced · 2m ago
      </div>
    </div>
  )
}

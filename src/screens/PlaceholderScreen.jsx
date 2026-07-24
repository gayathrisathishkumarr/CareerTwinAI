import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PlaceholderScreen({ title, description, icon }) {
  const navigate = useNavigate()
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

      <div className="placeholder-content card pad">
        <div className="placeholder-graphic">
          <i className={`ti ${icon || 'ti-rocket'} main-icon`} />
        </div>
        <h2>{title} features are currently syncing</h2>
        <p>
          Your AI digital twin is processing your workspace integrations and compiling data.
          This section will update automatically once analysis is complete.
        </p>
        <div className="pulse-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

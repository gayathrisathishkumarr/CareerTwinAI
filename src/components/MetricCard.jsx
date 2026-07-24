import React from 'react'

export default function MetricCard({ label, value, sub, icon, color, bg }) {
  return (
    <div className="metric">
      <div className="ic" style={{ background: bg, color }}>
        <i className={'ti ' + icon} />
      </div>
      <div className="lab">{label}</div>
      <div className="val">{value}</div>
      <div className="sub up">{sub}</div>
    </div>
  )
}

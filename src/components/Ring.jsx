import React from 'react'

export default function Ring({
  value = 0,
  size = 104,
  thickness = 12,
  color = '#0ea5a4',
  track = 'rgba(255,255,255,0.12)',
  inner = '#141032',
  label,
  suffix,
  valueColor = '#fff',
  labelColor = '#9fa3d4',
}) {
  const pct = Math.min(100, Math.max(0, value))
  const inSize = size - thickness * 2
  
  // SVG Circular progress calculations
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <div
      className="ring"
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* SVG Circular Progress Background and Fill */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: 'rotate(-90deg)', // Rotates start point to 12 o'clock
          pointerEvents: 'none',
        }}
      >
        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={track}
          strokeWidth={thickness}
        />
        {/* Progress Circle Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>

      {/* Centered Content Container */}
      <div
        className="inner"
        style={{
          width: inSize,
          height: inSize,
          background: inner,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <b style={{ fontSize: size * 0.23, color: valueColor, lineHeight: 1 }}>
          {value}
          {suffix}
        </b>
        {label && (
          <span style={{ fontSize: 10, color: labelColor, marginTop: 2 }}>{label}</span>
        )}
      </div>
    </div>
  )
}

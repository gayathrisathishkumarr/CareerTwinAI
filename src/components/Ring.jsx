import React, { useState, useEffect, useRef } from 'react'

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
  animate = true
}) {
  // displayVal stays a float during the animation — rounding happens only in
  // the rendered text. Rounding per frame makes the sweep step visibly.
  const [displayVal, setDisplayVal] = useState(animate ? 0 : value)
  const displayRef = useRef(animate ? 0 : value)

  useEffect(() => {
    if (!animate) {
      displayRef.current = value
      setDisplayVal(value)
      return
    }

    // Animate from wherever the ring currently is, not from 0
    const from = displayRef.current
    const to = value
    if (from === to) return

    let startTime = null
    const duration = 1600
    let animFrame

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function (easeOutCubic) for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const current = from + (to - from) * easedProgress
      displayRef.current = current
      setDisplayVal(current)

      if (progress < 1) {
        animFrame = requestAnimationFrame(animateCount)
      }
    }

    animFrame = requestAnimationFrame(animateCount)
    return () => cancelAnimationFrame(animFrame)
  }, [value, animate])

  const pct = Math.min(100, Math.max(0, displayVal))
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
          {Math.round(displayVal)}
          {suffix}
        </b>
        {label && (
          <span style={{ fontSize: 10, color: labelColor, marginTop: 2 }}>{label}</span>
        )}
      </div>
    </div>
  )
}

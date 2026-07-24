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
  return (
    <div
      className="ring"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${pct}%, ${track} 0)`,
      }}
    >
      <div
        className="inner"
        style={{ width: inSize, height: inSize, background: inner }}
      >
        <b style={{ fontSize: size * 0.23, color: valueColor }}>
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

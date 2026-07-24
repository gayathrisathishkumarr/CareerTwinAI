import { useEffect, useState } from 'react'
import { skillBars } from '../data/mock.js'

export default function SkillBars({ bars = skillBars }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {bars.map((b) => (
        <div className="sbar" key={b.name}>
          <div className="top">
            <b>{b.name}</b>
            <span style={{ color: 'var(--ink2)' }}>
              {b.level} · {b.pct}
            </span>
          </div>
          <div className="track">
            <div
              className="fill"
              style={{ width: shown ? b.pct + '%' : 0, background: b.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

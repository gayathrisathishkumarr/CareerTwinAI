import { useEffect, useRef, useState } from 'react'
import { skills } from '../data/mock.js'

export default function SkillConstellation() {
  const boxRef = useRef(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [tip, setTip] = useState(null)

  useEffect(() => {
    const measure = () => {
      if (boxRef.current) {
        setDims({ w: boxRef.current.clientWidth, h: boxRef.current.clientHeight })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { w, h } = dims
  const anchor = skills[0]
  const ax = (anchor.x / 100) * w
  const ay = (anchor.y / 100) * h

  return (
    <>
      <div className="constel" ref={boxRef}>
        {w > 0 &&
          skills.slice(1, 7).map((s, i) => {
            const x = (s.x / 100) * w
            const y = (s.y / 100) * h
            const len = Math.hypot(x - ax, y - ay)
            const angle = Math.atan2(y - ay, x - ax)
            return (
              <div
                key={'l' + i}
                className="link"
                style={{
                  left: ax,
                  top: ay,
                  width: len,
                  transform: `rotate(${angle}rad)`,
                }}
              />
            )
          })}

        {w > 0 &&
          skills.map((s, i) => (
            <div
              key={s.n}
              className={'node' + (s.c === 'em' ? ' em' : '')}
              style={{
                width: s.r * 2,
                height: s.r * 2,
                left: (s.x / 100) * w - s.r,
                top: (s.y / 100) * h - s.r,
                background: s.c === 'em' ? undefined : s.c,
              }}
              onMouseMove={(e) =>
                setTip({ s, x: Math.min(e.clientX + 14, window.innerWidth - 230), y: e.clientY + 14 })
              }
              onMouseLeave={() => setTip(null)}
            >
              {s.n}
            </div>
          ))}
      </div>

      {tip && (
        <div className="tip" style={{ left: tip.x, top: tip.y }}>
          <b>{tip.s.n}</b>
          <div style={{ color: '#9fa3d4', fontSize: 11 }}>{tip.s.lvl}</div>
          <div className="row"><span>Evidence</span><span>{tip.s.ev}</span></div>
          <div className="row"><span>vs peers</span><span>{tip.s.peer}</span></div>
        </div>
      )}
    </>
  )
}

import { growthPath } from '../data/mock.js'

const chipStyle = {
  ver: { className: 'chip ver' },
  amber: { style: { background: 'var(--amber-soft)', color: '#8a5a06' } },
  teal: { style: { background: 'var(--teal-soft)', color: 'var(--teal-d)' } },
}

function nodeStyle(state) {
  if (state === 'done') return { background: 'var(--green-soft)', color: 'var(--green)' }
  if (state === 'now') return { background: 'var(--indigo)', color: '#fff' }
  return { background: 'var(--line)', color: 'var(--ink2)' }
}

export default function GrowthPath() {
  return (
    <div className="path" style={{ marginTop: 6 }}>
      {growthPath.map((s, i) => (
        <div className="step" key={i}>
          <div className="n" style={nodeStyle(s.state)}>
            {s.state === 'done' ? <i className="ti ti-check" /> : i + 1}
          </div>
          <div className="body">
            <b>{s.title}</b>
            <p>{s.desc}</p>
            {s.chips.length > 0 && (
              <div className="meta">
                {s.chips.map((c, j) => {
                  const cfg = chipStyle[c.kind]
                  if (c.kind === 'ver')
                    return (
                      <span className="chip ver" key={j}>
                        <i className="ti ti-rosette-discount-check" /> {c.t}
                      </span>
                    )
                  return (
                    <span className="tag" key={j} style={cfg ? cfg.style : undefined}>
                      {c.t}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

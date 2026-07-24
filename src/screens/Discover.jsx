import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Ring from '../components/Ring.jsx'
import { candidates } from '../data/mock.js'

const chips = ['Ready for senior in 6 months', 'Strong data pipelines', 'Open to relocate']

export default function Discover() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("ML engineers who've shipped models to production and know Rust")

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return candidates
    return candidates.filter((c) => {
      const haystack = `${c.name} ${c.role} ${c.skills.join(' ')}`.toLowerCase()
      return terms.some((t) => haystack.includes(t))
    })
  }, [query])

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Discover talent by asking</h1>
          <p>Query candidate twins in natural language — ranked by verified evidence, not keywords.</p>
        </div>
      </div>

      <div className="card pad" style={{ marginBottom: 18, background: 'linear-gradient(120deg,#f6f4ff,#eefaf9)', borderColor: '#e4e2ff' }}>
        <form
          className="field"
          style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', border: '1px solid var(--line)', borderRadius: 13, padding: '8px 8px 8px 16px' }}
          onSubmit={(e) => e.preventDefault()}
        >
          <i className="ti ti-sparkles" style={{ color: 'var(--violet)', fontSize: 20 }} />
          <input
            style={{ flex: 1, border: 'none', background: 'none', font: 'inherit', fontSize: 14, outline: 'none', color: 'var(--ink)' }}
            aria-label="Describe the candidate you're looking for"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn ai" style={{ padding: '9px 16px' }}><i className="ti ti-search" /> Search twins</button>
        </form>
        <div className="suggest" style={{ marginTop: 12 }}>
          {chips.map((c) => (
            <button key={c} type="button" onClick={() => setQuery(c)}>+ {c}</button>
          ))}
        </div>
      </div>

      <div className="sec-t">
        <i className="ti ti-users-group" />
        <h3>{results.length} matching twins</h3>
        <span className="muted" style={{ marginLeft: 'auto' }}>Sorted by verified fit</span>
      </div>

      <div className="stack" style={{ gap: 12 }}>
        {results.map((c) => (
          <div
            className="cand"
            key={c.name}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/candidate')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/candidate')
              }
            }}
          >
            <div className="av" style={{ background: c.color }}>{c.initials}</div>
            <div className="info">
              <b>{c.name} <span className="chip ver"><i className="ti ti-rosette-discount-check" /> verified</span></b>
              <p>{c.role}</p>
              <div className="sk">{c.skills.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
            <div className="match">
              <Ring value={c.match} size={56} thickness={6} color="var(--green)" track="var(--line)" inner="#fff" valueColor="var(--green)" />
              <small>verified fit</small>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="card pad muted" style={{ textAlign: 'center' }}>
            No twins match that search — try different terms.
          </div>
        )}
      </div>
    </>
  )
}

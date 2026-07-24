import { useNavigate } from 'react-router-dom'
import TwinHero from '../components/TwinHero.jsx'
import MetricCard from '../components/MetricCard.jsx'
import SkillConstellation from '../components/SkillConstellation.jsx'
import { metrics } from '../data/mock.js'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Your living profile</h1>
          <p>A dynamic twin built from your work — not a static résumé.</p>
        </div>
        <button className="btn ai" onClick={() => navigate('/chat')}>
          <i className="ti ti-sparkles" /> Ask your twin
        </button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <TwinHero />
      </div>

      <div className="metrics" style={{ marginBottom: 18 }}>
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card pad">
          <div className="sec-t">
            <i className="ti ti-atom-2" />
            <h3>Skill constellation</h3>
            <span className="muted" style={{ marginLeft: 'auto' }}>Hover a node</span>
          </div>
          <SkillConstellation />
          <div className="legend">
            <span><i style={{ background: '#0ea5a4' }} /> Verified strength</span>
            <span><i style={{ background: '#4f46e5' }} /> Proficient</span>
            <span><i style={{ background: '#f59e0b' }} /> Growing</span>
            <span><i style={{ background: '#dfe2f4', border: '1.5px dashed #b6bbdb' }} /> Emerging</span>
          </div>
        </div>

        <div className="stack">
          <div className="card pad">
            <div className="sec-t"><i className="ti ti-rocket" /><h3>Recommended next</h3></div>
            <div className="step" style={{ paddingBottom: 14 }}>
              <div className="n" style={{ background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>1</div>
              <div className="body"><b>Ship an MLOps project</b><p>Closes your biggest gap for Senior ML roles.</p><div className="meta"><span className="tag">+9% readiness</span></div></div>
            </div>
            <div className="step" style={{ paddingBottom: 14 }}>
              <div className="n" style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}>2</div>
              <div className="body"><b>Verify system design</b><p>Twin flagged this as under-evidenced.</p><div className="meta"><span className="tag" style={{ background: 'var(--teal-soft)', color: 'var(--teal-d)' }}>assessment</span></div></div>
            </div>
            <div className="step">
              <div className="n" style={{ background: 'var(--coral-soft)', color: 'var(--coral)' }}>3</div>
              <div className="body"><b>Deepen Rust</b><p>Emerging signal in 2 side projects.</p></div>
            </div>
          </div>

          <div className="card pad" style={{ background: 'linear-gradient(120deg,#141032,#0e3d52)', border: 'none', color: '#fff' }}>
            <div className="sec-t"><i className="ti ti-message-2-heart" style={{ color: '#7ff0e6' }} /><h3 style={{ color: '#fff' }}>Twin insight</h3></div>
            <p style={{ fontSize: 13, color: '#c9cbef', lineHeight: 1.6 }}>
              "Your Python and data engineering evidence is <b style={{ color: '#fff' }}>top 8%</b> of
              peers. The fastest path up is proving you can run models in production."
            </p>
            <button className="btn" style={{ marginTop: 13, background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff' }} onClick={() => navigate('/chat')}>
              Explore this <i className="ti ti-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

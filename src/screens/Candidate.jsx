import React from 'react'
import { useNavigate } from 'react-router-dom'
import SkillBars from '../components/SkillBars.jsx'
import { useRole } from '../context/RoleContext.jsx'

export default function Candidate() {
  const navigate = useNavigate()
  const { setRole } = useRole()

  function askTwin() {
    setRole('rec')
    navigate('/chat')
  }

  return (
    <>
      <div className="page-h">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Aanya Rao <span className="chip ver"><i className="ti ti-rosette-discount-check" /> Verified twin</span>
          </h1>
          <p>Software engineer · San Francisco · 5 yrs · open to senior ML roles</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn"><i className="ti ti-bookmark" /> Shortlist</button>
          <button className="btn pri"><i className="ti ti-mail" /> Reach out</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div className="stack">
          <div className="ai-summary">
            <div className="h">
              <div className="b"><i className="ti ti-bulb" /></div>
              <div><b>AI assessment for your Senior ML Engineer role</b><small>92% verified fit · read in 20 seconds</small></div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 14 }}>
              Aanya is a strong end-to-end builder with <b>top-8% Python depth</b> and verified
              data-pipeline work across 7 projects. She's growing fast in LLM tooling and Rust.
              The main gap for this role is <b>production MLOps</b>, which she's actively closing.
            </p>
            <div className="sw-cols">
              <div className="sw">
                <div className="t" style={{ color: 'var(--green)' }}><i className="ti ti-trophy" /> Strengths</div>
                <ul>
                  <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Data engineering</li>
                  <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Ships to scale</li>
                  <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Fast learner</li>
                </ul>
              </div>
              <div className="sw">
                <div className="t" style={{ color: 'var(--coral)' }}><i className="ti ti-alert-triangle" /> Watch</div>
                <ul>
                  <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> MLOps evidence</li>
                  <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> No lead role yet</li>
                </ul>
              </div>
              <div className="sw">
                <div className="t" style={{ color: 'var(--indigo)' }}><i className="ti ti-route" /> If hired</div>
                <ul>
                  <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> Ramp: ~4 weeks</li>
                  <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> Senior-ready in 6mo</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card pad">
            <div className="sec-t"><i className="ti ti-chart-radar" /><h3>Evidence-backed capabilities</h3></div>
            <SkillBars />
          </div>
        </div>

        <div className="stack">
          <div className="card pad" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}>
            <div className="sec-t"><i className="ti ti-messages" style={{ color: '#fff' }} /><h3 style={{ color: '#fff' }}>Interview the twin</h3></div>
            <p style={{ fontSize: 12.5, color: '#dcd9ff', lineHeight: 1.55 }}>
              Ask the candidate's twin anything — it answers with cited evidence, 24/7, before
              you spend a call.
            </p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Has she deployed to production?', 'Biggest project impact?', 'Culture & working style?'].map((q) => (
                <button key={q} className="btn" style={{ background: 'rgba(255,255,255,.14)', border: 'none', color: '#fff', justifyContent: 'flex-start' }} onClick={askTwin}>
                  <i className="ti ti-arrow-right" /> {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card pad aside-card">
            <h4>Trust &amp; verification</h4>
            <div className="check-row"><i className="ti ti-brand-github" style={{ color: 'var(--green)' }} /> Code verified from source</div>
            <div className="check-row"><i className="ti ti-git-commit" style={{ color: 'var(--green)' }} /> 842 commits analyzed</div>
            <div className="check-row"><i className="ti ti-users" style={{ color: 'var(--green)' }} /> 6 peer endorsements</div>
            <div className="check-row"><i className="ti ti-shield-check" style={{ color: 'var(--green)' }} /> No inflated claims found</div>
          </div>
        </div>
      </div>
    </>
  )
}

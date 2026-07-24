import React from 'react'
import CapabilityRadar from '../components/CapabilityRadar.jsx'
import SkillBars from '../components/SkillBars.jsx'
import GrowthPath from '../components/GrowthPath.jsx'

export default function SkillAnalysis() {
  return (
    <>
      <div className="page-h">
        <div>
          <h1>Skill analysis</h1>
          <p>What your twin knows, how it knows it, and where to grow.</p>
        </div>
        <button className="btn"><i className="ti ti-download" /> Export evidence pack</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 18 }}>
        <div className="card pad">
          <div className="sec-t"><i className="ti ti-chart-radar" /><h3>Capability radar</h3></div>
          <CapabilityRadar />
          <div className="legend">
            <span><i style={{ background: '#4f46e5' }} /> Your twin</span>
            <span><i style={{ background: '#f59e0b' }} /> Senior ML target</span>
          </div>
        </div>
        <div className="card pad">
          <div className="sec-t"><i className="ti ti-list-details" /><h3>Verified strengths</h3></div>
          <SkillBars />
        </div>
      </div>

      <div className="two" style={{ marginBottom: 18 }}>
        <div className="ai-summary">
          <div className="h">
            <div className="b"><i className="ti ti-bulb" /></div>
            <div><b>Strengths &amp; gaps, analyzed</b><small>Generated from 842 verified signals</small></div>
          </div>
          <div className="sw-cols">
            <div className="sw">
              <div className="t" style={{ color: 'var(--green)' }}><i className="ti ti-trophy" /> Strengths</div>
              <ul>
                <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Data pipelines (verified ×7)</li>
                <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Python depth, top 8%</li>
                <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Ships end-to-end</li>
              </ul>
            </div>
            <div className="sw">
              <div className="t" style={{ color: 'var(--coral)' }}><i className="ti ti-alert-triangle" /> Gaps</div>
              <ul>
                <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Production MLOps</li>
                <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Distributed systems</li>
                <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Team leadership</li>
              </ul>
            </div>
            <div className="sw">
              <div className="t" style={{ color: 'var(--indigo)' }}><i className="ti ti-trending-up" /> Momentum</div>
              <ul>
                <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> Rust +40% (3mo)</li>
                <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> LLM tooling +55%</li>
                <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> 2 new repos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card pad">
        <div className="sec-t"><i className="ti ti-route" /><h3>Personalized growth path → Senior ML Engineer</h3></div>
        <GrowthPath />
      </div>
    </>
  )
}

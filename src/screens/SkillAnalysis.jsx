import React, { useState, useEffect } from 'react'
import CapabilityRadar from '../components/CapabilityRadar.jsx'
import SkillBars from '../components/SkillBars.jsx'
import GrowthPath from '../components/GrowthPath.jsx'

export default function SkillAnalysis() {
  const [hasUploaded, setHasUploaded] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5001/api/resume/latest?t=' + Date.now())
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data && res.data.id) {
          setHasUploaded(true)
        } else {
          setHasUploaded(false)
        }
      })
      .catch(() => setHasUploaded(false))
  }, [])

  const zeroRadar = [0, 0, 0, 0, 0, 0]
  const sampleRadar = [78, 65, 84, 52, 60, 88]

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
          <CapabilityRadar youData={hasUploaded ? sampleRadar : zeroRadar} />
          <div className="legend">
            <span><i style={{ background: '#4f46e5' }} /> Your twin ({hasUploaded ? '78%' : '0%'})</span>
            <span><i style={{ background: '#f59e0b' }} /> Senior ML target</span>
          </div>
        </div>
        <div className="card pad">
          <div className="sec-t"><i className="ti ti-list-details" /><h3>Verified strengths</h3></div>
          <SkillBars isZero={!hasUploaded} />
        </div>
      </div>

      <div className="two" style={{ marginBottom: 18 }}>
        <div className="ai-summary">
          <div className="h">
            <div className="b"><i className="ti ti-bulb" /></div>
            <div>
              <b>Strengths &amp; gaps, analyzed</b>
              <small>{hasUploaded ? 'Generated from sample evidence signals' : '0 signals verified — upload your resume to generate insights'}</small>
            </div>
          </div>
          <div className="sw-cols">
            <div className="sw">
              <div className="t" style={{ color: 'var(--green)' }}><i className="ti ti-trophy" /> Strengths</div>
              <ul>
                {hasUploaded ? (
                  <>
                    <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Data pipelines (verified ×7)</li>
                    <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Python depth, top 8%</li>
                    <li><i className="ti ti-check" style={{ color: 'var(--green)' }} /> Ships end-to-end</li>
                  </>
                ) : (
                  <li><i className="ti ti-minus" style={{ color: 'var(--ink3)' }} /> Pending resume upload</li>
                )}
              </ul>
            </div>
            <div className="sw">
              <div className="t" style={{ color: 'var(--coral)' }}><i className="ti ti-alert-triangle" /> Gaps</div>
              <ul>
                {hasUploaded ? (
                  <>
                    <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Production MLOps</li>
                    <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Distributed systems</li>
                    <li><i className="ti ti-minus" style={{ color: 'var(--coral)' }} /> Team leadership</li>
                  </>
                ) : (
                  <li><i className="ti ti-minus" style={{ color: 'var(--ink3)' }} /> Pending resume upload</li>
                )}
              </ul>
            </div>
            <div className="sw">
              <div className="t" style={{ color: 'var(--indigo)' }}><i className="ti ti-trending-up" /> Momentum</div>
              <ul>
                {hasUploaded ? (
                  <>
                    <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> Rust +40% (3mo)</li>
                    <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> LLM tooling +55%</li>
                    <li><i className="ti ti-arrow-up-right" style={{ color: 'var(--indigo)' }} /> 2 new repos</li>
                  </>
                ) : (
                  <li><i className="ti ti-minus" style={{ color: 'var(--ink3)' }} /> 0 activity signals</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card pad">
        <div className="sec-t"><i className="ti ti-route" /><h3>Personalized growth path → Senior ML Engineer</h3></div>
        <GrowthPath isZero={!hasUploaded} />
      </div>
    </>
  )
}

import React from 'react'
import Ring from '../components/Ring.jsx'

export default function Setup() {
  return (
    <>
      <div className="page-h">
        <div>
          <h1>Build &amp; manage your twin</h1>
          <p>Connect your work — your twin learns and verifies automatically.</p>
        </div>
        <span className="chip ver"><i className="ti ti-lock" /> You control what's shared</span>
      </div>

      <div className="ob-grid">
        <div className="stack">
          <div className="card pad">
            <div className="sec-t"><i className="ti ti-upload" /><h3>Add your evidence</h3></div>
            <div className="drop">
              <div className="ic"><i className="ti ti-file-upload" /></div>
              <b style={{ fontSize: 14 }}>Drop résumé, projects or case studies</b>
              <p className="muted" style={{ marginTop: 4 }}>PDF, DOCX, Markdown — parsed into skill signals</p>
            </div>
          </div>

          <div className="card pad">
            <div className="sec-t"><i className="ti ti-plug-connected" /><h3>Connected sources</h3></div>
            <div className="src">
              <div className="ic" style={{ background: '#eef0f7', color: '#141625' }}><i className="ti ti-brand-github" /></div>
              <div className="info"><b>GitHub</b><br /><small>3 repos analyzed · 842 commits read</small></div>
              <span className="chip ver"><i className="ti ti-check" /> Verified</span>
            </div>
            <div className="src">
              <div className="ic" style={{ background: 'var(--sky-soft)', color: 'var(--sky)' }}><i className="ti ti-brand-linkedin" /></div>
              <div className="info"><b>LinkedIn</b><br /><small>Roles &amp; endorsements imported</small></div>
              <span className="chip ver"><i className="ti ti-check" /> Verified</span>
            </div>
            <div className="src" style={{ borderStyle: 'dashed' }}>
              <div className="ic" style={{ background: 'var(--coral-soft)', color: 'var(--coral)' }}><i className="ti ti-school" /></div>
              <div className="info"><b>Google Scholar</b><br /><small>Add publications &amp; citations</small></div>
              <button className="btn" style={{ padding: '7px 13px' }}>Connect</button>
            </div>
            <div className="src" style={{ borderStyle: 'dashed' }}>
              <div className="ic" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}><i className="ti ti-certificate" /></div>
              <div className="info"><b>Credentials</b><br /><small>Import certificates &amp; assessments</small></div>
              <button className="btn" style={{ padding: '7px 13px' }}>Connect</button>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card pad train">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Twin training</div>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}>
              <Ring value={68} size={130} thickness={13} color="var(--indigo)" track="var(--line)" inner="#fff" label="learning you" valueColor="var(--indigo)" labelColor="var(--ink3)" suffix="%" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Parsed 11 projects</div>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Verified 24 skills</div>
              <div className="check-row"><i className="ti ti-loader-2" style={{ color: 'var(--indigo)' }} /> Cross-checking evidence…</div>
              <div className="check-row"><i className="ti ti-circle" style={{ color: 'var(--ink3)' }} /> Add 1 more source to reach 90%</div>
            </div>
          </div>

          <div className="card pad">
            <div className="sec-t"><i className="ti ti-adjustments" /><h3>Sharing &amp; privacy</h3></div>
            <div className="check-row" style={{ justifyContent: 'space-between' }}><span>Visible to recruiters</span><i className="ti ti-toggle-right-filled" style={{ color: 'var(--green)', fontSize: 26 }} /></div>
            <div className="check-row" style={{ justifyContent: 'space-between' }}><span>Twin can be interviewed</span><i className="ti ti-toggle-right-filled" style={{ color: 'var(--green)', fontSize: 26 }} /></div>
            <div className="check-row" style={{ justifyContent: 'space-between' }}><span>Show salary expectations</span><i className="ti ti-toggle-left" style={{ color: 'var(--ink3)', fontSize: 26 }} /></div>
          </div>
        </div>
      </div>
    </>
  )
}

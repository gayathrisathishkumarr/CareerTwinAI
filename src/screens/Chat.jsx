import React from 'react'
import ChatPanel from '../components/ChatPanel.jsx'
import { useRole } from '../context/RoleContext.jsx'

export default function Chat() {
  const { role } = useRole()
  const isRec = role === 'rec'

  return (
    <>
      <div className="page-h">
        <div>
          <h1>{isRec ? "Interview Aanya's twin" : 'Ask your career twin'}</h1>
          <p>
            {isRec
              ? "Ask the candidate's twin — every answer is evidence-backed."
              : 'Natural-language answers, grounded in verified evidence.'}
          </p>
        </div>
        <span className="chip ver"><i className="ti ti-shield-check" /> Answers cite evidence</span>
      </div>

      <div className="chat-wrap">
        <ChatPanel key={role} />

        <div className="stack">
          <div className="card pad aside-card">
            <h4>Evidence sources</h4>
            <p className="muted" style={{ marginBottom: 6 }}>Every answer is grounded in:</p>
            <div className="check-row"><i className="ti ti-brand-github" style={{ color: 'var(--indigo)' }} /> 3 repositories · 11 projects</div>
            <div className="check-row"><i className="ti ti-file-text" style={{ color: 'var(--teal)' }} /> Résumé + 1 case study</div>
            <div className="check-row"><i className="ti ti-certificate" style={{ color: 'var(--amber)' }} /> 2 skill assessments</div>
          </div>
          <div className="card pad aside-card">
            <h4>{isRec ? 'Recruiters ask' : 'People ask the twin'}</h4>
            <div className="qa"><i className="ti ti-arrow-right" /> {isRec ? 'Has she deployed to production?' : 'Am I ready for a senior role?'}</div>
            <div className="qa"><i className="ti ti-arrow-right" /> {isRec ? 'Biggest project impact?' : 'Compare me to typical ML eng'}</div>
            <div className="qa"><i className="ti ti-arrow-right" /> {isRec ? 'Culture & working style?' : 'What to learn next quarter?'}</div>
          </div>
        </div>
      </div>
    </>
  )
}

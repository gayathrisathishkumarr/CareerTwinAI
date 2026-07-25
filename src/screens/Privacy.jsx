import React from 'react'
import { Link } from 'react-router-dom'

const Section = ({ icon, title, children }) => (
  <div className="card pad" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
    <div style={{
      width: '38px', height: '38px', borderRadius: '10px', background: 'var(--indigo-soft)',
      color: 'var(--indigo)', display: 'grid', placeItems: 'center', fontSize: '18px', flexShrink: 0
    }}>
      <i className={`ti ${icon}`} />
    </div>
    <div style={{ minWidth: 0 }}>
      <h3 style={{ fontSize: '15px', marginBottom: '6px' }}>{title}</h3>
      <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.65 }}>{children}</div>
    </div>
  </div>
)

export default function Privacy() {
  const authed = Boolean(localStorage.getItem('ct_token'))

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 60px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <Link to={authed ? '/' : '/login'} style={{ fontSize: '13px', color: 'var(--indigo)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <i className="ti ti-arrow-left" /> Back to {authed ? 'Dashboard' : 'Sign in'}
        </Link>
        <h1 style={{ fontSize: '26px', marginTop: '12px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13.5px', color: 'var(--ink2)', marginTop: '4px' }}>
          CareerTwin AI follows a <b>consent-based, local-first privacy model</b>, aligned with the
          principles of India's <b>Digital Personal Data Protection (DPDP) Act, 2023</b> and the
          EU's <b>GDPR</b>: explicit consent, purpose limitation, data minimization, transparency,
          and your right to erasure. Last updated: July 25, 2026.
        </p>
      </div>

      <Section icon="ti-checkbox" title="Consent is the legal basis">
        We process your personal data only after you give <b>explicit consent</b> at account creation.
        Your consent is recorded with a timestamp, as the DPDP Act requires. You can withdraw it at any
        time by deleting your data (see "Your rights" below).
      </Section>

      <Section icon="ti-database" title="What we collect, and why">
        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <li><b>Account details</b> — your name and email, to identify your workspace. Passwords are stored only as salted scrypt hashes, never in plain text.</li>
          <li><b>Resume data</b> — the PDF you upload and the text extracted from it (name, contact details, education, experience, skills), used solely to build your AI twin profile.</li>
          <li><b>GitHub data</b> — your <i>public</i> repositories, languages, and commit activity, fetched from the GitHub API to corroborate your skills with code evidence.</li>
          <li><b>Chat questions</b> — what you ask the AI Mentor, used to retrieve matching evidence and generate an answer.</li>
        </ul>
        <p style={{ marginTop: '6px' }}>
          <b>Purpose limitation:</b> this data is used only to power your own dashboard, skill analysis,
          job matching, and mentor chat — nothing else.
        </p>
      </Section>

      <Section icon="ti-device-desktop" title="Where your data lives (local-first)">
        Your resume, extracted profile, and account are stored in a <b>local SQLite database on the
        machine running CareerTwin</b> — not on a cloud server we operate. Uploaded PDFs stay in a
        local folder. Nothing is synced anywhere unless a feature below explicitly sends it.
      </Section>

      <Section icon="ti-cloud-lock" title="Third-party processors we disclose">
        Three external services receive limited data, only when the relevant feature runs:
        <ul style={{ paddingLeft: '18px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <li><b>Groq</b> (primary) and <b>Google Gemini</b> (fallback) — receive your chat question plus short excerpts of your resume/repo evidence, to generate AI Mentor answers.</li>
          <li><b>GitHub API</b> — receives your GitHub username to fetch your public profile and repositories.</li>
        </ul>
        <p style={{ marginTop: '6px' }}>
          These providers process data under their own privacy terms. We send the minimum needed
          (<b>data minimization</b>) and never send your password or full resume file.
        </p>
      </Section>

      <Section icon="ti-user-check" title="Your rights">
        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <li><b>Right to access</b> — everything we extracted is shown to you, in full, on the Resume and Skill Analysis pages.</li>
          <li><b>Right to erasure / withdraw consent</b> — the <b>Reset</b> button on the Resume page permanently deletes your resume records and extracted text from the database.</li>
          <li><b>Right to correction</b> — re-upload an updated resume at any time; the previous analysis is replaced.</li>
        </ul>
      </Section>

      <Section icon="ti-ban" title="What we never do">
        No advertising, no tracking pixels or analytics cookies, no profiling for third parties, and
        your data is <b>never sold or shared</b> with recruiters or anyone else without your action.
      </Section>

      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink3)', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <i className="ti ti-shield-check" style={{ color: '#16a34a' }} />
        Questions about your data? Ask your AI Mentor or contact the CareerTwin team.
      </div>
    </div>
  )
}

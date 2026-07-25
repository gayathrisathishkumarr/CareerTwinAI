import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)

    if (mode === 'register' && !consent) {
      setError('Please review and accept the Privacy Policy to create an account.')
      return
    }

    setBusy(true)
    try {
      const res = await fetch(`http://localhost:5001/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login' ? { email, password } : { name, email, password, consent }
        )
      })
      const data = await res.json()
      if (data.status === 'success' && data.data?.token) {
        localStorage.setItem('ct_token', data.data.token)
        localStorage.setItem('ct_user', JSON.stringify(data.data.user))
        window.location.href = '/'
        return
      }
      if (mode === 'register') {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }
    } catch {
      if (mode === 'register') {
        setError('Could not reach the server. Is the backend running?')
        return
      }
    } finally {
      setBusy(false)
    }

    // DEMO MODE: sign-in always succeeds — unknown credentials get a local
    // guest session so presentations never stall at the door.
    const prefix = (email.split('@')[0] || 'Guest').replace(/[._-]+/g, ' ')
    const guestName = prefix.replace(/\b\w/g, (c) => c.toUpperCase())
    localStorage.setItem('ct_token', 'demo-session')
    localStorage.setItem('ct_user', JSON.stringify({ name: guestName, email: email || 'guest@careertwin.ai' }))
    window.location.href = '/'
  }

  return (
    <div className="login2">
      {/* Brand panel */}
      <div className="login2-brand">
        <div className="login2-brand-inner">
          <div className="brand" style={{ padding: 0, marginBottom: '26px' }}>
            <div className="mark"><i className="ti ti-hexagon-letter-c" /></div>
            <div>
              <b>CareerTwin AI</b>
              <span>Your AI Career Twin</span>
            </div>
          </div>
          <h1>Your career, grounded in evidence.</h1>
          <p>
            CareerTwin builds a living profile from your resume and GitHub — and every
            insight it gives is cited back to your own verified data.
          </p>
          <div className="login2-points">
            <span><i className="ti ti-shield-check" /> Evidence-cited AI answers</span>
            <span><i className="ti ti-database" /> Your data stays on your machine</span>
            <span><i className="ti ti-trash" /> Delete everything anytime</span>
          </div>
        </div>
        <span className="login2-privacy-tag">
          <i className="ti ti-lock" /> Consent-based privacy · aligned with India's DPDP Act 2023 & GDPR principles
        </span>
      </div>

      {/* Form panel */}
      <div className="login2-form-wrap">
        <form className="login2-form card" onSubmit={submit}>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your twin'}</h2>
          <p className="login2-sub">
            {mode === 'login'
              ? 'Sign in to your CareerTwin workspace.'
              : 'Set up your account to start building your AI twin.'}
          </p>

          {mode === 'register' && (
            <label className="login2-field">
              <span>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rounith Rathesh"
                required
              />
            </label>
          )}

          <label className="login2-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="login2-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••••'}
              minLength={mode === 'register' ? 8 : undefined}
              required
            />
          </label>

          {mode === 'register' && (
            <label className="login2-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>
                I consent to CareerTwin processing my resume and GitHub data to build my
                AI twin, as described in the <Link to="/privacy" target="_blank">Privacy Policy</Link>.
                My consent is recorded and I can withdraw it by deleting my data.
              </span>
            </label>
          )}

          {error && (
            <div className="login2-error">
              <i className="ti ti-alert-circle" /> {error}
            </div>
          )}

          <button className="btn pri login2-submit" type="submit" disabled={busy}>
            {busy
              ? <><i className="ti ti-loader-2 ti-spin" /> Please wait…</>
              : mode === 'login' ? <>Sign in <i className="ti ti-arrow-right" /></> : <>Create account <i className="ti ti-arrow-right" /></>}
          </button>

          <div className="login2-switch">
            {mode === 'login' ? (
              <>New to CareerTwin? <button type="button" onClick={() => { setMode('register'); setError(null) }}>Create an account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setMode('login'); setError(null) }}>Sign in</button></>
            )}
          </div>

          {mode === 'login' && (
            <div className="login2-demo">
              <i className="ti ti-sparkles" /> Demo access: <code>demo@careertwin.ai</code> / <code>careertwin123</code>
            </div>
          )}

          <div className="login2-foot">
            <Link to="/privacy"><i className="ti ti-shield-lock" /> Privacy Policy</Link>
            <span>·</span>
            <span>Data stored locally, never sold</span>
          </div>
        </form>
      </div>
    </div>
  )
}

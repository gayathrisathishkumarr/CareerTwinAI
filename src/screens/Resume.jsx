import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import Ring from '../components/Ring.jsx'

function AnimatedBar({ label, icon, value = 0, color = 'var(--indigo)' }) {
  // val stays a float during the animation — rounded only for the label text,
  // so the bar width sweeps continuously instead of stepping per percent
  const [val, setVal] = useState(0)
  const valRef = useRef(0)

  useEffect(() => {
    const from = valRef.current
    const to = value
    if (from === to) return
    let startTime = null
    const duration = 1600
    let frame
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      valRef.current = current
      setVal(current)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
        <span style={{ color: 'var(--ink2)' }}><i className={`ti ${icon}`} /> {label}</span>
        <span style={{ fontWeight: 600, color: 'var(--indigo)' }}>{Math.round(val)}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
    </div>
  )
}

// Cleans PDF-extraction artifacts: this resume's font maps "2" to \x16,
// so restore it, then strip any remaining control chars and tidy whitespace
const clean = (str) =>
  String(str || '')
    .replace(/\x16/g, '2')
    .replace(/[\x00-\x08\x0b-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// SQLite CURRENT_TIMESTAMP is UTC without a zone marker — normalize before parsing
function timeAgo(dateStr) {
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(String(dateStr))
    ? dateStr
    : String(dateStr).replace(' ', 'T') + 'Z'
  const then = new Date(iso)
  if (isNaN(then)) return 'Just now'
  const mins = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const BADGE_COLORS = [
  { bg: '#fef3c7', fg: '#b45309' },
  { bg: '#dbeafe', fg: '#1d4ed8' },
  { bg: '#dcfce7', fg: '#15803d' },
  { bg: '#e0f2fe', fg: '#0369a1' },
  { bg: '#ede9fe', fg: '#6d28d9' },
  { bg: '#ffe4e6', fg: '#be123c' },
  { bg: '#f1f5f9', fg: '#475569' }
]

export default function Resume() {
  const [latestResume, setLatestResume] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [twinProfile, setTwinProfile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  const fetchAll = () => {
    fetch('http://localhost:5001/api/resume/latest')
      .then((res) => res.json())
      .then((res) => setLatestResume(res.status === 'success' && res.data ? res.data : null))
      .catch(() => setLatestResume(null))

    fetch('http://localhost:5001/api/resume/analyze')
      .then((res) => res.json())
      .then((res) => setAnalysis(res.data || null))
      .catch(() => setAnalysis(null))

    fetch('http://localhost:5001/api/twin/profile')
      .then((res) => res.json())
      .then((res) => setTwinProfile(res.status === 'success' ? res.data : null))
      .catch(() => setTwinProfile(null))
  }

  useEffect(() => { fetchAll() }, [])

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Please select a valid PDF file.')
      return
    }

    setUploadError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const res = await fetch('http://localhost:5001/api/resume/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.status !== 'success') {
        setUploadError(data.message || 'Upload failed. Please try again.')
      }
    } catch {
      setUploadError('Could not reach the server. Is the backend running?')
    } finally {
      setUploading(false)
      fetchAll()
    }
  }

  const handleDeleteResume = async () => {
    try {
      await fetch('http://localhost:5001/api/resume/delete', { method: 'DELETE' })
    } catch {
      // Ignore errors
    }
    fetchAll()
  }

  const isUploaded = latestResume !== null
  const extractedText = latestResume?.extracted_text || latestResume?.extractedText || ''

  // ---- All display values derived from real extraction / twin analysis ----
  const readiness = twinProfile?.careerReadiness || 0
  const confidence = twinProfile?.confidence || 0
  const score = Math.round((readiness + confidence) / 2)
  const scoreBand = score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 50 ? 'Fair' : 'Building'
  const atsPass = extractedText.length > 100
  const careerStage = twinProfile?.careerStage || '—'
  const experienceLevel = twinProfile?.experienceLevel || '—'
  const strengthChip = experienceLevel === 'Advanced' ? { label: 'Strong', bg: '#e6f6ec', fg: '#16a34a' }
    : experienceLevel === 'Intermediate' ? { label: 'Solid', bg: '#fef3c7', fg: '#b45309' }
    : { label: 'Building', bg: '#f1f5f9', fg: '#64748b' }

  const skillsObj = analysis?.skills || {}
  const allSkills = [
    ...(skillsObj.programmingLanguages || []),
    ...(skillsObj.frameworks || []),
    ...(skillsObj.libraries || []),
    ...(skillsObj.databases || []),
    ...(skillsObj.tools || []),
    ...(skillsObj.cloud || [])
  ]
  const techCategories = ['programmingLanguages', 'frameworks', 'libraries', 'databases', 'tools', 'cloud']
  const keywordCoverage = Math.round(
    (techCategories.filter((c) => (skillsObj[c] || []).length > 0).length / techCategories.length) * 100
  )

  // Skill level from how often the resume actually mentions it
  // (whole-word matching — substring counting breaks on short names like "R")
  const countMentions = (text, skill) => {
    const esc = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return (text.match(new RegExp(`(?<![\\w+#])${esc}(?![\\w+#])`, 'gi')) || []).length
  }
  const skillRows = allSkills.slice(0, 6).map((skill, idx) => {
    const mentions = countMentions(extractedText, skill)
    return {
      name: skill,
      badge: skill.slice(0, 2),
      color: BADGE_COLORS[idx % BADGE_COLORS.length],
      level: mentions >= 3 ? 'Advanced' : mentions === 2 ? 'Intermediate' : 'Beginner',
      pct: Math.min(100, mentions * 30 + 10)
    }
  })
  const overflowSkills = allSkills.slice(6, 10)
  const overflowMore = Math.max(0, allSkills.length - 10)

  const personal = analysis?.personal || {}
  const education = analysis?.education?.[0]
  const cgpaMatch = clean(extractedText).match(/CGPA[:\s]*([\d.]+\s*\/\s*\d+|[\d.]+)/i)

  // Experience extraction returns the raw line "Role | Company | Dates" — split it
  const expParts = (analysis?.experience?.[0]?.role || '').split('|').map((p) => clean(p)).filter(Boolean)
  const expRole = expParts[0] || null
  const expCompany = expParts[1] || null
  const expDates = expParts[2] || null

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0])
          }
        }}
      />

      {/* Top Header */}
      <div className="page-h">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>Resume Sync</h1>
            <span
              className={isUploaded ? 'chip ver' : 'chip'}
              style={{ fontSize: '11.5px', background: isUploaded ? '#e6f6ec' : '#f1f5f9', color: isUploaded ? '#16a34a' : 'var(--ink3)' }}
            >
              <i className={isUploaded ? 'ti ti-check' : 'ti ti-clock'} /> {isUploaded ? 'Up to date' : 'Not Uploaded'}
            </span>
          </div>
          <p>Upload and cross-reference your PDF resume with your AI twin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn pri" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            <i className="ti ti-upload" /> {isUploaded ? 'Re-upload Resume' : 'Upload Resume'}
          </button>
          {isUploaded && (
            <button className="btn" onClick={handleDeleteResume} style={{ color: '#dc2626' }}>
              <i className="ti ti-trash" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* BEFORE UPLOADING STATE: Big Upload Prominent Card */}
      {!isUploaded && !uploading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0])
            }
          }}
          className="card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            borderRadius: '20px',
            border: dragOver ? '2px dashed var(--indigo)' : '2px dashed rgba(124, 58, 237, 0.35)',
            background: dragOver ? 'rgba(124, 58, 237, 0.08)' : 'linear-gradient(135deg, rgba(124, 58, 237, 0.04), rgba(79, 70, 229, 0.02))',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'var(--indigo-soft)', color: 'var(--indigo)',
              display: 'grid', placeItems: 'center', fontSize: '34px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)'
            }}
          >
            <i className="ti ti-cloud-upload" />
          </div>

          <div style={{ maxWidth: '460px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Upload your PDF Resume
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink2)', marginTop: '6px', lineHeight: 1.5 }}>
              Drag & drop your PDF file here, or click to browse. We'll automatically extract your skills, work history, projects, and ground your AI Twin.
            </p>
          </div>

          <button
            className="btn pri"
            style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)' }}
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current && fileInputRef.current.click()
            }}
          >
            <i className="ti ti-file-upload" style={{ fontSize: '18px' }} /> Select PDF File to Upload
          </button>

          <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>
            Supports PDF files up to 5MB. Your data stays private & encrypted.
          </span>

          {uploadError && (
            <div style={{ color: '#dc2626', fontSize: '13px', background: '#fee2e2', padding: '8px 16px', borderRadius: '8px', marginTop: '4px' }}>
              <i className="ti ti-alert-circle" /> {uploadError}
            </div>
          )}
        </div>
      )}

      {/* UPLOADING LOADING STATE */}
      {uploading && (
        <div
          className="card"
          style={{
            padding: '50px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '16px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(79, 70, 229, 0.02))',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--indigo-soft)', display: 'grid', placeItems: 'center' }}>
            <i className="ti ti-loader-2 ti-spin" style={{ fontSize: '32px', color: 'var(--indigo)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18.5px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Reading PDF, extracting skills & grounding your AI Twin...
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--indigo)', marginTop: '6px', fontWeight: 500 }}>
              Please wait • Processing document signals
            </p>
          </div>
        </div>
      )}

      {/* BEFORE UPLOAD STATS: zero values */}
      {!isUploaded && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', opacity: uploading ? 0.4 : 1 }}>
          <div className="card pad" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '80px', height: '105px', background: '#f8fafc', border: '1px dashed var(--line)',
                borderRadius: '10px', display: 'grid', placeItems: 'center', color: 'var(--ink3)'
              }}>
                <i className="ti ti-file-x" style={{ fontSize: '28px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink3)' }}>No Resume Selected</h3>
                <span style={{ fontSize: '12.5px', color: 'var(--ink3)', display: 'block', marginTop: '4px' }}>
                  Upload a PDF to view extracted metrics
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '20px', borderLeft: '1px solid var(--line)' }}>
              <span className="eyebrow" style={{ marginBottom: '10px', fontSize: '11px' }}>Career Resume Score</span>
              <Ring
                value={0}
                size={120}
                thickness={11}
                color="#cbd5e1"
                track="var(--line)"
                inner="#fff"
                label="Not Uploaded"
                valueColor="#94a3b8"
                labelColor="#94a3b8"
                suffix="%"
              />
            </div>
          </div>

          <div className="card pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="sec-t" style={{ marginBottom: '14px' }}>
                <i className="ti ti-sparkles" style={{ color: 'var(--ink3)' }} />
                <h3 style={{ color: 'var(--ink3)' }}>AI Resume Analysis</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--ink3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Overall Strength</span>
                  <strong>Pending</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Career Stage</span>
                  <strong>—</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Resume Quality Score</span>
                  <strong>0%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AFTER UPLOADING STATE */}
      {isUploaded && (
        <>
          {/* Top Grid: Resume file + score panel | AI analysis */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px' }}>
            {/* Left card: file details + stat tiles + score panel */}
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', overflow: 'hidden' }}>
              {/* File info + tiles */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '76px', height: '100px', background: '#f8fafc', border: '1px solid var(--line)',
                      borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ width: '100%', height: '4px', background: '#cbd5e1', borderRadius: '2px' }} />
                      <div style={{ width: '70%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                      <div style={{ width: '85%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                      <div style={{ width: '60%', height: '3px', background: '#e2e8f0', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: 'var(--indigo)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                      PDF
                    </span>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--ink)', wordBreak: 'break-all' }}>
                        {latestResume.original_filename || latestResume.originalFilename || latestResume.filename || 'Uploaded_Resume.pdf'}
                      </h3>
                      <span className="chip ver" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                        <i className="ti ti-check" /> Active
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: atsPass ? '#16a34a' : '#b45309', fontSize: '13px', fontWeight: 500 }}>
                      <i className={`ti ${atsPass ? 'ti-circle-check-filled' : 'ti-alert-circle'}`} />
                      <span>{atsPass ? 'Text extracted & synced' : 'Text extraction incomplete'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px', color: 'var(--ink2)', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-calendar" style={{ color: 'var(--ink3)' }} />
                        <span>Uploaded: <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{timeAgo(latestResume.uploaded_at)}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-refresh" style={{ color: 'var(--ink3)' }} />
                        <span>Sync status: <strong style={{ color: '#16a34a', fontWeight: 600 }}>● Grounded in AI Twin</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat tiles — all real signals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="ti ti-cpu" style={{ color: 'var(--indigo)' }} /> ATS Parsing
                    </span>
                    <strong style={{ fontSize: '16px', color: atsPass ? '#16a34a' : '#b45309', display: 'block', marginTop: '4px' }}>
                      {atsPass ? 'Pass' : 'Partial'}
                    </strong>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="ti ti-list-check" style={{ color: 'var(--indigo)' }} /> Skills Found
                    </span>
                    <strong style={{ fontSize: '16px', color: 'var(--ink)', display: 'block', marginTop: '4px' }}>
                      {allSkills.length}
                    </strong>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="ti ti-stairs-up" style={{ color: 'var(--indigo)' }} /> Level
                    </span>
                    <strong style={{ fontSize: '16px', color: 'var(--ink)', display: 'block', marginTop: '4px' }}>
                      {experienceLevel}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Score panel */}
              <div
                style={{
                  padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '14px',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(14, 165, 164, 0.05))',
                  borderLeft: '1px solid var(--line)'
                }}
              >
                <span className="eyebrow" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>Career Resume Score</span>
                <Ring
                  value={score}
                  size={132}
                  thickness={12}
                  color="var(--indigo)"
                  track="rgba(99, 102, 241, 0.15)"
                  inner="#fff"
                  label={`${scoreBand} · of 100`}
                  valueColor="var(--indigo)"
                  labelColor="var(--ink3)"
                />
                <span
                  className="chip"
                  style={{ fontSize: '11.5px', background: '#fff', color: 'var(--indigo)', border: '1px solid rgba(99, 102, 241, 0.25)', fontWeight: 600 }}
                >
                  <i className="ti ti-trending-up" /> {careerStage} profile
                </span>
              </div>
            </div>

            {/* Right card: AI Resume Analysis */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="sec-t" style={{ marginBottom: 0 }}>
                <i className="ti ti-sparkles" style={{ color: 'var(--indigo)' }} />
                <h3>AI Resume Analysis</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-shield-check" /> Overall Strength
                </span>
                <span className="chip" style={{ background: strengthChip.bg, color: strengthChip.fg, fontWeight: 600 }}>
                  {strengthChip.label}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-briefcase" /> Career Stage
                </span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{careerStage}</span>
              </div>
              <AnimatedBar label="Career Readiness" icon="ti-chart-bar" value={readiness} />
              <AnimatedBar label="Resume Quality" icon="ti-file-text" value={confidence} color="#0ea5a4" />
              <AnimatedBar label="Keyword Coverage" icon="ti-target" value={keywordCoverage} color="#7c3aed" />
            </div>
          </div>

          {/* Bottom Grid: Extracted Information | Extracted Skills */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
            {/* Extracted Information */}
            <div className="card pad">
              <div className="sec-t" style={{ marginBottom: '20px' }}>
                <i className="ti ti-user-check" style={{ color: 'var(--indigo)' }} />
                <h3>Extracted Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Personal Details — from live extraction */}
                <div>
                  <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    Personal Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    {clean(personal.fullName) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-user" style={{ color: 'var(--ink3)', width: '16px' }} />
                        <span style={{ color: 'var(--ink2)', width: '55px' }}>Name</span>
                        <strong style={{ color: 'var(--ink)' }}>{clean(personal.fullName)}</strong>
                      </div>
                    )}
                    {personal.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-mail" style={{ color: 'var(--ink3)', width: '16px' }} />
                        <span style={{ color: 'var(--ink2)', width: '55px' }}>Email</span>
                        <span style={{ color: 'var(--ink)' }}>{personal.email}</span>
                      </div>
                    )}
                    {clean(personal.phone) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-phone" style={{ color: 'var(--ink3)', width: '16px' }} />
                        <span style={{ color: 'var(--ink2)', width: '55px' }}>Phone</span>
                        <span style={{ color: 'var(--ink)' }}>{clean(personal.phone)}</span>
                      </div>
                    )}
                    {personal.linkedIn && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-brand-linkedin" style={{ color: 'var(--ink3)', width: '16px' }} />
                        <span style={{ color: 'var(--ink2)', width: '55px' }}>LinkedIn</span>
                        <span style={{ color: 'var(--ink)', wordBreak: 'break-all' }}>{personal.linkedIn}</span>
                      </div>
                    )}
                    {personal.gitHub && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-brand-github" style={{ color: 'var(--ink3)', width: '16px' }} />
                        <span style={{ color: 'var(--ink2)', width: '55px' }}>GitHub</span>
                        <NavLink to="/github" style={{ color: 'var(--indigo)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}>
                          {personal.gitHub} <i className="ti ti-arrow-up-right" style={{ fontSize: '12px' }} />
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education — from live extraction */}
                <div>
                  <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    <i className="ti ti-school" /> Education
                  </h4>
                  {education ? (
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                      <strong style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
                        {clean(education.degree) || 'Degree'}
                      </strong>
                      {clean(education.institution) && (
                        <span style={{ fontSize: '12.5px', color: 'var(--ink2)', display: 'block', marginTop: '2px' }}>
                          {clean(education.institution)}
                        </span>
                      )}
                      {clean(education.graduationYear) && (
                        <span style={{ fontSize: '12px', color: 'var(--ink3)', display: 'block', marginTop: '4px' }}>
                          {clean(education.graduationYear)}
                        </span>
                      )}
                      {cgpaMatch && (
                        <span className="chip ver" style={{ marginTop: '8px', fontSize: '11px', background: '#e6f6ec', color: '#16a34a' }}>
                          CGPA: {cgpaMatch[1]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>No education section detected.</p>
                  )}
                </div>

                {/* Experience — from live extraction */}
                <div>
                  <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    <i className="ti ti-briefcase" /> Experience
                  </h4>
                  {expRole ? (
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                      <strong style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>{expRole}</strong>
                      {expCompany && (
                        <span style={{ fontSize: '12.5px', color: 'var(--ink2)', display: 'block', marginTop: '2px' }}>{expCompany}</span>
                      )}
                      {expDates && (
                        <span style={{ fontSize: '12px', color: 'var(--ink3)', display: 'block', marginTop: '4px' }}>{expDates}</span>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12.5px', color: 'var(--ink3)' }}>No experience section detected.</p>
                  )}
                </div>
              </div>

              {/* Extracted text preview — dark code-style block */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  <i className="ti ti-code" /> Extracted Text Preview
                </h4>
                <div
                  style={{
                    padding: '16px 18px', background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '12px',
                    fontSize: '12.5px', color: 'var(--ink2)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    lineHeight: 1.65, maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                  }}
                >
                  {clean(extractedText).slice(0, 600) || 'No text could be extracted from this PDF.'}
                  {clean(extractedText).length > 600 && '…'}
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                  <i className="ti ti-code" style={{ color: 'var(--indigo)' }} /> Extracted Skills
                </h3>
                <span className="chip ver" style={{ fontSize: '11px', background: '#e6f6ec', color: '#16a34a', fontWeight: 600 }}>
                  {allSkills.length} verified
                </span>
              </div>

              {skillRows.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {skillRows.map((s) => (
                    <div key={s.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span
                          style={{
                            width: '28px', height: '28px', borderRadius: '8px', background: s.color.bg, color: s.color.fg,
                            display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0
                          }}
                        >
                          {s.badge}
                        </span>
                        <b style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{s.name}</b>
                        <span style={{ fontSize: '11px', color: 'var(--ink3)', fontWeight: 500 }}>{s.level}</span>
                        <i className="ti ti-circle-check-filled" style={{ color: '#16a34a', fontSize: '15px' }} />
                      </div>
                      <div style={{ height: '5px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #7c3aed)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '12.5px', color: 'var(--ink3)', textAlign: 'center', padding: '12px 0' }}>
                  No skills detected in the extracted text.
                </p>
              )}

              {(overflowSkills.length > 0 || overflowMore > 0) && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid var(--line)' }}>
                  {overflowSkills.map((sk) => (
                    <span key={sk} style={{ fontSize: '11px', background: '#f1f5f9', color: 'var(--ink2)', padding: '4px 10px', borderRadius: '8px', fontWeight: 500 }}>
                      {sk}
                    </span>
                  ))}
                  {overflowMore > 0 && (
                    <span style={{ fontSize: '11px', background: 'var(--indigo-soft)', color: 'var(--indigo)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                      +{overflowMore} more
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: 'var(--ink3)', paddingTop: '4px' }}>
                <i className="ti ti-lock" /> Your data stays private & encrypted
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import Ring from '../components/Ring.jsx'

export default function Setup() {
  const [latestResume, setLatestResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchLatestResume()
  }, [])

  const fetchLatestResume = () => {
    fetch('http://localhost:5001/api/resume/latest?t=' + Date.now())
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data && res.data.id) {
          setLatestResume(res.data)
        } else {
          setLatestResume(null)
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch latest resume:', err)
        setLatestResume(null)
      })
  }

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadFile = (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported currently.')
      return
    }

    setUploading(true)
    setUploadError('')

    const formData = new FormData()
    formData.append('resume', file)

    fetch('http://localhost:5001/api/resume/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setUploading(false)
        if (res.status === 'success') {
          setLatestResume(res.data)
          alert('Resume uploaded and analyzed successfully! Your Twin training is updating.')
        } else {
          setUploadError(res.message || 'Failed to upload resume.')
        }
      })
      .catch((err) => {
        setUploading(false)
        setUploadError('Network error. Is the backend server running?')
        console.error('Upload error:', err)
      })
  }

  const handleDeleteResume = (e) => {
    if (e) e.stopPropagation()
    fetch('http://localhost:5001/api/resume/delete', { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setLatestResume(null)
        setUploadError('')
      })
      .catch((err) => console.warn('Failed to delete resume:', err))
  }

  const handleReplaceResume = (e) => {
    if (e) e.stopPropagation()
    fetch('http://localhost:5001/api/resume/delete', { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setLatestResume(null)
        setUploadError('')
        if (fileInputRef.current) {
          fileInputRef.current.click()
        }
      })
      .catch((err) => console.warn('Failed to delete resume:', err))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    uploadFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    uploadFile(file)
  }

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
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf"
              onChange={handleFileChange}
            />
            <div
              className={`drop ${isDragOver ? 'drag-over' : ''}`}
              onClick={!latestResume ? triggerFileSelect : undefined}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                cursor: !latestResume ? 'pointer' : 'default',
                border: isDragOver
                  ? '2px dashed var(--indigo)'
                  : latestResume
                  ? '1px solid var(--green, #10b981)'
                  : '1px dashed var(--line)',
                background: isDragOver
                  ? 'var(--indigo-soft)'
                  : latestResume
                  ? 'var(--green-soft, #ecfdf5)'
                  : 'none',
                transition: 'all 0.15s ease',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div className="ic" style={{ marginBottom: 8 }}>
                {uploading ? (
                  <i className="ti ti-loader-2 ti-spin" style={{ color: 'var(--indigo)', fontSize: 32 }} />
                ) : latestResume ? (
                  <i className="ti ti-circle-check-filled" style={{ color: 'var(--green, #10b981)', fontSize: 36 }} />
                ) : (
                  <i className="ti ti-file-upload" style={{ fontSize: 32 }} />
                )}
              </div>
              <b style={{ fontSize: 14 }}>
                {uploading ? (
                  'Uploading and extracting resume...'
                ) : latestResume ? (
                  <span style={{ color: 'var(--green-dark, #047857)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-check" /> Resume Uploaded &amp; Synced
                  </span>
                ) : (
                  'Click to select or drop your resume (PDF)'
                )}
              </b>
              <p className="muted" style={{ marginTop: 4 }}>
                {latestResume
                  ? `Connected: ${latestResume.original_filename || latestResume.originalFilename || latestResume.filename || 'Resume.pdf'}`
                  : 'PDF files are parsed into skill signals'}
              </p>
              
              {latestResume && !uploading && (
                <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleReplaceResume}
                    className="btn"
                    style={{
                      fontSize: 12,
                      padding: '6px 14px',
                      background: 'var(--indigo-soft, #e0e7ff)',
                      color: 'var(--indigo, #4f46e5)',
                      border: '1px solid var(--indigo, #4f46e5)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <i className="ti ti-refresh" /> Replace PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    className="btn"
                    style={{
                      fontSize: 12,
                      padding: '6px 14px',
                      background: '#fef2f2',
                      color: '#ef4444',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <i className="ti ti-trash" /> Remove Data
                  </button>
                </div>
              )}

              {uploadError && (
                <p className="error-text" style={{ color: 'var(--coral)', fontSize: 12, marginTop: 6, fontWeight: 500 }}>
                  {uploadError}
                </p>
              )}
            </div>

            {/* Extracted Text Preview Below Uploader */}
            {latestResume && (latestResume.extracted_text || latestResume.extractedText) && (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <b style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-file-text" style={{ color: 'var(--indigo)' }} /> Extracted Resume Text
                  </b>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>
                    {(latestResume.extracted_text || latestResume.extractedText || '').length} characters extracted
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--bg, #f8fafc)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--ink2, #334155)'
                  }}
                >
                  {latestResume.extracted_text || latestResume.extractedText}
                </div>
              </div>
            )}
          </div>

          <div className="card pad">
            <div className="sec-t"><i className="ti ti-plug-connected" /><h3>Connected sources</h3></div>
            {latestResume && (
              <div className="src" style={{ animation: 'fadeIn 0.4s ease' }}>
                <div className="ic" style={{ background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>
                  <i className="ti ti-file-text" />
                </div>
                <div className="info">
                  <b>Resume ({latestResume.original_filename || latestResume.originalFilename || latestResume.filename || 'Uploaded Resume'})</b>
                  <br />
                  <small>
                    Extracted {(latestResume.extracted_text || latestResume.extractedText || '').length} characters · {Math.round((latestResume.filesize || 0) / 1024)} KB
                  </small>
                </div>
                <span className="chip ver"><i className="ti ti-check" /> Synced</span>
              </div>
            )}
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
          <div className="card pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Twin training</div>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: 18 }}>
              <Ring value={latestResume ? 68 : 0} size={130} thickness={13} color="var(--indigo)" track="var(--line)" inner="#fff" label={latestResume ? "learning you" : "empty twin"} valueColor="var(--indigo)" labelColor="var(--ink3)" suffix="%" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: '240px', textAlign: 'left' }}>
              <div className="check-row">
                <i className={latestResume ? "ti ti-circle-check-filled" : "ti ti-circle"} style={{ color: latestResume ? 'var(--green)' : 'var(--ink3)' }} /> 
                {latestResume ? 'Parsed 11 projects' : 'Parsed 0 projects'}
              </div>
              <div className="check-row">
                <i className={latestResume ? "ti ti-circle-check-filled" : "ti ti-circle"} style={{ color: latestResume ? 'var(--green)' : 'var(--ink3)' }} /> 
                {latestResume ? 'Verified 24 skills' : 'Verified 0 skills'}
              </div>
              <div className="check-row">
                <i className={latestResume ? "ti ti-loader-2 ti-spin" : "ti ti-circle"} style={{ color: latestResume ? 'var(--indigo)' : 'var(--ink3)' }} /> 
                {latestResume ? 'Cross-checking evidence…' : 'Pending resume upload'}
              </div>
              <div className="check-row">
                <i className="ti ti-circle" style={{ color: 'var(--ink3)' }} /> 
                {latestResume ? 'Add 1 more source to reach 90%' : 'Upload resume to reach 68%'}
              </div>
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

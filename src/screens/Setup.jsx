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
    fetch('http://localhost:5001/api/resume/latest')
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setLatestResume(res.data)
        }
      })
      .catch((err) => console.warn('Failed to fetch latest resume:', err))
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
              onClick={triggerFileSelect}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                cursor: 'pointer',
                border: isDragOver ? '2px dashed var(--indigo)' : '1px dashed var(--line)',
                background: isDragOver ? 'var(--indigo-soft)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div className="ic">
                {uploading ? (
                  <i className="ti ti-loader-2 ti-spin" style={{ color: 'var(--indigo)' }} />
                ) : (
                  <i className="ti ti-file-upload" />
                )}
              </div>
              <b style={{ fontSize: 14 }}>
                {uploading ? 'Uploading and analyzing resume...' : 'Click to select or drop your resume (PDF)'}
              </b>
              <p className="muted" style={{ marginTop: 4 }}>
                {latestResume ? `Connected: ${latestResume.originalFilename}` : 'PDF files are parsed into skill signals'}
              </p>
              {uploadError && (
                <p className="error-text" style={{ color: 'var(--coral)', fontSize: 12, marginTop: 6, fontWeight: 500 }}>
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          <div className="card pad">
            <div className="sec-t"><i className="ti ti-plug-connected" /><h3>Connected sources</h3></div>
            {latestResume && (
              <div className="src" style={{ animation: 'fadeIn 0.4s ease' }}>
                <div className="ic" style={{ background: 'var(--indigo-soft)', color: 'var(--indigo)' }}>
                  <i className="ti ti-file-text" />
                </div>
                <div className="info">
                  <b>Resume ({latestResume.originalFilename})</b>
                  <br />
                  <small>Extracted {latestResume.extractedText ? latestResume.extractedText.length : 0} characters · {Math.round(latestResume.filesize / 1024)} KB</small>
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
              <Ring value={68} size={130} thickness={13} color="var(--indigo)" track="var(--line)" inner="#fff" label="learning you" valueColor="var(--indigo)" labelColor="var(--ink3)" suffix="%" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: '240px', textAlign: 'left' }}>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Parsed 11 projects</div>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Verified 24 skills</div>
              <div className="check-row"><i className="ti ti-loader-2 ti-spin" style={{ color: 'var(--indigo)' }} /> Cross-checking evidence…</div>
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

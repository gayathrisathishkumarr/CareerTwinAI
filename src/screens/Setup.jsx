import React, { useRef, useState, useEffect } from 'react'
import Ring from '../components/Ring.jsx'

export default function Setup() {
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [trainingScore, setTrainingScore] = useState(68)
  const [isDragOver, setIsDragOver] = useState(false)

  const fetchLatestResume = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/resume/latest')
      const resData = await res.json()
      if (resData && resData.data) {
        setUploadedFile(resData.data.original_filename || resData.data.filename)
        setTrainingScore(85)
        setExtractedText(resData.data.extracted_text || '')
      }
    } catch (err) {
      // Ignore errors on initial fetch
    }
  }

  useEffect(() => {
    fetchLatestResume()
  }, [])

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadFile = async (file) => {
    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid file format. Only PDF files are allowed.'
      })
      return
    }

    setLoading(true)
    setStatusMessage(null)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch('http://localhost:5001/api/resume/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setStatusMessage({
          type: 'success',
          text: 'Resume uploaded successfully'
        })
        const resData = result.data || {}
        setUploadedFile(resData.original_filename || file.name)
        setTrainingScore(85)
        await fetchLatestResume()
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message || 'Failed to upload resume.'
        })
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error occurred while uploading.'
      })
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0]
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
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    uploadFile(file)
  }

  // Text display formatting
  const isLongText = extractedText.length > 500
  const displayedText = isLongText && !isExpanded 
    ? `${extractedText.slice(0, 500)}...` 
    : extractedText

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
            
            {/* Hidden PDF File Input */}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Clickable & Drag-and-Drop Area */}
            <div
              className={`drop ${isDragOver ? 'drag-over' : ''}`}
              onClick={handleDropzoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                cursor: 'pointer',
                border: isDragOver ? '2px dashed var(--indigo)' : '1px dashed var(--line)',
                background: isDragOver ? 'var(--indigo-soft)' : 'none',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 28, color: 'var(--indigo)' }} />
                  <b style={{ display: 'block', marginTop: 8, fontSize: 14 }}>Uploading and extracting text...</b>
                  <p className="muted">Please wait while your PDF resume is processed</p>
                </div>
              ) : (
                <>
                  <div className="ic"><i className="ti ti-file-upload" /></div>
                  <b style={{ fontSize: 14 }}>Drop résumé, projects or case studies</b>
                  <p className="muted" style={{ marginTop: 4 }}>PDF only (max 5 MB) — parsed into skill signals</p>
                </>
              )}
            </div>

            {/* Status Feedback Banner */}
            {statusMessage && (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: statusMessage.type === 'success' ? '#e6f6ec' : '#fdeea8',
                  color: statusMessage.type === 'success' ? '#16a34a' : '#92400e',
                  border: `1px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fef3c7'}`
                }}
              >
                <i className={`ti ${statusMessage.type === 'success' ? 'ti-circle-check-filled' : 'ti-alert-circle'}`} />
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Uploaded File Info Card */}
            {uploadedFile && (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  background: 'var(--indigo-soft, #eef0ff)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  fontSize: 13
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-file-text" style={{ color: 'var(--indigo)', fontSize: 18 }} />
                  <span>Uploaded PDF: <strong>{uploadedFile}</strong></span>
                </div>
                <span className="chip ver" style={{ fontSize: 11 }}><i className="ti ti-check" /> Parsed &amp; Extracted</span>
              </div>
            )}

            {/* Extracted Resume Text Card */}
            {extractedText && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--line, #eef0f7)' }}>
                <div className="sec-t" style={{ marginBottom: 8 }}>
                  <i className="ti ti-file-code" style={{ color: 'var(--indigo)' }} />
                  <h3>Extracted Resume Text</h3>
                </div>
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    padding: 12,
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid var(--line, #e2e8f0)',
                    fontSize: 12.5,
                    fontFamily: 'monospace',
                    lineHeight: 1.5,
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {displayedText}
                </div>
                {isLongText && (
                  <button
                    className="btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ marginTop: 8, padding: '5px 12px', fontSize: 12 }}
                  >
                    <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`} />
                    {isExpanded ? 'Show Less' : 'View Full Text'}
                  </button>
                )}
              </div>
            )}
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
              <Ring value={trainingScore} size={130} thickness={13} color="var(--indigo)" track="var(--line)" inner="#fff" label="learning you" valueColor="var(--indigo)" labelColor="var(--ink3)" suffix="%" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: '240px', textAlign: 'left' }}>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Parsed 11 projects</div>
              <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Verified 24 skills</div>
              {uploadedFile ? (
                <div className="check-row"><i className="ti ti-circle-check-filled" style={{ color: 'var(--green)' }} /> Resume parsed &amp; text extracted</div>
              ) : (
                <div className="check-row"><i className="ti ti-loader-2" style={{ color: 'var(--indigo)' }} /> Cross-checking evidence…</div>
              )}
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

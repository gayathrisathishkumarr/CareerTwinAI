import React, { useState, useEffect, useRef } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      who: 'ai',
      answerType: 'verified',
      text: 'Hi! I am your **AI Career Twin** for **@rounithrathesh-coder**. Ask me anything about your skills, projects, certifications, or experience — every answer is strictly grounded in verified evidence from your scanned GitHub repos and PDF resume.',
      time: '09:00 AM',
      confidence: null,
      citationIndexes: [],
      sources: []
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeMessageId, setActiveMessageId] = useState(null)
  const [sourceFilterTab, setSourceFilterTab] = useState('all') // 'all' | 'corroborated' | 'resume'
  const [expandedSources, setExpandedSources] = useState({})
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, loading])

  const activeMessage = messages.find(m => m.id === activeMessageId) || messages.find(m => m.who === 'ai' && m.sources?.length > 0)
  const currentSources = activeMessage?.sources || []

  const filteredSources = currentSources.filter(s => {
    if (sourceFilterTab === 'corroborated') return s.corroborated
    if (sourceFilterTab === 'resume') return s.type === 'resume' || !s.corroborated
    return true
  })

  const handleSend = async (customText) => {
    const queryText = (customText || input).trim()
    if (!queryText || loading) return

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: Date.now(),
      who: 'me',
      text: queryText,
      time: nowStr
    }

    setMessages(prev => [...prev, userMsg])
    if (!customText) setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5001/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      })

      const data = await res.json()
      setLoading(false)

      if (data.status === 'success' && data.data) {
        const aiMsg = {
          id: Date.now() + 1,
          who: 'ai',
          answerType: data.data.answerType,
          text: data.data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: data.data.confidence,
          citationIndexes: data.data.citationIndexes || [],
          sources: data.data.sources || []
        }

        setMessages(prev => [...prev, aiMsg])
        if (aiMsg.sources.length > 0) {
          setActiveMessageId(aiMsg.id)
          setExpandedSources(prev => ({ ...prev, [aiMsg.id]: true }))
        }
      } else {
        throw new Error('Failed to get answer')
      }
    } catch {
      setLoading(false)
      const fallbackAiMsg = {
        id: Date.now() + 1,
        who: 'ai',
        answerType: 'refusal',
        text: `I couldn't reach the evidence engine to answer this — the backend may be offline. Please check that the server is running and try again.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: { type: 'no_evidence', label: 'Service unavailable', count: 0 },
        citationIndexes: [],
        sources: []
      }
      setMessages(prev => [...prev, fallbackAiMsg])
    }
  }

  // Renders markdown text with bullet lists, bold text, and interactive [n] citation chips
  const renderFormattedText = (text, sources = [], msgId) => {
    if (!text) return null

    const paragraphs = text.split('\n')

    return paragraphs.map((line, pIdx) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')
      const lineContent = isBullet ? line.trim().substring(1).trim() : line

      const parts = lineContent.split(/(\[\d+\]|\*\*[^*]+\*\*)/g)

      const renderedLine = parts.map((part, i) => {
        // Citation marker [n]
        const citMatch = part.match(/^\[(\d+)\]$/)
        if (citMatch) {
          const num = parseInt(citMatch[1], 10)
          return (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                setActiveMessageId(msgId)
                setExpandedSources(prev => ({ ...prev, [msgId]: true }))
              }}
              title={`View evidence source [${num}]`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 7px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                color: '#4338ca',
                margin: '0 3px',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: '0 1px 2px rgba(67, 56, 202, 0.15)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(67, 56, 202, 0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(67, 56, 202, 0.15)'
              }}
            >
              [{num}]
            </span>
          )
        }

        // Bold **text**
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong
              key={i}
              style={{
                fontWeight: 700,
                color: '#0f172a',
                background: 'rgba(79, 70, 229, 0.06)',
                padding: '1px 5px',
                borderRadius: '4px'
              }}
            >
              {part.slice(2, -2)}
            </strong>
          )
        }

        return part
      })

      if (isBullet) {
        return (
          <div key={pIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '4px 0 4px 6px' }}>
            <span style={{ color: 'var(--indigo)', fontWeight: 800, fontSize: '14px', lineHeight: 1 }}>•</span>
            <div style={{ flex: 1 }}>{renderedLine}</div>
          </div>
        )
      }

      if (!line.trim()) {
        return <div key={pIdx} style={{ height: '8px' }} />
      }

      return (
        <div key={pIdx} style={{ margin: '4px 0' }}>
          {renderedLine}
        </div>
      )
    })
  }

  const getSourceIcon = (type) => {
    switch (type) {
      case 'repo': return <i className="ti ti-brand-github" style={{ fontSize: '20px', color: '#0f1024' }} />
      case 'certification': return <i className="ti ti-certificate" style={{ fontSize: '20px', color: '#2563eb' }} />
      case 'project': return <i className="ti ti-folder" style={{ fontSize: '20px', color: '#16a34a' }} />
      default: return <i className="ti ti-file-text" style={{ fontSize: '20px', color: '#0284c7' }} />
    }
  }

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Page Header */}
      <div className="page-h">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--indigo-soft)', color: 'var(--indigo)',
            display: 'grid', placeItems: 'center', fontSize: '20px'
          }}>
            <i className="ti ti-message-circle-2" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', margin: 0 }}>AI Mentor Chat</h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--ink3)' }}>
              Ask anything about your skills, projects, experience and more.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner Notice */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          background: 'rgba(124, 58, 237, 0.04)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--indigo-soft)', color: 'var(--indigo)',
            display: 'grid', placeItems: 'center', fontSize: '16px'
          }}>
            <i className="ti ti-shield-check" />
          </div>
          <div>
            <b style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
              AI answers strictly from your data
            </b>
            <span style={{ fontSize: '12px', color: 'var(--ink2)' }}>
              Every answer includes citations. No external knowledge is used.
            </span>
          </div>
        </div>
        <span style={{ fontSize: '12.5px', color: 'var(--indigo)', fontWeight: 500, cursor: 'pointer' }}>
          ⓘ How it works
        </span>
      </div>

      {/* Main Grid: Left Chat Area (2/3) + Right Sources Panel (1/3) */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Chat Conversation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '680px', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Chat Feed */}
          <div
            ref={logRef}
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: '#fafafa'
            }}
          >
            {messages.map((m) => {
              if (m.who === 'me') {
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div
                        style={{
                          background: '#f1f1fe',
                          color: 'var(--ink)',
                          padding: '12px 18px',
                          borderRadius: '16px 16px 2px 16px',
                          fontSize: '13.5px',
                          maxWidth: '460px',
                          boxShadow: '0 2px 6px rgba(15,16,36,0.04)',
                          lineHeight: 1.45
                        }}
                      >
                        {m.text}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '4px', paddingRight: '2px' }}>{m.time}</span>
                    </div>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'var(--indigo)', color: '#fff',
                      display: 'grid', placeItems: 'center', fontSize: '15px', flexShrink: 0
                    }}>
                      <i className="ti ti-user" />
                    </div>
                  </div>
                )
              }

              // AI Bot Message styling based on answerType (verified / unverified / refusal)
              const isUnverified = m.answerType === 'unverified'
              const isRefusal = m.answerType === 'refusal'

              const cardBg = isRefusal ? '#fef2f2' : isUnverified ? '#fffbeb' : '#ffffff'
              const cardBorder = isRefusal ? '1px solid #fca5a5' : isUnverified ? '1px solid #fcd34d' : '1px solid var(--line)'

              return (
                <div key={m.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* Bot Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: isRefusal ? '#fee2e2' : isUnverified ? '#fef3c7' : 'var(--indigo-soft)',
                    color: isRefusal ? '#dc2626' : isUnverified ? '#b45309' : 'var(--indigo)',
                    display: 'grid', placeItems: 'center', fontSize: '18px', flexShrink: 0
                  }}>
                    <i className="ti ti-robot" />
                  </div>

                  <div style={{ flex: 1, maxWidth: '540px' }}>
                    <div
                      onClick={() => {
                        if (m.sources?.length > 0) {
                          setActiveMessageId(m.id)
                        }
                      }}
                      style={{
                        background: cardBg,
                        border: cardBorder,
                        borderRadius: '16px',
                        padding: '16px 18px',
                        boxShadow: '0 2px 8px rgba(15,16,36,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        cursor: m.sources?.length > 0 ? 'pointer' : 'default'
                      }}
                    >
                      {/* Message Content Text */}
                      <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.6 }}>
                        {renderFormattedText(m.text, m.sources, m.id)}
                      </div>

                      {/* Citation Chips Row (e.g. [1] [2] [3] [4] [5]) */}
                      {m.citationIndexes && m.citationIndexes.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {m.citationIndexes.map((idx) => (
                            <span
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMessageId(m.id)
                                setExpandedSources(prev => ({ ...prev, [m.id]: true }))
                              }}
                              style={{
                                padding: '2px 7px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                background: '#f1f5f9',
                                color: 'var(--indigo)',
                                cursor: 'pointer'
                              }}
                            >
                              [{idx}]
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Confidence Badge Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                        {/* Status Badges */}
                        {m.confidence?.type === 'verified' && (
                          <span className="chip ver" style={{ background: '#e6f6ec', color: '#16a34a', fontSize: '11.5px', fontWeight: 600 }}>
                            <i className="ti ti-shield-check" /> {m.confidence.label}
                          </span>
                        )}

                        {m.confidence?.type === 'unverified' && (
                          <span className="chip amber" style={{ background: '#fef3c7', color: '#b45309', fontSize: '11.5px', fontWeight: 600 }}>
                            <i className="ti ti-alert-circle" /> {m.confidence.label}
                          </span>
                        )}

                        {m.confidence?.type === 'no_evidence' && (
                          <span className="chip red" style={{ background: '#fee2e2', color: '#dc2626', fontSize: '11.5px', fontWeight: 600 }}>
                            <i className="ti ti-alert-triangle" /> {m.confidence.label}
                          </span>
                        )}

                        {/* Show Sources Toggle Button */}
                        {m.sources && m.sources.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMessageId(m.id)
                              setExpandedSources(prev => ({ ...prev, [m.id]: !prev[m.id] }))
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--ink3)',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 500
                            }}
                          >
                            Show {m.sources.length} sources {expandedSources[m.id] ? '˄' : '˅'}
                          </button>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '4px', display: 'block', paddingLeft: '4px' }}>{m.time}</span>
                  </div>
                </div>
              )
            })}

            {/* Typing Loader Skeleton */}
            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--indigo-soft)', color: 'var(--indigo)',
                  display: 'grid', placeItems: 'center', fontSize: '18px'
                }}>
                  <i className="ti ti-robot" />
                </div>
                <div style={{ background: '#fff', padding: '12px 18px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                  <i className="ti ti-loader-2 ti-spin" style={{ color: 'var(--indigo)', fontSize: '18px' }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--ink2)', marginLeft: '8px' }}>Retrieving verified evidence...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar */}
          <div style={{ padding: '14px 18px', background: '#fff', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Quick Suggestion Pills Bar */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                "What are my strongest technical skills?",
                "Showcase my top verified projects and code proof",
                "Did I lead a team of 5 people in any project?",
                "What is my experience with DevOps & Kubernetes?",
                "How ready am I for a Senior Full Stack Role?",
                "What ML frameworks and Python experience do I have?",
                "Summarize my education and certifications",
                "What is my total repository and commit activity?"
              ].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  disabled={loading}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--line)',
                    background: '#f8fafc',
                    color: 'var(--indigo)',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--indigo-soft)'
                    e.currentTarget.style.borderColor = 'var(--indigo)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.borderColor = 'var(--line)'
                  }}
                >
                  <i className="ti ti-arrow-up-right" style={{ fontSize: '11px' }} />
                  {sug}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="btn" style={{ padding: '10px', color: 'var(--ink3)' }} title="Attach document or resume">
                <i className="ti ti-paperclip" style={{ fontSize: '18px' }} />
              </button>
              <button className="btn" style={{ padding: '10px', color: 'var(--ink3)' }} title="Voice input">
                <i className="ti ti-microphone" style={{ fontSize: '18px' }} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question about your profile..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
              <button
                className="btn pri"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{ padding: '12px 18px', borderRadius: '10px' }}
              >
                <i className="ti ti-send" style={{ fontSize: '16px' }} />
              </button>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--ink3)', textAlign: 'center' }}>
              AI answers only from your data. No general knowledge is used.
            </span>
          </div>
        </div>

        {/* Right Column: "Sources for this answer" Sidebar Panel */}
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b style={{ fontSize: '15px', color: 'var(--ink)' }}>Sources for this answer</b>
            <i className="ti ti-x" style={{ cursor: 'pointer', color: 'var(--ink3)' }} />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: '14px', paddingBottom: '8px' }}>
            {[
              { id: 'all', label: `All Sources (${currentSources.length})` },
              { id: 'corroborated', label: `Corroborated (${currentSources.filter(s => s.corroborated).length})` },
              { id: 'resume', label: `Resume Only (${currentSources.filter(s => !s.corroborated).length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSourceFilterTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: sourceFilterTab === tab.id ? 600 : 400,
                  color: sourceFilterTab === tab.id ? 'var(--indigo)' : 'var(--ink3)',
                  borderBottom: sourceFilterTab === tab.id ? '2px solid var(--indigo)' : '2px solid transparent',
                  paddingBottom: '6px',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sources List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredSources.length > 0 ? (
              filteredSources.map((src) => (
                <div
                  key={src.index}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: '#f8fafc',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Number Badge */}
                  <b style={{ fontSize: '13px', color: 'var(--indigo)', minWidth: '16px' }}>{src.index}</b>

                  {/* Icon */}
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {getSourceIcon(src.source_type || src.type)}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <span className="eyebrow" style={{ fontSize: '10.5px', color: 'var(--ink3)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {src.typeName || src.source_type}
                    </span>
                    <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'block', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {src.title || src.source_name}
                    </b>
                    <span style={{ fontSize: '11.5px', color: 'var(--ink2)', display: 'block', marginTop: '2px' }}>
                      {src.detail}
                    </span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '11.5px', color: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '4px', fontWeight: 500 }}
                      >
                        {src.url.replace(/^https?:\/\//, '')} <i className="ti ti-external-link" style={{ fontSize: '10px' }} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '12.5px', color: 'var(--ink3)', textAlign: 'center', padding: '20px 0' }}>
                No sources match the selected filter.
              </p>
            )}
          </div>

          {/* Source Types Legend Box */}
          <div style={{ padding: '10px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '11.5px', color: 'var(--ink2)' }}>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>Source types</span>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span><i className="ti ti-brand-github" /> Repository</span>
              <span><i className="ti ti-file-text" /> Resume</span>
              <span><i className="ti ti-certificate" /> Certification</span>
              <span><i className="ti ti-folder" /> Project</span>
            </div>
          </div>

          {/* Bottom Info Box */}
          <div style={{ padding: '12px', background: '#e6f6ec', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <i className="ti ti-shield-check" style={{ color: '#16a34a', fontSize: '22px', flexShrink: 0 }} />
            <div>
              <b style={{ fontSize: '12px', color: '#14532d', display: 'block' }}>Why citations?</b>
              <span style={{ fontSize: '11.5px', color: '#166534', lineHeight: 1.35 }}>
                We cite every claim so you can verify the evidence from your own data.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

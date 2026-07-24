import React, { useEffect, useRef, useState } from 'react'

const seed = [
  {
    who: 'ai',
    body: (
      <p>
        Hi Aanya — I'm your twin. I can pull from your repos, projects and docs to answer
        questions or prep you for a role. Try a suggestion, or ask me anything.
      </p>
    ),
  },
  { who: 'me', body: 'What projects best showcase my Python skills?' },
  {
    who: 'ai',
    body: (
      <>
        <p>Three projects show your Python depth most clearly, ranked by verified signal:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-code" /> Top Python evidence</div>
          <div className="ri"><span><b>fraud-graph-pipeline</b> · async ETL, 40k lines</span><span className="chip ver">98</span></div>
          <div className="ri"><span><b>llm-eval-harness</b> · testing framework</span><span className="chip ver">91</span></div>
          <div className="ri"><span><b>sensorflow</b> · real-time streaming</span><span className="chip ver">86</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          I'd lead with <b>fraud-graph-pipeline</b> in interviews — it proves production
          scale, not just scripting.
        </p>
      </>
    ),
  },
]

const suggestions = [
  'What 3 skills should I focus on for a data science role?',
  'Where am I weakest?',
  'Draft my elevator pitch for a startup.',
]

let nextId = seed.length

export default function ChatPanel() {
  const [messages, setMessages] = useState(() => seed.map((m, i) => ({ ...m, id: i })))
  const [input, setInput] = useState('')
  const logRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  function send(text) {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages((m) => [...m, { id: nextId++, who: 'me', body: q }])
    setInput('')
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: nextId++,
          who: 'ai',
          body: (
            <p>
              Great question. Based on your verified evidence, here's what I'd focus on — ask
              me to go deeper on any project, skill or role and I'll cite the exact source.
            </p>
          ),
        },
      ])
    }, 450)
  }

  return (
    <div className="card chat">
      <div className="chat-log" ref={logRef}>
        {messages.map((m) =>
          m.who === 'me' ? (
            <div className="msg me" key={m.id}>{m.body}</div>
          ) : (
            <div className="msg ai" key={m.id}>
              <div className="avt"><i className="ti ti-brain" /></div>
              <div className="bub">{m.body}</div>
            </div>
          )
        )}
      </div>

      <div className="chat-in">
        <div className="field">
          <input
            value={input}
            placeholder="e.g. What are the top 3 skills for a data science role?"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="send" onClick={() => send()} aria-label="Send">
            <i className="ti ti-send" />
          </button>
        </div>
        <div className="suggest">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

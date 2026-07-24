import React, { useEffect, useRef, useState } from 'react'
import { useRole } from '../context/RoleContext.jsx'

const proSeed = [
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

const recSeed = [
  {
    who: 'ai',
    body: (
      <p>
        Hi — I'm Aanya's twin, trained on her repos, projects and assessments. Ask me
        anything about her experience; every answer cites verified evidence.
      </p>
    ),
  },
]

const proSuggestions = [
  'What 3 skills should I focus on for a data science role?',
  'Where am I weakest?',
  'Draft my elevator pitch for a startup.',
]

const recSuggestions = [
  'Has she deployed to production?',
  'Biggest project impact?',
  'Culture & working style?',
]

const answers = [
  {
    match: /data science|3 skills|focus on/i,
    body: (
      <>
        <p>For a data science role, these three moves give you the most leverage:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-target-arrow" /> Highest-impact skills</div>
          <div className="ri"><span><b>Statistics & experimentation</b> · A/B testing, causal inference</span><span className="chip amber">gap</span></div>
          <div className="ri"><span><b>Production MLOps</b> · you're at 34, roles expect ~80</span><span className="chip amber">gap</span></div>
          <div className="ri"><span><b>Storytelling with data</b> · dashboards + stakeholder comms</span><span className="chip">stretch</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          Your Python (94) and data engineering (88) already clear the bar — lean on those
          as differentiators while you close the stats gap.
        </p>
      </>
    ),
  },
  {
    match: /weak|gap|improve|worst/i,
    body: (
      <>
        <p>Your three biggest verified gaps, ranked by how much they hold back readiness:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-alert-triangle" /> Gap analysis · Senior ML target</div>
          <div className="ri"><span><b>Production MLOps</b> · 34 vs target 80</span><span className="chip amber">−9% readiness</span></div>
          <div className="ri"><span><b>Distributed systems</b> · 66 vs target 80</span><span className="chip amber">−5% readiness</span></div>
          <div className="ri"><span><b>Team leadership</b> · 52 vs target 75</span><span className="chip amber">−4% readiness</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          MLOps is the biggest lever: shipping one monitored, CI/CD-deployed model would
          take you from 78% to ~87% role readiness in 2–3 weeks.
        </p>
      </>
    ),
  },
  {
    match: /pitch|elevator|intro|about (me|myself)/i,
    body: (
      <>
        <p>Here's a 20-second pitch built only from verified evidence:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-microphone" /> Elevator pitch · startup flavor</div>
          <p style={{ padding: '10px 12px', margin: 0 }}>
            "I'm an end-to-end builder — top-8% Python, five years shipping data pipelines
            that hold up at production scale, including a 40k-line async ETL system for
            fraud detection. Right now I'm going deep on LLM tooling and MLOps, so I can
            own a model from notebook to monitored deploy. Small teams are where I do my
            best work."
          </p>
        </div>
        <p style={{ marginTop: 10 }}>
          Want a variant tuned for big-tech interviews, or one that leads with the ML side?
        </p>
      </>
    ),
  },
  {
    match: /ready|readiness|senior/i,
    body: (
      <>
        <p>You're at <b>78% readiness</b> for Senior ML Engineer. What the evidence says:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-gauge" /> Readiness breakdown</div>
          <div className="ri"><span>Coding · Data engineering</span><span className="chip ver">exceeds target</span></div>
          <div className="ri"><span>Machine learning</span><span className="chip ver">meets target</span></div>
          <div className="ri"><span>Systems · MLOps · Leadership</span><span className="chip amber">below target</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          On your current trajectory (MLOps project in progress), you're senior-ready in
          about 6 months — sooner if you add distributed-design evidence.
        </p>
      </>
    ),
  },
  {
    match: /compare|typical|peer|benchmark/i,
    body: (
      <>
        <p>Against typical ML engineers at your experience level:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-chart-bar" /> Peer comparison · 5y cohort</div>
          <div className="ri"><span><b>Python</b> · top 8%</span><span className="chip ver">ahead</span></div>
          <div className="ri"><span><b>Data pipelines</b> · top 12%</span><span className="chip ver">ahead</span></div>
          <div className="ri"><span><b>ML modeling</b> · top 20%</span><span className="chip ver">ahead</span></div>
          <div className="ri"><span><b>MLOps</b> · bottom half</span><span className="chip amber">behind</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          Your profile reads "exceptional builder, still productionizing" — unusual depth
          for your cohort, one clearly fixable gap.
        </p>
      </>
    ),
  },
  {
    match: /learn|next quarter|roadmap|plan|study/i,
    body: (
      <>
        <p>Your next quarter, sequenced for maximum readiness gain:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-route" /> Q3 growth plan</div>
          <div className="ri"><span><b>Weeks 1–3</b> · deploy a model with monitoring + rollback</span><span className="chip ver">+9%</span></div>
          <div className="ri"><span><b>Weeks 4–8</b> · system-design assessment + write-up</span><span className="chip ver">+5%</span></div>
          <div className="ri"><span><b>Weeks 9–12</b> · mentor a junior on the fraud pipeline</span><span className="chip ver">+4%</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          That path takes you from 78% to ~96% readiness — effectively interview-ready for
          senior roles by end of quarter.
        </p>
      </>
    ),
  },
  {
    match: /python|project|showcase|portfolio|repo/i,
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
  {
    match: /production|deploy/i,
    body: (
      <>
        <p>Yes — with nuance. The verified record:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-rocket" /> Production evidence</div>
          <div className="ri"><span><b>fraud-graph-pipeline</b> · live ETL serving daily batch jobs</span><span className="chip ver">verified</span></div>
          <div className="ri"><span><b>sensorflow</b> · real-time streaming in staging</span><span className="chip ver">verified</span></div>
          <div className="ri"><span>Model serving with monitoring/CI-CD</span><span className="chip amber">in progress</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          Data infrastructure: yes, at scale. End-to-end ML deployment: actively closing —
          the current MLOps project adds monitoring, CI/CD and rollback.
        </p>
      </>
    ),
  },
  {
    match: /impact|achievement|proud|biggest/i,
    body: (
      <>
        <p>The strongest verified impact is <b>fraud-graph-pipeline</b>:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-trophy" /> Project impact</div>
          <div className="ri"><span>40k lines of async Python ETL, built end-to-end</span><span className="chip ver">code-verified</span></div>
          <div className="ri"><span>7 data pipelines verified across the org</span><span className="chip ver">×7</span></div>
          <div className="ri"><span>Kaggle top-5% finish on applied ML</span><span className="chip ver">ranked</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          The pattern across all of it: she ships complete systems, not notebooks.
        </p>
      </>
    ),
  },
  {
    match: /culture|working style|team|collaborat/i,
    body: (
      <>
        <p>From peer endorsements and commit/review history:</p>
        <div className="rich">
          <div className="rh"><i className="ti ti-users" /> Working-style signals</div>
          <div className="ri"><span>Fast learner — LLM tooling +55% in 3 months</span><span className="chip ver">verified</span></div>
          <div className="ri"><span>Thorough reviewer · high-quality PR feedback</span><span className="chip ver">6 endorsements</span></div>
          <div className="ri"><span>Ships end-to-end without hand-holding</span><span className="chip ver">verified</span></div>
        </div>
        <p style={{ marginTop: 10 }}>
          Best signal: teammates repeatedly route ambiguous, greenfield work to her — a
          strong fit for small, autonomous teams.
        </p>
      </>
    ),
  },
  {
    match: /^(hi|hey|hello)\b/i,
    body: (
      <p>
        Hey! Ask me about skills, gaps, readiness, projects or growth plans — every answer
        comes from verified evidence, and I'll cite the source.
      </p>
    ),
  },
]

const fallback = (
  <p>
    I can answer that best with evidence — try asking about specific skills, gaps,
    readiness for a role, project impact, or a growth plan. For example:{' '}
    <b>"Where am I weakest?"</b> or <b>"Am I ready for a senior role?"</b>
  </p>
)

function reply(q) {
  const hit = answers.find((a) => a.match.test(q))
  return hit ? hit.body : fallback
}

let nextId = 100

export default function ChatPanel() {
  const { role } = useRole()
  const isRec = role === 'rec'
  const [messages, setMessages] = useState(() =>
    (isRec ? recSeed : proSeed).map((m, i) => ({ ...m, id: i }))
  )
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, typing])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  function send(text) {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages((m) => [...m, { id: nextId++, who: 'me', body: q }])
    setInput('')
    setTyping(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: nextId++, who: 'ai', body: reply(q) }])
    }, 700)
  }

  const suggestions = isRec ? recSuggestions : proSuggestions

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
        {typing && (
          <div className="msg ai">
            <div className="avt"><i className="ti ti-brain" /></div>
            <div className="bub typing"><span /><span /><span /></div>
          </div>
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

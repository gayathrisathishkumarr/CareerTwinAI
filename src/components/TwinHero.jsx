import Ring from './Ring.jsx'
import { profile } from '../data/mock.js'

export default function TwinHero() {
  return (
    <div className="twin-hero">
      <div className="orb"><i className="ti ti-brain" /></div>

      <div className="th-body">
        <h2>
          {profile.name.split(' ')[0]}'s CareerTwin
          <span className="vb"><i className="ti ti-rosette-discount-check" /> Verified</span>
        </h2>
        <p>
          Trained on 3 repositories, 11 projects and 2 documents. Your twin can answer
          questions, showcase evidence, and map your next move — updating itself every time
          you ship.
        </p>
        <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
          <span className="chip ver"><i className="ti ti-brand-github" /> GitHub linked</span>
          <span className="chip ver"><i className="ti ti-file-check" /> Résumé parsed</span>
          <span className="chip ver"><i className="ti ti-shield-check" /> 842 skill signals</span>
        </div>
      </div>

      <div className="intel">
        <Ring value={profile.twinIQ} label="twin IQ" color="#0ea5a4" />
      </div>
    </div>
  )
}

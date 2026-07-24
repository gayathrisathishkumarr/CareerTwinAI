export const profile = {
  name: 'Rounith R.',
  initials: 'R',
  role: 'Student',
  location: 'Chennai',
  years: 1,
  twinIQ: 78,
  readiness: 85,
  targetRole: 'Software Developer',
}

export const recruiter = {
  name: 'Marcus Lee',
  initials: 'ML',
  role: 'Talent partner · Northwind',
}

export const metrics = [
  { label: 'Verified skills', value: '24', sub: '+3 this month', icon: 'ti-shield-check', color: 'var(--teal)', bg: 'var(--teal-soft)' },
  { label: 'Emerging skills', value: '6', sub: 'Rust, LangChain +4', icon: 'ti-flame', color: 'var(--coral)', bg: 'var(--coral-soft)' },
  { label: 'Role readiness', value: '78%', sub: 'Senior ML eng', icon: 'ti-target-arrow', color: 'var(--indigo)', bg: 'var(--indigo-soft)' },
  { label: 'Recruiter views', value: '31', sub: '+12 this week', icon: 'ti-eye', color: 'var(--amber)', bg: 'var(--amber-soft)' },
]

export const skills = [
  { n: 'Python', x: 50, y: 44, r: 44, c: '#0ea5a4', lvl: 'Expert · verified', ev: '7 projects', peer: 'Top 8%' },
  { n: 'Data eng', x: 26, y: 30, r: 36, c: '#0ea5a4', lvl: 'Advanced · verified', ev: '5 projects', peer: 'Top 12%' },
  { n: 'ML', x: 70, y: 28, r: 38, c: '#4f46e5', lvl: 'Advanced', ev: '4 projects', peer: 'Top 20%' },
  { n: 'SQL', x: 20, y: 60, r: 30, c: '#4f46e5', lvl: 'Proficient', ev: '6 projects', peer: 'Top 25%' },
  { n: 'LLM tools', x: 76, y: 58, r: 28, c: '#f59e0b', lvl: 'Growing +55%', ev: '2 projects', peer: 'Rising' },
  { n: 'Rust', x: 52, y: 76, r: 24, c: '#f59e0b', lvl: 'Growing +40%', ev: '2 side projects', peer: 'Rising' },
  { n: 'Docker', x: 38, y: 52, r: 26, c: '#4f46e5', lvl: 'Proficient', ev: '4 projects', peer: 'Top 30%' },
  { n: 'MLOps', x: 64, y: 74, r: 20, c: 'em', lvl: 'Emerging gap', ev: 'Recommended', peer: 'Focus area' },
  { n: 'Go', x: 84, y: 40, r: 18, c: 'em', lvl: 'Emerging', ev: '1 project', peer: 'New' },
]

export const skillBars = [
  { name: 'Python', level: 'Expert', pct: 94, color: '#0ea5a4' },
  { name: 'Data engineering', level: 'Advanced', pct: 88, color: '#0ea5a4' },
  { name: 'Machine learning', level: 'Advanced', pct: 82, color: '#4f46e5' },
  { name: 'SQL & databases', level: 'Proficient', pct: 74, color: '#4f46e5' },
  { name: 'LLM tooling', level: 'Growing', pct: 58, color: '#f59e0b' },
  { name: 'Production MLOps', level: 'Gap', pct: 34, color: '#f97316' },
]

export const radar = {
  labels: ['Coding', 'Data eng', 'ML', 'Systems', 'MLOps', 'Leadership'],
  you: [94, 88, 82, 66, 34, 52],
  target: [85, 80, 85, 80, 80, 75],
}

export const growthPath = [
  { state: 'done', title: 'Foundational ML — complete', desc: 'Verified across 4 projects and a Kaggle top-5% finish.', chips: [{ t: 'verified', kind: 'ver' }] },
  { state: 'now', title: 'Production & MLOps — in progress', desc: 'Deploy a model with monitoring, CI/CD and rollback. Biggest readiness lever.', chips: [{ t: '+9% readiness' }, { t: '2–3 weeks', kind: 'amber' }] },
  { state: 'next', title: 'System design at scale', desc: 'Take an assessment or add evidence of distributed design decisions.', chips: [{ t: 'assessment ready', kind: 'teal' }] },
  { state: 'next', title: 'Technical leadership', desc: 'Mentor signals + a project where you set direction.', chips: [] },
]

export const candidates = [
  { name: 'Rounith R.', initials: 'R', color: '#4f46e5', role: 'Student · 1y · Chennai', match: 85, skills: ['Python', 'Data Structures', 'ML'] },
  { name: 'Diego Marín', initials: 'DM', color: '#0ea5a4', role: 'ML engineer · 6y · Remote', match: 88, skills: ['PyTorch', 'Rust', 'Distributed'] },
  { name: 'Priya Nair', initials: 'PN', color: '#f59e0b', role: 'Data scientist · 4y · NYC', match: 81, skills: ['Python', 'Stats', 'LLMs ↑'] },
  { name: 'Sam Okoye', initials: 'SO', color: '#ec4899', role: 'Backend → ML · 7y · London', match: 76, skills: ['Go', 'Systems', 'ML ↑'] },
]

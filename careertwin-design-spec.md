# CareerTwin AI — UI design spec

A dynamic, AI-powered "digital twin" of a professional identity that replaces the static résumé. The interface serves two roles from one system, toggled in the top bar: **Professional** (owns and grows their twin) and **Recruiter/Mentor** (queries and assesses twins).

Design language: clean, trustworthy SaaS surfaces (white cards, hairline borders, generous whitespace) carrying vibrant, encouraging data visualization (teal = verified strength, indigo = proficient, amber/coral = growing, dashed gray = emerging). The "AI twin" is signalled by a living gradient orb and dark, intelligent hero panels — everything else stays calm so the color that appears carries meaning.

## Cross-cutting elements

**Role switch (top bar).** A single segmented control flips the whole app between Professional and Recruiter contexts — nav, identity chip, and the chat's framing all change. This keeps one coherent product rather than two apps.

**Verification as a first-class signal.** A recurring verified chip (rosette-check, teal) appears wherever the twin makes a claim. It reads "answers cite evidence," "code verified from source," "no inflated claims found." Trust is the core differentiator over a résumé, so verification is visible on every screen, not buried.

**Twin IQ / readiness rings.** Conic-gradient progress rings express the twin's intelligence (how well-trained it is) and the person's role readiness. They animate and update, reinforcing "evolving, not static."

## Screen 1 — Professional dashboard

The home view answers "what does my twin know about me right now?"

- **Twin hero panel** — a dark, gradient AI surface with a rotating gradient **orb** (the twin's avatar), the person's name, a verified badge, a plain-language summary of what the twin was trained on (repos, projects, docs), source chips, and a **Twin IQ ring (82)**. This is the emotional anchor: your identity, alive.
- **Metric row** — verified skills, emerging skills, role readiness %, recruiter views. Each with an accent-tinted icon and an encouraging delta ("+3 this month").
- **Skill constellation** — the centerpiece, replacing the skill list. Skills are nodes sized by strength and colored by status; the strongest skill anchors links to related skills. Hovering a node reveals a tooltip with proficiency, evidence count, and peer percentile. Emerging skills appear as smaller dashed nodes that "grow" as evidence accrues.
- **Recommended next** — a ranked, numbered path of the highest-leverage moves, each tagged with its readiness impact.
- **Twin insight card** — a short, encouraging, evidence-grounded observation in the twin's voice, linking into chat.

## Screen 2 — Skill analysis

The deep view: what the twin knows, how it knows it, where to grow.

- **Capability radar** — the twin's profile overlaid against a target role (e.g. Senior ML), so gaps are visible at a glance rather than described.
- **Verified strengths bars** — animated proficiency bars colored by status, each labeled with level and evidence.
- **Strengths / gaps / momentum** — an AI-analyzed three-column summary generated from verified signals. Momentum ("Rust +40% in 3 months") is deliberately included to feel encouraging and forward-looking, not judgmental.
- **Personalized growth path** — a vertical timeline from completed → in-progress → future, each step tagged with readiness impact, time estimate, or an available assessment. Turns "weaknesses" into a route.

## Screen 3 — Ask your twin (chat)

Natural-language conversation with the twin.

- **Conversation** with the person's messages and the twin's replies. Twin answers embed **rich evidence cards** — ranked projects with verified scores, links, drafted summaries — not just prose.
- **Suggested prompts** ("Top skills for data science?", "Where am I weakest?", "Draft my pitch") lower the blank-page barrier.
- **Evidence sources aside** makes grounding explicit: every answer draws from linked repos, docs, and assessments. In the recruiter context this same surface becomes "Interview the twin," and the framing shifts to third person.

## Screen 4 — Sources & setup (onboarding / management)

How the twin is built and controlled.

- **Evidence dropzone** for résumés, projects, case studies (parsed into skill signals).
- **Connected sources** — GitHub, LinkedIn connected and verified; Google Scholar and credentials available to add. Each row shows what was learned ("3 repos, 842 commits read").
- **Twin training ring** — a progress ring with a live checklist ("verified 24 skills," "cross-checking evidence…," "add 1 more source to reach 90%"), making the twin feel like it's actively learning.
- **Sharing & privacy toggles** — the person controls recruiter visibility, whether the twin can be interviewed, and salary disclosure. Consent is explicit.

## Screen 5 — Recruiter discovery

- **Natural-language search** — recruiters describe the person they want ("ML engineers who've shipped to production and know Rust") instead of boolean keywords. Refinement chips add constraints.
- **Ranked candidate twins** — cards with avatar, role, verified skill tags, and a **verified-fit ring** (color-coded). Sorted by evidence, not keyword match. Clicking opens the candidate view.

## Screen 6 — Recruiter candidate view

Fast, trustworthy assessment.

- **AI assessment panel** (top) — a 20-second read: verified fit %, a plain-language summary, and a strengths / watch-outs / "if hired" (ramp time, trajectory) breakdown. Recruiters grasp the candidate before deep-diving.
- **Evidence-backed capabilities** — the same proficiency bars, framed as verifiable claims.
- **Interview the twin** — the recruiter can ask the candidate's twin questions ("Has she deployed to production?") and get cited answers before spending a call.
- **Trust & verification aside** — code verified from source, commits analyzed, peer endorsements, "no inflated claims found." Directly counters résumé-inflation anxiety.

## Primary user flows

**Professional onboarding →** connect GitHub / upload résumé → twin trains (progress ring) → dashboard populates with constellation and readiness → ask the twin what to do next → follow a growth path → twin re-verifies as new work ships.

**Recruiter →** describe the ideal candidate in natural language → scan ranked verified-fit cards → open a candidate → read the 20-second AI assessment → interview the twin for specifics → shortlist or reach out.

## Design intent notes

The static résumé is replaced with something that is *evidenced* (every claim cites a source), *dynamic* (rings, momentum, emerging nodes that grow), and *encouraging* (gaps are framed as routes, progress is celebrated). Intelligence is conveyed through the orb, twin-voice insights, and natural-language querying; trust is conveyed through pervasive, specific verification.

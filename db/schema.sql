-- CareerTwin AI — relational schema (SQLite)
-- A normalized store for the professional digital twin, its verified skill
-- signals, growth path, evidence sources, and the recruiter-facing candidate pool.

PRAGMA foreign_keys = ON;

-- The professional who owns a digital twin.
CREATE TABLE professionals (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    initials     TEXT    NOT NULL,
    role         TEXT,
    location     TEXT,
    years        INTEGER,
    twin_iq      INTEGER,          -- how well-trained the twin is (0-100)
    readiness    INTEGER,          -- fit for the target role (0-100)
    target_role  TEXT,
    verified     INTEGER DEFAULT 1 -- 1 = twin verified against source evidence
);

-- Proficiency bars shown on the Skill Analysis / Candidate screens.
CREATE TABLE skills (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    name            TEXT    NOT NULL,
    level           TEXT,               -- Expert | Advanced | Proficient | Growing | Gap
    proficiency_pct INTEGER,            -- 0-100
    color           TEXT
);

-- Interactive Skill Constellation nodes (dashboard graph).
CREATE TABLE skill_nodes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    name            TEXT    NOT NULL,
    status          TEXT,               -- verified | proficient | growing | emerging
    evidence        TEXT,               -- e.g. "7 projects"
    peer_percentile TEXT,               -- e.g. "Top 8%"
    pos_x           INTEGER,            -- layout x (0-100)
    pos_y           INTEGER,            -- layout y (0-100)
    radius          INTEGER,            -- node size = skill strength
    color           TEXT
);

-- Headline KPI cards on the dashboard.
CREATE TABLE metrics (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    label           TEXT,
    value           TEXT,
    sub             TEXT,
    icon            TEXT
);

-- Capability radar: the twin vs. a target-role profile.
CREATE TABLE capabilities (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    axis            TEXT,
    you_score       INTEGER,
    target_score    INTEGER
);

-- Personalized growth path (ordered timeline).
CREATE TABLE growth_steps (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    ordinal         INTEGER,
    state           TEXT,               -- done | now | next
    title           TEXT,
    description     TEXT
);

-- Chips / tags attached to a growth step.
CREATE TABLE growth_step_chips (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    step_id  INTEGER NOT NULL REFERENCES growth_steps(id) ON DELETE CASCADE,
    label    TEXT,
    kind     TEXT                        -- ver | amber | teal | default
);

-- Connected evidence sources (GitHub, LinkedIn, Scholar, credentials…).
CREATE TABLE evidence_sources (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    type            TEXT,               -- github | linkedin | scholar | credentials
    name            TEXT,
    detail          TEXT,
    verified        INTEGER DEFAULT 0   -- 1 connected+verified, 0 available to add
);

-- Recruiters / mentors using the platform.
CREATE TABLE recruiters (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    initials TEXT,
    role     TEXT
);

-- Candidate pool surfaced in recruiter Discovery.
CREATE TABLE candidates (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    initials        TEXT,
    color           TEXT,
    role            TEXT,
    match_score     INTEGER,            -- verified fit (0-100)
    professional_id INTEGER REFERENCES professionals(id) -- link when the candidate owns a twin
);

-- Skill tags shown on a candidate card.
CREATE TABLE candidate_skills (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill        TEXT
);

CREATE INDEX idx_skills_prof        ON skills(professional_id);
CREATE INDEX idx_skill_nodes_prof   ON skill_nodes(professional_id);
CREATE INDEX idx_metrics_prof       ON metrics(professional_id);
CREATE INDEX idx_capabilities_prof  ON capabilities(professional_id);
CREATE INDEX idx_growth_prof        ON growth_steps(professional_id);
CREATE INDEX idx_candidate_skills   ON candidate_skills(candidate_id);

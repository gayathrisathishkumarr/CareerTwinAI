-- Example analytics queries against careertwin.db
-- Run with:  sqlite3 db/careertwin.db < db/queries.sql

-- 1. A professional's verified strengths, strongest first.
SELECT p.name, s.name AS skill, s.level, s.proficiency_pct
FROM skills s
JOIN professionals p ON p.id = s.professional_id
ORDER BY s.proficiency_pct DESC;

-- 2. Skill gaps to close for the target role (proficiency below 60).
SELECT name, level, proficiency_pct
FROM skills
WHERE proficiency_pct < 60
ORDER BY proficiency_pct ASC;

-- 3. Capability gap vs. the target role, largest gap first.
SELECT axis, you_score, target_score, (target_score - you_score) AS gap
FROM capabilities
WHERE target_score > you_score
ORDER BY gap DESC;

-- 4. The current growth step and its chips.
SELECT gs.title, gs.description, gc.label, gc.kind
FROM growth_steps gs
LEFT JOIN growth_step_chips gc ON gc.step_id = gs.id
WHERE gs.state = 'now';

-- 5. Recruiter discovery: candidates ranked by verified fit, with skill tags.
SELECT c.name, c.role, c.match_score,
       GROUP_CONCAT(cs.skill, ', ') AS skills
FROM candidates c
LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
GROUP BY c.id
ORDER BY c.match_score DESC;

-- 6. Connected, verified evidence sources for the twin.
SELECT type, name, detail
FROM evidence_sources
WHERE verified = 1;

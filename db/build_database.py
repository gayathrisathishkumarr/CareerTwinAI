#!/usr/bin/env python3
"""Build and seed careertwin.db from schema.sql.

Mirrors the demo data in src/data/mock.js into a normalized SQLite database so
the app can graduate from a mock object to a real persistence layer.

Usage:
    python db/build_database.py            # writes db/careertwin.db
    python db/build_database.py --out x.db  # custom output path
"""

import argparse
import os
import sqlite3

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA = os.path.join(HERE, "schema.sql")


def status_from_color(color, is_emerging):
    if is_emerging:
        return "emerging"
    return {"#0ea5a4": "verified", "#4f46e5": "proficient", "#f59e0b": "growing"}.get(
        color, "proficient"
    )


def build(out_path):
    if os.path.exists(out_path):
        os.remove(out_path)

    conn = sqlite3.connect(out_path)
    conn.execute("PRAGMA foreign_keys = ON")
    with open(SCHEMA, "r", encoding="utf-8") as fh:
        conn.executescript(fh.read())
    c = conn.cursor()

    # --- professional -------------------------------------------------------
    c.execute(
        """INSERT INTO professionals
           (name, initials, role, location, years, twin_iq, readiness, target_role, verified)
           VALUES (?,?,?,?,?,?,?,?,1)""",
        ("Rounith R.", "R", "Student", "Chennai", 1, 78, 85, "Software Developer"),
    )
    pid = c.lastrowid

    # --- metrics ------------------------------------------------------------
    metrics = [
        ("Verified skills", "24", "+3 this month", "ti-shield-check"),
        ("Emerging skills", "6", "Rust, LangChain +4", "ti-flame"),
        ("Role readiness", "78%", "Senior ML eng", "ti-target-arrow"),
        ("Recruiter views", "31", "+12 this week", "ti-eye"),
    ]
    c.executemany(
        "INSERT INTO metrics (professional_id,label,value,sub,icon) VALUES (?,?,?,?,?)",
        [(pid, *m) for m in metrics],
    )

    # --- proficiency skills (skill bars) ------------------------------------
    skills = [
        ("Python", "Expert", 94, "#0ea5a4"),
        ("Data engineering", "Advanced", 88, "#0ea5a4"),
        ("Machine learning", "Advanced", 82, "#4f46e5"),
        ("SQL & databases", "Proficient", 74, "#4f46e5"),
        ("LLM tooling", "Growing", 58, "#f59e0b"),
        ("Production MLOps", "Gap", 34, "#f97316"),
    ]
    c.executemany(
        "INSERT INTO skills (professional_id,name,level,proficiency_pct,color) VALUES (?,?,?,?,?)",
        [(pid, *s) for s in skills],
    )

    # --- constellation nodes ------------------------------------------------
    nodes = [
        ("Python", 50, 44, 44, "#0ea5a4", "7 projects", "Top 8%"),
        ("Data eng", 26, 30, 36, "#0ea5a4", "5 projects", "Top 12%"),
        ("ML", 70, 28, 38, "#4f46e5", "4 projects", "Top 20%"),
        ("SQL", 20, 60, 30, "#4f46e5", "6 projects", "Top 25%"),
        ("LLM tools", 76, 58, 28, "#f59e0b", "2 projects", "Rising"),
        ("Rust", 52, 76, 24, "#f59e0b", "2 side projects", "Rising"),
        ("Docker", 38, 52, 26, "#4f46e5", "4 projects", "Top 30%"),
        ("MLOps", 64, 74, 20, "em", "Recommended", "Focus area"),
        ("Go", 84, 40, 18, "em", "1 project", "New"),
    ]
    for name, x, y, r, color, ev, peer in nodes:
        is_em = color == "em"
        c.execute(
            """INSERT INTO skill_nodes
               (professional_id,name,status,evidence,peer_percentile,pos_x,pos_y,radius,color)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (pid, name, status_from_color(color, is_em), ev, peer, x, y, r,
             None if is_em else color),
        )

    # --- capability radar ---------------------------------------------------
    radar_labels = ["Coding", "Data eng", "ML", "Systems", "MLOps", "Leadership"]
    you = [94, 88, 82, 66, 34, 52]
    target = [85, 80, 85, 80, 80, 75]
    c.executemany(
        "INSERT INTO capabilities (professional_id,axis,you_score,target_score) VALUES (?,?,?,?)",
        [(pid, radar_labels[i], you[i], target[i]) for i in range(len(radar_labels))],
    )

    # --- growth path --------------------------------------------------------
    growth = [
        ("done", "Foundational ML — complete",
         "Verified across 4 projects and a Kaggle top-5% finish.",
         [("verified", "ver")]),
        ("now", "Production & MLOps — in progress",
         "Deploy a model with monitoring, CI/CD and rollback. Biggest readiness lever.",
         [("+9% readiness", "default"), ("2-3 weeks", "amber")]),
        ("next", "System design at scale",
         "Take an assessment or add evidence of distributed design decisions.",
         [("assessment ready", "teal")]),
        ("next", "Technical leadership",
         "Mentor signals + a project where you set direction.", []),
    ]
    for i, (state, title, desc, chips) in enumerate(growth, start=1):
        c.execute(
            "INSERT INTO growth_steps (professional_id,ordinal,state,title,description) VALUES (?,?,?,?,?)",
            (pid, i, state, title, desc),
        )
        step_id = c.lastrowid
        c.executemany(
            "INSERT INTO growth_step_chips (step_id,label,kind) VALUES (?,?,?)",
            [(step_id, label, kind) for label, kind in chips],
        )

    # --- evidence sources ---------------------------------------------------
    sources = [
        ("github", "GitHub", "3 repos analyzed - 842 commits read", 1),
        ("linkedin", "LinkedIn", "Roles & endorsements imported", 1),
        ("scholar", "Google Scholar", "Add publications & citations", 0),
        ("credentials", "Credentials", "Import certificates & assessments", 0),
    ]
    c.executemany(
        "INSERT INTO evidence_sources (professional_id,type,name,detail,verified) VALUES (?,?,?,?,?)",
        [(pid, *s) for s in sources],
    )

    # --- recruiter ----------------------------------------------------------
    c.execute(
        "INSERT INTO recruiters (name,initials,role) VALUES (?,?,?)",
        ("Marcus Lee", "ML", "Talent partner - Northwind"),
    )

    # --- candidates ---------------------------------------------------------
    candidates = [
        ("Aanya Rao", "AR", "#4f46e5", "Software engineer - 5y - SF", 92,
         ["Python", "Data eng", "MLOps"], pid),
        ("Diego Marin", "DM", "#0ea5a4", "ML engineer - 6y - Remote", 88,
         ["PyTorch", "Rust", "Distributed"], None),
        ("Priya Nair", "PN", "#f59e0b", "Data scientist - 4y - NYC", 81,
         ["Python", "Stats", "LLMs"], None),
        ("Sam Okoye", "SO", "#ec4899", "Backend to ML - 7y - London", 76,
         ["Go", "Systems", "ML"], None),
    ]
    for name, initials, color, role, match, cskills, link in candidates:
        c.execute(
            "INSERT INTO candidates (name,initials,color,role,match_score,professional_id) VALUES (?,?,?,?,?,?)",
            (name, initials, color, role, match, link),
        )
        cid = c.lastrowid
        c.executemany(
            "INSERT INTO candidate_skills (candidate_id,skill) VALUES (?,?)",
            [(cid, s) for s in cskills],
        )

    conn.commit()
    return conn


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "careertwin.db"))
    args = ap.parse_args()

    conn = build(args.out)
    c = conn.cursor()
    tables = [r[0] for r in c.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
    print(f"Built {args.out}")
    print(f"Tables ({len(tables)}): {', '.join(tables)}")
    for t in tables:
        n = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"  {t:20} {n} rows")
    conn.close()


if __name__ == "__main__":
    main()

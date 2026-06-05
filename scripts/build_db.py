#!/usr/bin/env python3
"""Convert server/cache/pull-requests.json to server/cache/pull-requests.db (SQLite)."""

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
JSON_PATH = ROOT / "server" / "cache" / "pull-requests.json"
DB_PATH = ROOT / "server" / "cache" / "pull-requests.db"

FIELDS = [
    "id", "number", "title", "user", "user_id", "state",
    "created_at", "closed_at", "merged_at",
    "repo_url", "repo_id", "html_url", "body", "agent",
]

BATCH_SIZE = 10_000


def main() -> None:
    if not JSON_PATH.exists():
        print(f"ERROR: {JSON_PATH} not found. Run fetch_data.py first.", file=sys.stderr)
        sys.exit(1)

    size_mb = JSON_PATH.stat().st_size / 1024 ** 2
    print(f"Reading {JSON_PATH} ({size_mb:.0f} MB)...")
    with open(JSON_PATH) as f:
        rows = json.load(f)
    print(f"Loaded {len(rows):,} rows")

    if DB_PATH.exists():
        DB_PATH.unlink()
        print(f"Removed existing {DB_PATH}")

    print(f"Creating {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE pull_requests (
            id       INTEGER PRIMARY KEY,
            number   INTEGER,
            title    TEXT,
            user     TEXT,
            user_id  INTEGER,
            state    TEXT,
            created_at TEXT,
            closed_at  TEXT,
            merged_at  TEXT,
            repo_url   TEXT,
            repo_id    INTEGER,
            html_url   TEXT,
            body       TEXT,
            agent      TEXT
        )
    """)

    placeholders = ", ".join(["?"] * len(FIELDS))
    sql = (
        f"INSERT OR REPLACE INTO pull_requests ({', '.join(FIELDS)}) "
        f"VALUES ({placeholders})"
    )

    total = len(rows)
    for i in range(0, total, BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        cur.executemany(sql, [[r.get(f) for f in FIELDS] for r in batch])
        conn.commit()
        print(f"  Inserted {min(i + BATCH_SIZE, total):,} / {total:,} rows")

    print("Building indexes...")
    cur.execute("CREATE INDEX idx_state      ON pull_requests(state)")
    cur.execute("CREATE INDEX idx_agent      ON pull_requests(agent)")
    cur.execute("CREATE INDEX idx_created_at ON pull_requests(created_at)")
    conn.commit()
    conn.close()

    size_db = DB_PATH.stat().st_size / 1024 ** 2
    print(f"Done — {DB_PATH} ({size_db:.0f} MB)")


if __name__ == "__main__":
    main()

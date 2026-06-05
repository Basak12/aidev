# AIDev

A dashboard for exploring the [hao-li/AIDev](https://huggingface.co/datasets/hao-li/AIDev) HuggingFace dataset — a collection of 932,791 AI-generated pull requests from GitHub.

## What it does

- **Dashboard** — stat cards (total, open, closed, merged), PRs by agent, PR status breakdown, and PRs over time charts
- **Pull Requests** — paginated, sortable table with links to the original GitHub PRs

## Project structure

```
aidev/
├── client/          # React + TypeScript + Vite frontend
├── server/          # NestJS backend API
└── scripts/         # Python data pipeline
    ├── fetch_data.py   # Downloads dataset from HuggingFace as Parquet → JSON
    └── build_db.py     # Converts JSON cache → SQLite database
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- A HuggingFace account with `HF_TOKEN` (required to download the dataset)

## Setup

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && yarn install
```

### 2. Download the dataset

```bash
cd ..
python3 scripts/fetch_data.py
```

Reads `HF_TOKEN` from `server/.env` automatically. Downloads ~932k rows and saves to `server/cache/pull-requests.json` (~900MB).

### 3. Build the database

```bash
python3 scripts/build_db.py
```

Converts the JSON cache to a SQLite database at `server/cache/pull-requests.db`. Takes ~5 minutes on first run.

### 4. Start the server

```bash
cd server && yarn run start
```

API runs on `http://localhost:3001`.

### 5. Start the client

```bash
cd client && npm run dev
```

App runs on `http://localhost:5173`.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pull-requests` | Paginated PR listing (`?page=1&limit=25`) |
| GET | `/api/pull-requests/stats` | Total, open, closed, merged counts |
| GET | `/api/pull-requests/by-agent` | PR count grouped by AI agent |
| GET | `/api/pull-requests/by-state` | Open / closed / merged breakdown |
| GET | `/api/pull-requests/over-time` | PR count grouped by month |

## Environment variables

Create `server/.env`:

```
HF_TOKEN=your_huggingface_token
```

## Notes

- `server/cache/` is excluded from git (data files are too large)
- Steps 2 and 3 only need to be run once per machine

#!/usr/bin/env python3
"""Download hao-li/AIDev (all_pull_request split) as Parquet and save as JSON cache."""

import json
import os
import sys
from pathlib import Path

import pyarrow.parquet as pq
from huggingface_hub import HfApi, hf_hub_download

ROOT = Path(__file__).parent.parent
ENV_FILE = ROOT / "server" / ".env"

# Load server/.env if HF_TOKEN is not already in the environment
if not os.environ.get("HF_TOKEN") and ENV_FILE.exists():
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

HF_TOKEN = os.environ.get("HF_TOKEN")
if not HF_TOKEN:
    print(f"ERROR: HF_TOKEN not found in environment or {ENV_FILE}", file=sys.stderr)
    sys.exit(1)

REPO_ID = "hao-li/AIDev"
CONFIG = "all_pull_request"
SPLIT = "train"
CACHE_PATH = Path(__file__).parent.parent / "server" / "cache" / "pull-requests.json"


def list_parquet_files(api: HfApi) -> list[str]:
    files = api.list_repo_files(REPO_ID, repo_type="dataset", token=HF_TOKEN)
    parquet_files = [
        f for f in files
        if f.startswith(f"{CONFIG}/{SPLIT}") and f.endswith(".parquet")
    ]
    if not parquet_files:
        # Fallback: look in data/ prefix or any parquet under the config dir
        parquet_files = [
            f for f in files
            if CONFIG in f and f.endswith(".parquet")
        ]
    return sorted(parquet_files)


def main() -> None:
    api = HfApi()

    print(f"Listing parquet files for {REPO_ID} ({CONFIG}/{SPLIT})...")
    parquet_files = list_parquet_files(api)
    if not parquet_files:
        print(f"ERROR: No parquet files found for config={CONFIG} split={SPLIT}", file=sys.stderr)
        sys.exit(1)
    print(f"Found {len(parquet_files)} parquet file(s): {parquet_files}")

    all_rows: list[dict] = []
    for i, filename in enumerate(parquet_files, start=1):
        print(f"Downloading [{i}/{len(parquet_files)}]: {filename}")
        local_path = hf_hub_download(
            repo_id=REPO_ID,
            filename=filename,
            repo_type="dataset",
            token=HF_TOKEN,
        )
        print(f"  Reading parquet: {local_path}")
        table = pq.read_table(local_path)
        rows = table.to_pydict()
        # Convert column-oriented dict to list of row dicts
        keys = list(rows.keys())
        n = len(rows[keys[0]])
        for j in range(n):
            all_rows.append({k: rows[k][j] for k in keys})
        print(f"  Loaded {n} rows (total so far: {len(all_rows)})")

    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    print(f"Saving {len(all_rows)} rows to {CACHE_PATH}...")
    CACHE_PATH.write_text(json.dumps(all_rows, default=str))
    print(f"Done — saved {len(all_rows)} rows to {CACHE_PATH}")


if __name__ == "__main__":
    main()

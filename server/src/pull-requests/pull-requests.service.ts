import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

const DB_PATH = path.join(process.cwd(), 'cache', 'pull-requests.db');

@Injectable()
export class PullRequestsService implements OnModuleInit {
  private readonly logger = new Logger(PullRequestsService.name);
  private db: Database.Database | null = null;

  onModuleInit() {
    if (!fs.existsSync(DB_PATH)) {
      this.logger.error(
        `Database not found at ${DB_PATH}. Run scripts/build_db.py to create it.`,
      );
      return;
    }
    this.db = new Database(DB_PATH, { readonly: true });
    const row = this.db
      .prepare('SELECT COUNT(*) as c FROM pull_requests')
      .get() as { c: number };
    this.logger.log(`Opened database with ${row.c.toLocaleString()} rows`);
  }

  getRows(page: number, limit: number) {
    if (!this.db) return { total: 0, page, limit, rows: [] };
    const offset = (page - 1) * limit;
    const rows = this.db
      .prepare(
        `SELECT id, number, title, user, user_id, state,
                created_at, closed_at, merged_at,
                repo_url, repo_id, html_url, body, agent
         FROM pull_requests
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
      )
      .all(limit, offset);
    const { total } = this.db
      .prepare('SELECT COUNT(*) as total FROM pull_requests')
      .get() as { total: number };
    return { total, page, limit, rows };
  }

  getStats() {
    if (!this.db) return { total: 0, open: 0, closed: 0, merged: 0 };
    const { total } = this.db
      .prepare('SELECT COUNT(*) as total FROM pull_requests')
      .get() as { total: number };
    const { open } = this.db
      .prepare(
        "SELECT COUNT(*) as open FROM pull_requests WHERE state = 'open'",
      )
      .get() as { open: number };
    const { closed } = this.db
      .prepare(
        "SELECT COUNT(*) as closed FROM pull_requests WHERE state = 'closed'",
      )
      .get() as { closed: number };
    const { merged } = this.db
      .prepare(
        'SELECT COUNT(*) as merged FROM pull_requests WHERE merged_at IS NOT NULL',
      )
      .get() as { merged: number };
    return { total, open, closed, merged };
  }

  getByAgent() {
    if (!this.db) return [];
    return this.db
      .prepare(
        'SELECT agent, COUNT(*) as count FROM pull_requests GROUP BY agent ORDER BY count ASC',
      )
      .all();
  }

  getByState() {
    if (!this.db) return [];
    const { open } = this.db
      .prepare(
        "SELECT COUNT(*) as open FROM pull_requests WHERE state = 'open'",
      )
      .get() as { open: number };
    const { merged } = this.db
      .prepare(
        'SELECT COUNT(*) as merged FROM pull_requests WHERE merged_at IS NOT NULL',
      )
      .get() as { merged: number };
    const { closedOnly } = this.db
      .prepare(
        "SELECT COUNT(*) as closedOnly FROM pull_requests WHERE state = 'closed' AND merged_at IS NULL",
      )
      .get() as { closedOnly: number };
    return [
      { name: 'Open', value: open },
      { name: 'Closed', value: closedOnly },
      { name: 'Merged', value: merged },
    ];
  }

  getOverTime() {
    if (!this.db) return [];
    return this.db
      .prepare(
        `SELECT substr(created_at, 1, 7) as month, COUNT(*) as count
         FROM pull_requests
         GROUP BY month
         ORDER BY month`,
      )
      .all();
  }
}

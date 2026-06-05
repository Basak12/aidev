import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';

const BASE_URL =
  'https://datasets-server.huggingface.co/rows?dataset=hao-li%2FAIDev&config=all_pull_request&split=train';
const PAGE_SIZE = 100;
const REQUEST_DELAY_MS = 300;
const CACHE_PATH = path.join(process.cwd(), 'cache', 'pull-requests.json');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class PullRequestsService implements OnModuleInit {
  private readonly logger = new Logger(PullRequestsService.name);
  private readonly headers: Record<string, string>;
  private cache: any[] | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.headers = {
      Authorization: `Bearer ${this.config.get<string>('HF_TOKEN')}`,
    };
  }

  async onModuleInit() {
    try {
      await this.loadOrFetch();
    } catch (err) {
      this.logger.error('Failed to load data on startup', err);
    }
  }

  private async loadOrFetch() {
    try {
      const file = await fs.readFile(CACHE_PATH, 'utf-8');
      this.cache = JSON.parse(file);
      this.logger.log(`Loaded ${this.cache!.length} rows from disk cache`);
    } catch {
      this.logger.log('No cache found, fetching from Hugging Face...');
      await this.fetchAndCache();
    }
  }

  private async fetchTotal(): Promise<number> {
    const { data } = await firstValueFrom(
      this.http.get(
        'https://datasets-server.huggingface.co/size?dataset=hao-li%2FAIDev&config=all_pull_request&split=train',
        { headers: this.headers },
      ),
    );
    return data.size.splits[0].num_rows;
  }

  private async fetchPage(offset: number, attempt = 0): Promise<any[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${BASE_URL}&offset=${offset}&length=${PAGE_SIZE}`, {
          headers: this.headers,
        }),
      );
      return data.rows;
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = err?.response?.headers?.['retry-after'];
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 60_000;
        this.logger.warn(
          `429 at offset ${offset}, retrying in ${waitMs}ms...`,
        );
        await delay(waitMs);
        return this.fetchPage(offset, attempt);
      }

      if (err?.response?.status === 500 && attempt < 3) {
        const waitMs = 2000 * (attempt + 1);
        this.logger.warn(
          `500 at offset ${offset}, retry ${attempt + 1} in ${waitMs}ms...`,
        );
        await delay(waitMs);
        return this.fetchPage(offset, attempt + 1);
      }

      throw err;
    }
  }

  private async fetchAndCache() {
    const total = await this.fetchTotal();
    this.logger.log(`Dataset has ${total} rows`);
    const allRows: any[] = [];
    const totalPages = Math.ceil(total / PAGE_SIZE);

    for (let page = 0; page < totalPages; page++) {
      const offset = page * PAGE_SIZE;
      const rows = await this.fetchPage(offset);
      allRows.push(...rows);

      if ((page + 1) % 10 === 0) {
        this.logger.log(`Fetched ${allRows.length} / ${total} rows`);
      }

      if (page < totalPages - 1) await delay(REQUEST_DELAY_MS);
    }

    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.writeFile(CACHE_PATH, JSON.stringify(allRows));
    this.cache = allRows;
    this.logger.log(`Done — cached ${allRows.length} rows to disk`);
  }

  getData() {
    return {
      dataset: 'hao-li/AIDev',
      config: 'all_pull_request',
      split: 'train',
      rows: this.cache ?? [],
    };
  }
}
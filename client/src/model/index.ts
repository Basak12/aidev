export interface PullRequest {
  id: number;
  number: number;
  title: string;
  user: string;
  user_id: number;
  state: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  repo_url: string;
  repo_id: number;
  html_url: string;
  body: string;
  agent: string;
}

export interface PaginatedResponse {
  total: number;
  page: number;
  limit: number;
  rows: PullRequest[];
}

export interface Stats {
  total: number;
  open: number;
  closed: number;
  merged: number;
}

export interface ByAgentItem {
  agent: string;
  count: number;
}

export interface ByStateItem {
  name: string;
  value: number;
}

export interface OverTimeItem {
  month: string;
  count: number;
}

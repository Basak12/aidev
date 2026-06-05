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

export interface HFRow {
  row_idx: number;
  row: PullRequest;
  truncated_cells: string[];
}

export interface HFResponse {
  dataset: string;
  config: string;
  split: string;
  features: { feature_idx: number; name: string; type: object }[];
  rows: HFRow[];
}

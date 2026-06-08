import axios from 'axios';
import type {
  PaginatedResponse,
  Stats,
  ByAgentItem,
  ByStateItem,
  OverTimeItem,
  CodeReviewStats,
  CodeQualityStats,
} from '../model';

const apiClient = axios.create({ baseURL: '/api' });

export const fetchPullRequests = (page = 1, limit = 25): Promise<PaginatedResponse> =>
  apiClient
    .get<PaginatedResponse>('/pull-requests', { params: { page, limit } })
    .then((r) => r.data);

export const fetchStats = (): Promise<Stats> =>
  apiClient.get<Stats>('/pull-requests/stats').then((r) => r.data);

export const fetchByAgent = (): Promise<ByAgentItem[]> =>
  apiClient.get<ByAgentItem[]>('/pull-requests/by-agent').then((r) => r.data);

export const fetchByState = (): Promise<ByStateItem[]> =>
  apiClient.get<ByStateItem[]>('/pull-requests/by-state').then((r) => r.data);

export const fetchOverTime = (): Promise<OverTimeItem[]> =>
  apiClient.get<OverTimeItem[]>('/pull-requests/over-time').then((r) => r.data);

export const fetchCodeReviewStats = (): Promise<CodeReviewStats> =>
  apiClient.get<CodeReviewStats>('/pull-requests/code-review-stats').then((r) => r.data);

export const fetchCodeReviewRows = (page = 1, limit = 25): Promise<PaginatedResponse> =>
  apiClient.get<PaginatedResponse>('/pull-requests/code-review-rows', { params: { page, limit } }).then((r) => r.data);

export const fetchCodeQualityStats = (): Promise<CodeQualityStats> =>
  apiClient.get<CodeQualityStats>('/pull-requests/code-quality-stats').then((r) => r.data);

export const fetchCodeQualityRows = (page = 1, limit = 25): Promise<PaginatedResponse> =>
  apiClient.get<PaginatedResponse>('/pull-requests/code-quality-rows', { params: { page, limit } }).then((r) => r.data);

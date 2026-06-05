import axios from 'axios';
import type { HFResponse } from '../model';

const apiClient = axios.create({ baseURL: 'http://localhost:3001/api' });

export const fetchPullRequests = (): Promise<HFResponse> =>
  apiClient.get<HFResponse>('/pull-requests').then((r) => r.data);

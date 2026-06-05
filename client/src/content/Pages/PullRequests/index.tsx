import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Chip, Link, Typography } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { fetchPullRequests } from '../../../api';
import type { PullRequest } from '../../../model';

const columns: GridColDef<PullRequest>[] = [
  { field: 'number', headerName: '#', width: 70 },
  { field: 'title', headerName: 'Title', flex: 2, minWidth: 200 },
  { field: 'user', headerName: 'Author', width: 140 },
  {
    field: 'state',
    headerName: 'State',
    width: 100,
    renderCell: (params: GridRenderCellParams<PullRequest, string>) => (
      <Chip
        label={params.value}
        color={params.value === 'open' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  { field: 'agent', headerName: 'Agent', width: 130 },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 170,
    valueFormatter: (value: string) => (value ? new Date(value).toLocaleString() : ''),
  },
  {
    field: 'merged_at',
    headerName: 'Merged',
    width: 170,
    valueFormatter: (value: string | null) =>
      value ? new Date(value).toLocaleString() : '—',
  },
  {
    field: 'html_url',
    headerName: 'PR Link',
    width: 90,
    renderCell: (params: GridRenderCellParams<PullRequest, string>) => (
      <Link href={params.value} target="_blank" rel="noopener">
        View
      </Link>
    ),
  },
];

export default function PullRequestsPage() {
  const [rows, setRows] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const load = useCallback((model: GridPaginationModel) => {
    setLoading(true);
    fetchPullRequests(model.page + 1, model.pageSize)
      .then((data) => {
        setRows(data.rows);
        setRowCount(data.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(paginationModel);
  }, [paginationModel, load]);

  return (
    <Box>
      Pull Requests
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Dataset: <strong>hao-li/AIDev</strong> &nbsp;|&nbsp; Config:{' '}
        <strong>all_pull_request</strong> &nbsp;|&nbsp; Split: <strong>train</strong>
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
      />
    </Box>
  );
}

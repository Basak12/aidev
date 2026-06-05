import { useEffect, useState } from 'react';
import { Box, Typography, Alert, Chip, Link } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
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
  const [meta, setMeta] = useState<{ dataset: string; config: string; split: string } | null>(null);

  useEffect(() => {
    fetchPullRequests()
      .then((data) => {
        setMeta({ dataset: data.dataset, config: data.config, split: data.split });
        setRows(data.rows.map((r) => r.row));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      Pull Requests
      {meta && (
        <Typography variant="body2" color="text.secondary" sx={{
          mb: 2
        }}>
          Dataset: <strong>{meta.dataset}</strong> &nbsp;|&nbsp; Config:{' '}
          <strong>{meta.config}</strong> &nbsp;|&nbsp; Split: <strong>{meta.split}</strong>
        </Typography>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
        autoHeight
        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
      />
    </Box>
  );
}

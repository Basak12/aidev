import { useCallback, useEffect, useState } from 'react';
import { Alert, Chip, Link, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import { fetchCodeQualityRows } from '../../../../../api';
import type { PullRequest } from '../../../../../model';

const columns: GridColDef<PullRequest>[] = [
  { field: 'number', headerName: '#', width: 70 },
  { field: 'title', headerName: 'Title', flex: 2, minWidth: 200 },
  { field: 'user', headerName: 'Author', width: 140 },
  {
    field: 'state',
    headerName: 'State',
    width: 100,
    renderCell: (params: GridRenderCellParams<PullRequest, string>) => (
      <Chip label={params.value} color={params.value === 'open' ? 'success' : 'default'} size="small" />
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
    valueFormatter: (value: string | null) => (value ? new Date(value).toLocaleString() : '—'),
  },
  {
    field: 'html_url',
    headerName: 'PR Link',
    width: 90,
    renderCell: (params: GridRenderCellParams<PullRequest, string>) => (
      <Link href={params.value} target="_blank" rel="noopener">View</Link>
    ),
  },
];

export default function QualityTable() {
  const [rows, setRows] = useState<PullRequest[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const load = useCallback((model: GridPaginationModel) => {
    setLoading(true);
    fetchCodeQualityRows(model.page + 1, model.pageSize)
      .then((d) => { setRows(d.rows); setRowCount(d.total); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(paginationModel); }, [paginationModel, load]);

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
        Pull Requests
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
    </>
  );
}

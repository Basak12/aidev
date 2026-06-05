import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { fetchStats, fetchByAgent, fetchByState, fetchOverTime } from '../../../api';
import type { Stats, ByAgentItem, ByStateItem, OverTimeItem } from '../../../model';
import PRsByAgent from './charts/PRsByAgent';
import PRsByState from './charts/PRsByState';
import PRsOverTime from './charts/PRsOverTime';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [byAgent, setByAgent] = useState<ByAgentItem[]>([]);
  const [byState, setByState] = useState<ByStateItem[]>([]);
  const [overTime, setOverTime] = useState<OverTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStats(), fetchByAgent(), fetchByState(), fetchOverTime()])
      .then(([s, a, st, ot]) => {
        setStats(s);
        setByAgent(a);
        setByState(st);
        setOverTime(ot);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  const statCards = [
    { label: 'Total PRs', value: stats!.total, icon: <MergeTypeIcon />, color: '#2563eb' },
    { label: 'Open', value: stats!.open, icon: <RadioButtonUncheckedIcon />, color: '#059669' },
    { label: 'Closed', value: stats!.closed, icon: <CheckCircleIcon />, color: '#64748b' },
    { label: 'Merged', value: stats!.merged, icon: <MergeTypeIcon />, color: '#0891b2' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {s.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PRsByAgent data={byAgent} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PRsByState data={byState} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PRsOverTime data={overTime} />
        </Grid>
      </Grid>
    </Box>
  );
}

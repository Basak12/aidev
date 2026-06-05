import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { fetchPullRequests } from '../../../api';
import type { PullRequest } from '../../../model';
import PRsByAgent from './charts/PRsByAgent';
import PRsByState from './charts/PRsByState';
import PRsOverTime from './charts/PRsOverTime';

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPullRequests()
      .then((data) => setPrs(data.rows.map((r) => r.row)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const open = prs.filter((p) => p.state === 'open').length;
  const closed = prs.filter((p) => p.state === 'closed').length;
  const merged = prs.filter((p) => p.merged_at).length;

  const stats: Stat[] = [
    { label: 'Total PRs', value: prs.length, icon: <MergeTypeIcon />, color: '#2563eb' },
    { label: 'Open', value: open, icon: <RadioButtonUncheckedIcon />, color: '#059669' },
    { label: 'Closed', value: closed, icon: <CheckCircleIcon />, color: '#64748b' },
    { label: 'Merged', value: merged, icon: <MergeTypeIcon />, color: '#0891b2' },
  ];

  const agentCounts = prs.reduce<Record<string, number>>((acc, pr) => {
    acc[pr.agent] = (acc[pr.agent] || 0) + 1;
    return acc;
  }, {});
  const prsByAgent = Object.entries(agentCounts)
    .map(([agent, count]) => ({ agent, count }))
    .sort((a, b) => a.count - b.count);

  const prsByState = [
    { name: 'Open', value: open },
    { name: 'Closed', value: closed - merged },
    { name: 'Merged', value: merged },
  ];

  const monthCounts = prs.reduce<Record<string, number>>((acc, pr) => {
    const month = pr.created_at.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const prsOverTime = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return (
    <Box>
      <Typography variant="h5" sx={{
        fontWeight: 700,
        mb: 3
      }}>
        Dashboard</Typography>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{
                  fontWeight:700
                }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PRsByAgent data={prsByAgent} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PRsByState data={prsByState} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PRsOverTime data={prsOverTime} />
        </Grid>
      </Grid>
    </Box>
  );
}

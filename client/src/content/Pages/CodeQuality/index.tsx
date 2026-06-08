import { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import PercentIcon from '@mui/icons-material/Percent';
import GroupIcon from '@mui/icons-material/Group';
import { fetchCodeQualityStats } from '../../../api';
import type { CodeQualityStats } from '../../../model';
import StatCard from '../CodeReview/components/StatCard';
import QualityByAgent from './components/QualityByAgent';
import QualityByState from './components/QualityByState';
import QualityOverTime from './components/QualityOverTime';
import QualityTable from './components/QualityTable';

export default function CodeQualityPage() {
  const [data, setData] = useState<CodeQualityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCodeQualityStats()
      .then(setData)
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
  if (!data) return null;

  const topAgent = data.byAgent[0];

  const statCards = [
    { label: 'Code Quality PRs', value: data.total.toLocaleString(), icon: <VerifiedIcon />, color: '#0891b2' },
    { label: 'Merged', value: data.byState.find((s) => s.name === 'Merged')?.value.toLocaleString() ?? '0', icon: <MergeTypeIcon />, color: '#7c3aed' },
    { label: 'Merge Rate', value: `${data.mergeRate}%`, icon: <PercentIcon />, color: '#059669' },
    { label: 'Top Agent', value: topAgent?.agent ?? '—', icon: <GroupIcon />, color: '#d97706' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Quality
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <QualityByAgent data={data.byAgent} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QualityByState data={data.byState} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <QualityOverTime data={data.overTime} />
        </Grid>
      </Grid>
      <QualityTable />
    </Box>
  );
}

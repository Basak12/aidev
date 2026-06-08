import { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import PercentIcon from '@mui/icons-material/Percent';
import GroupIcon from '@mui/icons-material/Group';
import { fetchCodeReviewStats } from '../../../api';
import type { CodeReviewStats } from '../../../model';
import StatCard from './components/StatCard';
import ReviewsByAgent from './components/ReviewsByAgent';
import ReviewsByState from './components/ReviewsByState';
import ReviewsOverTime from './components/ReviewsOverTime';
import ReviewsTable from './components/ReviewsTable';

export default function CodeReviewPage() {
  const [data, setData] = useState<CodeReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCodeReviewStats()
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
    { label: 'Review PRs', value: data.total.toLocaleString(), icon: <RateReviewIcon />, color: '#7c3aed' },
    { label: 'Merged', value: data.byState.find((s) => s.name === 'Merged')?.value.toLocaleString() ?? '0', icon: <MergeTypeIcon />, color: '#0891b2' },
    { label: 'Merge Rate', value: `${data.mergeRate}%`, icon: <PercentIcon />, color: '#059669' },
    { label: 'Top Agent', value: topAgent?.agent ?? '—', icon: <GroupIcon />, color: '#d97706' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Code Review
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
          <ReviewsByAgent data={data.byAgent} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReviewsByState data={data.byState} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ReviewsOverTime data={data.overTime} />
        </Grid>
      </Grid>
      <ReviewsTable />
    </Box>
  );
}

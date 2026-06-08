import { Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ label, value, icon, color }: Props) {
  return (
    <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
      <Box sx={{ color, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

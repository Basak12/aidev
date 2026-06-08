import ReactECharts from 'echarts-for-react';
import { Paper, Typography } from '@mui/material';
import type { ByStateItem } from '../../../../../model';

interface Props {
  data: ByStateItem[];
}

export default function QualityByState({ data }: Props) {
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { color: '#64748b', fontSize: 12 } },
    color: ['#0891b2', '#64748b', '#059669'],
    series: [
      {
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['50%', '44%'],
        data,
        itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 700 },
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.12)' },
        },
      },
    ],
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.secondary">
        Quality PR Status
      </Typography>
      <ReactECharts option={option} style={{ height: 280 }} />
    </Paper>
  );
}

import ReactECharts from 'echarts-for-react';
import { Paper, Typography } from '@mui/material';

interface Props {
  data: { agent: string; count: number }[];
}

export default function PRsByAgent({ data }: Props) {
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '6%', top: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', minInterval: 1, axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    yAxis: { type: 'category', data: data.map((d) => d.agent), axisLine: { show: false }, axisTick: { show: false } },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.count),
        itemStyle: { color: '#2563eb', borderRadius: [0, 4, 4, 0] },
        barMaxWidth: 32,
        label: { show: true, position: 'right', color: '#64748b', fontSize: 12 },
      },
    ],
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.secondary">
        PRs by Agent
      </Typography>
      <ReactECharts option={option} style={{ height: 280 }} />
    </Paper>
  );
}

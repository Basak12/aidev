import ReactECharts from 'echarts-for-react';
import { Paper, Typography } from '@mui/material';

interface Props {
  data: { month: string; count: number }[];
}

export default function PRsOverTime({ data }: Props) {
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', top: '8%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        type: 'line',
        data: data.map((d) => d.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#2563eb', width: 2 },
        itemStyle: { color: '#2563eb', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37,99,235,0.18)' },
              { offset: 1, color: 'rgba(37,99,235,0.01)' },
            ],
          },
        },
      },
    ],
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.secondary">
        PRs Over Time
      </Typography>
      <ReactECharts option={option} style={{ height: 260 }} />
    </Paper>
  );
}

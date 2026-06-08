import ReactECharts from 'echarts-for-react';
import { Paper, Typography } from '@mui/material';
import type { ByAgentItem } from '../../../../../model';

interface Props {
  data: ByAgentItem[];
}

export default function ReviewsByAgent({ data }: Props) {
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', top: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', minInterval: 1, axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    yAxis: { type: 'category', data: data.map((d) => d.agent).reverse(), axisLine: { show: false }, axisTick: { show: false } },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.count).reverse(),
        itemStyle: { color: '#7c3aed', borderRadius: [0, 4, 4, 0] },
        barMaxWidth: 32,
        label: { show: true, position: 'right', color: '#64748b', fontSize: 12 },
      },
    ],
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.secondary">
        Review PRs by Agent
      </Typography>
      <ReactECharts option={option} style={{ height: 280 }} />
    </Paper>
  );
}

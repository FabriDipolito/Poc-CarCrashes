import { ResponsivePie } from '@nivo/pie';
import React from 'react';

interface PieChartProps {
  data: Array<{ id: string; label: string; value: number; color?: string }>;
  total: number;
}

export const MyResponsivePie: React.FC<PieChartProps> = ({ data, total }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
    activeOuterRadiusOffset={12}
    colors={{ scheme: 'blues' }}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    enableArcLinkLabels={false}
    arcLabel={(e) => Math.round((100 * e.value) / total) + '%'}
    arcLabelsRadiusOffset={0.75}
    arcLabelsTextColor="black"
  />
);

import { ResponsiveTreeMap } from '@nivo/treemap';
import React from 'react';

interface TreeNode {
  name: string;
  color?: string;
  loc?: number;
  children?: TreeNode[];
}

interface TreeMapChartProps {
  data: TreeNode;
}

export const MyResponsiveTreeMap: React.FC<TreeMapChartProps> = ({ data }) => (
  <ResponsiveTreeMap
    data={data}
    identity="name"
    value="loc"
    valueFormat=".02s"
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    labelSkipSize={10}
    labelTextColor={{
      from: 'color',
      modifiers: [['darker', 1.2]],
    }}
    parentLabelPosition="top"
    parentLabelTextColor={{
      from: 'color',
      modifiers: [['darker', 2]],
    }}
    colors={{ scheme: 'nivo' }}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.1]],
    }}
  />
);

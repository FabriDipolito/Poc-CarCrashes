'use client';

import { FC } from 'react';
import PieChartComponent from './PieChart/PieChartComponent';
import AreaChartComponent from './AreaChart/AreaChartComponent';

interface StateChartsProps {
  arrayOfYears: number[];
}

export const StateCharts: FC<StateChartsProps> = ({ arrayOfYears }) => {
  return (
    <div className="flex flex-row justify-between gap-[5%] p-4 w-full h-100">
      <PieChartComponent arrayOfYears={arrayOfYears} />
      <AreaChartComponent arrayOfYears={arrayOfYears} />
    </div>
  );
};

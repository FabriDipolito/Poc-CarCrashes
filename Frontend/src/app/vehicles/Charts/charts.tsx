'use client';

import { FC, useState } from 'react';
import PieChartComponent from './PieChart/PieChartComponent';
import { TreeMapComponent } from './TreemapChart/TreemapChartComponent';

interface VehicleChartsProps {
  arrayOfYears: number[];
}

export const VehiclesCharts: FC<VehicleChartsProps> = ({ arrayOfYears }) => {
  const [makeId, setMakeId] = useState<number>();
  const [filterType, setFilterType] = useState('dangerous');

  return (
    <div className="w-full flex flex-row gap-5 p-4 justify-between box-border">
      <PieChartComponent
        arrayOfYears={arrayOfYears}
        setMakeId={setMakeId}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <TreeMapComponent makeId={makeId} filterType={filterType} />
    </div>
  );
};

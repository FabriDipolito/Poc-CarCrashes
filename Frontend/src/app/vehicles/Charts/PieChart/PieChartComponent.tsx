import React, { useState, useEffect } from 'react';
import { MyResponsivePie } from './MyResponsivePie';
import { PieChartDataItem } from '@/interfaces/vehicles';
import { getVehiclesPieChart } from '@/lib/api/vehicles';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';

interface PieChartComponentProps {
  arrayOfYears: number[];
  setMakeId: React.Dispatch<React.SetStateAction<number | undefined>>;
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  arrayOfYears,
  setMakeId,
  filterType,
  setFilterType,
}) => {
  const [startYear, setStartYear] = useState<number>(2018);
  const [endYear, setEndYear] = useState<number>(2022);
  const [pieGraphData, setPieGraphData] = useState<PieChartDataItem[]>([]);
  const [pieGraphDataTotal, setPieGraphDataTotal] = useState<number>(0);
  const { showLoader, hideLoader } = useLoadingTruck();

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const res = await getVehiclesPieChart(startYear, endYear, filterType);
        if (!res) throw new Error('❌ Error fetching piechart data');

        setPieGraphData(res);

        const total = res.reduce((sum, item) => sum + item.value, 0);
        setPieGraphDataTotal(total);
      } catch (err) {
        console.error('❌ Error fetching PieChart data:', err);
        setPieGraphData([]);
        setPieGraphDataTotal(0);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startYear, endYear, filterType]);

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartYear(Number(e.target.value));
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndYear = Number(e.target.value);
    if (newEndYear < startYear) setStartYear(newEndYear);
    setEndYear(newEndYear);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="flex flex-row justify-between items-center w-full sm:w-2/5">
      <div className="flex flex-col">
        <label htmlFor="startYearSelectVehicles" className="text-sm font-semibold text-gray-700 mb-2">Start Year:</label>
        <select
          id="startYearSelectVehicles"
          value={startYear}
          onChange={handleStartYearChange}
          className="p-2 text-sm border rounded-md border-gray-300 mb-8 w-full max-w-xs focus:outline-none focus:border-gray-600"
        >
          {arrayOfYears.map((year) => (
            <option key={year} value={year} disabled={year > endYear}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="endYearSelectVehicles" className="text-sm font-semibold text-gray-700 mb-2">End Year:</label>
        <select
          id="endYearSelectVehicles"
          value={endYear}
          onChange={handleEndYearChange}
          className="p-2 text-sm border rounded-md border-gray-300 mb-8 w-full max-w-xs focus:outline-none focus:border-gray-600"
        >
          {arrayOfYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="filterTypeSelectVehicles" className="text-sm font-semibold text-gray-700 mb-2">Filter:</label>
        <select
          id="filterTypeSelectVehicles"
          value={filterType}
          onChange={handleFilterChange}
          className="p-2 text-sm border rounded-md border-gray-300 mb-8 w-full max-w-xs focus:outline-none focus:border-gray-600"
        >
          <option value="dangerous">Top 10 Vehicles with most Accidents</option>
          <option value="safest">Top 10 Vehicles with least Accidents</option>
        </select>
      </div>

      <div className="flex justify-center items-start w-88 h-88">
        <MyResponsivePie data={pieGraphData} total={pieGraphDataTotal} setMakeId={setMakeId} />
      </div>
    </div>
  );
};

export default PieChartComponent;

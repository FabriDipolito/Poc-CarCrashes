import React, { useState, useEffect } from 'react';
import { PieChartComponentProps, PieChartDataItem } from '@/interfaces/states';
import { MyResponsivePie } from './MyResponsivePie';
import { getStatesPieChart } from '@/lib/api/states';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';

const PieChartComponent: React.FC<PieChartComponentProps> = ({ arrayOfYears }) => {
  const [startYear, setStartYear] = useState<number>(2018);
  const [endYear, setEndYear] = useState<number>(2022);
  const [filterType, setFilterType] = useState('dangerous');
  const [pieGraphData, setPieGraphData] = useState<PieChartDataItem[]>([]);
  const [pieGraphDataTotal, setPieGraphDataTotal] = useState<number>(0);
  const { showLoader, hideLoader } = useLoadingTruck();

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const data = await getStatesPieChart(startYear, endYear, filterType);
        if (!data) throw new Error('❌ Error fetching piechart data');

        setPieGraphData(data.array);
        setPieGraphDataTotal(data.total);
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

  return (
    <div className="flex flex-row items-center w-[45%] gap-20 border-r">
      <div className="flex flex-col justify-start h-full">
        <label htmlFor="startYear" className="text-sm font-semibold text-black mb-2">Start Year:</label>
        <select
          id="startYear"
          value={startYear}
          onChange={(e) => setStartYear(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-300 rounded mb-6 max-w-[200px] focus:outline-none focus:border-gray-500 cursor-pointer"
        >
          {arrayOfYears.map((year) => (
            <option key={year} value={year} disabled={year > endYear}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="endYear" className="text-sm font-semibold text-black mb-2">End Year:</label>
        <select
          id="endYear"
          value={endYear}
          onChange={(e) => {
            const newEndYear = Number(e.target.value);
            if (newEndYear < startYear) setStartYear(newEndYear);
            setEndYear(newEndYear);
          }}
          className="px-3 py-2 text-sm border border-gray-300 rounded mb-6 max-w-[200px] focus:outline-none focus:border-gray-500 cursor-pointer"
        >
          {arrayOfYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="filterType" className="text-sm font-semibold text-black mb-2">Filter:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded mb-6 max-w-[200px] focus:outline-none focus:border-gray-500 cursor-pointer"
        >
          <option value="dangerous">Top 10 States with most Accidents</option>
          <option value="safest">Top 10 States with least Accidents</option>
        </select>
      </div>

      <div className="flex justify-center items-start w-[350px] h-[350px]">
        <MyResponsivePie data={pieGraphData} total={pieGraphDataTotal} />
      </div>
    </div>
  );
};

export default PieChartComponent;

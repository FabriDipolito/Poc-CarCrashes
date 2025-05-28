import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { states } from '@/constants';
import { AreaChartComponentProps, AreaChartDataItem } from '@/interfaces/states';
import { getAreaChartData } from '@/lib/api';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ arrayOfYears }) => {
  const [selectedState, setSelectedState] = useState<number>(0);
  const [areaGraphData, setAreaGraphData] = useState<AreaChartDataItem[]>([]);
  const { showLoader, hideLoader } = useLoadingTruck();

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const data = await getAreaChartData(selectedState);
        if (!data) throw new Error('❌ Error fetching area chart data');

        setAreaGraphData(data.array);
      } catch (err) {
        console.error('❌ Error fetching area chart data:', err);
        setAreaGraphData([]);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  return (
    <div className="flex flex-col w-[60%] items-center justify-start">
      <div className="flex flex-col mb-0 items-start w-full">
        <label htmlFor="stateSelectCharts" className="text-sm mb-2 text-gray-800 font-semibold">Select one State:</label>
        <select
          id="stateSelectCharts"
          className="px-3 py-2 text-sm rounded border border-gray-300 mb-2 w-full max-w-[200px] focus:outline-none focus:border-gray-500 cursor-pointer"
          value={selectedState || ''}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedState(Number(event.target.value))
          }
        >
          <option value="">--Select--</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={
            areaGraphData.length !== 0
              ? areaGraphData
              : arrayOfYears.map((year) => ({ name: `${year}` }))
          }
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="rgb(184, 204, 223)"
            fill="rgb(198, 219, 239)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;

'use client';

import React, { useEffect } from 'react';
import { MyResponsiveTreeMap } from './MyResponsiveTreeMap';
import { TreeMapComponentProps, TreeMapData } from '@/interfaces/vehicles';
import { getTreeMapData } from '@/lib/api';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';

export const TreeMapComponent: React.FC<TreeMapComponentProps> = ({ makeId, filterType }) => {
  const [treeMapData, setTreeMapData] = React.useState<TreeMapData | null>(null);
  const { showLoader, hideLoader } = useLoadingTruck();

  useEffect(() => {
    const fetchData = async () => {
      if (!makeId) return;

      showLoader();
      try {
        const data = await getTreeMapData(makeId, filterType);
        if (!data) throw new Error('❌ Error fetching TreeMap data');

        setTreeMapData(data);
      } catch (err) {
        console.error('❌ Error fetching TreeMap data:', err);
        setTreeMapData(null);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeId, filterType]);

  return (
    <div className="flex justify-center items-start w-[80%] h-[500px]">
      {makeId ? (
        treeMapData && treeMapData.children.length > 0 ? (
          <MyResponsiveTreeMap data={treeMapData} />
        ) : (
          <div className="flex justify-center items-center w-full h-full bg-gray-300 border-2 border-gray-500 rounded-md text-gray-600 text-base font-bold">
            No data available
          </div>
        )
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-gray-300 border-2 border-gray-500 rounded-md text-gray-600 text-base font-bold">
          Click one of the PieChart Cells
        </div>
      )}
    </div>
  );
};

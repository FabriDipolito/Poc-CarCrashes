import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { useState } from 'react';

interface PieChartProps {
  data: Array<{ id: number; label: string; value: number; color: string }>;
  total: number;
  setMakeId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const MyResponsivePie: React.FC<PieChartProps> = ({ data, total, setMakeId }) => {
  const [cursor, setCursor] = useState<'default' | 'pointer'>('default');

  return (
    <div style={{ cursor, width: '100%', height: '100%' }}>
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
        tooltip={(e) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: 'fit-content',
              height: 'fit-content',
              backgroundColor: 'white',
              padding: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: e.datum.color,
              }}
            ></div>
            <p>{e.datum.label}: </p>
            <b>{e.datum.value}</b>
          </div>
        )}
        onClick={(node) => setMakeId(node.data.id)}
        onMouseEnter={() => setCursor('pointer')}
        onMouseLeave={() => setCursor('default')}
      />
    </div>
  );
};

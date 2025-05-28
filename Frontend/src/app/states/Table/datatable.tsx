'use client';
import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { states, statesFlags } from '@/constants';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AccidentData } from '@/interfaces/states';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { getStatesPaginated } from '@/lib/api';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';

interface StateDataTableProps {
  arrayOfYears: number[];
}

export const DataTable: FC<StateDataTableProps> = ({ arrayOfYears }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [data, setData] = useState<{
    array: AccidentData[];
    totalPaginations: number;
  }>({ array: [], totalPaginations: 0 });
  const { isLoading, showLoader, hideLoader } = useLoadingTruck();

  const [filterByStateId, setFilterByStateId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (pageIndex === 0) setFetchTrigger((prev) => prev + 1);
    setPageIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByStateId, startDate, endDate]);

  useEffect(() => {
    setFetchTrigger((prev) => prev + 1);
  }, [pageIndex]);

  useEffect(() => {
    const fetchData = async () => {
      showLoader();

      const params = new URLSearchParams({
        page: pageIndex.toString(),
        size: '10',
      });

      if (filterByStateId !== undefined)
        params.append('filterByStateId', filterByStateId.toString());
      if (startDate !== undefined) params.append('startDate', formatDateToYYYYMMDD(startDate));
      if (endDate !== undefined) params.append('endDate', formatDateToYYYYMMDD(endDate));

      try {
        const res = await getStatesPaginated(params.toString());
        if (res) {
          setData(res);
        } else {
          setData({ array: [], totalPaginations: 0 });
        }
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrigger]);

  function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="rounded border-t w-full p-4">
      <div className="flex flex-row gap-2 items-start w-full">
        <div className="flex flex-col items-start mb-4">
          <label htmlFor="stateSelect" className="text-sm mb-2 text-gray-800 font-semibold">Select one State:</label>
          <select
            id="stateSelect"
            value={filterByStateId || ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterByStateId(event.target.value === '' ? undefined : Number(event.target.value))
            }
            className="px-3 py-2 text-sm rounded border border-gray-300 max-w-[200px] w-full focus:outline-none focus:border-gray-500 mb-2 cursor-pointer"
          >
            <option value="">--Select--</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <DatePicker
          label="Start Date"
          date={startDate}
          setDate={setStartDate}
          minYear={Math.min(...arrayOfYears)}
          maxYear={Math.max(...arrayOfYears)}
          endDate={endDate}
        />
        <DatePicker
          label="End Date"
          date={endDate}
          setDate={setEndDate}
          minYear={Math.min(...arrayOfYears)}
          maxYear={Math.max(...arrayOfYears)}
          startDate={startDate}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flag</TableHead>
            <TableHead>State</TableHead>
            <TableHead>CrashDate</TableHead>
            <TableHead>Persons</TableHead>
            <TableHead>Fatals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.array.length ? (
            data.array.map((row, index) => (
              <TableRow key={index}>
                <TableCell isFlag>
                  <div className="relative w-[32px] h-[32px]">
                    <Image
                      src={
                        statesFlags.find((state) => state.id === row.state)?.url ||
                        '/images/Flags/default-flag.webp'
                      }
                      alt="State flag"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </TableCell>
                <TableCell>{row.stateName}</TableCell>
                <TableCell>{row.crashDate}</TableCell>
                <TableCell>{row.persons}</TableCell>
                <TableCell>{row.fatals}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.max(prev - 10, 0))}
          disabled={pageIndex < 10 || isLoading}
        >
          {'<<'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0 || isLoading}
        >
          Previous
        </Button>

        <span className="text-sm font-medium px-2">
          Page {pageIndex + 1} of {data.totalPaginations}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, data.totalPaginations - 1))}
          disabled={pageIndex >= data.totalPaginations - 1 || isLoading}
        >
          Next
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.min(prev + 10, data.totalPaginations - 1))}
          disabled={pageIndex >= data.totalPaginations - 10 || isLoading}
        >
          {'>>'}
        </Button>

        <input
          type="number"
          className="ml-2 w-20 border border-gray-300 rounded px-2 py-1 text-sm"
          min={1}
          max={data.totalPaginations}
          placeholder="Go to..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = Number((e.target as HTMLInputElement).value);
              if (!isNaN(value) && value >= 1 && value <= data.totalPaginations) {
                setPageIndex(value - 1);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

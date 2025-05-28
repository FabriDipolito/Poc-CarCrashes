/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FC, useEffect, useState } from 'react';
import { Vehicle } from '@/interfaces/vehicles';
import { carBrands } from '@/constants';
import { getVehicleMakes, getVehicleModels, getVehiclesPaginated } from '@/lib/api';
import { useLoadingTruck } from '@/hooks/useLoadingTruck';
import clsx from 'clsx';

export const DataTable: FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [data, setData] = useState<{ array: Vehicle[]; totalPaginations: number }>({
    array: [],
    totalPaginations: 0,
  });
  const { isLoading, showLoader, hideLoader } = useLoadingTruck();

  const [makeId, setMakeId] = useState<number | undefined>();
  const [arrayMakes, setArrayMakes] = useState<{ id: number; name: string }[] | undefined>();
  const [arrayModels, setArrayModels] = useState<{ id: number; name: string }[] | undefined>();
  const [modelId, setModelId] = useState<number | undefined>();

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await getVehicleMakes();

        if (!data) throw new Error('❌ Error fetching makes');

        setArrayMakes(data);
      } catch (err) {
        console.error('❌ Error fetching makes:', err);
        setArrayMakes(undefined);
      }
    };

    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (modelId === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        pageIndex === 0 ? setFetchTrigger((prev) => prev + 1) : setPageIndex(0);
      }

      setModelId(undefined);
      setArrayModels(undefined);

      if (makeId !== undefined) {
        try {
          const data = await getVehicleModels(makeId);

          if (!data) throw new Error('❌ Error fetching models');

          setArrayModels(data);
        } catch (err) {
          console.error('❌ Error fetching models by makeId:', err);
          setArrayModels(undefined);
        }
      } else {
        setArrayModels(undefined);
      }
    };

    fetchModels();
  }, [makeId]);

  useEffect(() => {
    if (pageIndex === 0) setFetchTrigger((prev) => prev + 1);
    setPageIndex(0);
  }, [modelId]);

  useEffect(() => {
    setFetchTrigger((prev) => prev + 1);
  }, [pageIndex]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const params = new URLSearchParams({
        page: pageIndex.toString(),
        size: '10',
      });

      if (makeId !== undefined) params.append('makeId', makeId.toString());
      if (modelId !== undefined) params.append('modelId', modelId.toString());

      showLoader();
      try {
        const res = await getVehiclesPaginated(params.toString());
        if (res) {
          setData(res);
        } else {
          setData({ array: [], totalPaginations: 0 });
        }
      } catch (error) {
        console.error('❌ Error fetching vehicles:', error);
      } finally {
        hideLoader();
      }
    };

    fetchVehicles();
  }, [fetchTrigger]);

  return (
    <div className="pt-2 w-full border-t">
      <div className="flex gap-2 mb-2">
        <div className="flex flex-col items-start">
          <label htmlFor="makeIdSelect" className="text-sm font-semibold mb-2 text-gray-800">Car Brand:</label>
          <select
            id="makeIdSelect"
            value={makeId || ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setMakeId(event.target.value === '' ? undefined : Number(event.target.value))
            }
            className="p-2 text-sm border rounded-md w-full max-w-xs focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <option value="">--Select--</option>
            {arrayMakes?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="modelIdSelect" className="text-sm font-semibold mb-2 text-gray-800">Car Model:</label>
          <select
            id="modelIdSelect"
            value={modelId || ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setModelId(event.target.value === '' ? undefined : Number(event.target.value))
            }
            disabled={!makeId || !arrayModels}
            aria-disabled={!makeId || !arrayModels}
            className={clsx(
              "p-2 text-sm border rounded-md w-[200px] truncate overflow-hidden",
              !makeId || !arrayModels
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "focus:ring-2 focus:ring-blue-400 cursor-pointer"
            )}
          >
            <option value="">--Select--</option>
            {arrayModels?.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Logo</TableHead>
            <TableHead>Brand Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="w-[200px]">Model Year</TableHead>
            <TableHead>More Info</TableHead>
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
                        carBrands.find((brand) => brand.id === row.makeId)?.brandLogoUrl ||
                        '/images/Brands/other-make.webp'
                      }
                      alt="Brand logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </TableCell>
                <TableCell>{row.makeName}</TableCell>
                <TableCell>{row.modelName}</TableCell>
                <TableCell>{row.modelYear}</TableCell>
                <TableCell>{row.bodyTypeName}</TableCell>
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

'use client';

import LoadingTruck from '@/components/LoadingTruck/LoadingTruck';
import { useState, createContext, useContext } from 'react';

const LoadingTruckContext = createContext<{
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export function LoadingTruckProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoadingTruckContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      <LoadingTruck visible={isLoading} />
      {children}
    </LoadingTruckContext.Provider>
  );
}


export function useLoadingTruck() {
  return useContext(LoadingTruckContext);
}

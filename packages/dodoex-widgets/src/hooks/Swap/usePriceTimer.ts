import { useEffect } from 'react';

export const refreshTime = 15 * 1000;
export interface PriceTimerProps {
  refetch: () => void;
  interval?: number;
}
export function usePriceTimer({ refetch, interval }: PriceTimerProps) {
  let timer: any;
  useEffect(() => {
    refetch();
    clearTimeout(timer);

    timer = setInterval(() => {
      refetch();
    }, interval ?? refreshTime);

    return () => clearTimeout(timer);
  }, [refetch]);
}

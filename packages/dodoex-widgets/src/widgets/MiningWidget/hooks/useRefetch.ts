import { useCallback, useState } from 'react';

export function useRefetch(callback?: () => void) {
  const [refetchTimes, setRefetchTimes] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTimes((prev) => prev + 1);
    // eslint-disable-next-line no-unused-expressions
    callback && callback();
  }, [callback]);

  return {
    refetch,
    refetchTimes,
    isRefetch: refetchTimes > 0,
  };
}

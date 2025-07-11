import { useQuery } from '@tanstack/react-query';
import { mockCurvePoolList } from '../utils';
import { CurvePoolT } from '../types';
import { ChainId } from '@dodoex/api';

export function usePoolDetail({
  address,
  chainId,
}: {
  address: string | undefined;
  chainId: ChainId | undefined;
}) {
  const { data, isLoading, error } = useQuery<CurvePoolT | null>({
    queryKey: ['poolDetail'],
    queryFn: () => {
      return mockCurvePoolList[0];
    },
  });

  return {
    poolDetail: data,
    isLoading,
    error,
  };
}

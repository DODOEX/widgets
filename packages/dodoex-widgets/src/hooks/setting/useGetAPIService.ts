import { useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { APIServiceKey, getAPIService } from '../../constants/api';

export function useGetAPIService(key: APIServiceKey) {
  const { apiServices } = useUserOptions();

  return useMemo(() => getAPIService(key, apiServices), [apiServices, key]);
}

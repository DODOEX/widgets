import { useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { APIServiceKey, getAPIService } from '../../constants/api';

export function useGetAPIService(key: APIServiceKey) {
  const { apiServices, apiDomain } = useUserOptions();

  return useMemo(
    () => getAPIService(key, apiServices, apiDomain),
    [apiServices, apiDomain, key],
  );
}

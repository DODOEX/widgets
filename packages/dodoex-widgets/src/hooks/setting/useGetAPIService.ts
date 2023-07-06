import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { APIServiceKey, getAPIService } from '../../constants/api';
import { getGlobalProps } from '../../store/selectors/globals';

export function useGetAPIService(key: APIServiceKey) {
  const globalProps = useSelector(getGlobalProps);

  return useMemo(
    () => getAPIService(key, globalProps.apiServices),
    [globalProps.apiServices, key],
  );
}

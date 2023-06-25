import axios from 'axios';
import { useCallback, useState, useEffect } from 'react';
import { getCGTokenListAPI } from '../../constants/api';
import { TokenList } from './type';

export enum FetchStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
let cgTokenCacheListMap = new Map<number, TokenList>();
export function useGetCGTokenList({
  chainId,
  skip,
}: {
  chainId: number;
  skip?: boolean;
}) {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.Initial);
  const [tokenList, setTokenList] = useState<TokenList>([]);
  const refetch = useCallback(async () => {
    try {
      setStatus(FetchStatus.Loading);
      const cgAPI = getCGTokenListAPI(chainId);
      const resData = await axios.get(cgAPI);
      if (resData && resData.data && resData.data.tokens) {
        setTokenList(resData.data.tokens);
        cgTokenCacheListMap.set(chainId, resData.data.tokens);
      }
      setStatus(FetchStatus.Success);
    } catch (error) {
      setStatus(FetchStatus.Failed);
      console.error(error);
    }
  }, [chainId]);

  useEffect(() => {
    const time = setTimeout(() => {
      if (!skip && chainId) {
        const currentTokenList = cgTokenCacheListMap.get(chainId);
        if (currentTokenList) {
          setTokenList(currentTokenList);
          return;
        }
        refetch();
      }
    }, 100);

    return () => {
      clearTimeout(time);
    };
  }, [chainId, skip]);

  return {
    cgTokenList: tokenList,
    loading: status === FetchStatus.Loading,
    refetch,
  };
}

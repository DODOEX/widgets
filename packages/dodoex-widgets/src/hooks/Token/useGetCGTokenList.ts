import axios from 'axios';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { List } from 'immutable';
import { getTokenList } from '../../store/selectors/token';
import { getCGTokenListAPI } from '../../constants/api';
import { useCurrentChainId } from '../ConnectWallet';
import { TokenInfo } from './type';

export enum FetchStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
export function useGetCGTokenList() {

  const chainId = useCurrentChainId();
  const [status, setStatus] = useState<FetchStatus>(
    FetchStatus.Initial,
  );
  const [tokenList, setTokenList] = useState<List<TokenInfo>>(List([]));
  const refetch = useCallback(async () => {
    try {
      setStatus(FetchStatus.Loading);
      const cgAPI = getCGTokenListAPI(chainId);
      const resData = await axios.get(
        cgAPI,
      );
      if (resData && resData.data && resData.data.tokens) {
        setTokenList(List(resData.data.tokens));
      }
      setStatus(FetchStatus.Success);
    } catch (error) {
      setStatus(FetchStatus.Failed);
      console.error(error);
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId) {
      refetch();
    }
  }, [chainId])

  return {
    cgTokenList: tokenList,
    loading: status === FetchStatus.Loading,
    refetch,
  };
}

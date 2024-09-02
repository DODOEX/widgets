import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChainId, rpcServerMap } from '../../constants/chains';
import { fetchTokenAllowance } from '../contract';
import { getLatestBlockNumber } from '../../store/selectors/wallet';
import { TokenInfo } from './type';
import { getStaticJsonRpcProvider } from '../contract/provider';
import { useUserOptions } from '../../components/UserOptionsProvider';

export function useFetchTokenAllowance({
  chainId,
  account,
  token,
  proxyContractAddress,
}: {
  chainId?: number;
  account?: string;
  token?: TokenInfo;
  proxyContractAddress: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [allowance, setAllowance] = useState<BigNumber | null>(null);
  const { jsonRpcUrlMap: jsonRpcUrlMapProps } = useUserOptions();
  const blockNumber = useSelector(getLatestBlockNumber);

  const refetch = useCallback(async () => {
    if (!account || !chainId || !token) return;
    setLoading(true);
    const jsonRpcUrlMap = {
      ...rpcServerMap,
      ...jsonRpcUrlMapProps,
    };
    const rpcUrls = jsonRpcUrlMap[chainId as ChainId];
    const provider = getStaticJsonRpcProvider(rpcUrls?.[0], chainId);
    try {
      const res = await fetchTokenAllowance({
        account,
        chainId,
        tokenAddress: token.address,
        tokenDecimals: token.decimals,
        approveAddress: proxyContractAddress,
        provider,
      });
      setError(false);
      setAllowance(res ?? null);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [chainId, token, jsonRpcUrlMapProps, proxyContractAddress, account]);

  useEffect(() => {
    refetch();
  }, [refetch, blockNumber]);

  return {
    allowance,
    loading,
    error,

    refetch,
  };
}

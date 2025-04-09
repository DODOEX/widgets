import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../useGlobalState';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWeb3React();

  const updateBlockNumber = useCallback(async () => {
    if (!provider || !chainId) {
      return;
    }
    try {
      const blockNumber = await provider.getBlockNumber();
      useGlobalState.setState({
        latestBlockNumber: blockNumber,
      });
      return blockNumber;
    } catch (error) {
      console.error('Failed to fetch block number', error);
    }
  }, [provider, chainId]);

  useEffect(() => {
    updateBlockNumber();
  }, [updateBlockNumber]);

  return {
    updateBlockNumber,
  };
}

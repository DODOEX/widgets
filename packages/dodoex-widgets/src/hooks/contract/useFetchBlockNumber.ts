import { useCallback, useEffect } from 'react';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useGlobalState } from '../useGlobalState';

export default function useFetchBlockNumber() {
  const { evmProvider, chainId } = useWalletInfo();

  const updateBlockNumber = useCallback(async () => {
    if (!evmProvider || !chainId) {
      return;
    }
    try {
      const blockNumber = await evmProvider.getBlockNumber();
      useGlobalState.setState({
        latestBlockNumber: blockNumber,
      });
      return blockNumber;
    } catch (error) {
      console.error('Failed to fetch block number', error);
    }
  }, [evmProvider, chainId]);

  useEffect(() => {
    updateBlockNumber();
  }, [updateBlockNumber]);

  return {
    updateBlockNumber,
  };
}

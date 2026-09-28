import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../useGlobalState';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';

export default function useFetchBlockNumber() {
  const { provider, chainId } = useWalletInfo();

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

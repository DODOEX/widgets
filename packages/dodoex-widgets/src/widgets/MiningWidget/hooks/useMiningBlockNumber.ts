import { ChainId } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo } from 'react';
import { blockTimeMap } from '../../../constants/chains';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import useFetchBlockNumber from '../../../hooks/contract/useFetchBlockNumber';
import { useGlobalState } from '../../../hooks/useGlobalState';

export function useMiningBlockNumber(
  chainId: ChainId,
  otherChainBlockNumber: BigNumber | undefined,
) {
  const { chainId: currentChainId } = useWalletInfo();
  const { latestBlockNumber: currentChainBlockNumber } = useGlobalState();

  const { updateBlockNumber } = useFetchBlockNumber();

  useEffect(() => {
    const inter = setInterval(() => {
      updateBlockNumber();
    }, 12000);
    return () => clearInterval(inter);
  }, [updateBlockNumber]);

  const [blockNumber, blockTime] = useMemo(() => {
    const b = blockTimeMap[chainId];
    return [
      new BigNumber(
        chainId === currentChainId
          ? currentChainBlockNumber
          : (otherChainBlockNumber ?? currentChainBlockNumber),
      ),
      b,
    ];
  }, [chainId, currentChainBlockNumber, currentChainId, otherChainBlockNumber]);

  return {
    blockNumber,
    blockTime,
  };
}

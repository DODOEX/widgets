import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useMemo } from 'react';
import { useGlobalState } from '../useGlobalState';
import { ChainId } from '@dodoex/api';

export const getMaxSlippageWarning = (chainId: number | undefined) => {
  switch (chainId) {
    case ChainId.PHAROS_TESTNET:
      return 32; // for Pharos Testnet
    default:
      return 5; // Default to 5% for other networks
  }
};

export const useSlippageLimit = (
  slippageSwap: number | undefined,
  chainId: number | undefined,
) => {
  const { defaultSlippage } = useDefaultSlippage(slippageSwap === undefined);
  const slippage = useGlobalState((state) => state.slippage || defaultSlippage);
  return useMemo(() => {
    const compareSlippage =
      slippageSwap === undefined ? Number(slippage) : slippageSwap;
    return compareSlippage > getMaxSlippageWarning(chainId);
  }, [slippage, slippageSwap, chainId]);
};

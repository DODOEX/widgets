import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useMemo } from 'react';
import { useGlobalState } from '../useGlobalState';

export const maxSlippageWarning = 5;

export const useSlippageLimit = (slippageSwap?: number) => {
  const { defaultSlippage } = useDefaultSlippage(slippageSwap === undefined);
  const slippage = useGlobalState((state) => state.slippage || defaultSlippage);
  return useMemo(() => {
    const compareSlippage =
      slippageSwap === undefined ? Number(slippage) : slippageSwap;
    return compareSlippage > maxSlippageWarning;
  }, [slippage, slippageSwap]);
};

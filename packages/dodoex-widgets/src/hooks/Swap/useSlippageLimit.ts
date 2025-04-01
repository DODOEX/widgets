import { useMemo } from 'react';
import { useSwapSettingStore } from './useSwapSettingStore';

export const maxSlippageWarning = 5;

export const useSlippageLimit = () => {
  const slippage = useSwapSettingStore((state) => state.slippage);

  return useMemo(() => {
    return Number(slippage) > maxSlippageWarning;
  }, [slippage]);
};

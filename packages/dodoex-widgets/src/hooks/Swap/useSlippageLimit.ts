import { useSelector } from 'react-redux';
import { getSlippage } from '../../store/selectors/settings';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useMemo } from 'react';

export const maxSlippageWarning = 5;

export const useSlippageLimit = (slippageSwap?: number) => {
  const { defaultSlippage } = useDefaultSlippage(slippageSwap === undefined);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  return useMemo(() => {
    const compareSlippage =
      slippageSwap === undefined ? Number(slippage) : slippageSwap;
    return compareSlippage > maxSlippageWarning;
  }, [slippage, slippageSwap]);
};

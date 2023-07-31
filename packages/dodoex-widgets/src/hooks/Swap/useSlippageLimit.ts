import { useSelector } from 'react-redux';
import { getSlippage } from '../../store/selectors/settings';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useMemo } from 'react';

export const maxSlippageWarning = 5;

export const useSlippageLimit = (isBridge: boolean | undefined) => {
  const defaultSlippage = useDefaultSlippage(isBridge);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  console.log('jie', slippage);
  return useMemo(() => {
    return Number(slippage) > maxSlippageWarning;
  }, [slippage]);
};

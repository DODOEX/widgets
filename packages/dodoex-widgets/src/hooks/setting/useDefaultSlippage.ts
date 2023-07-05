import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  DEFAULT_BRIDGE_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
} from '../../constants/swap';
import { getGlobalProps } from '../../store/selectors/globals';

export function useDefaultSlippage(isBridge: boolean | undefined) {
  const globalProps = useSelector(getGlobalProps);

  const defaultSlippage = useMemo(() => {
    if (isBridge) {
      return globalProps.bridgeSlippage ?? DEFAULT_BRIDGE_SLIPPAGE;
    }
    return globalProps.swapSlippage ?? DEFAULT_SWAP_SLIPPAGE;
  }, [globalProps.swapSlippage, globalProps.bridgeSlippage, isBridge]);

  return defaultSlippage;
}

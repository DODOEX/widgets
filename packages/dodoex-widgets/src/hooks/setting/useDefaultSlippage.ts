import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  DEFAULT_BRIDGE_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
} from '../../constants/swap';
import { getAutoSlippage, getGlobalProps } from '../../store/selectors/globals';

export function useDefaultSlippage(isBridge: boolean | undefined) {
  const globalProps = useSelector(getGlobalProps);
  const autoSlippage = useSelector(getAutoSlippage);

  const defaultSlippage = useMemo(() => {
    if (!autoSlippage?.loading && autoSlippage?.value)
      return autoSlippage.value;
    if (isBridge) {
      return globalProps.bridgeSlippage ?? DEFAULT_BRIDGE_SLIPPAGE;
    }
    return globalProps.swapSlippage ?? DEFAULT_SWAP_SLIPPAGE;
  }, [
    globalProps.swapSlippage,
    globalProps.bridgeSlippage,
    isBridge,
    autoSlippage,
  ]);

  return {
    defaultSlippage,
    loading: autoSlippage?.loading,
  };
}

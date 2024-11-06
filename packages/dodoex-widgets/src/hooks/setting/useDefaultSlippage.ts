import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useUserOptions } from '../../components/UserOptionsProvider';
import {
  DEFAULT_BRIDGE_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
} from '../../constants/swap';
import { getAutoSlippage } from '../../store/selectors/globals';

export function useDefaultSlippage(isBridge: boolean | undefined) {
  const { bridgeSlippage, swapSlippage } = useUserOptions();
  const autoSlippage = useSelector(getAutoSlippage);

  const defaultSlippage = useMemo(() => {
    if (!autoSlippage?.loading && autoSlippage?.value)
      return autoSlippage.value;
    if (isBridge) {
      return bridgeSlippage ?? DEFAULT_BRIDGE_SLIPPAGE;
    }
    return swapSlippage ?? DEFAULT_SWAP_SLIPPAGE;
  }, [swapSlippage, bridgeSlippage, isBridge, autoSlippage]);

  return {
    defaultSlippage,
    loading: autoSlippage?.loading,
  };
}

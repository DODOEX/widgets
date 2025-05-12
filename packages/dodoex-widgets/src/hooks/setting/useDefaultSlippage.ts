import { useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import {
  DEFAULT_BRIDGE_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
} from '../../constants/swap';
import { useGlobalState } from '../useGlobalState';

export function useDefaultSlippage(isBridge: boolean | undefined) {
  const { bridgeSlippage, swapSlippage } = useUserOptions();
  const { autoSlippage } = useGlobalState();

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

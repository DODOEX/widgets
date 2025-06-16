import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useGlobalState } from '../useGlobalState';

export function useBridgeSlippage() {
  const { defaultSlippage } = useDefaultSlippage(true);
  const slippage = useGlobalState((state) => state.slippage || defaultSlippage);

  return {
    slippage,
  };
}

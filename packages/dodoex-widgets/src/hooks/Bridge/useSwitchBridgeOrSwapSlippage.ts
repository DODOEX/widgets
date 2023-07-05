import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_BRIDGE_SLIPPAGE,
  DEFAULT_SWAP_SLIPPAGE,
} from '../../constants/swap';
import { AppThunkDispatch } from '../../store/actions';
import { setSlippage } from '../../store/actions/settings';

export function useSwitchBridgeOrSwapSlippage(isBridge: boolean | undefined) {
  const firstLoaded = useRef(false);
  const [showSwitchSlippage, setShowSwitchSlippage] = useState(false);
  const dispatch = useDispatch<AppThunkDispatch>();

  useEffect(() => {
    if (isBridge === undefined) {
      return;
    }
    if (!firstLoaded.current) {
      firstLoaded.current = true;
      return;
    }
    const defaultSlippage = isBridge
      ? DEFAULT_BRIDGE_SLIPPAGE
      : DEFAULT_SWAP_SLIPPAGE;
    dispatch(setSlippage(defaultSlippage.toString()));
    setShowSwitchSlippage(true);
    const time = setTimeout(() => {
      setShowSwitchSlippage(false);
    }, 3000);

    return () => {
      clearTimeout(time);
    };
  }, [isBridge]);

  return showSwitchSlippage;
}

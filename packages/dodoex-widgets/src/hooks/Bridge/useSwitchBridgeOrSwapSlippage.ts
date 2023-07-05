import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getLastSlippage } from '../../constants/localstorage';
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
    const cacheSlippage = getLastSlippage(isBridge);
    if (!firstLoaded.current) {
      dispatch(setSlippage(cacheSlippage ? cacheSlippage.toString() : null));
      firstLoaded.current = true;
      return;
    }
    dispatch(setSlippage(cacheSlippage ? cacheSlippage.toString() : null));
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

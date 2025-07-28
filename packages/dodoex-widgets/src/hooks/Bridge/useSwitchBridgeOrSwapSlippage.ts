import { useEffect, useRef, useState } from 'react';
import { getLastSlippage } from '../../constants/localstorage';
import { setSlippage } from '../useGlobalState';

export function useSwitchBridgeOrSwapSlippage(isBridge: boolean | undefined) {
  const firstLoaded = useRef(false);
  const [showSwitchSlippage, setShowSwitchSlippage] = useState(false);

  useEffect(() => {
    if (isBridge === undefined) {
      return;
    }
    const cacheSlippage = getLastSlippage(isBridge);
    if (!firstLoaded.current) {
      setSlippage(cacheSlippage ? cacheSlippage.toString() : null);
      firstLoaded.current = true;
      return;
    }
    setSlippage(cacheSlippage ? cacheSlippage.toString() : null);
    setShowSwitchSlippage(true);
    const time = setTimeout(() => {
      setShowSwitchSlippage(false);
    }, 5000);

    return () => {
      clearTimeout(time);
    };
  }, [isBridge]);

  return { showSwitchSlippage, setShowSwitchSlippage };
}

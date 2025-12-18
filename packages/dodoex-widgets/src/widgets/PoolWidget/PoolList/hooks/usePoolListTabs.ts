import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import {
  POOLS_LIST_TAB,
  POOLS_LIST_TOP_TAB,
} from '../../../../constants/sessionStorage';

export enum PoolTokenTab {
  ALM = 'ALM',
  NORMAL = 'NORMAL',
  MULTI_TOKEN = 'MULTI_TOKEN',
}

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function usePoolListTabs() {
  const [poolTab, setPoolTab] = useState(PoolTab.addLiquidity);
  const [poolTokenTab, setPoolTokenTab] = useState(PoolTokenTab.NORMAL);

  const { supportAMMV2, supportAMMV3, notSupportPMM, supportCurve } =
    useUserOptions();

  const poolTabs = useMemo(() => {
    const tabs = [
      { key: PoolTab.addLiquidity, value: 'All Liquidity' },
      { key: PoolTab.myLiquidity, value: 'My Liquidity' },
    ];

    if (!notSupportPMM) {
      tabs.push({
        key: PoolTab.myCreated,
        value: supportAMMV2 || supportAMMV3 ? 'My Pools (PMM)' : 'My Pools',
      });
    }
    return tabs;
  }, []);

  const getPoolTokenTabs = useCallback(
    (tab: PoolTab) => {
      if (tab === PoolTab.myCreated) {
        return [];
      }
      const tabs = [
        // { key: PoolTokenTab.ALM, value: 'ALM' },
        {
          key: PoolTokenTab.NORMAL,
          value: 'Normal',
        },
      ];

      if (supportCurve) {
        tabs.push({
          key: PoolTokenTab.MULTI_TOKEN,
          value: 'Multi-token',
        });
      }

      return tabs;
    },
    [supportCurve],
  );
  const poolTokenTabs = useMemo(
    () => getPoolTokenTabs(poolTab),
    [getPoolTokenTabs, poolTab],
  );

  const isSetPoolTabCache = useRef(false);
  useEffect(() => {
    const poolTokenTabCache = sessionStorage.getItem(POOLS_LIST_TOP_TAB);
    const poolTabCache = sessionStorage.getItem(POOLS_LIST_TAB);
    if (poolTokenTabCache && poolTabCache && !isSetPoolTabCache.current) {
      isSetPoolTabCache.current = true;
      setPoolTab(poolTabCache as PoolTab);
      setPoolTokenTab(poolTokenTabCache as PoolTokenTab);
    }
  }, []);

  const handleChangePoolTab = (tab: PoolTab) => {
    setPoolTab(tab);
    sessionStorage.setItem(POOLS_LIST_TAB, poolTab);

    const tokenTab = getPoolTokenTabs(tab)?.[0]?.key;
    if (tokenTab) {
      setPoolTokenTab(tokenTab);
      sessionStorage.setItem(POOLS_LIST_TOP_TAB, tokenTab);
    } else {
      sessionStorage.removeItem(POOLS_LIST_TOP_TAB);
    }
  };

  const handleChangeTokenTab = (tab: PoolTokenTab) => {
    setPoolTokenTab(tab);
    sessionStorage.setItem(POOLS_LIST_TOP_TAB, tab);
  };

  return {
    poolTab,
    poolTabs,
    poolTokenTab,
    poolTokenTabs,

    handleChangePoolTab,
    handleChangeTokenTab,
  };
}

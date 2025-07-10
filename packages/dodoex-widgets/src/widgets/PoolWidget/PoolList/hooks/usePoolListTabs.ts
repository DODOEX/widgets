import { useEffect, useMemo, useRef, useState } from 'react';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import {
  POOLS_LIST_TAB,
  POOLS_LIST_TOP_TAB,
} from '../../../../constants/sessionStorage';

export enum PoolTopTab {
  ALM = 'ALM',
  NORMAL = 'NORMAL',
  MULTI_TOKEN = 'MULTI_TOKEN',
}

export enum ALMPoolTab {
  ALL = 'ALL',
  MY = 'MY',
}

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export enum MultiTokenPoolTab {
  ALL = 'ALL',
  MY = 'MY',
}

export function usePoolListTabs() {
  const [poolTopTab, setPoolTopTab] = useState(PoolTopTab.NORMAL);

  const [almPoolTab, setAlmPoolTab] = useState(ALMPoolTab.ALL);
  const [normalPoolTab, setNormalPoolTab] = useState(PoolTab.addLiquidity);
  const [multiTokenPoolTab, setMultiTokenPoolTab] = useState(
    MultiTokenPoolTab.ALL,
  );

  const { supportAMMV2, supportAMMV3, notSupportPMM, supportCurve } =
    useUserOptions();

  const topTabs = useMemo(() => {
    const tabs = [
      // { key: PoolTopTab.ALM, value: 'ALM' },
      {
        key: PoolTopTab.NORMAL,
        value: 'Normal',
      },
    ];

    if (supportCurve) {
      tabs.push({
        key: PoolTopTab.MULTI_TOKEN,
        value: 'Multi-token',
      });
    }

    return tabs;
  }, [supportCurve]);

  const almTabs = useMemo(() => {
    return [
      { key: ALMPoolTab.ALL, value: 'All vauls' },
      {
        key: ALMPoolTab.MY,
        value: 'My liquidity',
      },
    ];
  }, []);

  const normalTabs = useMemo(() => {
    const result = [
      { key: PoolTab.addLiquidity, value: 'Add Liquidity' },
      {
        key: PoolTab.myLiquidity,
        value: 'My Liquidity',
      },
    ];
    if (!notSupportPMM) {
      result.push({
        key: PoolTab.myCreated,
        value: supportAMMV2 || supportAMMV3 ? 'My Pools (PMM)' : 'My Pools',
      });
    }
    return result;
  }, [supportAMMV2, supportAMMV3, notSupportPMM]);

  const multiTokenTabs = useMemo(() => {
    return [
      { key: MultiTokenPoolTab.ALL, value: 'All pools' },
      {
        key: MultiTokenPoolTab.MY,
        value: 'My liquidity',
      },
    ];
  }, []);

  const isSetPoolTabCache = useRef(false);
  useEffect(() => {
    const topTabCache = sessionStorage.getItem(POOLS_LIST_TOP_TAB);
    const poolTabCache = sessionStorage.getItem(POOLS_LIST_TAB);
    if (topTabCache && poolTabCache && !isSetPoolTabCache.current) {
      isSetPoolTabCache.current = true;
      setPoolTopTab(topTabCache as PoolTopTab);
      if (topTabCache === PoolTopTab.NORMAL) {
        setNormalPoolTab(poolTabCache as PoolTab);
      } else if (topTabCache === PoolTopTab.ALM) {
        setAlmPoolTab(poolTabCache as ALMPoolTab);
      } else if (topTabCache === PoolTopTab.MULTI_TOKEN) {
        setMultiTokenPoolTab(poolTabCache as MultiTokenPoolTab);
      }
    }
  }, []);

  const handleChangePoolTab = ({
    topTab,
    poolTab,
  }:
    | {
        topTab: PoolTopTab.NORMAL;
        poolTab: PoolTab;
      }
    | {
        topTab: PoolTopTab.ALM;
        poolTab: ALMPoolTab;
      }
    | {
        topTab: PoolTopTab.MULTI_TOKEN;
        poolTab: MultiTokenPoolTab;
      }) => {
    setPoolTopTab(topTab);

    if (topTab === PoolTopTab.NORMAL) {
      setNormalPoolTab(poolTab);
    } else if (topTab === PoolTopTab.ALM) {
      setAlmPoolTab(poolTab);
    } else if (topTab === PoolTopTab.MULTI_TOKEN) {
      setMultiTokenPoolTab(poolTab);
    }

    sessionStorage.setItem(POOLS_LIST_TOP_TAB, topTab);
    sessionStorage.setItem(POOLS_LIST_TAB, poolTab);
  };

  return {
    poolTopTab,

    normalPoolTab,
    almPoolTab,
    multiTokenPoolTab,

    topTabs,
    normalTabs,
    almTabs,
    multiTokenTabs,

    handleChangePoolTab,
  };
}

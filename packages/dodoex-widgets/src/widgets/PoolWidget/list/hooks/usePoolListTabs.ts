import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';
import { POOLS_LIST_TAB } from '../../../../constants/sessionStorage';
import { useRouterStore } from '../../../../router';
import { Page, PageType } from '../../../../router/types';

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function usePoolListTabs({ account }: { account?: string }) {
  const { i18n } = useLingui();
  const [poolTab, setPoolTab] = React.useState(PoolTab.addLiquidity);
  const tabs = React.useMemo(
    () => [
      { key: PoolTab.addLiquidity, value: t`Add Liquidity` },
      {
        key: PoolTab.myLiquidity,
        value: t`My Liquidity`,
      },
      { key: PoolTab.myCreated, value: t`My Pools` },
    ],
    [i18n._],
  );

  const isSetPoolTabCache = React.useRef(false);
  React.useEffect(() => {
    const poolTabCache = sessionStorage.getItem(POOLS_LIST_TAB);
    if (!!account && poolTabCache && !isSetPoolTabCache.current) {
      isSetPoolTabCache.current = true;
      setPoolTab(poolTabCache as PoolTab);
    }
  }, [account]);

  const handleChangePoolTab = (poolTab: PoolTab) => {
    setPoolTab(poolTab);
    sessionStorage.setItem(POOLS_LIST_TAB, poolTab);
  };

  // params
  const paramsTab = useRouterStore((state) => {
    if (state.page?.type === PageType.Pool) {
      return (state.page as Page<PageType.Pool>).params?.tab;
    }
    return null;
  });
  React.useEffect(() => {
    if (paramsTab) {
      handleChangePoolTab(paramsTab);
    }
  }, [paramsTab]);

  return {
    poolTab,
    tabs,
    handleChangePoolTab,
  };
}

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';
import { POOLS_LIST_TAB } from '../../../../constants/sessionStorage';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function usePoolListTabs({
  account,
  paramsTab,
}: {
  account?: string;
  paramsTab: PoolTab | undefined;
}) {
  const { i18n } = useLingui();
  const [poolTab, setPoolTab] = React.useState(PoolTab.addLiquidity);
  const { supportAMMV2, supportAMMV3, notSupportPMM } = useUserOptions();
  const tabs = React.useMemo(() => {
    const result = [
      { key: PoolTab.addLiquidity, value: t`Add Liquidity` },
      {
        key: PoolTab.myLiquidity,
        value: t`My Liquidity`,
      },
    ];
    if (!notSupportPMM) {
      result.push({
        key: PoolTab.myCreated,
        value: supportAMMV2 || supportAMMV3 ? t`My Pools (PMM)` : t`My Pools`,
      });
    }
    return result;
  }, [i18n._, supportAMMV2, supportAMMV3, notSupportPMM]);

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

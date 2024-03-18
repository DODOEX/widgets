import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';

export enum PoolOrMiningTab {
  Liquidity = 1,
  Mining,
}

export function usePoolOrMiningTabs() {
  const { i18n } = useLingui();
  const [poolOrMiningTab, setPoolOrMiningTab] = React.useState(
    PoolOrMiningTab.Liquidity,
  );
  const poolOrMiningTabs = React.useMemo(
    () => [
      { key: PoolOrMiningTab.Liquidity, value: t`Liquidity` },
      // {
      //   key: OperateTab.Mining,
      //   value: t`Mining`,
      // },
    ],
    [i18n._],
  );

  const handleChangeTab = (poolTab: PoolOrMiningTab) => {
    setPoolOrMiningTab(poolTab);
  };

  return {
    poolOrMiningTab,
    poolOrMiningTabs,
    handleChangeTab,
  };
}

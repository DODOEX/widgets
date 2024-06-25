import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';

export enum PoolOrMiningTab {
  Liquidity = 1,
  Mining,
}

export function usePoolOrMiningTabs({ hasMining }: { hasMining?: boolean }) {
  const { i18n } = useLingui();
  const [poolOrMiningTab, setPoolOrMiningTab] = React.useState(
    PoolOrMiningTab.Liquidity,
  );
  const poolOrMiningTabs = React.useMemo(() => {
    const result = [
      { key: PoolOrMiningTab.Liquidity, value: t`Liquidity` },
      {
        key: PoolOrMiningTab.Mining,
        value: t`Mining`,
      },
    ];

    if (hasMining) return result;
    return result.slice(0, 1);
  }, [i18n._, hasMining]);

  const handleChangeTab = (poolTab: PoolOrMiningTab) => {
    setPoolOrMiningTab(poolTab);
  };

  return {
    poolOrMiningTab,
    poolOrMiningTabs,
    handleChangeTab,
  };
}

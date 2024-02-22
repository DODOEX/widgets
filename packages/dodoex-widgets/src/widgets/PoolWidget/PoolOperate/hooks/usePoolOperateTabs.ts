import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';

export enum OperateTab {
  Liquidity = 1,
  Mining,
}

export function usePoolOperateTabs() {
  const { i18n } = useLingui();
  const [operateTab, setOperateTab] = React.useState(OperateTab.Liquidity);
  const tabs = React.useMemo(
    () => [
      { key: OperateTab.Liquidity, value: t`Liquidity` },
      {
        key: OperateTab.Mining,
        value: t`Mining`,
      },
    ],
    [i18n._],
  );

  const handleChangeTab = (poolTab: OperateTab) => {
    setOperateTab(poolTab);
  };

  return {
    operateTab,
    tabs,
    handleChangeTab,
  };
}

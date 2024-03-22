import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';

export enum OperateTab {
  Add = 1,
  Remove,
}

export function usePoolOperateTabs() {
  const { i18n } = useLingui();
  const [operateTab, setOperateTab] = React.useState(OperateTab.Remove);
  const operateTabs = React.useMemo(
    () => [
      { key: OperateTab.Add, value: t`Add` },
      { key: OperateTab.Remove, value: t`Remove` },
    ],
    [i18n._],
  );

  const handleChangeTab = (poolTab: OperateTab) => {
    setOperateTab(poolTab);
  };

  return {
    operateTab,
    operateTabs,
    handleChangeTab,
  };
}

import {
  Tabs,
  TabsList,
  Box,
  Tab,
  TabPanel,
  TabsButtonGroup,
} from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { FailedList } from '../../../components/List/FailedList';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { poolApi } from '../utils';
import { AddPoolOperate } from './AddPoolOperate';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import LiquidityInfo from './LiquidityInfo';
import { OperatePool } from './types';

export interface PoolOperateInnerProps {
  pool: OperatePool;
}

export default function PoolOperateInner({ pool }: PoolOperateInnerProps) {
  const { operateTab, operateTabs, handleChangeTab } = usePoolOperateTabs();
  const { account } = useWeb3React();
  const balanceInfo = usePoolBalanceInfo({
    account,
    pool,
  });
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      pool?.chainId as number,
      pool?.address,
      pool?.type,
      pool?.baseToken?.decimals,
      pool?.quoteToken?.decimals,
    ),
  );
  if (balanceInfo.error || pmmStateQuery.error) {
    return (
      <FailedList
        refresh={() => {
          if (balanceInfo.error) {
            balanceInfo.refetch();
          }
          if (pmmStateQuery.error) {
            pmmStateQuery.refetch();
          }
        }}
        sx={{
          height: '100%',
        }}
      />
    );
  }
  return (
    <>
      <LiquidityInfo pool={pool} balanceInfo={balanceInfo} />
      <Tabs
        value={operateTab}
        onChange={(_, value) => {
          handleChangeTab(value as OperateTab);
        }}
      >
        <TabsButtonGroup
          tabs={operateTabs}
          variant="inPaper"
          tabsListSx={{
            mt: 16,
            mx: 20,
          }}
        />
        <TabPanel value={OperateTab.Add}>
          <AddPoolOperate pool={pool} balanceInfo={balanceInfo} />
        </TabPanel>
      </Tabs>
    </>
  );
}

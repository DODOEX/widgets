import { Box, TabPanel, Tabs, TabsButtonGroup } from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { FailedList } from '../../../components/List/FailedList';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { poolApi } from '../utils';
import { AddPoolOperate } from './AddPoolOperate';
import { RemovePoolOperate } from './RemovePoolOperate';
import { MyLiquidityInfo } from './components/MyLiquidityInfo';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import { OperatePool } from './types';
import dashLine from './components/dash-line.svg';

export interface PoolOperateInnerProps {
  pool: OperatePool;
  operate?: OperateTab;
  hidePoolInfo?: boolean;
  errorRefetch?: () => void;
  submittedBack?: () => void;
}

export default function PoolOperateInner({
  pool,
  operate,
  hidePoolInfo,
  errorRefetch,
  submittedBack,
}: PoolOperateInnerProps) {
  const { operateTab, operateTabs, handleChangeTab } =
    usePoolOperateTabs(operate);
  const { account } = useWeb3React();
  const balanceInfo = usePoolBalanceInfo({
    account,
    pool: pool
      ? {
          chainId: pool.chainId,
          address: pool.address,
          type: pool.type,
          baseTokenDecimals: pool.baseToken.decimals,
          quoteTokenDecimals: pool.quoteToken.decimals,
          baseLpTokenDecimals: pool.baseLpToken?.decimals ?? 18,
          quoteLpTokenDecimals: pool.quoteLpToken?.decimals ?? 18,
        }
      : undefined,
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
  if (balanceInfo.error || pmmStateQuery.error || errorRefetch) {
    return (
      <FailedList
        refresh={() => {
          if (balanceInfo.error) {
            balanceInfo.refetch();
          }
          if (pmmStateQuery.error) {
            pmmStateQuery.refetch();
          }
          if (errorRefetch) {
            errorRefetch();
          }
        }}
        sx={{
          my: 40,
          height: '100%',
        }}
      />
    );
  }
  return (
    <>
      <Tabs
        value={operateTab}
        onChange={(_, value) => {
          handleChangeTab(value as OperateTab);
        }}
        sx={{
          pt: 28,
          backgroundColor: 'background.default',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <TabsButtonGroup
          tabs={operateTabs}
          variant="inPaper"
          tabsListSx={{
            mx: 20,
            backgroundColor: 'background.paper',
          }}
        />
        <TabPanel value={OperateTab.Add}>
          <AddPoolOperate
            pool={pool}
            balanceInfo={balanceInfo}
            submittedBack={submittedBack}
          />
        </TabPanel>
        <TabPanel value={OperateTab.Remove}>
          <RemovePoolOperate
            pool={pool}
            balanceInfo={balanceInfo}
            submittedBack={submittedBack}
          />
        </TabPanel>
      </Tabs>

      <Box
        sx={{
          mx: 20,
          height: 4,
          backgroundImage: `url(${dashLine})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      <MyLiquidityInfo
        pool={pool}
        balanceInfo={balanceInfo}
        sx={{
          borderRadius: 20,
          backgroundColor: 'background.default',
        }}
      />
    </>
  );
}

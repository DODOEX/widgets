import { TabPanel, Tabs, TabsButtonGroup } from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import { FailedList } from '../../../components/List/FailedList';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { poolApi } from '../utils';
import { AddPoolOperate } from './AddPoolOperate';
import LiquidityInfo from './components/LiquidityInfo';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import { RemovePoolOperate } from './RemovePoolOperate';
import { OperatePool } from './types';

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
  const { account } = useWalletInfo();
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
      <LiquidityInfo
        pool={pool}
        balanceInfo={balanceInfo}
        hidePoolInfo={hidePoolInfo}
      />
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
    </>
  );
}

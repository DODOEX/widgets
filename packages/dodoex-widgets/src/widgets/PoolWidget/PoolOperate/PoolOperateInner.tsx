import { Tabs, TabPanel, TabsButtonGroup, Box } from '@dodoex/components';
import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { FailedList } from '../../../components/List/FailedList';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { poolApi } from '../utils';
import { AddPoolOperate } from './AddPoolOperate';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import LiquidityInfo from './components/LiquidityInfo';
import {
  GetMigrationPairAndMining,
  OperatePool,
  ShowMigrationPairAndMining,
} from './types';
import { RemovePoolOperate } from './RemovePoolOperate';
import { MigrationTag } from '../PoolList/components/migationWidget';

export interface PoolOperateInnerProps {
  pool: OperatePool;
  operate?: OperateTab;
  hidePoolInfo?: boolean;
  errorRefetch?: () => void;
  submittedBack?: () => void;
  getMigrationPairAndMining?: GetMigrationPairAndMining;
  showMigrationPairAndMining?: ShowMigrationPairAndMining;
}

export default function PoolOperateInner({
  pool,
  operate,
  hidePoolInfo,
  errorRefetch,
  submittedBack,
  getMigrationPairAndMining,
  showMigrationPairAndMining,
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

  const migrationItem = pool
    ? getMigrationPairAndMining?.({
        address: pool.address,
        chainId: pool.chainId,
      })
    : undefined;

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
        {migrationItem && (
          <Box
            sx={{
              height: 0,
              position: 'relative',
            }}
          >
            <MigrationTag
              isRightTop
              isReverseColor={operateTab === OperateTab.Remove}
              sx={{
                height: 18,
                top: 0,
                right: 20,
                transform: 'translateY(-50%)',
              }}
            />
          </Box>
        )}
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
            getMigrationPairAndMining={getMigrationPairAndMining}
            showMigrationPairAndMining={showMigrationPairAndMining}
          />
        </TabPanel>
      </Tabs>
    </>
  );
}

import { TabPanel, Tabs, TabsButtonGroup } from '@dodoex/components';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import MyLiquidity from '../AMMV2Create/MyLiqidity';
import { useUniV2Pairs } from '../hooks/useUniV2Pairs';
import { AddPoolOperate } from './AddPoolOperate';
import LiquidityInfo from './components/LiquidityInfo';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import { RemovePoolOperate } from './RemovePoolOperate';
import { OperatePool } from './types';

export interface PoolOperateInnerProps {
  pool: OperatePool;
  operate?: OperateTab;
  hidePoolInfo?: boolean;
  submittedBack?: () => void;
}

export default function PoolOperateInner({
  pool,
  operate,
  hidePoolInfo,
  submittedBack,
}: PoolOperateInnerProps) {
  const { operateTab, operateTabs, handleChangeTab } =
    usePoolOperateTabs(operate);
  const { account } = useWalletInfo();

  const {
    price,
    invertedPrice,
    poolInfoQuery,
    lpBalanceQuery,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,
    liquidityMinted,
    pairMintAAmount,
    pairMintBAmount,
    isExists,
  } = useUniV2Pairs({
    pool:
      pool?.baseToken && pool.quoteToken
        ? {
            baseToken: pool.baseToken,
            quoteToken: pool.quoteToken,
            address: pool.address,
          }
        : undefined,
    baseAmount: undefined,
    quoteAmount: undefined,
    slippage: 0,
  });

  return (
    <>
      <LiquidityInfo pool={pool} hidePoolInfo={hidePoolInfo}>
        <MyLiquidity
          isExists={isExists}
          poolInfo={poolInfoQuery.data?.poolInfo}
          poolInfoLoading={poolInfoQuery.isLoading}
          lpBalanceLoading={lpBalanceQuery.isLoading}
          lpBalance={lpBalance}
          lpBalancePercentage={lpBalancePercentage}
          lpToAmountA={lpToAmountA}
          lpToAmountB={lpToAmountB}
          sx={{
            px: 0,
            py: 0,
            border: 'none',
          }}
        />
      </LiquidityInfo>

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
          <AddPoolOperate pool={pool} submittedBack={submittedBack} />
        </TabPanel>
        <TabPanel value={OperateTab.Remove}>
          <RemovePoolOperate pool={pool} submittedBack={submittedBack} />
        </TabPanel>
      </Tabs>
    </>
  );
}

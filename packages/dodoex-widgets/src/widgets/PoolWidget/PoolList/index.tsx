import {
  Box,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import React from 'react';
import { HowItWorks } from '../../../components/HowItWorks';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { AMMV3PositionManage } from '../AMMV3/AMMV3PositionManage';
import { AMMV3PositionsView } from '../AMMV3/AMMV3PositionsView';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import PoolOperateDialog, {
  PoolOperate,
  PoolOperateProps,
} from '../PoolOperate';
import AddLiquidityList from './AddLiquidity';
import { CreatePoolBtn } from './components/CreatePoolBtn';
import { usePoolListFilterChainId } from './hooks/usePoolListFilterChainId';
import { TokenAndPoolFilterUserOptions } from './hooks/usePoolListFilterTokenAndPool';
import {
  MultiTokenPoolTab,
  PoolTab,
  PoolTopTab,
  usePoolListTabs,
} from './hooks/usePoolListTabs';
import MyCreated from './MyCreated';
import MyLiquidity from './MyLiquidity';
import { AllPools } from '../curve/AllPools';
import { CurvePoolT, OperateCurvePoolT } from '../curve/types';

function TabPanelFlexCol({ sx, ...props }: Parameters<typeof TabPanel>[0]) {
  return (
    <TabPanel
      {...props}
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    />
  );
}

export default function PoolList({
  params,
  scrollRef: scrollParentRefProps,
  tokenAndPoolFilter,
  operatePool: operatePoolProps,
  onOperatePool,
  getMigrationPairAndMining,
}: {
  params?: Page<PageType.Pool>['params'];
  scrollRef?: React.RefObject<any>;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  operatePool?: Partial<PoolOperateProps> | null;
  onOperatePool?: (pool: Partial<PoolOperateProps> | null) => boolean;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const noDocumentLink = useUserOptions((state) => state.noDocumentLink);
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const { account } = useWalletInfo();
  const {
    poolTopTab,
    normalPoolTab,
    almPoolTab,
    multiTokenPoolTab,
    normalTabs,
    almTabs,
    topTabs,
    multiTokenTabs,
    handleChangePoolTab,
  } = usePoolListTabs();

  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

  const [operateCurvePool, setOperateCurvePool] =
    React.useState<OperateCurvePoolT | null>(null);

  const [operatePool, setOperatePoolOrigin] =
    React.useState<Partial<PoolOperateProps> | null>(operatePoolProps || null);
  const setOperatePool = (pool: Partial<PoolOperateProps> | null) => {
    if (onOperatePool) {
      const parentOperate = onOperatePool(pool);
      if (parentOperate) {
        return;
      }
    }
    setOperatePoolOrigin(pool);
  };
  React.useEffect(() => {
    setOperatePoolOrigin(operatePoolProps || null);
  }, [operatePoolProps]);

  return (
    <WidgetContainer
      sx={{
        ...(isMobile
          ? {
              p: 0,
            }
          : {
              display: 'flex',
              gap: 12,
              flex: 1,
            }),
      }}
      ref={scrollParentRef}
    >
      <Tabs
        value={poolTopTab}
        onChange={(_, value) => {
          if (value === PoolTopTab.NORMAL) {
            handleChangePoolTab({
              topTab: value,
              poolTab: normalPoolTab,
            });
          } else if (value === PoolTopTab.ALM) {
            handleChangePoolTab({
              topTab: value,
              poolTab: almPoolTab,
            });
          } else if (value === PoolTopTab.MULTI_TOKEN) {
            handleChangePoolTab({
              topTab: value,
              poolTab: multiTokenPoolTab,
            });
          }
        }}
        sx={
          isMobile
            ? {}
            : {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
              }
        }
      >
        <Box
          sx={{
            ...(isMobile
              ? undefined
              : {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  pb: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: 'border.main',
                  borderBottomStyle: 'solid',
                }),
          }}
        >
          <TabsGroup
            tabs={topTabs}
            variant="default"
            tabsListSx={{
              justifyContent: 'space-between',
              ...(isMobile
                ? {
                    mb: 12,
                    gap: 32,
                  }
                : {
                    borderBottomWidth: 0,
                  }),
            }}
            tabSx={
              isMobile
                ? {
                    mr: 0,
                    padding: '0px 0px 16px 0px',
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: '93px',
                    gap: 32,
                  }
                : {
                    mr: 48,
                    typography: 'h5',
                    lineHeight: '25px',
                    minHeight: 41,
                    padding: '8px 0px 8px 0px',
                  }
            }
          />

          {poolTopTab === PoolTopTab.NORMAL && <CreatePoolBtn />}
        </Box>

        <TabPanelFlexCol
          value={PoolTopTab.ALM}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          ALM
        </TabPanelFlexCol>

        <TabPanelFlexCol
          value={PoolTopTab.NORMAL}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={normalPoolTab}
            onChange={(_, value) => {
              handleChangePoolTab({
                topTab: PoolTopTab.NORMAL,
                poolTab: value as PoolTab,
              });
            }}
          >
            <TabPanel value={PoolTab.addLiquidity}>
              <AddLiquidityList
                account={account}
                filterChainIds={filterChainIds}
                scrollParentRef={scrollParentRefProps ?? scrollParentRef}
                activeChainId={activeChainId}
                handleChangeActiveChainId={handleChangeActiveChainId}
                operatePool={operatePool}
                setOperatePool={setOperatePool}
                tokenAndPoolFilter={tokenAndPoolFilter}
                getMigrationPairAndMining={getMigrationPairAndMining}
              >
                <TabsButtonGroup tabs={normalTabs} variant="inPaperContrast" />
              </AddLiquidityList>
            </TabPanel>
            <TabPanel value={PoolTab.myLiquidity}>
              <MyLiquidity
                account={account}
                filterChainIds={filterChainIds}
                activeChainId={activeChainId}
                handleChangeActiveChainId={handleChangeActiveChainId}
                operatePool={operatePool}
                setOperatePool={setOperatePool}
                tokenAndPoolFilter={tokenAndPoolFilter}
                getMigrationPairAndMining={getMigrationPairAndMining}
              >
                <TabsButtonGroup tabs={normalTabs} variant="inPaperContrast" />
              </MyLiquidity>
            </TabPanel>
            <TabPanel value={PoolTab.myCreated}>
              <MyCreated
                account={account}
                filterChainIds={filterChainIds}
                activeChainId={activeChainId}
                handleChangeActiveChainId={handleChangeActiveChainId}
                operatePool={operatePool}
                setOperatePool={setOperatePool}
              >
                <TabsButtonGroup tabs={normalTabs} variant="inPaperContrast" />
              </MyCreated>
            </TabPanel>

            {!noDocumentLink && (
              <HowItWorks
                title="How does Liquidity Pools work?"
                descList={[
                  {
                    title: 'Deposit Liquidity',
                    desc: "Select a liquidity pool that suits your preferences and supply a pair of assets in our AMM pools or any supported assets in StableSwap pools. In return, you'll receive LP tokens, representing your share of the liquidity provided.",
                  },
                  {
                    title: 'Earn Fees',
                    desc: "As transactions occur within the pool, fees are collected and added to your LP tokens' value. This accrues daily, giving you real-time APY as your token holdings grow.",
                  },
                  {
                    title: 'Delegate & Change Pool Fees',
                    desc: "Boosted pool rewards are distributed every Sunday. If you've contributed liquidity to these pools, simply visit the rewards page, select the relevant week, and claim your earnings with ease.",
                  },
                ]}
                linkTo="https://docs.dodoex.io/product/tutorial/how-to-provide-liquidity"
                sx={{
                  mt: 16,
                  ...(isMobile && {
                    mt: 20,
                  }),
                }}
              />
            )}
          </Tabs>
        </TabPanelFlexCol>

        <TabPanelFlexCol
          value={PoolTopTab.MULTI_TOKEN}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={multiTokenPoolTab}
            onChange={(_, value) => {
              handleChangePoolTab({
                topTab: PoolTopTab.MULTI_TOKEN,
                poolTab: value as MultiTokenPoolTab,
              });
            }}
          >
            <TabPanel value={MultiTokenPoolTab.ALL}>
              <AllPools
                filterChainIds={filterChainIds}
                scrollParentRef={scrollParentRefProps ?? scrollParentRef}
                activeChainId={activeChainId}
                operateCurvePool={operateCurvePool}
                setOperateCurvePool={setOperateCurvePool}
                tokenAndPoolFilter={tokenAndPoolFilter}
              >
                <TabsButtonGroup
                  tabs={multiTokenTabs}
                  variant="inPaperContrast"
                />
              </AllPools>
            </TabPanel>
            <TabPanel value={MultiTokenPoolTab.MY}>
              <AllPools
                filterChainIds={filterChainIds}
                scrollParentRef={scrollParentRefProps ?? scrollParentRef}
                activeChainId={activeChainId}
                operateCurvePool={operateCurvePool}
                setOperateCurvePool={setOperateCurvePool}
                tokenAndPoolFilter={tokenAndPoolFilter}
              >
                <TabsButtonGroup
                  tabs={multiTokenTabs}
                  variant="inPaperContrast"
                />
              </AllPools>
            </TabPanel>
          </Tabs>
        </TabPanelFlexCol>
      </Tabs>

      {operatePool && (
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '100%' : 375,
          }}
        >
          {operatePool?.pool?.type === 'AMMV3' && operatePool.pool.chainId ? (
            normalPoolTab === PoolTab.myLiquidity &&
            operatePool.pool.liquidityPositions?.[0]?.tokenId ? (
              <AMMV3PositionManage
                baseToken={operatePool.pool.baseToken}
                quoteToken={operatePool.pool.quoteToken}
                feeAmount={Number(operatePool.pool.lpFeeRate) as FeeAmount}
                tokenId={operatePool.pool.liquidityPositions[0].tokenId}
                chainId={operatePool.pool.chainId}
                onClose={() => setOperatePool(null)}
              />
            ) : (
              <AMMV3PositionsView
                chainId={operatePool.pool.chainId}
                baseToken={operatePool.pool.baseToken}
                quoteToken={operatePool.pool.quoteToken}
                feeAmount={Number(operatePool.pool.lpFeeRate) as FeeAmount}
                onClose={() => setOperatePool(null)}
                handleGoToAddLiquidityV3={(params) => {
                  useRouterStore.getState().push({
                    type: PageType.createPoolAMMV3,
                    params,
                  });
                }}
              />
            )
          ) : (
            <>
              {isMobile ? (
                <PoolOperateDialog
                  account={account}
                  onClose={() => setOperatePool(null)}
                  modal={isMobile}
                  {...operatePool}
                />
              ) : (
                <PoolOperate
                  account={account}
                  onClose={() => setOperatePool(null)}
                  {...operatePool}
                  sx={{
                    width: 375,
                    height: 'max-content',
                    backgroundColor: 'background.paper',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                />
              )}
            </>
          )}
        </Box>
      )}
    </WidgetContainer>
  );
}

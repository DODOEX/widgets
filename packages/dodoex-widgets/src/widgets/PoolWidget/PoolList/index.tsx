import {
  alpha,
  Box,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { Fee } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import React from 'react';
import { HowItWorks } from '../../../components/HowItWorks';
import { transitionTime } from '../../../components/Swap/components/Dialog';
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
import { PoolTab, usePoolListTabs } from './hooks/usePoolListTabs';
import MyCreated from './MyCreated';
import MyLiquidity from './MyLiquidity';

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
  operatePMMPoolElement,
  operatePool: operatePoolProps,
  onOperatePool,
  getMigrationPairAndMining,
}: {
  params?: Page<PageType.Pool>['params'];
  scrollRef?: React.RefObject<any>;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  operatePMMPoolElement?: React.ReactElement;
  operatePool?: Partial<PoolOperateProps> | null;
  onOperatePool?: (pool: Partial<PoolOperateProps> | null) => boolean;
  getMigrationPairAndMining?: (p: { address: string; chainId: number }) => void;
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const noDocumentLink = useUserOptions((state) => state.noDocumentLink);
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const { account } = useWalletInfo();
  const { poolTab, tabs, handleChangePoolTab } = usePoolListTabs({
    account,
    paramsTab: params?.tab,
  });
  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

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
        value={poolTab}
        onChange={(_, value) => {
          handleChangePoolTab(value as PoolTab);
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
        className={isMobile ? undefined : 'gradient-card-border'}
      >
        <Box
          sx={{
            ...(isMobile
              ? {
                  ...(!account && {
                    pb: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderStyle: 'solid',
                    borderWidth: '0 0 1px',
                  }),
                }
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
          {account ? (
            <TabsGroup
              tabs={tabs}
              variant="default"
              tabsListSx={{
                justifyContent: 'space-between',
                ...(isMobile
                  ? {
                      mb: 12,
                    }
                  : {
                      borderBottomWidth: 0,
                    }),
              }}
              tabSx={
                isMobile
                  ? undefined
                  : {
                      mr: 48,
                      typography: 'h5',
                      lineHeight: '25px',
                      minHeight: 41,
                      padding: '8px 0px 8px 0px',
                    }
              }
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                typography: 'h5',
                lineHeight: '25px',
                pb: 16,
              }}
            >
              {isMobile ? (
                ''
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.3),
                    borderRadius: 6,
                    mr: 4,
                    color: 'primary.main',
                  }}
                >
                  <Box
                    component={Fee}
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                  />
                </Box>
              )}
              <Trans>Add Liquidity</Trans>
            </Box>
          )}
          <CreatePoolBtn />
        </Box>
        <TabPanelFlexCol
          value={PoolTab.addLiquidity}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
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
          />
        </TabPanelFlexCol>
        <TabPanelFlexCol value={PoolTab.myLiquidity}>
          <MyLiquidity
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
            tokenAndPoolFilter={tokenAndPoolFilter}
            getMigrationPairAndMining={getMigrationPairAndMining}
          />
        </TabPanelFlexCol>
        <TabPanelFlexCol value={PoolTab.myCreated}>
          <MyCreated
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
        </TabPanelFlexCol>

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
      {operatePool && (
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '100%' : 375,
          }}
        >
          {operatePool?.pool?.type === 'AMMV3' && operatePool.pool.chainId ? (
            poolTab === PoolTab.myLiquidity &&
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
              {operatePMMPoolElement ?? (
                <>
                  {isMobile ? (
                    <PoolOperateDialog
                      account={account}
                      onClose={() => setOperatePool(null)}
                      modal={isMobile}
                      {...operatePool}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: operatePool ? 0 : '100%',
                        height: operatePool ? 'max-content' : 0,
                        transition: `all ${transitionTime}ms`,
                        zIndex: 20,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRadius: 16,
                        maxHeight: 'max-content',
                      }}
                    >
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
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </WidgetContainer>
  );
}

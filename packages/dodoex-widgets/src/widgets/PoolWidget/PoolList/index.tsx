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
import { AllPools } from '../curve/AllPools';
import { OperateDialog } from '../curve/OperateDialog';
import { OperateCurvePoolT } from '../curve/types';
import PoolOperateDialog, {
  PoolOperate,
  PoolOperateProps,
} from '../PoolOperate';
import AddLiquidityList from './AddLiquidity';
import { CreatePoolBtn } from './components/CreatePoolBtn';
import { usePoolListFilterChainId } from './hooks/usePoolListFilterChainId';
import { TokenAndPoolFilterUserOptions } from './hooks/usePoolListFilterTokenAndPool';
import {
  PoolTab,
  PoolTokenTab,
  usePoolListTabs,
} from './hooks/usePoolListTabs';
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
  const tab = usePoolListTabs();

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
        value={tab.poolTab}
        onChange={(_, value) => {
          tab.handleChangePoolTab(value as PoolTab);
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
                  borderBottomWidth: 1,
                  borderBottomColor: 'border.main',
                  borderBottomStyle: 'solid',
                }),
          }}
        >
          <TabsGroup
            tabs={tab.poolTabs}
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

          <CreatePoolBtn />
        </Box>

        <TabPanelFlexCol
          value={PoolTab.addLiquidity}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...(isMobile && {
              pt: 12,
              mt: 12,
              borderTop: `1px solid ${theme.palette.border.main}`,
            }),
          }}
        >
          <Tabs
            value={tab.poolTokenTab}
            onChange={(_, value) => {
              tab.handleChangeTokenTab(value as PoolTokenTab);
            }}
          >
            <TabPanel value={PoolTokenTab.NORMAL}>
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
                <TabsButtonGroup
                  tabs={tab.poolTokenTabs}
                  variant="inPaperContrast"
                />
              </AddLiquidityList>
            </TabPanel>
            <TabPanel value={PoolTokenTab.MULTI_TOKEN}>
              <AllPools
                scrollParentRef={scrollParentRefProps ?? scrollParentRef}
                activeChainId={activeChainId}
                operateCurvePool={operateCurvePool}
                setOperateCurvePool={setOperateCurvePool}
                account={account}
              >
                <TabsButtonGroup
                  tabs={tab.poolTokenTabs}
                  variant="inPaperContrast"
                />
              </AllPools>
            </TabPanel>
          </Tabs>
        </TabPanelFlexCol>

        <TabPanelFlexCol
          value={PoolTab.myLiquidity}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab.poolTokenTab}
            onChange={(_, value) => {
              tab.handleChangeTokenTab(value as PoolTokenTab);
            }}
          >
            <TabPanel value={PoolTokenTab.NORMAL}>
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
                <TabsButtonGroup
                  tabs={tab.poolTokenTabs}
                  variant="inPaperContrast"
                />
              </MyLiquidity>
            </TabPanel>
            <TabPanel value={PoolTokenTab.MULTI_TOKEN}>
              <AllPools
                scrollParentRef={scrollParentRefProps ?? scrollParentRef}
                activeChainId={activeChainId}
                operateCurvePool={operateCurvePool}
                setOperateCurvePool={setOperateCurvePool}
                account={account}
                isMyPool
              >
                <TabsButtonGroup
                  tabs={tab.poolTokenTabs}
                  variant="inPaperContrast"
                />
              </AllPools>
            </TabPanel>
          </Tabs>
        </TabPanelFlexCol>

        <TabPanelFlexCol
          value={PoolTab.myCreated}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <MyCreated
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
        </TabPanelFlexCol>
      </Tabs>

      {(!tab.poolTokenTab || tab.poolTokenTab === PoolTokenTab.NORMAL) &&
        operatePool && (
          <Box
            sx={{
              position: 'relative',
              width: isMobile ? '100%' : 375,
            }}
          >
            {operatePool?.pool?.type === 'AMMV3' && operatePool.pool.chainId ? (
              tab.poolTab === PoolTab.myLiquidity &&
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

      {tab.poolTokenTab === PoolTokenTab.MULTI_TOKEN && operateCurvePool && (
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '100%' : 375,
          }}
        >
          <OperateDialog
            operateCurvePool={operateCurvePool}
            setOperateCurvePool={setOperateCurvePool}
          />
        </Box>
      )}
    </WidgetContainer>
  );
}

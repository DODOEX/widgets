
import { t, Trans } from '@lingui/macro';
import {
  alpha,
  Box,
  Tab,
  tabClasses,
  TabPanel,
  Tabs,
  TabsGroup,
  TabsList,
} from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
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
import {
  GetMigrationPairAndMining,
  ShowMigrationPairAndMining,
} from '../PoolOperate/types';
import AddLiquidityList from './AddLiquidity';
import { CreatePoolBtn } from './components/CreatePoolBtn';
import { usePoolListFilterChainId } from './hooks/usePoolListFilterChainId';
import { TokenAndPoolFilterUserOptions } from './hooks/usePoolListFilterTokenAndPool';
import { PoolTab, usePoolListTabs } from './hooks/usePoolListTabs';
import MyCreated from './MyCreated';
import MyLiquidity from './MyLiquidity';
import { ReactComponent as LeftImage } from './pool-left.svg';
import { ReactComponent as PoolTabRadiusIcon } from '../../../assets/pool-tab-radius.svg';

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
  getMigrationPairAndMining,
  showMigrationPairAndMining,
  supportAMMIcon,
}: {
  params?: Page<PageType.Pool>['params'];
  scrollRef?: React.RefObject<any>;
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions;
  getMigrationPairAndMining?: GetMigrationPairAndMining;
  showMigrationPairAndMining?: ShowMigrationPairAndMining;
  supportAMMIcon?: boolean;
}) {
  const { isMobile } = useWidgetDevice();

  const noDocumentLink = useUserOptions((state) => state.noDocumentLink);
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const { account } = useWalletInfo();
  const { poolTab, tabs, handleChangePoolTab } = usePoolListTabs({
    account,
    paramsTab: params?.tab,
  });
  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

  const [operatePool, setOperatePool] =
    React.useState<Partial<PoolOperateProps> | null>(null);

  return (
    <WidgetContainer
      sx={{
        ...(isMobile
          ? {
              p: 20,
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
                borderRadius: 16,
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
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 20,
                  borderBottomWidth: 1,
                }),
          }}
        >
          {account ? (
            <TabsGroup
              tabs={tabs}
              variant="rounded"
              tabsListSx={{
                justifyContent: 'space-between',
                ...(isMobile
                  ? {
                      mb: 16,
                    }
                  : {
                      borderBottomWidth: 0,
                    }),
              }}
              tabSx={
                isMobile
                  ? undefined
                  : {
                      mb: 0,
                    }
              }
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
              }}
            >
              <Trans>Add Liquidity</Trans>
            </Box>
          )}
          <CreatePoolBtn />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: 12,
            background: isMobile
              ? '#F4E8D0'
              : 'linear-gradient(180deg, #F4E8D0 64.3%, #EFCE8D 100%)',
            pl: isMobile ? 20 : 0,
            pr: 20,
            pb: 20,
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
            supportAMMIcon={supportAMMIcon}
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
            supportAMMIcon={supportAMMIcon}
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
            supportAMMIcon={supportAMMIcon}
          />
        </TabPanelFlexCol>
      </Tabs>
      <Box
        sx={{
          position: 'relative',
          width: isMobile
            ? '100%'
            : noDocumentLink && !operatePool
              ? 'auto'
              : 375,
        }}
      >
        {!noDocumentLink && (
          <HowItWorks
            title={t`Liquidity`}
            desc={t`Classical AMM-like pool. Suitable for most assets.`}
            linkTo="https://docs.dodoex.io/product/tutorial/how-to-provide-liquidity"
            LeftImage={LeftImage}
            sx={{
              ...(isMobile && {
                mt: 20,
              }),
              ...(!!operatePool && {
                display: 'none',
              }),
            }}
          />
        )}
        {operatePool?.pool?.type === 'AMMV3' && operatePool.pool.chainId ? (
          poolTab === PoolTab.myLiquidity &&
          operatePool.pool.liquidityPositions?.[0]?.tokenId ? (
            <AMMV3PositionManage
              // key 让 AMMV3PositionManage 重新渲染，避免组建内部状态不更新
              // https://dodo-family.slack.com/archives/C01N2RXKXB4/p1750755768216569
              key={`${operatePool.pool.chainId}-${operatePool.pool.liquidityPositions[0].tokenId}-${operatePool.pool.lpFeeRate}-${operatePool.pool.baseToken.address}-${operatePool.pool.quoteToken.address}`}
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
                getMigrationPairAndMining={getMigrationPairAndMining}
                showMigrationPairAndMining={showMigrationPairAndMining}
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
                  getMigrationPairAndMining={getMigrationPairAndMining}
                  showMigrationPairAndMining={showMigrationPairAndMining}
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
      </Box>
    </WidgetContainer>
  );
}

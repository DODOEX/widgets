import { Box, TabPanel, Tabs, TabsGroup } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { HowItWorks } from '../../../components/HowItWorks';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
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
import { PoolTab, usePoolListTabs } from './hooks/usePoolListTabs';
import MyCreated from './MyCreated';
import MyLiquidity from './MyLiquidity';
import { ReactComponent as LeftImage } from './pool-left.svg';

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
}: {
  params?: Page<PageType.Pool>['params'];
}) {
  const { isMobile } = useWidgetDevice();
  const noDocumentLink = useUserOptions((state) => state.noDocumentLink);
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const { account } = useWeb3React();
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
                backgroundColor: 'background.paper',
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
              }
        }
      >
        <Box
          sx={
            isMobile
              ? {}
              : {
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 20,
                  borderBottomWidth: 1,
                }
          }
        >
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
            scrollParentRef={scrollParentRef}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
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
      </Tabs>
      <Box
        sx={{
          position: 'relative',
          width: noDocumentLink && !operatePool ? 'auto' : 375,
        }}
      >
        {!noDocumentLink && (
          <HowItWorks
            title={t`Liquidity`}
            desc={t`Classical AMM-like pool. Suitable for most assets.`}
            linkTo="https://docs.dodoex.io/product/tutorial/how-to-provide-liquidity"
            LeftImage={LeftImage}
          />
        )}
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
        ) : isMobile ? (
          <PoolOperateDialog
            account={account}
            onClose={() => setOperatePool(null)}
            modal={isMobile}
            {...operatePool}
          />
        ) : (
          !!operatePool && (
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
          )
        )}
      </Box>
    </WidgetContainer>
  );
}

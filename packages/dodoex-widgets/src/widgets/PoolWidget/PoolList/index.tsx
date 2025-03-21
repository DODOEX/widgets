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
}: {
  params?: Page<PageType.Pool>['params'];
  scrollRef?: React.RefObject<any>;
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
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
              }
        }
        className={isMobile ? undefined : 'gradient-card-border'}
      >
        <Box
          sx={
            isMobile
              ? {}
              : {
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }
          }
        >
          {!isMobile && (
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                zIndex: 0,
                height: 16,
                width: '100%',
                background: 'linear-gradient(180deg, #AB9872 0%, #867C69 100%)',
                borderRadius: '24px 24px 0 0',
              }}
            />
          )}
          <TabsList
            sx={{
              justifyContent: 'space-between',
              borderBottomWidth: 0,
              ...(isMobile
                ? {
                    gap: 0,
                  }
                : {
                    gap: 8,
                  }),
            }}
          >
            {tabs.map(({ key, value }) => (
              <Tab
                key={key}
                value={key}
                sx={{
                  position: 'relative',
                  pl: 42,
                  mr: 35,
                  mb: 0,
                  height: 40,
                  // boxShadow: '0px -4px 8px 0px rgba(0, 0, 0, 0.10) inset',
                  borderRadius: '24px 0 0 0',
                  backgroundColor: '#DFC99F',
                  '&.base--selected': {
                    backgroundColor: '#F4E8D0',
                    color: 'text.primary',
                  },
                  [`&:not(.${tabClasses.selected}):hover`]: {
                    opacity: 1,
                    color: alpha('#6B2E21', 0.5),
                  },
                }}
                variant="rounded"
              >
                {value}
                <Box
                  component={PoolTabRadiusIcon}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: key === poolTab ? '#F4E8D0' : '#DFC99F',
                    transform: 'translateX(100%)',
                  }}
                />
              </Tab>
            ))}
          </TabsList>
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flex: 1,
            }}
          >
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
          </Box>
          <Box
            sx={{
              display: operatePool ? 'flex' : 'none',
              flexDirection: 'column',
              overflow: 'hidden',
              py: 20,
              pr: operatePool ? 20 : 0,
              position: 'relative',
              width: !operatePool ? 'auto' : 375,
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
        </Box>
      </Tabs>
    </WidgetContainer>
  );
}

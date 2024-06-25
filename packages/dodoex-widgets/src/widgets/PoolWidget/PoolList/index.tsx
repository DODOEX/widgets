import { Box, Button, Tabs, TabsGroup, TabPanel } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import React from 'react';
import { Plus as PlusIcon } from '@dodoex/icons';
import AddLiquidityList from './AddLiquidity';
import { useWeb3React } from '@web3-react/core';
import { usePoolListTabs, PoolTab } from './hooks/usePoolListTabs';
import { usePoolListFilterChainId } from './hooks/usePoolListFilterChainId';
import MyLiquidity from './MyLiquidity';
import MyCreated from './MyCreated';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import PoolOperate, { PoolOperateProps } from '../PoolOperate';
import { HowItWorks } from '../../../components/HowItWorks';
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

export default function PoolList() {
  const { isMobile } = useWidgetDevice();
  const scrollParentRef = React.useRef<HTMLDivElement>();
  const { account } = useWeb3React();
  const { poolTab, tabs, handleChangePoolTab } = usePoolListTabs({
    account,
  });
  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

  const [operatePool, setOperatePool] =
    React.useState<Partial<PoolOperateProps> | null>(null);

  return (
    <WidgetContainer
      sx={{
        padding: 20,
        ...(isMobile
          ? {}
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
          <Button
            variant={Button.Variant.outlined}
            fullWidth={isMobile}
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.CreatePool,
              });
            }}
            sx={{
              height: 40,
            }}
          >
            <Box
              component={PlusIcon}
              sx={{
                mr: 4,
              }}
            />
            <Trans>Create Pool</Trans>
          </Button>
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
          width: 375,
        }}
      >
        <HowItWorks
          title={t`Liquidity`}
          desc={t`Classical AMM-like pool. Suitable for most assets.`}
          linkTo="https://docs.dodoex.io/product/tutorial/how-to-provide-liquidity"
          LeftImage={LeftImage}
        />
        <PoolOperate
          account={account}
          onClose={() => setOperatePool(null)}
          {...operatePool}
        />
      </Box>
    </WidgetContainer>
  );
}

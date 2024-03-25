import { Box, Button, useTheme } from '@dodoex/components';
import { Tabs, TabsGroup, TabPanel } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Plus as PlusIcon } from '@dodoex/icons';
import AddLiquidityList from './list/AddLiquidity';
import { useWeb3React } from '@web3-react/core';
import { usePoolListTabs, PoolTab } from './list/hooks/usePoolListTabs';
import { usePoolListFilterChainId } from './list/hooks/usePoolListFilterChainId';
import MyLiquidity from './list/MyLiquidity';
import MyCreated from './list/MyCreated';

export function Pool() {
  const theme = useTheme();
  const scrollParentRef = React.useRef<HTMLDivElement>();
  const { account } = useWeb3React();
  const { poolTab, tabs, handleChangePoolTab } = usePoolListTabs({
    account,
  });
  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

  return (
    <Box
      sx={{
        padding: 20,
        overflowY: 'auto',
      }}
      ref={scrollParentRef}
    >
      <Tabs
        value={poolTab}
        onChange={(_, value) => {
          handleChangePoolTab(value as PoolTab);
        }}
      >
        <TabsGroup
          tabs={tabs}
          variant="rounded"
          tabsListSx={{
            mb: 16,
          }}
        />
        <Button variant={Button.Variant.outlined} fullWidth>
          <Box
            component={PlusIcon}
            sx={{
              mr: 4,
            }}
          />
          <Trans>Create Pool</Trans>
        </Button>
        <TabPanel value={PoolTab.addLiquidity}>
          <AddLiquidityList
            account={account}
            filterChainIds={filterChainIds}
            scrollParentRef={scrollParentRef}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
          />
        </TabPanel>
        <TabPanel value={PoolTab.myLiquidity}>
          <MyLiquidity
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
          />
        </TabPanel>
        <TabPanel value={PoolTab.myCreated}>
          <MyCreated
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

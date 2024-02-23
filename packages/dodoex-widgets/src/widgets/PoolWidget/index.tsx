import { Box, Button, useTheme } from '@dodoex/components';
import { Tabs, TabsList, Tab, TabPanel } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Plus as PlusIcon } from '@dodoex/icons';
import AddLiquidityList from './list/AddLiquidity';
import { useWeb3React } from '@web3-react/core';
import { usePoolListTabs, PoolTab } from './list/hooks/usePoolListTabs';
import { usePoolListFilterChainId } from './list/hooks/usePoolListFilterChainId';

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
        <TabsList
          sx={{
            mb: 16,
          }}
        >
          {tabs.map(({ key, value }) => (
            <Tab key={key} value={key}>
              {value}
            </Tab>
          ))}
        </TabsList>
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
        <TabPanel value={PoolTab.myLiquidity}>Tab 2</TabPanel>
        <TabPanel value={PoolTab.myCreated}>Tab 3</TabPanel>
      </Tabs>
    </Box>
  );
}
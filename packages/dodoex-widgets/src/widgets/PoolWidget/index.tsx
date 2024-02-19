import { Box, Button, useTheme } from '@dodoex/components';
import { Tabs, TabsList, Tab, TabPanel } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';
import { Plus as PlusIcon } from '@dodoex/icons';
import SelectChain from '../../components/SelectChain';
import { ChainId } from '../../constants/chains';
import AddLiquidityList from './list/AddLiquidity';
import { useFilterChainIds } from './list/hooks/useFilterChainIds';
import { useWeb3React } from '@web3-react/core';

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function Pool() {
  const theme = useTheme();
  const scrollParentRef = React.useRef<HTMLDivElement>();
  const { i18n } = useLingui();
  const { account } = useWeb3React();
  const [poolTab, setPoolTab] = React.useState(PoolTab.addLiquidity);
  const tabs = React.useMemo(
    () => [
      { key: PoolTab.addLiquidity, value: t`Add Liquidity` },
      {
        key: PoolTab.myLiquidity,
        value: t`My Liquidity`,
      },
      { key: PoolTab.myCreated, value: t`My Pools` },
    ],
    [i18n._],
  );
  const [activeChainId, setActiveChainId] =
    React.useState<ChainId | undefined>(undefined);
  const filterChainIds = useFilterChainIds({
    activeChainId,
  });
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
          setPoolTab(value as PoolTab);
        }}
      >
        <Box
          component={TabsList}
          sx={{
            borderBottom: `1px solid ${theme.palette.border.main}`,
            pb: 16,
            mb: 16,
          }}
        >
          {tabs.map(({ key, value }) => (
            <Tab key={key} value={key}>
              {value}
            </Tab>
          ))}
        </Box>
        <Button variant={Button.Variant.outlined} fullWidth>
          <Box
            component={PlusIcon}
            sx={{
              mr: 4,
            }}
          />
          <Trans>Create Pool</Trans>
        </Button>
        <Box
          sx={{
            my: 16,
          }}
        >
          <SelectChain chainId={activeChainId} setChainId={setActiveChainId} />
        </Box>
        <TabPanel value={PoolTab.addLiquidity}>
          <AddLiquidityList
            account={account}
            filterChainIds={filterChainIds}
            scrollParentRef={scrollParentRef}
          />
        </TabPanel>
        <TabPanel value={PoolTab.myLiquidity}>Tab 2</TabPanel>
        <TabPanel value={PoolTab.myCreated}>Tab 3</TabPanel>
      </Tabs>
    </Box>
  );
}

import { Box, Button, useTheme } from '@dodoex/components';
import { Tabs, TabsList, Tab, TabPanel } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';
import { Plus as PlusIcon } from '@dodoex/icons';
import SelectChain from '../../components/SelectChain';
import { ChainId } from '../../constants/chains';

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function Pool() {
  const theme = useTheme();
  const { i18n } = useLingui();
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
  const [chainId, setChainId] = React.useState<ChainId | undefined>(undefined);
  return (
    <Box
      sx={{
        padding: 20,
      }}
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
            mt: 16,
          }}
        >
          <SelectChain chainId={chainId} setChainId={setChainId} />
        </Box>
        <TabPanel value={PoolTab.addLiquidity}>Tab 1</TabPanel>
        <TabPanel value={PoolTab.myLiquidity}>Tab 2</TabPanel>
        <TabPanel value={PoolTab.myCreated}>Tab 3</TabPanel>
      </Tabs>
    </Box>
  );
}

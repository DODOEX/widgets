import { Tabs, TabsList, Box, Tab, TabPanel } from '@dodoex/components';
import { AddPoolOperate } from './AddPoolOperate';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import LiquidityInfo from './LiquidityInfo';
import { OperatePool } from './types';

export interface PoolOperateInnerProps {
  pool: OperatePool;
}

export default function PoolOperateInner({ pool }: PoolOperateInnerProps) {
  const { operateTab, operateTabs, handleChangeTab } = usePoolOperateTabs();
  return (
    <>
      <LiquidityInfo pool={pool} />
      <Tabs
        value={operateTab}
        onChange={(_, value) => {
          handleChangeTab(value as OperateTab);
        }}
      >
        <TabsList
          sx={{
            mt: 16,
            mx: 20,
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {operateTabs.map(({ key, value }) => (
              <Tab key={key} value={key} variant="secondary">
                {value}
              </Tab>
            ))}
          </Box>
        </TabsList>
        <TabPanel value={OperateTab.Add}>
          <AddPoolOperate pool={pool} />
        </TabPanel>
      </Tabs>
    </>
  );
}

import { Box, Tab, TabPanel, Tabs, TabsList } from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import { Error } from '@dodoex/icons';
import { TokenInfo } from '../../../hooks/Token';
import LiquidityInfo from './LiquidityInfo';

export interface PoolOperateProps {
  onClose: () => void;
  pool?: {
    address?: string;
    chainId: number;
    baseToken?: TokenInfo;
    quoteToken?: TokenInfo;
  };
}

export default function PoolOperate({ onClose, pool }: PoolOperateProps) {
  const { operateTab, tabs, handleChangeTab } = usePoolOperateTabs();
  return (
    <Dialog open={!!pool} onClose={onClose}>
      <Box
        sx={{
          px: 20,
        }}
      >
        <Tabs
          value={operateTab}
          onChange={(_, value) => {
            handleChangeTab(value as OperateTab);
          }}
        >
          <TabsList
            sx={{
              mb: 16,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {tabs.map(({ key, value }) => (
                <Tab key={key} value={key} variant="secondary">
                  {value}
                </Tab>
              ))}
            </Box>
            <Box
              component={Error}
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
              }}
              onClick={() => {
                onClose && onClose();
              }}
            />
          </TabsList>
          <TabPanel value={OperateTab.Liquidity}>
            <LiquidityInfo pool={pool} />
          </TabPanel>
        </Tabs>
        <TokenCard amt="" />
      </Box>
    </Dialog>
  );
}

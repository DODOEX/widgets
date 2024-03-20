import { Box, Tab, TabPanel, Tabs, TabsList } from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import {
  PoolOrMiningTab,
  usePoolOrMiningTabs,
} from './hooks/usePoolOrMiningTabs';
import { Error } from '@dodoex/icons';
import PoolOperateInner, { PoolOperateInnerProps } from './PoolOperateInner';

export interface PoolOperateProps {
  onClose: () => void;
  account: string | undefined;
  pool: PoolOperateInnerProps['pool'];
}

export default function PoolOperate({ onClose, pool }: PoolOperateProps) {
  const { poolOrMiningTab, poolOrMiningTabs, handleChangeTab } =
    usePoolOrMiningTabs();
  return (
    <Dialog open={!!pool} onClose={onClose}>
      <Box
        sx={{
          pb: 20,
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <Tabs
          value={poolOrMiningTab}
          onChange={(_, value) => {
            handleChangeTab(value as PoolOrMiningTab);
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <TabsList
            sx={{
              mx: 20,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {poolOrMiningTabs.map(({ key, value }) => (
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
          <TabPanel
            value={PoolOrMiningTab.Liquidity}
            sx={{
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <PoolOperateInner pool={pool} />
          </TabPanel>
        </Tabs>
      </Box>
    </Dialog>
  );
}

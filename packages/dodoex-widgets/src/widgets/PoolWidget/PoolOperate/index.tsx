import { Box, Tab, Tabs, TabsList } from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { OperateTab, usePoolOperateTabs } from './hooks/usePoolOperateTabs';
import { Error } from '@dodoex/icons';

export default function PoolOperate({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { operateTab, tabs, handleChangeTab } = usePoolOperateTabs();
  return (
    <Dialog open={open} onClose={onClose}>
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
        </Tabs>
        <TokenCard amt="" />
      </Box>
    </Dialog>
  );
}

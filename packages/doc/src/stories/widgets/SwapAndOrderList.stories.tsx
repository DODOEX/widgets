import { Box } from '@dodoex/components';
import { Swap, SwapOrderHistory } from '@dodoex/widgets';

export default {
  title: 'Widgets/SwapAndOrderList',
  component: 'div',
};

export const Primary = (args) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
      }}
    >
      <Swap />

      <SwapOrderHistory />
    </Box>
  );
};

Primary.args = {};

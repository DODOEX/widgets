import { Box } from '@dodoex/components';
import { Swap } from '@dodoex/widgets';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Widgets/Swap',
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
    </Box>
  );
};

Primary.args = {};

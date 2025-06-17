import { Box, useTheme } from '@dodoex/components';
import { Pool } from '@dodoex/widgets';

export default {
  title: 'Widgets/Pool',
  component: 'div',
};

export const Primary = (args) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 12,
        mb: 40,
        [theme.breakpoints.up('tablet')]: {
          mt: 28,
          mx: 40,
          p: 20,
          borderRadius: 16,
          backgroundColor: 'background.skeleton',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Pool />
    </Box>
  );
};

Primary.args = {};

import { TabPanel as BaseTabPanel, TabPanelProps } from '@mui/base/TabPanel';
import { Box, BoxProps } from '../Box';
import React from 'react';

export const TabPanel = React.forwardRef(function TabPanel(
  props: Partial<TabPanelProps> & {
    sx?: BoxProps['sx'];
  },
  ref,
) {
  return <Box component={BaseTabPanel} {...props} ref={ref} />;
});

import { TabPanel as BaseTabPanel, TabPanelProps } from '@mui/base/TabPanel';
import { Box, BoxProps } from '../Box';
import React from 'react';

export const TabPanel = React.forwardRef<
  HTMLDivElement,
  Partial<TabPanelProps> & {
    sx?: BoxProps['sx'];
  }
>(function TabPanel(props, ref) {
  return <Box component={BaseTabPanel} {...props} ref={ref} />;
});

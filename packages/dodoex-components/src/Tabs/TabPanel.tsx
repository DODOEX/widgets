import { TabPanel as BaseTabPanel, TabPanelOwnProps } from '@mui/base/TabPanel';
import { Box, BoxProps } from '../Box';
import React from 'react';

export const TabPanel = React.forwardRef<
  HTMLDivElement,
  TabPanelOwnProps &
    React.RefAttributes<HTMLDivElement> & {
      sx?: BoxProps['sx'];
    }
>(function TabPanel(props, ref) {
  return <Box component={BaseTabPanel} {...props} ref={ref} />;
});

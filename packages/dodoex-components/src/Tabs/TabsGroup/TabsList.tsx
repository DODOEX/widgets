import { TabsList as BaseTabsList, TabsListOwnProps } from '@mui/base/TabsList';
import { useTheme } from '@mui/system';
import { Box, BoxProps } from '../../Box';
import React from 'react';
import AnyTouch from 'any-touch';

export const TabsList = React.forwardRef<
  HTMLDivElement,
  TabsListOwnProps &
    React.RefAttributes<HTMLDivElement> & {
      sx?: BoxProps['sx'];
    }
>(function TabsList({ sx, ...props }, ref) {
  const tabListRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  React.useEffect(() => {
    if (
      tabListRef.current &&
      tabListRef.current.scrollWidth > tabListRef.current.clientWidth
    ) {
      const at = new AnyTouch(tabListRef.current);
      at.on('panmove', (e) => {
        if (tabListRef.current) {
          if (e.direction === 'left') {
            tabListRef.current.scrollTo({
              left: tabListRef.current.scrollLeft + e.distance,
            });
          } else if (e.direction === 'right') {
            tabListRef.current.scrollTo({
              left: tabListRef.current.scrollLeft - e.distance,
            });
          }
        }
      });
    }
  }, []);
  return (
    <Box
      component={BaseTabsList}
      {...props}
      ref={(node: HTMLDivElement) => {
        tabListRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        borderBottom: `1px solid ${theme.palette.border.main}`,

        '&::-webkit-scrollbar': {
          display: 'none',
        },
        ...sx,
      }}
    />
  );
});

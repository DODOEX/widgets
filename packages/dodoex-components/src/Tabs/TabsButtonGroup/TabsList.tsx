import { TabsList as BaseTabsList, TabsListProps } from '@mui/base/TabsList';
import { Box, BoxProps } from '../../Box';
import React from 'react';
import AnyTouch from 'any-touch';
import { TabProps } from './Tab';

export const TabsList = React.forwardRef<
  HTMLDivElement,
  TabsListProps & {
    sx?: BoxProps['sx'];
    variant?: TabProps['variant'];
  }
>(function TabsList({ sx, variant, ...props }, ref) {
  const tabListRef = React.useRef<HTMLDivElement>();
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
  let backgroundColor = 'background.paper';
  let borderRadius = 8;
  let padding = 0;
  let borderWidth = 0;
  let width: number | string | undefined = undefined;
  switch (variant) {
    case 'inPaper':
      backgroundColor = 'background.paperContrast';
      borderRadius = 12;
      padding = 4;
      break;
    case 'tag':
      width = 'max-content';
      backgroundColor = 'transparent';
      borderWidth = 1;
      break;
  }
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
        width,
        overflowX: 'auto',
        backgroundColor,
        padding,
        borderRadius,
        borderWidth,
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        ...sx,
      }}
    />
  );
});

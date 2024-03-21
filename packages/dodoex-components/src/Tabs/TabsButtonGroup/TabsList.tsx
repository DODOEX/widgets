import { TabsList as BaseTabsList, TabsListProps } from '@mui/base/TabsList';
import { Box, BoxProps } from '../../Box';
import React from 'react';
import AnyTouch from 'any-touch';
import { TabProps } from './Tab';

export const TabsList = React.forwardRef(function TabsList(
  {
    sx,
    variant,
    ...props
  }: TabsListProps & {
    sx?: BoxProps['sx'];
    variant?: TabProps['variant'];
  },
  ref,
) {
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
  const isInPaper = variant === 'inPaper';
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
        backgroundColor: isInPaper
          ? 'background.paperContrast'
          : 'background.paper',
        ...(isInPaper
          ? {
              p: 4,
              borderRadius: 12,
            }
          : {
              borderRadius: 8,
            }),

        '&::-webkit-scrollbar': {
          display: 'none',
        },
        ...sx,
      }}
    />
  );
});

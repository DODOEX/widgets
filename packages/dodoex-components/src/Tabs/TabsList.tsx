import { TabsList as BaseTabsList, TabsListProps } from '@mui/base/TabsList';
import { styled } from '@mui/system';
import React from 'react';
import AnyTouch from 'any-touch';

const TabListStyle = styled(BaseTabsList)`
  display: flex;
  align-items: center;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabsList = React.forwardRef<HTMLDivElement>(function TabsList(
  props: TabsListProps,
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
  return (
    <TabListStyle
      {...props}
      ref={(node: HTMLDivElement) => {
        tabListRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
    />
  );
});

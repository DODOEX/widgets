import { Tabs as BaseTabs, TabsOwnProps } from '@mui/base/Tabs';
import React from 'react';
import { Box, BoxProps } from '../Box';

export const Tabs = React.forwardRef<
  HTMLDivElement,
  TabsOwnProps &
    React.RefAttributes<HTMLDivElement> & {
      sx?: BoxProps['sx'];
    }
>(function TabsList({ onChange, ...props }, ref) {
  return (
    <Box
      component={BaseTabs}
      {...props}
      ref={ref}
      onChange={(
        evt: React.SyntheticEvent<Element, Event>,
        value: string | number | null,
      ) => {
        if (evt) {
          (evt.target as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
        if (onChange) {
          onChange(evt, value);
        }
      }}
    />
  );
});

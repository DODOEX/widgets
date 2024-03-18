import { Tabs as BaseTabs, TabsProps } from '@mui/base/Tabs';
import React from 'react';
import { Box, BoxProps } from '../Box';

export const Tabs = React.forwardRef(function TabsList(
  {
    onChange,
    ...props
  }: TabsProps & {
    sx?: BoxProps['sx'];
  },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
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

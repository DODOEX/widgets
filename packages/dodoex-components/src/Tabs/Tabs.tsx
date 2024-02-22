import { Tabs as BaseTabs, TabsProps } from '@mui/base/Tabs';
import React from 'react';

export const Tabs = React.forwardRef(function TabsList(
  { onChange, ...props }: TabsProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <BaseTabs
      {...props}
      ref={ref}
      onChange={(evt, value) => {
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
}) as typeof BaseTabs;

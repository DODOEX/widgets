import React from 'react';
import { BoxProps } from '../../Box';
import { Tab, TabProps } from './Tab';
import { TabsList } from './TabsList';

export function TabsButtonGroup<T extends string | number = string | number>({
  tabs,
  variant,
  tabsListSx,
  tabSx,
}: {
  tabs: Array<{
    key: T;
    value: React.ReactNode;
  }>;
  variant?: TabProps['variant'];
  tabsListSx?: BoxProps['sx'];
  tabSx?: BoxProps['sx'];
}) {
  return (
    <TabsList variant={variant} sx={tabsListSx}>
      {tabs.map(({ key, value }) => (
        <Tab key={key} value={key} sx={tabSx} variant={variant}>
          {value}
        </Tab>
      ))}
    </TabsList>
  );
}

import React from 'react';
import { Box, BoxProps } from '../../Box';
import { Tab, TabProps } from './Tab';
import { TabsList } from './TabsList';

export function TabsGroup<T extends string | number = string | number>({
  tabs,
  variant,
  tabsListSx,
  tabSx,
  rightSlot,
}: {
  tabs: Array<{
    key: T;
    value: React.ReactNode;
  }>;
  variant?: TabProps['variant'];
  tabsListSx?: BoxProps['sx'];
  tabSx?: BoxProps['sx'];
  rightSlot?: React.ReactNode;
}) {
  return (
    <TabsList sx={tabsListSx}>
      {rightSlot ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {tabs.map(({ key, value }) => (
              <Tab key={key} value={key} sx={tabSx} variant={variant}>
                {value}
              </Tab>
            ))}
          </Box>
          {rightSlot}
        </>
      ) : (
        tabs.map(({ key, value }) => (
          <Tab key={key} value={key} sx={tabSx} variant={variant}>
            {value}
          </Tab>
        ))
      )}
    </TabsList>
  );
}

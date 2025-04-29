import { RootPage } from '../src/components/RootPage';
import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setColorMode } from '../src/configure-store/actions/settings';
import { Box } from '@dodoex/components';

const SwitchTheme = ({ themeMode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // @ts-ignore
    dispatch(setColorMode(themeMode));
  }, [themeMode]);
  return null;
};

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: ['light', 'dark'],
        // Property that specifies if the name of the item will be displayed
        name: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      return (
        <RootPage>
          <Suspense fallback={<div />}>
            <SwitchTheme themeMode={context.globals.theme} />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'transparent',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Story />
            </Box>
          </Suspense>
        </RootPage>
      );
    },
  ],
};

export default preview;

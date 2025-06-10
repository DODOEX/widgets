import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RootPage } from '../src/components/RootPage';
import { setColorMode } from '../src/configure-store/actions/settings';

import './global.css';

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
      defaultValue: 'light',
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
      console.log('context', context, Story);
      return (
        <RootPage title={context.title}>
          <Suspense fallback={<div />}>
            <SwitchTheme themeMode={context.globals.theme} />

            <Story />
          </Suspense>
        </RootPage>
      );
    },
  ],
};

export default preview;

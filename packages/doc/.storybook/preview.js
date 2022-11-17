import { DocsPage, DocsContainer } from '@storybook/addon-docs';
import { Box } from '@dodoex/components';
import { RootPage } from '../src/components/RootPage';
import { setColorMode } from '../src/configure-store/actions/settings';
import { useDispatch } from 'react-redux';
import { useEffect, Suspense } from 'react';
import './global.css';

export const parameters = {
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
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    // https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy
    storySort: (a, b) => {
      if (a[1].kind === b[1].kind) {
        if (a[1].name !== b[1].name) {
          const aMatch = a[1].name === 'Primary' ? 1 : 0;
          const bMatch = b[1].name === 'Primary' ? 1 : 0;
          return bMatch - aMatch;
        }
      } else {
        const aMatch = a[1].kind.startsWith('System') ? 1 : 0;
        const bMatch = b[1].kind.startsWith('System') ? 1 : 0;
        return bMatch - aMatch;
      }
      return 0;
    },
  },
};

export const globalTypes = {
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
};

const SwitchTheme = ({ themeMode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setColorMode(themeMode));
  }, [themeMode]);
  return null;
};

export const decorators = [
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
              backgroundColor: 'background.default',
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
];

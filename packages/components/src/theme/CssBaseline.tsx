import * as React from 'react';
import { ThemeOptions, useThemeProps, GlobalStyles } from '@mui/system';

export const html = (theme: ThemeOptions, enableColorScheme: boolean) => ({
  WebkitFontSmoothing: 'antialiased', // Antialiasing.
  MozOsxFontSmoothing: 'grayscale', // Antialiasing.
  // Change from `box-sizing: content-box` so that `width`
  // is not affected by `padding` or `border`.
  boxSizing: 'border-box',
  // Fix font resize problem in iOS
  WebkitTextSizeAdjust: '100%',
  ...(enableColorScheme && { colorScheme: theme.palette?.mode }),
});

export const basicTheme = (theme: ThemeOptions) => ({
  color: theme.palette?.text.primary,
  fontFamily: (theme.typography as any)?.fontFamily,
  ...((theme.typography as any)?.body1 || {}),
});

export const body = (theme: ThemeOptions) => ({
  ...basicTheme(theme),
  backgroundColor: theme.palette?.background.default,
  '@media print': {
    // Save printer ink.
    backgroundColor: '#FFF',
  },
});

export const styles = (theme: ThemeOptions, enableColorScheme = false, container?: string) => {
  let defaultStyles: any = {
    html: html(theme, enableColorScheme),
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    'strong, b': {
      fontWeight: (theme.typography as any)?.fontWeightBold || 'bolder',
    },
    body: {
      margin: 0, // Remove the margin in all browsers.
      ...body(theme),
      // Add support for document.body.requestFullScreen().
      // Other elements, if background transparent, are not supported.
      '&::backdrop': {
        backgroundColor: theme.palette?.background.default,
      },
    },
  };
  if (container) {
    delete defaultStyles.html;
    delete defaultStyles.body;
    defaultStyles = {
      [container]: {
        ...defaultStyles,
        ...basicTheme(theme),
      },
    };
  }

  let themeOverrides = theme.components?.MuiCssBaseline?.styleOverrides;
  if (themeOverrides) {
    if (container) {
      let newThemeOverrides: any = {};
      Object.keys(themeOverrides).forEach((key) => {
        newThemeOverrides['*' + key] = themeOverrides[key];
      });
      themeOverrides = {
        [container]: newThemeOverrides,
      };
    }
    defaultStyles = [defaultStyles, themeOverrides];
  }

  return defaultStyles;
};

/**
 * Kickstart an elegant, consistent, and simple baseline to build upon.
 */
function CssBaseline(inProps: {
  children?: React.ReactNode;
  enableColorScheme?: boolean;
  container?: string;
}) {
  const props = useThemeProps({ props: inProps, name: 'DODOCssBaseline' });
  const { children, enableColorScheme = false, container } = props;
  return (
    <>
      <GlobalStyles styles={(theme) => styles(theme, enableColorScheme, container)} />
      {children}
    </>
  );
}

export default CssBaseline;

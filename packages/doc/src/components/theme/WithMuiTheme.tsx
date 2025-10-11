import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  PaletteMode,
} from '@dodoex/components';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import {
  getColorMode,
  getLanguage,
} from '../../configure-store/selectors/settings';

export function WithMuiTheme({ children }: { children: React.ReactNode }) {
  const colorMode = useSelector(getColorMode);
  const themeVariant = useMemo(() => {
    let mode = colorMode;
    if (colorMode === 'system') {
      mode = 'dark';
    }
    return mode as PaletteMode;
  }, [colorMode]);
  const lang = useSelector(getLanguage);
  const theme = React.useMemo(() => {
    const defaultTheme = createTheme({
      mode: themeVariant,
      lang,
    });

    return defaultTheme;
  }, [themeVariant, colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline
        styles={{
          'body.sb-show-main.sb-main-padded': {
            padding: 0,
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}

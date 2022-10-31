import { ThemeOptions, createTheme as systemCreateTheme } from '@mui/system';
import { merge } from 'lodash';
import { getDesignTokens, PaletteMode } from './config';

function createTheme(
  {
    mode = 'light',
    lang,
    theme: themeProps,
  }: {
    mode?: PaletteMode;
    lang?: string;
    theme?: ThemeOptions;
  } = {},
  ...args: object[]
) {
  let theme = getDesignTokens(mode, themeProps, lang);
  theme = args.reduce((acc: any, argument: any) => merge(acc, argument), theme);
  return systemCreateTheme(theme);
}

export default createTheme;

import { createTheme as systemCreateTheme, useTheme as useThemeBase } from '@mui/system';
import { merge } from 'lodash';
import { getDesignTokens, PaletteMode, ThemeOptions, Theme } from './config';



export const useTheme: typeof useThemeBase<Theme> = (defaultTheme) => {
  return useThemeBase<Theme>(defaultTheme);
}

function createTheme(
  {
    mode = 'light',
    lang,
    theme: themeProps,
  }: {
    mode?: PaletteMode;
    lang?: string;
    theme?: PartialDeep<ThemeOptions>;
  } = {},
  ...args: object[]
) {
  let theme = getDesignTokens(mode, themeProps, lang);
  theme = args.reduce((acc: any, argument: any) => merge(acc, argument), theme);
  return systemCreateTheme(theme);
}

export default createTheme;

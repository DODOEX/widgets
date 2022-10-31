import { ThemeOptions } from '@mui/system';
import { PaletteMode } from './config';
declare function createTheme({ mode, lang, theme: themeProps, }?: {
    mode?: PaletteMode;
    lang?: string;
    theme?: ThemeOptions;
}, ...args: object[]): import("@mui/system").Theme;
export default createTheme;

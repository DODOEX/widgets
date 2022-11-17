import { ThemeOptions } from '@mui/system';
export declare type PaletteMode = 'light' | 'dark';
interface PaletteColorOptions {
    light?: string;
    main: string;
    dark?: string;
    contrastText?: string;
}
interface TypeBackground {
    default: string;
    paper: string;
    paperContrast: string;
    backdrop: string;
    input: string;
    tag: string;
}
interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
    placeholder: string;
    link: string;
}
interface TypeBorder {
    main: string;
    disabled: string;
    light: string;
}
interface TypeHover {
    default: string;
}
export interface PaletteOptions {
    primary?: PaletteColorOptions;
    secondary?: PaletteColorOptions;
    error?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    success?: PaletteColorOptions;
    purple?: PaletteColorOptions;
    mode?: PaletteMode;
    text?: Partial<TypeText>;
    border?: Partial<TypeBorder>;
    hover?: Partial<TypeHover>;
    background?: Partial<TypeBackground>;
    getContrastText?: (background: string) => string;
}
export interface ZIndex {
    tooltip: number;
}
declare module '@mui/system' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
        tablet: true;
        laptop: true;
        desktop: true;
        largeDesktop: true;
    }
}
export declare const getNormalFontWeight: (lang: string) => 400 | 500;
export declare const darkPalette: PaletteOptions;
export declare const lightPalette: PaletteOptions;
export declare const getDesignTokens: (mode: PaletteMode, themeProps?: ThemeOptions, lang?: string) => ThemeOptions;
export {};

import * as React from 'react';
import { ThemeOptions } from '@mui/system';
export declare const html: (theme: ThemeOptions, enableColorScheme: boolean) => {
    colorScheme?: any;
    WebkitFontSmoothing: string;
    MozOsxFontSmoothing: string;
    boxSizing: string;
    WebkitTextSizeAdjust: string;
};
export declare const basicTheme: (theme: ThemeOptions) => any;
export declare const body: (theme: ThemeOptions) => any;
export declare const styles: (theme: ThemeOptions, enableColorScheme?: boolean, container?: string) => any;
/**
 * Kickstart an elegant, consistent, and simple baseline to build upon.
 */
declare function CssBaseline(inProps: {
    children?: React.ReactNode;
    enableColorScheme?: boolean;
    container?: string;
}): JSX.Element;
export default CssBaseline;

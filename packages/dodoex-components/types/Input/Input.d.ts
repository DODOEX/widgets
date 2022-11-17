/// <reference types="react" />
import { BoxProps } from '../Box';
interface StyleProps {
    fullWidth?: boolean;
    error?: boolean;
    sx?: BoxProps['sx'];
    inputSx?: BoxProps['sx'];
    height?: number | string;
    suffixGap?: number;
}
export interface InputProps extends StyleProps, React.InputHTMLAttributes<HTMLInputElement> {
    suffix?: string | React.ReactNode;
    prefix?: string | React.ReactNode;
    errorMsg?: string;
    dataTestId?: string;
}
declare const _default: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export default _default;

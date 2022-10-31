/// <reference types="react" />
import { BoxProps } from '@mui/system';
declare enum Variant {
    contained = "contained",
    outlined = "outlined",
    dashed = "dashed",
    second = "second",
    tag = "tag"
}
declare enum Size {
    small = "small",
    middle = "middle",
    big = "big"
}
interface StyleProps {
    sx?: BoxProps['sx'];
    fullWidth?: boolean;
    variant?: Variant;
    danger?: boolean;
    size?: Size;
}
export interface Props extends StyleProps, React.HTMLProps<HTMLButtonElement> {
    disabled?: boolean;
    children?: React.ReactNode | string | number;
    to?: string;
    component?: React.ElementType;
    isLoading?: boolean;
}
export declare const Button: {
    ({ onClick, disabled, children, component, to, isLoading, ...styleAttrs }: Props): JSX.Element;
    Variant: typeof Variant;
    Size: typeof Size;
};
export default Button;

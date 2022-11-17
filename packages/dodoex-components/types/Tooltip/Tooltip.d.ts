import { PopperUnstyledProps } from '@mui/base';
import { BoxProps } from '../Box';
import { JSXElementConstructor, ReactElement } from 'react';
export interface TooltipProps {
    title: React.ReactNode | string;
    maxWidth?: string | number;
    sx?: BoxProps['sx'];
    children: ReactElement<any, string | JSXElementConstructor<any>>;
    container?: PopperUnstyledProps['container'];
    direction?: PopperUnstyledProps['direction'];
    disablePortal?: PopperUnstyledProps['disablePortal'];
    placement?: PopperUnstyledProps['placement'];
    popperOptions?: PopperUnstyledProps['popperOptions'];
    transition?: PopperUnstyledProps['transition'];
    componentsProps?: PopperUnstyledProps['componentsProps'];
}
export default function Tooltip({ title, sx, maxWidth, popperOptions, children, ...attrs }: TooltipProps): JSX.Element;

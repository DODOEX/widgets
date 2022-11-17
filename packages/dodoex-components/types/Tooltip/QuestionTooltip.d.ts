/// <reference types="react" />
import { BoxProps } from '../Box';
import { PopperUnstyledProps } from '@mui/base';
export interface QuestionTooltipProps {
    title?: string | React.ReactNode;
    maxWidth?: string | number;
    ml?: number | string;
    mr?: number | string;
    size?: string | number;
    sx?: BoxProps['sx'];
    container?: PopperUnstyledProps['container'];
}
export default function QuestionTooltip({ title, ml, mr, size, sx, maxWidth, container, }: QuestionTooltipProps): JSX.Element | null;

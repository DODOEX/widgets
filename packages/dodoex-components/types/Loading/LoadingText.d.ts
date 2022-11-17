/// <reference types="react" />
import { BoxProps } from '../Box';
interface LoadingTextProps extends BoxProps {
    loadingText?: string | React.ReactNode;
    errorRefetch?: () => void;
}
export declare const LoadingText: ({ loadingText, errorRefetch, children, ...attrs }: LoadingTextProps) => JSX.Element;
export {};

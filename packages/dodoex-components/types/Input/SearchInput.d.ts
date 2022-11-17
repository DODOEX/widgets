/// <reference types="react" />
import { InputProps } from './Input';
interface Props extends InputProps {
    hideSearchIcon?: boolean;
    clearValue?: () => void;
}
export default function SearchInput({ clearValue, hideSearchIcon, height, inputSx, ...attrs }: Props): JSX.Element;
export {};

import { Input, InputProps } from '@dodoex/components';
import { BigNumber } from 'bignumber.js';
import { fixedInputStringToFormattedNumber } from '../../../../utils/formatter';

export interface NumberInputProps extends InputProps {
  maxVal?: string | number;
  decimals?: number;
  onInputChange?: (v: string | null) => void;
}
export function NumberInput({
  sx,
  maxVal,
  decimals = 2,
  onInputChange,
  ...props
}: NumberInputProps) {
  return (
    <Input
      {...props}
      onChange={(evt: any) => {
        const inputVal =
          evt.target.value.length === 0
            ? null
            : fixedInputStringToFormattedNumber(evt.target.value, decimals);
        const finalVal =
          maxVal && inputVal && new BigNumber(inputVal).gt(maxVal)
            ? maxVal.toString()
            : inputVal;
        onInputChange && onInputChange(finalVal);
      }}
    />
  );
}

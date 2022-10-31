import {
  Box,
  Input,
  InputProps,
  BoxProps,
  useTheme,
} from '@dodoex-io/components';
import { BigNumber } from 'bignumber.js';
import { useMemo, useRef } from 'react';
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
  const theme = useTheme();

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
        console.log('finalVal:', finalVal);
        onInputChange && onInputChange(finalVal);
      }}
    />
  );
}

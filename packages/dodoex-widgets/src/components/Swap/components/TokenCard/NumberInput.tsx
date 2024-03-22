import { Box, Input, BoxProps, useTheme, ButtonBase } from '@dodoex/components';
import { useMemo, useRef } from 'react';
import { Error, Clear } from '@dodoex/icons';
import {
  formatReadableNumber,
  fixedInputStringToFormattedNumber,
} from '../../../../utils/formatter';
import { numberInputWrapper } from '../../../../constants/testId';

export function NumberInput({
  readOnly,
  sx,
  value,
  decimals,
  onChange,
  suffix,
  withClear,
  onFocus,
  placeholder,
  readonlyShowSuffix,
}: {
  readOnly?: boolean;
  sx?: BoxProps['sx'];
  value?: string;
  decimals?: number;
  onFocus?: () => void;
  onChange?: (v: string) => void;
  suffix?: React.ReactNode | string;
  withClear?: boolean;
  placeholder?: string;
  readonlyShowSuffix?: boolean;
}) {
  const theme = useTheme();

  const endAdornment = useMemo(() => {
    if (suffix) {
      return suffix;
    }

    if (withClear && value && onChange) {
      return (
        <Box
          component={ButtonBase}
          sx={{
            ml: 5,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: 'border.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
          onClick={() => {
            onChange && onChange('');
          }}
        >
          <Box
            component={Error}
            sx={{
              width: 12,
              color: 'text.secondary',
            }}
          />
        </Box>
      );
    }
  }, [onChange, suffix, theme.palette.text.primary, value, withClear]);

  return (
    <Box
      sx={{
        mt: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx,
      }}
      data-testid={numberInputWrapper}
    >
      <Input
        fullWidth
        value={value}
        readOnly={readOnly}
        placeholder={placeholder || '0.00'}
        onFocus={onFocus}
        onChange={(evt: any) => {
          const inputVal = evt.target.value;
          const input =
            inputVal.length === 0
              ? ''
              : fixedInputStringToFormattedNumber(inputVal, decimals as number);
          onChange && onChange(input as string);
        }}
        sx={{
          width: 'inherit',
          border: 'none',
          '& .MuiInput-input': {
            fontSize: 24,
            border: 'none',
            outline: 'none',
            padding: 0,
            color: 'text.primary',
            '&::placeholder': {
              fontSize: 24,
              color: 'text.disabled',
            },
          },
        }}
      />
      {(!readOnly || readonlyShowSuffix) && value && endAdornment}
    </Box>
  );
}

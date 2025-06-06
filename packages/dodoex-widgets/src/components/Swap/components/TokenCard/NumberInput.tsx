import { Box, BoxProps, ButtonBase, Input, useTheme } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { ForwardedRef, forwardRef, useMemo } from 'react';
import { numberInputWrapper } from '../../../../constants/testId';
import { fixedInputStringToFormattedNumber } from '../../../../utils/formatter';

export const NumberInput = forwardRef(function NumberInput(
  {
    readOnly,
    sx,
    value,
    decimals,
    onChange,
    suffix,
    suffixGap = 0,
    withClear,
    onFocus,
    placeholder,
    readonlyShowSuffix,
    typography,
  }: {
    readOnly?: boolean;
    sx?: BoxProps['sx'];
    value?: string;
    decimals?: number;
    onFocus?: () => void;
    onChange?: (v: string) => void;
    suffix?: React.ReactNode | string;
    suffixGap?: number;
    withClear?: boolean;
    placeholder?: string;
    readonlyShowSuffix?: boolean;
    typography?: string;
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
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
            color: 'text.secondary',
            '&:focus-visible': {
              border: 'solid 1px',
              borderColor: 'text.primary',
            },
          }}
          onClick={() => {
            onChange && onChange('');
          }}
        >
          <Box
            component={Error}
            sx={{
              width: 12,
            }}
          />
        </Box>
      );
    }
  }, [onChange, suffix, theme.palette.text.primary, value, withClear]);

  return (
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
      data-testid={numberInputWrapper}
      suffix={(!readOnly || readonlyShowSuffix) && endAdornment}
      suffixGap={suffixGap}
      ref={ref}
      sx={{
        border: 'none',
        '& input': {
          fontSize: 24,
          typography,
          border: 'none',
          outline: 'none',
          padding: 0,
          color: 'text.primary',
          '&::placeholder': {
            fontSize: 24,
            typography,
            color: 'text.disabled',
          },
        },
        ...sx,
      }}
    />
  );
});

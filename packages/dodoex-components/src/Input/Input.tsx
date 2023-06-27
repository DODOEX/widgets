import InputUnstyled, { inputClasses } from '@mui/base/Input';
import { MuiStyledOptions, useTheme } from '@mui/system';
import { merge } from 'lodash';
import { forwardRef, useCallback, useEffect } from 'react';
import { Box, BoxProps } from '../Box';

interface StyleProps {
  fullWidth?: boolean;
  error?: boolean;
  sx?: BoxProps['sx'];
  inputSx?: BoxProps['sx'];
  height?: number | string;
  suffixGap?: number;
}
// @ts-ignore
export interface InputProps
  extends StyleProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string | React.ReactNode;
  prefix?: string | React.ReactNode;
  errorMsg?: string;

  dataTestId?: string;
}

function InputBaseRoot({
  fullWidth,
  height,
  suffixGap,
  error,
  sx,
  ...attrs
}: {
  fullWidth?: boolean;
  height?: string | number;
  suffixGap?: number;
  error?: boolean;
  sx?: BoxProps['sx'];
  [key: string]: any;
}) {
  return (
    <Box
      component="div"
      sx={merge(
        {
          position: 'relative',
          display: fullWidth ? 'flex' : 'inline-flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: error ? 'error.main' : 'border.main',
          borderRadius: 8,
          backgroundColor: 'background.input',
          [`&.${inputClasses.disabled}`]: {
            color: 'text.disabled',
            cursor: 'default',
          },
          height,
          ...(fullWidth && {
            width: '100%',
          }),
          '& > *:not(input):not(.MuiSelect-select):first-of-type': {
            ml: suffixGap,
            whiteSpace: 'nowrap',
          },
          '& > *:not(input):last-child': {
            mr: suffixGap,
            whiteSpace: 'nowrap',
          },
          ...(!error
            ? {
                [`&.${inputClasses.focused}`]: {
                  borderColor: 'text.secondary',
                },
              }
            : {}),
        },
        sx,
      )}
      {...attrs}
    />
  );
}

function InputBaseComponent({
  sx,
  ...attrs
}: {
  sx?: BoxProps['sx'];
  [key: string]: any;
}) {
  const theme = useTheme();
  const placeholder = {
    color: 'text.placeholder',
    fontSize: '14px',
    fontWeight: 500,
    opacity: 1,
  };

  return (
    <Box
      component="input"
      sx={merge(
        {
          font: 'inherit',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '19px',
          px: 16,
          py: 14,
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            // @ts-ignore
            '-webkit-appearance': 'none',
          },
          height: '100%',
          width: '100%',
          border: 'none',
          color: 'text.primary',
          backgroundColor: 'transparent',
          '&::-webkit-input-placeholder': placeholder,
          '&::-moz-placeholder': placeholder, // Firefox 19+
          '&:-ms-input-placeholder': placeholder, // IE11
          '&::-ms-input-placeholder': placeholder, // Edge
          '&:focus': {
            outline: 0,
          },
          // Reset Firefox invalid required input style
          '&:invalid': {
            boxShadow: 'none',
          },
          '&::-webkit-search-decoration': {
            // Remove the padding when type=search.
            WebkitAppearance: 'none',
          },
          [`&.${inputClasses.disabled}`]: {
            opacity: 1, // Reset iOS opacity
            WebkitTextFillColor: theme.palette.text.disabled, // Fix opacity Safari bug
          },
        },
        sx,
      )}
      {...attrs}
    />
  );
}

export default forwardRef(function Input(
  {
    fullWidth,
    error,
    errorMsg,
    sx,
    inputSx,
    suffix,
    prefix,
    height,
    suffixGap = 16,
    dataTestId,
    ...attrs
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const InputBaseRootMemo = useCallback(
    (props: any) => (
      <InputBaseRoot
        fullWidth={fullWidth}
        height={height}
        suffixGap={suffixGap}
        error={error}
        sx={sx}
        data-testid={dataTestId}
        {...props}
      />
    ),
    [fullWidth, height, suffixGap, error, dataTestId, JSON.stringify(sx)],
  );
  const InputBaseComponentMemo = useCallback(
    (props: any) => <InputBaseComponent sx={inputSx} {...props} />,
    [JSON.stringify(inputSx), error],
  );
  return (
    <>
      <InputUnstyled
        slots={{
          root: InputBaseRootMemo,
          input: InputBaseComponentMemo,
        }}
        startAdornment={prefix}
        endAdornment={suffix}
        {...attrs}
        ref={ref}
      />
      {errorMsg ? (
        <Box
          sx={{
            typography: 'body2',
            color: 'error.main',
            mt: 6,
          }}
        >
          {errorMsg}
        </Box>
      ) : (
        ''
      )}
    </>
  );
});

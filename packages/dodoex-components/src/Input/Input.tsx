import InputUnstyled, { inputClasses } from '@mui/base/Input';
import { MuiStyledOptions, styled, useTheme } from '@mui/system';
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

const StyledInput = styled(Box)(({ theme }) => {
  const placeholder = `{
    color: ${theme.palette.text.placeholder};
    font-size: 14px;
    font-weight: 500;
    opacity: 1;
  }`;
  return `
    font: inherit;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    padding: ${theme.spacing(14, 16)};
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    height: 100%;
    width: 100%;
    border: none;
    color: ${theme.palette.text.primary};
    background-color: transparent;
    &::-webkit-input-placeholder ${placeholder};
    &::-moz-placeholder ${placeholder};
    &:-ms-input-placeholder ${placeholder};
    &::-ms-input-placeholder ${placeholder};
    &:focus {
      outline: 0;
    }
    &:invalid {
      box-shadow: none;
    }
    &::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    &.${inputClasses.disabled} {
      opacity: 1;
      -webkit-text-fill-color: ${theme.palette.text.disabled};
    }
    `;
});

export default forwardRef(function Input(
  {
    fullWidth,
    error,
    errorMsg,
    sx,
    suffix,
    prefix,
    height,
    suffixGap = 16,
    dataTestId,
    inputSx,
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
  return (
    <>
      <InputUnstyled
        slots={{
          root: InputBaseRootMemo,
          input: StyledInput,
        }}
        startAdornment={prefix}
        endAdornment={suffix}
        slotProps={{
          input: {
            // @ts-ignore
            component: 'input',
            sx: inputSx,
          },
        }}
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

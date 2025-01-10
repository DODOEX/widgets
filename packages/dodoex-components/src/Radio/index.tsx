import React from 'react';
import { Box, BoxProps } from '../Box';
import { useTheme } from '../theme';

type RadioProps = {
  sx?: BoxProps['sx'];
  size?: number;
  checkedIconSize?: number;
  checked?: boolean;
  onChange?: (
    evt: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
};
export const Radio = React.forwardRef(function Radio(
  {
    sx,
    onChange,
    size: sizeProps,
    checkedIconSize: checkedIconSizeProps,
    ...other
  }: RadioProps,
  ref,
) {
  const theme = useTheme();
  const size = sizeProps ?? 20;
  const checkedIconSize = checkedIconSizeProps ?? size / 2 + 2;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        border: '1px solid',
        borderColor: other.checked ? '#34CA50' : 'text.secondary',
        cursor: 'pointer',
        ...sx,
        [theme.breakpoints.up('tablet')]: {
          borderColor: other.checked ? '#000' : 'text.secondary',
        },
      }}
    >
      <Box
        component="input"
        type="radio"
        {...other}
        ref={ref}
        onChange={(evt) => {
          onChange?.(evt, evt.target.checked);
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          opacity: 0,
        }}
      />
      {other.checked && (
        <Box
          sx={{
            width: checkedIconSize,
            height: checkedIconSize,
            borderRadius: '50%',
            backgroundColor: '#34CA50',
            [theme.breakpoints.up('tablet')]: {
              backgroundColor: '#000',
            },
          }}
        />
      )}
    </Box>
  );
});

import { Box, styled, useTheme } from '@mui/system';
import { forwardRef } from 'react';
import { CheckboxProps } from './Checkbox.types';
import { Done as CheckedIcon } from '@dodoex/icons';

const Checkbox = forwardRef(function Checkbox<
  RootComponentType extends React.ElementType,
>(
  props: CheckboxProps<RootComponentType>,
  forwardedRef: React.ForwardedRef<Element>,
) {
  const theme = useTheme();
  const { size = 18, sx, ...other } = props;

  return (
    <Box
      component="span"
      sx={{
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        width: size,
        height: size,
        '&:hover > .checkbox-icon': {
          borderColor: theme.palette.text.primary,
        },
        ...sx,
      }}
    >
      <>
        <Box
          component="input"
          type="checkbox"
          ref={forwardedRef}
          sx={{
            cursor: 'inherit',
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            m: 0,
            p: 0,
            zIndex: 1,
            '&:checked + .checkbox-icon': {
              border: 'none',
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
              '& svg': {
                display: 'inline-block',
              },
            },
          }}
          {...other}
        />
        <Box
          component="span"
          className="checkbox-icon"
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            width: size,
            height: size,
            borderStyle: 'solid',
            borderWidth: 1,
            flex: 1,
            borderColor: theme.palette.text.secondary,
            '.Mui-focusVisible &': {
              outline: 'none',
              outlineOffset: 2,
            },
            'input:disabled ~ &': {
              borderColor: theme.palette.text.disabled,
            },
          }}
        >
          <Box
            component={CheckedIcon}
            sx={{
              display: 'none',
              width: '75%',
              height: '75%',
            }}
          />
        </Box>
      </>
    </Box>
  );
});

export default Checkbox;

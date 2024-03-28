import { Button as ButtonUnstyled } from '@mui/base/Button';
import {
  CSSSelectorObject,
  SystemCssProperties,
  alpha,
  BoxProps,
  Theme,
  useTheme,
  Box,
} from '@mui/system';
import { merge } from 'lodash';
import { Loading } from '@dodoex/icons';
// import { ReactComponent as LadingIcon } from './icons/loading.svg';

enum Variant {
  contained = 'contained',
  outlined = 'outlined',
  dashed = 'dashed',
  second = 'second',
  tag = 'tag',
}

enum Size {
  small = 'small',
  middle = 'middle',
  big = 'big',
}

interface StyleProps {
  sx?: BoxProps['sx'];
  fullWidth?: boolean;
  variant?: Variant;
  danger?: boolean;
  size?: Size;
  backgroundColor?: string;
}

// @ts-ignore
export interface Props extends StyleProps, React.HTMLProps<HTMLButtonElement> {
  disabled?: boolean;
  children?: React.ReactNode | string | number;
  to?: string;
  component?: React.ElementType;
  isLoading?: boolean;
}

const buttonStyles = (
  { fullWidth, variant, sx, danger, size, backgroundColor }: StyleProps,
  theme: Theme,
) => {
  let result: SystemCssProperties<Theme> | CSSSelectorObject<Theme> = {
    px: 16,
    py: 10,
    typography: 'button',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: backgroundColor ?? 'transparent', // Reset default value
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0, // Remove the margin in Safari
    borderRadius: 0,
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    MozAppearance: 'none', // Reset
    WebkitAppearance: 'none', // Reset
    textDecoration: 'none',
    // So we take precedent over the style of a native <a /> element.
    color: 'inherit',
    '&::-moz-focus-inner': {
      borderStyle: 'none', // Remove Firefox dotted outline.
    },
    '&[disabled]': {
      pointerEvents: 'none', // Disable link interactions
      cursor: 'default',
    },
    '@media print': {
      colorAdjust: 'exact',
    },
  };
  switch (size) {
    case Size.small:
      result.height = 36;
      result.borderRadius = 8;
      result.typography = 'body2';
      break;
    case Size.big:
      result.height = 60;
      result.borderRadius = 16;
      break;

    default:
      result.height = 48;
      result.borderRadius = 8;
      break;
  }
  if (fullWidth) {
    result.display = 'flex';
    result.width = '100%';
  }
  const hoverLabel = '&:not([disabled]):hover';
  switch (variant) {
    case Variant.outlined:
      result = {
        ...result,
        border: `solid 1px ${
          danger ? theme.palette.error.main : theme.palette.primary.main
        }`,
        color: danger ? 'error.main' : 'primary.main',
        '&[disabled]': {
          color: 'text.disabled',
          borderColor: 'border.disabled',
        },
        [hoverLabel]: {
          background: danger
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.primary.main, 0.1),
        },
      };
      break;
    case Variant.dashed:
      result = {
        ...result,
        height: result.height - 1,
        border: `dashed 1px ${
          danger ? theme.palette.error.main : theme.palette.border.light
        }`,
        color: danger ? 'error.main' : 'primary.main',
        '&[disabled]': {
          backgroundColor: 'border.disabled',
          color: 'text.disabled',
        },
        [hoverLabel]: {
          background: danger
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.border.disabled, 0.1),
        },
      };
      break;
    case Variant.second:
      result = {
        ...result,
        backgroundColor: danger
          ? 'error.main'
          : backgroundColor ?? theme.palette.background.tag,
        border: 'none',
        color: danger ? 'error.contrastText' : 'text.primary',
        '&[disabled]': {
          backgroundColor: 'border.disabled',
          color: 'text.disabled',
        },
        [hoverLabel]: {
          background: danger
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.border.disabled, 0.2),
        },
      };
      break;
    case Variant.tag:
      result = {
        ...result,
        px: 10,
        py: 3,
        height: 'auto',
        borderRadius: 4,
        typography: 'body2',
        backgroundColor: danger
          ? 'error.main'
          : backgroundColor ?? 'background.tag',
        border: 'none',
        color: danger ? 'error.contrastText' : 'primary.main',
        '&[disabled]': {
          backgroundColor: 'border.disabled',
          color: 'text.disabled',
        },
        [hoverLabel]: {
          background: danger
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.border.disabled, 0.2),
        },
      };
      break;
    default:
      result = {
        ...result,
        backgroundColor: danger
          ? 'error.main'
          : backgroundColor ?? 'secondary.main',
        [hoverLabel]: {
          background: `linear-gradient(0deg, rgba(26, 26, 27, 0.1), rgba(26, 26, 27, 0.1)), ${
            danger
              ? theme.palette.error.main
              : // @ts-ignore
                sx?.backgroundColor || theme.palette.secondary.main
          }`,
        },
        color: danger ? 'error.contrastText' : 'secondary.contrastText',
        '&[disabled]': {
          backgroundColor: 'border.disabled',
          color: 'text.disabled',
        },
      };
      break;
  }
  return merge(result, sx);
};

export const Button = ({
  onClick,
  disabled,
  children,
  component,
  to,
  isLoading,
  // styleAttrs
  fullWidth,
  variant,
  sx,
  danger,
  size,
  backgroundColor,
  ref,
  ...props
}: Props) => {
  const theme = useTheme();
  const attrs = {
    disabled,
    sx: buttonStyles(
      { fullWidth, variant, sx, danger, size, backgroundColor },
      theme,
    ),
    onClick,
    component,
    to,
  };

  return (
    <Box
      {...attrs}
      {...props}
      component={ButtonUnstyled}
      disabled={isLoading ? true : disabled}
      className={variant || Variant.contained}
    >
      <>
        {isLoading && (
          <Box
            component={Loading}
            sx={{
              mr: 8,
              '& path': {
                fill: theme.palette.text.disabled,
              },
              animation: 'loadingRotate 1.1s infinite linear',
              '@keyframes loadingRotate': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(359deg)',
                },
              },
            }}
          />
        )}

        {children}
      </>
    </Box>
  );
};

Button.Variant = Variant;
Button.Size = Size;

export default Button;

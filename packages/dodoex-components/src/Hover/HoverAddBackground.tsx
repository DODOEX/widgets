import { Box, BoxProps } from '../Box';
import { forwardRef } from 'react';
import { useDevices } from '../hooks';
import { alpha, useTheme } from '../theme';

interface Prop extends BoxProps {
  hoverColor?: string;
}

const HoverAddBackground = forwardRef(
  ({ sx, hoverColor, ...other }: Prop, ref: any) => {
    const theme = useTheme();
    const { isMobile } = useDevices();
    const isLight = theme.palette.mode === 'light';

    const hoverCss = isMobile
      ? {}
      : {
          '&:hover': {
            backgroundColor:
              hoverColor || alpha(theme.palette.text.primary, 0.04),
            // Compatible with navLink color
            '.nav-link-class:not(.active)': {
              color: isLight ? alpha('#000', 0.9) : theme.palette.common.white,
            },
          },
        };

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 4,
          ...hoverCss,
          ...sx,
        }}
        {...other}
      />
    );
  },
);

export default HoverAddBackground;
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

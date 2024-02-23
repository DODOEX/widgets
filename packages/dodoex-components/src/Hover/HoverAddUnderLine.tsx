import React from 'react';
import { Box, BoxProps } from '../Box';
import { useDevices } from '../hooks';
import { useTheme } from '../theme';

interface HoverAddUnderLineProps extends BoxProps {
  lineColor?: string;
  lineSx?: BoxProps['sx'];
  hoverSx?: BoxProps['sx'];
}

const HoverAddUnderLine = React.forwardRef(
  (
    {
      children,
      sx,
      lineColor,
      lineSx,
      hoverSx,
      ...attrs
    }: HoverAddUnderLineProps,
    ref: any,
  ) => {
    const theme = useTheme();
    const { isMobile } = useDevices();

    const hoverCss = isMobile
      ? {}
      : {
          '&:hover': {
            '.hover-under-line': {
              display: 'block',
            },
            ...hoverSx,
          },
        };

    return (
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          '.hover-under-line': {
            display: 'none',
          },
          ...hoverCss,
          ...sx,
        }}
        {...attrs}
      >
        {children}
        <Box
          className="hover-under-line"
          sx={{
            width: '100%',
            height: '1px',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -3,
            backgroundColor: lineColor || theme.palette.text.primary,
            ...lineSx,
          }}
        />
      </Box>
    );
  },
);

export default HoverAddUnderLine;

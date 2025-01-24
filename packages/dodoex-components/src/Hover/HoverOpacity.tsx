import { merge } from 'lodash';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box';

const HoverOpacity = forwardRef<
  HTMLDivElement,
  BoxProps & {
    weak?: boolean;
    color?: string;
  }
>(({ weak, color, sx, ...attrs }, ref) => {
  let defaultColor = weak ? 'text.primary' : 'text.secondary';
  let hoverColor = weak ? 'text.secondary' : 'text.primary';
  if (color) {
    defaultColor = color;
    hoverColor = color;
  }
  const hoverCss = {
    '&:hover': {
      color: hoverColor,
      opacity: color && weak ? 0.5 : 1,
    },
  };
  return (
    <Box
      ref={ref}
      sx={merge(
        {
          color: defaultColor,
          opacity: color && !weak ? 0.5 : 1,
          ...hoverCss,
        },
        sx,
      )}
      {...attrs}
    />
  );
});

HoverOpacity.displayName = 'HoverOpacity';

export default HoverOpacity;

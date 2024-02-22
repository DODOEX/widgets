import { merge } from 'lodash';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box';

const HoverOpacity = forwardRef(
  (
    {
      weak,
      color,
      sx,
      ...attrs
    }: BoxProps & {
      weak?: boolean;
      color?: string;
    },
    ref: any,
  ) => {
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
  },
);

export default HoverOpacity;

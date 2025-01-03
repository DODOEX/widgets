import { Box, BoxProps } from '@dodoex/components';
import React, { useEffect, useState } from 'react';

interface Props {
  size: number;
  color: string;
  time: string;
  strokeWidth?: number | string;
  sx?: BoxProps['sx'];
}

function Countdown({ size, color, time, strokeWidth = 2, sx }: Props) {
  const defaultStroke = '0 1069';
  const [stroke, setStroke] = useState(defaultStroke);
  const half = size / 2;
  const radius = half - 1;

  useEffect(() => {
    setStroke(`${2 * Math.PI * radius} 0`);
  }, []);

  return (
    <Box
      width={size}
      height={size}
      component="svg"
      sx={{
        position: 'absolute',
        top: `-${strokeWidth}`,
        left: `-${strokeWidth}`,
        transform: 'rotate(-90deg)',
        ...sx,
      }}
    >
      <Box
        component="circle"
        cx={half}
        cy={half}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none"
        strokeDasharray={stroke}
        sx={{
          transition: `stroke-dasharray ${time}`,
        }}
      />
    </Box>
  );
}

export default React.memo(Countdown);

import { Box, BoxProps } from '@dodoex/components';
import React from 'react';

export default function SpaceBetweenItem({
  sx,
  label,
  children,
  ...props
}: BoxProps & {
  label: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...props}
    >
      <Box>{label}</Box>
      <Box
        sx={{
          textAlign: 'right',
          fontWeight: 600,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

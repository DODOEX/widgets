import { Box, useTheme } from '@dodoex/components';
import React from 'react';

export function Card({
  title,
  children,
  isWaiting,
  backgroundColor,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  isWaiting: boolean;
  backgroundColor: string;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 16,
        borderRadius: 8,
        backgroundColor,
        flexGrow: 1,
        flexBasis: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'h5',
        }}
      >
        {isWaiting ? '-' : children}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mt: 8,
        }}
      >
        {title}
      </Box>
    </Box>
  );
}

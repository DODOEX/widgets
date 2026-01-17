import { Box } from '@dodoex/components';
import React from 'react';

interface ErrorTipProps {
  errorKey?: string;
}

export default function ErrorTip({ errorKey }: ErrorTipProps) {
  if (!errorKey) return null;

  return (
    <Box
      sx={{
        mt: -10,
        borderRadius: 8,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'background.paperDarkContrast',
        color: 'error.main',
        typography: 'h6',
        textAlign: 'center',
      }}
    >
      {errorKey}
    </Box>
  );
}

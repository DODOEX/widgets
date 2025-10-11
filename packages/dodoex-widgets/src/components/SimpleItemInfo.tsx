import { Box } from '@dodoex/components';
import React from 'react';

export default function SimpleItemInfo({
  label,
  children,
}: React.PropsWithChildren<{
  label: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ color: 'text.secondary' }}>{label}</Box>
      {children}
    </Box>
  );
}

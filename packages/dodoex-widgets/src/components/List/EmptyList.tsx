import { Box, BoxProps, EmptyDataIcon } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';

export function EmptyList({
  sx,
  hasSearch,
  emptyText,
}: {
  sx?: BoxProps['sx'];
  hasSearch?: boolean;
  emptyText?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        ...sx,
      }}
    >
      <EmptyDataIcon hasSearch={hasSearch} />
      <Box
        sx={{
          typography: 'body2',
          mt: 16,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        {emptyText ?? <Trans>No results found</Trans>}
      </Box>
    </Box>
  );
}

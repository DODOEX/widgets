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
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
        typography: 'body2',
        fontWeight: 500,
        color: 'text.secondary',
        textAlign: 'center',
        ...sx,
      }}
    >
      <EmptyDataIcon hasSearch={hasSearch} />
      <Box>{emptyText ?? <Trans>No results found</Trans>}</Box>
    </Box>
  );
}

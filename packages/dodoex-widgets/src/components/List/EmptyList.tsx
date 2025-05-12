import {
  Box,
  BoxProps,
  EmptyDataIcon as EmptyDataIconOrigin,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { useUserOptions } from '../UserOptionsProvider';

export function EmptyDataIcon(
  props: Parameters<typeof EmptyDataIconOrigin>[0],
) {
  const { EmptyDataIcon } = useUserOptions();

  return EmptyDataIcon ? (
    <EmptyDataIcon {...props} />
  ) : (
    <EmptyDataIconOrigin {...props} />
  );
}

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
      <EmptyDataIcon
        hasSearch={hasSearch}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 12,
        }}
      />
      <Box>{emptyText ?? <Trans>No results found</Trans>}</Box>
    </Box>
  );
}

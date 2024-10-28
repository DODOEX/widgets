import { Box, EmptyDataIcon } from '@dodoex/components';

export function MiningListEmpty({
  notFoundText,
  hasSearch,
}: {
  notFoundText: string;
  hasSearch?: boolean;
}) {
  return (
    <Box
      sx={{
        pt: 76,
        pb: 40,
        typography: 'body2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'text.disabled',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <EmptyDataIcon
        hasSearch={hasSearch}
        sx={{
          mb: 12,
          width: 60,
          height: 60,
          borderRadius: (24 / 105) * 60,
        }}
      />
      {notFoundText}
    </Box>
  );
}

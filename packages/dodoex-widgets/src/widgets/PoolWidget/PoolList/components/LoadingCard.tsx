import { Box, BoxProps, Skeleton } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export default function LoadingCard({ sx }: { sx?: BoxProps['sx'] }) {
  return (
    <Box
      sx={{
        px: 20,
        pt: 20,
        pb: 12,
        backgroundColor: 'background.paperContrast',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Skeleton variant="circular" width={48} />
          <Skeleton
            variant="rounded"
            height={28}
            width={100}
            sx={{
              ml: 8,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 44,
        }}
      >
        <Box>
          <Skeleton variant="rounded" height={24} width={100} />
          <Box
            sx={{
              typography: 'h6',
              color: 'text.secondary',
            }}
          >
            <Trans>APY</Trans>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'inline-block',
            mx: 20,
            height: 24,
            width: '1px',
            backgroundColor: 'custom.border.default',
          }}
        />
        <Box>
          <Skeleton variant="rounded" height={24} width={100} />
          <Box
            sx={{
              typography: 'h6',
              color: 'text.secondary',
            }}
          >
            <Trans>TVL</Trans>
          </Box>
        </Box>
      </Box>
      <Skeleton variant="rounded" height={32} />
    </Box>
  );
}

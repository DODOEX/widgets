import { Box, BoxProps, Skeleton } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';

export default function LoadingCard({ sx }: { sx?: BoxProps['sx'] }) {
  const { supportAMMV2, supportAMMV3 } = useUserOptions();
  const supportAMM = supportAMMV2 || supportAMMV3;
  return (
    <Box
      sx={{
        px: 20,
        pt: 20,
        pb: 12,
        backgroundColor: 'background.paper',
        borderRadius: 16,
        ...sx,
      }}
    >
      {/* title */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TokenLogoPair width={24} tokens={[]} mr={6} showChainLogo />
          <Skeleton variant="rounded" height={20} width={88} />
        </Box>
      </Box>
      {/* info */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          rowGap: 20,
          mt: 44,
          '& > div:nth-child(odd)': {
            pr: 20,
          },
          '& > div:nth-child(even)': {
            position: 'relative',
            pl: 20,
            '&::before': {
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-block',
              content: '""',
              height: 24,
              width: '1px',
              backgroundColor: 'border.main',
            },
          },
        }}
      >
        {supportAMM && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              <Skeleton variant="rounded" height={24} width={100} />
            </Box>
            <Box
              sx={{
                typography: 'h6',
                color: 'text.secondary',
              }}
            >
              <Trans>Pool Type</Trans>
            </Box>
          </Box>
        )}

        <Box>
          <Skeleton variant="rounded" height={24} width={100} />
          <Box
            sx={{
              typography: 'h6',
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            <Trans>APY</Trans>
          </Box>
        </Box>

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

        {supportAMM && (
          <Box>
            <Skeleton variant="rounded" height={24} width={100} />
            <Box
              sx={{
                typography: 'h6',
                color: 'text.secondary',
              }}
            >
              <Trans>Volume (1D)</Trans>
            </Box>
          </Box>
        )}
      </Box>
      {/* operate */}
      <Skeleton
        variant="rounded"
        height={32}
        sx={{
          mt: 20,
        }}
      />
    </Box>
  );
}

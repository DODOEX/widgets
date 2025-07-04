import { Box, LoadingSkeleton, useTheme } from '@dodoex/components';
import { Ve33PoolInfoI } from '../types';
import { t, Trans } from '@lingui/macro';
import { formatReadableNumber, formatApy } from '../../../utils';

export default function PoolInfo({
  poolInfo,
  isLoading,
}: {
  poolInfo?: Ve33PoolInfoI;
  isLoading?: boolean;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 20,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: theme.palette.background.paperContrast,
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            flexBasis: '50%',
            px: 20,
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>TVL</Trans>
          </Box>
          <LoadingSkeleton
            loading={isLoading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: 'caption',
              fontWeight: 600,
            }}
          >
            {formatReadableNumber({
              input: poolInfo?.totalValueLockedUSD,
            })}
          </LoadingSkeleton>
        </Box>
        <Box
          sx={{
            height: 48,
            width: '1px',
            flexGrow: 0,
            flexShrink: 0,
            backgroundColor: theme.palette.border.main,
          }}
        />
        <Box
          sx={{
            flexBasis: '50%',
            px: 20,
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>APR</Trans>
          </Box>
          <LoadingSkeleton
            loading={isLoading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: 'caption',
              fontWeight: 600,
            }}
          >
            {formatApy(
              Number(poolInfo?.apr.fees) + Number(poolInfo?.apr.incentives),
            )}
          </LoadingSkeleton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 20,
          typography: 'body2',
          color: theme.palette.text.secondary,
        }}
      >
        <span>{t`Total ${poolInfo?.baseToken.symbol}`}</span>
        <span>{t`Total ${poolInfo?.quoteToken.symbol}`}</span>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 8,
          typography: 'body2',
          borderRadius: 12,
        }}
      >
        <LoadingSkeleton
          loading={isLoading}
          loadingProps={{
            width: 100,
          }}
          sx={{
            typography: 'caption',
            fontWeight: 600,
          }}
        >
          {formatReadableNumber({
            input: poolInfo?.totalValueLockedToken0,
          })}
        </LoadingSkeleton>
        <LoadingSkeleton
          loading={isLoading}
          loadingProps={{
            width: 100,
          }}
          sx={{
            typography: 'caption',
            fontWeight: 600,
          }}
        >
          {formatReadableNumber({
            input: poolInfo?.quoteTokenAmount,
          })}
        </LoadingSkeleton>
      </Box>
    </Box>
  );
}

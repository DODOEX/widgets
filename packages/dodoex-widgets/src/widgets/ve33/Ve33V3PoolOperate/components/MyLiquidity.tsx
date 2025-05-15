import {
  Box,
  BoxProps,
  LoadingSkeleton,
  Skeleton,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { LightCard } from './widgets';
import TokenAndEtherscan from './TokenAndEtherscan';
import { TokenInfo } from '../../../../hooks/Token';
import { byWei, formatTokenAmountNumber } from '../../../../utils/formatter';

function TokenLoading() {
  return (
    <Box>
      <Skeleton width={150} height={20} />
      <Skeleton
        width={100}
        height={27}
        sx={{
          mt: 12,
        }}
      />
    </Box>
  );
}

export default function MyLiquidity({
  border,
  token0,
  token1,
  amount0,
  amount1,
  sx,
}: {
  border?: boolean;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  amount0: string | undefined;
  amount1: string | undefined;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  return (
    <Box sx={sx}>
      <Box
        sx={{
          typography: 'body1',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          textAlign: 'left',
        }}
      >
        <Trans>My Liquidity</Trans>
      </Box>
      <LightCard
        sx={{
          mt: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          position: 'relative',
          p: 20,
        }}
        border={border}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 2,
            height: 59,
            backgroundColor: 'background.paperContrast',
          }}
        />
        {!token0 ? (
          <TokenLoading />
        ) : (
          <Box>
            <TokenAndEtherscan token={token0} />
            <LoadingSkeleton
              loading={amount0 === undefined}
              loadingProps={{
                width: 100,
              }}
              sx={{
                mt: 12,
                typography: 'caption',
              }}
            >
              {amount0
                ? formatTokenAmountNumber({
                    input: byWei(amount0, token0.decimals),
                    decimals: token0.decimals,
                  })
                : ''}
            </LoadingSkeleton>
          </Box>
        )}
        {!token1 ? (
          <TokenLoading />
        ) : (
          <Box>
            <TokenAndEtherscan token={token1} />
            <LoadingSkeleton
              loading={amount1 === undefined}
              loadingProps={{
                width: 100,
              }}
              sx={{
                mt: 12,
                typography: 'caption',
              }}
            >
              {amount1
                ? formatTokenAmountNumber({
                    input: byWei(amount1, token1.decimals),
                    decimals: token1.decimals,
                  })
                : ''}
            </LoadingSkeleton>
          </Box>
        )}
      </LightCard>
    </Box>
  );
}

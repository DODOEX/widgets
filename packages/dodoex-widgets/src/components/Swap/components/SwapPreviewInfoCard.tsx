import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { TokenInfo } from '../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../utils';
import BigNumber from 'bignumber.js';

export default function SwapPreviewInfoCard({
  slippage,
  receiveAmount,
  receiveToken,
  priceImpact,
}: {
  slippage: number;
  receiveAmount: number | null;
  receiveToken: TokenInfo | null;
  priceImpact: string;
}) {
  if (!receiveToken || receiveAmount === null) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        mb: 12,
        p: 12,
        borderRadius: 8,
        borderWidth: 1,
        typography: 'body2',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Trans>Minimum Received</Trans>
        <Box
          component="span"
          sx={{
            fontWeight: 600,
          }}
        >
          {`${formatTokenAmountNumber({
            input: receiveAmount
              ? new BigNumber(1).minus(slippage / 100).times(receiveAmount)
              : null,
            decimals: receiveToken?.decimals,
          })} ${receiveToken?.symbol}`}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Trans>Price Impact</Trans>
        <Box
          component="span"
          sx={{
            fontWeight: 600,
          }}
        >
          {`${priceImpact}%`}
        </Box>
      </Box>
    </Box>
  );
}

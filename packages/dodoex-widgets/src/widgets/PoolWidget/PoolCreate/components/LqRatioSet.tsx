import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useCreatePmm } from '../hooks/useCreatePmm';
import { StateProps } from '../reducer';
import DepthAndLiquidityChart from './DepthAndLiquidityChart';

export function LqRatioSet({
  isWaiting,
  selectedVersion,
  baseToken,
  quoteToken,
  initPrice,
  slippageCoefficient,
  baseAmount,
  quoteAmount,
  peggedBaseTokenRatio,
  peggedQuoteTokenRatio,
}: {
  isWaiting: boolean;
  selectedVersion: StateProps['selectedVersion'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  slippageCoefficient: StateProps['slippageCoefficient'];
  baseAmount: StateProps['baseAmount'];
  quoteAmount: StateProps['quoteAmount'];
  peggedBaseTokenRatio: StateProps['peggedBaseTokenRatio'];
  peggedQuoteTokenRatio: StateProps['peggedQuoteTokenRatio'];
}) {
  const theme = useTheme();

  const { pmmParams, pmmModel, midPrice } = useCreatePmm({
    selectedVersion,
    baseAmount,
    quoteAmount,
    initPrice,
    slippageCoefficient,
  });

  return (
    <>
      {!isWaiting && (
        <DepthAndLiquidityChart
          baseToken={baseToken}
          quoteToken={quoteToken}
          pmmParams={pmmParams}
          pmmModel={pmmModel}
          midPrice={midPrice}
        />
      )}

      <Box
        sx={{
          mt: isWaiting ? 0 : 20,
          padding: 16,
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
          width: '50%',
          opacity: isWaiting ? 0.5 : 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            typography: 'h5',
            fontWeight: 600,
          }}
        >
          {isWaiting ? (
            '-'
          ) : (
            <>
              {peggedBaseTokenRatio}%&nbsp;{baseToken?.symbol}
              &nbsp;:&nbsp;{peggedQuoteTokenRatio}%&nbsp;{quoteToken?.symbol}
            </>
          )}
        </Box>
        <Box
          sx={{
            typography: 'h6',
            fontWeight: 500,
            color: theme.palette.text.secondary,
            mt: 8,
          }}
        >
          <Trans>Initial asset ratio</Trans>
        </Box>
      </Box>
    </>
  );
}

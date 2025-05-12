import { Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { useCreatePmm } from '../hooks/useCreatePmm';
import { useVersionList } from '../hooks/useVersionList';
import { StateProps } from '../reducer';
import { SectionStatusT } from '../types';
import { computeInitPriceText } from '../utils';
import DepthAndLiquidityChart from './DepthAndLiquidityChart';

function Card({
  title,
  children,
  isWaiting,
  backgroundColor,
}: {
  title: string;
  children: React.ReactNode;
  isWaiting: boolean;
  backgroundColor: string;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 16,
        borderRadius: 8,
        backgroundColor,
        flexGrow: 1,
        flexBasis: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'h5',
        }}
      >
        {isWaiting ? '-' : children}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mt: 8,
        }}
      >
        {title}
      </Box>
    </Box>
  );
}

export function LqSettingsShow({
  status,
  selectedVersion,
  baseToken,
  quoteToken,
  initPrice,
  slippageCoefficient,
  baseAmount,
  quoteAmount,
  cardBg,
}: {
  status: SectionStatusT;
  selectedVersion: StateProps['selectedVersion'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  slippageCoefficient: StateProps['slippageCoefficient'];
  baseAmount: StateProps['baseAmount'];
  quoteAmount: StateProps['quoteAmount'];
  cardBg: string;
}) {
  const { pmmParams, pmmModel, midPrice } = useCreatePmm({
    selectedVersion,
    baseAmount,
    quoteAmount,
    initPrice,
    slippageCoefficient,
  });

  const { versionMap } = useVersionList();

  const isWaiting = status === 'waiting';
  const { initPriceLabel } = versionMap[selectedVersion];
  return (
    <>
      {status === 'running' && (
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
          mt: 20,
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          opacity: isWaiting ? 0.5 : 1,
        }}
      >
        <Card
          backgroundColor={cardBg}
          title={t`Token Pair`}
          isWaiting={isWaiting}
        >
          {baseToken && quoteToken ? (
            <>
              <TokenLogoPair
                width={24}
                tokens={[baseToken, quoteToken]}
                chainId={baseToken.chainId}
              />
              {baseToken.symbol}-{quoteToken.symbol}
            </>
          ) : (
            ''
          )}
        </Card>
        <Card
          backgroundColor={cardBg}
          title={initPriceLabel}
          isWaiting={isWaiting}
        >
          {baseToken && quoteToken ? (
            <>
              1&nbsp;{baseToken.symbol}=
              {computeInitPriceText({
                midPrice,
                quoteToken,
                selectedVersion,
                initPrice,
              }) ?? '-'}
              &nbsp;
              {quoteToken.symbol}
            </>
          ) : (
            ''
          )}
        </Card>
        <Card
          backgroundColor={cardBg}
          title={t`Slippage Coefficient`}
          isWaiting={isWaiting}
        >
          {slippageCoefficient}
        </Card>
      </Box>
    </>
  );
}

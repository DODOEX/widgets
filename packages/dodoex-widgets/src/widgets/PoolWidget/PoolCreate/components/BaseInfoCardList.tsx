import { Box, BoxProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { useVersionList } from '../hooks/useVersionList';
import { StateProps } from '../reducer';
import { SectionStatusT } from '../types';
import { computeInitPriceText } from '../utils';
import { Card } from './widgets';

export function BaseInfoCardList({
  status,
  selectedVersion,
  baseToken,
  quoteToken,
  initPrice,
  slippageCoefficient,
  midPrice,
  sx,
  cardBg,
}: {
  status: SectionStatusT;
  selectedVersion: StateProps['selectedVersion'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  slippageCoefficient: StateProps['slippageCoefficient'];
  midPrice: BigNumber | undefined;
  sx?: BoxProps['sx'];
  cardBg: string;
}) {
  const { versionMap } = useVersionList();

  const isWaiting = status === 'waiting';
  const { initPriceLabel } = versionMap[selectedVersion];
  if (!baseToken || !quoteToken) return null;
  return (
    <>
      <Box
        sx={{
          mt: 0,
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          opacity: isWaiting ? 0.5 : 1,
          ...sx,
        }}
      >
        <Card
          backgroundColor={cardBg}
          title={<Trans>Token Pair</Trans>}
          isWaiting={isWaiting}
        >
          <TokenLogoPair
            width={24}
            height={24}
            tokens={[baseToken, quoteToken]}
          />
          {baseToken.symbol}-{quoteToken.symbol}
        </Card>
        <Card
          backgroundColor={cardBg}
          title={<Trans>Slippage Coefficient</Trans>}
          isWaiting={isWaiting}
        >
          {slippageCoefficient}
        </Card>
        <Card
          backgroundColor={cardBg}
          title={initPriceLabel}
          isWaiting={isWaiting}
        >
          1&nbsp;{baseToken.symbol}&nbsp;=&nbsp;
          {computeInitPriceText({
            midPrice,
            quoteToken,
            selectedVersion,
            initPrice,
          }) ?? '-'}
          &nbsp;
          {quoteToken.symbol}
        </Card>
      </Box>
    </>
  );
}

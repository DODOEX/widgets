import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import JSBI from 'jsbi';
import { ReactNode } from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import {
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import { BIPS_BASE } from '../constants/misc';
import { Currency } from '../sdks/sdk-core';
import { Position } from '../sdks/v3-sdk';
import { AMMV3 } from './Badge/AMMV3';
import RangeBadge from './Badge/RangeBadge';
import { PositionSelectedRangePreview } from './PositionSelectedRangePreview';
import { AutoColumn, LightCard, RowBetween, RowFixed } from './widgets';

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position;
  title?: ReactNode;
  inRange: boolean;
  baseCurrencyDefault?: Currency;
  ticksAtLimit: { [bound: string]: boolean | undefined };
}) => {
  const currency0 = position.pool.token0;
  const currency1 = position.pool.token1;

  const removed =
    position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0));

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ gap: 4 }}>
        <RowFixed>
          <TokenLogoPair
            tokens={[
              { address: currency0.address },
              { address: currency1.address },
            ]}
            mr={8}
            chainId={currency0.chainId}
          />
          <Box
            sx={{
              typography: 'h5',
            }}
          >
            {currency0?.symbol} / {currency1?.symbol}
          </Box>
        </RowFixed>
        <AMMV3
          sx={{
            ml: 'auto',
          }}
        />
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard>
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={currency0?.address ?? ''}
                chainId={currency0?.chainId}
                noShowChain
                width={32}
                height={32}
                marginRight={0}
              />
              <Box
                sx={{
                  ml: 8,
                }}
              >
                {currency0?.symbol}
              </Box>
            </RowFixed>
            <RowFixed>
              <Box
                sx={{
                  mr: 8,
                }}
              >
                {formatTokenAmountNumber({
                  input: position.amount0.toSignificant(),
                  decimals: currency0?.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={currency1?.address ?? ''}
                chainId={currency1?.chainId}
                noShowChain
                width={32}
                height={32}
                marginRight={0}
              />
              <Box ml="8px">{currency1?.symbol}</Box>
            </RowFixed>
            <RowFixed>
              <Box mr="8px">
                {formatTokenAmountNumber({
                  input: position.amount1.toSignificant(),
                  decimals: currency1?.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
        <RowBetween>
          <Box>
            <Trans>Fee tier</Trans>
          </Box>
          <Box>
            {formatPercentageNumber({
              input: position?.pool?.fee / (BIPS_BASE * 100),
            })}
          </Box>
        </RowBetween>
      </LightCard>

      <PositionSelectedRangePreview
        position={position}
        title={title}
        baseCurrencyDefault={baseCurrencyDefault}
        ticksAtLimit={ticksAtLimit}
      />
    </AutoColumn>
  );
};

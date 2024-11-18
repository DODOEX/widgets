import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import JSBI from 'jsbi';
import { ReactNode, useCallback, useState } from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import {
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import { BIPS_BASE } from '../constants/misc';
import { Currency } from '../sdks/sdk-core';
import { Position } from '../sdks/v3-sdk';
import { Bound } from '../types';
import { formatTickPrice } from '../utils/formatTickPrice';
import RangeBadge from './Badge/RangeBadge';
import { RateToggle } from './RateToggle';
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

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
          ? currency1
          : currency0
      : currency0,
  );

  const sorted = baseCurrency === currency0;
  const quoteCurrency = sorted ? currency1 : currency0;

  const price = sorted
    ? position.pool.priceOf(position.pool.token0)
    : position.pool.priceOf(position.pool.token1);

  const priceLower = sorted
    ? position.token0PriceLower
    : position.token0PriceUpper.invert();
  const priceUpper = sorted
    ? position.token0PriceUpper
    : position.token0PriceLower.invert();

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency);
  }, [quoteCurrency]);

  const removed =
    position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0));

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <TokenLogoPair
            tokens={[
              { address: currency0.address },
              { address: currency1.address },
            ]}
            mr={8}
          />
          <Box
            sx={{
              typography: 'h5',
            }}
          >
            {currency0?.symbol} / {currency1?.symbol}
          </Box>
        </RowFixed>
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
                  typography: 'h5',
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

          <RowBetween>
            <Box>
              <Trans>Fee tier</Trans>
            </Box>
            <Box>
              {formatPercentageNumber({
                input: position?.pool?.fee / BIPS_BASE,
              })}
            </Box>
          </RowBetween>
        </AutoColumn>
      </LightCard>
      <AutoColumn gap="md">
        <RowBetween>
          {title ? <Box>{title}</Box> : <div />}
          <RateToggle
            baseToken={sorted ? currency0 : currency1}
            quoteToken={sorted ? currency1 : currency0}
            handleRateToggle={handleRateChange}
          />
        </RowBetween>

        <RowBetween>
          <LightCard
            sx={{
              width: '48%',
              padding: '8px',
            }}
          >
            <AutoColumn gap="4px" justify="center">
              <Box fontSize="12px">
                <Trans>Min price</Trans>
              </Box>
              <Box textAlign="center">
                {formatTickPrice({
                  price: priceLower,
                  atLimit: ticksAtLimit,
                  direction: Bound.LOWER,
                })}
              </Box>
              <Box textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </Box>
              <Box fontSize={11} textAlign="center" color="$neutral3" mt={4}>
                <Trans>
                  Your position will be 100% composed of {baseCurrency?.symbol}{' '}
                  at this price
                </Trans>
              </Box>
            </AutoColumn>
          </LightCard>

          <LightCard
            sx={{
              width: '48%',
              padding: '8px',
            }}
          >
            <AutoColumn gap="4px" justify="center">
              <Box fontSize="12px">
                <Trans>Max price</Trans>
              </Box>
              <Box textAlign="center">
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: ticksAtLimit,
                  direction: Bound.UPPER,
                })}
              </Box>
              <Box textAlign="center" fontSize="12px">
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </Box>
              <Box fontSize={11} textAlign="center" color="$neutral3" mt={4}>
                <Trans>
                  Your position will be 100% composed of {quoteCurrency?.symbol}{' '}
                  at this price
                </Trans>
              </Box>
            </AutoColumn>
          </LightCard>
        </RowBetween>
        <LightCard
          sx={{
            padding: 12,
          }}
        >
          <AutoColumn gap="4px" justify="center">
            <Box fontSize="12px">
              <Trans>Current price</Trans>
            </Box>
            <Box>{`${formatTokenAmountNumber({
              input: price.toSignificant(),
            })} `}</Box>
            <Box textAlign="center" fontSize="12px">
              <Trans>
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Trans>
            </Box>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  );
};

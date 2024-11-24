import { Box, useTheme } from '@dodoex/components';
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
import { AMMV3 } from './Badge/AMMV3';

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

  const theme = useTheme();

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
      <RowBetween style={{ gap: 4 }}>
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
        </AutoColumn>
        <RowBetween>
          <Box>
            <Trans>Fee tier</Trans>
          </Box>
          <Box>
            {formatTokenAmountNumber({
              input: position?.pool?.fee / BIPS_BASE,
              decimals: 2,
            })}
          </Box>
        </RowBetween>
      </LightCard>
      <AutoColumn gap="md">
        <RowBetween>
          {title ? (
            <Box
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {title}
            </Box>
          ) : (
            <div />
          )}
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
              py: 12,
              gap: 12,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  typography: 'body2',
                }}
              >
                <Trans>Min price</Trans>
              </Box>
              <Box
                sx={{
                  color: theme.palette.text.secondary,
                  typography: 'h6',
                }}
              >
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </Box>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'caption',
              }}
            >
              {formatTickPrice({
                price: priceLower,
                atLimit: ticksAtLimit,
                direction: Bound.LOWER,
              })}
            </Box>
            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
              }}
            >
              <Trans>
                Your position will be 100% composed of {baseCurrency?.symbol} at
                this price
              </Trans>
            </Box>
          </LightCard>

          <LightCard
            sx={{
              width: '48%',
              py: 12,
              gap: 12,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  typography: 'body2',
                }}
              >
                <Trans>Max price</Trans>
              </Box>
              <Box
                sx={{
                  color: theme.palette.text.secondary,
                  typography: 'h6',
                }}
              >
                <Trans>
                  {quoteCurrency.symbol} per {baseCurrency.symbol}
                </Trans>
              </Box>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'caption',
              }}
            >
              {formatTickPrice({
                price: priceUpper,
                atLimit: ticksAtLimit,
                direction: Bound.UPPER,
              })}
            </Box>

            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
              }}
            >
              <Trans>
                Your position will be 100% composed of {quoteCurrency?.symbol}{' '}
                at this price
              </Trans>
            </Box>
          </LightCard>
        </RowBetween>
        <LightCard
          sx={{
            py: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AutoColumn gap="4px" justify="center">
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'body2',
              }}
            >
              <Trans>Current price</Trans>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
              }}
            >
              <Trans>
                {quoteCurrency.symbol} per {baseCurrency.symbol}
              </Trans>
            </Box>
          </AutoColumn>
          <Box
            sx={{
              color: theme.palette.text.primary,
              typography: 'caption',
            }}
          >{`${formatTokenAmountNumber({
            input: price.toSignificant(),
          })} `}</Box>
        </LightCard>
      </AutoColumn>
    </AutoColumn>
  );
};

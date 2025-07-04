import { t } from '@lingui/macro';
import { Price } from '../../../../utils/fractions';
import { useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { TickMath } from '../utils/tickMath';
import { TokenInfo } from '../../../../hooks/Token';
import { tryParseTick } from '../utils/tryParseTick';
import { Bound } from '../types';
import { tickToPrice } from '../utils/getTickToPrice';

export interface PriceRangeRatioSelectProps {
  totalApr: bigint | undefined;
  currentPrice?: string;
  tickSpacing?: number;
  priceLower: Price | undefined;
  priceUpper: Price | undefined;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  tickSpaceLimits: { [bound in Bound]?: number | undefined };
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  handleSetFullRange: () => void;
}
export function usePriceRangeRatioSelect({
  totalApr,
  currentPrice,
  tickSpacing,
  priceLower,
  priceUpper,
  token0,
  token1,
  tickSpaceLimits,
  onLeftRangeInput,
  onRightRangeInput,
  handleSetFullRange,
}: PriceRangeRatioSelectProps) {
  const theme = useTheme();
  const currentPriceBg = currentPrice ? new BigNumber(currentPrice) : undefined;

  const ratioOptions = [
    { type: t`Narrow`, ratio: 0.03 },
    { type: t`Common`, ratio: 0.08 },
    { type: t`Wide`, ratio: 0.15 },
    { type: t`Full`, ratio: 1 },
  ];

  const options = ratioOptions.map(({ type, ratio }, index) => {
    const borderRadius = theme.spacing(
      index === 0 ? 8 : 0,
      index === 1 ? 8 : 0,
      index === 3 ? 8 : 0,
      index === 2 ? 8 : 0,
    );

    const { low, high, ratioText, active, apr } = getPriceRanger({
      price: currentPriceBg,
      priceLower,
      priceUpper,
      totalApr,
      tickSpacing,
      ratio,
      token0,
      token1,
      tickSpaceLimits,
    });

    return {
      type,
      ratio: ratioText,
      apr,
      borderRadius,
      active,
      onClick: () => {
        if (ratio === 1) {
          handleSetFullRange();
          return;
        }
        onLeftRangeInput(low?.toString() ?? '');
        onRightRangeInput(high?.toString() ?? '');
      },
    };
  });

  return { options };
}

function getPriceRanger({
  totalApr,
  price,
  priceLower,
  priceUpper,
  tickSpacing,
  token0,
  token1,
  ratio,
  tickSpaceLimits,
}: {
  totalApr: bigint | undefined;
  price: BigNumber | undefined;
  priceLower: Price | undefined;
  priceUpper: Price | undefined;
  tickSpacing: number | undefined;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  ratio: number;
  tickSpaceLimits: { [bound in Bound]?: number | undefined };
}) {
  if (!token0 || !token1 || !tickSpacing || !price) {
    return {
      low: undefined,
      high: undefined,
      ratioText: '',
      active: false,
      apr: '',
    };
  }
  let newTickLower: number | undefined;
  let newTickUpper: number | undefined;
  let low: BigNumber | undefined;
  let high: BigNumber | undefined;
  if (ratio === 1) {
    newTickLower = tickSpaceLimits[Bound.LOWER];
    newTickUpper = tickSpaceLimits[Bound.UPPER];
  } else {
    low = price?.times(1 - ratio);
    high = price?.times(1 + ratio);
    newTickLower = tryParseTick(token0, token1, low.toString(), tickSpacing);
    newTickUpper = tryParseTick(token0, token1, high.toString(), tickSpacing);
  }
  const apr = calculateLpApr(totalApr, tickSpacing, newTickLower, newTickUpper);
  const newPriceLower =
    newTickLower !== undefined
      ? tickToPrice(token0, token1, newTickLower)
      : undefined;
  const newPriceUpper =
    newTickUpper !== undefined
      ? tickToPrice(token0, token1, newTickUpper)
      : undefined;

  const active = Boolean(
    priceLower &&
      priceUpper &&
      newPriceLower?.equalTo(priceLower) &&
      newPriceUpper?.equalTo(priceUpper),
  );
  const ratioText = ratio === 1 ? '(∞)' : `(±${ratio * 100}%)`;

  return {
    low,
    high,
    ratioText,
    active,
    apr: apr ? `${apr.toString()}%` : '0%',
  };
}

const MAX_TICK_BIGINT = BigInt(TickMath.MAX_TICK * 2);
function calculateLpApr(
  totalApr: bigint | undefined,
  tickSpacing: number,
  positionTickLower: number | undefined,
  positionTickUpper: number | undefined,
) {
  if (tickSpacing < 1) return totalApr;

  if (
    positionTickLower === positionTickUpper ||
    !totalApr ||
    !positionTickLower ||
    !positionTickUpper
  ) {
    return BigInt(0);
  }

  // Calculate the tick number covered by the position
  const coveredTicks = Math.round(
    (positionTickUpper - positionTickLower) / tickSpacing,
  );

  if (coveredTicks < 1) return BigInt(0);
  return (totalApr * MAX_TICK_BIGINT) / BigInt(coveredTicks) / MAX_TICK_BIGINT;
}

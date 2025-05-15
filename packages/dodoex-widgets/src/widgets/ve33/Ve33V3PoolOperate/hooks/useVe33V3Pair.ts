import { TokenInfo } from '../../../../hooks/Token';
import { toWei } from '../../../../utils';
import { useQuery } from '@tanstack/react-query';
import { priceToClosestTick, tickToPrice } from '../utils/getTickToPrice';
import { Price } from '../../../../utils/fractions';
import { TickMath } from '../utils/tickMath';
import {
  getFetchVE33V3PairLiquidityQueryOptions,
  getFetchVE33V3PairSlot0QueryOptions,
  getFetchVE33V3PairTickSpacingQueryOptions,
} from '@dodoex/dodo-contract-request';
import { usePoolTokenSort } from '../../../../hooks/Token/usePoolTokenSort';

export function useVe33V3Pair({
  address,
  baseToken,
  quoteToken,
  startPriceTypedValue,
}: {
  address: string | undefined;
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  startPriceTypedValue?: string;
}) {
  const tokenSort = usePoolTokenSort({
    baseToken,
    quoteToken,
  });

  const fetchTickSpacing = useQuery(
    getFetchVE33V3PairTickSpacingQueryOptions(tokenSort.chainId, address),
  );
  const fetchGlobalState = useQuery(
    getFetchVE33V3PairSlot0QueryOptions(tokenSort.chainId, address),
  );
  const fetchLiquidity = useQuery(
    getFetchVE33V3PairLiquidityQueryOptions(tokenSort.chainId, address),
  );

  let currentTick: number | undefined = undefined;
  let currentSqrt: string | undefined = undefined;
  let price: Price | undefined;
  let reversePrice: string | undefined;

  const tickSpacing = fetchTickSpacing.data
    ? Number(fetchTickSpacing.data)
    : 60;

  if (fetchGlobalState.data) {
    currentTick = Number(fetchGlobalState.data.tick);
    currentSqrt = TickMath.getSqrtRatioAtTick(currentTick).toString();
    price =
      fetchGlobalState.data &&
      tokenSort.token0Wrapped &&
      tokenSort.token1Wrapped
        ? tickToPrice(
            tokenSort.token0Wrapped,
            tokenSort.token1Wrapped,
            fetchGlobalState.data.tick,
          )
        : undefined;
  } else if (quoteToken && baseToken && Number(startPriceTypedValue)) {
    const quoteAmount = toWei(
      startPriceTypedValue as string,
      quoteToken.decimals,
    ).toString();
    const baseAmount = toWei(1, baseToken.decimals).toString();
    price = new Price(baseToken, quoteToken, baseAmount, quoteAmount);
    if (tokenSort.isRearTokenA) {
      price = price.invert();
    }
    currentTick = priceToClosestTick(price);
    currentSqrt = TickMath.getSqrtRatioAtTick(currentTick).toString();
  }

  return {
    address,
    fetchTickSpacing,
    fetchGlobalState,
    fetchLiquidity,
    currentTick,
    currentSqrt,
    price,
    reversePrice,
    tickSpacing,
    ...tokenSort,
  };
}

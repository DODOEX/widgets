/* eslint-disable no-plusplus */
import { TokenInfo } from '../../../../hooks/Token';
import {
  ALGEBRA_POOL_DEPLOYER_ADDRESSES,
  ALGEBRA_POOL_INIT_CODE_HASH,
  computePoolAddress,
  toWei,
} from '../../../../utils';
import { usePoolTokenSort } from '../../../../hooks/usePoolTokenSort';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchAlgebraPoolGlobalStateQueryOptions,
  getFetchAlgebraPoolLiquidityQueryOptions,
  getFetchAlgebraPoolTickSpacingQueryOptions,
} from '@dodoex/dodo-contract-request';
import { priceToClosestTick, tickToPrice } from '../utils/getTickToPrice';
import { Price } from '../../../../utils/fractions';
import { TickMath } from '../utils/tickMath';

export function useAlgebraPair({
  baseToken,
  quoteToken,
  startPriceTypedValue,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  startPriceTypedValue?: string;
}) {
  const tokenSort = usePoolTokenSort({
    baseToken,
    quoteToken,
  });
  let address = undefined as undefined | string;
  if (tokenSort.token0 && tokenSort.token1) {
    address = computePoolAddress({
      tokenA: tokenSort.token0Wrapped,
      tokenB: tokenSort.token1Wrapped,
      poolDeployer: ALGEBRA_POOL_DEPLOYER_ADDRESSES[tokenSort.chainId] ?? '',
      initCodeHashManualOverride:
        ALGEBRA_POOL_INIT_CODE_HASH[tokenSort.chainId] ?? '',
    });
  }
  const fetchTickSpacing = useQuery(
    getFetchAlgebraPoolTickSpacingQueryOptions(tokenSort.chainId, address),
  );
  const fetchGlobalState = useQuery(
    getFetchAlgebraPoolGlobalStateQueryOptions(tokenSort.chainId, address),
  );
  const fetchLiquidity = useQuery(
    getFetchAlgebraPoolLiquidityQueryOptions(tokenSort.chainId, address),
  );

  const isExists =
    !!fetchTickSpacing.data ||
    !!fetchGlobalState.data ||
    fetchLiquidity.data !== undefined;

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
  } else if (quoteToken && baseToken && startPriceTypedValue) {
    const quoteAmount = toWei('1', quoteToken.decimals).toString();
    const baseAmount = toWei(
      startPriceTypedValue,
      baseToken.decimals,
    ).toString();
    price = !tokenSort.isRearTokenA
      ? new Price(baseToken, quoteToken, baseAmount, quoteAmount)
      : new Price(baseToken, quoteToken, quoteAmount, baseAmount);
    currentTick = priceToClosestTick(!tokenSort.isRearTokenA, price);
    currentSqrt = TickMath.getSqrtRatioAtTick(currentTick).toString();
  }

  return {
    isExists,
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

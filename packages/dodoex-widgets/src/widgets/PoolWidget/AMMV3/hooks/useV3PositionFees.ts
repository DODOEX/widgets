import { BigNumber } from '@ethersproject/bignumber';
import { useQuery } from '@tanstack/react-query';
import { ammV3Api } from '../../utils';
import { ChainId, Currency, CurrencyAmount } from '../sdks/sdk-core';
import { Pool } from '../sdks/v3-sdk/entities/pool';
import { useV3NFTPositionManagerContract } from './useContract';

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees({
  chainId,
  pool,
  tokenId,
  asWETH,
}: {
  chainId: ChainId;
  pool?: Pool;
  tokenId: string;
  asWETH: boolean;
}):
  | [CurrencyAmount<Currency>, CurrencyAmount<Currency>]
  | [undefined, undefined] {
  const positionManager = useV3NFTPositionManagerContract(chainId);

  const tokenIdHexString = BigNumber.from(tokenId)?.toHexString();

  const ownerResult = useQuery(
    ammV3Api.getOwner(chainId, positionManager, tokenId),
  );

  // we can't use multicall for this because we need to simulate the call from a specific address
  const collectResult = useQuery(
    ammV3Api.getCollect(
      chainId,
      positionManager,
      tokenIdHexString,
      ownerResult.data && Array.isArray(ownerResult.data)
        ? ownerResult.data[0]
        : undefined,
    ),
  );

  if (
    pool &&
    collectResult &&
    collectResult.data &&
    collectResult.data.amount0 &&
    collectResult.data.amount1
  ) {
    return [
      CurrencyAmount.fromRawAmount(
        pool.token0,
        collectResult.data.amount0.toString(),
      ),
      CurrencyAmount.fromRawAmount(
        pool.token1,
        collectResult.data.amount1.toString(),
      ),
    ];
  } else {
    return [undefined, undefined];
  }
}

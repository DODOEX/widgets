import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { ammV3Api } from '../../utils';
import { PositionDetails } from '../types/position';
import { useV3NFTPositionManagerContract } from './useContract';

export interface CallStateResult extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

interface UseV3PositionsResults {
  loading: boolean;
  positions?: PositionDetails[];
}

function useV3PositionsFromTokenIds(
  tokenIds: BigNumber[] | undefined,
  chainId: ChainId,
): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract(chainId);
  const inputs = useMemo(
    () => (tokenIds ? tokenIds.map((tokenId) => [tokenId]) : []),
    [tokenIds],
  );
  const results = useQuery(
    ammV3Api.getPositions(chainId, positionManager, inputs),
  );

  const loading = results.isLoading;
  const error = results.error;

  const positions = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return results.data.map((call, i) => {
        const tokenId = tokenIds[i];
        const result = call.result as CallStateResult;
        return {
          tokenId,
          fee: result.fee,
          feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
          liquidity: result.liquidity,
          nonce: result.nonce,
          operator: result.operator,
          tickLower: result.tickLower,
          tickUpper: result.tickUpper,
          token0: result.token0,
          token1: result.token1,
          tokensOwed0: result.tokensOwed0,
          tokensOwed1: result.tokensOwed1,
        };
      });
    }
    return undefined;
  }, [loading, error, results, tokenIds]);

  return {
    loading,
    positions: positions?.map((position, i) => ({
      ...position,
      tokenId: inputs[i][0],
    })),
  };
}

interface UseV3PositionResults {
  loading: boolean;
  position?: PositionDetails;
}

export function useV3PositionFromTokenId(
  tokenId: BigNumber | undefined,
  chainId: ChainId,
): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(
    tokenId ? [tokenId] : undefined,
    chainId,
  );
  return {
    loading: position.loading,
    position: position.positions?.[0],
  };
}

export function useV3Positions(
  account: string | null | undefined,
  chainId: ChainId,
): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract(chainId);

  const { isLoading: balanceLoading, data: balanceResult } = useQuery(
    ammV3Api.getBalanceOf(chainId, positionManager, account ?? undefined),
  );

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.toNumber();

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = [];
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i]);
      }
      return tokenRequests;
    }
    return [];
  }, [account, accountBalance]);

  const tokenIdResults = useQuery(
    ammV3Api.getTokenOfOwnerByIndex(chainId, positionManager, tokenIdsArgs),
  );
  const someTokenIdsLoading = tokenIdResults.isLoading;

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults.data
        .map(({ result }) => result)
        .filter((result): result is CallStateResult => !!result)
        .map((result) => BigNumber.from(result[0]));
    }
    return [];
  }, [account, tokenIdResults]);

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(
    tokenIds,
    chainId,
  );

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positions,
  };
}

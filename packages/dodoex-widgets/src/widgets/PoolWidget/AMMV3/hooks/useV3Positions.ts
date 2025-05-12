import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ammV3Api } from '../../utils';
import { PositionDetails } from '../types/position';
import { useV3NFTPositionManagerContract } from './useContract';
import { FeeAmount } from '../sdks/v3-sdk';

interface UseV3PositionsResults {
  loading: boolean;
  positions?: PositionDetails[];
}

function useV3PositionsFromTokenIds(
  tokenIds: string[] | undefined,
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

  const positions = useMemo<PositionDetails[] | undefined>(() => {
    if (!loading && !error && tokenIds) {
      return results.data?.map(
        (
          result: {
            fee: FeeAmount;
            feeGrowthInside0LastX128: { toString: () => string };
            feeGrowthInside1LastX128: { toString: () => string };
            liquidity: { toString: () => string };
            nonce: { toString: () => string };
            operator: string;
            tickLower: number;
            tickUpper: number;
            token0: string;
            token1: string;
            tokensOwed0: { toString: () => string };
            tokensOwed1: { toString: () => string };
          },
          i: number,
        ) => {
          const tokenId = tokenIds[i];
          return {
            tokenId,
            fee: result.fee,
            feeGrowthInside0LastX128:
              result.feeGrowthInside0LastX128.toString(),
            feeGrowthInside1LastX128:
              result.feeGrowthInside1LastX128.toString(),
            liquidity: result.liquidity.toString(),
            nonce: result.nonce.toString(),
            operator: result.operator,
            tickLower: result.tickLower,
            tickUpper: result.tickUpper,
            token0: result.token0,
            token1: result.token1,
            tokensOwed0: result.tokensOwed0.toString(),
            tokensOwed1: result.tokensOwed1.toString(),
          };
        },
      );
    }
    return undefined;
  }, [loading, error, results, tokenIds]);

  return {
    loading,
    positions: positions?.map((position: any, i: number) => ({
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
  tokenId: string | undefined,
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

  const tokenIdsArgs = useMemo(() => {
    if (account && balanceResult && balanceResult.isFinite()) {
      const tokenRequests = [];
      for (let i = 0; i < balanceResult.toNumber(); i++) {
        tokenRequests.push([account, i]);
      }
      return tokenRequests;
    }
    return [];
  }, [account, balanceResult]);

  const tokenIdResults = useQuery(
    ammV3Api.getTokenOfOwnerByIndex(chainId, positionManager, tokenIdsArgs),
  );
  const someTokenIdsLoading = tokenIdResults.isLoading;

  const tokenIds = useMemo(() => {
    if (account && tokenIdResults.data) {
      return tokenIdResults.data.map((d: string | any[]) => {
        if (Array.isArray(d) && d.length > 0) {
          return d[0].toString();
        }
      });
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

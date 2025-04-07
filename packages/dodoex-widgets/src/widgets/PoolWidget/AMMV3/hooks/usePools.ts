import { ChainId } from '@dodoex/api';
import { useQueries } from '@tanstack/react-query';
import JSBI from 'jsbi';
import { useMemo } from 'react';
import { ammV3Api } from '../../utils';
import {
  BigintIsh,
  Currency,
  Token,
  V3_CORE_FACTORY_ADDRESSES,
} from '../sdks/sdk-core';
import { FeeAmount, Pool, computePoolAddress } from '../sdks/v3-sdk';

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
export class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128;

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = [];
  private static addresses: { key: string; address: string }[] = [];

  static getPoolAddress(
    factoryAddress: string,
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    chainId: ChainId,
  ): string {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2);
    }

    const { address: addressA } = tokenA;
    const { address: addressB } = tokenB;
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`;
    const found = this.addresses.find((address) => address.key === key);
    if (found) {
      return found.address;
    }

    const address = {
      key,
      address: computePoolAddress({
        factoryAddress,
        tokenA,
        tokenB,
        fee,
        chainId,
      }),
    };
    this.addresses.unshift(address);
    return address.address;
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tick: number,
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2);
    }

    const found = this.pools.find(
      (pool) =>
        pool.token0 === tokenA &&
        pool.token1 === tokenB &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick,
    );
    if (found) {
      return found;
    }

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tick);
    this.pools.unshift(pool);
    return pool;
  }
}

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(
  chainId: number | undefined,
  poolKeys: [
    Currency | undefined,
    Currency | undefined,
    FeeAmount | undefined,
  ][],
): [PoolState, Pool | null][] {
  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    if (!chainId) {
      return new Array(poolKeys.length);
    }

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped;
        const tokenB = currencyB.wrapped;
        if (tokenA.equals(tokenB)) {
          return undefined;
        }

        return tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB, feeAmount]
          : [tokenB, tokenA, feeAmount];
      }
      return undefined;
    });
  }, [chainId, poolKeys]);

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId];
    if (!v3CoreFactoryAddress) {
      return new Array(poolTokens.length);
    }

    return poolTokens.map(
      (value) =>
        value &&
        PoolCache.getPoolAddress(v3CoreFactoryAddress, ...value, chainId),
    );
  }, [chainId, poolTokens]);

  const { data: slot0s } = useQueries({
    queries: poolAddresses.map((poolAddress) => {
      return ammV3Api.getV3PoolSlot0(chainId, poolAddress);
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
      };
    },
  });

  const { data: liquidities } = useQueries({
    queries: poolAddresses.map((poolAddress) => {
      return ammV3Api.getV3PoolLiquidity(chainId, poolAddress);
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
      };
    },
  });

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index];
      if (!tokens) {
        return [PoolState.INVALID, null];
      }
      const [token0, token1, fee] = tokens;

      if (!slot0s[index]) {
        return [PoolState.NOT_EXISTS, null];
      }
      const slot0 = slot0s[index];

      if (!liquidities[index]) {
        return [PoolState.NOT_EXISTS, null];
      }
      const liquidity = liquidities[index];

      if (!slot0 || !liquidity) {
        return [PoolState.NOT_EXISTS, null];
      }

      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) {
        return [PoolState.NOT_EXISTS, null];
      }

      try {
        const pool = PoolCache.getPool(
          token0,
          token1,
          fee,
          slot0.sqrtPriceX96,
          liquidity[0],
          slot0.tick,
        );
        return [PoolState.EXISTS, pool];
      } catch (error) {
        console.error(error, {
          tags: {
            file: 'usePools',
            function: 'usePools',
          },
          extra: {
            token0: token0.address,
            token1: token1.address,
            chainId: token0.chainId,
            fee,
          },
        });
        return [PoolState.NOT_EXISTS, null];
      }
    });
  }, [liquidities, poolKeys, slot0s, poolTokens]);
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
): [PoolState, Pool | null] {
  const poolKeys: [
    Currency | undefined,
    Currency | undefined,
    FeeAmount | undefined,
  ][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount],
  );

  return usePools(currencyA?.chainId, poolKeys)[0];
}

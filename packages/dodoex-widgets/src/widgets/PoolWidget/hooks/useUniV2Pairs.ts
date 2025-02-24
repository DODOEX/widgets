import { Percent } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import React, { useMemo } from 'react';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useRaydiumSDKContext } from '../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { TokenInfo } from '../../../hooks/Token';
import { byWei } from '../../../utils';
interface UniV2PairsResult {
  isFront: boolean;
  poolInfoQuery: any;
  lpBalanceQuery: any;
  lpBalance: BigNumber | undefined;
  lpBalancePercentage: BigNumber | undefined;
  lpToAmountA: BigNumber | undefined;
  lpToAmountB: BigNumber | undefined;
  price: BigNumber | undefined;
  invertedPrice: BigNumber | undefined;
  liquidityMinted: BigNumber | undefined;
  pairMintAAmount: string | undefined;
  pairMintBAmount: string | undefined;
  isExists: boolean;
}

export function useUniV2Pairs({
  pool,
  baseAmount,
  quoteAmount,
  slippage,
}: {
  pool?: {
    address: string;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
  };
  baseAmount?: string;
  quoteAmount?: string;
  slippage: number;
}): UniV2PairsResult {
  const { account } = useWalletInfo();
  const raydium = useRaydiumSDKContext();

  const [mintA, mintB, mintAAmount, mintBAmount, isFront] = useMemo(() => {
    if (!pool?.baseToken || !pool.quoteToken) {
      return [undefined, undefined, undefined, undefined, true];
    }
    const { baseToken, quoteToken } = pool;

    const isFront = new BN(new PublicKey(baseToken.address).toBuffer()).lte(
      new BN(new PublicKey(quoteToken.address).toBuffer()),
    );

    const [mintA, mintB] = isFront
      ? [baseToken, quoteToken]
      : [quoteToken, baseToken];
    const [mintAAmount, mintBAmount] = isFront
      ? [baseAmount, quoteAmount]
      : [quoteAmount, baseAmount];

    return [mintA, mintB, mintAAmount, mintBAmount, isFront];
  }, [baseAmount, pool, quoteAmount]);

  const poolInfoQuery = useQuery({
    queryKey: ['cpmm', 'poolInfo', ...arguments],
    enabled: pool?.address != null,
    queryFn: async () => {
      if (!pool?.address || !raydium) {
        return null;
      }

      const { poolInfo, poolKeys, rpcData } =
        await raydium.cpmm.getPoolInfoFromRpc(pool.address);

      if (!rpcData) {
        return {
          baseReserve: 0,
          quoteReserve: 0,
          lpAmount: 0,
        };
      }

      const [mintASymbol, mintBSymbol] =
        poolInfo.mintA.address.toLowerCase() ===
        pool.baseToken.address.toLowerCase()
          ? [pool.baseToken.symbol, pool.quoteToken.symbol]
          : [pool.quoteToken.symbol, pool.baseToken.symbol];
      const lpAmount = byWei(poolInfo.lpAmount, poolInfo.lpMint.decimals);
      return {
        baseReserve: byWei(
          rpcData.baseReserve.toNumber(),
          poolKeys.mintA.decimals,
        ),
        quoteReserve: byWei(
          rpcData.quoteReserve.toNumber(),
          poolKeys.mintB.decimals,
        ),
        lpAmount,
        lpMint: poolInfo.lpMint,
        poolKeys: {
          ...poolKeys,
          mintA: {
            ...poolKeys.mintA,
            symbol: mintASymbol,
          },
          mintB: {
            ...poolKeys.mintB,
            symbol: mintBSymbol,
          },
        },
        poolInfo: {
          ...poolInfo,
          lpAmount: lpAmount.toNumber(),
          mintA: {
            ...poolInfo.mintA,
            symbol: mintASymbol,
          },
          mintB: {
            ...poolInfo.mintB,
            symbol: mintBSymbol,
          },
        },
        rpcData,
      };
    },
  });

  const lpBalanceQuery = useQuery({
    queryKey: ['cpmm', 'lpBalance', ...arguments],
    enabled: !(
      !account ||
      !poolInfoQuery.data ||
      !poolInfoQuery.data?.lpMint ||
      !poolInfoQuery.data?.lpMint?.address ||
      !poolInfoQuery.data?.lpMint?.decimals
    ),
    queryFn: async () => {
      if (
        !account ||
        !poolInfoQuery.data ||
        !poolInfoQuery.data?.lpMint ||
        !poolInfoQuery.data?.lpMint?.address ||
        !poolInfoQuery.data?.lpMint?.decimals ||
        !raydium
      ) {
        return null;
      }

      await raydium.account.fetchWalletTokenAccounts();
      const poolId = poolInfoQuery.data.lpMint.address;
      const lpBalance = raydium.account.tokenAccounts.find(
        (a) => a.mint.toBase58() === poolId,
      );
      if (!lpBalance)
        throw new Error(`you do not have balance in pool: ${poolId}`);

      return byWei(
        lpBalance.amount.toNumber(),
        poolInfoQuery.data.lpMint.decimals,
      );
    },
  });

  const pairAmountQuery = useQuery({
    queryKey: ['cpmm', 'pairAmount', ...arguments],
    enabled: !(
      !poolInfoQuery.data ||
      !poolInfoQuery.data?.poolInfo ||
      !mintAAmount
    ),
    queryFn: async () => {
      if (
        !poolInfoQuery.data ||
        !poolInfoQuery.data?.poolInfo ||
        !mintAAmount ||
        !raydium
      ) {
        return null;
      }

      const poolInfo = poolInfoQuery.data.poolInfo;
      const baseIn = true;
      const computeRes = await raydium.cpmm.computePairAmount({
        baseReserve: poolInfoQuery.data.rpcData.baseReserve,
        quoteReserve: poolInfoQuery.data.rpcData.quoteReserve,
        poolInfo,
        amount: mintAAmount,
        slippage: new Percent(slippage * 100 * 100, 100 * 100),
        baseIn,
        epochInfo: await raydium.fetchEpochInfo(),
      });

      return {
        pairMintAAmount: mintAAmount,
        pairMintBAmount: byWei(
          computeRes.anotherAmount.amount.toString(),
          poolInfo.mintB.decimals,
        ).toString(),
        liquidityMinted: byWei(
          computeRes.liquidity.toString(),
          poolInfo.lpMint.decimals,
        ),
      };
    },
  });

  const [lpBalance, lpBalancePercentage, lpToAmountA, lpToAmountB] =
    useMemo(() => {
      if (!poolInfoQuery.data || !lpBalanceQuery.data) {
        return [undefined, undefined, undefined, undefined];
      }
      const { baseReserve, quoteReserve, lpAmount } = poolInfoQuery.data;
      const lpBalance = lpBalanceQuery.data;
      const lpBalancePercentage = lpBalance.div(lpAmount);
      const lpToAmountA = lpBalance.multipliedBy(baseReserve).div(lpAmount);
      const lpToAmountB = lpBalance.multipliedBy(quoteReserve).div(lpAmount);
      return [lpBalance, lpBalancePercentage, lpToAmountA, lpToAmountB];
    }, [poolInfoQuery.data, lpBalanceQuery.data]);

  const isExists = React.useMemo(
    () => poolInfoQuery.isFetched && poolInfoQuery.data != null,
    [poolInfoQuery.isFetched, poolInfoQuery.data],
  );

  const [priceBg, invertedPriceBg] = React.useMemo(() => {
    if (isExists) {
      if (poolInfoQuery.data?.poolInfo?.price != null) {
        const poolPrice = new BigNumber(poolInfoQuery.data.poolInfo.price);
        return [poolPrice, new BigNumber(1).div(poolPrice)];
      }
      return [undefined, undefined];
    }
    if (!baseAmount || !quoteAmount) {
      return [undefined, undefined];
    }
    return [
      new BigNumber(quoteAmount).div(baseAmount),
      new BigNumber(baseAmount).div(quoteAmount),
    ];
  }, [baseAmount, isExists, poolInfoQuery.data?.poolInfo?.price, quoteAmount]);

  return {
    isFront,

    // 池子已存在是查询的数据
    poolInfoQuery,
    lpBalanceQuery,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,

    price: priceBg,
    invertedPrice: invertedPriceBg,

    // 新添加或创建
    liquidityMinted: pairAmountQuery.data?.liquidityMinted,
    pairMintAAmount: pairAmountQuery.data?.pairMintAAmount,
    pairMintBAmount: pairAmountQuery.data?.pairMintBAmount,
    isExists,
  };
}

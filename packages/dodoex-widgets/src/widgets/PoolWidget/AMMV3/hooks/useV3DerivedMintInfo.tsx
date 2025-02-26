import { ChainId } from '@dodoex/api';
import { t } from '@lingui/macro';
import {
  MAX_SQRT_PRICE_X64,
  MAX_TICK,
  MIN_SQRT_PRICE_X64,
  MIN_TICK,
  PoolUtils,
  SqrtPriceMath,
  toApiV3Token,
} from '@raydium-io/raydium-sdk-v2';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { clmmConfigMap } from '../../../../hooks/raydium-sdk-V2/common/programId';
import { useRaydiumSDKContext } from '../../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { TokenInfo } from '../../../../hooks/Token/type';
import { StateProps } from '../reducer';
import { nearestUsableTick, TICK_SPACINGS } from '../sdks/v3-sdk';
import { Bound, Field, PoolInfoI, PositionI } from '../types';
import { priceToTick } from '../utils/priceToTick';
import { tickToPrice } from '../utils/tickToPrice';
import { transformStrToBN } from '../utils/tryParseCurrencyAmount';
import { PoolState, usePool } from './usePool';
import { useSwapTaxes } from './useSwapTaxes';
import { useTokenBalance } from './useTokenBalance';

export function useV3DerivedMintInfo({
  state,
  existingPosition,
}: {
  state: StateProps;
  // override for existing position
  existingPosition?: PositionI;
}): {
  mintA: TokenInfo | undefined;
  mintB: TokenInfo | undefined;
  poolInfo: PoolInfoI | undefined;
  poolState: PoolState;
  ticks: { [bound in Bound]?: number | undefined };
  price: BigNumber | undefined;
  pricesAtTicks: {
    [bound in Bound]?: BigNumber | undefined;
  };
  pricesAtLimit: {
    [bound in Bound]?: BigNumber | undefined;
  };
  mints: { [field in Field]?: Maybe<TokenInfo> };
  mintBalances: { [field in Field]?: BigNumber | undefined };
  dependentField: Field;
  parsedAmounts: { [field in Field]?: BigNumber | undefined };
  position?: PositionI;
  noLiquidity?: boolean;
  errorMessage?: ReactNode;
  invalidPool: boolean;
  outOfRange: boolean;
  invalidRange: boolean;
  depositADisabled: boolean;
  depositBDisabled: boolean;
  invertPrice: boolean;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  isTaxed: boolean;
} {
  const { account, chainId } = useWalletInfo();
  const raydium = useRaydiumSDKContext();

  const {
    feeAmount,
    independentField,
    typedValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    startPriceTypedValue,
  } = state;
  // 用户输入的 mint1 和 mint2
  const { mint1, mint2 } = state;

  const dependentField =
    independentField === Field.MINT_1 ? Field.MINT_2 : Field.MINT_1;

  // currencies
  const mints: { [field in Field]: Maybe<TokenInfo> } = useMemo(
    () => ({
      [Field.MINT_1]: mint1,
      [Field.MINT_2]: mint2,
    }),
    [mint1, mint2],
  );

  // balances
  const mint1Balance = useTokenBalance({
    mint: mints[Field.MINT_1]?.address,
    chainId: mints[Field.MINT_1]?.chainId as ChainId,
  });
  const mint2Balance = useTokenBalance({
    mint: mints[Field.MINT_2]?.address,
    chainId: mints[Field.MINT_2]?.chainId as ChainId,
  });

  const mintBalances: { [field in Field]: BigNumber | undefined } =
    useMemo(() => {
      return {
        [Field.MINT_1]: mint1Balance,
        [Field.MINT_2]: mint2Balance,
      };
    }, [mint1Balance, mint2Balance]);

  // pool
  const [poolState, pool, poolId] = usePool(
    mints[Field.MINT_1]?.address,
    mints[Field.MINT_2]?.address,
    feeAmount,
    chainId,
  );
  const noLiquidity = poolState === PoolState.NOT_EXISTS;

  // clmm 中 mint 的实际顺序
  const [mintA, mintB] = useMemo(() => {
    if (!mint1 || !mint2) {
      return [undefined, undefined];
    }

    return new BN(new PublicKey(mint1.address).toBuffer()).gt(
      new BN(new PublicKey(mint2.address).toBuffer()),
    )
      ? [mint2, mint1]
      : [mint1, mint2];
  }, [mint1, mint2]);

  // note to parse inputs in reverse
  // 实际创建的 clmm 中的 mintA 和 mintB 的顺序可能和 mint1 和 mint2 的顺序不一致
  const invertPrice = Boolean(
    mint1 &&
      mintA &&
      !new PublicKey(mint1.address).equals(new PublicKey(mintA.address)),
  );

  // always returns the price with 0 as base token
  const price: BigNumber | undefined = useMemo(() => {
    // if no liquidity use typed value
    if (noLiquidity) {
      const parsedQuoteAmount = transformStrToBN(startPriceTypedValue);
      if (parsedQuoteAmount && mintA && mintB) {
        const baseAmount = new BigNumber(1);
        const price =
          baseAmount && parsedQuoteAmount
            ? parsedQuoteAmount.dividedBy(baseAmount)
            : undefined;
        return price
          ? invertPrice
            ? new BigNumber(1).div(price)
            : price
          : undefined;
      }
      return undefined;
    } else {
      // get the amount of quote currency
      return pool ? new BigNumber(pool.poolInfo.price) : undefined;
    }
  }, [invertPrice, mintA, mintB, noLiquidity, pool, startPriceTypedValue]);

  // check for invalid price input (converts to invalid ratio)
  const invalidPrice = useMemo(() => {
    if (!price || mintA?.decimals == null || mintB?.decimals == null) {
      return true;
    }

    const sqrtPriceX64 = SqrtPriceMath.priceToSqrtPriceX64(
      new Decimal(price.toString()),
      mintA?.decimals,
      mintB?.decimals,
    );

    if (
      !sqrtPriceX64 ||
      sqrtPriceX64.gt(MAX_SQRT_PRICE_X64) ||
      sqrtPriceX64.lt(MIN_SQRT_PRICE_X64)
    ) {
      return true;
    }

    return false;
  }, [price, mintA, mintB]);

  // used for ratio calculation when pool not initialized
  const poolInfo = useMemo<PoolInfoI | undefined>(() => {
    if (!mintA || !mintB) {
      return undefined;
    }

    // if pool exists use it, if not use the mock pool
    if (pool) {
      const existedPoolInfo: PoolInfoI = {
        ...pool.poolInfo,
        mintA: {
          ...pool.poolInfo.mintA,
          chainId: mintA.chainId,
          symbol: mintA.symbol,
        },
        mintB: {
          ...pool.poolInfo.mintB,
          chainId: mintB.chainId,
          symbol: mintB.symbol,
        },
        tickCurrent: pool.computePoolInfo.tickCurrent,
      };
      return existedPoolInfo;
    }

    if (feeAmount && price && !invalidPrice && poolId) {
      const clmmConfig = clmmConfigMap[chainId];

      if (!clmmConfig) {
        throw new Error('Invalid config');
      }

      const feeConfig = clmmConfig.config.find(
        (config) => config.tradeFeeRate === feeAmount,
      );

      if (!feeConfig) {
        throw new Error('Invalid fee');
      }

      const tickCurrent = priceToTick({
        decimalsA: mintA.decimals,
        decimalsB: mintB.decimals,
        feeAmount,
        price: price.toString(),
      });

      if (!tickCurrent) {
        throw new Error('Invalid tick');
      }

      const mockPoolInfo: PoolInfoI = {
        type: 'Concentrated',
        config: feeConfig,
        programId: clmmConfig.programId.toBase58(),
        id: poolId,
        mintA: {
          ...toApiV3Token({
            address: mintA.address,
            decimals: mintA.decimals,
            programId: TOKEN_PROGRAM_ID.toBase58(),
            extensions: {
              feeConfig: undefined,
            },
          }),
          chainId: mintA.chainId,
          symbol: mintA.symbol,
        },
        mintB: {
          ...toApiV3Token({
            address: mintB.address,
            decimals: mintB.decimals,
            programId: TOKEN_PROGRAM_ID.toBase58(),
            extensions: {
              feeConfig: undefined,
            },
          }),
          chainId: mintB.chainId,
          symbol: mintB.symbol,
        },
        rewardDefaultInfos: [],
        rewardDefaultPoolInfos: 'Clmm',
        price: price.toNumber(),
        tickCurrent,
        mintAmountA: 0,
        mintAmountB: 0,
        feeRate: 0,
        openTime: '',
        tvl: 0,
        day: {
          volume: 0,
          volumeQuote: 0,
          volumeFee: 0,
          feeApr: 0,
          rewardApr: [0],
          apr: 0,
          priceMax: 0,
          priceMin: 0,
        },
        week: {
          volume: 0,
          volumeQuote: 0,
          volumeFee: 0,
          feeApr: 0,
          rewardApr: [0],
          apr: 0,
          priceMax: 0,
          priceMin: 0,
        },
        month: {
          volume: 0,
          volumeQuote: 0,
          volumeFee: 0,
          feeApr: 0,
          rewardApr: [0],
          apr: 0,
          priceMax: 0,
          priceMin: 0,
        },
        pooltype: [],
        farmUpcomingCount: 0,
        farmOngoingCount: 0,
        farmFinishedCount: 0,
        burnPercent: 0,
      };

      return mockPoolInfo;
    }

    return undefined;
  }, [chainId, feeAmount, invalidPrice, mintA, mintB, pool, poolId, price]);

  // lower and upper limits in the tick space for `feeAmount`
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount
        ? nearestUsableTick(MIN_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
      [Bound.UPPER]: feeAmount
        ? nearestUsableTick(MAX_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
    }),
    [feeAmount],
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const ticks = useMemo(() => {
    return {
      [Bound.LOWER]:
        typeof existingPosition?.tickLower === 'number'
          ? existingPosition.tickLower
          : (invertPrice && typeof rightRangeTypedValue === 'boolean') ||
              (!invertPrice && typeof leftRangeTypedValue === 'boolean')
            ? tickSpaceLimits[Bound.LOWER]
            : invertPrice
              ? priceToTick({
                  decimalsA: mintA?.decimals,
                  decimalsB: mintB?.decimals,
                  feeAmount,
                  price: rightRangeTypedValue.toString(),
                })
              : priceToTick({
                  decimalsA: mintB?.decimals,
                  decimalsB: mintA?.decimals,
                  feeAmount,
                  price: leftRangeTypedValue.toString(),
                }),
      [Bound.UPPER]:
        typeof existingPosition?.tickUpper === 'number'
          ? existingPosition.tickUpper
          : (!invertPrice && typeof rightRangeTypedValue === 'boolean') ||
              (invertPrice && typeof leftRangeTypedValue === 'boolean')
            ? tickSpaceLimits[Bound.UPPER]
            : invertPrice
              ? priceToTick({
                  decimalsA: mintA?.decimals,
                  decimalsB: mintB?.decimals,
                  feeAmount,
                  price: leftRangeTypedValue.toString(),
                })
              : priceToTick({
                  decimalsA: mintB?.decimals,
                  decimalsB: mintA?.decimals,
                  feeAmount,
                  price: rightRangeTypedValue.toString(),
                }),
    };
  }, [
    existingPosition?.tickLower,
    existingPosition?.tickUpper,
    feeAmount,
    invertPrice,
    leftRangeTypedValue,
    mintA?.decimals,
    mintB?.decimals,
    rightRangeTypedValue,
    tickSpaceLimits,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]: feeAmount && tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: feeAmount && tickUpper === tickSpaceLimits.UPPER,
    };
  }, [tickSpaceLimits, tickLower, tickUpper, feeAmount]);

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      tickLower >= tickUpper,
  );

  const pricesAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]: tickToPrice({
        tick: tickSpaceLimits.LOWER,
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
      [Bound.UPPER]: tickToPrice({
        tick: tickSpaceLimits.UPPER,
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
    };
  }, [
    mintA?.decimals,
    mintB?.decimals,
    tickSpaceLimits.LOWER,
    tickSpaceLimits.UPPER,
  ]);

  // always returns the price with 0 as base token
  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]: tickToPrice({
        tick: ticks[Bound.LOWER],
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
      [Bound.UPPER]: tickToPrice({
        tick: ticks[Bound.UPPER],
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
    };
  }, [mintA?.decimals, mintB?.decimals, ticks]);

  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } =
    pricesAtTicks;

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lt(lowerPrice) || price.gt(upperPrice)),
  );

  // amounts
  const independentAmount: BigNumber | undefined = useMemo(() => {
    return transformStrToBN(typedValue);
  }, [typedValue]);
  const [dependentAmount, setDependentAmount] = useState<BigNumber | undefined>(
    undefined,
  );
  useEffect(() => {
    let mounted = true;
    // const [independentMint, dependentMint] =
    //   dependentField === Field.MINT_2 ? [mint1, mint2] : [mint2, mint1];

    async function computeDependentAmount() {
      if (!raydium || !poolInfo || tickLower == null || tickUpper == null) {
        return;
      }

      const epochInfo = await raydium.fetchEpochInfo();
      const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
        poolInfo: poolInfo,
        slippage: 0,
        inputA: true,
        tickUpper: Math.max(tickLower, tickUpper),
        tickLower: Math.min(tickLower, tickUpper),
        amount: new BN(
          new Decimal(typedValue || '0')
            .mul(10 ** poolInfo.mintA.decimals)
            .toFixed(0),
        ),
        add: true,
        amountHasFee: true,
        epochInfo: epochInfo,
      });

      if (mounted) {
        console.log('res', res);
      }
    }

    computeDependentAmount();

    // if (
    //   independentMint &&
    //   independentAmount &&
    //   typeof tickLower === 'number' &&
    //   typeof tickUpper === 'number' &&
    //   poolForPosition
    // ) {
    //   // if price is out of range or invalid range - return 0 (single deposit will be independent)
    //   if (outOfRange || invalidRange) {
    //     return undefined;
    //   }

    //   const independentMintIsMintA = new PublicKey(
    //     independentMint.address,
    //   ).equals(new PublicKey(poolForPosition.mintA.address));

    //   const position: Position | undefined = independentMintIsMintA
    //     ? Position.fromAmount0({
    //         pool: poolForPosition,
    //         tickLower,
    //         tickUpper,
    //         amount0: independentAmount.quotient,
    //         useFullPrecision: true, // we want full precision for the theoretical position
    //       })
    //     : Position.fromAmount1({
    //         pool: poolForPosition,
    //         tickLower,
    //         tickUpper,
    //         amount1: independentAmount.quotient,
    //       });

    //   const dependentTokenAmount = independentMintIsMintA
    //     ? position.amount1
    //     : position.amount0;

    //   setDependentAmount(
    //     dependentMint &&
    //       CurrencyAmount.fromRawAmount(
    //         dependentMint,
    //         dependentTokenAmount.quotient,
    //       ),
    //   );
    // }

    return () => {
      mounted = false;
    };
  }, [poolInfo, raydium, tickLower, tickUpper, typedValue]);

  const parsedAmounts: {
    [field in Field]: BigNumber | undefined;
  } = useMemo(() => {
    return {
      [Field.MINT_1]:
        independentField === Field.MINT_1 ? independentAmount : dependentAmount,
      [Field.MINT_2]:
        independentField === Field.MINT_1 ? dependentAmount : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === 'number' &&
      poolInfo?.tickCurrent &&
      poolInfo.tickCurrent >= tickUpper,
  );
  const deposit1Disabled = Boolean(
    typeof tickLower === 'number' &&
      poolInfo?.tickCurrent &&
      poolInfo.tickCurrent <= tickLower,
  );

  // const independentMintIsMintA = new PublicKey(independentMint.address).equals(
  //   new PublicKey(poolInfo.mintA.address),
  // );
  // sorted for token order
  const depositADisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolInfo &&
        mint1 &&
        new PublicKey(poolInfo.mintA.address).equals(
          new PublicKey(mint1.address),
        )) ||
        (deposit1Disabled &&
          poolInfo &&
          mint2 &&
          new PublicKey(poolInfo.mintA.address).equals(
            new PublicKey(mint2.address),
          )),
    );
  const depositBDisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolInfo &&
        mint2 &&
        new PublicKey(poolInfo.mintA.address).equals(
          new PublicKey(mint2.address),
        )) ||
        (deposit1Disabled &&
          poolInfo &&
          mint1 &&
          new PublicKey(poolInfo.mintB.address).equals(
            new PublicKey(mint1.address),
          )),
    );

  const { inputTax: currencyATax, outputTax: currencyBTax } = useSwapTaxes();

  // create position entity based on users selection
  const [position, setPosition] = useState<PositionI>();
  useEffect(() => {
    let mounted = true;
    async function computeDependentAmount() {
      if (!raydium || !poolInfo || tickLower == null || tickUpper == null) {
        return;
      }

      const epochInfo = await raydium.fetchEpochInfo();
      const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
        poolInfo: poolInfo,
        slippage: 0,
        inputA: true,
        tickUpper: Math.max(tickLower, tickUpper),
        tickLower: Math.min(tickLower, tickUpper),
        amount: new BN(
          new Decimal(typedValue || '0')
            .mul(10 ** poolInfo.mintA.decimals)
            .toFixed(0),
        ),
        add: true,
        amountHasFee: true,
        epochInfo: epochInfo,
      });

      if (mounted) {
        console.log('res', res);
        pricesAtTicks;
        setPosition({
          poolInfo,
          tickLower,
          tickUpper,
          tickLowerPrice: lowerPrice,
          tickUpperPrice: upperPrice,
          liquidity: new BigNumber(res.liquidity.toString()),
          amountA: new BigNumber(res.amountA.toString()),
          amountB: new BigNumber(res.amountB.toString()),
        });
      }
    }

    computeDependentAmount();

    return () => {
      mounted = false;
    };
  }, [
    lowerPrice,
    poolInfo,
    pricesAtTicks,
    raydium,
    tickLower,
    tickUpper,
    typedValue,
    upperPrice,
  ]);

  // const position: Position | undefined = useMemo(() => {
  //   if (
  //     !poolInfo ||
  //     !tokenA ||
  //     !tokenB ||
  //     typeof tickLower !== 'number' ||
  //     typeof tickUpper !== 'number' ||
  //     invalidRange
  //   ) {
  //     return undefined;
  //   }

  //   // mark as 0 if disabled because out of range
  //   const amount0 = !deposit0Disabled
  //     ? parsedAmounts?.[
  //         tokenA.equals(poolInfo.token0) ? Field.MINT_1 : Field.MINT_2
  //       ]?.quotient
  //     : BIG_INT_ZERO;
  //   const amount1 = !deposit1Disabled
  //     ? parsedAmounts?.[
  //         tokenA.equals(poolInfo.token0) ? Field.MINT_2 : Field.MINT_1
  //       ]?.quotient
  //     : BIG_INT_ZERO;

  //   if (amount0 !== undefined && amount1 !== undefined) {
  //     return Position.fromAmounts({
  //       pool: poolInfo,
  //       tickLower,
  //       tickUpper,
  //       amount0,
  //       amount1,
  //       useFullPrecision: true, // we want full precision for the theoretical position
  //     });
  //   } else {
  //     return undefined;
  //   }
  // }, [
  //   parsedAmounts,
  //   poolInfo,
  //   tokenA,
  //   tokenB,
  //   deposit0Disabled,
  //   deposit1Disabled,
  //   invalidRange,
  //   tickLower,
  //   tickUpper,
  // ]);

  let errorMessage: ReactNode | undefined;
  if (!account) {
    errorMessage = t`Connect to a wallet`;
  }

  if (poolState === PoolState.INVALID) {
    errorMessage = errorMessage ?? t`Invalid pair`;
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? t`Invalid price input`;
  }

  if (
    (!parsedAmounts[Field.MINT_1] && !depositADisabled) ||
    (!parsedAmounts[Field.MINT_2] && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? t`Enter an amount`;
  }

  const { [Field.MINT_1]: mint1Amount, [Field.MINT_2]: mint2Amount } =
    parsedAmounts;

  if (mint1Amount && mintBalances?.[Field.MINT_1]?.lt(mint1Amount)) {
    errorMessage = t`Insufficient ${mints[Field.MINT_1]?.symbol} balance`;
  }

  if (mint2Amount && mintBalances?.[Field.MINT_2]?.lt(mint2Amount)) {
    errorMessage = t`Insufficient ${mints[Field.MINT_2]?.symbol} balance`;
  }

  const isTaxed = currencyATax.greaterThan(0) || currencyBTax.greaterThan(0);
  const invalidPool = poolState === PoolState.INVALID || isTaxed;

  return {
    mintA,
    mintB,
    dependentField,
    mints,
    poolInfo,
    poolState,
    mintBalances,
    parsedAmounts,
    ticks,
    price,
    pricesAtTicks,
    pricesAtLimit,
    position,
    noLiquidity,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    isTaxed,
  };
}

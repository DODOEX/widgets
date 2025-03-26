import { ChainId } from '@dodoex/api';
import { t } from '@lingui/macro';
import {
  MAX_SQRT_PRICE_X64,
  MAX_TICK,
  MIN_SQRT_PRICE_X64,
  MIN_TICK,
  PoolUtils,
  PositionInfoLayout,
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
import { StateProps } from '../reducer';
import { TICK_SPACINGS } from '../sdks/v3-sdk/constants';
import { nearestUsableTick } from '../sdks/v3-sdk/utils/nearestUsableTick';
import { Bound, Field, PoolInfoI, PositionI } from '../types';
import { getPriceAndTick } from '../utils/getPriceAndTick';
import { getTickPrice } from '../utils/getTickPrice';
import { transformStrToBN } from '../utils/tryParseCurrencyAmount';
import { PoolState, usePool } from './usePool';
import { useSwapTaxes } from './useSwapTaxes';
import { useTokenBalance } from './useTokenBalance';

export function useV3DerivedMintInfo({
  state,
  existingPosition,
  slipperValue,
}: {
  state: StateProps;
  // override for existing position
  existingPosition: ReturnType<typeof PositionInfoLayout.decode> | undefined;
  slipperValue: number;
}) {
  const { account, chainId } = useWalletInfo();
  const raydium = useRaydiumSDKContext();

  const {
    feeAmount,
    selectedMintIndex,
    independentField,
    typedValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    startPriceTypedValue,
  } = state;
  // 用户输入的 mint1 和 mint2
  const { mint1, mint2 } = state;

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

  const dependentField =
    independentField === Field.DEPOSIT_1 ? Field.DEPOSIT_2 : Field.DEPOSIT_1;

  const [deposit1, deposit2] = useMemo(() => {
    if (!mintA || !mintB) {
      return [undefined, undefined];
    }

    return selectedMintIndex == 0 ? [mintA, mintB] : [mintB, mintA];
  }, [mintA, mintB, selectedMintIndex]);

  // balances
  const deposit1Balance = useTokenBalance({
    mint: deposit1?.address,
  });
  const deposit2Balance = useTokenBalance({
    mint: deposit2?.address,
  });

  const depositBalances: { [field in Field]: BigNumber | undefined } =
    useMemo(() => {
      return {
        [Field.DEPOSIT_1]: deposit1Balance,
        [Field.DEPOSIT_2]: deposit2Balance,
      };
    }, [deposit1Balance, deposit2Balance]);

  // pool
  const [poolState, pool, poolId] = usePool(
    mint1?.address,
    mint2?.address,
    feeAmount,
    chainId,
  );
  const poolIsNoExisted = poolState === PoolState.NOT_EXISTS;

  // 转换为实际池子中的价格，即统一为 ? mintB per mintA
  const price: BigNumber | undefined = useMemo(() => {
    if (!mintB) {
      return undefined;
    }
    // if no liquidity use typed value
    if (poolIsNoExisted) {
      const startingPriceBN = transformStrToBN(startPriceTypedValue);

      if (!startingPriceBN) {
        return undefined;
      }

      if (selectedMintIndex === 0) {
        return startingPriceBN;
      }

      return new BigNumber(1)
        .div(startingPriceBN)
        .dp(mintB.decimals, BigNumber.ROUND_UP);
    }

    // 如果池子存在，则返回池子的价格
    // 池子中的价格是按照 ? mintB per mintA 计算的，即 selectedMintIndex === 0
    if (!pool || pool.poolInfo.price == null) {
      return undefined;
    }
    const numMintBPerMintA = new BigNumber(pool.poolInfo.price);
    return numMintBPerMintA;
  }, [mintB, poolIsNoExisted, pool, startPriceTypedValue, selectedMintIndex]);

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

      const { tick: tickCurrent } = getPriceAndTick({
        mintDecimalsA: mintA.decimals,
        mintDecimalsB: mintB.decimals,
        feeAmount,
        price,
        baseIn: selectedMintIndex === 0,
      });

      if (tickCurrent == null) {
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
        feeRate: feeConfig.tradeFeeRate,
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
  }, [
    chainId,
    feeAmount,
    invalidPrice,
    mintA,
    mintB,
    pool,
    poolId,
    price,
    selectedMintIndex,
  ]);

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
    if (
      existingPosition &&
      existingPosition.tickLower &&
      typeof existingPosition?.tickLower === 'number' &&
      existingPosition.tickUpper &&
      typeof existingPosition?.tickUpper === 'number'
    ) {
      return {
        [Bound.LOWER]: existingPosition.tickLower,
        [Bound.UPPER]: existingPosition.tickUpper,
      };
    }

    if (!mintA || !mintB || !feeAmount) {
      return {
        [Bound.LOWER]: undefined,
        [Bound.UPPER]: undefined,
      };
    }

    const leftRangeTypedValueBN =
      typeof leftRangeTypedValue === 'boolean'
        ? undefined
        : transformStrToBN(leftRangeTypedValue);
    const rightRangeTypedValueBN =
      typeof rightRangeTypedValue === 'boolean'
        ? undefined
        : transformStrToBN(rightRangeTypedValue);
    const baseIn = selectedMintIndex === 0;
    return {
      [Bound.LOWER]:
        typeof leftRangeTypedValue === 'boolean'
          ? tickSpaceLimits[Bound.LOWER]
          : leftRangeTypedValueBN
            ? getPriceAndTick({
                mintDecimalsA: mintA.decimals,
                mintDecimalsB: mintB.decimals,
                feeAmount,
                price: leftRangeTypedValueBN,
                baseIn,
              }).tick
            : undefined,
      [Bound.UPPER]:
        typeof rightRangeTypedValue === 'boolean'
          ? tickSpaceLimits[Bound.UPPER]
          : rightRangeTypedValueBN
            ? getPriceAndTick({
                mintDecimalsA: mintA.decimals,
                mintDecimalsB: mintB.decimals,
                feeAmount,
                price: rightRangeTypedValueBN,
                baseIn,
              }).tick
            : undefined,
    };
  }, [
    existingPosition,
    feeAmount,
    leftRangeTypedValue,
    mintA,
    mintB,
    rightRangeTypedValue,
    selectedMintIndex,
    tickSpaceLimits,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;

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
      [Bound.LOWER]: getTickPrice({
        tick: tickSpaceLimits.LOWER,
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
      [Bound.UPPER]: getTickPrice({
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
      [Bound.LOWER]: getTickPrice({
        tick: ticks[Bound.LOWER],
        decimalsA: mintA?.decimals,
        decimalsB: mintB?.decimals,
      }),
      [Bound.UPPER]: getTickPrice({
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
      try {
        if (!raydium || !poolInfo || tickLower == null || tickUpper == null) {
          return;
        }

        // console.log('tickLower', tickLower);
        // console.log('tickUpper', tickUpper);
        // console.log('typedValue', typedValue);
        // console.log('slipperValue', slipperValue);
        // console.log('poolInfo', poolInfo);
        const epochInfo = await raydium.fetchEpochInfo();
        const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
          poolInfo: poolInfo,
          slippage: slipperValue,
          inputA: true,
          tickLower: Math.min(tickLower, tickUpper),
          tickUpper: Math.max(tickLower, tickUpper),
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
          // console.log(
          //   'res getLiquidityAmountOutFromAmountIn',
          //   JSON.stringify(res),
          // );
          // console.log(
          //   'res amountSlippageA',
          //   res.amountSlippageA.amount.toString(),
          // );
          // console.log(
          //   'res amountSlippageB',
          //   res.amountSlippageB.amount.toString(),
          // );
          if (!res.amountSlippageB.amount) {
            return;
          }
          setDependentAmount(
            new BigNumber(res.amountSlippageB.amount.toString())
              .div(new BigNumber(10 ** poolInfo.mintB.decimals))
              .dp(poolInfo.mintB.decimals, BigNumber.ROUND_UP),
          );
        }
      } catch (error) {
        console.error('error', error);
      }
    }

    computeDependentAmount();

    return () => {
      mounted = false;
    };
  }, [poolInfo, raydium, slipperValue, tickLower, tickUpper, typedValue]);

  const parsedAmounts: {
    [field in Field]: BigNumber | undefined;
  } = useMemo(() => {
    return {
      [Field.DEPOSIT_1]:
        independentField === Field.DEPOSIT_1
          ? independentAmount
          : dependentAmount,
      [Field.DEPOSIT_2]:
        independentField === Field.DEPOSIT_1
          ? dependentAmount
          : independentAmount,
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
      try {
        if (!raydium || !poolInfo || tickLower == null || tickUpper == null) {
          return;
        }

        const epochInfo = await raydium.fetchEpochInfo();
        const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
          poolInfo: poolInfo,
          slippage: slipperValue,
          inputA: true,
          tickLower: Math.min(tickLower, tickUpper),
          tickUpper: Math.max(tickLower, tickUpper),
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
          // console.log('res getLiquidityAmountOutFromAmountIn', res);
          pricesAtTicks;
          setPosition({
            poolInfo,
            tickLower,
            tickUpper,
            tickLowerPrice: lowerPrice,
            tickUpperPrice: upperPrice,
            liquidity: new BigNumber(res.liquidity.toString()),
            amountA: new BigNumber(res.amountSlippageA.amount.toString())
              .div(new BigNumber(10 ** poolInfo.mintA.decimals))
              .dp(poolInfo.mintA.decimals, BigNumber.ROUND_UP),
            amountB: new BigNumber(res.amountSlippageB.amount.toString())
              .div(new BigNumber(10 ** poolInfo.mintB.decimals))
              .dp(poolInfo.mintB.decimals, BigNumber.ROUND_UP),
          });
        }
      } catch (error) {
        console.error('error', error);
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
    slipperValue,
    tickLower,
    tickUpper,
    typedValue,
    upperPrice,
  ]);

  let errorMessage: ReactNode | undefined;
  if (!account) {
    errorMessage = t`Connect to a wallet`;
  }

  if (
    poolState === PoolState.INVALID ||
    poolInfo?.mintA.address === poolInfo?.mintB.address
  ) {
    errorMessage = errorMessage ?? t`Invalid pair`;
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? t`Invalid price input`;
  }

  if (
    (!parsedAmounts[Field.DEPOSIT_1] && !depositADisabled) ||
    (!parsedAmounts[Field.DEPOSIT_2] && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? t`Enter an amount`;
  }

  const {
    [Field.DEPOSIT_1]: deposit1Amount,
    [Field.DEPOSIT_2]: deposit2Amount,
  } = parsedAmounts;

  if (deposit1Amount && deposit1Balance?.lt(deposit1Amount)) {
    errorMessage = t`Insufficient ${deposit1?.symbol} balance`;
  }

  if (deposit2Amount && deposit2Balance?.lt(deposit2Amount)) {
    errorMessage = t`Insufficient ${deposit2?.symbol} balance`;
  }

  const isTaxed = currencyATax.greaterThan(0) || currencyBTax.greaterThan(0);
  const invalidPool = poolState === PoolState.INVALID || isTaxed;

  return {
    mintA,
    mintB,
    dependentField,
    mints: {
      [Field.DEPOSIT_1]: deposit1,
      [Field.DEPOSIT_2]: deposit2,
    },
    poolInfo,
    poolState,
    depositBalances,
    parsedAmounts,
    ticks,
    price,
    pricesAtTicks,
    pricesAtLimit,
    position,
    poolIsNoExisted,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
    isTaxed,
    poolKeys: poolIsNoExisted ? undefined : pool?.poolKeys,
  };
}

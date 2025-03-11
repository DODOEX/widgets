import BigNumber from 'bignumber.js';
import React from 'react';
import { AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION } from '../../../../constants/pool';
import { AUTO_SWAP_SLIPPAGE_PROTECTION } from '../../../../constants/swap';
import { fixedInputStringToFormattedNumber } from '../../../../utils/formatter';
import { useUniV2Pairs } from '../../hooks/useUniV2Pairs';
import { OperatePool } from '../types';

export function useLiquidityOperateAmount({
  pool,
  maxBaseAmount,
  maxQuoteAmount,
  isRemove,
}: {
  pool: OperatePool;
  maxBaseAmount?: BigNumber | null;
  maxQuoteAmount?: BigNumber | null;
  isRemove?: boolean;
}) {
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');
  const [slippage, setSlippage] = React.useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);
  const slippageNumber =
    slippage === AUTO_SWAP_SLIPPAGE_PROTECTION
      ? new BigNumber(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)
          .div(100)
          .toNumber()
      : slippage;

  const reset = () => {
    setBaseAmount('');
    setQuoteAmount('');
  };

  const uniV2Pair = useUniV2Pairs({
    pool:
      pool?.baseToken && pool.quoteToken
        ? {
            baseToken: pool.baseToken,
            quoteToken: pool.quoteToken,
            address: pool.address,
          }
        : undefined,
    baseAmount,
    quoteAmount,
    slippage: slippageNumber,
  });

  const midPrice: BigNumber | undefined = uniV2Pair.isFront
    ? uniV2Pair.price
    : uniV2Pair.invertedPrice;
  const addPortion = midPrice || new BigNumber(1);

  const prevAddPortion = React.useRef(addPortion);

  if (!pool || addPortion.isNaN())
    return {
      baseAmount,
      quoteAmount,
      handleChangeBaseAmount: () => {},
      handleChangeQuoteAmount: () => {},
      reset,
      uniV2Pair,
      slippage,
      slippageNumber,
      setSlippage,
    };

  const baseDecimals = pool.baseToken.decimals;
  const quoteDecimals = pool.quoteToken.decimals;

  const changeQuoteByBaseAmount = (amount: string) => {
    if (amount) {
      let matchQuoteAmount = addPortion
        .multipliedBy(amount)
        .dp(quoteDecimals)
        .toString();
      if (
        maxQuoteAmount &&
        isRemove &&
        (maxQuoteAmount.lte(matchQuoteAmount) || maxBaseAmount?.lte(0))
      ) {
        matchQuoteAmount = maxQuoteAmount.toString();
      }
      setQuoteAmount(matchQuoteAmount);
    } else {
      setQuoteAmount(amount);
    }
  };

  const changeBaseByQuoteAmount = (amount: string) => {
    if (amount) {
      let matchBaseAmount = new BigNumber(amount)
        .div(addPortion)
        .dp(baseDecimals)
        .toString();
      if (
        maxBaseAmount &&
        isRemove &&
        (maxBaseAmount.lte(matchBaseAmount) || maxQuoteAmount?.lte(0))
      ) {
        matchBaseAmount = maxBaseAmount.toString();
      }
      setBaseAmount(matchBaseAmount);
    } else {
      setBaseAmount(amount);
    }
  };

  // After the data on the chain changes, change quoteAmount
  if (
    !prevAddPortion.current ||
    !addPortion.isEqualTo(prevAddPortion.current)
  ) {
    prevAddPortion.current = addPortion;
    changeQuoteByBaseAmount(baseAmount);
  }

  const handleChangeBaseAmount = (newValue: string) => {
    let amount = fixedInputStringToFormattedNumber(newValue, baseDecimals);
    if (amount === null) {
      amount = baseAmount;
    }
    setBaseAmount(amount);
    changeQuoteByBaseAmount(amount);
  };

  const handleChangeQuoteAmount = (newValue: string) => {
    let amount = fixedInputStringToFormattedNumber(newValue, quoteDecimals);
    if (amount === null) {
      amount = quoteAmount;
    }
    setQuoteAmount(amount);
    changeBaseByQuoteAmount(amount);
  };

  const amountCheckedDisabled = !baseAmount || !quoteAmount;

  return {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
    reset,

    midPrice,
    addPortion,
    amountCheckedDisabled,

    uniV2Pair,
    slippage,
    slippageNumber,
    setSlippage,
  };
}

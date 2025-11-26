import { PoolApi, PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { fixedInputStringToFormattedNumber } from '../../../../utils/formatter';
import { poolApi } from '../../utils';
import { OperatePool } from '../types';
import { useUniV2Pairs } from '../../hooks/useUniV2Pairs';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';

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
  balanceInfo?: ReturnType<typeof usePoolBalanceInfo>;
}) {
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');
  const needQueryPmmState =
    !pool || (pool.type !== 'AMMV2' && pool.type !== 'AMMV3');
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      pool?.chainId as number,
      pool?.address,
      pool?.type,
      pool?.baseToken?.decimals,
      pool?.quoteToken?.decimals,
    ),
  );

  const reset = () => {
    setBaseAmount('');
    setQuoteAmount('');
  };
  const type = pool?.type as PoolType | undefined;
  const uniV2Pair = useUniV2Pairs({
    pool,
    baseAmount,
    quoteAmount,
  });

  let midPrice = pmmStateQuery.data?.midPrice;
  let addPortion = new BigNumber(NaN);
  let isSinglePool = false;
  let isEmptyDspPool = false;
  const pmm = pmmStateQuery.data;
  if (pool) {
    if (pmm) {
      const i = pmm.pmmParamsBG.i;
      const baseReserve = pmm.pmmParamsBG.b;
      const quoteReserve = pmm.pmmParamsBG.q;
      isEmptyDspPool =
        (pool.type === 'DSP' || pool.type === 'GSP') &&
        (quoteReserve.eq(0) || baseReserve.eq(0));
      isSinglePool = pool.type === 'DVM' && new BigNumber(quoteReserve).eq(0);
      if (isEmptyDspPool) {
        addPortion = i;
      } else if (isSinglePool) {
        addPortion = BigNumber(1);
      } else {
        addPortion = quoteReserve.div(baseReserve);
      }
    } else if (type === 'AMMV2') {
      midPrice = uniV2Pair.isRearTokenA
        ? uniV2Pair.invertedPrice
        : uniV2Pair.price;
      addPortion = midPrice || new BigNumber(1);
    }
  }

  const prevAddPortion = React.useRef(addPortion);

  if (!pool || addPortion.isNaN())
    return {
      baseAmount,
      quoteAmount,
      handleChangeBaseAmount: () => {},
      handleChangeQuoteAmount: () => {},
      reset,
    };

  const needBindAmountChange =
    !isSinglePool && !PoolApi.utils.singleSideLp(pool.type);
  const baseDecimals = pool.baseToken.decimals;
  const quoteDecimals = pool.quoteToken.decimals;

  const changeQuoteByBaseAmount = (amount: string) => {
    if (amount) {
      let matchQuoteAmount = addPortion
        .multipliedBy(amount)
        .dp(quoteDecimals, BigNumber.ROUND_DOWN)
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
        .dp(baseDecimals, BigNumber.ROUND_DOWN)
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
    needBindAmountChange &&
    (!prevAddPortion.current || !addPortion.isEqualTo(prevAddPortion.current))
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
    if (needBindAmountChange) {
      changeQuoteByBaseAmount(amount);
    }
  };

  const handleChangeQuoteAmount = (newValue: string) => {
    let amount = fixedInputStringToFormattedNumber(newValue, quoteDecimals);
    if (amount === null) {
      amount = quoteAmount;
    }
    setQuoteAmount(amount);
    if (needBindAmountChange) {
      changeBaseByQuoteAmount(amount);
    }
  };

  const isSingleSideLp = !!pool && PoolApi.utils.singleSideLp(pool.type);
  let amountCheckedDisabled = false;
  if (isSingleSideLp) {
    amountCheckedDisabled = !baseAmount && !quoteAmount;
  } else if (isSinglePool) {
    amountCheckedDisabled = !baseAmount;
  } else {
    amountCheckedDisabled = !baseAmount || !quoteAmount;
  }

  const amountStatusQuery = needQueryPmmState
    ? pmmStateQuery
    : uniV2Pair.reserveQuery;

  return {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
    reset,

    addPortion,
    amountLoading: amountStatusQuery.isLoading,
    amountError: amountStatusQuery.isError,
    amountRefetch: amountStatusQuery.refetch,
    amountCheckedDisabled,

    midPrice,
    uniV2Pair,
  };
}

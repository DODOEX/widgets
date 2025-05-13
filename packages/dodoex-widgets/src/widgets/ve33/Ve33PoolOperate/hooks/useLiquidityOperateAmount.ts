import BigNumber from 'bignumber.js';
import React from 'react';
import { fixedInputStringToFormattedNumber } from '../../../../utils/formatter';
import { Ve33PoolInfoI } from '../../types';
import { useVe33V2BalanceInfo } from './useVe33V2BalanceInfo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export function useLiquidityOperateAmount({
  pool,
  maxBaseAmount,
  maxQuoteAmount,
  isRemove,
}: {
  pool?: Ve33PoolInfoI;
  maxBaseAmount?: BigNumber | null;
  maxQuoteAmount?: BigNumber | null;
  isRemove?: boolean;
}) {
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');

  const reset = () => {
    setBaseAmount('');
    setQuoteAmount('');
  };

  let midPrice: undefined | BigNumber;
  let addPortion = new BigNumber(NaN);
  const { account } = useWalletInfo();
  const balanceInfo = useVe33V2BalanceInfo({
    account,
    pool,
  });
  if (pool) {
    if (balanceInfo.price) {
      midPrice = balanceInfo.isRearTokenA
        ? new BigNumber(balanceInfo.price?.invert().toSignificant())
        : new BigNumber(balanceInfo.price?.toSignificant());
    }
    addPortion = midPrice || new BigNumber(1);
  }

  const prevAddPortion = React.useRef(addPortion);

  if (!pool || addPortion.isNaN())
    return {
      baseAmount,
      quoteAmount,
      handleChangeBaseAmount: () => {},
      handleChangeQuoteAmount: () => {},
      reset,
      balanceInfo,
    };

  const needBindAmountChange = true;
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

  const amountCheckedDisabled = !baseAmount || !quoteAmount;

  const amountStatusQuery = balanceInfo.reserveQuery;

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
    balanceInfo,

    midPrice,
  };
}

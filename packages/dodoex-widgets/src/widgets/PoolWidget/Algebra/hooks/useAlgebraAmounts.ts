import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { byWei, sortsBefore } from '../../../../utils';
import {
  getPositionAmountFromAmount0,
  getPositionAmountFromAmount1,
} from '../utils/getPositionAmount';
import JSBI from 'jsbi';
import { parseUnits } from '@dodoex/contract-request';

export function useAlgebraAmounts({
  baseToken,
  quoteToken,
  sqrtRatioX96,
  tickCurrent,
  tickLower,
  tickUpper,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  sqrtRatioX96: JSBI | undefined;
  tickCurrent: number | undefined;
  tickLower: number | undefined;
  tickUpper: number | undefined;
}) {
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');
  const sorted =
    baseToken && quoteToken ? sortsBefore(baseToken, quoteToken) : false;

  const readonly =
    !baseToken ||
    !quoteToken ||
    sqrtRatioX96 === undefined ||
    tickCurrent === undefined ||
    tickLower === undefined ||
    tickUpper === undefined;

  const getPositionAmounts = (value: string, isBase: boolean) => {
    if (readonly) {
      throw new Error('parma is undefined');
    }
    const isValue0 = isBase ? sorted : !sorted;
    const decimals0 = sorted ? baseToken.decimals : quoteToken.decimals;
    const decimals1 = sorted ? quoteToken.decimals : baseToken.decimals;
    if (isValue0) {
      const amounts = getPositionAmountFromAmount0({
        sqrtRatioX96,
        tickCurrent,
        tickLower,
        tickUpper,
        amount0: parseUnits(value, decimals0).toString(),
        useFullPrecision: true, // we want full precision for the theoretical position
      });
      return {
        amount0: byWei(amounts.amount0.toString(), decimals0),
        amount1: byWei(amounts.amount1.toString(), decimals1),
      };
    } else {
      const amounts = getPositionAmountFromAmount1({
        sqrtRatioX96,
        tickCurrent,
        tickLower,
        tickUpper,
        amount1: parseUnits(value, decimals1).toString(),
      });
      return {
        amount0: byWei(amounts.amount0.toString(), decimals0),
        amount1: byWei(amounts.amount1.toString(), decimals1),
      };
    }
  };

  const handleChangeBaseAmount = (value: string) => {
    setBaseAmount(value);
    if (Number(value)) {
      const amounts = getPositionAmounts(value, true);
      setQuoteAmount(String(sorted ? amounts.amount1 : amounts.amount0));
    }
  };
  const handleChangeQuoteAmount = (value: string) => {
    setQuoteAmount(value);
    if (Number(value)) {
      const amounts = getPositionAmounts(value, false);
      setBaseAmount(String(sorted ? amounts.amount0 : amounts.amount1));
    }
  };

  const handleBlurBaseAmount = (value: string) => {
    if (Number(value)) {
      const amounts = getPositionAmounts(value, true);
      setBaseAmount(String(sorted ? amounts.amount0 : amounts.amount1));
    }
  };

  const handleBlurQuoteAmount = (value: string) => {
    if (Number(value)) {
      const amounts = getPositionAmounts(value, false);
      setQuoteAmount(String(sorted ? amounts.amount1 : amounts.amount0));
    }
  };

  const reset = () => {
    setBaseAmount('');
    setQuoteAmount('');
  };

  return {
    readonly,
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
    handleBlurBaseAmount,
    handleBlurQuoteAmount,
    reset,
  };
}

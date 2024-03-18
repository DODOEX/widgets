import BigNumber from 'bignumber.js';
import { BigNumber as EthBigNumber } from '@ethersproject/bignumber';

function handleUnitConvert(value: EthBigNumber, decimals: number): BigNumber {
  let result = new BigNumber(value.toString());
  if (decimals) {
    result = result.div(new BigNumber(10 ** decimals));
  }
  return result.dp(decimals);
}

export type PmmData = {
  Q: EthBigNumber;
  B: EthBigNumber;
  K: EthBigNumber;
  i: EthBigNumber;
  B0: EthBigNumber;
  Q0: EthBigNumber;
  R: EthBigNumber;
  // Only CLASSICAL has a value
  lpFeeRate?: EthBigNumber;
  // Only CLASSICAL has a value
  mtFeeRate?: EthBigNumber;
};

export function convertPmmParams(
  queryResult: PmmData,
  baseDecimals: number,
  quoteDecimals: number,
) {
  const i = handleUnitConvert(queryResult.i, 18 - baseDecimals + quoteDecimals); // 18 - base + quote
  const k = handleUnitConvert(queryResult.K, 18);
  const b = handleUnitConvert(queryResult.B, baseDecimals);
  const q = handleUnitConvert(queryResult.Q, quoteDecimals);
  const b0 = handleUnitConvert(queryResult.B0, baseDecimals);
  const q0 = handleUnitConvert(queryResult.B0, quoteDecimals);
  const R = parseInt(queryResult.R.toString());

  let lpFeeRate: BigNumber | undefined;
  let mtFeeRate: BigNumber | undefined;
  if (queryResult.lpFeeRate) {
    lpFeeRate = handleUnitConvert(queryResult.lpFeeRate, 18);
  }
  if (queryResult.mtFeeRate) {
    mtFeeRate = handleUnitConvert(queryResult.mtFeeRate, 18);
  }

  return {
    q,
    b,
    k,
    i,
    b0,
    q0,
    R,
    // Only CLASSICAL has a value
    lpFeeRate,
    // Only CLASSICAL has a value
    mtFeeRate,
  };
}

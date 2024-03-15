import BigNumber from 'bignumber.js';
import { PoolType } from '../type';

function handleUnitConvert(bitStr: string, decimals: number): BigNumber {
  const result = new BigNumber(`0x${bitStr}`).div(
    new BigNumber(10 ** decimals),
  );
  return result.dp(decimals);
}

export function convertPmmParams(
  queryResult: string,
  type: PoolType,
  baseDecimals: number,
  quoteDecimals: number,
) {
  const item = queryResult.substring(2);
  let offset = 0;
  if (type === 'CLASSICAL') {
    offset = 64 + 64;
  }
  const i = handleUnitConvert(
    item.substring(offset, offset + 64),
    18 - baseDecimals + quoteDecimals,
  ); // 18 - base + quote
  const k = handleUnitConvert(
    item.substring(offset + 64 * 1, offset + 64 * 2),
    18,
  );
  const b = handleUnitConvert(
    item.substring(offset + 64 * 2, offset + 64 * 3),
    baseDecimals,
  );
  const q = handleUnitConvert(
    item.substring(offset + 64 * 3, offset + 64 * 4),
    quoteDecimals,
  );
  const b0 = handleUnitConvert(
    item.substring(offset + 64 * 4, offset + 64 * 5),
    baseDecimals,
  );
  const q0 = handleUnitConvert(
    item.substring(offset + 64 * 5, offset + 64 * 6),
    quoteDecimals,
  );
  const R = parseInt(`0x${item.substring(offset + 64 * 6, offset + 64 * 7)}`);

  let lpFeeRate: BigNumber | undefined;
  let mtFeeRate: BigNumber | undefined;
  if (type === 'CLASSICAL') {
    lpFeeRate = handleUnitConvert(
      item.substring(offset + 64 * 7, offset + 64 * 8),
      18,
    );
    mtFeeRate = handleUnitConvert(
      item.substring(offset + 64 * 8, offset + 64 * 9),
      18,
    );
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

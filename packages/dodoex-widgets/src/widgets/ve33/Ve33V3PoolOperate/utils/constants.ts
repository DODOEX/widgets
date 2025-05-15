import JSBI from 'jsbi';

export const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);

// used in liquidity amount math
export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

// exports for external consumption
export type BigintIsh = JSBI | string | number;

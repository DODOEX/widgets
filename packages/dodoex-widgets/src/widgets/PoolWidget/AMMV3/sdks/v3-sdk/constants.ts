import { ChainId } from '../sdk-core';

export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// @deprecated please use poolInitCodeHash(chainId: ChainId)
export const POOL_INIT_CODE_HASH =
  '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';

export function poolInitCodeHash(chainId?: ChainId): string {
  switch (chainId) {
    default:
      return POOL_INIT_CODE_HASH;
  }
}

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW_200 = 200,
  LOW_300 = 300,
  LOW_400 = 400,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW_200]: 4,
  [FeeAmount.LOW_300]: 6,
  [FeeAmount.LOW_400]: 8,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
};

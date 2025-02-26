/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  // LOWEST = 100,
  // LOW_200 = 200,
  // LOW_300 = 300,
  // LOW_400 = 400,
  LOW = 1000,
  // MEDIUM = 3000,
  // HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  // [FeeAmount.LOWEST]: 1,
  // [FeeAmount.LOW_200]: 4,
  // [FeeAmount.LOW_300]: 6,
  // [FeeAmount.LOW_400]: 8,
  [FeeAmount.LOW]: 20,
  // [FeeAmount.MEDIUM]: 60,
  // [FeeAmount.HIGH]: 200,
};

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 * @see https://explorer-holesky.morphl2.io/address/0x0d1B0d0d709292d35AB7455fF6DBA0Eed40Cc49b?tab=read_contract
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 500,
  HIGH = 3_000,
  HIGHEST = 10_000,
}

export enum TickSpacings {
  LOWEST = 1,
  LOW = 50,
  MEDIUM = 100,
  HIGH = 200,
  HIGHEST = 2_000,
}

export const tickSpacingToFee: { [amount in TickSpacings]: FeeAmount } = {
  [TickSpacings.LOWEST]: FeeAmount.LOWEST,
  [TickSpacings.LOW]: FeeAmount.LOW,
  [TickSpacings.MEDIUM]: FeeAmount.MEDIUM,
  [TickSpacings.HIGH]: FeeAmount.HIGH,
  [TickSpacings.HIGHEST]: FeeAmount.HIGHEST,
};

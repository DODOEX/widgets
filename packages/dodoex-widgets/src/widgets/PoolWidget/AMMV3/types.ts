export enum Field {
  MINT_1 = 'MINT_1',
  MINT_2 = 'MINT_2',
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export type FullRange = true;

export type OperateType = null | 'stake' | 'unstake' | 'claim';

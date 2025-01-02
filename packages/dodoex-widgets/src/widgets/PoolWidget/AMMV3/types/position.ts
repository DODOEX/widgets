import { FeeAmount } from '../sdks/v3-sdk';

export interface PositionDetails {
  nonce: string;
  tokenId: string;
  operator: string;
  token0: string;
  token1: string;
  fee: FeeAmount;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
}

export enum PositionField {
  TOKEN0 = 'TOKEN0',
  TOKEN1 = 'TOKEN1',
}

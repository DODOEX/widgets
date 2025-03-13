import {
  ApiV3PoolInfoConcentratedItem,
  Clmm,
} from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';
import { FeeAmount } from './sdks/v3-sdk/constants';

export enum Field {
  DEPOSIT_1 = 'DEPOSIT_1',
  DEPOSIT_2 = 'DEPOSIT_2',
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export type FullRange = true;

export type OperateType = null | 'stake' | 'unstake' | 'claim';

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

export type PoolInfoT = Awaited<ReturnType<Clmm['getPoolInfoFromRpc']>>;

export interface PoolInfoI extends ApiV3PoolInfoConcentratedItem {
  tickCurrent: PoolInfoT['computePoolInfo']['tickCurrent'];
}

export interface PositionI {
  poolInfo: PoolInfoI;
  tickUpper: number;
  tickLower: number;
  tickLowerPrice: BigNumber | undefined;
  tickUpperPrice: BigNumber | undefined;
  liquidity: BigNumber;
  amountA: BigNumber;
  amountB: BigNumber;
}

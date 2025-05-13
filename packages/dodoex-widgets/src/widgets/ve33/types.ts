import { ChainId } from '@dodoex/api';
import { TokenInfo } from '../../hooks/Token/type';
import { FetchVe33PoolList } from '../PoolWidget/utils';

export enum OperateTypeE {
  Add = 1,
  Remove,
}

export enum PoolTypeE {
  Pool = 1,
  CLPool,
}

export enum FeeE {
  Stable = 5,
  Volatile = 30,
}

export type FetchVe33PoolItem = FetchVe33PoolList[0];

export type Ve33PoolInfoI = FetchVe33PoolItem & {
  stable: boolean;
  fee: FeeE | 0 | number;
  type: PoolTypeE;
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
};

export interface Ve33PoolOperateProps {
  poolInfo: Ve33PoolInfoI;
  operateType: OperateTypeE;
  chainId: ChainId;
}

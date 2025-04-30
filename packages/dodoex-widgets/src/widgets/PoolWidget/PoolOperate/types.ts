import { ExcludeNone, PoolType } from '@dodoex/api';
import { TokenInfo } from '../../../hooks/Token';
import { FetchMyLiquidityListLqList } from '../utils';

export type OperatePool =
  | {
      address: string;
      chainId: number;
      baseToken: TokenInfo;
      quoteToken: TokenInfo;
      baseLpToken?: {
        id: string;
        decimals: number;
      };
      quoteLpToken?: {
        id: string;
        decimals: number;
      };
      type: PoolType;
      owner?: string;
      creator: string;
      lpFeeRate?: string;
      liquidityPositions?: ExcludeNone<
        ExcludeNone<FetchMyLiquidityListLqList>[0]
      >['liquidityPositions'];
    }
  | undefined;

export interface LiquidityMigrationInfo {
  chainId: number;
  miningContractAddress: string;
  stakeTokenAddress: string;
  newMiningContractAddress: string;
  newStakeTokenAddress: string;
}

export type GetMigrationPairAndMining = (p: {
  address: string;
  chainId: number;
}) => LiquidityMigrationInfo | undefined;

export type ShowMigrationPairAndMining = (p: LiquidityMigrationInfo) => void;

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
      };
      quoteLpToken?: {
        id: string;
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

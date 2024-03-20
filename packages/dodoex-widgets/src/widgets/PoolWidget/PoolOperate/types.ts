import { PoolType } from '@dodoex/api';
import { TokenInfo } from '../../../hooks/Token';

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
      lpFeeRate: string;
    }
  | undefined;

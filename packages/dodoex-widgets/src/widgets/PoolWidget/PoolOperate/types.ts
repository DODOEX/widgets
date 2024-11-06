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
      };
      quoteLpToken?: {
        id: string;
      };
      type: PoolType;
      owner?: string;
      creator: string;
    }
  | undefined;

import { ChainId } from '@dodoex/api';
import { TokenInfo } from '../../../hooks/Token';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';

/**
 * CurveStableSwapNG
 *
 * @see https://zetachain-testnet.blockscout.com/token/0xDddfBCc76166d741c2dfa6b6a90769df398b9969?tab=read_contract
 */
export type CurvePoolT = {
  chainId: ChainId;
  name: string;
  address: string;
  symbol: string;
  decimals: number;

  fee: string;
  coins: TokenInfo[];

  apy: string | null;
  tvl: string | null;
  volume: string | null;
};

export type OperateCurvePoolT = {
  pool: CurvePoolT;
  type: OperateTab;
};

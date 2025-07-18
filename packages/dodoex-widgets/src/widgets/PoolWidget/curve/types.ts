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
  dailyApy: string | null;
  weeklyApy: string | null;
  tvl: string | null;
  volume: string | null;
  dailyVolumeUsd: string | null;
  traderCount: string | null;
  liquidityUtilization: string | null;
  daoFee: string | null;
  virtualPrice: string | null;
  /**
   * export const POOL_TYPE_PLAIN = "plain";
export const POOL_TYPE_META = "meta";
现在有两种池子类型
11:44
PlainPoolDeployed
MetaPoolDeployed
创建池的时候事件不同
   */
  poolType: 'plain' | 'meta';
  a: string | null;
  offpegFeeMultiplier: string | null;

  lpTokenBalance: string | null;
};

export type OperateCurvePoolT = {
  pool: CurvePoolT;
  type: OperateTab;
};

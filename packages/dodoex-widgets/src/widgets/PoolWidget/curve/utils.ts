import { ChainId, CurveApi, ExcludeNone } from '@dodoex/api';
import { contractRequests } from '../../../constants/api';
import { CurvePoolT } from './types';

export const curveApi = new CurveApi({
  contractRequests,
});

export const mockCurvePoolList: CurvePoolT[] = [
  // @see https://zetachain-testnet.blockscout.com/token/0xDddfBCc76166d741c2dfa6b6a90769df398b9969?tab=read_contract
  {
    chainId: ChainId.ZETACHAIN_TESTNET,
    name: 'MockToken 4Pool',
    address: '0xDddfBCc76166d741c2dfa6b6a90769df398b9969',
    symbol: 'MTK.10000',
    decimals: 18,

    fee: '20000000',
    coins: [
      {
        address: '0x08f9f0e8EBc8B3F7808974463D31CC39Ca9F79F0',
        name: 'Mock Token 1',
        decimals: 18,
        symbol: 'MTK1',
        chainId: ChainId.ZETACHAIN_TESTNET,
      },
      {
        address: '0xc39f8C093b10660E12d982256979E239B18D073d',
        name: 'Mock Token 2',
        decimals: 18,
        symbol: 'MTK2',
        chainId: ChainId.ZETACHAIN_TESTNET,
      },
      {
        address: '0xbE3499499C928F086a32B0bE586e07A9D085b5eF',
        name: 'Mock Token 3',
        decimals: 18,
        symbol: 'MTK3',
        chainId: ChainId.ZETACHAIN_TESTNET,
      },
      {
        address: '0x11D6F6C038B9E841e024F7aB5Bd40101D69638b3',
        name: 'Mock Token 4',
        decimals: 18,
        symbol: 'MTK4',
        chainId: ChainId.ZETACHAIN_TESTNET,
      },
      // {
      //   address: '0x11D6F6C038B9E841e024F7aB5Bd40101D69638b3',
      //   name: 'Mock Token 4',
      //   decimals: 18,
      //   symbol: 'MTK4',
      //   chainId: ChainId.ZETACHAIN_TESTNET,
      // },
    ],

    apy: '0.631',
    dailyApy: '0.001',
    weeklyApy: '0.002',
    tvl: '1000000000000000000',
    volume: '1000000000000000000',
    lpTokenBalance: '1000000000000000000',
  },
];

export function convertRawPoolListToCurvePoolListT(
  rawPoolList: ExcludeNone<
    ReturnType<
      Exclude<
        (typeof CurveApi.graphql.curve_stableswap_ng_getAllPools)['__apiType'],
        undefined
      >
    >['curve_stableswap_ng_getAllPools']
  >['lqList'],
  chainId: ChainId | undefined,
): CurvePoolT[] {
  if (!rawPoolList || !chainId) {
    return [];
  }

  const curvePoolList: CurvePoolT[] = [];

  for (const lqItem of rawPoolList) {
    if (!lqItem?.pool) {
      continue;
    }

    const pool = lqItem.pool;

    // Convert coins to TokenInfo format
    const coins =
      pool.coins?.map((coin) => ({
        chainId,
        address: coin.address || coin.id || '',
        name: coin.name || coin.symbol || '',
        decimals: coin.decimals || 18,
        symbol: coin.symbol || '',
        logoURI: coin.logoImg || undefined,
      })) || [];

    // Create CurvePoolT object
    const curvePool: CurvePoolT = {
      chainId,
      name: pool.name || '',
      address: pool.address || pool.id || '',
      symbol: coins.length > 0 ? coins.map((c) => c.symbol).join('.') : '',
      decimals: 18, // Default decimals for LP token
      fee: pool.fee?.toString() || '0',
      coins: coins,
      apy: pool.apy?.toString() || null,
      dailyApy: null, // Not available in raw data
      weeklyApy: null, // Not available in raw data
      tvl: pool.tvl?.toString() || null,
      volume: pool.volume?.toString() || null,
      lpTokenBalance:
        lqItem.liquidityPositions?.[0]?.liquidityTokenBalance || null,
    };

    curvePoolList.push(curvePool);
  }

  return curvePoolList;
}

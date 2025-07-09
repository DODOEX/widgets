import { ChainId, CurveApi } from '@dodoex/api';
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
    ],

    apy: null,
    dailyApy: null,
    weeklyApy: null,
    tvl: null,
    volume: null,
  },
];

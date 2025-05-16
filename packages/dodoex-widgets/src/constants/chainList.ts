import { ChainId } from '@dodoex/api';
import {
  AppKitNetwork,
  base,
  bitcoin,
  bsc,
  defineChain,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  zetachain,
} from '@reown/appkit/networks';

import { ReactComponent as BaseLogo } from '../assets/logo/networks/base.svg';
import { ReactComponent as BSCLogo } from '../assets/logo/networks/bsc.svg';
import { ReactComponent as BtcLogo } from '../assets/logo/networks/btc.svg';
import { ReactComponent as ETHereumLogo } from '../assets/logo/networks/eth.svg';
import { ReactComponent as PolygonLogo } from '../assets/logo/networks/polygon.svg';
import { ReactComponent as SolanaLogo } from '../assets/logo/networks/solana.svg';
import { ReactComponent as ZetachainLogo } from '../assets/logo/networks/zetachain.svg';

export const zetachainTestnet = defineChain({
  id: 7001,
  name: 'ZetaChain testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tZETA',
    symbol: 'tZETA',
  },
  rpcUrls: {
    default: {
      http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2715217,
    },
  },
  blockExplorers: {
    default: {
      name: 'ZetaScan',
      url: 'https://zetachain-testnet.blockscout.com',
    },
  },
  testnet: true,
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:7001',
});

export interface ChainListItem {
  chainId: ChainId;
  logo: typeof ETHereumLogo;
  name: string;
  mainnet?: ChainId;
  caipNetwork: AppKitNetwork;
}

export const chainListMap: Map<ChainId, ChainListItem> = new Map([
  [
    ChainId.MAINNET,
    {
      chainId: ChainId.MAINNET,
      logo: ETHereumLogo,
      name: 'Ethereum',
      caipNetwork: mainnet,
    },
  ],
  [
    ChainId.SEPOLIA,
    {
      chainId: ChainId.SEPOLIA,
      logo: ETHereumLogo,
      name: 'Ethereum Sepolia',
      caipNetwork: sepolia,
    },
  ],
  [
    ChainId.POLYGON,
    {
      chainId: ChainId.POLYGON,
      logo: PolygonLogo,
      name: 'Polygon',
      caipNetwork: polygon,
    },
  ],
  [
    ChainId.BSC,
    {
      chainId: ChainId.BSC,
      logo: BSCLogo,
      name: 'BNBChain',
      caipNetwork: bsc,
    },
  ],
  [
    ChainId.BASE,
    {
      chainId: ChainId.BASE,
      logo: BaseLogo,
      name: 'Base',
      caipNetwork: base,
    },
  ],
  [
    ChainId.ZETACHAIN,
    {
      chainId: ChainId.ZETACHAIN,
      logo: ZetachainLogo,
      name: 'Zetachain',
      caipNetwork: zetachain,
    },
  ],
  [
    ChainId.ZETACHAIN_TESTNET,
    {
      chainId: ChainId.ZETACHAIN_TESTNET,
      logo: ZetachainLogo,
      name: 'Zetachain Testnet',
      mainnet: ChainId.ZETACHAIN,
      caipNetwork: zetachainTestnet,
    },
  ],
  [
    ChainId.SOLANA,
    {
      chainId: ChainId.SOLANA,
      logo: SolanaLogo,
      name: 'Solana',
      caipNetwork: solana,
    },
  ],
  [
    ChainId.SOLANA_DEVNET,
    {
      chainId: ChainId.SOLANA_DEVNET,
      logo: SolanaLogo,
      name: 'Solana Devnet',
      caipNetwork: solanaDevnet,
    },
  ],
  [
    ChainId.BTC,
    {
      chainId: ChainId.BTC,
      logo: BtcLogo,
      name: 'Bitcoin',
      caipNetwork: bitcoin,
    },
  ],
]);

export const isTestNet = (chainId: ChainId) => {
  return !!chainListMap.get(chainId)?.mainnet;
};

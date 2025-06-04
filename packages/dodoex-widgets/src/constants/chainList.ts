import { ChainId, btcSignet, zetachainTestnet } from '@dodoex/api';
import {
  AppKitNetwork,
  arbitrumSepolia,
  sepolia,
  solana,
  solanaDevnet,
} from '@reown/appkit/networks';

import { ReactComponent as BaseLogo } from '../assets/logo/networks/base.svg';
import { ReactComponent as BSCLogo } from '../assets/logo/networks/bsc.svg';
import { ReactComponent as BtcLogo } from '../assets/logo/networks/btc.svg';
import { ReactComponent as PolygonLogo } from '../assets/logo/networks/polygon.svg';
import { ReactComponent as ETHereumLogo } from '../assets/logo/networks/eth.svg';
import { ReactComponent as ArbitrumSepoliaLogo } from '../assets/logo/networks/arbitrum.svg';
import { ReactComponent as SolanaLogo } from '../assets/logo/networks/solana.svg';
import { ReactComponent as ZetachainLogo } from '../assets/logo/networks/zetachain.svg';
import { ReactComponent as BtcSignetLogo } from '../assets/logo/networks/btc-signet.svg';
import { EmptyAddress } from './address';

export interface ChainListItem {
  chainId: ChainId;
  logo: typeof ETHereumLogo;
  name: string;
  mainnet?: ChainId;
  caipNetwork: AppKitNetwork;
  // 是否是异种链
  isEVMChain: boolean;
  isSolanaChain: boolean;
  isBTCChain: boolean;

  /** 未链接钱包时，使用该地址 */
  fallbackAddress: string;
}

export const chainListMap: Map<ChainId, ChainListItem> = new Map([
  // [
  //   ChainId.MAINNET,
  //   {
  //     chainId: ChainId.MAINNET,
  //     logo: ETHereumLogo,
  //     name: 'Ethereum',
  //     caipNetwork: mainnet,
  //     isEVMChain: true,
  //   },
  // ],
  // [
  //   ChainId.POLYGON,
  //   {
  //     chainId: ChainId.POLYGON,
  //     logo: PolygonLogo,
  //     name: 'Polygon',
  //     caipNetwork: polygon,
  //     isEVMChain: true,
  //   },
  // ],
  // [
  //   ChainId.BSC,
  //   {
  //     chainId: ChainId.BSC,
  //     logo: BSCLogo,
  //     name: 'BNBChain',
  //     caipNetwork: bsc,
  //     isEVMChain: true,
  //   },
  // ],
  // [
  //   ChainId.BASE,
  //   {
  //     chainId: ChainId.BASE,
  //     logo: BaseLogo,
  //     name: 'Base',
  //     caipNetwork: base,
  //     isEVMChain: true,
  //   },
  // ],
  // [
  //   ChainId.ZETACHAIN,
  //   {
  //     chainId: ChainId.ZETACHAIN,
  //     logo: ZetachainLogo,
  //     name: 'Zetachain',
  //     caipNetwork: zetachain,
  //     isEVMChain: true,
  //   },
  // ],
  [
    ChainId.SOLANA,
    {
      chainId: ChainId.SOLANA,
      logo: SolanaLogo,
      name: 'Solana',
      caipNetwork: solana,
      isEVMChain: false,
      isSolanaChain: true,
      isBTCChain: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  // [
  //   ChainId.BTC,
  //   {
  //     chainId: ChainId.BTC,
  //     logo: BtcLogo,
  //     name: 'Bitcoin',
  //     caipNetwork: bitcoin,
  //     isBTCChain: true,
  //   },
  // ],

  [
    ChainId.SEPOLIA,
    {
      chainId: ChainId.SEPOLIA,
      logo: ETHereumLogo,
      name: 'Ethereum Sepolia',
      caipNetwork: sepolia,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.ARBITRUM_SEPOLIA,
    {
      chainId: ChainId.ARBITRUM_SEPOLIA,
      logo: ArbitrumSepoliaLogo,
      name: 'Arbitrum Sepolia',
      caipNetwork: arbitrumSepolia,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      fallbackAddress: EmptyAddress,
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
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.SOLANA_DEVNET,
    {
      chainId: ChainId.SOLANA_DEVNET,
      logo: SolanaLogo,
      name: 'Solana Devnet',
      caipNetwork: solanaDevnet,
      isEVMChain: false,
      isSolanaChain: true,
      isBTCChain: false,
      fallbackAddress: 'CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n',
    },
  ],
  [
    ChainId.BTC_SIGNET,
    {
      chainId: ChainId.BTC_SIGNET,
      logo: BtcSignetLogo,
      name: 'Bitcoin Signet',
      caipNetwork: btcSignet,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: true,
      fallbackAddress: 'tb1qcrd8yvatjzpxl0ew29jsps2z595jpwtm5mj38v',
    },
  ],
]);

export const isTestNet = (chainId: ChainId) => {
  return !!chainListMap.get(chainId)?.mainnet;
};

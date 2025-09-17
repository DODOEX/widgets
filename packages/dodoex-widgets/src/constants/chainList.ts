import {
  btcSignet,
  ChainId,
  sui,
  suiTestnet,
  ton,
  tonTestnet,
  zetachainTestnet,
} from '@dodoex/api';
import {
  AppKitNetwork,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  bitcoin,
  bsc,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  zetachain,
} from '@reown/appkit/networks';

import {
  ReactComponent as ArbitrumLogo,
  ReactComponent as ArbitrumSepoliaLogo,
} from '../assets/logo/networks/arbitrum.svg';
import { ReactComponent as AvalancheLogo } from '../assets/logo/networks/avalanche.svg';
import { ReactComponent as BaseLogo } from '../assets/logo/networks/base.svg';
import { ReactComponent as BSCLogo } from '../assets/logo/networks/bsc.svg';
import { ReactComponent as BtcSignetLogo } from '../assets/logo/networks/btc-signet.svg';
import { ReactComponent as BtcLogo } from '../assets/logo/networks/btc.svg';
import { ReactComponent as ETHereumLogo } from '../assets/logo/networks/eth.svg';
import { ReactComponent as PolygonLogo } from '../assets/logo/networks/polygon.svg';
import { ReactComponent as SolanaLogo } from '../assets/logo/networks/solana.svg';
import { ReactComponent as SuiTestnetLogo } from '../assets/logo/networks/sui-testnet.svg';
import { ReactComponent as SuiLogo } from '../assets/logo/networks/sui.svg';
import { ReactComponent as TonTestnetLogo } from '../assets/logo/networks/ton-testnet.svg';
import { ReactComponent as TonLogo } from '../assets/logo/networks/ton.svg';
import { ReactComponent as ZetachainLogo } from '../assets/logo/networks/zetachain.svg';
import {
  btcFallbackAddress,
  EmptyAddress,
  solanaFallbackAddress,
  suiFallbackAddress,
  tonFallbackAddress,
} from './address';

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
  isSUIChain: boolean;
  isTONChain: boolean;

  isTestNet: boolean;

  /** 未链接钱包时，使用该地址 */
  fallbackAddress: string;
}

export const chainListMap: Map<ChainId, ChainListItem> = new Map([
  [
    ChainId.MAINNET,
    {
      chainId: ChainId.MAINNET,
      logo: ETHereumLogo,
      name: 'Ethereum',
      caipNetwork: mainnet,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.POLYGON,
    {
      chainId: ChainId.POLYGON,
      logo: PolygonLogo,
      name: 'Polygon',
      caipNetwork: polygon,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.BSC,
    {
      chainId: ChainId.BSC,
      logo: BSCLogo,
      name: bsc.name,
      caipNetwork: bsc,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.ZETACHAIN,
    {
      chainId: ChainId.ZETACHAIN,
      logo: ZetachainLogo,
      name: zetachain.name,
      caipNetwork: zetachain,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.BASE,
    {
      chainId: ChainId.BASE,
      logo: BaseLogo,
      name: base.name,
      caipNetwork: base,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.AVALANCHE,
    {
      chainId: ChainId.AVALANCHE,
      logo: AvalancheLogo,
      name: avalanche.name,
      caipNetwork: avalanche,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.ARBITRUM_ONE,
    {
      chainId: ChainId.ARBITRUM_ONE,
      logo: ArbitrumLogo,
      name: arbitrum.name,
      caipNetwork: arbitrum,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.SOLANA,
    {
      chainId: ChainId.SOLANA,
      logo: SolanaLogo,
      name: solana.name,
      caipNetwork: solana,
      isEVMChain: false,
      isSolanaChain: true,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: solanaFallbackAddress,
    },
  ],
  [
    ChainId.BTC,
    {
      chainId: ChainId.BTC,
      logo: BtcLogo,
      name: bitcoin.name,
      caipNetwork: bitcoin,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: true,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: btcFallbackAddress,
    },
  ],
  [
    ChainId.SUI,
    {
      chainId: ChainId.SUI,
      logo: SuiLogo,
      name: sui.name,
      caipNetwork: sui,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: true,
      isTONChain: false,
      isTestNet: false,
      fallbackAddress: suiFallbackAddress,
    },
  ],
  [
    ChainId.TON,
    {
      chainId: ChainId.TON,
      logo: TonLogo,
      name: ton.name,
      caipNetwork: ton,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: true,
      isTestNet: false,
      fallbackAddress: tonFallbackAddress,
    },
  ],

  [
    ChainId.SEPOLIA,
    {
      chainId: ChainId.SEPOLIA,
      logo: ETHereumLogo,
      name: sepolia.name,
      caipNetwork: sepolia,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.ARBITRUM_SEPOLIA,
    {
      chainId: ChainId.ARBITRUM_SEPOLIA,
      logo: ArbitrumSepoliaLogo,
      name: arbitrumSepolia.name,
      caipNetwork: arbitrumSepolia,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.ZETACHAIN_TESTNET,
    {
      chainId: ChainId.ZETACHAIN_TESTNET,
      logo: ZetachainLogo,
      name: zetachainTestnet.name,
      mainnet: ChainId.ZETACHAIN,
      caipNetwork: zetachainTestnet,
      isEVMChain: true,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: EmptyAddress,
    },
  ],
  [
    ChainId.SOLANA_DEVNET,
    {
      chainId: ChainId.SOLANA_DEVNET,
      logo: SolanaLogo,
      name: solanaDevnet.name,
      caipNetwork: solanaDevnet,
      isEVMChain: false,
      isSolanaChain: true,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: solanaFallbackAddress,
    },
  ],
  [
    ChainId.BTC_SIGNET,
    {
      chainId: ChainId.BTC_SIGNET,
      logo: BtcSignetLogo,
      name: btcSignet.name,
      caipNetwork: btcSignet,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: true,
      isSUIChain: false,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: btcFallbackAddress,
    },
  ],
  [
    ChainId.SUI_TESTNET,
    {
      chainId: ChainId.SUI_TESTNET,
      logo: SuiTestnetLogo,
      name: suiTestnet.name,
      caipNetwork: suiTestnet,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: true,
      isTONChain: false,
      isTestNet: true,
      fallbackAddress: suiFallbackAddress,
    },
  ],
  [
    ChainId.TON_TESTNET,
    {
      chainId: ChainId.TON_TESTNET,
      logo: TonTestnetLogo,
      name: tonTestnet.name,
      caipNetwork: tonTestnet,
      isEVMChain: false,
      isSolanaChain: false,
      isBTCChain: false,
      isSUIChain: false,
      isTONChain: true,
      isTestNet: true,
      fallbackAddress: tonFallbackAddress,
    },
  ],
]);

export const isTestNet = (chainId: ChainId) => {
  return !!chainListMap.get(chainId)?.mainnet;
};

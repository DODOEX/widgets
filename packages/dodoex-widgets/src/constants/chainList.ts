import { ChainId } from '@dodoex/api';
import { ReactComponent as ETHereumLogo } from '../assets/logo/networks/eth.svg';
import { ReactComponent as ArbitrumLogo } from '../assets/logo/networks/arbitrum.svg';
import { ReactComponent as PolygonLogo } from '../assets/logo/networks/polygon.svg';
import { ReactComponent as BSCLogo } from '../assets/logo/networks/bsc.svg';
import { ReactComponent as OptimismLogo } from '../assets/logo/networks/optimism.svg';
import { ReactComponent as AvalancheLogo } from '../assets/logo/networks/avalanche.svg';
import { ReactComponent as AuroraLogo } from '../assets/logo/networks/aurora.svg';
import { ReactComponent as OKChainLogo } from '../assets/logo/networks/okchain.svg';
import { ReactComponent as CFXLogo } from '../assets/logo/networks/cfx.svg';
import { ReactComponent as BaseLogo } from '../assets/logo/networks/base.svg';
import { ReactComponent as LINEALogo } from '../assets/logo/networks/linea.svg';
import { ReactComponent as ScrollLogo } from '../assets/logo/networks/scroll.svg';
import { ReactComponent as MantaLogo } from '../assets/logo/networks/manta.svg';
import { ReactComponent as MantleLogo } from '../assets/logo/networks/mantle.svg';
import { ReactComponent as DODOchainLogo } from '../assets/logo/networks/dodochain.svg';
import { ReactComponent as TaikoLogo } from '../assets/logo/networks/taiko.svg';
import { ReactComponent as PlumeLogo } from '../assets/logo/networks/plume.svg';
import { ReactComponent as NeoxLogo } from '../assets/logo/networks/neox.svg';
import { ReactComponent as MorphLogo } from '../assets/logo/networks/morph.svg';
import { ReactComponent as RiseLogo } from '../assets/logo/networks/rise.svg';
import { ReactComponent as NeroLogo } from '../assets/logo/networks/rise.svg';
import { ReactComponent as BitlayerLogo } from '../assets/logo/networks/bitlayer.svg';
import { ReactComponent as ZircuitLogo } from '../assets/logo/networks/zircuit.svg';
import { ReactComponent as XLayerLogo } from '../assets/logo/networks/x-layer.svg';
import { ReactComponent as ZeroLogo } from '../assets/logo/networks/zero.svg';
import { ReactComponent as HashKeyLogo } from '../assets/logo/networks/haskey.svg';
import { ReactComponent as HemiLogo } from '../assets/logo/networks/hemi.svg';
import { ReactComponent as PharosLogo } from '../assets/logo/networks/pharos.svg';

export interface ChainListItem {
  chainId: ChainId;
  logo: typeof ETHereumLogo;
  name: string;
  mainnet?: ChainId;
}
export const chainListMap: Map<ChainId, ChainListItem> = new Map([
  [
    ChainId.MAINNET,
    {
      chainId: ChainId.MAINNET,
      logo: ETHereumLogo,
      name: 'Ethereum',
    },
  ],
  [
    ChainId.GOERLI,
    {
      chainId: ChainId.GOERLI,
      logo: ETHereumLogo,
      name: 'Goerli',
      mainnet: ChainId.MAINNET,
    },
  ],
  [
    ChainId.SEPOLIA,
    {
      chainId: ChainId.SEPOLIA,
      logo: ETHereumLogo,
      name: 'Sepolia',
      mainnet: ChainId.MAINNET,
    },
  ],
  [
    ChainId.ARBITRUM_ONE,
    {
      chainId: ChainId.ARBITRUM_ONE,
      logo: ArbitrumLogo,
      name: 'Arbitrum',
    },
  ],
  [
    ChainId.ARBITRUM_SEPOLIA,
    {
      chainId: ChainId.ARBITRUM_SEPOLIA,
      logo: ArbitrumLogo,
      name: 'Arbitrum Sepolia',
      mainnet: ChainId.ARBITRUM_ONE,
    },
  ],
  [
    ChainId.POLYGON,
    {
      chainId: ChainId.POLYGON,
      logo: PolygonLogo,
      name: 'Polygon',
    },
  ],
  [
    ChainId.BSC,
    {
      chainId: ChainId.BSC,
      logo: BSCLogo,
      name: 'BNBChain',
    },
  ],
  [
    ChainId.OPTIMISM,
    {
      chainId: ChainId.OPTIMISM,
      logo: OptimismLogo,
      name: 'Optimism',
    },
  ],
  [
    ChainId.AVALANCHE,
    {
      chainId: ChainId.AVALANCHE,
      logo: AvalancheLogo,
      name: 'Avalanche',
    },
  ],
  [
    ChainId.AURORA,
    {
      chainId: ChainId.AURORA,
      logo: AuroraLogo,
      name: 'Aurora',
    },
  ],
  [
    ChainId.OKCHAIN,
    {
      chainId: ChainId.OKCHAIN,
      logo: OKChainLogo,
      name: 'OKTC',
    },
  ],
  [
    ChainId.CONFLUX,
    {
      chainId: ChainId.CONFLUX,
      logo: CFXLogo,
      name: 'Conflux eSpace',
    },
  ],
  [
    ChainId.BASE,
    {
      chainId: ChainId.BASE,
      logo: BaseLogo,
      name: 'Base',
    },
  ],
  [
    ChainId.LINEA,
    {
      chainId: ChainId.LINEA,
      logo: LINEALogo,
      name: 'Linea',
    },
  ],
  [
    ChainId.SCROLL,
    {
      chainId: ChainId.SCROLL,
      logo: ScrollLogo,
      name: 'Scroll',
    },
  ],
  [
    ChainId.MANTA,
    {
      chainId: ChainId.MANTA,
      logo: MantaLogo,
      name: 'Manta',
    },
  ],
  [
    ChainId.MANTLE,
    {
      chainId: ChainId.MANTLE,
      logo: MantleLogo,
      name: 'Mantle',
    },
  ],
  [
    ChainId.DODO_CHAIN_TESTNET,
    {
      chainId: ChainId.DODO_CHAIN_TESTNET,
      logo: DODOchainLogo,
      name: 'DODOchain testnet',
    },
  ],
  [
    ChainId.TAIKO,
    {
      chainId: ChainId.TAIKO,
      logo: TaikoLogo,
      name: 'Taiko',
    },
  ],
  [
    ChainId.PLUME,
    {
      chainId: ChainId.PLUME,
      logo: PlumeLogo,
      name: 'Plume',
    },
  ],
  [
    ChainId.PLUME_TESTNET,
    {
      chainId: ChainId.PLUME_TESTNET,
      logo: PlumeLogo,
      name: 'plume testnet',
    },
  ],
  [
    ChainId.NEOX,
    {
      chainId: ChainId.NEOX,
      logo: NeoxLogo,
      name: 'Neo X',
    },
  ],
  [
    ChainId.MORPH,
    {
      chainId: ChainId.MORPH,
      logo: MorphLogo,
      name: 'Morph',
    },
  ],
  [
    ChainId.RISE_TESTNET,
    {
      chainId: ChainId.RISE_TESTNET,
      logo: RiseLogo,
      name: 'Rise-Sepolia',
    },
  ],
  [
    ChainId.NEROCHAIN,
    {
      chainId: ChainId.NEROCHAIN,
      logo: NeroLogo,
      name: 'NERO Chain',
    },
  ],
  [
    ChainId.BITLAYER,
    {
      chainId: ChainId.BITLAYER,
      logo: BitlayerLogo,
      name: 'Bitlayer Mainnet',
    },
  ],
  [
    ChainId.ZIRCUIT,
    {
      chainId: ChainId.ZIRCUIT,
      logo: ZircuitLogo,
      name: 'Zircuit Mainnet',
    },
  ],
  [
    ChainId.X_LAYER,
    {
      chainId: ChainId.X_LAYER,
      logo: XLayerLogo,
      name: 'X Layer Mainnet',
    },
  ],
  [
    ChainId.ZERO,
    {
      chainId: ChainId.ZERO,
      logo: ZeroLogo,
      name: 'Zero Network',
    },
  ],
  [
    ChainId.HASHKEY,
    {
      chainId: ChainId.HASHKEY,
      logo: HashKeyLogo,
      name: 'HashKey Chain',
    },
  ],
  [
    ChainId.HEMI,
    {
      chainId: ChainId.HEMI,
      logo: HemiLogo,
      name: 'Hemi',
    },
  ],
  [
    ChainId.PHAROS_TESTNET,
    {
      chainId: ChainId.PHAROS_TESTNET,
      logo: PharosLogo,
      name: 'Pharos Testnet',
    },
  ],
  [
    ChainId.PHAROS_ATLANTIC_TESTNET,
    {
      chainId: ChainId.PHAROS_ATLANTIC_TESTNET,
      logo: PharosLogo,
      name: 'Pharos Atlantic Testnet',
    },
  ],
]);

export const isTestNet = (chainId: ChainId) => {
  return !!chainListMap.get(chainId)?.mainnet;
};

import { ChainId } from './chains';
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
]);

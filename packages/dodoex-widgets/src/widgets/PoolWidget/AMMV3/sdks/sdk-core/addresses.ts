import {
  getNonfungiblePositionManagerAlgebraContractAddressByChainId,
  getUniswapV3FactoryContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { ChainId, SUPPORTED_CHAINS, SupportedChainsType } from './chains';

type AddressMap = { [chainId: number]: string };

type ChainAddresses = {
  /**
   * UniswapV3Factory
   * @see https://taikoscan.io/address/0x78172691DD3B8ADa7aEbd9bFfB487FB11D735DB2?tab=contract#code
   */
  v3CoreFactoryAddress: string;
  /**
   * NonfungiblePositionManager
   * @see https://taikoscan.io/address/0x2623281DdcC34A73a9e8898f2c57A32A860903f1?tab=contract#code
   */
  nonfungiblePositionManagerAddress?: string;
};

// Networks that share most of the same addresses i.e. Mainnet, Goerli, Optimism, Arbitrum, Polygon
const DEFAULT_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x3d2A7Bac4E8439ABe86B58324695e921a5FC0987',
  nonfungiblePositionManagerAddress:
    '0x483E5c0f309577f79b0a19cE65E332DD388aD7A8',
};
const MAINNET_ADDRESSES: ChainAddresses = {
  ...DEFAULT_ADDRESSES,
};

const ARBITRUM_ONE_ADDRESSES: ChainAddresses = {
  ...DEFAULT_ADDRESSES,
};

// sepolia v3 addresses
const SEPOLIA_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x3d2A7Bac4E8439ABe86B58324695e921a5FC0987',
  nonfungiblePositionManagerAddress:
    '0x483E5c0f309577f79b0a19cE65E332DD388aD7A8',
};

const TAIKO_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x78172691DD3B8ADa7aEbd9bFfB487FB11D735DB2',
  nonfungiblePositionManagerAddress:
    '0x2623281DdcC34A73a9e8898f2c57A32A860903f1',
};

export const CHAIN_TO_ADDRESSES_MAP: Record<number, ChainAddresses> = {
  [ChainId.MAINNET]: MAINNET_ADDRESSES,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_ONE_ADDRESSES,
  [ChainId.SEPOLIA]: SEPOLIA_ADDRESSES,
  [ChainId.TAIKO]: TAIKO_ADDRESSES,
};
const chainIds = Object.values(ChainId).filter((v) => typeof v === 'number');
chainIds.map((id) => {
  if (!CHAIN_TO_ADDRESSES_MAP[id as ChainId]) {
    const v3CoreFactoryAddress =
      getUniswapV3FactoryContractAddressByChainId(id);
    const nonfungiblePositionManagerAddress =
      getNonfungiblePositionManagerAlgebraContractAddressByChainId(id);
    if (v3CoreFactoryAddress && nonfungiblePositionManagerAddress) {
      CHAIN_TO_ADDRESSES_MAP[id] = {
        v3CoreFactoryAddress,
        nonfungiblePositionManagerAddress,
      };
    }
  }
});
/* V3 Contract Addresses */
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = CHAIN_TO_ADDRESSES_MAP[chainId].v3CoreFactoryAddress;
    return memo;
  }, {}),
};

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  ...SUPPORTED_CHAINS.reduce<AddressMap>((memo, chainId) => {
    const nonfungiblePositionManagerAddress =
      CHAIN_TO_ADDRESSES_MAP[chainId].nonfungiblePositionManagerAddress;
    if (nonfungiblePositionManagerAddress) {
      memo[chainId] = nonfungiblePositionManagerAddress;
    }
    return memo;
  }, {}),
};

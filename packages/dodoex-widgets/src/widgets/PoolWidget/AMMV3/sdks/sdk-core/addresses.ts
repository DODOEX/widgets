import { ChainId, SUPPORTED_CHAINS, SupportedChainsType } from './chains';

type AddressMap = { [chainId: number]: string };

type ChainAddresses = {
  v3CoreFactoryAddress: string;
  multicallAddress: string;
  quoterAddress: string;
  v3MigratorAddress?: string;
  nonfungiblePositionManagerAddress?: string;
  tickLensAddress?: string;
  swapRouter02Address?: string;
  mixedRouteQuoterV1Address?: string;
  mixedRouteQuoterV2Address?: string;

  // v4
  v4PoolManagerAddress?: string;
  v4PositionManagerAddress?: string;
  v4StateView?: string;
  v4QuoterAddress?: string;
};

// Networks that share most of the same addresses i.e. Mainnet, Goerli, Optimism, Arbitrum, Polygon
const DEFAULT_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  multicallAddress: '0x1F98415757620B543A52E61c46B32eB19261F984',
  quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  v3MigratorAddress: '0xA5644E29708357803b5A882D272c41cC0dF92B34',
  nonfungiblePositionManagerAddress:
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};
const MAINNET_ADDRESSES: ChainAddresses = {
  ...DEFAULT_ADDRESSES,
  mixedRouteQuoterV1Address: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
};

const ARBITRUM_ONE_ADDRESSES: ChainAddresses = {
  ...DEFAULT_ADDRESSES,
  multicallAddress: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  tickLensAddress: '0xbfd8137f7d1516D3ea5cA83523914859ec47F573',
};

// sepolia v3 addresses
const SEPOLIA_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
  multicallAddress: '0xD7F33bCdb21b359c8ee6F0251d30E94832baAd07',
  quoterAddress: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3',
  v3MigratorAddress: '0x729004182cF005CEC8Bd85df140094b6aCbe8b15',
  nonfungiblePositionManagerAddress:
    '0x1238536071E1c677A632429e3655c799b22cDA52',
  tickLensAddress: '0xd7f33bcdb21b359c8ee6f0251d30e94832baad07',
  swapRouter02Address: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',

  // TODO: update mixedRouteQuoterV2Address once v4 on sepolia redeployed
  mixedRouteQuoterV2Address: '0x4745f77b56a0e2294426e3936dc4fab68d9543cd',

  // TODO: update all below once v4 on sepolia redeployed
  v4PoolManagerAddress: '0x8C4BcBE6b9eF47855f97E675296FA3F6fafa5F1A',
  v4PositionManagerAddress: '0x1B1C77B606d13b09C84d1c7394B96b147bC03147',
  v4StateView: '0x823d45b1329bcF3b369F08F36ba2690Ff8e058C3',
  v4QuoterAddress: '0xCd8716395D55aD17496448a4b2C42557001e9743',
};

export const CHAIN_TO_ADDRESSES_MAP: Record<
  SupportedChainsType,
  ChainAddresses
> = {
  [ChainId.MAINNET]: MAINNET_ADDRESSES,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_ONE_ADDRESSES,
  [ChainId.SEPOLIA]: SEPOLIA_ADDRESSES,
  // TODO
  [ChainId.TAIKO]: SEPOLIA_ADDRESSES,
};

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

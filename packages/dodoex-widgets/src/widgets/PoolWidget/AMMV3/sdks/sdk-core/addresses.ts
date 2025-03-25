import { ChainId } from '@dodoex/api';
import {
  getNonfungiblePositionManagerContractAddressByChainId,
  getUniswapV3FactoryContractAddressByChainId,
} from '@dodoex/dodo-contract-request';

type AddressMap = { [chainId: number]: string };

/* V3 Contract Addresses */
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {};
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {};

const chainIds = Object.values(ChainId).filter((v) => typeof v === 'number');
chainIds.map((id) => {
  const v3CoreFactoryAddress = getUniswapV3FactoryContractAddressByChainId(id);
  const nonfungiblePositionManagerAddress =
    getNonfungiblePositionManagerContractAddressByChainId(id);
  if (v3CoreFactoryAddress) {
    V3_CORE_FACTORY_ADDRESSES[id] = v3CoreFactoryAddress;
  }
  if (nonfungiblePositionManagerAddress) {
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[id] =
      nonfungiblePositionManagerAddress;
  }
});

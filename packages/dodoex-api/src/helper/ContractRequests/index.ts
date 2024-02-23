import { StaticJsonRpcProvider } from '@ethersproject/providers';
import type { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import { BatchThunk, runAll } from './batch';
import contractConfig, { ChainId } from './contractConfig';
import { ABIName } from './abi/abiName';
import { getABI } from './abi';

export interface ContractRequestsConfig {
  rpc?: {
    [chainId: number]: string;
  };
  getProvider?: (chainId: number) => JsonRpcProvider | StaticJsonRpcProvider;
}

export interface Query<T = any> {
  abiName: ABIName;
  contractAddress: string;
  method: string;
  params: Params;
  level?: number;
  /** 有些请求可能比较大或者容易出错，单独发请求 */
  callback?: (res: T) => any;
}

export interface ParamsListQuery<T = any> {
  abiName: ABIName;
  contractAddress?: string;
  method: string;
  paramsList: {
    params: Params;
    level?: number;
    contractAddress?: string;
    callback?: (res: T) => any;
  }[];
  level?: number;
}

export default class ContractRequests {
  private rpc?: ContractRequestsConfig['rpc'];
  private getConfigProvider?: ContractRequestsConfig['getProvider'];
  private staticJsonRpcProviderMap: Map<number, StaticJsonRpcProvider>;
  constructor(config: ContractRequestsConfig) {
    if (!config.rpc && !config.getProvider) {
      throw new Error('rpc and getProvider must have a.');
    }
    this.rpc = config.rpc;
    this.getConfigProvider = config.getProvider;
    this.staticJsonRpcProviderMap = new Map();
  }

  getProvider(chainId: number) {
    const configProvider = this.getConfigProvider?.(chainId);
    if (configProvider) {
      return configProvider;
    }

    const rpcUrl = this.rpc?.[chainId];
    if (!rpcUrl) {
      throw new Error(`ChainId ${chainId} not found`);
    }
    if (this.staticJsonRpcProviderMap.has(chainId)) {
      return this.staticJsonRpcProviderMap.get(
        chainId,
      ) as StaticJsonRpcProvider;
    }
    const result = new StaticJsonRpcProvider(rpcUrl, chainId);
    this.staticJsonRpcProviderMap.set(chainId, result);
    return result;
  }

  getContract(
    chainId: number,
    contractAddress: string,
    contractInterface: ContractInterface,
  ) {
    const provider = this.getProvider(chainId);
    return new Contract(contractAddress, contractInterface, provider);
  }

  getContractInterface(abiName: ABIName) {
    return getABI(abiName);
  }

  async contractCall<T>(
    chainId: ChainId,
    contractAddress: string,
    contractInterface: ContractInterface,
  ) {}

  async multiContractCall<T>(chainId: ChainId, thunk: BatchThunk<T>) {
    const currentContractConfig = contractConfig[chainId as ChainId];
    const { MULTI_CALL } = currentContractConfig;
    const multiContractInterface = await this.getContractInterface(
      ABIName.customMultiCallAggregate,
    );
    const multiContract = this.getContract(
      chainId,
      MULTI_CALL,
      multiContractInterface,
    );
    const [r] = await runAll<T[]>(multiContract, MULTI_CALL, thunk);
    return r as T;
  }
}

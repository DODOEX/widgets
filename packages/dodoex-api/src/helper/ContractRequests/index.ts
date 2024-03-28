import { StaticJsonRpcProvider } from '@ethersproject/providers';
import type { JsonRpcProvider } from '@ethersproject/providers';
import {
  Contract,
  ContractInterface as ContractInterfaceSource,
} from '@ethersproject/contracts';
import { BatchThunk, runAll } from './batch';
import { contractConfig, ChainId } from '../../chainConfig';
import { ABIName } from './abi/abiName';
import { getABI } from './abi';
import type { Query } from './type';
import { Interface } from '@ethersproject/abi';
import { BatchProvider } from './batchProvider';
import BigNumber from 'bignumber.js';
import { decodeFunctionResult, encodeFunctionData } from './encode';

export type { Query } from './type';
export { ABIName } from './abi/abiName';

type ContractInterface = Exclude<ContractInterfaceSource, Interface>;

export interface ContractRequestsConfig {
  debugQuery?: boolean;
  debugProvider?: boolean;
  rpc?: {
    [chainId: number]: string;
  };
  getProvider?: (
    chainId: number,
  ) => JsonRpcProvider | StaticJsonRpcProvider | null;
}

export default class ContractRequests {
  private debugQuery?: boolean;
  private debugProvider?: boolean;
  private rpc?: ContractRequestsConfig['rpc'];
  private getConfigProvider?: ContractRequestsConfig['getProvider'];
  private staticJsonRpcProviderMap: Map<number, StaticJsonRpcProvider>;
  private batchStaticJsonRpcProviderMap: Map<number, BatchProvider>;
  private batchContractMap: Map<number, Map<string, Contract>>;
  /** Used to maintain different batches of requests */
  private subContractRequestsList: Array<ContractRequests> = [];
  constructor(config?: ContractRequestsConfig) {
    this.debugQuery = config?.debugQuery;
    this.debugProvider = config?.debugProvider;
    this.rpc = config?.rpc;
    this.getConfigProvider = config?.getProvider;
    this.staticJsonRpcProviderMap = new Map();
    this.batchStaticJsonRpcProviderMap = new Map();
    this.batchContractMap = new Map();
  }

  setRpc(rpc: ContractRequestsConfig['rpc']) {
    this.rpc = rpc;
    this.subContractRequestsList.forEach((son) => {
      son.setRpc(rpc);
    });
  }

  setGetConfigProvider(getProvider: ContractRequestsConfig['getProvider']) {
    this.getConfigProvider = getProvider;
    this.subContractRequestsList.forEach((son) => {
      son.setGetConfigProvider(getProvider);
    });
    // update cache
    this.batchContractMap = new Map();
    for (const key in this.batchStaticJsonRpcProviderMap) {
      const chainId = Number(key);
      const provider = getProvider ? getProvider(chainId) : null;
      this.batchStaticJsonRpcProviderMap.get(chainId)?.setProvider(provider);
    }
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
    if (this.debugProvider) {
      result.on('debug', console.log);
    }
    this.staticJsonRpcProviderMap.set(chainId, result);
    return result;
  }

  getBatchProvider(chainId: number) {
    const configProvider = this.getConfigProvider?.(chainId);
    const rpcUrl = this.rpc?.[chainId];
    if (!rpcUrl) {
      if (configProvider) {
        return configProvider;
      }
      throw new Error(`ChainId ${chainId} not found`);
    }
    if (this.staticJsonRpcProviderMap.has(chainId)) {
      return this.staticJsonRpcProviderMap.get(
        chainId,
      ) as StaticJsonRpcProvider;
    }
    const result = new BatchProvider(rpcUrl, chainId);
    result.setProvider(configProvider || null);
    if (this.debugProvider) {
      result.on('debug', console.log);
    }
    this.staticJsonRpcProviderMap.set(chainId, result);
    return result;
  }

  /**
   * Create ContractRequests of the same configuration.
   * Updating the configuration of the current ContractRequests will also update the created ContractRequests.
   * Mainly used for different batches of requests
   */
  createContractRequests() {
    const result = new ContractRequests({
      rpc: this.rpc,
      getProvider: this.getConfigProvider,
      debugQuery: this.debugQuery,
      debugProvider: this.debugProvider,
    });
    this.subContractRequestsList.push(result);
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

  getBatchContract(
    chainId: number,
    contractAddress: string,
    contractInterface: ContractInterface,
  ) {
    const chainIdCache = this.batchContractMap.get(chainId);
    if (!chainIdCache) {
      this.batchContractMap.set(chainId, new Map());
    } else {
      if (chainIdCache.has(contractAddress)) {
        return chainIdCache.get(contractAddress) as Contract;
      }
    }
    const provider = this.getBatchProvider(chainId);
    const contract = new Contract(contractAddress, contractInterface, provider);
    this.batchContractMap.get(chainId)?.set(contractAddress, contract);
    return contract;
  }

  async getBatchContractByAbiName(
    chainId: number,
    contractAddress: string,
    abiName: ABIName,
  ) {
    const contractInterface = await this.getContractInterface(abiName);
    return this.getBatchContract(chainId, contractAddress, contractInterface);
  }

  getContractInterface(abiName: ABIName) {
    return getABI(abiName);
  }

  /**
   * Use multiCall contract request
   */
  async callMultiQuery<T = any>(chainId: ChainId, queryList: Array<Query<T>>) {
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

    const thunks: BatchThunk<T> = [];
    const interfaceMap: Map<ABIName, ContractInterface> = new Map();
    const contractMap: Map<ABIName, Contract> = new Map();
    const resultObject: { [key: number]: T } = {};
    for (let i = 0; i < queryList.length; i++) {
      const { contractAddress, method, params, abiName, callback } =
        queryList[i];
      let contract = contractMap.get(abiName);
      if (!contract) {
        const contractInterface = await this.getContractInterface(abiName);
        interfaceMap.set(abiName, contractInterface);
        contract = this.getContract(
          chainId,
          contractAddress,
          contractInterface,
        );
        contractMap.set(abiName, contract);
      }
      const encoded = contract.interface.encodeFunctionData(method, params);
      const callData = {
        to: contractAddress,
        data: encoded,
      };
      thunks.push({
        callData,
        processor: (raw: any) => {
          const decodeIface = new Interface(
            interfaceMap.get(abiName) as ContractInterface,
          );
          const detail = decodeIface.decodeFunctionResult(method, raw) as T;
          if (callback) {
            callback(detail);
          }
          const callbackResult = callback ? callback(detail) : undefined;
          resultObject[i] = callbackResult || detail;
          return resultObject[i];
        },
      });
    }
    const [r] = await runAll<T[]>(multiContract, MULTI_CALL, thunks);
    return r as T;
  }

  async callQuery<T = any>(chainId: ChainId, query: Query<T>) {
    const contractInterface = await this.getContractInterface(query.abiName);
    const contract = this.getContract(
      chainId,
      query.contractAddress,
      contractInterface,
    );
    const result = await contract.callStatic[query.method](...query.params);
    const callbackResult = query.callback ? query.callback(result) : undefined;
    if (callbackResult) return callbackResult as T;
    return result as T;
  }

  /**
   * Multiple requests within a short period of time will be packaged for batch processing.
   */
  async batchCallQuery<T = any>(chainId: ChainId, query: Query<T>) {
    if (this.debugQuery) {
      console.log({
        action: 'batchCallQuery.request',
        chainId,
        query,
      });
    }
    const provider = await this.getBatchProvider(chainId);
    const data = await encodeFunctionData(
      query.abiName,
      query.method,
      query.params,
    );
    const callData = await provider.call({
      to: query.contractAddress,
      data,
    });
    const result = (await decodeFunctionResult(
      query.abiName,
      query.method,
      callData,
    )) as T;
    const callbackResult = query.callback ? query.callback(result) : undefined;
    if (this.debugQuery) {
      console.log({
        action: 'batchCallQuery.response',
        chainId,
        query,
        response: callbackResult,
      });
    }
    if (callbackResult) return callbackResult as T;
    return result as T;
  }

  async getBlockNumber(chainId: ChainId) {
    const provider = this.getBatchProvider(chainId);
    const blockNumber = await provider.getBlockNumber();
    provider.emit('blockNumberChanged', blockNumber);
    return blockNumber;
  }

  async getETHBalance(chainId: ChainId, account: string) {
    const provider = this.getProvider(chainId);
    const balance = await provider.getBalance(account);
    return new BigNumber(balance.toString()).div(1e18);
  }
}

import { StaticJsonRpcProvider } from '@ethersproject/providers';
import type { JsonRpcProvider } from '@ethersproject/providers';
import {
  Contract,
  ContractInterface as ContractInterfaceSource,
} from '@ethersproject/contracts';
import { BatchThunk, runAll } from './batch';
import contractConfig, { ChainId } from './contractConfig';
import { ABIName } from './abi/abiName';
import { getABI } from './abi';
import { Interface } from '@ethersproject/abi';

type ContractInterface = Exclude<ContractInterfaceSource, Interface>;

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
  params: readonly any[];
  callback?: (res: T) => any;
}

export default class ContractRequests {
  private rpc?: ContractRequestsConfig['rpc'];
  private getConfigProvider?: ContractRequestsConfig['getProvider'];
  private staticJsonRpcProviderMap: Map<number, StaticJsonRpcProvider>;
  constructor(config?: ContractRequestsConfig) {
    this.rpc = config?.rpc;
    this.getConfigProvider = config?.getProvider;
    this.staticJsonRpcProviderMap = new Map();
  }

  setRpc(rpc: ContractRequestsConfig['rpc']) {
    this.rpc = rpc;
  }

  setGetConfigProvider(getProvider: ContractRequestsConfig['getProvider']) {
    this.getConfigProvider = getProvider;
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

  async singleContractCall<T>(chainId: ChainId, query: Query<T>) {
    const contractInterface = await this.getContractInterface(query.abiName);
    const contract = this.getContract(
      chainId,
      query.contractAddress,
      contractInterface,
    );
    const result = await contract.callStatic[query.method](...query.params);
    return result as T;
  }

  async multiContractCall<T = any>(
    chainId: ChainId,
    queryList: Array<Query<T>>,
  ) {
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
          resultObject[i] = detail;
          return detail;
        },
      });
    }
    const [r] = await runAll<T[]>(multiContract, MULTI_CALL, thunks);
    return r as T;
  }

  async contractCall<T>(chainId: ChainId, queryList: Array<Query<T>>) {
    if (queryList.length === 1) {
      const result = await this.singleContractCall(chainId, queryList[0]);
      return [result];
    }
    return this.multiContractCall(chainId, queryList);
  }
}

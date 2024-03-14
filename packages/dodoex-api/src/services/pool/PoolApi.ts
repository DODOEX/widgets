import ContractRequests, {
  ContractRequestsConfig,
  Query,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { byWei } from '../../utils/number';
import { poolUtils } from './poolUtils';
import { poolGraphqlQuery } from './graphqlQuery';
import { PoolType } from './type';

export interface PoolApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

type PoolTypeMethodObject = {
  [key in PoolType]: string | null;
};

const poolTypeAbiNameObject: {
  [key in PoolType]: ABIName;
} = {
  DVM: ABIName.dvmPoolABI,
  DSP: ABIName.dvmPoolABI,
  LPTOKEN: ABIName.dvmPoolABI,
  CLASSICAL: ABIName.classicalPoolABI,
  V3CLASSICAL: ABIName.classicalPoolABI,
  DPP: ABIName.dppPoolABI,
};

function getPoolQueryFactory({
  poolAddress,
  type,
  typeMethodObject,
  params = [],
}: {
  poolAddress: string;
  type: PoolType;
  typeMethodObject: {
    [key in PoolType]: string | null;
  };
  params?: any[];
}) {
  const method = typeMethodObject[type];
  if (!method) return null;
  return {
    abiName: poolTypeAbiNameObject[type],
    contractAddress: poolAddress,
    method,
    params,
  };
}

export class PoolApi {
  contractRequests: ContractRequests;
  constructor(config: PoolApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('PoolApi does not initialize the contractRequests');
    }
  }

  static graphql = poolGraphqlQuery;

  static utils = poolUtils;

  getTotalBaseLpQuery(
    chainId: number,
    poolAddress: string,
    type: PoolType,
    decimals: number,
  ) {
    return {
      queryKey: ['pool', 'getTotalBaseLpQuery', ...arguments],
      queryFn: async () => {
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'totalSupply',
          DSP: 'totalSupply',
          LPTOKEN: 'totalSupply',
          CLASSICAL: 'getTotalBaseCapital',
          V3CLASSICAL: 'getTotalBaseCapital',
          DPP: null,
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
        });
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getTotalQuoteLpQuery(
    chainId: number,
    poolAddress: string,
    type: PoolType,
    decimals: number,
  ) {
    return {
      queryKey: ['pool', 'getTotalQuoteLp', ...arguments],
      queryFn: async () => {
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          LPTOKEN: null,
          CLASSICAL: 'getTotalQuoteCapital',
          V3CLASSICAL: 'getTotalQuoteCapital',
          DPP: null,
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
        });
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getUserBaseLpQuery(
    chainId: number,
    poolAddress: string,
    type: PoolType,
    decimals: number,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserBaseLp', ...arguments],
      queryFn: async () => {
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'balanceOf',
          DSP: 'balanceOf',
          LPTOKEN: 'balanceOf',
          CLASSICAL: 'getBaseCapitalBalanceOf',
          V3CLASSICAL: 'getBaseCapitalBalanceOf',
          DPP: null,
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
          params: [account],
        });
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getUserQuoteLpQuery(
    chainId: number,
    poolAddress: string,
    type: PoolType,
    decimals: number,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserQuoteLp', ...arguments],
      queryFn: async () => {
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          LPTOKEN: null,
          CLASSICAL: 'getQuoteCapitalBalanceOf',
          V3CLASSICAL: 'getQuoteCapitalBalanceOf',
          DPP: null,
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
          params: [account],
        });
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getReserveLpQuery(
    chainId: number,
    poolAddress: string,
    type: PoolType,
    baseDecimals: number,
    quoteDecimals: number,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getReserveLp', ...arguments],
      queryFn: async () => {
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'getVaultReserve',
          DSP: 'getVaultReserve',
          LPTOKEN: 'getVaultReserve',
          CLASSICAL: 'getExpectedTarget',
          V3CLASSICAL: 'getExpectedTarget',
          DPP: 'getVaultReserve',
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
          params: [account],
        });
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        if (['CLASSICAL', 'V3CLASSICAL'].includes(type)) {
          return {
            baseReserve: byWei(result.baseTarget, baseDecimals),
            quoteReserve: byWei(result.quoteTarget, quoteDecimals),
          };
        }
        return {
          baseReserve: byWei(result.baseReserve, baseDecimals),
          quoteReserve: byWei(result.quoteReserve, quoteDecimals),
        };
      },
    };
  }

  getTotalBaseMiningLpQuery(
    chainId: number,
    baseMiningContractAddress: string | undefined,
    type: PoolType,
    baseLpTokenAddress: string | undefined,
    decimals: number,
  ) {
    return {
      queryKey: ['pool', 'getTotalBaseMiningLp', ...arguments],
      queryFn: async () => {
        if (!baseMiningContractAddress) return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'balanceOf',
          DSP: 'totalSupply',
          LPTOKEN: 'totalSupply',
          CLASSICAL: 'balanceOf',
          V3CLASSICAL: 'totalSupply',
          DPP: null,
        };
        let query: Query | undefined;
        const method = typeMethodObject[type];
        if (!method) return null;
        if (PoolApi.utils.getIsV3Mining(type)) {
          query = {
            abiName: ABIName.v3MiningABI,
            contractAddress: baseMiningContractAddress,
            method,
            params: [],
          };
        } else {
          if (!baseLpTokenAddress) return null;
          // v2 dvm, v2 classical
          query = {
            abiName: ABIName.dodoMiningABI,
            contractAddress: baseLpTokenAddress,
            method,
            params: [baseMiningContractAddress],
          };
        }
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getTotalQuoteMiningLpQuery(
    chainId: number,
    quoteMiningContractAddress: string | undefined,
    type: PoolType,
    quoteLpTokenAddress: string | undefined,
    decimals: number,
  ) {
    return {
      queryKey: ['pool', 'getTotalQuoteMiningLp', ...arguments],
      queryFn: async () => {
        if (!quoteMiningContractAddress) return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          LPTOKEN: null,
          CLASSICAL: 'balanceOf',
          V3CLASSICAL: 'totalSupply',
          DPP: null,
        };
        let query: Query | undefined;
        const method = typeMethodObject[type];
        if (!method) return null;
        if (PoolApi.utils.getIsV3Mining(type)) {
          query = {
            abiName: ABIName.v3MiningABI,
            contractAddress: quoteMiningContractAddress,
            method,
            params: [],
          };
        } else {
          if (!quoteLpTokenAddress) return null;
          // v2 dvm, v2 classical
          query = {
            abiName: ABIName.dodoMiningABI,
            contractAddress: quoteLpTokenAddress,
            method,
            params: [quoteMiningContractAddress],
          };
        }
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getUserBaseMiningLpQuery(
    chainId: number,
    baseMiningContractAddress: string | undefined,
    type: PoolType,
    baseLpTokenAddress: string | undefined,
    decimals: number,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserBaseMiningLp', ...arguments],
      queryFn: async () => {
        if (!account || !baseMiningContractAddress) return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'getUserLpBalance',
          DSP: 'balanceOf',
          LPTOKEN: 'balanceOf',
          CLASSICAL: 'getUserLpBalance',
          V3CLASSICAL: 'balanceOf',
          DPP: null,
        };
        let query: Query | undefined;
        const method = typeMethodObject[type];
        if (!method) return null;
        if (PoolApi.utils.getIsV3Mining(type)) {
          query = {
            abiName: ABIName.v3MiningABI,
            contractAddress: baseMiningContractAddress,
            method,
            params: [account],
          };
        } else {
          if (!baseLpTokenAddress) return null;
          // v2 dvm, v2 classical
          query = {
            abiName: ABIName.dodoMiningABI,
            contractAddress: baseMiningContractAddress,
            method,
            params: [baseLpTokenAddress, account],
          };
        }
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }

  getUserQuoteMiningLpQuery(
    chainId: number,
    quoteMiningContractAddress: string | undefined,
    type: PoolType,
    quoteLpTokenAddress: string | undefined,
    decimals: number,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserQuoteMiningLp', ...arguments],
      queryFn: async () => {
        if (!account || !quoteMiningContractAddress) return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          LPTOKEN: null,
          CLASSICAL: 'getUserLpBalance',
          V3CLASSICAL: 'balanceOf',
          DPP: null,
        };
        let query: Query | undefined;
        const method = typeMethodObject[type];
        if (!method) return null;
        if (PoolApi.utils.getIsV3Mining(type)) {
          query = {
            abiName: ABIName.v3MiningABI,
            contractAddress: quoteMiningContractAddress,
            method,
            params: [account],
          };
        } else {
          if (!quoteLpTokenAddress) return null;
          // v2 dvm, v2 classical
          query = {
            abiName: ABIName.dodoMiningABI,
            contractAddress: quoteMiningContractAddress,
            method,
            params: [quoteLpTokenAddress, account],
          };
        }
        if (!query) return null;
        const result = await this.contractRequests.batchCallQuery(
          chainId,
          query,
        );
        return byWei(result, decimals);
      },
    };
  }
}

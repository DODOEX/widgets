import ContractRequests, {
  ContractRequestsConfig,
  Query,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { byWei } from '../../utils/number';
import { poolUtils } from './poolUtils';
import { poolGraphqlQuery } from './graphqlQuery';
import { PoolType } from './type';
import BigNumber from 'bignumber.js';
import contractMap, {
  ChainId,
} from '../../helper/ContractRequests/contractConfig';
import { PMMHelper } from './pmm/pmmHelper';
import { PMMState } from './pmm/PMMState';
import { convertPmmParams } from './pmm/convertPmmParams';

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

  /**
   * Get existing lp balance
   * The CLASSICAL,V3CLASSICAL pool will only return base, other pools will return all
   */
  getTotalBaseLpQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
  ) {
    return {
      queryKey: ['pool', 'getTotalBaseLpQuery', ...arguments],
      enabled: !!poolAddress && !!type && decimals !== undefined,
      queryFn: async () => {
        if (!poolAddress || !type || decimals === undefined) return null;
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

  /**
   * Get existing quote lp balance
   * Only CLASSICAL,V3CLASSICAL pool exists
   */
  getTotalQuoteLpQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
  ) {
    return {
      queryKey: ['pool', 'getTotalQuoteLp', ...arguments],
      enabled: !!poolAddress && !!type && decimals !== undefined,
      queryFn: async () => {
        if (!poolAddress || !type || decimals === undefined) return null;
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

  /**
   * Get the user's existing lp balance
   * The CLASSICAL,V3CLASSICAL pool will only return base, other pools will return all
   */
  getUserBaseLpQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserBaseLp', ...arguments],
      enabled: !!poolAddress && !!type && decimals !== undefined && !!account,
      queryFn: async () => {
        if (!(!!poolAddress && !!type && decimals !== undefined && !!account))
          return null;
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

  /**
   * Get the user's existing quote lp balance
   * Only CLASSICAL,V3CLASSICAL pool exists
   */
  getUserQuoteLpQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getUserQuoteLp', ...arguments],
      enabled: !!poolAddress && !!type && decimals !== undefined && !!account,
      queryFn: async () => {
        if (!(!!poolAddress && !!type && decimals !== undefined && !!account))
          return null;
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

  /**
   * Get the total deposited lp balance
   */
  getReserveLpQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
    account: string | undefined,
  ) {
    if (type === 'CLASSICAL') {
      const query = this.getPMMStateQuery(
        chainId,
        poolAddress,
        type,
        baseDecimals,
        quoteDecimals,
      );
      return {
        ...query,
        queryFn: async () => {
          const pmmStateResult = await query.queryFn();
          if (!pmmStateResult) return pmmStateResult;
          return {
            baseReserve: pmmStateResult.pmmParamsBG.b,
            quoteReserve: pmmStateResult.pmmParamsBG.q,
          };
        },
      };
    }
    return {
      queryKey: ['pool', 'getReserveLp', ...arguments],
      enabled:
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !(
            !!poolAddress &&
            !!type &&
            baseDecimals !== undefined &&
            quoteDecimals !== undefined
          )
        )
          return null;

        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'getVaultReserve',
          DSP: 'getVaultReserve',
          LPTOKEN: 'getVaultReserve',
          CLASSICAL: null,
          V3CLASSICAL: null,
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
        return {
          baseReserve: byWei(result.baseReserve, baseDecimals),
          quoteReserve: byWei(result.quoteReserve, quoteDecimals),
        };
      },
    };
  }

  /**
   * Get Classical equilibrium target
   */
  getClassicalTargetQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: ['pool', 'getClassicalTargetQuery', ...arguments],
      enabled:
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !(
            !!poolAddress &&
            !!type &&
            baseDecimals !== undefined &&
            quoteDecimals !== undefined &&
            ['CLASSICAL', 'V3CLASSICAL'].includes(type)
          )
        )
          return null;
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: poolTypeAbiNameObject[type],
          contractAddress: poolAddress,
          method: 'getExpectedTarget',
          params: [account],
        });
        return {
          baseTarget: byWei(result.baseTarget, baseDecimals),
          quoteTarget: byWei(result.quoteTarget, quoteDecimals),
        };
      },
    };
  }

  getTotalBaseMiningLpQuery(
    chainId: number,
    baseMiningContractAddress: string | undefined,
    type: PoolType | undefined,
    baseLpTokenAddress: string | undefined,
    decimals: number | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: ['pool', 'getTotalBaseMiningLp', ...arguments],
      enabled:
        !!baseMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!baseLpTokenAddress),
      queryFn: async () => {
        if (
          !(
            !!baseMiningContractAddress &&
            !!type &&
            decimals !== undefined &&
            (isV3Mining || !!baseLpTokenAddress)
          )
        )
          return null;
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
        if (isV3Mining) {
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
    type: PoolType | undefined,
    quoteLpTokenAddress: string | undefined,
    decimals: number | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: ['pool', 'getTotalQuoteMiningLp', ...arguments],
      enabled:
        !!quoteMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!quoteLpTokenAddress),
      queryFn: async () => {
        if (!quoteMiningContractAddress || !type || decimals === undefined)
          return null;
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
        if (isV3Mining) {
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
    type: PoolType | undefined,
    baseLpTokenAddress: string | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: ['pool', 'getUserBaseMiningLp', ...arguments],
      enabled:
        !!account &&
        !!baseMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!baseLpTokenAddress),
      queryFn: async () => {
        if (
          !account ||
          !baseMiningContractAddress ||
          !type ||
          decimals === undefined
        )
          return null;
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
    type: PoolType | undefined,
    quoteLpTokenAddress: string | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: ['pool', 'getUserQuoteMiningLp', ...arguments],
      enabled:
        !!account &&
        !!quoteMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!quoteLpTokenAddress),
      queryFn: async () => {
        if (
          !account ||
          !quoteMiningContractAddress ||
          !type ||
          decimals === undefined
        )
          return null;
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

  getPMMStateQuery(
    chainId: number,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
  ) {
    return {
      queryKey: ['pool', 'getPMMStateQuery', ...arguments],
      enabled:
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !poolAddress ||
          !type ||
          baseDecimals === undefined ||
          quoteDecimals === undefined
        )
          return null;
        let queryResult = '';
        if (type === 'CLASSICAL') {
          const { ROUTE_V1_DATA_FETCH } = contractMap[chainId as ChainId];
          queryResult = await this.contractRequests.batchCallQuery(chainId, {
            abiName: ABIName.DODOV1PmmHelperABI,
            contractAddress: ROUTE_V1_DATA_FETCH,
            method: 'getPairDetail',
            params: [poolAddress],
          });
        } else if (['DVM', 'DPP', 'LPTOKEN', 'DSP'].includes(type)) {
          queryResult = await this.contractRequests.batchCallQuery(chainId, {
            abiName: ABIName.dvmPoolABI,
            contractAddress: poolAddress,
            method: 'getPMMStateForCall',
            params: [],
          });
        } else {
          throw new Error(`type: ${type} not supported`);
        }

        const pmmParamsBG = convertPmmParams(
          queryResult,
          type,
          baseDecimals,
          quoteDecimals,
        );

        let midPrice: BigNumber | undefined;

        if (
          (pmmParamsBG.q.isEqualTo(0) && pmmParamsBG.R === 2) ||
          (pmmParamsBG.b.isEqualTo(0) &&
            (pmmParamsBG.R === 1 || pmmParamsBG.R === 0))
        ) {
          //
        } else {
          const pmm = new PMMHelper();
          const pmmState = new PMMState({
            Q: pmmParamsBG.q,
            B: pmmParamsBG.b,
            K: pmmParamsBG.k,
            i: pmmParamsBG.i,
            B0: pmmParamsBG.b0,
            Q0: pmmParamsBG.q0,
            R: pmmParamsBG.R,
            // Just to calculate midPrice, without considering the handling fee
            mtFeeRate: new BigNumber(0),
            lpFeeRate: new BigNumber(0),
          });
          midPrice = pmm.GetMidPrice(pmmState);
          if (midPrice.isNaN()) {
            midPrice = undefined;
          }
        }

        return {
          midPrice,
          pmmParamsBG,
        };
      },
    };
  }
}

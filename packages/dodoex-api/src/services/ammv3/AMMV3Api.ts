import BigNumber from 'bignumber.js';
import { ChainId, contractConfig } from '../../chainConfig';
import ContractRequests, {
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { encodeFunctionData } from '../../helper/ContractRequests/encode';
import { AllV3TicksDocument } from './queries';
import { poolUtils } from '../pool/poolUtils';

export interface AMMV3ApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

export class AMMV3Api {
  contractRequests: ContractRequests;
  constructor(config: AMMV3ApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('AMMV3Api does not initialize the contractRequests');
    }
  }

  static graphql = {
    AllV3TicksDocument,
  };

  static utils = poolUtils;

  static encode = {
    async addDVMLiquidityABI(
      chainId: number,
      dvmAddress: string,
      baseInAmount: string,
      quoteInAmount: string,
      baseMinAmount: string,
      quoteMinAmount: string,
      flag: number,
      deadline: number,
    ) {
      if (!baseMinAmount || baseMinAmount === '0') {
        throw new Error('Invalid baseMinAmount');
      }
      const { DODO_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoProxyV2,
        'addDVMLiquidity',
        [
          dvmAddress,
          baseInAmount,
          quoteInAmount,
          baseMinAmount,
          quoteMinAmount,
          flag,
          deadline,
        ],
      );
      return {
        to: DODO_PROXY,
        data,
      };
    },
  };

  getPositions(
    chainId: number | undefined,
    contractAddress: string | undefined,
    inputs: string[][],
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'ammv3', 'getPositions', ...arguments],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }

        const result = await this.contractRequests.callMultiQuery(
          chainId,
          inputs.map((input) => {
            return {
              abiName: ABIName.NonfungiblePositionManager,
              contractAddress,
              method: 'positions',
              params: input,
            };
          }),
        );
        return result;
      },
    };
  }

  getBalanceOf(
    chainId: number | undefined,
    contractAddress: string | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'ammv3', 'getBalanceOf', ...arguments],
      enabled: !!chainId && !!contractAddress && !!account,
      queryFn: async () => {
        if (!chainId || !contractAddress || !account) {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.NonfungiblePositionManager,
          contractAddress: contractAddress,
          method: 'balanceOf',
          params: [account],
        });
        const balance = new BigNumber(result.toString());
        return balance;
      },
    };
  }

  getTokenOfOwnerByIndex(
    chainId: number | undefined,
    contractAddress: string | undefined,
    tokenIdsArgs: (string | number)[][],
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'ammv3',
        'getTokenOfOwnerByIndex',
        ...arguments,
      ],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }

        const result = await this.contractRequests.callMultiQuery(
          chainId,
          tokenIdsArgs.map((tokenIdsArg) => {
            return {
              abiName: ABIName.NonfungiblePositionManager,
              contractAddress,
              method: 'tokenOfOwnerByIndex',
              params: tokenIdsArg.map((i) => i.toString()),
            };
          }),
        );
        return result;
      },
    };
  }

  getV3PoolSlot0(chainId: number | undefined, poolAddress: string | undefined) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'ammv3', 'getSlot0', ...arguments],
      enabled: !!chainId || !!poolAddress,
      queryFn: async () => {
        if (!chainId || !poolAddress) {
          return null;
        }

        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.UniswapV3Pool,
          contractAddress: poolAddress,
          method: 'slot0',
          params: [],
        });
        return result;
      },
    };
  }

  getV3PoolLiquidity(
    chainId: number | undefined,
    poolAddress: string | undefined,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'ammv3',
        'getV3PoolLiquidity',
        ...arguments,
      ],
      enabled: !!chainId || !!poolAddress,
      queryFn: async () => {
        if (!chainId || !poolAddress) {
          return null;
        }

        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.UniswapV3Pool,
          contractAddress: poolAddress,
          method: 'liquidity',
          params: [],
        });
        return result;
      },
    };
  }
}

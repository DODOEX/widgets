import { BigNumber as BigNumberE } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import ContractRequests, {
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { AllV3TicksDocument } from './queries';

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

  static encode = {};

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

  getOwner(
    chainId: number | undefined,
    contractAddress: string | undefined,
    tokenId: string,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'ammv3', 'getOwner', ...arguments],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }

        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.NonfungiblePositionManager,
          contractAddress,
          method: 'ownerOf',
          params: [tokenId],
        });
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

  getCollect(
    chainId: number | undefined,
    contractAddress: string | undefined,
    tokenId: string,
    recipient: string,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'ammv3', 'getCollect', ...arguments],
      enabled: !!chainId || !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress || !tokenId || !recipient) {
          return null;
        }
        const MAX_UINT128 = BigNumberE.from(2).pow(128).sub(1);
        const result = await this.contractRequests.callQuery(chainId, {
          abiName: ABIName.NonfungiblePositionManager,
          contractAddress,
          method: 'collect',
          params: [
            {
              tokenId,
              recipient, // some tokens might fail if transferred to address(0)
              amount0Max: MAX_UINT128,
              amount1Max: MAX_UINT128,
            },
            { from: recipient }, // need to simulate the call as the owner
          ],
        });
        return result;
      },
    };
  }
}

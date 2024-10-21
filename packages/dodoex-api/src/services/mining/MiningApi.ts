import { parseFixed } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import { ChainId } from '../../chainConfig/chain';
import contractConfig from '../../chainConfig/contractConfig';
import ContractRequests, {
  ABIName,
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { encodeFunctionDataByFragments } from '../../helper/ContractRequests/encode';
import { byWei } from '../../utils/number';
import { miningGraphqlQuery } from './graphqlQuery';
import { miningUtils } from './utils';

const miningFragments = [
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimAllRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'stakeToken', type: 'address' },
      { internalType: 'bool', name: 'isLpToken', type: 'bool' },
      { internalType: 'uint256', name: 'platform', type: 'uint256' },
      {
        internalType: 'address[]',
        name: 'rewardTokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'rewardPerBlock',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'startBlock',
        type: 'uint256[]',
      },
      { internalType: 'uint256[]', name: 'endBlock', type: 'uint256[]' },
    ],
    name: 'createDODOMineV3',
    outputs: [{ internalType: 'address', name: 'newMineV3', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export interface MiningApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

export class MiningApi {
  contractRequests: ContractRequests;
  constructor(config: MiningApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('MiningApi does not initialize the contractRequests');
    }
  }

  static utils = miningUtils;

  static graphql = miningGraphqlQuery;

  static encode = {
    async depositMining(
      miningContractAddress: string,
      amount: BigNumber,
      decimals: number,
    ) {
      const data = encodeFunctionDataByFragments(miningFragments, 'deposit', [
        parseFixed(
          amount.dp(decimals, BigNumber.ROUND_FLOOR).toString(),
          decimals,
        ).toString(),
      ]);

      return {
        to: miningContractAddress,
        data,
      };
    },

    async withdrawMining(
      miningContractAddress: string,
      amount: BigNumber,
      decimals: number,
    ) {
      const data = encodeFunctionDataByFragments(miningFragments, 'withdraw', [
        parseFixed(
          amount.dp(decimals, BigNumber.ROUND_FLOOR).toString(),
          decimals,
        ).toString(),
      ]);

      return {
        to: miningContractAddress,
        data,
      };
    },

    async claimAllMining(miningContractAddress: string) {
      const data = encodeFunctionDataByFragments(
        miningFragments,
        'claimAllRewards',
        [],
      );

      return {
        to: miningContractAddress,
        data,
      };
    },

    async createDODOMineV3(
      chainId: ChainId,
      stakeToken: string,
      isLpToken: boolean,
      platform: number,
      rewardTokens: string[],
      rewardPerBlock: string[],
      startBlock: number[],
      endBlock: number[],
    ) {
      const { DODO_MINEV3_PROXY } = contractConfig[chainId as ChainId];
      if (!DODO_MINEV3_PROXY) {
        return null;
      }
      const data = encodeFunctionDataByFragments(
        miningFragments,
        'createDODOMineV3',
        [
          stakeToken,
          isLpToken,
          platform,
          rewardTokens,
          rewardPerBlock,
          startBlock,
          endBlock,
        ],
      );

      return {
        to: DODO_MINEV3_PROXY,
        data,
      };
    },
  };

  getPendingRewardQuery(
    chainId: number | undefined,
    contractAddress: string | undefined,
    account: string | undefined,
    tokenAddress: string | undefined,
    tokenDecimals: number | undefined,
    version: '2' | '3' | null | undefined,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'mining',
        'getPendingRewardQuery',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!contractAddress &&
        !!account &&
        !!tokenAddress &&
        tokenDecimals !== undefined,
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!contractAddress &&
            !!account &&
            !!tokenAddress &&
            tokenDecimals !== undefined
          )
        )
          return null;

        let result: any;
        switch (version) {
          case '3':
            result = await this.contractRequests.batchCallQuery(chainId, {
              abiName: ABIName.v3MiningABI,
              contractAddress,
              method: 'getPendingRewardByToken',
              params: [account, tokenAddress],
            });
            break;

          default:
            result = await this.contractRequests.batchCallQuery(chainId, {
              abiName: ABIName.dodoMiningABI,
              contractAddress,
              method: 'getPendingReward',
              params: [tokenAddress, account],
            });
            break;
        }
        return byWei(result, tokenDecimals);
      },
    };
  }

  getLpStakedBalance(
    chainId: number | undefined,
    contractAddress: string | undefined,
    account: string | undefined,
    tokenAddress: string | undefined,
    tokenDecimals: number | undefined,
    version: '2' | '3' | null | undefined,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'mining',
        'getLpStakedBalance',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!contractAddress &&
        !!account &&
        tokenDecimals !== undefined &&
        (version === '3' || !!tokenAddress),
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!contractAddress &&
            !!account &&
            tokenDecimals !== undefined &&
            (version === '3' || !!tokenAddress)
          )
        )
          return null;

        let result: any;
        switch (version) {
          case '3':
            result = await this.contractRequests.batchCallQuery(chainId, {
              abiName: ABIName.v3MiningABI,
              contractAddress,
              method: 'balanceOf',
              params: [account],
            });
            break;

          default:
            result = await this.contractRequests.batchCallQuery(chainId, {
              abiName: ABIName.dodoMiningABI,
              contractAddress,
              method: 'getUserLpBalance',
              params: [account, tokenAddress],
            });
            break;
        }
        return byWei(result, tokenDecimals);
      },
    };
  }

  getRewardTokenInfos(
    chainId: number | undefined,
    miningContractAddress: string | undefined,
    index: number,
    skip?: Boolean,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'mining',
        'getRewardTokenInfos',
        ...arguments,
      ],
      enabled:
        chainId != null &&
        miningContractAddress != null &&
        index != null &&
        !skip,
      queryFn: async () => {
        if (!chainId || !miningContractAddress) {
          return null;
        }

        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.v3MiningABI,
          contractAddress: miningContractAddress,
          method: 'rewardTokenInfos',
          params: [index],
        });
        return result ?? null;
      },
    };
  }
}

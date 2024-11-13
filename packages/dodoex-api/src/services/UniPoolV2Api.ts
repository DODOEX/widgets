import { ChainId, contractConfig } from '../chainConfig';
import ContractRequests, {
  ABIName,
  ContractRequestsConfig,
} from '../helper/ContractRequests';
import { BigNumber as BigNumberEther } from '@ethersproject/bignumber';
import { encodeFunctionData } from '../helper/ContractRequests/encode';

export interface UniPoolV2ApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

export class UniPoolV2Api {
  contractRequests: ContractRequests;
  constructor(config: UniPoolV2ApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('TokenApi does not initialize the contractRequests');
    }
  }

  static encode = {
    async addLiquidityABI(
      chainId: ChainId,
      tokenA: string,
      tokenB: string,
      baseInAmount: string,
      quoteInAmount: string,
      baseInAmountMin: string,
      quoteInAmountMin: string,
      account: string,
      deadline: number,
      fee?: string,
    ) {
      const { AMM_V2_ROUTER_ADDRESS } = contractConfig[chainId];
      const data = await encodeFunctionData(
        ABIName.IUniswapV2Router02,
        'addLiquidity',
        [
          tokenA,
          tokenB,
          fee,
          baseInAmount,
          quoteInAmount,
          baseInAmountMin,
          quoteInAmountMin,
          account,
          deadline,
        ],
      );
      return {
        data,
        to: AMM_V2_ROUTER_ADDRESS ?? '',
      };
    },
    async addLiquidityETHABI(
      chainId: ChainId,
      tokenAddress: string,
      tokenInAmount: string,
      tokenInAmountMin: string,
      ethAmountMin: string,
      account: string,
      deadline: number,
      fee?: string,
    ) {
      const { AMM_V2_ROUTER_ADDRESS } = contractConfig[chainId];
      const data = await encodeFunctionData(
        ABIName.IUniswapV2Router02,
        'addLiquidityETH',
        [
          tokenAddress,
          fee,
          tokenInAmount,
          tokenInAmountMin,
          ethAmountMin,
          account,
          deadline,
        ],
      );
      return {
        data,
        to: AMM_V2_ROUTER_ADDRESS ?? '',
      };
    },
  };

  getReserves(chainId: number | undefined, address: string | undefined) {
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        'AMMV2Pool',
        'getReserves',
        chainId ?? '',
        address?.toLocaleLowerCase(),
      ],
      enabled: !!chainId && !!address,
      queryFn: async () => {
        if (!chainId || !address) return null;

        const result = await this.contractRequests.batchCallQuery<{
          _reserve0: BigNumberEther;
          _reserve1: BigNumberEther;
          _blockTimestampLast: number;
        }>(chainId, {
          abiName: ABIName.IUniswapV2Pair,
          contractAddress: address,
          method: 'getReserves',
          params: [],
        });
        return result;
      },
    };
  }

  getTotalSupply(chainId: number | undefined, address: string | undefined) {
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        'AMMV2Pool',
        'getTotalSupply',
        chainId ?? '',
        address?.toLocaleLowerCase(),
      ],
      enabled: !!chainId && !!address,
      queryFn: async () => {
        if (!chainId || !address) return null;

        const result = await this.contractRequests.batchCallQuery<
          [BigNumberEther]
        >(chainId, {
          abiName: ABIName.IUniswapV2Pair,
          contractAddress: address,
          method: 'totalSupply',
          params: [],
        });
        return result?.[0];
      },
    };
  }

  getBalance(
    chainId: number | undefined,
    address: string | undefined,
    account: string | undefined,
  ) {
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        'AMMV2Pool',
        'getBalance',
        chainId ?? '',
        address?.toLocaleLowerCase(),
        account ?? '',
      ],
      enabled: !!chainId && !!address && !!account,
      queryFn: async () => {
        if (!chainId || !address || !account) return null;

        const result = await this.contractRequests.batchCallQuery<
          [BigNumberEther]
        >(chainId, {
          abiName: ABIName.IUniswapV2Pair,
          contractAddress: address,
          method: 'balanceOf',
          params: [account],
        });
        return result?.[0];
      },
    };
  }
}

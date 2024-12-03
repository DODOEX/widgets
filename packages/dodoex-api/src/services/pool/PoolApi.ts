import { parseFixed } from '@ethersproject/bignumber';
import ContractRequests, {
  ContractRequestsConfig,
  CONTRACT_QUERY_KEY,
  Query,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { byWei } from '../../utils/number';
import { poolUtils } from './poolUtils';
import { poolGraphqlQuery } from './graphqlQuery';
import { PoolType } from './type';
import BigNumber from 'bignumber.js';
import { contractConfig, ChainId } from '../../chainConfig';
import { PMMHelper } from './pmm/pmmHelper';
import { PMMState } from './pmm/PMMState';
import { convertPmmParams, PmmData } from './pmm/convertPmmParams';
import { encodeFunctionData } from '../../helper/ContractRequests/encode';
import {
  fetchUniswapV2PairBalanceOf,
  fetchUniswapV2PairTotalSupply,
  fetchUniswapV2PairGetReserves,
  fetchUniswapV2PairFeeRate,
} from '@dodoex/dodo-contract-request';
import { formatUnits } from '@dodoex/contract-request';

export interface PoolApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

type PoolTypeMethodObject = {
  [key in PoolType]?: string | null;
};

const poolTypeAbiNameObject: {
  [key in PoolType]?: ABIName;
} = {
  DVM: ABIName.dvmPoolABI,
  DSP: ABIName.dvmPoolABI,
  GSP: ABIName.dvmPoolABI,
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
    [key in PoolType]?: string | null;
  };
  params?: any[];
}) {
  const method = typeMethodObject[type];
  if (!method) return null;
  const abiName = poolTypeAbiNameObject[type];
  if (!abiName) return null;
  return {
    abiName,
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

  static encode = {
    /**
     * @notice Create DSP pool
     * @param baseToken     {"decimals","address"}
     * @param quoteToken    {"decimals","address"}
     * @param baseInAmount  The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount The initial amount of liquidity quote provided (considering decimals)
     * @param lpFeeRate     Example: 0.0001 is passed in 1
     * @param i             Decimals are not considered
     * @param k             Scope: 0 => 1
     * @param deadline      Deadline timestamp in seconds
     */
    async createDSPPoolABI(
      chainId: number,
      baseToken: { decimals: number; address: string },
      quoteToken: { decimals: number; address: string },
      baseInAmount: string,
      quoteInAmount: string,
      lpFeeRate: number,
      i: string,
      k: number,
      deadline: number,
      isOpenTWAP = false,
    ) {
      const { DODO_DSP_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoDspProxy,
        'createDODOStablePair',
        [
          baseToken.address,
          quoteToken.address,
          baseInAmount,
          quoteInAmount,
          new BigNumber(lpFeeRate)
            .div(10000)
            .multipliedBy(10 ** 18)
            .toString(),
          parseFixed(
            new BigNumber(i).toString(),
            18 - baseToken.decimals + quoteToken.decimals,
          ).toString(),
          parseFixed(new BigNumber(k).toString(), 18).toString(),
          isOpenTWAP,
          deadline,
        ],
      );

      return {
        to: DODO_DSP_PROXY,
        data,
      };
    },

    /**
     * @notice Create GSP pool
     * @param baseToken     {"decimals","address"}
     * @param account       account address
     * @param quoteToken    {"decimals","address"}
     * @param baseInAmount  The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount The initial amount of liquidity quote provided (considering decimals)
     * @param lpFeeRate     Example: 0.0001 is passed in 1
     * @param i             Decimals are not considered
     * @param k             Scope: 0 => 1
     */
    async createGSPPoolABI(
      chainId: number,
      account: string,
      baseToken: { decimals: number; address: string },
      quoteToken: { decimals: number; address: string },
      baseInAmount: string,
      quoteInAmount: string,
      lpFeeRate: number,
      i: string,
      k: number,
      deadline: number,
    ) {
      const { DODO_DSP_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoDspProxy,
        'createDODOGasSavingPair',
        [
          account,
          baseToken.address,
          quoteToken.address,
          baseInAmount,
          quoteInAmount,
          new BigNumber(lpFeeRate)
            .div(10000)
            .multipliedBy(10 ** 18)
            .toString(),
          parseFixed(
            new BigNumber(i).toString(),
            18 - baseToken.decimals + quoteToken.decimals,
          ).toString(),
          parseFixed(new BigNumber(k).toString(), 18).toString(),
          '1000',
          deadline,
        ],
      );

      return {
        to: DODO_DSP_PROXY,
        data,
      };
    },

    /**
     * @notice Create DVM pool
     * @param baseToken     {"decimals","address"}
     * @param quoteToken    {"decimals","address"}
     * @param baseInAmount  The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount The initial amount of liquidity quote provided (considering decimals)
     * @param lpFeeRate     Example: 0.0001 is passed in 1
     * @param i             Decimals are not considered
     * @param k             Scope: 0 => 1
     * @param deadline      Deadline timestamp in seconds
     */
    async createDVMPoolABI(
      chainId: number,
      baseToken: { decimals: number; address: string },
      quoteToken: { decimals: number; address: string },
      baseInAmount: string,
      quoteInAmount: string,
      lpFeeRate: number,
      i: string,
      k: number,
      deadline: number,
      isOpenTWAP = false,
    ) {
      const { DODO_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoProxyV2,
        'createDODOVendingMachine',
        [
          baseToken.address,
          quoteToken.address,
          baseInAmount,
          quoteInAmount,
          new BigNumber(lpFeeRate)
            .div(10000)
            .multipliedBy(10 ** 18)
            .toString(),
          parseFixed(
            new BigNumber(i).toString(),
            18 - baseToken.decimals + quoteToken.decimals,
          ).toString(),
          parseFixed(new BigNumber(k).toString(), 18).toString(),
          isOpenTWAP,
          deadline,
        ],
      );

      return {
        to: DODO_PROXY,
        data,
      };
    },

    /**
     * @notice Create DPP pool
     * @param baseToken     {"decimals","address"}
     * @param quoteToken    {"decimals","address"}
     * @param baseInAmount  The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount The initial amount of liquidity quote provided (considering decimals)
     * @param lpFeeRate     Example: 0.0001 is passed in 1
     * @param i             Decimals are not considered
     * @param k             Scope: 0 => 1
     * @param deadline      Deadline timestamp in seconds
     */
    async createDPPPoolABI(
      chainId: number,
      baseToken: { decimals: number; address: string },
      quoteToken: { decimals: number; address: string },
      baseInAmount: string,
      quoteInAmount: string,
      lpFeeRate: number,
      i: string,
      k: number,
      deadline: number,
      isOpenTWAP = false,
    ) {
      const { DODO_DPP_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoDppProxy,
        'createDODOPrivatePool',
        [
          baseToken.address,
          quoteToken.address,
          baseInAmount,
          quoteInAmount,
          new BigNumber(lpFeeRate)
            .div(10000)
            .multipliedBy(10 ** 18)
            .toString(),
          parseFixed(
            new BigNumber(i).toString(),
            18 - baseToken.decimals + quoteToken.decimals,
          ).toString(),
          parseFixed(new BigNumber(k).toString(), 18).toString(),
          isOpenTWAP,
          deadline,
        ],
      );

      return {
        to: DODO_DPP_PROXY,
        data,
      };
    },

    /**
     * @notice Remove liquidity from the DPP pool and directly call DPPAdmin for vehicle deflation tokens (no ETH automatic conversion to WETH function).
     * @param _OWNER_         _OWNER_: getDPPOwnerProxyAddressQuery
     * @param newLpFeeRate    Example: 0.0001 is passed in 1
     * @param newI            Decimals are not considered
     * @param newK            Scope: 0 => 1
     * @param baseOutAmount   Number of base extracted (considering decimals)
     * @param quoteOutAmount  Number of quote extracted (considering decimals)
     * @param minBaseReserve  Protection mechanism (minimum baseReserve, consider decimals)
     * @param minQuoteReserve Protection mechanism (minimum quoteReserve, consider decimals)
     * @param baseDecimals    baseToken decimals
     * @param quoteDecimals   quoteToken decimals
     */
    async removeDPPPoolABI(
      _OWNER_: string,
      newLpFeeRate: number,
      newI: number,
      newK: number,
      baseOutAmount: string,
      quoteOutAmount: string,
      minBaseReserve: string,
      minQuoteReserve: string,
      baseDecimals: number,
      quoteDecimals: number,
    ) {
      const _newLpFeeRate = new BigNumber(newLpFeeRate)
        .div(10000)
        .multipliedBy(10 ** 18)
        .toString();
      const _newI = parseFixed(
        new BigNumber(newI).toString(),
        18 - baseDecimals + quoteDecimals,
      ).toString();
      const _newK = parseFixed(new BigNumber(newK).toString(), 18).toString();
      const data = await encodeFunctionData(ABIName.dodoDPPAdmin, 'reset', [
        '0x0000000000000000000000000000000000000000',
        _newLpFeeRate,
        _newI,
        _newK,
        baseOutAmount,
        quoteOutAmount,
        minBaseReserve,
        minQuoteReserve,
      ]);
      return {
        to: _OWNER_,
        data,
      };
    },

    /**
     * @notice Reset DPP pool
     * @param dppAddress      DPP pool address
     * @param newLpFeeRate    Example: 0.0001 is passed in 1
     * @param newI           （Decimals are not considered
     * @param newK            Scope: 0 => 1
     * @param baseInAmount    The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount   The initial amount of liquidity quote provided (considering decimals)
     * @param baseOutAmount   Number of base extracted (considering decimals)
     * @param quoteOutAmount  Number of quote extracted (considering decimals)
     * @param minBaseReserve  Protection mechanism (minimum baseReserve, consider decimals)
     * @param minQuoteReserve Protection mechanism (minimum quoteReserve, consider decimals)
     * @param flag            0 - ERC20, 1 - baseInETH, 2 - quoteInETH, 3 - baseOutETH, 4 - quoteOutETH
     * @param baseDecimals    baseToken  decimals
     * @param quoteDecimals   quoteToken decimals
     * @param deadline        Deadline timestamp in seconds
     */
    async resetDPPPoolABI(
      chainId: number,
      dppAddress: string,
      newLpFeeRate: number,
      newI: number,
      newK: number,
      baseInAmount: string,
      quoteInAmount: string,
      baseOutAmount: string,
      quoteOutAmount: string,
      minBaseReserve: string,
      minQuoteReserve: string,
      flag: number,
      baseDecimals: number,
      quoteDecimals: number,
      deadline: number,
    ) {
      const { DODO_DPP_PROXY } = contractConfig[chainId as ChainId];
      const _newLpFeeRate = new BigNumber(newLpFeeRate)
        .div(10000)
        .multipliedBy(10 ** 18)
        .toString();
      const _newI = parseFixed(
        new BigNumber(newI).toString(),
        18 - baseDecimals + quoteDecimals,
      ).toString();
      const _newK = parseFixed(new BigNumber(newK).toString(), 18).toString();
      const data = await encodeFunctionData(
        ABIName.dodoDppProxy,
        'resetDODOPrivatePool',
        [
          dppAddress,
          [_newLpFeeRate, _newI, _newK],
          [baseInAmount, quoteInAmount, baseOutAmount, quoteOutAmount],
          flag,
          minBaseReserve,
          minQuoteReserve,
          deadline,
        ],
      );
      return {
        to: DODO_DPP_PROXY,
        data,
      };
    },

    /**
     * @notice add liquidity to DSP pool
     * @param poolAddress     pool address
     * @param baseInAmount    The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount   The initial amount of liquidity quote provided (considering decimals)
     * @param baseMinAmount  Minimum number of base to add (considering decimals) (slippage protection)
     * @param quoteMinAmount Minimum number of quote to add (considering decimals) (slippage protection)
     * @param flag            0 - ERC20, 1 - baseInETH, 2 - quoteInETH, 3 - baseOutETH, 4 - quoteOutETH
     * @param deadline        Deadline timestamp in seconds
     */
    async addDSPLiquidityABI(
      chainId: number,
      dspAddress: string,
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
      const { DODO_DSP_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoDspProxy,
        'addDSPLiquidity',
        [
          dspAddress,
          baseInAmount,
          quoteInAmount,
          baseMinAmount,
          quoteMinAmount,
          flag,
          deadline,
        ],
      );
      return {
        to: DODO_DSP_PROXY,
        data,
      };
    },

    /**
     * @notice add liquidity to DVM pool
     * @param poolAddress     pool address
     * @param baseInAmount    The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount   The initial amount of liquidity quote provided (considering decimals)
     * @param baseMinAmount  Minimum number of base to add (considering decimals) (slippage protection)
     * @param quoteMinAmount Minimum number of quote to add (considering decimals) (slippage protection)
     * @param flag            0 - ERC20, 1 - baseInETH, 2 - quoteInETH, 3 - baseOutETH, 4 - quoteOutETH
     * @param deadline        Deadline timestamp in seconds
     */
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

    /**
     * @notice Remove liquidity from DSP pool
     * @param poolAddress     pool address
     * @param assetTo         Remove the fund sending address (if the received funds have ETH, this value can be empty)
     * @param sharesAmount    Number of Shares destroyed (considering Decimals)
     * @param baseMinAmount   Minimum number of base to add (considering decimals) (slippage protection)
     * @param quoteMinAmount  Minimum number of quote to add (considering decimals) (slippage protection)
     * @param isUnWrap        Whether to convert to ETH
     * @param deadline        Deadline timestamp in seconds
     */
    async removeDSPLiquidityABI(
      chainId: number,
      dspAddress: string,
      assetTo: string,
      sharesAmount: string,
      baseMinAmount: string,
      quoteMinAmount: string,
      isUnWrap: boolean,
      deadline: number,
    ) {
      if (!(chainId == 28 || chainId == 69)) {
        const { CALLEE_HELPER } = contractConfig[chainId as ChainId];
        if (isUnWrap) assetTo = CALLEE_HELPER;
      }
      const data = await encodeFunctionData(ABIName.dodoDSP, 'sellShares', [
        sharesAmount,
        assetTo,
        baseMinAmount,
        quoteMinAmount,
        isUnWrap ? '0x00' : '0x',
        deadline,
      ]);
      return {
        to: dspAddress,
        data,
      };
    },

    /**
     * @notice Remove liquidity from DVM pool
     * @param poolAddress     pool address
     * @param assetTo         Remove the fund sending address (if the received funds have ETH, this value can be empty)
     * @param sharesAmount    Number of Shares destroyed (considering Decimals)
     * @param baseMinAmount   Minimum number of base to add (considering decimals) (slippage protection)
     * @param quoteMinAmount  Minimum number of quote to add (considering decimals) (slippage protection)
     * @param isUnWrap        Whether to convert to ETH
     * @param deadline        Deadline timestamp in seconds
     */
    async removeDVMLiquidityABI(
      chainId: number,
      dvmAddress: string,
      assetTo: string,
      sharesAmount: string,
      baseMinAmount: string,
      quoteMinAmount: string,
      isUnWrap: boolean,
      deadline: number,
    ) {
      if (!(chainId == 28 || chainId == 69)) {
        const { CALLEE_HELPER } = contractConfig[chainId as ChainId];
        if (isUnWrap) assetTo = CALLEE_HELPER;
      }
      const data = await encodeFunctionData(ABIName.dodoDVM, 'sellShares', [
        sharesAmount,
        assetTo,
        baseMinAmount,
        quoteMinAmount,
        isUnWrap ? '0x00' : '0x',
        deadline,
      ]);
      return {
        to: dvmAddress,
        data,
      };
    },

    /**
     * @notice add liquidity to Classical pool
     * @param poolAddress     pool address
     * @param baseInAmount    The initial amount of liquidity base provided (considering decimals)
     * @param quoteInAmount   The initial amount of liquidity quote provided (considering decimals)
     * @param baseLpMinAmount  Get the minimum number of baseShares (considering decimals) (slippage protection)
     * @param quoteLpMinAmount Get the minimum number of quoteShares (considering decimals) (slippage protection)
     * @param flag            0 - ERC20, 1 - baseInETH, 2 - quoteInETH, 3 - baseOutETH, 4 - quoteOutETH
     * @param deadline        Deadline timestamp in seconds
     */
    async addClassicalLiquidityABI(
      chainId: number,
      poolAddress: string,
      baseInAmount: string,
      quoteInAmount: string,
      baseLpMinAmount: string,
      quoteLpMinAmount: string,
      flag: number,
      deadline: number,
    ) {
      const { DODO_PROXY } = contractConfig[chainId as ChainId];
      const data = await encodeFunctionData(
        ABIName.dodoProxyV2,
        'addLiquidityToV1',
        [
          poolAddress,
          baseInAmount,
          quoteInAmount,
          baseLpMinAmount,
          quoteLpMinAmount,
          flag,
          deadline,
        ],
      );
      return {
        to: DODO_PROXY,
        data,
      };
    },

    /**
     * @notice Remove base liquidity to Classical pool
     * @param poolAddress     pool address
     * @param baseOutAmount   The number of bases you wish to remove (considering decimals)
     * @param baseOutMinAmount   Minimum number of base to remove (considering decimals) (slippage protection)
     */
    async removeClassicalBaseABI(
      chainId: number,
      poolAddress: string,
      baseOutAmount: string,
      baseOutMinAmount: string,
    ) {
      const { DODO_V1_PAIR_PROXY } = contractConfig[chainId as ChainId];
      let data = '';
      let to = '';
      if (DODO_V1_PAIR_PROXY) {
        to = DODO_V1_PAIR_PROXY;
        data = await encodeFunctionData(
          ABIName.dodoV1PairProxy,
          'withdrawBase',
          [poolAddress, baseOutAmount, baseOutMinAmount],
        );
      } else {
        to = poolAddress;
        data = await encodeFunctionData(ABIName.dodoPair, 'withdrawBase', [
          baseOutAmount,
        ]);
      }
      return {
        to,
        data,
      };
    },

    /**
     * @notice Remove all base liquidity to Classical pool
     * @param poolAddress     pool address
     * @param baseOutMinAmount   Minimum number of base to remove (considering decimals) (slippage protection)
     */
    async removeMaxClassicalBaseABI(
      chainId: number,
      poolAddress: string,
      baseOutMinAmount: string,
    ) {
      const { DODO_V1_PAIR_PROXY } = contractConfig[chainId as ChainId];
      let data = '';
      let to = '';
      if (DODO_V1_PAIR_PROXY) {
        to = DODO_V1_PAIR_PROXY;
        data = await encodeFunctionData(
          ABIName.dodoV1PairProxy,
          'withdrawAllBase',
          [poolAddress, baseOutMinAmount],
        );
      } else {
        to = poolAddress;
        data = await encodeFunctionData(
          ABIName.dodoPair,
          'withdrawAllBase',
          [],
        );
      }
      return {
        to,
        data,
      };
    },

    /**
     * @notice Remove quote liquidity to Classical pool
     * @param poolAddress     pool address
     * @param quoteOutAmount   The number of bases you wish to remove (considering decimals)
     * @param quoteOutMinAmount   Minimum number of quote to remove (considering decimals) (slippage protection)
     */
    async removeClassicalQuoteABI(
      chainId: number,
      poolAddress: string,
      quoteOutAmount: string,
      quoteOutMinAmount: string,
    ) {
      const { DODO_V1_PAIR_PROXY } = contractConfig[chainId as ChainId];
      let data = '';
      let to = '';
      if (DODO_V1_PAIR_PROXY) {
        to = DODO_V1_PAIR_PROXY;
        data = await encodeFunctionData(
          ABIName.dodoV1PairProxy,
          'withdrawQuote',
          [poolAddress, quoteOutAmount, quoteOutMinAmount],
        );
      } else {
        to = poolAddress;
        data = await encodeFunctionData(ABIName.dodoPair, 'withdrawQuote', [
          quoteOutAmount,
        ]);
      }
      return {
        to,
        data,
      };
    },

    /**
     * @notice Remove all quote liquidity to Classical pool
     * @param poolAddress     pool address
     * @param baseOutMinAmount   Minimum number of quote to remove (considering decimals) (slippage protection)
     */
    async removeMaxClassicalQuoteABI(
      chainId: number,
      poolAddress: string,
      quoteOutMinAmount: string,
    ) {
      const { DODO_V1_PAIR_PROXY } = contractConfig[chainId as ChainId];
      let data = '';
      let to = '';
      if (DODO_V1_PAIR_PROXY) {
        to = DODO_V1_PAIR_PROXY;
        data = await encodeFunctionData(
          ABIName.dodoV1PairProxy,
          'withdrawAllQuote',
          [poolAddress, quoteOutMinAmount],
        );
      } else {
        to = poolAddress;
        data = await encodeFunctionData(
          ABIName.dodoPair,
          'withdrawAllQuote',
          [],
        );
      }
      return {
        to,
        data,
      };
    },
  };

  /**
   * Get existing lp balance
   * The CLASSICAL,V3CLASSICAL pool will only return base, other pools will return all
   */
  getTotalBaseLpQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getTotalBaseLpQuery',
        ...arguments,
      ],
      enabled: !!chainId && !!poolAddress && !!type && decimals !== undefined,
      queryFn: async () => {
        if (!chainId || !poolAddress || !type || decimals === undefined)
          return null;

        if (type === 'AMMV2') {
          const result = await fetchUniswapV2PairTotalSupply(
            chainId,
            poolAddress,
          );
          return new BigNumber(formatUnits(result, decimals));
        }
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'totalSupply',
          DSP: 'totalSupply',
          GSP: 'totalSupply',
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
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getTotalQuoteLp', ...arguments],
      enabled: !!chainId && !!poolAddress && !!type && decimals !== undefined,
      queryFn: async () => {
        if (!chainId || !poolAddress || !type || decimals === undefined)
          return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          GSP: null,
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
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getUserBaseLp', ...arguments],
      enabled:
        !!chainId &&
        !!poolAddress &&
        !!type &&
        decimals !== undefined &&
        !!account,
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!poolAddress &&
            !!type &&
            decimals !== undefined &&
            !!account
          )
        )
          return null;
        if (type === 'AMMV2') {
          const result = await fetchUniswapV2PairBalanceOf(
            chainId,
            poolAddress,
            account,
          );
          return new BigNumber(formatUnits(result, decimals));
        }
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'balanceOf',
          DSP: 'balanceOf',
          GSP: 'balanceOf',
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
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getUserQuoteLp', ...arguments],
      enabled:
        !!chainId &&
        !!poolAddress &&
        !!type &&
        decimals !== undefined &&
        !!account,
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!poolAddress &&
            !!type &&
            decimals !== undefined &&
            !!account
          )
        )
          return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          GSP: null,
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
   * The base and quote of the AMM pool should be passed in in order
   */
  getReserveLpQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
  ) {
    if (type === 'CLASSICAL') {
      return this.getPMMStateQuery(
        chainId,
        poolAddress,
        type,
        baseDecimals,
        quoteDecimals,
      );
    }

    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getReserveLp', ...arguments],
      enabled:
        !!chainId &&
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!poolAddress &&
            !!type &&
            baseDecimals !== undefined &&
            quoteDecimals !== undefined
          )
        )
          return null;

        if (type === 'AMMV2') {
          const result = await fetchUniswapV2PairGetReserves(
            chainId,
            poolAddress,
          );
          return {
            baseReserve: byWei(result._reserve0.toString(), baseDecimals),
            quoteReserve: byWei(result._reserve1.toString(), quoteDecimals),
          };
        }
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'getVaultReserve',
          DSP: 'getVaultReserve',
          GSP: 'getVaultReserve',
          LPTOKEN: 'getVaultReserve',
          CLASSICAL: null,
          V3CLASSICAL: null,
          DPP: 'getVaultReserve',
        };
        const query = getPoolQueryFactory({
          poolAddress,
          type,
          typeMethodObject,
          params: [],
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
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getClassicalTargetQuery',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !(
            !!chainId &&
            !!poolAddress &&
            !!type &&
            baseDecimals !== undefined &&
            quoteDecimals !== undefined &&
            ['CLASSICAL', 'V3CLASSICAL'].includes(type)
          )
        )
          return null;
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.classicalPoolABI,
          contractAddress: poolAddress,
          method: 'getExpectedTarget',
          params: [],
        });
        return {
          baseTarget: byWei(result.baseTarget, baseDecimals),
          quoteTarget: byWei(result.quoteTarget, quoteDecimals),
        };
      },
    };
  }

  getTotalBaseMiningLpQuery(
    chainId: number | undefined,
    baseMiningContractAddress: string | undefined,
    type: PoolType | undefined,
    baseLpTokenAddress: string | undefined,
    decimals: number | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getTotalBaseMiningLp',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!baseMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!baseLpTokenAddress),
      queryFn: async () => {
        if (
          !(
            !!chainId &&
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
          GSP: 'totalSupply',
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
    chainId: number | undefined,
    quoteMiningContractAddress: string | undefined,
    type: PoolType | undefined,
    quoteLpTokenAddress: string | undefined,
    decimals: number | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getTotalQuoteMiningLp',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!quoteMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!quoteLpTokenAddress),
      queryFn: async () => {
        if (
          !chainId ||
          !quoteMiningContractAddress ||
          !type ||
          decimals === undefined
        )
          return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          GSP: null,
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
    chainId: number | undefined,
    baseMiningContractAddress: string | undefined,
    type: PoolType | undefined,
    baseLpTokenAddress: string | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getUserBaseMiningLp',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!account &&
        !!baseMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!baseLpTokenAddress),
      queryFn: async () => {
        if (
          !chainId ||
          !account ||
          !baseMiningContractAddress ||
          !type ||
          decimals === undefined
        )
          return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: 'getUserLpBalance',
          DSP: 'balanceOf',
          GSP: 'balanceOf',
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
    chainId: number | undefined,
    quoteMiningContractAddress: string | undefined,
    type: PoolType | undefined,
    quoteLpTokenAddress: string | undefined,
    decimals: number | undefined,
    account: string | undefined,
  ) {
    const isV3Mining = !!type && PoolApi.utils.getIsV3Mining(type);
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'pool',
        'getUserQuoteMiningLp',
        ...arguments,
      ],
      enabled:
        !!chainId &&
        !!account &&
        !!quoteMiningContractAddress &&
        !!type &&
        decimals !== undefined &&
        (isV3Mining || !!quoteLpTokenAddress),
      queryFn: async () => {
        if (
          !chainId ||
          !account ||
          !quoteMiningContractAddress ||
          !type ||
          decimals === undefined
        )
          return null;
        const typeMethodObject: PoolTypeMethodObject = {
          DVM: null,
          DSP: null,
          GSP: null,
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

  getLPFeeRateQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getLpFeeRateQuery', ...arguments],
      enabled: !!chainId && !!poolAddress && !!type,
      queryFn: async () => {
        if (!chainId || !poolAddress || !type) {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.dvmPoolABI,
          contractAddress: poolAddress,
          method: '_LP_FEE_RATE_',
          params: [],
        });
        const feeRate = new BigNumber(result.toString()).div(10 ** 18);
        return feeRate;
      },
    };
  }

  getFeeRateQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getFeeRateQuery', ...arguments],
      enabled: !!chainId && !!poolAddress && !!type,
      queryFn: async () => {
        if (!chainId || !poolAddress || !type) {
          return null;
        }
        let lpFeeRate = new BigNumber(0);
        let mtFeeRate = new BigNumber(0);
        if (type === 'CLASSICAL') {
          const { ROUTE_V1_DATA_FETCH } = contractConfig[chainId as ChainId];
          const pmmHelperResult = await this.contractRequests.batchCallQuery(
            chainId,
            {
              abiName: ABIName.DODOV1PmmHelperABI,
              contractAddress: ROUTE_V1_DATA_FETCH,
              method: 'getPairDetail',
              params: [poolAddress],
            },
          );
          const queryResult = pmmHelperResult?.res?.[0];
          lpFeeRate = new BigNumber(queryResult.lpFeeRate.toString()).div(
            10 ** 18,
          );
          mtFeeRate = new BigNumber(queryResult.mtFeeRate.toString()).div(
            10 ** 18,
          );
        } else if (type === 'AMMV2') {
          const result = await fetchUniswapV2PairFeeRate(chainId, poolAddress);
          const feeRate = byWei(result.toString(), 4);
          lpFeeRate = feeRate.times(0.8);
          mtFeeRate = feeRate.times(0.2);
        } else {
          const queryResult = await this.contractRequests.batchCallQuery(
            chainId,
            {
              abiName: ABIName.dvmPoolABI,
              contractAddress: poolAddress,
              method: 'getUserFeeRate',
              params: [account ?? poolAddress],
            },
          );
          lpFeeRate = new BigNumber(queryResult.lpFeeRate.toString()).div(
            10 ** 18,
          );
          mtFeeRate = new BigNumber(queryResult.mtFeeRate.toString()).div(
            10 ** 18,
          );
        }
        return {
          lpFeeRate,
          mtFeeRate,
        };
      },
    };
  }

  getPMMStateQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    type: PoolType | undefined,
    baseDecimals: number | undefined,
    quoteDecimals: number | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'pool', 'getPMMStateQuery', ...arguments],
      enabled:
        !!chainId &&
        !!poolAddress &&
        !!type &&
        baseDecimals !== undefined &&
        quoteDecimals !== undefined,
      queryFn: async () => {
        if (
          !chainId ||
          !poolAddress ||
          !type ||
          baseDecimals === undefined ||
          quoteDecimals === undefined
        )
          return null;
        if (type === 'AMMV2' || type === 'AMMV3') return null;
        let queryResult: PmmData | null = null;
        if (type === 'CLASSICAL') {
          const { ROUTE_V1_DATA_FETCH } = contractConfig[chainId as ChainId];
          const pmmHelperResult = await this.contractRequests.batchCallQuery(
            chainId,
            {
              abiName: ABIName.DODOV1PmmHelperABI,
              contractAddress: ROUTE_V1_DATA_FETCH,
              method: 'getPairDetail',
              params: [poolAddress],
            },
          );
          queryResult = pmmHelperResult?.res?.[0];
        } else if (['DVM', 'DPP', 'LPTOKEN', 'DSP', 'GSP'].includes(type)) {
          queryResult = await this.contractRequests.batchCallQuery(chainId, {
            abiName: ABIName.dvmPoolABI,
            contractAddress: poolAddress,
            method: 'getPMMStateForCall',
            params: [],
          });
        } else {
          throw new Error(`type: ${type} not supported`);
        }
        if (!Array.isArray(queryResult) || !queryResult.length) {
          throw new Error(`queryResult is not valid.`);
        }

        const pmmParamsBG = convertPmmParams(
          queryResult,
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
          baseReserve: pmmParamsBG.b,
          quoteReserve: pmmParamsBG.q,
        };
      },
    };
  }

  getDPPOwnerProxyAddressQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
  ) {
    return {
      queryKey: [...arguments],
      enabled: !!chainId && !!poolAddress,
      queryFn: () => {
        if (!chainId || !poolAddress) return null;
        return this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.IdodoV2,
          contractAddress: poolAddress,
          method: '_OWNER_',
          params: [],
        });
      },
    };
  }

  getWithdrawBasePenaltyQuery(
    chainId: number | undefined,
    poolAddress: string | undefined,
    baseOutAmount: string | undefined,
    decimals: number | undefined,
  ) {
    return {
      queryKey: [...arguments],
      enabled: !!chainId && !!poolAddress && !!baseOutAmount && !!decimals,
      queryFn: async () => {
        if (!chainId || !poolAddress || !baseOutAmount || !decimals)
          return null;
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.dodoPair,
          contractAddress: poolAddress,
          method: 'getWithdrawBasePenalty',
          params: [baseOutAmount],
        });
        return byWei(result, decimals);
      },
    };
  }
}

import ContractRequests, {
  ContractRequestsConfig,
  CONTRACT_QUERY_KEY,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests';
import BigNumber from 'bignumber.js';
import {
  contractConfig,
  ChainId,
  basicTokenMap,
  platformIdMap,
} from '../../chainConfig';
import { getTokenBlackList } from './tokenBlackList';
import { isSameAddress } from './utils';
import { encodeFunctionData } from '../../helper/ContractRequests/encode';
import RestApiRequest from '../../helper/RestApiRequests';

const BIG_ALLOWANCE = new BigNumber(2).pow(256).minus(1);

export interface TokenApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
  restApiRequest?: RestApiRequest;
}

// When the erc20Helper contract queries the old erc20 token, the returned symbol and name contain spaces and must be removed.
function trimSpace(str: string) {
  if (!str) return str;
  return str.replaceAll('\u0000', '');
}

export class TokenApi {
  contractRequests: ContractRequests;
  restApiRequest: RestApiRequest;
  constructor(config: TokenApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('TokenApi does not initialize the contractRequests');
    }

    this.restApiRequest = config?.restApiRequest || new RestApiRequest();
  }

  static utils = {
    isSameAddress,
  };

  static encode = {
    approveABI(contractAddress: string, allowance: BigNumber) {
      return encodeFunctionData(ABIName.erc20ABI, 'approve', [
        contractAddress,
        allowance.toFixed(),
      ]);
    },
    async transferEncodeABI(receiverAddress: string, amount: string) {
      const encoded = await encodeFunctionData(ABIName.erc20ABI, 'transfer', [
        receiverAddress,
        amount,
      ]);
      return encoded;
    },
  };

  getTokenDecimals(chainId: number | undefined, address: string | undefined) {
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        'token',
        'getTokenDecimals',
        chainId ?? '',
        address?.toLocaleLowerCase(),
      ],
      enabled: !!chainId && !!address,
      queryFn: async () => {
        if (!chainId || !address) return null;

        const result = await this.contractRequests.batchCallQuery<number>(
          chainId,
          {
            abiName: ABIName.erc20ABI,
            contractAddress: address,
            method: 'decimals',
            params: [],
          },
        );
        return result;
      },
    };
  }

  getFiatPriceBatch(
    tokens: Array<{
      chainId: ChainId;
      address: string;
      symbol: string;
    }>,
    token: string,
  ) {
    const path = `/frontend-v2-price-api/current/batch`;
    return this.restApiRequest.postJson(
      path,
      {
        networks: tokens.map((token) => platformIdMap[token.chainId]),
        addresses: tokens.map((token) => token.address),
        symbols: tokens.map((token) => token.symbol),
        isCache: true,
      },
      undefined,
      {
        headers: {
          'pass-key': token,
        },
      },
    );
  }

  getFetchTokenQuery(
    chainId: number | undefined,
    address: string | undefined,
    account: string | undefined,
    spender?: string,
  ) {
    let proxyContractAddress = spender;
    let erc20HelperAddress = '';
    if (chainId !== undefined) {
      const config = contractConfig[chainId as ChainId];
      if (!proxyContractAddress) {
        proxyContractAddress = config.DODO_APPROVE;
      }
      erc20HelperAddress = config.ERC20_HELPER;
    }
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        CONTRACT_QUERY_KEY,
        'token',
        'getFetchTokenQuery',
        chainId ?? '',
        address?.toLocaleLowerCase(),
        account?.toLocaleLowerCase(),
        proxyContractAddress?.toLocaleLowerCase(),
      ],
      enabled: !!chainId && !!address && !!account,
      queryFn: async () => {
        if (!chainId || !address || !account || !proxyContractAddress)
          return null;
        const blackList = await getTokenBlackList(chainId);
        if (blackList.includes(address)) {
          return null;
        }
        const EtherToken = basicTokenMap[chainId as ChainId];
        if (TokenApi.utils.isSameAddress(address, EtherToken.address)) {
          const balance = await this.contractRequests.getETHBalance(
            chainId,
            account,
          );

          return {
            symbol: EtherToken.symbol,
            address: EtherToken.address,
            name: EtherToken.name,
            decimals: EtherToken.decimals,
            balance,
            allowance: BIG_ALLOWANCE,
            account,
            spender,
            chainId,
          };
        }

        const detail = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.erc20Helper,
          contractAddress: erc20HelperAddress,
          method: 'isERC20',
          params: [address, account, proxyContractAddress],
        });
        const { name, isOk } = detail;
        if (isOk && name) {
          const decimals = parseInt(detail.decimals, 10);
          const divisor = new BigNumber(10).pow(decimals as number);
          const allowance = new BigNumber(detail.allownance.toString()).div(
            divisor,
          );
          const balance = new BigNumber(detail.balance.toString()).div(divisor);
          return {
            address,
            decimals,
            symbol: trimSpace(detail.symbol as string),
            name: trimSpace(name as string),
            balance,
            spender,
            allowance,
            chainId,
          };
        }
        return null;
      },
    };
  }
}

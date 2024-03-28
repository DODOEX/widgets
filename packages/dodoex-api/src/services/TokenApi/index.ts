import ContractRequests, {
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests';
import BigNumber from 'bignumber.js';
import { contractConfig, ChainId, basicTokenMap } from '../../chainConfig';
import { getTokenBlackList } from './tokenBlackList';
import { isSameAddress } from './utils';
import { encodeFunctionData } from '../../helper/ContractRequests/encode';

const BIG_ALLOWANCE = new BigNumber(2).pow(256).minus(1);

export interface TokenApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

// When the erc20Helper contract queries the old erc20 token, the returned symbol and name contain spaces and must be removed.
function trimSpace(str: string) {
  if (!str) return str;
  return str.replaceAll('\u0000', '');
}

export class TokenApi {
  contractRequests: ContractRequests;
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
  };

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

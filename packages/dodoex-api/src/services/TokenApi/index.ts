import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BitcoinApi } from '../../adapters/bitcoin/utils/BitcoinApi';
import { UnitsUtil } from '../../adapters/bitcoin/utils/UnitsUtil';
import {
  basicTokenMap,
  ChainId,
  contractConfig,
  platformIdMap,
  SOL_NATIVE_MINT,
} from '../../chainConfig';
import { getCaipNetworkByChainId } from '../../chainConfig/utils';
import ContractRequests, {
  ABIName,
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { encodeFunctionData } from '../../helper/ContractRequests/encode';
import RestApiRequest from '../../helper/RestApiRequests';
import { tokenGraphqlQuery } from './graphqlQuery';
import { getTokenBlackList } from './tokenBlackList';
import { isSameAddress } from './utils';

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

  static graphql = tokenGraphqlQuery;

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
    const path = `/frontend-price-api-v2/current/batch`;
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
    return {
      // Unify the upper and lower case formats of queryKey into one to facilitate the use of cache
      queryKey: [
        CONTRACT_QUERY_KEY,
        'token',
        'getFetchTokenQuery',
        chainId,
        account,
        address,
        spender,
      ],
      enabled: !!chainId && !!address && !!account,
      queryFn: async () => {
        if (!chainId || !address || !account) {
          return null;
        }

        if (chainId === ChainId.BTC || chainId === ChainId.BTC_SIGNET) {
          const caipNetwork = getCaipNetworkByChainId(chainId);
          const utxos = await BitcoinApi.getUTXOs({
            network: caipNetwork,
            address: account,
          });

          const balance = utxos.reduce((acc, utxo) => acc + utxo.value, 0);
          const formattedBalance = UnitsUtil.parseSatoshis(
            balance.toString(),
            caipNetwork,
          );

          return {
            symbol: caipNetwork.nativeCurrency.symbol,
            address,
            name: caipNetwork.nativeCurrency.name,
            decimals: caipNetwork.nativeCurrency.decimals,
            balance: new BigNumber(formattedBalance),
            allowance: BIG_ALLOWANCE,
            account,
            spender,
            chainId,
          };
        }

        if (chainId === ChainId.SOLANA || chainId === ChainId.SOLANA_DEVNET) {
          // 连接主网或devnet
          // https://dashboard.alchemy.com/apps/yhfxpgn9fa1r1yvo/networks
          let endpoint =
            'https://solana-mainnet.g.alchemy.com/v2/psFqWVRgb8HiduEOIZTt4-ddeaNjKhzE';
          if (chainId === ChainId.SOLANA) {
            // endpoint = clusterApiUrl('mainnet-beta');
          } else if (chainId === ChainId.SOLANA_DEVNET) {
            endpoint = clusterApiUrl('devnet');
          }
          const connection = new Connection(endpoint, 'confirmed');
          const owner = new PublicKey(account);
          const mint = new PublicKey(address);

          // Solana native mint地址
          // if (NATIVE_MINT.equals(new PublicKey(address))) {
          if (mint.equals(SOL_NATIVE_MINT)) {
            // 查询SOL余额
            const lamports = await connection.getBalance(owner);
            const decimals = 9;
            const divisor = new BigNumber(10).pow(decimals);
            const balance = new BigNumber(lamports).div(divisor);
            return {
              symbol: 'SOL',
              address,
              name: 'Solana',
              decimals,
              balance,
              allowance: BIG_ALLOWANCE, // 结构保持一致
              account,
              spender,
              chainId,
            };
          }

          // 查找该owner下所有该mint的token账户
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            owner,
            { mint },
          );
          let amount = '0';
          let decimals = 0;
          let symbol = 'SPL';
          let name = 'SPL Token';
          if (tokenAccounts.value.length > 0) {
            // 累加所有账户余额
            amount = tokenAccounts.value.reduce((acc, { account }) => {
              const info = account.data.parsed.info;
              decimals = account.data.parsed.info.tokenAmount.decimals;
              symbol = account.data.parsed.info.mint;
              return (BigInt(acc) + BigInt(info.tokenAmount.amount)).toString();
            }, '0');
            // 取第一个账户的decimals
            decimals =
              tokenAccounts.value[0].account.data.parsed.info.tokenAmount
                .decimals;
          } else {
            // 没有账户，尝试获取mint信息
            try {
              const mintInfo = await connection.getParsedAccountInfo(mint);
              if (
                mintInfo.value &&
                mintInfo.value.data &&
                typeof mintInfo.value.data === 'object' &&
                'parsed' in mintInfo.value.data &&
                mintInfo.value.data.parsed?.info?.decimals !== undefined
              ) {
                decimals = mintInfo.value.data.parsed.info.decimals;
              }
            } catch {}
          }
          const divisor = new BigNumber(10).pow(decimals);
          const balance = new BigNumber(amount).div(divisor);
          return {
            symbol,
            address,
            name,
            decimals,
            balance,
            allowance: BIG_ALLOWANCE, // SPL Token 没有 allowance 概念，这里保持结构一致
            account,
            spender,
            chainId,
          };
        }

        let proxyContractAddress = spender;
        let erc20HelperAddress = '';
        if (chainId !== undefined) {
          const config = contractConfig[chainId as ChainId];
          if (!proxyContractAddress) {
            proxyContractAddress = config.DODO_APPROVE;
          }
          erc20HelperAddress = config.ERC20_HELPER;
        }

        if (!proxyContractAddress) {
          return null;
        }

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

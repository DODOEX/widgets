import { graphql } from '../gql';
import ContractRequests, {
  ContractRequestsConfig,
} from '../helper/ContractRequests';

export interface PoolApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}
export class PoolApi {
  contractRequests?: ContractRequests;
  constructor(config?: PoolApiProps) {
    if (config?.contractRequests || config?.contractRequestsConfig) {
      this.contractRequests =
        config.contractRequests ||
        new ContractRequests(
          config.contractRequestsConfig as ContractRequestsConfig,
        );
    } else {
      console.warn('PoolApi does not initialize the contractRequests');
    }
  }

  static fetchLiquidityList = graphql(`
    query FetchLiquidityList($where: Liquiditylist_filter) {
      liquidity_list(where: $where) {
        currentPage
        pageSize
        totalCount
        lqList {
          id
          isPrivatePool
          isMyLiquidity
          pair {
            id
            chainId
            type
            baseReserve
            quoteReserve
            lastTradePrice
            lpFeeRate
            i
            creator
            baseLpToken {
              id
              decimals
            }
            quoteLpToken {
              id
              decimals
            }
            baseToken {
              id
              symbol
              name
              decimals
              usdPrice
              logoImg
            }
            quoteToken {
              id
              symbol
              name
              decimals
              usdPrice
              logoImg
            }
            tvl
            apy {
              miningBaseApy
              miningQuoteApy
              transactionBaseApy
              transactionQuoteApy
            }
            miningAddress
          }
        }
      }
    }
  `);
}

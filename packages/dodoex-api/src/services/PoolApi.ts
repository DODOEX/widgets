import { graphql } from '../gql';
import GraphQLRequests, {
  GraphQLRequestsConfig,
} from '../helper/GraphQLRequests';

export class PoolApi extends GraphQLRequests {
  constructor(config?: GraphQLRequestsConfig) {
    super(config);
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

import { graphql } from '../../gql';

export const poolGraphqlQuery = {
  fetchPoolList: graphql(`
    query FetchPoolList(
      $first: Int
      $where: Pair_filter
      $orderBy: Pair_orderBy
    ) {
      pairs(
        first: $first
        where: $where
        orderBy: $orderBy
        orderDirection: desc
      ) {
        id
        type
        creator
        owner
        lpFeeRate
        i
        k
        baseReserve
        quoteReserve
        lastTradePrice
        feeBase
        feeQuote
        baseToken {
          id
          symbol
          name
          decimals
        }
        quoteToken {
          id
          symbol
          name
          decimals
        }
        baseLpToken {
          id
        }
        quoteLpToken {
          id
        }
      }
    }
  `),
  fetchLiquidityList: graphql(`
    query FetchLiquidityList($where: Liquiditylist_filter) {
      liquidity_list(where: $where) {
        currentPage
        pageSize
        totalCount
        lqList {
          id
          pair {
            id
            chainId
            type
            lpFeeRate
            creator
            baseLpToken {
              id
            }
            quoteLpToken {
              id
            }
            baseToken {
              id
              symbol
              name
              decimals
              logoImg
            }
            quoteToken {
              id
              symbol
              name
              decimals
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
  `),
  fetchMyLiquidityList: graphql(`
    query FetchMyLiquidityList($where: Liquiditylist_filter) {
      liquidity_list(where: $where) {
        lqList {
          id
          liquidityPositions {
            id
            liquidityTokenBalance
          }
          pair {
            id
            chainId
            type
            lpFeeRate
            creator
            baseLpToken {
              id
            }
            quoteLpToken {
              id
            }
            baseToken {
              id
              symbol
              name
              decimals
              logoImg
            }
            quoteToken {
              id
              symbol
              name
              decimals
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
  `),
  fetchDashboardPairList: graphql(`
    query FetchDashboardPairList($where: Dashboardtype_list_filter) {
      dashboard_pairs_list(where: $where) {
        list {
          chainId
          pairAddress
          poolType
          baseReserve
          quoteReserve
          totalFee
          baseAddress
          quoteAddress
          baseSymbol
          quoteSymbol
          tvl
          baseTvl
          quoteTvl
          baseTvlRate
          quoteTvlRate
        }
      }
    }
  `),
  fetchPool: graphql(`
    query FetchPool(
      $id: ID!
      $where: Pair_filter
      $liquidityWhere: Liquiditylist_filter
    ) {
      pair(id: $id, where: $where) {
        id
        type
        creator
        owner
        traderCount
        volumeBaseToken
        volumeQuoteToken
        volumeUSD
        feeBase
        feeQuote
        mtFeeRate
        lpFeeRate
        i
        k
        baseReserve
        quoteReserve
        createdAtTimestamp
        lastTradePrice
        baseToken {
          id
          symbol
          name
          decimals
        }
        quoteToken {
          id
          symbol
          name
          decimals
          usdPrice
        }
        baseLpToken {
          id
          symbol
          name
        }
        quoteLpToken {
          id
          symbol
          name
        }
      }
      liquidity_list(where: $liquidityWhere) {
        lqList {
          pair {
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
  `),
};

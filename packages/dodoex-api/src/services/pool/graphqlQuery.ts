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
  fetchPoolDayData: graphql(`
    query FetchPoolDayData($where: Dashboardday_filter) {
      dashboard_pairs_day_data(where: $where) {
        timestamp
        date
        volume
        fee
        tvl
        addresses
        txes
      }
    }
  `),
  fetchPoolDashboard: graphql(`
    query FetchPoolDashboard($where: Dashboardpair_detail_filter) {
      dashboard_pairs_detail(where: $where) {
        fee
        volume
        totalFee
        totalVolume
        tvl
        turnover
        liquidity
        baseReserve
        quoteReserve
        baseVolume
        quoteVolume
        basePrice
        quotePrice
        price
        baseFee
        quoteFee
        pair
        poolType
        baseVolumeCumulative
        quoteVolumeCumulative
        baseAddress
        baseSymbol
        quoteAddress
        quoteSymbol
        network
        pairAddress
        txes
        txesNear24h
        txUsers
        txUserNear24h
      }
    }
  `),
  fetchPoolSwapList: graphql(`
    query FetchPoolSwapList(
      $first: Int
      $skip: Int
      $where: Swap_filter
      $orderBy: Swap_orderBy
      $orderDirection: OrderDirection
    ) {
      swaps(
        first: $first
        skip: $skip
        where: $where
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        timestamp
        from
        baseVolume
        quoteVolume
        feeBase
        feeQuote
        fromToken {
          id
          symbol
          name
          decimals
        }
        toToken {
          id
          symbol
          name
          decimals
        }
        amountIn
        amountOut
      }
    }
  `),
  fetchLiquidityPositions: graphql(`
    query FetchLiquidityPositions(
      $id: ID!
      $first: Int
      $skip: Int
      $where: LiquidityPosition_filter
      $miningWhere: LiquidityPosition_filter
      $orderBy: LiquidityPosition_orderBy
      $orderDirection: OrderDirection
    ) {
      balance: liquidityPositions(
        first: $first
        skip: $skip
        where: $where
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        liquidityTokenBalance
      }
      mining: liquidityPositions(
        first: $first
        skip: $skip
        where: $miningWhere
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        liquidityTokenInMining
      }
      pair(id: $id) {
        lastTradePrice
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
        }
        quoteToken {
          id
          symbol
          name
          decimals
        }
      }
    }
  `),
};
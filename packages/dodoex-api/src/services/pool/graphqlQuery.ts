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
          decimals
        }
        quoteLpToken {
          id
          decimals
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
            mtFeeRate
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
              metromMiningApy
            }
            miningAddress
            volume24H
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
            liquidityTokenInMining
            poolShare
            liquidityUSD
            tokenId
            outOfRange
            priceRange {
              token0LowerPrice
              token0UpperPrice
              token1LowerPrice
              token1UpperPrice
            }
            tickLower {
              id
              tickIdx
              liquidityGross
              liquidityNet
              price0
              price1
            }
            tickUpper {
              id
              tickIdx
              liquidityGross
              liquidityNet
              price0
              price1
            }
          }
          pair {
            id
            chainId
            type
            lpFeeRate
            mtFeeRate
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
              metromMiningApy
            }
            miningAddress
            volume24H
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
          decimals
        }
        quoteLpToken {
          id
          symbol
          name
          decimals
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
              metromMiningApy
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
        volumeUsd
        feeUsd
        mtFeeUsd
        tvlUsd
        addresses
      }
    }
  `),
  fetchPoolDashboard: graphql(`
    query FetchPoolDashboard($where: Dashboardpair_detail_filter) {
      dashboard_pairs_detail(where: $where) {
        fee
        volume
        totalFee
        totalMtFee
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
        baseMtFee
        quoteMtFee
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
        mtFeeNear24h
        feeNear24h
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
  fetchPoolPairList: graphql(`
    query FetchPoolPairList(
      $first: Int
      $baseWhere: Pair_filter
      $quoteWhere: Pair_filter
      $orderBy: Pair_orderBy
      $orderDirection: OrderDirection
    ) {
      basePairs: pairs(
        first: $first
        where: $baseWhere
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        type
        creator
        lpFeeRate
        i
        k
        baseReserve
        quoteReserve
        createdAtTimestamp
        lastTradePrice
        volumeUSD
        baseToken {
          id
          symbol
          name
          decimals
          usdPrice
        }
        quoteToken {
          id
          symbol
          name
          decimals
          usdPrice
        }
      }
      quotePairs: pairs(
        first: $first
        where: $quoteWhere
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        type
        creator
        lpFeeRate
        i
        k
        baseReserve
        quoteReserve
        createdAtTimestamp
        lastTradePrice
        volumeUSD
        baseToken {
          id
          symbol
          name
          decimals
          usdPrice
        }
        quoteToken {
          id
          symbol
          name
          decimals
          usdPrice
        }
      }
    }
  `),
  fetchVe33PoolList: graphql(`
    query Ve33_getPoolList($where: Ve33TokenFilterPaginationInput) {
      ve33_getPoolList(where: $where) {
        id
        title
        version
        gaugeAddress
        feeRate
        apr {
          fees
          incentives
        }
        tvl
        totalValueLockedUSD
        totalValueLockedToken0
        totalValueLockedToken1
        volumeUSD
        volumeToken0
        volumeToken1
        feesUSD
        feesToken0
        feesToken1
        token0Address
        token0Name
        token0Symbol
        token0Decimals
        token1Address
        token1Name
        token1Symbol
        token1Decimals
      }
    }
  `),
  fetchVe33Pool: graphql(`
    query Ve33_getPool($where: Ve33PoolInput) {
      ve33_getPool(where: $where) {
        id
        title
        version
        gaugeAddress
        feeRate
        apr {
          fees
          incentives
        }
        tvl
        totalValueLockedUSD
        totalValueLockedToken0
        totalValueLockedToken1
        volumeUSD
        volumeToken0
        volumeToken1
        feesUSD
        feesToken0
        feesToken1
        token0Address
        token0Name
        token0Symbol
        token0Decimals
        token1Address
        token1Name
        token1Symbol
        token1Decimals
      }
    }
  `),
  fetchVotePoolList: graphql(`
    query Ve33_getVotePoolList($where: Ve33VotePoolInput) {
      ve33_getVotePoolList(where: $where) {
        id
        title
        version

        gaugeAddress
        feeRate
        apr {
          fees
          incentives
        }
        tvl

        token0Address
        token0Name
        token0Symbol
        token0Decimals

        token1Address
        token1Name
        token1Symbol
        token1Decimals

        totalValueLockedUSD
        totalValueLockedToken0
        totalValueLockedToken1

        feesUSD
        feesToken0
        feesToken1

        incentives {
          amount
          token
          usd
        }
        votes {
          token
          weight
        }
      }
    }
  `),
  fetchVe33TicksData: graphql(`
    query Ve33_getTicksData($where: Ve33getTicksDataInput) {
      ve33_getTicksData(where: $where) {
        ticks {
          id
          poolAddress
          tickIdx
          price0
          price1
          liquidityGross
          liquidityNet
          protocolPosition
          tickArrayLower
          tickArrayUpper
        }
      }
    }
  `),
  fetchVe33UserLocks: graphql(`
    query Ve33_getUserLock($where: Ve33UserInput!) {
      ve33_getUserLock(where: $where) {
        id
        value
        votingPower
        lockedEnd
        isPermanent
        isVoted
      }
    }
  `),
};

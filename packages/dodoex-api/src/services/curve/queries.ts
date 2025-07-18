import { graphql } from '../../gql';

export const curve_stableswap_ng_getAllPools = graphql(`
  query Curve_stableswap_ng_getAllPools(
    $where: Curve_stableswap_nglist_filter
  ) {
    curve_stableswap_ng_getAllPools(where: $where) {
      chainId
      user
      currentPage
      pageSize
      totalCount
      lqList {
        id
        isMyLiquidity
        pool {
          id
          address
          name
          coins {
            id
            address
            name
            symbol
            decimals
            logoImg
          }
          apy
          tvl
          volume
          traderCount
          fees
          reserves {
            token {
              id
              address
              name
              symbol
              decimals
              logoImg
            }
            amount
            ratio
          }
          dailyVolumeUsd
          liquidityUtilization
          fee
          daoFee
          virtualPrice
          poolType
          a
          offpegFeeMultiplier
        }
        liquidityPositions {
          id
          liquidityTokenBalance
          lpTokens {
            id
            address
            name
            symbol
            decimals
            amount
          }
        }
      }
    }
  }
`);

export const curve_stableswap_ng_getMyLiquidity = graphql(`
  query Curve_stableswap_ng_getMyLiquidity(
    $where: Curve_stableswap_nglist_filter
  ) {
    curve_stableswap_ng_getMyLiquidity(where: $where) {
      chainId
      user
      currentPage
      pageSize
      totalCount
      lqList {
        id
        isMyLiquidity
        pool {
          id
          address
          name
          coins {
            id
            address
            name
            symbol
            decimals
            logoImg
          }
          apy
          tvl
          volume
          traderCount
          fees
          reserves {
            token {
              id
              address
              name
              symbol
              decimals
              logoImg
            }
            amount
            ratio
          }
          dailyVolumeUsd
          liquidityUtilization
          fee
          daoFee
          virtualPrice
          poolType
          a
          offpegFeeMultiplier
        }
        liquidityPositions {
          id
          liquidityTokenBalance
          lpTokens {
            id
            address
            name
            symbol
            decimals
            amount
          }
        }
      }
    }
  }
`);

export const curve_stableswap_ng_getPoolInfo = graphql(`
  query Curve_stableswap_ng_getPoolInfo(
    $where: Curve_stableswap_ngpool_info_filter
  ) {
    curve_stableswap_ng_getPoolInfo(where: $where) {
      id
      address
      name
      coins {
        id
        address
        name
        symbol
        decimals
        logoImg
      }
      apy
      tvl
      volume
      traderCount
      fees
      reserves {
        token {
          id
          address
          name
          symbol
          decimals
          logoImg
        }
        amount
        ratio
      }
      dailyVolumeUsd
      liquidityUtilization
      fee
      daoFee
      virtualPrice
      poolType
      a
      offpegFeeMultiplier
    }
  }
`);

export const curve_stableswap_ng_getPoolSwapInfo = graphql(`
  query Curve_stableswap_ng_getPoolSwapInfo(
    $where: Curve_stableswap_ngpool_info_filter
  ) {
    curve_stableswap_ng_getPoolSwapInfo(where: $where) {
      currentPage
      pageSize
      totalCount
      swaps {
        id
        time
        user
        paidAmount
        paidToken {
          id
          address
          name
          symbol
          decimals
          logoImg
        }
        receivedAmount
        receivedToken {
          id
          address
          name
          symbol
          decimals
          logoImg
        }
      }
    }
  }
`);

export const curve_stableswap_ng_getPoolLiquidityHistory = graphql(`
  query Curve_stableswap_ng_getPoolLiquidityHistory(
    $where: Curve_stableswap_ngpool_info_filter
  ) {
    curve_stableswap_ng_getPoolLiquidityHistory(where: $where) {
      currentPage
      pageSize
      totalCount
      liquidityHistories {
        id
        time
        user
        action
        assets {
          token {
            id
            address
            name
            symbol
            decimals
            logoImg
          }
          amount
        }
      }
    }
  }
`);

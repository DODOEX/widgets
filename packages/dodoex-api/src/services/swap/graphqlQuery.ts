import { graphql } from '../../gql';

export const swapGraphqlQuery = {
  fetchUserSwapOrderHistories: graphql(`
    query FetchUserSwapOrderHistories($where: User_swapswapFilter) {
      user_swap_orderHistories(where: $where) {
        count
        page
        list {
          chainId
          createdAt
          fromAmount
          fromTokenDecimals
          fromTokenPrice
          fromTokenSymbol
          fromTokenAddress
          fromTokenLogoImg
          hash
          status
          toAmount
          toTokenDecimals
          toTokenPrice
          toTokenSymbol
          toTokenAddress
          toTokenLogoImg
          minAmount
          nonce
          extra
          user
        }
      }
    }
  `),
  cross_chain_swap_zetachain_routes: graphql(`
    query Cross_chain_swap_zetachain_routes(
      $where: Cross_chain_swap_zetachainrouteParams
    ) {
      cross_chain_swap_zetachain_routes(where: $where) {
        routeId
        fromChainId
        fromTokenAddress
        fromAmount
        fromAmountWithOutDecimals
        fromAmountUSD
        toChainId
        toTokenAddress
        toAmount
        toAmountWithOutDecimals
        toAmountUSD
        fromAddress
        toAddress
        slippage
        approveTarget
        fees
        omniPlan
        encodeParams
      }
    }
  `),
  cross_chain_swap_zetachain_transactionEncode: graphql(`
    query Cross_chain_swap_zetachain_transactionEncode(
      $data: Cross_chain_swap_zetachaintransactionEncodeParams
    ) {
      cross_chain_swap_zetachain_transactionEncode(data: $data) {
        data
        to
        value
        from
        chainId
      }
    }
  `),
  cross_chain_swap_zetachain_orderCreate: graphql(`
    query Cross_chain_swap_zetachain_orderCreate(
      $data: Cross_chain_swap_zetachainorderCreateData
    ) {
      cross_chain_swap_zetachain_orderCreate(data: $data) {
        success
      }
    }
  `),
  cross_chain_swap_zetachain_orderList: graphql(`
    query Cross_chain_swap_zetachain_orderList(
      $where: Cross_chain_swap_zetachainorderListData
    ) {
      cross_chain_swap_zetachain_orderList(where: $where) {
        list {
          id
          externalId
          fromChainId
          fromTokenAddress
          fromAmount
          fromAmountWithOutDecimals
          fromAmountUSD
          toChainId
          toTokenAddress
          toAmount
          toAmountWithOutDecimals
          toAmountUSD
          fromAddress
          toAddress
          fromHash
          toHash
          slippage
          refundChainId
          refundHash
          refundAmount
          refundUser
          refundToken
          status
          statusCode
          subStatus
          omniPlan
          fees
          createdAt
          startTime
          endTime
        }
        count
        page
        pageSize
      }
    }
  `),
  cross_chain_swap_zetachain_swapOrderList: graphql(`
    query Cross_chain_swap_zetachain_swapOrderList(
      $where: Cross_chain_swap_zetachainswapOrderListData
    ) {
      cross_chain_swap_zetachain_swapOrderList(where: $where) {
        list {
          key
          user
          chainId
          hash
          createdAt
          fromTokenAddress
          toTokenAddress
          fromAmount
          toAmount
          minAmount
          maxAmount
          fromTokenPrice
          toTokenPrice
          fromTokenSymbol
          toTokenSymbol
          fromTokenDecimals
          toTokenDecimals
          status
          nonce
          extra
        }
        count
        page
        pageSize
      }
    }
  `),
};

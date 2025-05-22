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
        fromChainId
        fromTokenAddress
        fromAmount
        toChainId
        toTokenAddress
        toAmount
        approveTarget
        fees
        asset
        step
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
        id
        fromChainId
        fromAmount
        fromTokenAddress
        toChainId
        toAmount
        toTokenAddress
        fromAddress
        toAddress
        fromHash
        toHash
        status
        createdAt
        updatedAt
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
          fromAmount
          fromTokenAddress
          toChainId
          toAmount
          toTokenAddress
          fromAddress
          toAddress
          fromHash
          toHash
          extend
          status
          createdAt
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

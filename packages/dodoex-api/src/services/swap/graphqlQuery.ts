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
};

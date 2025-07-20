import { graphql } from '../../gql';

export const tokenGraphqlQuery = {
  fetchErc20SwapCrossList: graphql(`
    query FetchErc20SwapCrossChainList($where: Erc20listV2Filter) {
      erc20_swapCrossChainList(where: $where) {
        name
        address
        symbol
        decimals
        slippage
        chainId
        logoImg
        tokenlists {
          name
          status
        }
        domains {
          name
        }
        funcLabels {
          key
        }
        attributeLabels {
          key
        }
      }
    }
  `),
  cross_chain_zetachain_token_list: graphql(`
    query Cross_chain_zetachain_token_list(
      $where: Cross_chain_zetachain_tokentokenlistFilter
    ) {
      cross_chain_zetachain_token_list(where: $where) {
        name
        address
        symbol
        decimals
        chainId
      }
    }
  `),
  fetchErc20ForecastSlippage: graphql(`
    query FetchErc20ForecastSlippage($where: Erc20_extenderc20ExtendV2Filter) {
      erc20_extend_erc20ExtendV2(where: $where) {
        forecastSlippageList {
          forecastSlippage
          forecastValue
          confidenceRatio
          confidenceIntervalUpper
          confidenceIntervalLower
        }
      }
    }
  `),
  token_info_balances: graphql(`
    query Token_info_balances($data: Token_infoTokenBalanceListData) {
      token_info_balances(data: $data) {
        tokens
      }
    }
  `),
};

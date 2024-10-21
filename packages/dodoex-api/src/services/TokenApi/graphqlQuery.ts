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
};

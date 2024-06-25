import { graphql } from '../../gql';

export const miningGraphqlQuery = {
  fetchMiningList: graphql(`
    query FetchMiningList($where: Miningmining_list_filter) {
      mining_list(where: $where) {
        list {
          chainId
          type
          version
          address
          baseApy
          baseLpToken {
            decimals
            address: id
            symbol
          }
          baseToken {
            decimals
            address: id
            price
            symbol
            logoImg
          }
          endBlock
          miningContractAddress
          miningTotalDollar
          baseLpTokenMining
          quoteLpTokenMining
          quoteApy
          quoteLpToken {
            decimals
            address: id
            symbol
          }
          quoteToken {
            decimals
            address: id
            price
            symbol
            logoImg
          }
          rewardTokenInfos {
            apy
            decimals
            address: id
            price
            logoImg
            rewardNumIndex
            rewardPerBlock
            startBlock
            endBlock
            startTime
            endTime
            symbol
          }
          rewardQuoteTokenInfos {
            apy
            decimals
            address: id
            price
            logoImg
            rewardNumIndex
            rewardPerBlock
            startBlock
            endBlock
            startTime
            endTime
            symbol
          }
          startBlock
          title
          platform
          startTime
          endTime
        }
        totalCount
        chains
      }
    }
  `),
};

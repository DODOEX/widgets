import { graphql } from '../../gql';

export const cpGraphqlQuery = {
  fetchCPList: graphql(`
    query FetchCPList($first: Int, $where: CrowdPooling_filter) {
      crowdPoolings(
        first: $first
        where: $where
        orderBy: bidStartTime
        orderDirection: desc
      ) {
        id
        creator
        bidStartTime
        bidEndTime
        freezeDuration
        i
        k
        poolQuoteCap
        poolQuote
        investorsCount
        totalBase
        createTime
        settled
        totalShares
        calmEndTime
        dvm {
          id
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
        version
        feeRate
        isOvercapStop
        tokenCliffRate
        tokenClaimDuration
        tokenVestingDuration
      }
    }
  `),
  fetchCPDetail: graphql(`
    query FetchCPDetail($id: ID!, $where: CrowdPooling_filter) {
      crowdPooling(id: $id, where: $where) {
        id
        creator
        bidStartTime
        bidEndTime
        freezeDuration
        i
        k
        poolQuoteCap
        poolQuote
        investorsCount
        totalBase
        createTime
        settled
        totalShares
        calmEndTime
        dvm {
          id
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
        version
        feeRate
        isOvercapStop
        tokenCliffRate
        tokenClaimDuration
        tokenVestingDuration
      }
    }
  `),
  fetchIOPCPList: graphql(`
    query FetchIOPCPList(
      $where: Crowd_pooling_read_servercrowdpoolingListFilter
      $voteWhere: Crowd_pooling_read_servercrowdpoolingVoteListFilter
    ) {
      crowd_pooling_read_server_list(where: $where) {
        address
        votes {
          id
        }
      }
      crowd_pooling_read_server_voteList(where: $voteWhere) {
        id
        account {
          address
        }
      }
    }
  `),
};

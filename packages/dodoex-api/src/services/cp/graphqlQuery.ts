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
  fetchBidPosition: graphql(`
    query FetchBidPosition($where: BidPosition_filter) {
      bidPositions(where: $where, orderBy: lastTxTime, orderDirection: desc) {
        user {
          id
        }
        cp {
          id
        }
        shares
        investedQuote
      }
    }
  `),
  fetchCPDayData: graphql(`
    query FetchCPDayData($first: Int, $where: CrowdPoolingDayData_filter) {
      crowdPoolingDayDatas(
        first: $first
        where: $where
        orderBy: date
        orderDirection: asc
      ) {
        date
        investedQuote
        investCount
        newcome
        investors
        poolQuote
      }
    }
  `),
  fetchCPHourData: graphql(`
    query FetchCPHourData($first: Int, $where: CrowdPoolingHourData_filter) {
      crowdPoolingHourDatas(
        first: $first
        where: $where
        orderBy: hour
        orderDirection: asc
      ) {
        hour
        investedQuote
        investCount
        newcome
        investors
        poolQuote
      }
    }
  `),
  fetchCPBids: graphql(`
    query FetchCPBids(
      $first: Int
      $skip: Int
      $where: BidHistory_filter
      $orderBy: BidHistory_orderBy
      $orderDirection: OrderDirection
    ) {
      bidHistories(
        first: $first
        skip: $skip
        where: $where
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        timestamp
        user {
          id
        }
        action
        cp {
          id
          quoteToken {
            id
            symbol
          }
        }
        quote
        fee
      }
    }
  `),
};

import { graphql } from '../../gql';

export const AllV3TicksDocument = graphql(/* GraphQL */ `
  query Ticks($where: Tick_filter, $skip: Int, $first: Int) {
    ticks(where: $where, skip: $skip, first: $first) {
      id
      poolAddress
      tickIdx
      liquidityNet
      price0
      price1
    }
  }
`);

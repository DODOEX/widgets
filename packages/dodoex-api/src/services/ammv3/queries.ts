import { graphql } from '../../uniswap-data-api/gql';

export const AllV3TicksDocument = graphql(/* GraphQL */ `
  query AllV3Ticks($chain: Chain!, $address: String!, $skip: Int, $first: Int) {
    v3Pool(chain: $chain, address: $address) {
      ticks(skip: $skip, first: $first) {
        tick: tickIdx
        liquidityNet
        price0
        price1
      }
    }
  }
`);

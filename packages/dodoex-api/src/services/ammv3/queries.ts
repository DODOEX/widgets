import { graphql } from '../../gql';

export const AllV3TicksDocument = graphql(/* GraphQL */ `
  query Amm_getTicksData($where: AmmgetTicksDataInput) {
    amm_getTicksData(where: $where) {
      chain
      poolAddress
      pairType
      ticks {
        id
        poolAddress
        tickIdx
        price0
        price1
        liquidityGross
        liquidityNet
        protocolPosition
        tickArrayLower
        tickArrayUpper
      }
    }
  }
`);

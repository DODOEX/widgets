/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query AllV3Ticks($chain: Chain!, $address: String!, $skip: Int, $first: Int) {\n    v3Pool(chain: $chain, address: $address) {\n      ticks(skip: $skip, first: $first) {\n        tick: tickIdx\n        liquidityNet\n        price0\n        price1\n      }\n    }\n  }\n':
    types.AllV3TicksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AllV3Ticks($chain: Chain!, $address: String!, $skip: Int, $first: Int) {\n    v3Pool(chain: $chain, address: $address) {\n      ticks(skip: $skip, first: $first) {\n        tick: tickIdx\n        liquidityNet\n        price0\n        price1\n      }\n    }\n  }\n',
): typeof import('./graphql').AllV3TicksDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

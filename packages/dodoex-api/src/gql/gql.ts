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
  '\n    query FetchLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        currentPage\n        pageSize\n        totalCount\n        lqList {\n          id\n          isPrivatePool\n          isMyLiquidity\n          pair {\n            id\n            chainId\n            type\n            baseReserve\n            quoteReserve\n            lastTradePrice\n            lpFeeRate\n            i\n            creator\n            baseLpToken {\n              id\n              decimals\n            }\n            quoteLpToken {\n              id\n              decimals\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              usdPrice\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              usdPrice\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ':
    types.FetchLiquidityListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query FetchLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        currentPage\n        pageSize\n        totalCount\n        lqList {\n          id\n          isPrivatePool\n          isMyLiquidity\n          pair {\n            id\n            chainId\n            type\n            baseReserve\n            quoteReserve\n            lastTradePrice\n            lpFeeRate\n            i\n            creator\n            baseLpToken {\n              id\n              decimals\n            }\n            quoteLpToken {\n              id\n              decimals\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              usdPrice\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              usdPrice\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ',
): typeof import('./graphql').FetchLiquidityListDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

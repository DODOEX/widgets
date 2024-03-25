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
  '\n    query FetchPoolList(\n      $first: Int\n      $where: Pair_filter\n      $orderBy: Pair_orderBy\n    ) {\n      pairs(\n        first: $first\n        where: $where\n        orderBy: $orderBy\n        orderDirection: desc\n      ) {\n        id\n        type\n        creator\n        owner\n        lpFeeRate\n        i\n        k\n        baseReserve\n        quoteReserve\n        lastTradePrice\n        feeBase\n        feeQuote\n        baseToken {\n          id\n          symbol\n          name\n          decimals\n        }\n        quoteToken {\n          id\n          symbol\n          name\n          decimals\n        }\n        baseLpToken {\n          id\n        }\n        quoteLpToken {\n          id\n        }\n      }\n    }\n  ':
    types.FetchPoolListDocument,
  '\n    query FetchLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        currentPage\n        pageSize\n        totalCount\n        lqList {\n          id\n          pair {\n            id\n            chainId\n            type\n            lpFeeRate\n            creator\n            baseLpToken {\n              id\n            }\n            quoteLpToken {\n              id\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ':
    types.FetchLiquidityListDocument,
  '\n    query FetchMyLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        lqList {\n          id\n          liquidityPositions {\n            id\n            liquidityTokenBalance\n          }\n          pair {\n            id\n            chainId\n            type\n            lpFeeRate\n            creator\n            baseLpToken {\n              id\n            }\n            quoteLpToken {\n              id\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ':
    types.FetchMyLiquidityListDocument,
  '\n    query FetchDashboardPairList($where: Dashboardtype_list_filter) {\n      dashboard_pairs_list(where: $where) {\n        list {\n          chainId\n          pairAddress\n          poolType\n          baseReserve\n          quoteReserve\n          totalFee\n          baseAddress\n          quoteAddress\n          baseSymbol\n          quoteSymbol\n          tvl\n          baseTvl\n          quoteTvl\n          baseTvlRate\n          quoteTvlRate\n        }\n      }\n    }\n  ':
    types.FetchDashboardPairListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query FetchPoolList(\n      $first: Int\n      $where: Pair_filter\n      $orderBy: Pair_orderBy\n    ) {\n      pairs(\n        first: $first\n        where: $where\n        orderBy: $orderBy\n        orderDirection: desc\n      ) {\n        id\n        type\n        creator\n        owner\n        lpFeeRate\n        i\n        k\n        baseReserve\n        quoteReserve\n        lastTradePrice\n        feeBase\n        feeQuote\n        baseToken {\n          id\n          symbol\n          name\n          decimals\n        }\n        quoteToken {\n          id\n          symbol\n          name\n          decimals\n        }\n        baseLpToken {\n          id\n        }\n        quoteLpToken {\n          id\n        }\n      }\n    }\n  ',
): typeof import('./graphql').FetchPoolListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query FetchLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        currentPage\n        pageSize\n        totalCount\n        lqList {\n          id\n          pair {\n            id\n            chainId\n            type\n            lpFeeRate\n            creator\n            baseLpToken {\n              id\n            }\n            quoteLpToken {\n              id\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ',
): typeof import('./graphql').FetchLiquidityListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query FetchMyLiquidityList($where: Liquiditylist_filter) {\n      liquidity_list(where: $where) {\n        lqList {\n          id\n          liquidityPositions {\n            id\n            liquidityTokenBalance\n          }\n          pair {\n            id\n            chainId\n            type\n            lpFeeRate\n            creator\n            baseLpToken {\n              id\n            }\n            quoteLpToken {\n              id\n            }\n            baseToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            quoteToken {\n              id\n              symbol\n              name\n              decimals\n              logoImg\n            }\n            tvl\n            apy {\n              miningBaseApy\n              miningQuoteApy\n              transactionBaseApy\n              transactionQuoteApy\n            }\n            miningAddress\n          }\n        }\n      }\n    }\n  ',
): typeof import('./graphql').FetchMyLiquidityListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query FetchDashboardPairList($where: Dashboardtype_list_filter) {\n      dashboard_pairs_list(where: $where) {\n        list {\n          chainId\n          pairAddress\n          poolType\n          baseReserve\n          quoteReserve\n          totalFee\n          baseAddress\n          quoteAddress\n          baseSymbol\n          quoteSymbol\n          tvl\n          baseTvl\n          quoteTvl\n          baseTvlRate\n          quoteTvlRate\n        }\n      }\n    }\n  ',
): typeof import('./graphql').FetchDashboardPairListDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

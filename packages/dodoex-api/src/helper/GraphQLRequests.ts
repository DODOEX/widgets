import crossFetch from 'cross-fetch';
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TypedDocumentString } from '../gql/graphql';

type Fetch = typeof crossFetch;

export interface GraphQLRequestsConfig {
  url?: string;
  fetch?: Fetch;
}

const defaultConfig = {
  url: 'https://api.dodoex.io/frontend-graphql',
};

export default class GraphQLRequests {
  private url: string;
  private client: GraphQLClient;
  constructor(configProps?: GraphQLRequestsConfig) {
    const config = { ...defaultConfig, ...configProps };
    this.url = config.url;
    const client = new GraphQLClient(this.url, {
      fetch: config.fetch,
      requestMiddleware: (request) => {
        const urlObject = new URL(request.url);
        if (request.operationName) {
          urlObject.searchParams.append('opname', request.operationName);
        }
        return {
          ...request,
          url: urlObject.toString(),
        };
      },
    });
    const auth =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxMzg2NDYzMzAzMjMxNjQzNzM5NjIzMTM4Mzk2MjJkMzA2MjYzMzkzMDYxMzc2NjM4NjQzNDMxMzYzMTJkMzEzNjM0MzYzMjYzMzY2NjJkMzE2NjYxMzQzMDMwMmQzMTM4NjQ2MzMwMzIzMTY0MzczOTYzNjI2MjYzIiwicyI6NDAsImlhdCI6MTcwODMyNzg4OSwiZXhwIjoxNzA4NDE0Mjg5fQ.S6uFXnNWL64nGj23AHuWBV7fxJ0DGlpHXoZAZXtA_Zs';
    client.setHeaders({
      'Access-Token': auth,
    });
    this.client = client;
  }

  async getData<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    variables?: V,
  ) {
    const client = this.client;
    // @ts-ignore
    return client.request<T, V>(document, variables);
  }

  getQuery<TResult, TVariables>(
    document: TypedDocumentString<TResult, TVariables>,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
  ) {
    return {
      queryKey: [
        // This logic can be customized as desired
        document,
        variables,
      ] as const,
      queryFn: async () => {
        const data = await this.getData<TResult>(
          document.toString(),
          variables as Variables,
        );
        return data as TResult;
      },
    };
  }

  getInfiniteQuery<TResult, TVariables>(
    document: TypedDocumentString<TResult, TVariables>,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
  ) {
    return {
      queryKey: [
        // This logic can be customized as desired
        document,
        variables,
      ] as const,
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const data = await this.getData<TResult>(document.toString(), {
          ...variables,
          where: {
            ...(variables as any)?.where,
            currentPage: pageParam,
          },
        } as Variables);
        return data as TResult;
      },
    };
  }
}

import crossFetch from 'cross-fetch';
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TypedDocumentString } from '../gql/graphql';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/esm/types';

type Fetch = typeof crossFetch;

export interface GraphQLRequestsConfig {
  url?: string;
  fetch?: Fetch;
  getHeaders?: () => GraphQLClientRequestHeaders;
}

const defaultConfig = {
  url: 'https://api.dodoex.io/frontend-graphql',
};

export default class GraphQLRequests {
  private url: string;
  private client: GraphQLClient;
  private getHeaders?: GraphQLRequestsConfig['getHeaders'];
  constructor(configProps?: GraphQLRequestsConfig) {
    const config = { ...defaultConfig, ...configProps };
    this.url = config.url;
    this.getHeaders = config.getHeaders;
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
    this.client = client;
    this.setHeaders();
  }

  setHeaders() {
    const headers = this.getHeaders?.();
    if (headers) {
      this.client.setHeaders(headers);
    }
  }

  async getData<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    variables?: V,
  ) {
    this.setHeaders();
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
    pageKey: string,
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
            [pageKey]: pageParam,
          },
        } as Variables);
        return data as TResult;
      },
    };
  }
}

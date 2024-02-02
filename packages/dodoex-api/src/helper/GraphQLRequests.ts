import crossFetch from 'cross-fetch';
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

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
    });
    const auth =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwNzgzNTM0MzMzOTMzNjYzMjMyMzgzODYyMzQ2NjMzNjQ2MTMyNjE2MzMyMzQzNzYxMzQzODY0MzQzODY1NjY2NjMzNjE2MzM1MzI2NjM2NjQzNiIsInMiOjQwLCJpYXQiOjE3MDY3ODI3MzcsImV4cCI6MTcwNjg2OTEzN30.qoc6IydY_SDzZxDYS-KsWLGajXN62kJUH5ZICdZzJxE';
    client.setHeaders({
      'Access-Token': auth,
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 DODO/lite-ssr',
    });
    this.client = client;
  }

  async responseProcessor<T>(response: Response) {
    if (response.ok) {
      const result = await response.json();
      return {
        response: response,
        result: result as {
          code: number;
          msg: string | null;
          data: T | null;
        },
      };
    }
    throw new Error(`Response ${JSON.stringify(response)} failed`);
  }

  async getData<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    variables?: V,
  ) {
    const client = this.client;
    // @ts-ignore
    return client.request<T, V>(document, variables);
  }
}

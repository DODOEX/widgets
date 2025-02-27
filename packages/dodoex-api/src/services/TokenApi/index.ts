import { ChainId, platformIdMap } from '../../chainConfig';
import RestApiRequest from '../../helper/RestApiRequests';
import { tokenGraphqlQuery } from './graphqlQuery';

export interface TokenApiProps {
  restApiRequest?: RestApiRequest;
}

export class TokenApi {
  restApiRequest: RestApiRequest;
  constructor(config: TokenApiProps) {
    this.restApiRequest = config?.restApiRequest || new RestApiRequest();
  }

  static graphql = tokenGraphqlQuery;

  static utils = {};

  static encode = {};

  getFiatPriceBatch(
    tokens: Array<{
      chainId: ChainId;
      address: string;
      symbol: string;
    }>,
    token: string,
  ) {
    const path = `/frontend-v2-price-api/current/batch`;
    return this.restApiRequest.postJson(
      path,
      {
        networks: tokens.map((token) => platformIdMap[token.chainId]),
        addresses: tokens.map((token) => token.address),
        symbols: tokens.map((token) => token.symbol),
        isCache: true,
      },
      undefined,
      {
        headers: {
          'pass-key': token,
        },
      },
    );
  }
}

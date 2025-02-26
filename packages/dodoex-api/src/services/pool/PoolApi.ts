import { poolGraphqlQuery } from './graphqlQuery';
import { poolUtils } from './poolUtils';

export interface PoolApiProps {}

export class PoolApi {
  static graphql = poolGraphqlQuery;

  static utils = poolUtils;
}

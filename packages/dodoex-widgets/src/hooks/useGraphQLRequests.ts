import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

export const graphQLRequestsLocal = new GraphQLRequests({
  // url: 'https://api.gcp.dxd.ink/frontend-graphql',
});

export const graphQLRequestsUniswap = new GraphQLRequests({
  url: 'https://api.uniswap.org/v1/graphql',
});

export function useGraphQLRequests() {
  const { graphQLRequests } = useUserOptions();

  return graphQLRequests ?? graphQLRequestsLocal;
}

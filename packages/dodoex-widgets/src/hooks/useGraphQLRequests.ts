import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

export const graphQLRequestsLocal = new GraphQLRequests({
  // url: 'https://gateway.gcp.dxd.ink/frontend-graphql',
});

export function useGraphQLRequests() {
  const { graphQLRequests } = useUserOptions();

  return graphQLRequests ?? graphQLRequestsLocal;
}

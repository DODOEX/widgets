import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

let graphQLRequestsLocal: GraphQLRequests | null = null;

export function useGraphQLRequests() {
  const { API_DOMAIN, graphQLRequests } = useUserOptions();

  if (graphQLRequests) {
    return graphQLRequests;
  }

  if (!graphQLRequestsLocal) {
    graphQLRequestsLocal = new GraphQLRequests({
      url: `https://gateway.${API_DOMAIN}/graphql`,
    });
  }

  return graphQLRequestsLocal;
}

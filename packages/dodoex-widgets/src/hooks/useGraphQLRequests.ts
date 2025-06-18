import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

let graphQLRequestsLocal: GraphQLRequests | null = null;

export function useGraphQLRequests() {
  const { GRAPHQL_URL, graphQLRequests } = useUserOptions();

  if (graphQLRequests) {
    return graphQLRequests;
  }

  if (!graphQLRequestsLocal) {
    graphQLRequestsLocal = new GraphQLRequests({
      url: GRAPHQL_URL,
    });
  }

  return graphQLRequestsLocal;
}

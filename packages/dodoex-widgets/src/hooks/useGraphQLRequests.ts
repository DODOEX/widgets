import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

let graphQLRequestsLocal: GraphQLRequests | null = null;

export function useGraphQLRequests() {
  const { graphQLRequests, apiDomain } = useUserOptions();

  if (graphQLRequests) {
    return graphQLRequests;
  }

  if (!graphQLRequestsLocal) {
    graphQLRequestsLocal = new GraphQLRequests({
      url: `https://${apiDomain}/frontend-graphql`,
    });
  }

  return graphQLRequestsLocal;
}

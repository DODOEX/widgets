import { GraphQLRequests } from '@dodoex/api';
import { useUserOptions } from '../components/UserOptionsProvider';

export const graphQLRequestsLocal = new GraphQLRequests();

export function useGraphQLRequests() {
  const { graphQLRequests } = useUserOptions();

  return graphQLRequests ?? graphQLRequestsLocal;
}

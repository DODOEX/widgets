import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // When the return data is Proxy, this method will convert the lost proxy attribute
      structuralSharing: false,
    },
  },
});

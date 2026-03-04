import { useQuery } from '@tanstack/react-query';

const BIFROST_API_URL = 'https://dapi.bifrost.io/api/site';

interface BifrostSiteResponse {
  [tokenSymbol: string]: {
    apy?: string | number;
    [key: string]: unknown;
  };
}

/**
 * Fetch APY data from the Bifrost API.
 * The API returns a map of token symbol → data including apy.
 * @param wrapTokenSymbol - e.g. "vASTR", "vDOT"
 */
export function useBifrostApy(wrapTokenSymbol: string | undefined) {
  const query = useQuery<BifrostSiteResponse>({
    queryKey: ['bifrost-site-apy'],
    queryFn: async () => {
      const res = await fetch(BIFROST_API_URL);
      if (!res.ok) {
        throw new Error(`Bifrost API error: ${res.status}`);
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,
  });

  const apy = wrapTokenSymbol
    ? query.data?.[wrapTokenSymbol]?.apy
    : undefined;

  const apyDisplay =
    apy != null
      ? `~${Number(apy).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`
      : undefined;

  return {
    apy,
    apyDisplay,
    isLoading: query.isLoading,
    error: query.error,
  };
}

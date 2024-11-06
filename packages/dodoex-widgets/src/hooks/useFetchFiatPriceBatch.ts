import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUserOptions } from '../components/UserOptionsProvider';
import { APIServiceKey } from '../constants/api';
import { getPlatformId } from '../utils';
import { useGetAPIService } from './setting/useGetAPIService';
import { TokenInfo } from './Token';

export function useFetchFiatPriceBatch({ tokens }: { tokens: TokenInfo[] }) {
  const { apikey } = useUserOptions();
  const fiatPriceAPI = useGetAPIService(APIServiceKey.fiatPrice);

  return useQuery({
    enabled: !!tokens.length,
    queryKey: ['fetch', 'fetchFiatPrice', tokens],
    queryFn: async () => {
      const result = await axios.post(
        fiatPriceAPI,
        {
          networks: tokens.map((token) => getPlatformId(token.chainId)),
          addresses: tokens.map((token) => token.address),
          symbols: tokens.map((token) => token.symbol),
          isCache: true,
        },
        apikey
          ? {
              headers: { apikey },
            }
          : undefined,
      );
      const resultMap = new Map<string, number>();
      if (result.data.data) {
        result.data.data.forEach((item: { price: string; address: string }) => {
          const tokenUSD = Number(item.price);
          if (!Number.isNaN(tokenUSD) && tokenUSD > 0) {
            resultMap.set(item.address, tokenUSD);
          }
        });
      }
      return resultMap;
    },
  });
}

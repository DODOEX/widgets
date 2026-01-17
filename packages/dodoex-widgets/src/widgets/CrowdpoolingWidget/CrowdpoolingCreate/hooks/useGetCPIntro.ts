import { useQuery } from '@tanstack/react-query';
import { APIServiceKey } from '../../../../constants/api';
import { useGetAPIService } from '../../../../hooks/setting/useGetAPIService';
import axios from 'axios';

export function useGetCPIntro(chainId: number | undefined, crowdpoolingAddress: string | undefined) {
  const cpGetDetailAPI = useGetAPIService(APIServiceKey.cpGetDetail);

  return useQuery({
    queryKey: ['cpIntro', chainId, crowdpoolingAddress],
    queryFn: async () => {
      const response = await axios.get(cpGetDetailAPI, {
        params: {
          chainId,
          crowdpoolingAddress,
        },
      });
      if (response.data?.code !== 0) {
        throw new Error(response.data?.msg || 'Fetch failed');
      }
      return response.data?.data as null | {
        id: string;
        chainId: number;
        name?: string;
        owner: string;
        crowdpoolingAddress: string;
        coverImg?: string;
        tokenName?: string;
        website?: string;
        twitter?: string;
        telegram?: string;
        discord?: string;
        description?: string;
        createAt: string;
        updateAt: string;
      };
    },
    enabled: !!crowdpoolingAddress && chainId !== undefined,
  });
}

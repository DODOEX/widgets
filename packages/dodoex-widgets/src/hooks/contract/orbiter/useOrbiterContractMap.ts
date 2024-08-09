import { useQuery } from '@tanstack/react-query';
import { ChainId } from '../../../constants/chains';
import { ORBITER_CHAINS_URL, ORBITER_ROUTERS_URL } from './constants';

interface OrbiterRoute {
  key: string;
  id: string;
  fromChainId: ChainId;
  toChainId: ChainId;
  fromTokenAddress: string;
  toTokenAddress: string;
  product: string;
  endpoint: string;
  minAmt: string;
  withholdingFee: string;
  tradeFee: string;
}

export function useOrbiterContractMap({ skip }: { skip?: boolean } = {}) {
  const routersQuery = useQuery({
    queryKey: ['orbiterContractList'],
    enabled: !skip,
    queryFn: async () => {
      // Fetch data from your API
      const response = await fetch(ORBITER_CHAINS_URL);
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message);
      }
      const data = result.result as Array<{
        chainId: string;
        contracts: Array<{
          name: string;
          address: string;
        }>;
      }>;

      const bridgeContractMap = new Map<number, string>();
      data.forEach((item) => {
        const chainId = Number(item.chainId);
        const bridgeContract = item.contracts.find(
          (contract) => contract.name === 'OrbiterRouterV3',
        );
        if (bridgeContract?.address) {
          bridgeContractMap.set(chainId, bridgeContract.address);
        }
      });

      return {
        bridgeContractMap,
      };
    },
  });

  return routersQuery;
}

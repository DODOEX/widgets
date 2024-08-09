import { useQuery } from '@tanstack/react-query';
import { ChainId } from '../../../constants/chains';
import { ORBITER_ROUTERS_URL } from './constants';

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
  maxAmt: string;
  withholdingFee: string;
  tradeFee: string;
  spentTime: string;
  vc: string;
}

export function useOrbiterRouters({ skip }: { skip?: boolean } = {}) {
  const routersQuery = useQuery({
    queryKey: ['orbiterRouters'],
    enabled: !skip,
    queryFn: async () => {
      // Fetch data from your API
      const response = await fetch(ORBITER_ROUTERS_URL);
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message);
      }
      const data = result.result as Array<{
        line: string;
        endpoint: string;
        srcChain: string;
        tgtChain: string;
        srcToken: string;
        tgtToken: string;
        minAmt: string;
        maxAmt: string;
        tradeFee: string;
        withholdingFee: string;
        spentTime: string;
        vc: string;
        state: 'available' | string;
      }>;

      const routerList = [] as Array<OrbiterRoute>;
      const routeKeySet = new Set<string>();
      const product = 'orbiter';
      data.forEach((item) => {
        const line = item.line;
        const [_chain, coin] = line.split('-');
        const [srcSymbol, tgtSYmbol] = coin.split('/');
        const fromChainId =
          item.srcChain.toLocaleUpperCase() === 'TON'
            ? ChainId.TON
            : Number(item.srcChain);
        const toChainId =
          item.tgtChain.toLocaleUpperCase() === 'TON'
            ? ChainId.TON
            : Number(item.tgtChain);
        if (
          item.state !== 'available' ||
          !fromChainId ||
          !toChainId ||
          (fromChainId !== ChainId.TON && toChainId !== ChainId.TON)
        )
          return;
        const key = `${product}-${fromChainId}-${toChainId}-${item.endpoint.toLocaleLowerCase()}-${srcSymbol.toLocaleLowerCase()}-${tgtSYmbol.toLocaleLowerCase()}`;
        if (routeKeySet.has(key)) return;
        routeKeySet.add(key);

        const fromTokenAddress = item.srcToken;
        const toTokenAddress = item.tgtToken;

        routerList.push({
          key,
          id: product,
          fromChainId,
          toChainId,
          fromTokenAddress,
          toTokenAddress,
          product,
          endpoint: item.endpoint,
          minAmt: item.minAmt,
          maxAmt: item.maxAmt,
          withholdingFee: item.withholdingFee,
          tradeFee: item.tradeFee,
          spentTime: item.spentTime,
          vc: item.vc,
        });
      });

      return routerList;
    },
  });

  return routersQuery;
}

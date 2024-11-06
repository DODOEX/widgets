import { basicTokenMap, ChainId } from '@dodoex/api';
import { useCallback } from 'react';
import {
  LpTokenPlatformID,
  MiningStakeTokenWithAmountI,
  TabMiningI,
} from '../../types';

export function useGetLpLink({
  chainId,
  type,
  lpTokenPlatformID,
  stakedTokenWithAmountList,
  addLiquidityCallback,
}: {
  chainId: ChainId;
  addLiquidityCallback: () => void;
  stakedTokenWithAmountList: MiningStakeTokenWithAmountI[];
} & Pick<TabMiningI, 'lpTokenPlatformID' | 'type'>) {
  const goLpLink = useCallback(async () => {
    if (type === 'vdodo') {
      return;
    }

    if (type === 'single') {
      return;
    }

    if (lpTokenPlatformID === LpTokenPlatformID.pancakeV2) {
      const [baseToken, quoteToken] = stakedTokenWithAmountList;
      if (!baseToken || !quoteToken) {
        return;
      }
      const etherToken = basicTokenMap[chainId];
      var url: string;
      if (
        etherToken?.wrappedTokenAddress?.toLowerCase() ===
        quoteToken.address?.toLowerCase()
      ) {
        url = `https://pancakeswap.finance/add/${baseToken.address}/${etherToken.symbol}`;
      } else {
        url = `https://pancakeswap.finance/add/${baseToken.address}/${quoteToken.symbol}`;
      }
      window.open(url, '_blank');
      return;
    }

    addLiquidityCallback();
  }, [
    addLiquidityCallback,
    chainId,
    lpTokenPlatformID,
    stakedTokenWithAmountList,
    type,
  ]);

  return goLpLink;
}

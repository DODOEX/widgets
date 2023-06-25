import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import { ChainId } from '../../constants/chains';
import { chainListMap } from '../../constants/chainList';

export function useSelectChainList() {
  const { chainId } = useWeb3React();
  const [selectChainId, setSelectChainId] = useState(chainId);
  const chainList = useMemo(() => {
    const chainListObject: Partial<typeof chainListMap> = {};
    let replaceChainId: ChainId | undefined;
    Object.entries(chainListMap).forEach(([key, chain]) => {
      if (chain.mainnet) {
        if (chainId !== chain.chainId) {
          return;
        }
        replaceChainId = chain.mainnet;
      }
      chainListObject[key as unknown as ChainId] = { ...chain };
    });
    if (replaceChainId !== undefined) {
      delete chainListObject[replaceChainId];
    }
    return Object.values(chainListObject);
  }, [chainId]);

  useEffect(() => {
    if (selectChainId === undefined) {
      setSelectChainId(chainId);
    }
  }, [chainId]);

  return {
    chainList,
    selectChainId,
    setSelectChainId,
  };
}

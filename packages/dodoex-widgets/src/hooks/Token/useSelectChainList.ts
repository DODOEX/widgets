import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import { ChainId } from '@dodoex/api';
import { ChainListItem, chainListMap } from '../../constants/chainList';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { getAllTokenList, useTokenState } from '../useTokenState';

export function useSelectChainList(side?: 'from' | 'to') {
  const { chainId } = useWeb3React();
  const allTokenList = useTokenState(getAllTokenList);
  const { crossChain, onlyChainId } = useUserOptions();
  const hasTokenChainIds = useMemo(() => {
    const result = new Set<ChainId>();
    allTokenList.forEach((token) => {
      if (!token.side || !side || token.side === side) {
        result.add(token.chainId);
      }
    });
    return result;
  }, [allTokenList, side]);
  const chainList = useMemo(() => {
    if (!crossChain || onlyChainId) return [];
    const currentChainListMap = new Map<ChainId, ChainListItem>();
    let replaceChainId: ChainId | undefined;
    chainListMap.forEach((chain, key) => {
      if (hasTokenChainIds.has(chain.chainId)) {
        if (chain.mainnet) {
          if (chainId !== chain.chainId) {
            return;
          }
          replaceChainId = chain.mainnet;
        }
        currentChainListMap.set(key as unknown as ChainId, { ...chain });
      }
    });
    if (replaceChainId !== undefined) {
      currentChainListMap.delete(replaceChainId);
    }
    return Array.from(currentChainListMap.values());
  }, [chainId, allTokenList, crossChain, onlyChainId]);

  const defaultChainId = useMemo(
    () =>
      !chainList.length || (chainId && hasTokenChainIds.has(chainId))
        ? chainId
        : chainList[0].chainId,
    [chainId, hasTokenChainIds],
  );
  const [selectChainId, setSelectChainId] = useState(defaultChainId);

  useEffect(() => {
    if (selectChainId === undefined) {
      setSelectChainId(defaultChainId);
    }
  }, [defaultChainId]);

  const selectChainIdShow = useMemo(
    () => selectChainId ?? defaultChainId,
    [selectChainId, defaultChainId],
  );

  return {
    chainList,
    selectChainId: selectChainIdShow,
    setSelectChainId,
  };
}

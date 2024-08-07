import { useEffect, useMemo, useState } from 'react';
import { ChainId } from '../../constants/chains';
import { ChainListItem, chainListMap } from '../../constants/chainList';
import { useSelector } from 'react-redux';
import { getAllTokenList } from '../../store/selectors/token';
import { getGlobalProps } from '../../store/selectors/globals';
import { useWalletState } from '../ConnectWallet/useWalletState';

export function useSelectChainList(side?: 'from' | 'to') {
  const { chainId } = useWalletState();
  const allTokenList = useSelector(getAllTokenList);
  const crossChain = useSelector(getGlobalProps).crossChain;
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
    if (!crossChain) return [];
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
  }, [chainId, allTokenList, crossChain]);

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

import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import { ChainId } from '../../constants/chains';
import { chainListMap } from '../../constants/chainList';
import { useSelector } from 'react-redux';
import { getAllTokenList } from '../../store/selectors/token';

export function useSelectChainList(side?: 'from' | 'to') {
  const { chainId } = useWeb3React();
  const allTokenList = useSelector(getAllTokenList);
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
    const chainListObject: Partial<typeof chainListMap> = {};
    let replaceChainId: ChainId | undefined;
    Object.entries(chainListMap).forEach(([key, chain]) => {
      if (hasTokenChainIds.has(chain.chainId)) {
        if (chain.mainnet) {
          if (chainId !== chain.chainId) {
            return;
          }
          replaceChainId = chain.mainnet;
        }
        chainListObject[key as unknown as ChainId] = { ...chain };
      }
    });
    if (replaceChainId !== undefined) {
      delete chainListObject[replaceChainId];
    }
    return Object.values(chainListObject);
  }, [chainId, allTokenList]);

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

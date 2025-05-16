import { useEffect, useMemo, useState } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';

export function useSelectChainList(side?: 'from' | 'to') {
  const { crossChain, defaultChainId } = useUserOptions();

  const chainList = useMemo(() => {
    if (!crossChain) {
      return [];
    }

    return Array.from(chainListMap.values());
  }, [crossChain]);

  const [selectChainId, setSelectChainId] = useState(defaultChainId);

  useEffect(() => {
    setSelectChainId((selectChainId) => {
      if (selectChainId === undefined) {
        return defaultChainId;
      }
      return selectChainId;
    });
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

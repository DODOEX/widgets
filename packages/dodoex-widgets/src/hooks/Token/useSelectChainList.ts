import { useEffect, useMemo, useState } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';

export function useSelectChainList(side?: 'from' | 'to') {
  const { crossChain, defaultChainId, IS_TEST_ENV } = useUserOptions();

  const chainList = useMemo(() => {
    if (!crossChain) {
      return [];
    }

    if (!IS_TEST_ENV) {
      return Array.from(chainListMap.values()).filter(
        (chain) => !chain.isTestNet,
      );
    }

    return Array.from(chainListMap.values());
  }, [IS_TEST_ENV, crossChain]);

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

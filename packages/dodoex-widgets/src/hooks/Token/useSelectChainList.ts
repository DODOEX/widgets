import { useMemo, useState } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { chainListMap } from '../../constants/chainList';
import { TokenInfo } from './type';

export function useSelectChainList(
  value?: TokenInfo | null | Array<TokenInfo>,
) {
  const { crossChain, defaultChainId, IS_TEST_ENV } = useUserOptions();
  const [selectChainId, setSelectChainId] = useState(
    value
      ? Array.isArray(value)
        ? value[0]
          ? value[0].chainId
          : defaultChainId
        : value.chainId
      : defaultChainId,
  );

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

  return {
    chainList,
    selectChainId,
    setSelectChainId,
  };
}

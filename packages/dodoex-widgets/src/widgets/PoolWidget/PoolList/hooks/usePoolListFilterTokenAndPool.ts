import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { FetchLiquidityListLqList } from '../../utils';

export interface TokenAndPoolFilterUserOptions {
  value: Array<TokenInfo>;
  element: React.ReactNode;
}

export function usePoolListFilterTokenAndPool(
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions,
) {
  const [filterTokens, setFilterTokens] = React.useState<Array<TokenInfo>>(
    tokenAndPoolFilter?.value ?? [],
  );
  const [filterAddressLqList, setFilterAddressLqList] =
    React.useState<FetchLiquidityListLqList>([]);

  React.useEffect(() => {
    if (tokenAndPoolFilter) {
      setFilterTokens(tokenAndPoolFilter.value);
    }
  }, [tokenAndPoolFilter?.value]);

  const [filterASymbol, filterBSymbol] = React.useMemo(() => {
    const [filterAToken, filterBToken] = filterTokens;
    return [filterAToken?.symbol, filterBToken?.symbol];
  }, [filterTokens]);

  const handleChangeFilterTokens = (tokens: Array<TokenInfo>) => {
    setFilterAddressLqList([]);
    setFilterTokens(tokens);
  };

  const handleChangeFilterAddress = (lqList: FetchLiquidityListLqList) => {
    setFilterAddressLqList(lqList);
    setFilterTokens([]);
  };

  const handleDeleteToken = (token: TokenInfo) => {
    setFilterTokens((prev) => {
      const newFilterTokens = [...prev];
      const index = newFilterTokens.indexOf(token);
      if (index !== -1) {
        newFilterTokens.splice(index, 1);
      }
      return newFilterTokens;
    });
  };

  return {
    filterTokens,
    filterASymbol,
    filterBSymbol,
    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  };
}

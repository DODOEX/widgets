import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { FetchLiquidityListLqList } from '../../utils';

export function usePoolListFilterTokenAndPool() {
  const [filterTokens, setFilterTokens] = React.useState<Array<TokenInfo>>([]);
  const [filterAddressLqList, setFilterAddressLqList] =
    React.useState<FetchLiquidityListLqList>([]);

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

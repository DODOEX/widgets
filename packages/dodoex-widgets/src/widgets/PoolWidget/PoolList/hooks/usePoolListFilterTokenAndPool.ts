import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { FetchLiquidityListLqList } from '../../utils';

export interface TokenAndPoolFilterUserOptions {
  tokens: Array<TokenInfo>;
  lqList: FetchLiquidityListLqList;
  onChangeFilterTokens: (tokens: Array<TokenInfo>) => void;
  onChangeFilterAddressLqList: (lqList: FetchLiquidityListLqList) => void;
  element: React.ReactNode;
}

export function usePoolListFilterTokenAndPool(
  tokenAndPoolFilter?: TokenAndPoolFilterUserOptions,
) {
  const [filterTokens, setFilterTokens] = React.useState<Array<TokenInfo>>(
    tokenAndPoolFilter?.tokens ?? [],
  );
  const [filterAddressLqList, setFilterAddressLqList] =
    React.useState<FetchLiquidityListLqList>([]);

  React.useEffect(() => {
    if (tokenAndPoolFilter) {
      setFilterTokens(tokenAndPoolFilter.tokens);
      setFilterAddressLqList(tokenAndPoolFilter.lqList);
    }
  }, [tokenAndPoolFilter]);

  const [filterASymbol, filterBSymbol] = React.useMemo(() => {
    const [filterAToken, filterBToken] = filterTokens;
    return [filterAToken?.symbol, filterBToken?.symbol];
  }, [filterTokens]);

  const handleChangeFilterTokens = (tokens: Array<TokenInfo>) => {
    setFilterAddressLqList([]);
    setFilterTokens(tokens);
    if (tokenAndPoolFilter) {
      tokenAndPoolFilter.onChangeFilterTokens(tokens);
      tokenAndPoolFilter.onChangeFilterAddressLqList([]);
    }
  };

  const handleChangeFilterAddress = (lqList: FetchLiquidityListLqList) => {
    setFilterAddressLqList(lqList);
    setFilterTokens([]);
    if (tokenAndPoolFilter) {
      tokenAndPoolFilter.onChangeFilterTokens([]);
      tokenAndPoolFilter.onChangeFilterAddressLqList(lqList);
    }
  };

  const handleDeleteToken = (token: TokenInfo) => {
    setFilterTokens((prev) => {
      const newFilterTokens = [...prev];
      const index = newFilterTokens.indexOf(token);
      if (index !== -1) {
        newFilterTokens.splice(index, 1);
      }
      if (tokenAndPoolFilter) {
        tokenAndPoolFilter.onChangeFilterTokens(newFilterTokens);
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

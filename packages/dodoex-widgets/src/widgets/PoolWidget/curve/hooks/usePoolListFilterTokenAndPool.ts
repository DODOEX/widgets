import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { CurvePoolT } from '../types';

export function usePoolListFilterTokenAndPool() {
  const [filterTokens, setFilterTokens] = React.useState<Array<TokenInfo>>([]);
  const [filterAddressLqList, setFilterAddressLqList] = React.useState<
    CurvePoolT[]
  >([]);

  const handleChangeFilterTokens = (tokens: Array<TokenInfo>) => {
    setFilterAddressLqList([]);
    if (tokens.length > 0) {
      setFilterTokens([tokens[tokens.length - 1]]);
    } else {
      setFilterTokens([]);
    }
  };

  const handleChangeFilterAddress = (lqList: CurvePoolT[]) => {
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

    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  };
}

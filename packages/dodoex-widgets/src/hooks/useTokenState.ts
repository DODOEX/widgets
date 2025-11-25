import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TokenInfo, TokenList } from './Token';
import { unionBy } from 'lodash';

export type AccountBalance = {
  tokenBalances?: BigNumber;
  tokenAllowances?: BigNumber;
};
export type AccountBalances = {
  [key in string]: AccountBalance;
}; // key: tokenAddress

interface TokenState {
  tokenList: TokenList;
  popularTokenList: TokenList;
  customTokenList: TokenList;
}

export const useTokenState = create(
  persist<TokenState>(
    (set) => ({
      tokenList: [],
      popularTokenList: [],
      slippageWithTokens: [],
      customTokenList: [],
    }),
    {
      name: 'token-state-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['customTokenList'].includes(key),
          ),
        ) as TokenState,
    },
  ),
);

export function getAllTokenList(state?: TokenState) {
  const { tokenList, popularTokenList } = state ?? useTokenState.getState();
  return unionBy(
    popularTokenList,
    tokenList,
    (token) => token.address.toLowerCase() + token.chainId + token.side,
  );
}

export function setTokenList(value: TokenState['tokenList']) {
  useTokenState.setState({
    tokenList: value,
  });
}
export function setPopularTokenList(value: TokenState['popularTokenList']) {
  useTokenState.setState({
    popularTokenList: value,
  });
}

export function setCustomTokenList(value: TokenInfo) {
  useTokenState.setState((prev) => {
    return {
      customTokenList: [...prev.customTokenList, value],
    };
  });
}
export function deleteCustomTokenList(value: TokenInfo) {
  useTokenState.setState((prev) => {
    const newCustomTokenList = prev.customTokenList.filter((token) => {
      return !(
        token.address.toLocaleLowerCase() ===
          value.address.toLocaleLowerCase() && token.chainId === value.chainId
      );
    });
    return {
      customTokenList: newCustomTokenList,
    };
  });
}

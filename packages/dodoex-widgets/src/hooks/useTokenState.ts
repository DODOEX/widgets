import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { TokenList } from './Token';
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
}

export const useTokenState = create<TokenState>((set) => ({
  tokenList: [],
  popularTokenList: [],
  slippageWithTokens: [],
}));

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

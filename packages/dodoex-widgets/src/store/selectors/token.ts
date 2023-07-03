import BigNumber from 'bignumber.js';
import { ChainId } from '../../constants/chains';
import type { DefaultTokenInfo } from '../../hooks/Token';
import { store } from '..';
import { RootState } from '../reducers';

export const getTokenList = (state?: RootState) => {
  return (state ?? store.getState()).token.tokenList;
};
export const getPopularTokenList = (chainId: ChainId, state?: RootState) => {
  return (state ?? store.getState()).token.popularTokenList.filter(
    ({ chainId: tokenChainId }) => chainId === tokenChainId,
  );
};
export const getSlippageWithTokens = (state?: RootState) => {
  return (state ?? store.getState()).token.slippageWithTokens;
};
export const getAccountBalances = (state?: RootState) => {
  return (state ?? store.getState()).token.accountBalances;
};

export const getEthBalance = (state?: RootState) => {
  return (state ?? store.getState()).token.ethBalance;
};

export const getDefaultFromToken = (
  state?: RootState,
): DefaultTokenInfo | undefined => {
  return (state ?? store.getState()).token.defaultFromToken;
};

export const getDefaultToToken = (
  state?: RootState,
): DefaultTokenInfo | undefined => {
  return (state ?? store.getState()).token.defaultToToken;
};

export const getTokenBalance = (
  tokenAddress: string,
  state?: RootState,
): BigNumber => {
  return (
    (state ?? store.getState()).token.accountBalances[tokenAddress]
      ?.tokenBalances || new BigNumber(NaN)
  );
};

export const getTokenAllowance = (tokenAddress: string, state?: RootState) => {
  (state ?? store.getState()).token.accountBalances[tokenAddress]
    ?.tokenAllowances || new BigNumber(NaN);
};

export const getBalanceLoadings = (state?: RootState) => {
  return (state ?? store.getState()).token.balanceLoadings;
};

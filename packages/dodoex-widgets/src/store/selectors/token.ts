import BigNumber from 'bignumber.js';
import { ChainId } from '../../constants/chains';
import type { DefaultTokenInfo } from '../../hooks/Token';
import { store } from '..';
import { RootState } from '../reducers';
import { unionBy } from 'lodash';

export const getTokenList = (state?: RootState) => {
  return (state ?? store.getState()).token.tokenList;
};
export const getAllTokenList = (state?: RootState) => {
  const { tokenList, popularTokenList } = (state ?? store.getState()).token;
  return unionBy(
    popularTokenList,
    tokenList,
    (token) => token.address.toLowerCase() + token.chainId + token.side,
  );
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

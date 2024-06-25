import BigNumber from 'bignumber.js';
import { ChainId } from '@dodoex/api';
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

import { ChainId } from '@dodoex/api';
import { unionBy } from 'lodash';
import { store } from '..';
import { RootState } from '../reducers';

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

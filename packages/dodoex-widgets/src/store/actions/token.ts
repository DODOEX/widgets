import BigNumber from 'bignumber.js';
import { AppThunkAction } from '.';
import { TokenList, TokenInfo } from '../../hooks/Token';
import { AccountBalances, SlippageWithToken } from '../reducers/token';

export const setTokenList = (tokenList: TokenList): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_TOKEN_LIST',
      payload: tokenList,
    });
  };
};
export const setPopularTokenList = (
  popularTokenList: TokenList,
): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_POPULAR_TOKEN_LIST',
      payload: popularTokenList,
    });
  };
};
export const setSlippageWithTokens = (
  slippageWithTokens: SlippageWithToken[],
): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_SLIPPAGE_WITH_TOKENS',
      payload: slippageWithTokens,
    });
  };
};

export const setDefaultToToken = (token: TokenInfo): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_DEFAULT_TO_TOKEN',
      payload: token,
    });
  };
};

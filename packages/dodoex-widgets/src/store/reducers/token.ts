import BigNumber from 'bignumber.js';
import { AnyAction } from 'redux';
import type { TokenList, DefaultTokenInfo } from '../../hooks/Token';

export type AccountBalance = {
  tokenBalances?: BigNumber;
  tokenAllowances?: BigNumber;
};
export type AccountBalances = {
  [key in string]: AccountBalance;
}; // key: tokenAddress
export type SlippageWithToken = {
  slippage: string;
  tokens: string[];
};

export type State = {
  tokenList: TokenList;
  popularTokenList: TokenList;
  slippageWithTokens: SlippageWithToken[];
  defaultFromToken?: DefaultTokenInfo;
  defaultToToken?: DefaultTokenInfo;
};

export const initialState: State = {
  tokenList: [] as TokenList,
  popularTokenList: [] as TokenList,
  slippageWithTokens: [],
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_TOKEN_LIST':
      return {
        ...state,
        tokenList: action.payload,
      };
    case 'SET_POPULAR_TOKEN_LIST':
      return {
        ...state,
        popularTokenList: action.payload,
      };
    case 'SET_SLIPPAGE_WITH_TOKENS':
      return {
        ...state,
        slippageWithTokens: action.payload,
      };
    case 'SET_DEFAULT_FROM_TOKEN':
      return {
        ...state,
        defaultFromToken: action.payload,
      };
    case 'SET_DEFAULT_TO_TOKEN':
      return {
        ...state,
        defaultToToken: action.payload,
      };
    default:
      return state;
  }
};

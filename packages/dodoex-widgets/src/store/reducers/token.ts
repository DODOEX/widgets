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
  ethBalance: { [key: number]: BigNumber };
  accountBalances: AccountBalances;
  balanceLoadings: { [key in string]: boolean };
  slippageWithTokens: SlippageWithToken[];
  defaultFromToken?: DefaultTokenInfo;
  defaultToToken?: DefaultTokenInfo;
};

export const initialState: State = {
  tokenList: [] as TokenList,
  popularTokenList: [] as TokenList,
  ethBalance: {},
  accountBalances: {} as AccountBalances,
  balanceLoadings: {} as { [key in string]: boolean },
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
    case 'SET_ETH_BALANCE':
      return {
        ...state,
        ethBalance: {
          ...state.ethBalance,
          ...action.payload,
        },
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
    case 'SET_ACCOUNT_BALANCES':
      return {
        ...state,
        accountBalances: {
          ...state.accountBalances,
          ...action.payload,
        },
      };
    case 'SET_ACCOUNT_ALLOWANCES':
      const accountBalances = { ...state.accountBalances };
      Object.keys(accountBalances).map((key) => {
        accountBalances[key].tokenAllowances = action.payload;
      });
      return {
        ...state,
        accountBalances,
      };
    case 'SET_BALANCE_LOADINGS':
      return {
        ...state,
        balanceLoadings: {
          ...state.balanceLoadings,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

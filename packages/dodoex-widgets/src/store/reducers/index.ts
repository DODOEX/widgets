import { combineReducers } from 'redux';
import settings, { State as settingsState } from './settings';
import wallet, { State as walletState } from './wallet';
import token, { State as tokenState } from './token';
import globals, { State as globalState } from './globals';

export interface RootState {
  settings: settingsState;
  wallet: walletState;
  token: tokenState;
  globals: globalState;
}

export default () =>
  combineReducers({
    settings,
    wallet,
    token,
    globals,
  });

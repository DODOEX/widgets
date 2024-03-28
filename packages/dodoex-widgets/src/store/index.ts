import { configureStore } from '@reduxjs/toolkit';
import { initialState as initialSettingState } from './reducers/settings';
import { initialState as initialWalletState } from './reducers/wallet';
import { initialState as initialTokenState } from './reducers/token';
import { initialState as initialGlobalState } from './reducers/globals';
import createRootReducer from './reducers';

const preloadedState = {
  settings: initialSettingState,
  wallet: initialWalletState,
  globals: initialGlobalState,
  token: initialTokenState,
};
const reducer = createRootReducer();
/** @ts-ignore */
export const store = configureStore({
  reducer,
  preloadedState,
});

import { store } from '..';
import { RootState } from '../reducers';

export const getGlobalProps = (state?: RootState) => {
  return (state ?? store.getState()).globals;
};

export const getAutoConnectLoading = (state?: RootState) => {
  return (state ?? store.getState()).globals.autoConnectLoading;
};

export const getAutoSlippage = (state?: RootState) => {
  return (state ?? store.getState()).globals.autoSlippage;
};

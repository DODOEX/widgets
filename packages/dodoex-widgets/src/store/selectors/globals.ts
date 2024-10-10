import { store } from '..';
import { RootState } from '../reducers';

export const getContractStatus = (state?: RootState) => {
  return (state ?? store.getState()).globals.contractStatus;
};

export const getAutoConnectLoading = (state?: RootState) => {
  return (state ?? store.getState()).globals.autoConnectLoading;
};

export const getAutoSlippage = (state?: RootState) => {
  return (state ?? store.getState()).globals.autoSlippage;
};

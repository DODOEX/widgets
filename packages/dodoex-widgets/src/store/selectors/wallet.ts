import { store } from '..';
import { RootState } from '../reducers';

export const getDefaultChainId = (state?: RootState) => {
  return (state ?? store.getState()).wallet.chainId;
};

export const getFromTokenChainId = (state?: RootState) => {
  return (state ?? store.getState()).wallet.fromTokenChainId;
};

export const getLatestBlockNumber = (state?: RootState) => {
  return (state ?? store.getState()).wallet.latestBlockNumber;
};

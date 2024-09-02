import { store } from '..';
import { RootState } from '../reducers';

export const getFromTokenChainId = (state?: RootState) => {
  return (state ?? store.getState()).wallet.fromTokenChainId;
};

export const getLatestBlockNumber = (state?: RootState) => {
  return (state ?? store.getState()).wallet.latestBlockNumber;
};

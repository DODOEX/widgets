import { store } from '..';
import { RootState } from '../reducers';

export const getDefaultChainId = (state?: RootState) => {
  return (state ?? store.getState()).wallet.chainId;
};

export const getLatestBlockNumber = (state?: RootState) => {
  return (state ?? store.getState()).wallet.latestBlockNumber;
};

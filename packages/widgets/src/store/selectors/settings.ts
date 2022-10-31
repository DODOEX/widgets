import { store } from '..';
import { RootState } from '../reducers';

export const getColorMode = (state?: RootState) => {
  return (state ?? store.getState()).settings.colorMode;
};
export const getSlippage = (state?: RootState) => {
  return (state ?? store.getState()).settings.slippage;
};
export const getTxDdl = (state?: RootState) => {
  return (state ?? store.getState()).settings.ddl;
};
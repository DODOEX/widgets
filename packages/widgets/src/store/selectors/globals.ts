import { store } from '..';
import { RootState } from '../reducers';

export const getGlobalProps = (state?: RootState) => {
  return (state ?? store.getState()).globals;
};

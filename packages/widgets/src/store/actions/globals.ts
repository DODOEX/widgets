import { AppThunkAction } from '.';
import { State } from '../reducers/globals';

export const setGlobalProps = (globalProps: Partial<State>): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_GLOBAL_PROPS',
      payload: globalProps,
    });
  };
};
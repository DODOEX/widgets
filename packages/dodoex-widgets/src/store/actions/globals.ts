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

export const setAutoConnectLoading = (loading: boolean): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_AUTO_CONNECT_LOADING',
      payload: loading,
    });
  };
};

export const setShowCoingecko = (showCoingecko: boolean): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_SHOW_COINGECKO',
      payload: showCoingecko,
    });
  };
};

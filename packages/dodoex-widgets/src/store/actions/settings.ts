import { AppThunkAction } from '.';
import { Slippage } from '../reducers/settings';

export const setSlippage = (slippage: Slippage): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_SLIPPAGE',
      payload: slippage,
    });
  };
};

import { AppThunkAction } from '.';
import { Slippage, TxDdl } from '../reducers/settings';

export const setSlippage = (slippage: Slippage): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_SLIPPAGE',
      payload: slippage,
    });
  };
};

export const setTxDdl = (ddl: TxDdl): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_TRANSACTION_DDL',
      payload: ddl,
    });
  };
};

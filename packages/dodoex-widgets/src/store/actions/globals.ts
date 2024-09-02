import { AppThunkAction } from '.';
import { ContractStatus, State } from '../reducers/globals';

export const setContractStatus = (
  contractStatus: ContractStatus,
): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_CONTRACT_STATUS',
      payload: contractStatus,
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

export const setAutoSlippage = (autoSlippage: {
  loading: boolean;
  value: number | null;
}): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_AUTO_SLIPPAGE',
      payload: autoSlippage,
    });
  };
};

export const setAutoSlippageLoading = (loading: boolean): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_AUTO_SLIPPAGE_LOADING',
      payload: loading,
    });
  };
};

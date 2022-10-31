import { AppThunkAction } from '.';
import { ChainId } from '../../constants/chains';

export const setDefaultChainId = (chainId: ChainId): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_CHAIN_ID',
      payload: chainId,
    });
  };
};

export const setBlockNumber = (blockNumber: number): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_BLOCK_NUMBER',
      payload: blockNumber,
    });
  };
};

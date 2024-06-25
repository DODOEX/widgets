import { AppThunkAction } from '.';
import { ChainId } from '@dodoex/api';
import { State } from '../reducers/wallet';

export const setDefaultChainId = (chainId: ChainId): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_CHAIN_ID',
      payload: chainId,
    });
  };
};

export const setFromTokenChainId = (
  chainId: ChainId | undefined,
): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_FROM_TOKEN_CHAIN_ID',
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

export const setOpenConnectWalletInfo = (
  openConnectWalletInfo: State['openConnectWalletInfo'],
): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_OPEN_CONNECT_WALLET_INFO',
      payload: openConnectWalletInfo,
    });
  };
};

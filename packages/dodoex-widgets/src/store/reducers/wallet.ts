import { AnyAction } from 'redux';
import { ChainId } from '../../constants/chains';

export type State = {
  chainId: ChainId;
  fromTokenChainId?: ChainId;
  latestBlockNumber: number;
};

export const initialState: State = {
  chainId: ChainId.MAINNET,
  latestBlockNumber: 0,
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.payload,
      };
    case 'SET_FROM_TOKEN_CHAIN_ID':
      return {
        ...state,
        fromTokenChainId: action.payload,
      };
    case 'SET_BLOCK_NUMBER':
      return {
        ...state,
        latestBlockNumber: action.payload,
      };
    default:
      return state;
  }
};

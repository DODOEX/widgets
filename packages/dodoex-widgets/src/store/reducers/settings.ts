import { AnyAction } from 'redux';
import { DEFAULT_SWAP_DDL } from '../../constants/swap';

export type Slippage = string | null;
export type TxDdl = number | '';

export type State = {
  slippage: Slippage;
  ddl: TxDdl;
};

export const initialState: State = {
  slippage: null,
  ddl: DEFAULT_SWAP_DDL,
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_SLIPPAGE':
      return {
        ...state,
        slippage: action.payload,
      };
    case 'SET_TRANSACTION_DDL':
      return {
        ...state,
        ddl: action.payload,
      };
    default:
      return state;
  }
};

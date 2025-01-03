import { AnyAction } from 'redux';

export type Slippage = string | null;

export type State = {
  slippage: Slippage;
};

export const initialState: State = {
  slippage: null,
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_SLIPPAGE':
      return {
        ...state,
        slippage: action.payload,
      };
    default:
      return state;
  }
};

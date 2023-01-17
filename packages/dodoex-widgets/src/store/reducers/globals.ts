import { AnyAction } from 'redux';
import { SwapWidgetProps } from '../..';

export type State = SwapWidgetProps;

export const initialState: State = {
  height: undefined,
  width: undefined,
  apikey: '',
  feeRate: 0,
  rebateTo: '',
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_GLOBAL_PROPS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
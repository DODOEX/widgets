import { AnyAction } from 'redux';
import { SwapWidgetProps } from '../..';

export interface State extends SwapWidgetProps {
  isReverseRouting?: boolean; // true: reverse enquiry & false: normal enquiry 
};

export const initialState: State = {
  height: undefined,
  width: undefined,
  apikey: '',
  feeRate: 0,
  rebateTo: '',
  isReverseRouting: false,
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
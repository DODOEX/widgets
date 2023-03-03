import { AnyAction } from 'redux';
import { SwapWidgetProps } from '../..';

export enum ContractStatus {
  Initial = 'Initial',
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}
export interface State extends SwapWidgetProps {
  isReverseRouting?: boolean; // true: reverse enquiry & false: normal enquiry 
  contractStatus?: ContractStatus;
};

export const initialState: State = {
  height: undefined,
  width: undefined,
  apikey: '',
  feeRate: 0,
  rebateTo: '',
  isReverseRouting: false,
  contractStatus: ContractStatus.Initial,
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
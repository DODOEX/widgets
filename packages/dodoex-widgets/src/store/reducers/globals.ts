import { AnyAction } from 'redux';
import { SwapWidgetProps } from '../..';

export enum ContractStatus {
  Initial = 'Initial',
  Pending = 'Pending',
  ApproveSuccess = 'ApproveSuccess',
  TxSuccess = 'TxSuccess',
  Failed = 'Failed',
}
export interface State extends SwapWidgetProps {
  isReverseRouting?: boolean; // true: reverse enquiry & false: normal enquiry
  contractStatus?: ContractStatus;
  autoConnectLoading?: boolean; // default: undefined
  showCoingecko?: boolean;
}

export const initialState: State = {
  height: undefined,
  width: undefined,
  apikey: '',
  feeRate: 0,
  rebateTo: '',
  isReverseRouting: false,
  contractStatus: ContractStatus.Initial,
  autoConnectLoading: undefined,
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_GLOBAL_PROPS':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_AUTO_CONNECT_LOADING':
      return {
        ...state,
        autoConnectLoading: action.payload,
      };
    default:
      return state;
  }
};

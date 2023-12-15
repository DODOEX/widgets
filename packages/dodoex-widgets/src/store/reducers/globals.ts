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
  /** source: props.getAutoSlippage */
  autoSlippage?: {
    loading: boolean;
    value: number | null;
  };
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
  autoSlippage: undefined,
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
    case 'SET_AUTO_SLIPPAGE':
      return {
        ...state,
        autoSlippage: action.payload,
      };
    case 'SET_AUTO_SLIPPAGE_LOADING':
      return {
        ...state,
        autoSlippage: {
          loading: action.payload,
          value: state.autoSlippage?.value ?? null,
        },
      };
    default:
      return state;
  }
};

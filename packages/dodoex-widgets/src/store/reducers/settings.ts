import { AnyAction } from 'redux';
import { DEFAULT_SWAP_DDL } from '../../constants/swap';
import { PaletteMode } from '@dodoex/components';

export type ColorMode = PaletteMode | 'system';
export type Slippage = string | null;
export type TxDdl = number | '';

export type State = {
  colorMode: ColorMode;
  slippage: Slippage;
  ddl: TxDdl;
};

export const initialState: State = {
  colorMode: 'dark',
  slippage: null,
  ddl: DEFAULT_SWAP_DDL,
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_COLOR_MODE':
      return {
        ...state,
        colorMode: action.payload,
      };
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

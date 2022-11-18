import { PaletteMode } from '@dodoex/components';
import { AnyAction } from 'redux';

export type ColorMode = PaletteMode | 'system';

export type State = {
  language: 'enUS' | 'zhCN';
  colorMode: ColorMode;
};

export const initialState: State = {
  language: 'zhCN',
  colorMode: 'dark',
};

export default (state: State = initialState, action: AnyAction): State => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_COLOR_MODE':
      return {
        ...state,
        colorMode: action.payload,
      };
    default:
      return state;
  }
};

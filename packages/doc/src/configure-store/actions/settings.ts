import { AppThunkAction } from './types';
import { ColorMode } from '../reducers/settings';

export const setLanguage = (language: string): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: language,
    });
  };
};

export const setColorMode = (colorMode: ColorMode): AppThunkAction => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_COLOR_MODE',
      payload: colorMode,
    });
  };
};

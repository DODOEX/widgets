import { combineReducers } from 'redux';
import settings, { State as settingsState } from './settings';

export interface RootState {
  settings: settingsState;
}

export default () =>
  combineReducers({
    settings,
  });

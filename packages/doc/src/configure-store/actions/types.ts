import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';

export type AppThunkAction<Ret = void> = ThunkAction<
  Ret,
  RootState,
  unknown,
  Action<string>
>;
export type AppThunkDispatch = ThunkDispatch<
  RootState,
  unknown,
  Action<string>
>;

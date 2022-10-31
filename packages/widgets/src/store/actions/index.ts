import { Action, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
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

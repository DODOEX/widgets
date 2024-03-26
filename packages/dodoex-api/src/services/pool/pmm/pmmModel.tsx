import BigNumber from 'bignumber.js';
import { PMMModel } from './pmm';

export type PmmModelParams = {
  q0: number;
  b0: number;
  q: number;
  b: number;
  k: number;
  i: number;
  R: number;
  lpFeeRate?: number;
  mtFeeRate?: number;
};

export type PmmModelParamsBG = {
  q0: BigNumber;
  b0: BigNumber;
  q: BigNumber;
  b: BigNumber;
  k: BigNumber;
  i: BigNumber;
  R: number;
  lpFeeRate?: BigNumber;
  mtFeeRate?: BigNumber;
};

export function getPmmModel({ q, b, k, i, q0, b0, R }: PmmModelParams) {
  const model = new PMMModel();
  model.B0 = new BigNumber(b0);
  model.Q0 = new BigNumber(q0);
  model.B = new BigNumber(b);
  model.Q = new BigNumber(q);
  model.i = new BigNumber(i);
  model.k = new BigNumber(k);
  model.RStatus = R;

  model.mtFeeRate = new BigNumber(0);
  model.lpFeeRate = new BigNumber(0);

  return model;
}

import {
  PMMModel,
  PmmModelParams,
  solveQuadraticFunctionForTarget,
} from '@dodoex/api';
import BigNumber from 'bignumber.js';

/**
 * Calculate marginPrice for buying or selling target baseToken
 * @param param0
 * @returns
 */
export function computeMarginPrice({
  params,
  target,
  isBuy = true,
}: {
  params: PmmModelParams;
  target: BigNumber;
  isBuy?: boolean;
}) {
  const b = new BigNumber(params.b);
  const q = new BigNumber(params.q);
  let b0 = new BigNumber(params.b0);
  const q0 = new BigNumber(params.q0);
  const i = new BigNumber(params.i);
  const k = new BigNumber(params.k);
  const { R } = params;

  // When created, b0 is equal to b, and a b0 needs to be calculated.
  if (R === 1 && b0.eq(b)) {
    b0 = solveQuadraticFunctionForTarget(
      b,
      q.minus(q0),
      new BigNumber(1).div(i),
      k,
    );
  }

  const newB = isBuy ? b.plus(target) : b.minus(target);

  if (newB.lt(b0) || b.eq(b0)) {
    // b < b0: The shortage of baseToken corresponds to the user buying baseToken. At this time, the quoteToken in the pool is higher than the regression target; the price curve is directly used to calculate the marginal price.
    let r = b0.multipliedBy(b0).div(newB).div(newB);
    r = new BigNumber(1).minus(k).plus(k.multipliedBy(r));
    return i.multipliedBy(r);
  }

  // There is a shortage of quoteToken, which corresponds to the user selling baseToken, causing the number of quoteTokens in the pool to be lower than the return target at this time; the parameter target is the number of baseTokens sold by the user, and it is necessary to calculate the number of quoteTokens obtained after selling based on this value, that is, the user How many quoteTokens are obtained; then put this value into the price curve equation to calculate the marginal price.
  const pmm = new PMMModel();
  pmm.RStatus = R;
  pmm.B = b;
  pmm.B0 = b0;
  pmm.Q = q;
  pmm.Q0 = q0;
  pmm.i = i;
  pmm.k = k;
  pmm.mtFeeRate = new BigNumber(0);
  pmm.lpFeeRate = new BigNumber(0);

  let getAmount: BigNumber = new BigNumber(0);
  if (isBuy) {
    getAmount = pmm.querySellBase(target);
  } else {
    getAmount = pmm.queryBuyBase(target);
  }

  const deltaQ = isBuy ? q.minus(getAmount) : q.plus(getAmount);
  let r = q0.multipliedBy(q0).div(deltaQ).div(deltaQ);
  r = new BigNumber(1).minus(k).plus(k.multipliedBy(r));
  return i.div(r);
}

/**
 * Calculate the margin price for selling target baseTokens
 */
export function computeSellMarginPrice({
  params,
  target,
}: {
  params: PmmModelParams;
  target: BigNumber;
}) {
  return computeMarginPrice({
    params,
    target,
    isBuy: false,
  });
}

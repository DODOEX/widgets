import { BigNumber } from 'bignumber.js';

const integrate = (
  V0: BigNumber,
  V1: BigNumber,
  V2: BigNumber,
  i: BigNumber,
  k: BigNumber,
): BigNumber => {
  const fairAmount = i.multipliedBy(V1.minus(V2));
  const penalty = V0.multipliedBy(V0).div(V1).div(V2).multipliedBy(k);
  return fairAmount.multipliedBy(new BigNumber(1).minus(k).plus(penalty));
};
const solveQuadraticFunctionForTrade = (
  V0: BigNumber,
  V1: BigNumber,
  i: BigNumber,
  delta: BigNumber,
  k: BigNumber,
): BigNumber => {
  // -b = (1-k)V1-kV0^2/V1+i*delta
  let minusB = new BigNumber(1).minus(k).multipliedBy(V1);
  minusB = minusB.minus(k.multipliedBy(V0).multipliedBy(V0).div(V1));
  minusB = minusB.plus(i.multipliedBy(delta));
  // sqrt(b*b+4(1-k)kQ0*Q0)
  let squareRoot = new BigNumber(4)
    .multipliedBy(new BigNumber(1).minus(k))
    .multipliedBy(k)
    .multipliedBy(V0)
    .multipliedBy(V0);
  squareRoot = minusB.multipliedBy(minusB).plus(squareRoot).sqrt();
  // 2(1-k)
  const denominator = new BigNumber(2).multipliedBy(new BigNumber(1).minus(k));
  return minusB.plus(squareRoot).div(denominator);
};
const solveQuadraticFunctionForTarget = (
  V1: BigNumber,
  k: BigNumber,
  fairAmount: BigNumber,
): BigNumber => {
  // V0 = V1+V1*(sqrt-1)/2k
  let sqrt = new BigNumber(4).multipliedBy(k).multipliedBy(fairAmount).div(V1);
  sqrt = new BigNumber(1).plus(sqrt).sqrt();
  const premium = sqrt
    .minus(new BigNumber(1))
    .div(k.multipliedBy(new BigNumber(2)));
  return V1.multipliedBy(new BigNumber(1).plus(premium));
};

const RStatusOne = 0;
const RStatusAboveOne = 1;
const RStatusBelowOne = 2;
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});
export class PMMModel {
  // unstable
  public B!: BigNumber;

  public Q!: BigNumber;

  public B0!: BigNumber;

  public Q0!: BigNumber;

  public RStatus!: number;

  public i!: BigNumber;

  public k!: BigNumber;

  // stable
  public mtFeeRate!: BigNumber; // DODO._MT_FEE_RATE_()/10^18

  public lpFeeRate!: BigNumber; // DODO._LP_FEE_RATE_()/10^18

  // return mid price
  public getMidPrice(): BigNumber {
    if (this.RStatus === RStatusOne) {
      return this.i;
    }
    const target = this.getExpectedTarget();
    if (this.RStatus === RStatusAboveOne) {
      let R = target.base.div(this.B);
      R = R.multipliedBy(R)
        .multipliedBy(this.k)
        .minus(this.k)
        .plus(new BigNumber(1));
      return this.i.multipliedBy(R);
    }
    if (this.RStatus === RStatusBelowOne) {
      let R = target.quote.div(this.Q);
      R = R.multipliedBy(R)
        .multipliedBy(this.k)
        .minus(this.k)
        .plus(new BigNumber(1));
      return this.i.div(R);
    }
    return this.i;
  }

  public getQuoteByMidPrice(midPrice: BigNumber): BigNumber {
    if (this.RStatus !== RStatusAboveOne) {
      throw new Error('No support is needed at the moment');
    }
    // const baseTarget = midPrice.div(this.i).minus(1).plus(this.k).div(this.k).sqrt().times(this.B);
    // const sqrt = baseTarget.div(this.B).minus(1).times(2).times(this.k).plus(1);
    // const quote = sqrt.times(sqrt).minus(1).times(this.B).div(this.k.times(4)).times(this.i);

    // @see https://www.notion.so/dodotopia/Initial-price-f1b53584bc5340d79f9cf5c458b4dd9c
    const baseTarget = midPrice
    .div(this.k.times(this.i))
    .plus(1)
    .minus(new BigNumber(1).div(this.k))
    .times(this.B)
    .times(this.B).sqrt();
    const quote = this.i.times(this.k.div(this.B).times(baseTarget).times(baseTarget).plus(new BigNumber(1).minus(this.k.times(2)).times(baseTarget)).minus(new BigNumber(1).minus(this.k).times(this.B)));
    return quote;
  }

  // return the targetBase and targetQuote assuming system balanced
  public getExpectedTarget(): { base: BigNumber; quote: BigNumber } {
    let baseTarget: BigNumber;
    let quoteTarget: BigNumber;
    baseTarget = this.B0;
    quoteTarget = this.Q0;
    if (this.RStatus === RStatusOne) {
      baseTarget = this.B0;
      quoteTarget = this.Q0;
    }
    if (this.RStatus === RStatusAboveOne) {
      quoteTarget = this.Q0;
      baseTarget = solveQuadraticFunctionForTarget(
        this.B,
        this.k,
        this.Q.minus(this.Q0).div(this.i),
      );
    }
    if (this.RStatus === RStatusBelowOne) {
      baseTarget = this.B0;
      quoteTarget = solveQuadraticFunctionForTarget(
        this.Q,
        this.k,
        this.B.minus(this.B0).multipliedBy(this.i),
      );
    }
    return {
      base: baseTarget,
      quote: quoteTarget,
    };
  }

  // ============ query by amount Functions ============
  // return paid quote amount (fee deducted)
  public queryBuyBase(amount: BigNumber) {
    const mtFee = amount.multipliedBy(this.mtFeeRate);
    const lpFee = amount.multipliedBy(this.lpFeeRate);
    amount = amount.plus(mtFee).plus(lpFee);
    const target = this.getExpectedTarget();
    let quote = new BigNumber(0);
    if (this.RStatus === RStatusOne) {
      quote = this.ROneBuyBase(amount, target.base);
    } else if (this.RStatus === RStatusAboveOne) {
      quote = this.RAboveBuyBase(amount, target.base);
    } else {
      const backOneBase = this.B.minus(target.base);
      const backOneQuote = target.quote.minus(this.Q);
      if (amount.isLessThanOrEqualTo(backOneBase)) {
        quote = this.RBelowBuyBase(amount, target.quote);
      } else {
        quote = backOneQuote.plus(
          this.ROneBuyBase(amount.minus(backOneBase), target.base),
        );
      }
    }
    return quote;
  }

  // return received quote amount (fee deducted)
  public querySellBase(amount: BigNumber) {
    let result: BigNumber;
    const target = this.getExpectedTarget();
    if (this.RStatus === RStatusOne) {
      result = this.ROneSellBase(amount, target.quote);
    } else if (this.RStatus === RStatusBelowOne) {
      result = this.RBelowSellBase(amount, target.quote);
    } else {
      const backOneBase = target.base.minus(this.B);
      const backOneQuote = this.Q.minus(target.quote);
      if (amount.isLessThanOrEqualTo(backOneBase)) {
        result = this.RAboveSellBase(amount, target.base);
      } else {
        result = backOneQuote.plus(
          this.ROneSellBase(amount.minus(backOneBase), target.quote),
        );
      }
    }
    const mtFee = result.multipliedBy(this.mtFeeRate);
    const lpFee = result.multipliedBy(this.lpFeeRate);
    const quote = result.minus(mtFee).minus(lpFee);
    return quote;
  }

  // return paid base amount (fee deducted)
  public queryBuyQuote(amount: BigNumber): BigNumber {
    const mtFee = amount.multipliedBy(this.mtFeeRate);
    const lpFee = amount.multipliedBy(this.lpFeeRate);
    amount = amount.plus(mtFee).plus(lpFee);
    const target = this.getExpectedTarget();
    if (this.RStatus === RStatusOne) {
      return this.ROneBuyQuote(amount, target.quote);
    }
    if (this.RStatus === RStatusBelowOne) {
      return this.RBelowBuyQuote(amount, target.quote);
    }
    const backOneBase = target.base.minus(this.B);
    const backOneQuote = this.Q.minus(target.quote);
    if (amount.isLessThanOrEqualTo(backOneQuote)) {
      return this.RAboveBuyQuote(amount, target.base);
    }
    return backOneBase.plus(
      this.ROneBuyQuote(amount.minus(backOneQuote), target.quote),
    );
  }

  // return received base amount (fee deducted)
  public querySellQuote(amount: BigNumber): BigNumber {
    let result: BigNumber;
    const target = this.getExpectedTarget();
    if (this.RStatus === RStatusOne) {
      result = this.ROneSellQuote(amount, target.base);
    } else if (this.RStatus === RStatusAboveOne) {
      result = this.RAboveSellQuote(amount, target.base);
    } else {
      const backOneBase = this.B.minus(target.base);
      const backOneQuote = target.quote.minus(this.Q);
      if (amount.isLessThanOrEqualTo(backOneQuote)) {
        result = this.RBelowSellQuote(amount, target.quote);
      } else {
        result = backOneBase.plus(
          this.ROneSellQuote(amount.minus(backOneQuote), target.base),
        );
      }
    }
    const mtFee = result.multipliedBy(this.mtFeeRate);
    const lpFee = result.multipliedBy(this.lpFeeRate);
    return result.minus(mtFee).minus(lpFee);
  }

  // ============ query by price Functions ============
  // todo 这个函数没有考虑手续费
  public getPriceDepth(price: BigNumber): {
    baseAmount: BigNumber;
    quoteAmount: BigNumber;
    isBuy: boolean;
  } {
    const target = this.getExpectedTarget();
    // base balance and quote balance when price
    let B: BigNumber;
    let Q: BigNumber;
    if (price.gt(this.i)) {
      const R = price.div(this.i);
      // (b0/b)2 = (r-1+k)/k
      B = target.base.div(R.minus(1).plus(this.k).div(this.k).sqrt());
      Q = this.ROneBuyBase(target.base.minus(B), target.base).plus(
        target.quote,
      );
    } else {
      const R = this.i.div(price);
      Q = target.quote.div(R.minus(1).plus(this.k).div(this.k).sqrt());
      B = this.ROneBuyQuote(target.quote.minus(Q), target.quote).plus(
        target.base,
      );
    }
    return {
      baseAmount: this.B.minus(B).abs(),
      quoteAmount: this.Q.minus(Q).abs(),
      isBuy: this.B.gt(B),
    };
  }

  // ============ calculate penalty Functions ============
  public getWithdrawBasePenalty(amount: BigNumber): BigNumber {
    if (this.RStatus === RStatusAboveOne) {
      const baseTarget = solveQuadraticFunctionForTarget(
        this.B,
        this.k,
        this.Q.minus(this.Q0).div(this.i),
      );
      const baseTargetWithdraw = solveQuadraticFunctionForTarget(
        this.B.minus(amount),
        this.k,
        this.Q.minus(this.Q0).div(this.i),
      );
      const penalty = baseTarget.minus(baseTargetWithdraw).minus(amount);
      return penalty;
    }
    return new BigNumber(0);
  }

  public getWithdrawQuotePenalty(amount: BigNumber): BigNumber {
    if (this.RStatus === RStatusBelowOne) {
      const quoteTarget = solveQuadraticFunctionForTarget(
        this.Q,
        this.k,
        this.B.minus(this.B0).multipliedBy(this.i),
      );
      const quoteTargetWithdraw = solveQuadraticFunctionForTarget(
        this.Q.minus(amount),
        this.k,
        this.B.minus(this.B0).multipliedBy(this.i),
      );
      const penalty = quoteTarget.minus(quoteTargetWithdraw).minus(amount);
      return penalty;
    }
    return new BigNumber(0);
  }

  // =========== helper ROne ===========
  public ROneBuyBase(amount: BigNumber, targetBase: BigNumber): BigNumber {
    if (amount.isGreaterThanOrEqualTo(targetBase)) {
      // throw new Error('ROne Buy Base Amount Exceed Limitation');
      // console.error('ROne Buy Base Amount Exceed Limitation');
    }
    return integrate(
      targetBase,
      targetBase,
      targetBase.minus(amount),
      this.i,
      this.k,
    );
  }

  public ROneBuyQuote(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    if (amount.isGreaterThanOrEqualTo(targetQuote)) {
      // throw new Error('ROne Buy Quote Amount Exceed Limitation');
      // console.error('ROne Buy Quote Amount Exceed Limitation');
    }
    return integrate(
      targetQuote,
      targetQuote,
      targetQuote.minus(amount),
      new BigNumber(1).div(this.i),
      this.k,
    );
  }

  public ROneSellBase(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    const newQ = solveQuadraticFunctionForTrade(
      targetQuote,
      targetQuote,
      this.i,
      amount.negated(),
      this.k,
    );
    return targetQuote.minus(newQ);
  }

  public ROneSellQuote(amount: BigNumber, targetBase: BigNumber): BigNumber {
    const newB = solveQuadraticFunctionForTrade(
      targetBase,
      targetBase,
      new BigNumber(1).div(this.i),
      amount.negated(),
      this.k,
    );
    return targetBase.minus(newB);
  }

  // =========== helper RAbove ===========
  public RAboveBuyBase(amount: BigNumber, targetBase: BigNumber): BigNumber {
    if (amount.isGreaterThanOrEqualTo(this.B)) {
      throw new Error('RAbove Buy Base Amount Exceed Limitation');
    }
    return integrate(targetBase, this.B, this.B.minus(amount), this.i, this.k);
  }

  public RAboveSellBase(amount: BigNumber, targetBase: BigNumber): BigNumber {
    if (amount.plus(this.B).isGreaterThan(targetBase)) {
      throw new Error('RAbove Sell Base Amount Exceed Limitation');
    }
    return integrate(targetBase, this.B.plus(amount), this.B, this.i, this.k);
  }

  public RAboveBuyQuote(amount: BigNumber, targetBase: BigNumber): BigNumber {
    const newB = solveQuadraticFunctionForTrade(
      targetBase,
      this.B,
      new BigNumber(1).div(this.i),
      amount,
      this.k,
    );
    return newB.minus(this.B);
  }

  public RAboveSellQuote(amount: BigNumber, targetBase: BigNumber): BigNumber {
    const newB = solveQuadraticFunctionForTrade(
      targetBase,
      this.B,
      new BigNumber(1).div(this.i),
      amount.negated(),
      this.k,
    );
    return this.B.minus(newB);
  }

  // =========== helper RBelow ===========
  public RBelowBuyQuote(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    if (amount.isGreaterThanOrEqualTo(this.Q)) {
      throw new Error('RBelow Buy Quote Amount Exceed Limitation');
    }
    return integrate(
      targetQuote,
      this.Q,
      this.Q.minus(amount),
      new BigNumber(1).div(this.i),
      this.k,
    );
  }

  public RBelowSellQuote(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    if (amount.plus(this.Q).isGreaterThan(targetQuote)) {
      throw new Error('RBelow Sell Quote Amount Exceed Limitation');
    }
    return integrate(
      targetQuote,
      this.Q.plus(amount),
      this.Q,
      new BigNumber(1).div(this.i),
      this.k,
    );
  }

  public RBelowBuyBase(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    const newQ = solveQuadraticFunctionForTrade(
      targetQuote,
      this.Q,
      this.i,
      amount,
      this.k,
    );
    return newQ.minus(this.Q);
  }

  public RBelowSellBase(amount: BigNumber, targetQuote: BigNumber): BigNumber {
    const newQ = solveQuadraticFunctionForTrade(
      targetQuote,
      this.Q,
      this.i,
      amount.negated(),
      this.k,
    );
    return this.Q.minus(newQ);
  }
}

interface depthSample {
  baseAmount: BigNumber;
  quoteAmount: BigNumber;
  marginPrice: BigNumber;
}

function pmmExample() {
  const model = new PMMModel();
  // model.RStatus = RStatusOne;
  // model.B = new BigNumber(95752.89661259872);
  // model.B0 = new BigNumber(95752.89661259872);
  // model.Q = new BigNumber(100000);
  // model.Q0 = new BigNumber(100000);
  // model.i = new BigNumber(7);
  // model.k = new BigNumber(0.7);
  model.RStatus = RStatusAboveOne;
  model.B = new BigNumber(100);
  model.B0 = new BigNumber(31672.81613012984);
  model.Q = new BigNumber(10000);
  model.Q0 = new BigNumber(0);
  model.i = new BigNumber(0.001);
  model.k = new BigNumber(1);
  model.mtFeeRate = new BigNumber(0);
  model.lpFeeRate = new BigNumber(0);
  const bidSamplePoint: depthSample[] = [];
  const askSamplePoint: depthSample[] = [];
  const midPrice = model.getMidPrice();
  const step = new BigNumber(0.05);
  const num = 10;
  for (let i = 0; i < num; i++) {
    const offset = step.multipliedBy(i).plus(1);
    const bidPrice = midPrice.div(offset);
    const askPrice = midPrice.multipliedBy(offset);
    const bidDepth = model.getPriceDepth(bidPrice);
    const askDepth = model.getPriceDepth(askPrice);
    bidSamplePoint.push({
      baseAmount: bidDepth.baseAmount,
      quoteAmount: bidDepth.quoteAmount,
      marginPrice: bidPrice,
    });
    askSamplePoint.push({
      baseAmount: askDepth.baseAmount,
      quoteAmount: askDepth.quoteAmount,
      marginPrice: askPrice,
    });
  }
  for (let i = num - 1; i >= 0; i--) {
    console.log(
      `Buy ${askSamplePoint[i].baseAmount.toFixed(10)} pay ${askSamplePoint[
        i
      ].quoteAmount.toFixed(10)} @ ${askSamplePoint[i].marginPrice.toFixed(
        10,
      )}`,
    );
  }
  console.log('------------------');
  console.log(`Mid Price: ${midPrice.toFixed(10)}`);
  console.log('------------------');
  for (let i = 0; i < num; i++) {
    console.log(
      `Sell ${bidSamplePoint[i].baseAmount.toFixed(10)} get ${bidSamplePoint[
        i
      ].quoteAmount.toFixed(10)} @ ${bidSamplePoint[i].marginPrice.toFixed(
        10,
      )}`,
    );
  }
  return [bidSamplePoint, askSamplePoint];
}
// pmmExample();

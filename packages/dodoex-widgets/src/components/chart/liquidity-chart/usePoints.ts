import {
  PMMHelper,
  PmmModelParams,
  PMMState as PMMStateFromSDK,
  solveQuadraticFunctionForTarget,
} from '@dodoex/api';

import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

/**
 * data point
 */

export type StatPoint = {
  giveAmount: BigNumber;
  getAmount: BigNumber;
  price: BigNumber;
};

/**
 * Drawing method:
  Substitute the minimum value to get the height of the center point, which is the bottom edge of the area chart. Substitute the maximum value to get the vertex of the area chart. The length of the bottom edge from the vertex is the price range.

  Divide the total area into one hundred equal parts. Calculate each part on the basis of the previous part. Substitute the new area into the formula to get a new price. The difference from the previous price is the width of the rectangle. The area is divided by The width is the height of the rectangle, which is the ordinate.

  First, calculate a series of points as a point set based on the rectangular accumulation method.

  When the mouse hovers, the abscissa is the price. Find the closest price in the point set. Use this price as the end point and the center line as the starting point to get a subset of the point set. You can draw a line by combining the center line and the abscissa. The area of ​​the trapezoid can be drawn.

  Update: Taking Δl as the ordinate, Δl = (the difference between the quantity passed in from the previous point and the next point) * (the difference between the quantity obtained from the previous point and the next point)
 */
export type StatAreaPoint = {
  area: BigNumber;
  price: BigNumber;
  // The midpoint between the current price and the previous price is used as the abscissa
  middlePrice: BigNumber;
  rectangleHeight: BigNumber;
};

export function usePoints({ params }: { params: PmmModelParams }) {
  return useMemo(() => {
    const b = new BigNumber(params.b);
    const q = new BigNumber(params.q);
    let b0 = new BigNumber(params.b0);
    const q0 = new BigNumber(params.q0);
    const i = new BigNumber(params.i);
    const K = new BigNumber(params.k);
    const { R } = params;

    // When created, b0 is equal to b, and a b0 needs to be calculated.
    if (R === 1 && b0.eq(b)) {
      b0 = solveQuadraticFunctionForTarget(
        b,
        q.minus(q0),
        new BigNumber(1).div(i),
        K,
      );
    }

    const pmmState = new PMMStateFromSDK({
      i,
      K,
      B: b,
      Q: q,
      B0: b0,
      Q0: q0,
      R,
      mtFeeRate: new BigNumber(0),
      lpFeeRate: new BigNumber(0),
    });

    const pmm = new PMMHelper();
    const B = new BigNumber(pmmState.B);
    // const Q = new BigNumber(pmmState.Q);

    // A collection of data points, mapped into points on the graph through equal width and height proportions
    const leftStatPoints: StatPoint[] = [];
    const rightStatPoints: StatPoint[] = [];
    let maxLeftHeight = new BigNumber(0);
    let maxRightHeight = new BigNumber(0);

    const midPrice = pmm.GetMidPrice(pmmState);
    const portion = q.gt(0) ? b.div(q) : new BigNumber(1);
    // console.log('v2 midPrice', midPrice.toString(), portion.toString());

    for (let index = 0; index <= 250; index++) {
      let giveAmount = B.multipliedBy(index / 100).multipliedBy(
        midPrice.multipliedBy(portion).multipliedBy(4),
      );
      // let giveAmount = B.multipliedBy(index / 100).multipliedBy(4);
      // let giveAmount = B.multipliedBy(index / 100);
      if (index === 0) {
        giveAmount = B.multipliedBy(1 / 100000000000);
      }
      // sellBase needs to pass in the number of quotes and gets the number of bases
      const getAmount = pmm?.QuerySellBase(giveAmount, pmmState);
      // console.log('v2 QuerySellBase', giveAmount.toString(), getAmount.toString());

      if (!getAmount.isNaN() && getAmount.gt(0)) {
        // Price on the left
        const price = getAmount.div(giveAmount);
        leftStatPoints.push({
          giveAmount,
          getAmount,
          price,
        });
        continue;
      }
      leftStatPoints.push({
        giveAmount,
        getAmount: new BigNumber(0),
        price: new BigNumber(0),
      });
    }

    for (let index = 0; index <= 250; index++) {
      let giveAmount = B.multipliedBy(index / 100).multipliedBy(
        midPrice.multipliedBy(4),
      );
      // let giveAmount = B.multipliedBy(index / 100);
      if (index === 0) {
        giveAmount = B.multipliedBy(1 / 100000000000);
      }
      // sellQuote needs to pass in the number of bases and get the number of quotes
      const getAmount = pmm?.QuerySellQuote(giveAmount, pmmState);
      // console.log('v2 QuerySellQuote', giveAmount.toString(), getAmount.toString());

      if (!getAmount.isNaN() && getAmount.gt(0)) {
        // Price on the right
        const price = giveAmount.dividedBy(getAmount);
        rightStatPoints.push({
          giveAmount,
          getAmount,
          price,
        });
        continue;
      }
      rightStatPoints.push({
        giveAmount,
        getAmount: new BigNumber(0),
        price: new BigNumber(0),
      });
    }

    if (leftStatPoints.length < 2 && rightStatPoints.length < 2) {
      return {
        leftStatAreaPoints: [],
        rightStatAreaPoints: [],
        maxLeftHeight: new BigNumber(10).multipliedBy(1.2),
        maxRightHeight: new BigNumber(10).multipliedBy(1.2),
        middlePriceLN10: new BigNumber(0),
        minXLN10: new BigNumber(-1),
        maxXLN10: new BigNumber(1),
      };
    }

    // The data points are divided into two groups on the left and right, and the width and height corresponding to the area are calculated.
    const leftStatAreaPoints: StatAreaPoint[] = [];
    for (let index = 1; index < leftStatPoints.length; index++) {
      const statPoint = leftStatPoints[index];
      const { giveAmount, getAmount, price } = statPoint;

      const lastStatPoint = leftStatPoints[index - 1];

      if (!price.isNaN() && price.gt(0) && lastStatPoint) {
        const priceChange = price.minus(lastStatPoint.price).abs();
        const giveAmountChange = giveAmount
          .minus(lastStatPoint.giveAmount)
          .abs();
        const getAmountChange = getAmount.minus(lastStatPoint.getAmount).abs();
        const leftRectangleHeight =
          getAmountChange.multipliedBy(giveAmountChange);

        if (index === 1) {
          leftStatAreaPoints.push({
            area: getAmount,
            price,
            middlePrice: price.plus(priceChange.div(1.1)),
            rectangleHeight: leftRectangleHeight.plus(
              leftRectangleHeight.multipliedBy(0.03),
            ),
          });
        }
        leftStatAreaPoints.push({
          area: getAmount,
          price,
          middlePrice: price.plus(priceChange.div(2)),
          rectangleHeight: leftRectangleHeight,
        });

        maxLeftHeight = BigNumber.max(leftRectangleHeight, maxLeftHeight);
      }
    }

    const rightStatAreaPoints: StatAreaPoint[] = [];
    for (let index = 1; index < rightStatPoints.length; index++) {
      const statPoint = rightStatPoints[index];
      const { giveAmount, getAmount, price } = statPoint;

      const lastStatPoint = rightStatPoints[index - 1];
      const lastPrice = lastStatPoint.price;
      const lastGiveAmount = lastStatPoint.giveAmount;
      const lastGetAmount = lastStatPoint.getAmount;

      if (!price.isNaN() && price.gt(0) && lastStatPoint) {
        const priceChange = price.minus(lastPrice).abs();
        const giveAmountChange = giveAmount.minus(lastGiveAmount).abs();
        const getAmountChange = getAmount.minus(lastGetAmount).abs();
        const rightRectangleHeight =
          getAmountChange.multipliedBy(giveAmountChange);

        if (index === 1) {
          rightStatAreaPoints.push({
            area: getAmount,
            price,
            middlePrice: price.minus(priceChange.div(1.1)),
            rectangleHeight: rightRectangleHeight.plus(
              rightRectangleHeight.multipliedBy(0.03),
            ),
          });
        }

        rightStatAreaPoints.push({
          area: getAmount,
          price,
          middlePrice: price.minus(priceChange.div(2)),
          rectangleHeight: rightRectangleHeight,
        });

        maxRightHeight = BigNumber.max(rightRectangleHeight, maxRightHeight);
      }
    }

    // Intuitively, the data points on the left are distributed from the middle to the left, and the data points on the right are distributed from the middle to the right.
    // Left starting point
    const leftStartStatPoint =
      leftStatPoints.length > 0
        ? leftStatPoints[leftStatPoints.length - 1]
        : rightStatPoints[0];
    // midpoint
    const middleStatPoint =
      rightStatPoints.length > 0 ? rightStatPoints[0] : leftStatPoints[0];
    // Right end point
    const rightEndStatPoint =
      rightStatPoints.length > 0
        ? rightStatPoints[rightStatPoints.length - 1]
        : leftStatPoints[0];

    const minX = leftStartStatPoint.price;
    const maxX = rightEndStatPoint.price;
    const middlePrice = middleStatPoint.price;
    const middlePriceLN10 = new BigNumber(Math.log10(middlePrice.toNumber()));
    // Center the graphic
    let minXLN10 = minX.gt(0)
      ? new BigNumber(Math.log10(minX.toNumber()))
      : new BigNumber(-Math.log10(maxX.toNumber()));
    let maxXLN10 = maxX.gt(0)
      ? new BigNumber(Math.log10(maxX.toNumber()))
      : new BigNumber(-Math.log10(minX.toNumber()));
    const rangeLN10 = BigNumber.max(
      middlePriceLN10.minus(minXLN10).abs(),
      maxXLN10.minus(middlePriceLN10).abs(),
    );
    minXLN10 = middlePriceLN10.minus(rangeLN10);
    maxXLN10 = middlePriceLN10.plus(rangeLN10);
    // console.log('v2 price', {
    //   // middlePrice: middlePrice.toString(),
    //   minX: minX.toString(),
    //   // maxX: maxX.toString(),
    //   middlePriceLN10: middlePriceLN10.toString(),
    //   minXLN10: minXLN10.toString(),
    //   maxXLN10: maxXLN10.toString(),
    // });

    return {
      leftStatAreaPoints,
      rightStatAreaPoints,
      maxLeftHeight: maxLeftHeight.multipliedBy(1.2),
      maxRightHeight: maxRightHeight.multipliedBy(1.2),
      minXLN10,
      maxXLN10,
      middlePriceLN10,
    };
  }, [params]);
}

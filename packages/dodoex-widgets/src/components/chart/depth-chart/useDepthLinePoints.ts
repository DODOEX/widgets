import { PMMModel } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { BaseMinAndZoomMultiples, computeXPortion, evalPoint } from './helper';

export function useDepthLinePoints({
  chartHeight,
  chartWidth,
  midPrice,
  xPoints,
  pmmModel,
  baseMinAndZoomMultiples,
  buyYPortion,
  sellYPortion,
}: {
  chartHeight: number;
  chartWidth: number;
  xPoints: number;
  midPrice: BigNumber;
  baseMinAndZoomMultiples: BaseMinAndZoomMultiples;
  buyYPortion: BigNumber;
  sellYPortion: BigNumber;
  pmmModel: PMMModel;
}) {
  return useMemo(() => {
    const quoteLinePoints: Array<number> = [];
    const baseLinePoints: Array<number> = [];
    const midPriceLinePoints: Array<number> = [];

    const { baseMin, zoomMultiples } = baseMinAndZoomMultiples;

    const xPortion = computeXPortion(chartWidth, zoomMultiples);

    // 1 -> 10 -> 100 index increases from 0 to 2
    // If the minimum value on the left is not midPrice/10, the existing calculation method is to calculate the maximum value based on the minimum value and multiply by 10^2
    const multiplesNum = zoomMultiples * 2;
    const step = new BigNumber(multiplesNum).div(xPoints);
    // The position of the middle price
    let midPriceN = new BigNumber(
      Math.log(midPrice.div(baseMin).toNumber()) / Math.log(10),
    );
    midPriceN = BigNumber.minimum(multiplesNum, midPriceN);
    midPriceN = BigNumber.maximum(0, midPriceN);
    for (let i = new BigNumber(0); i.lte(midPriceN); ) {
      const price = baseMin.multipliedBy(10 ** i.toNumber());
      const result = evalPoint({ val: price, model: pmmModel, midPrice });
      if (!result.vert.isNaN()) {
        const x = i.div(xPortion).toNumber();
        const y = chartHeight - result.vert.div(buyYPortion).toNumber();

        quoteLinePoints.push(x, y);
      }
      i = i.plus(step);
    }

    for (let i = midPriceN; i.lte(multiplesNum); ) {
      const price = baseMin.multipliedBy(10 ** i.toNumber());
      const result = evalPoint({ val: price, model: pmmModel, midPrice });
      if (!result.vert.isNaN()) {
        const x = i.div(xPortion).toNumber();
        const y = chartHeight - result.vert.div(sellYPortion).toNumber();

        baseLinePoints.push(x, y);
      }
      i = i.plus(step);
    }

    const midPriceX = midPriceN.div(xPortion).toNumber();

    const [, firstY] = quoteLinePoints;
    // k === 0 means selling coins at a constant price. The curve is two horizontal lines and requires special processing.
    const isZeroK = pmmModel.k.eq(0);
    if (isZeroK) {
      quoteLinePoints.push(midPriceX, firstY || chartHeight);
    }
    quoteLinePoints.push(midPriceX, chartHeight);

    midPriceLinePoints.push(midPriceX, chartHeight, midPriceX, 0);

    const maxResult = evalPoint({
      val: baseMin.multipliedBy(10 ** multiplesNum),
      model: pmmModel,
      midPrice,
    });
    let maxHeightY = chartHeight;
    const maxHeightX = new BigNumber(multiplesNum).div(xPortion).toNumber();
    if (!maxResult.vert.isNaN()) {
      maxHeightY = chartHeight - maxResult.vert.div(sellYPortion).toNumber();
    }
    if (isZeroK && baseLinePoints.length >= 2) {
      baseLinePoints.unshift(midPriceX, maxHeightY);
      baseLinePoints.unshift(midPriceX, chartHeight);
    }

    baseLinePoints.push(maxHeightX, maxHeightY);
    // The left side has been dragged to the left side of baseMin
    if (midPriceN.lte(0)) {
      baseLinePoints.unshift(0, chartHeight);
    }

    return {
      quoteLinePoints,
      quoteLineAreaPoints: [0, chartHeight, 0, firstY, ...quoteLinePoints],
      quoteLineAreaLinearGradientEndPointY: firstY,
      baseLinePoints,
      baseLineAreaPoints: [...baseLinePoints, maxHeightX, chartHeight],
      baseLineAreaLinearGradientEndPointY: maxHeightY,
      midPriceLinePoints,
    };
  }, [
    baseMinAndZoomMultiples,
    chartWidth,
    xPoints,
    midPrice,
    pmmModel,
    chartHeight,
    buyYPortion,
    sellYPortion,
  ]);
}

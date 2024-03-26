import BigNumber from 'bignumber.js';
import { StatAreaPoint } from './usePoints';

// The space reserved at the top
const topEmptyHeight = 36;

export function computePointYByHeight({
  maxHeight,
  gridAreaHeight,
  value,
}: {
  maxHeight: BigNumber;
  gridAreaHeight: number;
  value: BigNumber;
}) {
  const height = new BigNumber(gridAreaHeight).minus(topEmptyHeight);
  const onePXY = height.div(maxHeight);
  const y = height.minus(value.multipliedBy(onePXY)).plus(topEmptyHeight);
  return y.toNumber();
}

export function computeHeightByPointY({
  maxY,
  gridAreaHeight,
  y,
}: {
  maxY: BigNumber;
  gridAreaHeight: number;
  y: number;
}) {
  const height = new BigNumber(gridAreaHeight).minus(topEmptyHeight);
  const onePXY = height.div(maxY);
  const h = height.minus(new BigNumber(y).minus(topEmptyHeight)).div(onePXY);
  return h;
}

/**
 * Obtain the closest data point from the data point collection through the coordinate point x and a series of point data subsets from the point to the center line.
 */
export function getStatAreaPointByX({
  targetPrice,
  areaPoints,
  isLeft,
}: {
  targetPrice: BigNumber;
  areaPoints: StatAreaPoint[];
  isLeft: boolean;
}): {
  targetAreaStatPoint: StatAreaPoint | null;
  targetAreaStatPoints: StatAreaPoint[];
} {
  for (let index = 0; index < areaPoints.length; index++) {
    const point = areaPoints[index];

    const nextPoint =
      index < areaPoints.length - 1 ? areaPoints[index + 1] : null;

    if (!nextPoint) {
      return { targetAreaStatPoint: point, targetAreaStatPoints: areaPoints };
    }

    if (isLeft) {
      if (
        targetPrice.lte(point.middlePrice) &&
        targetPrice.gte(nextPoint.middlePrice)
      ) {
        return {
          targetAreaStatPoint: point,
          targetAreaStatPoints: areaPoints.slice(0, index + 1),
        };
      }
    } else if (
      targetPrice.gte(point.middlePrice) &&
      targetPrice.lte(nextPoint.middlePrice)
    ) {
      return {
        targetAreaStatPoint: point,
        targetAreaStatPoints: areaPoints.slice(0, index + 1),
      };
    }
  }

  return { targetAreaStatPoint: null, targetAreaStatPoints: [] };
}

/**
 * Given a pixel's x-coordinate, width, logarithm of the minimum value of the abscissa, and logarithm of the maximum value of the abscissa, calculate the logarithmic coordinate corresponding to the point
 */
export function computeTargetPrice({
  x,
  width,
  minXLN10,
  maxXLN10,
}: {
  x: number;
  width: number;
  minXLN10: BigNumber;
  maxXLN10: BigNumber;
}) {
  const xLN10 = new BigNumber(x)
    .div(width)
    .multipliedBy(maxXLN10.minus(minXLN10));
  const power = xLN10.plus(minXLN10);
  return new BigNumber(10 ** power.toNumber());
}

/**
 * Given the logarithm of a coordinate, the width, the logarithm of the minimum value of the abscissa, and the logarithm of the maximum value of the abscissa, calculate the x coordinate corresponding to the point
 */
export function computeTargetX({
  width,
  targetLN10,
  minXLN10,
  maxXLN10,
}: {
  width: number;
  targetLN10: BigNumber;
  minXLN10: BigNumber;
  maxXLN10: BigNumber;
}) {
  return targetLN10
    .minus(minXLN10)
    .div(maxXLN10.minus(minXLN10))
    .multipliedBy(width)
    .toNumber();
}

/**
 * Calculate logarithm
 */
export function computeTargetLN({ target }: { target: BigNumber }) {
  return new BigNumber(Math.log10(target.toNumber()));
}

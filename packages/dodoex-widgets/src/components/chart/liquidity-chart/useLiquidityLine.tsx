import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Line } from 'react-konva';
import {
  computePointYByHeight,
  computeTargetLN,
  computeTargetX,
} from './helper';
import { ColorMap } from './LiquidityChartKonva';
import { StatAreaPoint } from './usePoints';

export function useLiquidityLine({
  leftStatAreaPoints,
  rightStatAreaPoints,
  minXLN10,
  maxXLN10,
  maxLeftHeight,
  maxRightHeight,
  gridAreaWidth,
  gridAreaHeight,
  colorMap,
}: {
  leftStatAreaPoints: Array<StatAreaPoint>;
  rightStatAreaPoints: Array<StatAreaPoint>;
  minXLN10: BigNumber;
  maxXLN10: BigNumber;
  maxLeftHeight: BigNumber;
  maxRightHeight: BigNumber;
  gridAreaWidth: number;
  gridAreaHeight: number;
  colorMap: ColorMap;
}) {
  const leftLine = useMemo(() => {
    if (leftStatAreaPoints.length < 1) {
      return <></>;
    }
    const points: Array<number> = [];
    let minPointY = gridAreaHeight;
    for (const statPoint of leftStatAreaPoints) {
      const { middlePrice, rectangleHeight } = statPoint;
      const targetLN10 = computeTargetLN({ target: middlePrice });
      const x = computeTargetX({
        minXLN10,
        maxXLN10,
        width: gridAreaWidth,
        targetLN10,
      });
      const y = computePointYByHeight({
        maxHeight: maxLeftHeight,
        gridAreaHeight,
        value: rectangleHeight,
      });
      points.push(x, y);
      if (y < minPointY) {
        minPointY = y;
      }
    }

    // Gradient color points: from center to left
    const linearGradientPoints = points.slice();
    const [rightEndPointX, rightEndPointY] = linearGradientPoints;
    const leftStartPointY =
      linearGradientPoints[linearGradientPoints.length - 1];
    const leftStartPointX =
      linearGradientPoints[linearGradientPoints.length - 2];
    linearGradientPoints.push(leftStartPointX, leftStartPointY);
    linearGradientPoints.push(leftStartPointX, gridAreaHeight);
    linearGradientPoints.push(rightEndPointX, gridAreaHeight);
    linearGradientPoints.push(rightEndPointX, rightEndPointY);
    return (
      <>
        <Line
          points={linearGradientPoints}
          closed
          listening={false}
          lineCap="round"
          lineJoin="round"
          fillLinearGradientStartPoint={{ x: 0, y: gridAreaHeight }}
          fillLinearGradientEndPoint={{ x: 0, y: minPointY }}
          fillLinearGradientColorStops={colorMap.leftBg}
        />
        <Line
          points={points}
          stroke={colorMap.leftLine}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
      </>
    );
  }, [
    leftStatAreaPoints,
    gridAreaWidth,
    minXLN10,
    maxXLN10,
    gridAreaHeight,
    maxLeftHeight,
  ]);

  const rightLine = useMemo(() => {
    if (rightStatAreaPoints.length < 1) {
      return <></>;
    }
    const points: Array<number> = [];
    let minPointY = gridAreaHeight;
    for (const statPoint of rightStatAreaPoints) {
      const { middlePrice, rectangleHeight } = statPoint;
      const targetLN10 = computeTargetLN({ target: middlePrice });
      const x = computeTargetX({
        minXLN10,
        maxXLN10,
        width: gridAreaWidth,
        targetLN10,
      });
      const y = computePointYByHeight({
        maxHeight: maxRightHeight,
        gridAreaHeight,
        value: rectangleHeight,
      });
      points.push(x, y);
      if (y < minPointY) {
        minPointY = y;
      }
    }
    // Gradient colored dots
    const linearGradientPoints = points.slice();
    const [firstPointX] = linearGradientPoints;
    linearGradientPoints.unshift(firstPointX, gridAreaHeight);
    linearGradientPoints.unshift(gridAreaWidth, gridAreaHeight);
    return (
      <>
        <Line
          points={linearGradientPoints}
          closed
          listening={false}
          lineCap="round"
          lineJoin="round"
          fillLinearGradientStartPoint={{ x: 0, y: gridAreaHeight }}
          fillLinearGradientEndPoint={{ x: 0, y: minPointY }}
          fillLinearGradientColorStops={colorMap.rightBg}
        />
        <Line
          points={points}
          stroke={colorMap.rightLine}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
      </>
    );
  }, [
    rightStatAreaPoints,
    gridAreaWidth,
    minXLN10,
    maxXLN10,
    gridAreaHeight,
    maxRightHeight,
  ]);

  return {
    leftLine,
    rightLine,
  };
}

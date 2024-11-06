import { PMMModel, PmmModelParams } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { merge } from 'lodash';
import { useRef } from 'react';
import { chartT as t } from '../i18n';
import {
  Circle,
  Label,
  Layer,
  Line,
  Rect,
  Stage,
  Tag,
  Text,
} from 'react-konva';
import { formatShortNumber } from '../../../utils/formatter';
import { colorRgb } from '../depth-chart/helper';
import { labelPadding } from '../utils';
import {
  computePointYByHeight,
  computeTargetLN,
  computeTargetPrice,
  computeTargetX,
  getStatAreaPointByX,
} from './helper';
import { useGridLine } from './useGridLine';
import { useHorizontalLabel } from './useHorizontalLabel';
import { useLiquidityLine } from './useLiquidityLine';
import { useMiddleLine } from './useMiddleLine';
import { StatAreaPoint, usePoints } from './usePoints';

export const bgColor = 'rgba(38, 39, 41, 0.3)';

export interface ColorMap {
  grid?: string;
  midPriceLine?: string;
  leftBg?: (string | number)[];
  leftLine?: string;
  leftColor?: string;
  rightBg?: (string | number)[];
  rightLine?: string;
  rightColor?: string;
  tooltipBg?: string;
  tooltipColor?: string;
  textColor?: string;
}

export type Props = {
  width: number;
  height: number;
  params: PmmModelParams;
  midPrice: BigNumber;
  pmmModel: PMMModel;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  colorMap?: ColorMap;
};

export function LiquidityChartKonva({
  width,
  height,
  params,
  baseTokenSymbol,
  quoteTokenSymbol,
  colorMap,
}: Props) {
  const {
    maxLeftHeight,
    maxRightHeight,
    leftStatAreaPoints,
    rightStatAreaPoints,
    minXLN10,
    maxXLN10,
  } = usePoints({
    params,
  });

  const xAxisLabelHeight = 30.13;
  const gridAreaHeight = height - xAxisLabelHeight;
  const horizontalLineCount = 9;
  // The number of vertical grid lines or the number of horizontal axis scales
  const verticalLineCount = 7;

  const tooltipRef = useRef<Konva.Layer>(null);

  const colorMapRes = merge(
    {
      grid: '#2A2A2D',
      midPriceLine: '#313335',
      leftBg: [0, bgColor, 1, '#31645d'],
      leftLine: '#55f6db',
      leftColor: '',
      rightBg: [0, bgColor, 1, '#67303d'],
      rightLine: '#ff4f73',
      rightColor: '',
      tooltipBg: '#121212',
      tooltipColor: undefined,
      textColor: '#606066',
    },
    colorMap,
  );

  const handleMouseover = (evt: KonvaEventObject<MouseEvent>) => {
    const { current: tooltip } = tooltipRef;
    const node = evt.target;
    if (node && tooltip) {
      // update tooltip
      const mousePos = node.getStage()?.getPointerPosition();
      if (mousePos) {
        const { x } = mousePos;
        const middleX = width / 2;
        if (Math.abs(x - middleX) <= 2) {
          return;
        }
        if (x <= 2 || width - x <= 2) {
          return;
        }
        const targetPrice = computeTargetPrice({
          x,
          width,
          minXLN10,
          maxXLN10,
        });

        let targetAreaStatPoint: StatAreaPoint | null = null;
        let targetAreaStatPoints: Array<StatAreaPoint> = [];
        const isLeft = x < middleX;
        if (isLeft) {
          const result = getStatAreaPointByX({
            areaPoints: leftStatAreaPoints,
            targetPrice,
            isLeft,
          });
          targetAreaStatPoint = result.targetAreaStatPoint;
          targetAreaStatPoints = result.targetAreaStatPoints;
        } else {
          const result = getStatAreaPointByX({
            areaPoints: rightStatAreaPoints,
            targetPrice,
            isLeft,
          });
          targetAreaStatPoint = result.targetAreaStatPoint;
          targetAreaStatPoints = result.targetAreaStatPoints;
        }
        if (targetAreaStatPoint) {
          const targetLN10 = computeTargetLN({
            target: targetAreaStatPoint.middlePrice,
          });
          const targetAreaPointX = computeTargetX({
            minXLN10,
            maxXLN10,
            width,
            targetLN10,
          });
          const targetAreaPointY = computePointYByHeight({
            maxHeight: isLeft ? maxLeftHeight : maxRightHeight,
            gridAreaHeight,
            value: targetAreaStatPoint.rectangleHeight,
          });
          const tooltipLabel = tooltip.findOne<Konva.Label>('#tooltip');
          const toolTipVertLine =
            tooltip.findOne<Konva.Line>('#toolTipVertLine');
          const joinCircle = tooltip.findOne<Konva.Line>('#joinCircle');
          const tooltipText = tooltip.findOne<Konva.Text>('#tooltip-Text');
          const tooltipTag = tooltip.findOne<Konva.Tag>('#tooltip-tag');
          const priceTextLabel =
            tooltip.findOne<Konva.Label>('#priceTextLabel');
          const priceTextLabelText = priceTextLabel?.findOne<Konva.Text>(
            '#priceTextLabel-text',
          );
          const area = tooltip.findOne<Konva.Line>('#area');

          tooltipLabel?.position({
            x: targetAreaPointX,
            y: targetAreaPointY - 5 - 6,
          });

          tooltipText?.fill(
            colorMapRes.tooltipColor || (isLeft ? '#00FAD9' : '#FF5072'),
          );
          tooltipText?.text(
            isLeft
              ? t('pool.chart.liquidity-chart-buy', {
                  amount: formatShortNumber(targetAreaStatPoint.area),
                  symbol: baseTokenSymbol,
                  price: formatShortNumber(targetAreaStatPoint.price),
                })
              : t('pool.chart.liquidity-chart-sell', {
                  amount: formatShortNumber(targetAreaStatPoint.area),
                  symbol: quoteTokenSymbol,
                  price: formatShortNumber(targetAreaStatPoint.price),
                }),
          );

          if (tooltipLabel && tooltipTag) {
            if (tooltipLabel.width() / 2 > x) {
              tooltipTag.pointerDirection('left');
              tooltipTag.pointerHeight(15);
              tooltipTag.pointerWidth(8);
              tooltipLabel.offsetX(-(5 + 6));
              tooltipLabel.offsetY(-(5 + 6));
            } else if (tooltipLabel.width() / 2 + x > width) {
              tooltipTag.pointerDirection('right');
              tooltipTag.pointerHeight(15);
              tooltipTag.pointerWidth(8);
              tooltipLabel.offsetX(5 + 6);
              tooltipLabel.offsetY(-(5 + 6));
            } else {
              // @ts-ignore
              tooltipTag.pointerDirection('down');
              tooltipTag.pointerHeight(8);
              tooltipTag.pointerWidth(15);
              tooltipLabel.offsetX(0);
              tooltipLabel.offsetY(0);
            }
          }

          toolTipVertLine?.points([
            targetAreaPointX,
            gridAreaHeight,
            targetAreaPointX,
            targetAreaPointY,
          ]);
          toolTipVertLine?.stroke(isLeft ? '#55f6db' : '#ff4f73');

          let joinFill = isLeft ? 'rgb(86, 246, 218)' : '#FF5072';
          let joinStroke = isLeft
            ? 'rgba(86, 246, 218, 0.3)'
            : 'rgba(255, 80, 114, 0.3)';
          if (colorMapRes.leftLine && colorMapRes.rightLine) {
            joinFill = isLeft ? colorMapRes.leftLine : colorMapRes.rightLine;
            joinStroke = isLeft
              ? `rgba(${colorRgb(colorMapRes.leftLine)}, 0.4)`
              : `rgba(${colorRgb(colorMapRes.rightLine)}, 0.4)`;
          }
          if (joinCircle) {
            joinCircle.x(targetAreaPointX);
            joinCircle.y(targetAreaPointY);
            joinCircle.fill(joinFill);
            joinCircle.stroke(joinStroke);
          }

          if (priceTextLabel) {
            priceTextLabel.x(targetAreaPointX);
            priceTextLabel.y(gridAreaHeight + 8.08 + 1);
            priceTextLabel.offsetX(priceTextLabel.width() / 2);
            if (priceTextLabel.x() - priceTextLabel.width() / 2 < 0) {
              priceTextLabel.x(priceTextLabel.width() / 2);
            } else if (
              priceTextLabel.x() + priceTextLabel.width() / 2 >
              width
            ) {
              priceTextLabel.x(width - priceTextLabel.width() / 2);
            } else {
              priceTextLabel.x(x);
            }
          }

          if (priceTextLabelText) {
            priceTextLabelText.fill(
              colorMapRes.tooltipColor || (isLeft ? '#00FAD9' : '#FF5072'),
            );
            priceTextLabelText.text(
              formatShortNumber(targetAreaStatPoint.price),
            );
          }

          // Gradient colored dots
          const points: Array<number> = [];
          for (const statPoint of targetAreaStatPoints) {
            const { middlePrice, rectangleHeight } = statPoint;
            const targetLN10Gradient = computeTargetLN({ target: middlePrice });
            const xGradient = computeTargetX({
              minXLN10,
              maxXLN10,
              width,
              targetLN10: targetLN10Gradient,
            });
            const y = computePointYByHeight({
              maxHeight: isLeft ? maxLeftHeight : maxRightHeight,
              gridAreaHeight,
              value: rectangleHeight,
            });
            points.push(xGradient, y + 1);
          }
          const linearGradientPoints = points.slice();
          const [firstPointX, firstPointY] = linearGradientPoints;
          if (isLeft) {
            linearGradientPoints.push(targetAreaPointX, targetAreaPointY);
            linearGradientPoints.push(targetAreaPointX, gridAreaHeight);
            linearGradientPoints.push(firstPointX, gridAreaHeight);
            linearGradientPoints.push(firstPointX, firstPointY);
          } else {
            linearGradientPoints.unshift(firstPointX, gridAreaHeight);
            linearGradientPoints.unshift(targetAreaPointX, gridAreaHeight);
            linearGradientPoints.unshift(targetAreaPointX, targetAreaPointY);
          }
          if (area) {
            area.points(linearGradientPoints);
            area.fill(
              isLeft
                ? colorMapRes.leftLine || '#2c5b56'
                : colorMapRes.rightLine || '#7b3a48',
            );
          }

          tooltip.show();
        }
      }
    }
  };

  const handleMouseOut = () => {
    const { current: tooltip } = tooltipRef;
    if (tooltip) {
      tooltip.hide();
    }
  };

  const gridLine = useGridLine({
    gridAreaHeight,
    gridAreaWidth: width,
    horizontalLineCount,
    verticalLineCount,
    color: colorMapRes.grid,
  });
  const horizontalLabel = useHorizontalLabel({
    gridAreaHeight,
    gridAreaWidth: width,
    labelCount: verticalLineCount,
    minXLN10,
    maxXLN10,
    color: colorMapRes.textColor,
  });
  const middleLine = useMiddleLine({
    gridAreaHeight,
    gridAreaWidth: width,
    color: colorMapRes.midPriceLine,
  });
  const { leftLine, rightLine } = useLiquidityLine({
    leftStatAreaPoints,
    rightStatAreaPoints,
    minXLN10,
    maxXLN10,
    maxLeftHeight,
    maxRightHeight,
    gridAreaWidth: width,
    gridAreaHeight,
    colorMap: colorMapRes,
  });

  return (
    <Stage
      width={width}
      height={height}
      onMouseMove={handleMouseover}
      onMouseOver={handleMouseover}
      onMouseEnter={handleMouseover}
      onMouseOut={handleMouseOut}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={width}
          height={gridAreaHeight}
          stroke={colorMapRes.grid}
          strokeWidth={1}
        />

        {gridLine}

        {horizontalLabel}

        {leftLine}

        {rightLine}

        {middleLine}
      </Layer>

      <Layer ref={tooltipRef} visible={false}>
        <Line
          points={[]}
          closed
          listening={false}
          lineCap="round"
          lineJoin="round"
          id="area"
        />

        <Line
          points={[]}
          strokeWidth={1}
          stroke="#ff4f73"
          lineJoin="round"
          lineCap="round"
          dash={[4, 6]}
          id="toolTipVertLine"
        />
        <Circle
          x={0}
          y={0}
          radius={5}
          fill="#FF5072"
          stroke="rgba(255, 80, 114, 0.3)"
          strokeWidth={12}
          id="joinCircle"
        />
        <Label listening={false} x={0} y={0} id="priceTextLabel">
          <Tag fill={colorMapRes.tooltipBg} id="priceTextLabel-tag" />
          <Text
            text="-"
            fontSize={14}
            fontFamily="Manrope"
            padding={2}
            fill="#FF5072"
            id="priceTextLabel-text"
          />
        </Label>

        <Label listening={false} id="tooltip">
          <Tag
            fill={colorMapRes.tooltipBg}
            pointerDirection="down"
            pointerWidth={15}
            pointerHeight={8}
            cornerRadius={8}
            lineJoin="round"
            id="tooltip-tag"
          />
          <Text
            text=""
            fontFamily="Manrope"
            fontSize={12}
            lineHeight={17 / 12}
            // width={210}
            padding={labelPadding}
            fill="#FF5072"
            id="tooltip-Text"
          />
        </Label>
      </Layer>
    </Stage>
  );
}

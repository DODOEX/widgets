import { PMMModel, PmmModelParams } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { merge, throttle } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
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
import { chartT as t } from '../i18n';
import { chartOffsetYBCToolTip, labelPadding } from '../utils';
import {
  BaseMinAndZoomMultiples,
  computeBaseAfterZoom,
  computeBaseMinByDistance,
  computeBaseVert,
  computeZoomMultiplesWhenZoom,
  updateTooltip,
} from './helper';
import { useDepthLinePoints } from './useDepthLinePoints';
import { useGridLinePoints } from './useGridLinePoints';
import { useHorizontalLabelPoints } from './useHorizontalLabelPoints';

export const bgColor = 'rgba(38, 39, 41, 0.3)';

// toolTip the height of the arrow
const toolTipPointerHeight = 8;
const toolTipPointerWidth = 15;
const xAxisHight = 18;
const xPoints = 50;
/** The number of horizontal axis scales or the number of vertical grid lines */
const xAxisPoints = 7;
// Number of horizontal grid lines
const horizontalLineCount = 9;
// padding of toolTip
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
}

export type Props = {
  width: number;
  height: number;
  params: PmmModelParams;
  midPrice: BigNumber;
  pmmModel: PMMModel;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  baseMinAndZoomMultiples: BaseMinAndZoomMultiples;
  colorMap?: ColorMap;
  setBaseMinAndZoomMultiples: React.Dispatch<
    React.SetStateAction<BaseMinAndZoomMultiples>
  >;
};

export function DepthChartKonva({
  width,
  height,
  midPrice,
  pmmModel,
  params,
  baseTokenSymbol,
  quoteTokenSymbol,
  baseMinAndZoomMultiples,
  colorMap,
  setBaseMinAndZoomMultiples,
}: Props) {
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
    },
    colorMap,
  );

  const chartWidth = width;
  const chartHeight = height - xAxisHight;
  const oneXPx = chartWidth / xAxisPoints;

  const { buyBaseVert, sellBaseVert } = computeBaseVert({
    midPrice,
    q: params.q,
    q0: params.q0,
    pmmModel,
  });
  const buyYPortion = buyBaseVert.div(chartHeight);
  const sellYPortion = sellBaseVert.div(chartHeight);

  const tooltipRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const { current: tooltip } = tooltipRef;
  const dragStartXRef = useRef<number>(0);
  const pointerXRef = useRef<number>();

  const { horizontalGridLines, verticalGridLines } = useGridLinePoints({
    chartHeight,
    chartWidth,
    horizontalLineCount,
    verticalLineCount: xAxisPoints,
  });
  const { horizontalLabelTickPoints, horizontalLabelTextPoints } =
    useHorizontalLabelPoints({
      chartHeight,
      chartWidth,
      xAxisPoints,
      oneXPx,
      baseMinAndZoomMultiples,
    });
  const {
    quoteLinePoints,
    quoteLineAreaPoints,
    quoteLineAreaLinearGradientEndPointY,
    baseLinePoints,
    baseLineAreaPoints,
    baseLineAreaLinearGradientEndPointY,
    midPriceLinePoints,
  } = useDepthLinePoints({
    chartHeight,
    chartWidth,
    midPrice,
    xPoints,
    pmmModel,
    baseMinAndZoomMultiples,
    buyYPortion,
    sellYPortion,
  });

  const handleMouseover = (evt: KonvaEventObject<MouseEvent>) => {
    const node = evt.target;
    if (node && tooltip) {
      // update tooltip
      const mousePos = node.getStage()?.getPointerPosition();
      if (mousePos) {
        const { x } = mousePos;
        if (x > chartWidth) {
          tooltip.hide();
          return;
        }
        updateTooltip({
          x,
          tooltip,
          buyBaseVert,
          sellBaseVert,
          chartWidth,
          chartHeight,
          midPrice,
          pmmModel,
          baseTokenSymbol,
          quoteTokenSymbol,
          baseMinAndZoomMultiples,
          t,
          isHover: true,
          color: colorMapRes.tooltipColor,
          leftColor: colorMapRes.leftLine,
          rightColor: colorMapRes.rightLine,
        });
      }
    }
  };
  const handleMouseOut = () => {
    if (tooltip) {
      tooltip.hide();
    }
  };

  const updateWhenDrag = useMemo(
    () =>
      throttle((evt: KonvaEventObject<DragEvent>) => {
        const { target } = evt;
        const stage = target.getStage();
        if (stage) {
          stage.container().style.cursor = 'grabbing';
          const mousePos = stage?.getPointerPosition();
          if (mousePos) {
            const dragDistance = mousePos.x - dragStartXRef.current;
            dragStartXRef.current = mousePos.x;
            pointerXRef.current = mousePos.x;
            setBaseMinAndZoomMultiples((prev) => {
              if (prev.baseMin === undefined) {
                return prev;
              }
              return {
                baseMin: computeBaseMinByDistance({
                  dragDistance,
                  prevBaseMin: prev.baseMin,
                  chartWidth,
                  zoomMultiples: prev.zoomMultiples,
                }),
                zoomMultiples: prev.zoomMultiples,
                targetMarginPriceX: 0,
              };
            });
          }
        }
      }, 100),
    [chartWidth, setBaseMinAndZoomMultiples],
  );

  const updateWhenWheel = useMemo(
    () =>
      throttle((event: KonvaEventObject<WheelEvent>) => {
        // eslint-disable-next-line no-param-reassign
        event.cancelBubble = true;
        event.evt.preventDefault();
        // scroll up
        const isScrollUp = event.evt.deltaY < 0;

        setBaseMinAndZoomMultiples((prev) => {
          const newZoomMultiples = computeZoomMultiplesWhenZoom({
            zoomIn: isScrollUp,
            prevZoomMultiples: prev.zoomMultiples,
          });
          return {
            baseMin: computeBaseAfterZoom({
              midPrice,
              zoomMultiples: newZoomMultiples,
            }),
            zoomMultiples: newZoomMultiples,
            targetMarginPriceX: prev.targetMarginPriceX,
          };
        });
      }, 100),
    [midPrice, setBaseMinAndZoomMultiples],
  );

  useEffect(() => {
    if (baseMinAndZoomMultiples.targetMarginPriceX > 0 && tooltip !== null) {
      updateTooltip({
        x: baseMinAndZoomMultiples.targetMarginPriceX,
        tooltip,
        buyBaseVert,
        sellBaseVert,
        chartWidth,
        chartHeight,
        midPrice,
        pmmModel,
        baseTokenSymbol,
        quoteTokenSymbol,
        baseMinAndZoomMultiples,
        t,
        color: colorMapRes.tooltipColor,
        leftColor: colorMapRes.leftLine,
        rightColor: colorMapRes.rightLine,
      });
      return;
    }
    if (pointerXRef.current !== undefined && tooltip !== null) {
      updateTooltip({
        x: pointerXRef.current,
        tooltip,
        buyBaseVert,
        sellBaseVert,
        chartWidth,
        chartHeight,
        midPrice,
        pmmModel,
        baseTokenSymbol,
        quoteTokenSymbol,
        baseMinAndZoomMultiples,
        t,
        isHover: true,
        color: colorMapRes.tooltipColor,
        leftColor: colorMapRes.leftLine,
        rightColor: colorMapRes.rightLine,
      });
    }
  }, [
    baseMinAndZoomMultiples,
    baseTokenSymbol,
    buyBaseVert,
    chartHeight,
    chartWidth,
    colorMapRes.leftLine,
    colorMapRes.rightLine,
    colorMapRes.tooltipColor,
    midPrice,
    pmmModel,
    quoteTokenSymbol,
    sellBaseVert,
    tooltip,
  ]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      offsetY={-chartOffsetYBCToolTip}
      height={height + chartOffsetYBCToolTip}
      draggable
      dragBoundFunc={function () {
        return {
          x: this.absolutePosition().x,
          y: this.absolutePosition().y,
        };
      }}
      onMouseMove={handleMouseover}
      onMouseOver={handleMouseover}
      onMouseOut={handleMouseOut}
      onDragStart={function (evt) {
        const { target } = evt;
        const stage = target.getStage();
        if (stage) {
          const mousePos = stage.getPointerPosition();
          if (mousePos) {
            dragStartXRef.current = mousePos.x;
          }
        }
      }}
      onDragMove={updateWhenDrag}
      onDragEnd={(evt) => {
        const { target } = evt;
        const stage = target.getStage();
        if (stage) {
          stage.container().style.cursor = 'pointer';
        }
      }}
      onWheel={updateWhenWheel}
    >
      <Layer>
        {/* border */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={chartHeight}
          stroke={colorMapRes.grid}
          strokeWidth={1}
        />

        {/* grid lines */}
        {horizontalGridLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            stroke={colorMapRes.grid}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            listening={false}
          />
        ))}
        {verticalGridLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            stroke={colorMapRes.grid}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            listening={false}
          />
        ))}

        {/* abscissa tick mark */}
        {horizontalLabelTickPoints.map((tickPoints, index) => (
          <Line
            key={index}
            points={tickPoints}
            stroke="#9d9d9d"
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            listening={false}
          />
        ))}
        {horizontalLabelTextPoints.map((textPoint, index) => (
          <Text
            key={index}
            x={textPoint.x}
            y={textPoint.y}
            text={textPoint.text}
            fontFamily="Manrope"
            fontSize={12}
            fill="#9d9d9d"
            width={oneXPx}
            padding={0}
            align="center"
            verticalAlign="bottom"
            listening={false}
          />
        ))}

        {/* Depth map lines */}
        <Line
          points={quoteLineAreaPoints}
          closed
          listening={false}
          lineCap="round"
          lineJoin="round"
          fillLinearGradientStartPoint={{ x: 0, y: chartHeight }}
          fillLinearGradientEndPoint={{
            x: 0,
            y: quoteLineAreaLinearGradientEndPointY,
          }}
          fillLinearGradientColorStops={colorMapRes.leftBg}
        />
        <Line
          points={quoteLinePoints}
          stroke={colorMapRes.leftLine}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
        <Line
          points={baseLineAreaPoints}
          closed
          listening={false}
          lineCap="round"
          lineJoin="round"
          fillLinearGradientStartPoint={{ x: chartWidth, y: chartHeight }}
          fillLinearGradientEndPoint={{
            x: chartWidth,
            y: baseLineAreaLinearGradientEndPointY,
          }}
          fillLinearGradientColorStops={colorMapRes.rightBg}
        />
        <Line
          points={baseLinePoints}
          stroke={colorMapRes.rightLine}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
        <Line
          points={midPriceLinePoints}
          stroke={colorMapRes.midPriceLine}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
      </Layer>

      <Layer ref={tooltipRef} visible={false} listening={false}>
        <Line
          points={[]}
          stroke="#ff4f73"
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
          dash={[4, 6]}
          id="toolTipVertLine"
        />
        <Line
          points={[]}
          stroke="ff4f73"
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
          dash={[4, 6]}
          id="toolTipHoriLine"
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
        <Label x={0} y={0} id="priceTextLabel">
          <Tag fill={colorMapRes.tooltipBg} id="priceTextLabel-tag" />
          <Text
            text=""
            fontSize={12}
            fontFamily="Manrope"
            padding={4}
            fill="#FF5072"
            id="priceTextLabel-text"
          />
        </Label>
        <Label x={0} y={0} id="slippageTextLabel">
          <Tag fill={colorMapRes.tooltipBg} id="slippageTextLabel-tag" />
          <Text
            text=""
            fontSize={12}
            fontFamily="Manrope"
            padding={4}
            fill="#FF5072"
            id="slippageTextLabel-text"
          />
        </Label>
        <Label x={0} y={0} id="toolTip">
          <Tag
            fill={colorMapRes.tooltipBg}
            pointerDirection="down"
            pointerWidth={toolTipPointerWidth}
            pointerHeight={toolTipPointerHeight}
            cornerRadius={toolTipPointerHeight}
            lineJoin="round"
            id="toolTip-tag"
          />
          <Text
            text="-"
            fontSize={12}
            lineHeight={17 / 12}
            padding={labelPadding}
            fontFamily="Manrope"
            fill="#FFFFFF"
            id="toolTip-text"
          />
        </Label>
      </Layer>
    </Stage>
  );
}

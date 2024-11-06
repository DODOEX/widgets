import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Line, Text } from 'react-konva';
import { formatShortNumber } from '../../../utils/formatter';
import { computeTargetPrice } from './helper';

export function useHorizontalLabel({
  minXLN10,
  maxXLN10,
  labelCount,
  gridAreaHeight,
  gridAreaWidth,
  color = '#606066',
}: {
  minXLN10: BigNumber;
  maxXLN10: BigNumber;
  labelCount: number;
  gridAreaHeight: number;
  gridAreaWidth: number;
  color?: string;
}) {
  return useMemo(() => {
    const labelWidth = gridAreaWidth / (labelCount + 1);
    const labelTextList: Array<{
      x: number;
      y: number;
      text: string;
    }> = [];
    const labelLines: Array<Array<number>> = [];
    for (let index = 0; index < labelCount; index++) {
      const x = labelWidth / 2 + labelWidth * index;
      labelTextList.push({
        x,
        y: gridAreaHeight + 10.08 + 1,
        text: formatShortNumber(
          computeTargetPrice({
            x: labelWidth * (index + 1),
            width: gridAreaWidth,
            minXLN10,
            maxXLN10,
          }),
        ),
      });

      const lineX = labelWidth * (index + 1);
      labelLines.push([
        lineX,
        gridAreaHeight + 1,
        lineX,
        gridAreaHeight + 4 + 1,
      ]);
    }
    return (
      <>
        {labelTextList.map((labelText, index) => (
          <Text
            key={index}
            x={labelText.x}
            y={labelText.y}
            text={labelText.text}
            fontSize={14}
            fontFamily="Manrope"
            fill={color}
            width={labelWidth}
            padding={0}
            align="center"
            verticalAlign="bottom"
            listening={false}
          />
        ))}

        {labelLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            stroke={color}
            strokeWidth={1}
            lineCap="butt"
            lineJoin="miter"
            tension={1}
            listening={false}
          />
        ))}
      </>
    );
  }, [minXLN10, maxXLN10, gridAreaHeight, gridAreaWidth, labelCount]);
}

import { useMemo } from 'react';
import { Line } from 'react-konva';

export function useGridLine({
  gridAreaHeight,
  gridAreaWidth,
  horizontalLineCount,
  verticalLineCount,
  color = '#2A2A2D',
}: {
  gridAreaHeight: number;
  gridAreaWidth: number;
  horizontalLineCount: number;
  verticalLineCount: number;
  color?: string;
}) {
  return useMemo(() => {
    const horizontalGridLines: Array<Array<number>> = [];
    const horizontalGridPerBlockHeight =
      gridAreaHeight / (horizontalLineCount + 1);
    const verticalGridLines: Array<Array<number>> = [];
    const verticalGridPerBlockHeight = gridAreaWidth / (verticalLineCount + 1);
    for (let index = 0; index < horizontalLineCount; index++) {
      const y = horizontalGridPerBlockHeight * (index + 1);
      horizontalGridLines.push([0, y, gridAreaWidth, y]);
    }
    for (let index = 0; index < verticalLineCount; index++) {
      const x = verticalGridPerBlockHeight * (index + 1);
      verticalGridLines.push([x, 0, x, gridAreaHeight]);
    }
    return (
      <>
        {horizontalGridLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            stroke={color}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            tension={1}
            listening={false}
          />
        ))}
        {verticalGridLines.map((points, index) => (
          <Line
            key={index}
            points={points}
            stroke={color}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            tension={1}
            listening={false}
          />
        ))}
      </>
    );
  }, [
    gridAreaHeight,
    gridAreaWidth,
    horizontalLineCount,
    verticalLineCount,
    color,
  ]);
}

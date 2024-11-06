import { useMemo } from 'react';
import { Line } from 'react-konva';

export function useMiddleLine({
  gridAreaHeight,
  gridAreaWidth,
  color = '#606066',
}: {
  gridAreaHeight: number;
  gridAreaWidth: number;
  color?: string;
}) {
  return useMemo(() => {
    const topPointX = gridAreaWidth / 2;
    return (
      <Line
        points={[topPointX, 0, topPointX, gridAreaHeight - 1]}
        stroke={color}
        strokeWidth={1}
        lineCap="round"
        lineJoin="round"
        tension={1}
        listening={false}
      />
    );
  }, [gridAreaHeight, gridAreaWidth, color]);
}

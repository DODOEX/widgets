import { Box, Button } from '@dodoex/components';
import {
  ScaleLinear,
  select,
  zoom,
  ZoomBehavior,
  zoomIdentity,
  ZoomTransform,
} from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { ZoomLevels } from './types';

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}: {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
}) {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(
            zoomBehavior.current.transform,
            zoomIdentity.translate(0, 0).scale(1),
          )
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg],
  );

  useEffect(() => {
    if (!svg) {
      return;
    }

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', ({ transform }: { transform: ZoomTransform }) =>
        setZoom(transform),
      );

    select(svg as Element).call(zoomBehavior.current);
  }, [
    height,
    width,
    setZoom,
    svg,
    xScale,
    zoomBehavior,
    zoomLevels,
    zoomLevels.max,
    zoomLevels.min,
  ]);

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial();
  }, [zoomInitial, zoomLevels]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${showResetButton ? 3 : 2}, 1fr)`,
        gridGap: '6px',
        position: 'absolute',
        top: '-32px',
        right: 0,
      }}
    >
      {showResetButton && (
        <Button
          size={Button.Size.small}
          sx={{
            borderRadius: 16,
          }}
          onClick={() => {
            resetBrush();
            zoomReset();
          }}
          disabled={false}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        </Button>
      )}
      <Button
        size={Button.Size.small}
        sx={{
          borderRadius: 16,
        }}
        onClick={zoomIn}
        disabled={false}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </Button>
      <Button
        size={Button.Size.small}
        sx={{
          borderRadius: 16,
        }}
        onClick={zoomOut}
        disabled={false}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </Button>
    </Box>
  );
}

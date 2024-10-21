import { useDevices } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useSlippageSlider } from './useSlippageSlider';

export function useHoverSlider(
  ref: React.RefObject<HTMLDivElement>,
  {
    slippageSlider,
  }: {
    slippageSlider: ReturnType<typeof useSlippageSlider>;
  },
) {
  const { isMobile } = useDevices();
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const isMouseDown = React.useRef(false);

  React.useEffect(() => {
    if (ref.current && slippageSlider.max) {
      const refCurrent = ref.current;
      let { width: wrapperWidth, x: wrapperX } =
        refCurrent.getBoundingClientRect();
      const mouseMove = (e: MouseEvent) => {
        if (isMouseDown.current) {
          return;
        }
        // Because using e.offsetX directly will be lost when the element is re-rendered, resulting in acquisition errors, the more stable pageX is used here for calculation.
        const offsetX = e.pageX - wrapperX;
        const count = slippageSlider.max - slippageSlider.min;
        const currentSplitValueBg = new BigNumber(
          (offsetX / wrapperWidth) * count,
        ).integerValue();
        const newHoverValue = currentSplitValueBg
          .plus(slippageSlider.min)
          .toNumber();
        if (newHoverValue !== hoverValue) {
          setHoverValue(newHoverValue);
        }
      };
      const mouseLeave = () => {
        setHoverValue(null);
      };

      const mouseUp = () => {
        isMouseDown.current = false;
      };

      const mouseDown = () => {
        isMouseDown.current = true;
      };

      if (!isMobile) {
        refCurrent.addEventListener('mousemove', mouseMove);
        refCurrent.addEventListener('mouseleave', mouseLeave);
        refCurrent.addEventListener('mouseup', mouseUp);
        refCurrent.addEventListener('mousedown', mouseDown);
      }

      return () => {
        if (isMobile) {
          refCurrent.removeEventListener('mousemove', mouseMove);
          refCurrent.removeEventListener('mouseleave', mouseLeave);
          refCurrent.removeEventListener('mouseUp', mouseUp);
          refCurrent.removeEventListener('mouseDown', mouseDown);
        }
      };
    }
  }, [ref, isMobile]);

  return {
    hoverValue,
    setHoverValue,
  };
}

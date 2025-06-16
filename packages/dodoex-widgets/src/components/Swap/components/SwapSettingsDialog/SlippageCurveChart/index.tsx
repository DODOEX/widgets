import { Box, BoxProps, LoadingSkeleton, useDevices } from '@dodoex/components';
import React from 'react';
import CurveChart, { dotClassName } from './CurveChart';
import SlippageSlider from './SlippageSlider';
import { useHoverSlider } from './useHoverSlider';
import { useSlippageSlider } from './useSlippageSlider';
import { useSuccessRate } from './useSuccessRate';
import { ForecastSlippageListItem } from '../../../../../hooks/Swap/useForecastSlippageList';
import { waitElement } from '../../../../../utils/browser';
import { Trans } from '@lingui/macro';

function SlippageCurveChart({
  data,
  activeSlippage,
  loading,
  sx,
  handleChangeCustomSlippage,
}: {
  data?: ForecastSlippageListItem[];
  activeSlippage?: number;
  loading?: boolean;
  sx?: BoxProps['sx'];

  handleChangeCustomSlippage: (slippage: number) => void;
}) {
  const dataLen = React.useMemo(() => data?.length ?? 0, [data]);
  const { isMobile } = useDevices();

  const [yPositions, setYPositions] = React.useState<Array<number>>([]);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const computed = async () => {
      if (ref.current && dataLen) {
        const selector = `.${dotClassName}`;
        await waitElement(selector, {
          wrapper: ref.current,
        });
        const positionYDotEls = ref.current.querySelectorAll(selector);
        const { y: wrapperY, height: wrapperHeight } =
          ref.current.getBoundingClientRect();
        const len = positionYDotEls?.length ?? 0;
        const result: Array<number> = [];
        for (let i = 0; i < len; i++) {
          const el = positionYDotEls[i];
          let elY = el.children[0]
            ? el.children[0].getBoundingClientRect().y
            : el.getBoundingClientRect().y;

          // 0.5 deviation
          const elSpace = elY - wrapperY - 0.5;
          result.push(wrapperHeight - elSpace);
        }
        setYPositions(result);
      }
    };
    computed();
  }, [dataLen]);
  const slippageSlider = useSlippageSlider({
    data,
    activeSlippage,
    yPositions,
  });
  const { hoverValue, setHoverValue } = useHoverSlider(ref, {
    slippageSlider,
  });
  const { successRate, hoverSuccessRate } = useSuccessRate({
    data,
    activeSlippage,
    hoverValue,
    decimalConversion: slippageSlider.decimalConversion,
  });
  if (!data) return null;
  return (
    <Box
      sx={{
        p: 12,
        pb: 28,
        borderRadius: 12,
        backgroundColor: 'background.paperContrast',
        ...sx,
      }}
    >
      <>
        <Box
          sx={{
            typography: 'h6',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          <Trans>Success Rate</Trans>
        </Box>
        <LoadingSkeleton
          loading={loading}
          loadingProps={{
            width: 100,
          }}
          sx={{
            mt: 4,
            typography: 'caption',
            color: hoverSuccessRate ? 'primary.main' : 'text.primary',
          }}
        >
          {hoverSuccessRate || successRate}
        </LoadingSkeleton>
      </>
      {/* chart */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          pr: 4,
        }}
      >
        <Box
          sx={{
            pb: 8,
            mr: 16,
            typography: 'h6',
            fontWeight: 600,
          }}
        >
          <Trans>Slippage</Trans>
        </Box>
        <Box
          sx={{
            flex: 1,
            // overflow: 'hidden',
          }}
          ref={ref}
        >
          <CurveChart data={data} loading={loading} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            {!loading && dataLen ? (
              <SlippageSlider
                value={isMobile ? hoverValue || -1 : slippageSlider.value}
                min={slippageSlider.min}
                max={slippageSlider.max}
                disabled={!isMobile}
                marks={[
                  {
                    value: slippageSlider.max,
                    label: slippageSlider.max,
                  },
                ]}
                formatValue={slippageSlider.formatValue}
                getSliderYPosition={slippageSlider.getSliderYPosition}
                hoverValue={isMobile ? slippageSlider.value : hoverValue}
                onChange={(_, value) => {
                  if (typeof value === 'number') {
                    // Because hovering is not convenient on the mobile terminal, dragging is used to change the hover value. Instead, the displayed value is passed in as hoverValue for easy display. Change the color inside again and make it the same color as the PC
                    if (isMobile) {
                      setHoverValue(value);
                      return;
                    }
                    const newValue = slippageSlider.handleChangeValue(value);
                    handleChangeCustomSlippage(newValue);
                  }
                }}
                onChangeCommitted={() => {
                  setHoverValue(null);
                }}
              />
            ) : (
              ''
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(SlippageCurveChart);

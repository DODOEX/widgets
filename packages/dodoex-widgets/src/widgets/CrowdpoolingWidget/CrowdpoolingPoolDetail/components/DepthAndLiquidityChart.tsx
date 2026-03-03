import { Box, useTheme, alpha } from '@dodoex/components';
import { PMMModel, PmmModelParams } from '@dodoex/api';
import { TokenInfo } from '../../../../hooks/Token';
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { t } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import EmptyChart from './EmptyChart';

const DepthChart = React.lazy(
  () => import('../../../../components/chart/depth-chart'),
);

const LiquidityChart = React.lazy(
  () => import('../../../../components/chart/liquidity-chart'),
);

enum DepthTab {
  liquidity = 1,
  depth,
}

export default function DepthAndLiquidityChart({
  baseToken,
  quoteToken,
  pmmParams,
  pmmModel,
  midPrice,
}: {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  pmmParams?: PmmModelParams;
  pmmModel?: PMMModel;
  midPrice?: BigNumber;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const [depthTab, setDepthTab] = useState(DepthTab.depth);
  const chartParentRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  useEffect(() => {
    const handleChangeChartWidth = () => {
      if (!chartParentRef || !chartParentRef.current) return;
      setChartWidth(chartParentRef.current.offsetWidth);
    };
    handleChangeChartWidth();

    window.addEventListener('resize', handleChangeChartWidth);
    return () => {
      window.removeEventListener('resize', handleChangeChartWidth);
    };
  }, [chartParentRef, midPrice]);

  const isDepth = depthTab === DepthTab.depth;

  if (!midPrice || midPrice.isNaN())
    return <EmptyChart height={!isMobile ? (isDepth ? 665 : 494) : 261} />;

  const leftColor = theme.palette.success.main;
  const rightColor = theme.palette.error.main;
  return (
    <Box
      ref={chartParentRef}
      sx={{
        mt: 14,
        '& input': {
          backgroundColor: 'background.input',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'border.main',
          borderRadius: 8,
          color: 'text.primary',
          overflow: 'hidden',
        },
        '& .operate-btn-wrapper button': {
          backgroundColor: 'background.paperContrast',
          color: 'text.primary',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 8,
          mt: 22,
          ml: 'auto',
          width: 'fit-content',
        }}
      >
        <Box
          onClick={() => setDepthTab(DepthTab.liquidity)}
          sx={{
            px: 12,
            py: 4,
            borderRadius: 8,
            typography: 'body2',
            cursor: 'pointer',
            backgroundColor:
              depthTab === DepthTab.liquidity
                ? 'background.paperContrast'
                : 'transparent',
            color:
              depthTab === DepthTab.liquidity ? 'text.primary' : 'text.secondary',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {t`Liquidity`}
        </Box>
        <Box
          onClick={() => setDepthTab(DepthTab.depth)}
          sx={{
            px: 12,
            py: 4,
            borderRadius: 8,
            typography: 'body2',
            cursor: 'pointer',
            backgroundColor:
              depthTab === DepthTab.depth
                ? 'background.paperContrast'
                : 'transparent',
            color: depthTab === DepthTab.depth ? 'text.primary' : 'text.secondary',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {t`Depth`}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 8,
          mb: 14,
          color: 'text.secondary',
          typography: 'h6',
          ...(isMobile && {
            transform: 'scale(0.66667)',
            transformOrigin: 'top left',
          }),
        }}
      >
        {t`Y-Axis`}
      </Box>
      {isDepth ? (
        chartWidth && (
          <DepthChart
            width={chartWidth}
            height={isMobile ? 261 : 364}
            chartId="crowdpooling-pool-depth-chart"
            baseTokenSymbol={baseSymbol}
            quoteTokenSymbol={quoteSymbol}
            pmmModel={pmmModel}
            pmmParams={pmmParams}
            midPrice={midPrice}
            colorMap={{
              grid: theme.palette.mode === 'light' ? '#E4E4E4' : undefined,
              midPriceLine:
                theme.palette.mode === 'light' ? '#E4E4E4' : undefined,
              leftBg: [0, alpha(leftColor, 0.04), 1, alpha(leftColor, 0.3)],
              leftLine: leftColor,
              rightBg: [0, alpha(rightColor, 0.04), 1, alpha(rightColor, 0.3)],
              rightLine: rightColor,
              tooltipBg: theme.palette.background.paperContrast,
              tooltipColor: theme.palette.text.primary,
            }}
            notShowAmountInput={isMobile}
          />
        )
      ) : (
        <LiquidityChart
          width={chartWidth}
          height={isMobile ? 261 : 364}
          baseTokenSymbol={baseSymbol}
          quoteTokenSymbol={quoteSymbol}
          pmmModel={pmmModel}
          pmmParams={pmmParams}
          midPrice={midPrice}
          notShowTipText
          colorMap={{
            grid: theme.palette.mode === 'light' ? '#E4E4E4' : undefined,
            midPriceLine:
              theme.palette.mode === 'light' ? '#E4E4E4' : undefined,
            leftBg: [0, alpha(leftColor, 0.04), 1, alpha(leftColor, 0.3)],
            leftLine: leftColor,
            rightBg: [0, alpha(rightColor, 0.04), 1, alpha(rightColor, 0.3)],
            rightLine: rightColor,
            tooltipBg: theme.palette.background.paperContrast,
            tooltipColor: theme.palette.text.primary,
            textColor: theme.palette.text.secondary,
          }}
        />
      )}
      <Box
        sx={{
          mt: 6,
          color: 'text.secondary',
          typography: 'h6',
          ...(isMobile && {
            transform: 'scale(0.66667)',
            transformOrigin: 'top left',
          }),
        }}
      >
        {t`X-Axis`}
      </Box>
      {isDepth ? (
        ''
      ) : (
        <Box
          sx={{
            mt: 24,
            color: 'text.secondary',
            typography: 'h6',
            textAlign: 'center',
          }}
        >
          *&nbsp;
          {t({
            id: 'liquidity.chart.tip',
            message: `This liquidity chart is calculated based on ${baseSymbol} token quantity`,
          })}
        </Box>
      )}
    </Box>
  );
}

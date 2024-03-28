import { PMMModel, PmmModelParams } from '@dodoex/api';
import {
  Box,
  alpha,
  useTheme,
  TabsButtonGroup,
  Tabs,
  TabPanel,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../../hooks/Token';
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
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
  pmmParams?: PmmModelParams;
  pmmModel?: PMMModel;
  midPrice?: BigNumber;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const [depthTab, setDepthTab] = React.useState(DepthTab.depth);
  const chartParentRef = React.useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = React.useState(0);

  const baseSymbol = baseToken?.symbol ?? '';
  const quoteSymbol = quoteToken?.symbol ?? '';

  React.useEffect(() => {
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

  if (!midPrice || midPrice.isNaN()) {
    return <EmptyChart height={!isMobile ? (isDepth ? 665 : 494) : 261} />;
  }

  const leftColor = theme.palette.success.main;
  const rightColor = theme.palette.error.main;
  const tabs = [
    { key: DepthTab.liquidity, value: t`Liquidity` },
    { key: DepthTab.depth, value: t`Depth` },
  ];
  return (
    <Box
      ref={chartParentRef}
      sx={{
        mt: 2,
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
      <Tabs
        value={depthTab}
        onChange={(_, value) => {
          setDepthTab(value as DepthTab);
        }}
      >
        <TabsButtonGroup
          tabs={tabs}
          variant="tag"
          tabsListSx={{
            ml: 'auto',
          }}
        />

        <Box
          sx={{
            typography: 'h6',
            mt: 8,
            mb: 14,
            color: 'text.secondary',
            ...(isMobile
              ? {
                  transform: 'scale(0.66667)',
                  transformOrigin: 'top left',
                }
              : {}),
          }}
        >
          <Trans>Amounts</Trans>
        </Box>
        <TabPanel value={DepthTab.depth}>
          {chartWidth && (
            <DepthChart
              width={chartWidth}
              height={isMobile ? 261 : 364}
              chartId="create-pool-depth-chart"
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
                rightBg: [
                  0,
                  alpha(rightColor, 0.04),
                  1,
                  alpha(rightColor, 0.3),
                ],
                rightLine: rightColor,
                tooltipBg: theme.palette.background.paperContrast,
                tooltipColor: theme.palette.text.primary,
              }}
              notShowAmountInput={isMobile}
            />
          )}
        </TabPanel>
        <TabPanel value={DepthTab.liquidity}>
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
        </TabPanel>
      </Tabs>
      <Box
        sx={{
          typography: 'h6',
          mt: 6,
          color: 'text.secondary',
          ...(isMobile
            ? {
                transform: 'scale(0.66667)',
                transformOrigin: 'top left',
              }
            : {}),
        }}
      >
        <Trans>Swap Rate</Trans>
      </Box>
      {isDepth ? (
        ''
      ) : (
        <Box
          sx={{
            typography: 'h6',
            mt: 24,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          *&nbsp;
          {t`The area of the chart indicates the buy/sell volume of ${baseSymbol} that can be carried by the market when the current price changes to the hover price. `}
        </Box>
      )}
    </Box>
  );
}

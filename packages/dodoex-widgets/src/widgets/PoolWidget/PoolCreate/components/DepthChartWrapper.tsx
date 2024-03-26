import { Box, ButtonBase, QuestionTooltip, useTheme } from '@dodoex/components';
import React from 'react';
import { ReactComponent as DepthChartExampleSmall } from './depth-chart-example-small.svg';
import { ReactComponent as DepthChartExampleSmallDark } from './depth-chart-example-small-dark.svg';
import { StateProps } from '../reducer';
import DepthAndLiquidityChart from './DepthAndLiquidityChart';
import Dialog from '../../../../components/Dialog';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useCreatePmm } from '../hooks/useCreatePmm';
import { t } from '@lingui/macro';

export function DepthChartWrapper({
  selectedVersion,
  baseToken,
  quoteToken,
  initPrice,
  slippageCoefficient,
  baseAmount,
  quoteAmount,
}: {
  selectedVersion: StateProps['selectedVersion'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  slippageCoefficient: StateProps['slippageCoefficient'];
  baseAmount: StateProps['baseAmount'];
  quoteAmount: StateProps['quoteAmount'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const [depthChartModalVisible, setDepthChartModalVisible] =
    React.useState(false);

  const { pmmParams, pmmModel, midPrice } = useCreatePmm({
    selectedVersion,
    baseAmount,
    quoteAmount,
    initPrice,
    slippageCoefficient,
  });

  if (!isMobile) {
    return null;
  }
  const title = t`Emulator`;
  const titleQuestion = t`The liquidity of DODO is continuous, which is different from the discrete liquidity of UniV3. The ticks shown in the illustration are for demonstration purposes only.`;

  return (
    <>
      <Box
        sx={{
          mx: 20,
          mb: 8,
        }}
      >
        <Box
          sx={{
            width: '100%',
            px: 20,
            py: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.border.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          component={ButtonBase}
          onClick={() => setDepthChartModalVisible(true)}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.text.secondary,
              typography: 'body1',
              fontWeight: 600,
            }}
          >
            {title}
            <QuestionTooltip
              title={titleQuestion}
              ml={4}
              sx={{
                width: 14,
                height: 14,
              }}
            />
          </Box>

          {!midPrice || midPrice.isNaN() ? (
            <Box
              sx={{
                py: 5,
                typography: 'body1',
              }}
            >
              -
            </Box>
          ) : theme.palette.mode === 'light' ? (
            <DepthChartExampleSmall width="52" height="32" />
          ) : (
            <DepthChartExampleSmallDark width="52" height="32" />
          )}
        </Box>
      </Box>

      <Dialog
        open={depthChartModalVisible}
        onClose={() => setDepthChartModalVisible(false)}
        title={
          <Box>
            {title}
            <QuestionTooltip title={titleQuestion} ml={4} />
          </Box>
        }
      >
        <Box
          sx={{
            maxHeight: `calc(80vh - 134px)`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <DepthAndLiquidityChart
            baseToken={baseToken}
            quoteToken={quoteToken}
            pmmParams={pmmParams}
            pmmModel={pmmModel}
            midPrice={midPrice}
          />
        </Box>
      </Dialog>
    </>
  );
}

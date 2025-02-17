import { Box, Input, QuestionTooltip, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { MAX_SWAP_SLIPPAGE } from '../../../../constants/swap';
import { useSwapSettingStore } from '../../../../hooks/Swap/useSwapSettingStore';
import { useSwapSlippage } from '../../../../hooks/Swap/useSwapSlippage';
import { TokenInfo } from '../../../../hooks/Token';
import { useUserOptions } from '../../../UserOptionsProvider';

enum SlippageType {
  recommend = 'recommend',
  custom = 'custom',
}

export default function SlippageSetting({
  fromToken,
  toToken,
}: {
  fromToken?: TokenInfo | null;
  toToken?: TokenInfo | null;
}) {
  const theme = useTheme();
  const { onlySolana } = useUserOptions();
  const {
    slippageAdvanced: advanced,
    notRemindAgainSlippageHigher,
    notRemindAgainSlippageLower,
  } = useSwapSettingStore();

  const {
    customSlippage,
    customSlippageNum,
    handleSlippageChange,
    forecastSlippage,
    forecastSlippageQuery,
    recommendSlippage,
  } = useSwapSlippage({
    fromToken,
    toToken,
  });
  const recommendSlippageIsRecommend = !!forecastSlippage;

  // Custom input state: Select custom to automatically enter the input state. After the input box presses Enter or loses focus, it exits the output state and enters the selected state.
  const [isCustomInputActive, setIsCustomInputActive] = React.useState(false);
  const [operateTab, setOperateTab] = React.useState<SlippageType>();
  if (!operateTab && fromToken && toToken) {
    setOperateTab(
      customSlippage ? SlippageType.custom : SlippageType.recommend,
    );
  }
  const isCustomActive = operateTab === SlippageType.custom;
  const customInputRef = React.useRef<HTMLInputElement>(null);
  const activeSlippage = React.useMemo(() => {
    if (operateTab === SlippageType.custom)
      return customSlippageNum
        ? new BigNumber(customSlippageNum).div(100).toNumber()
        : undefined;
    return new BigNumber(recommendSlippage).div(100).toNumber();
  }, [operateTab, recommendSlippage, customSlippageNum]);
  const handleSlippageCurveChartChangeCustom = React.useCallback(
    (slippage: number) => {
      if (!isCustomActive) {
        setOperateTab(SlippageType.custom);
      }
      handleSlippageChange({
        slippage: new BigNumber(slippage).times(100).toString(),
        disabled: false,
        deleted: false,
        recommend: String(recommendSlippage),
      });
    },
    [isCustomActive, recommendSlippage, handleSlippageChange],
  );

  if (onlySolana) {
    return (
      <Box
        sx={{
          pt: 20,
          borderTop: `1px solid ${theme.palette.border.main}`,
        }}
      >
        <Box sx={{ mb: 16, display: 'flex', alignItems: 'center' }}>
          <Trans>Slippage Tolerance</Trans>
          <QuestionTooltip
            title={
              <Trans>
                Attention: High slippage tolerance will increase the success
                rate of transaction, but might not get the best quote.
              </Trans>
            }
            ml={7}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Input
            placeholder={String(recommendSlippage)}
            fullWidth
            sx={{
              height: 36,
              '& input': {
                boxSizing: 'border-box',
                '&::placeholder': {
                  color: 'custom.input.placeholder',
                  opacity: 1,
                },
              },
            }}
            inputMode="decimal"
            suffix={<Box sx={{ color: 'text.disabled' }}>%</Box>}
            value={customSlippage || ''}
            onChange={(e) => {
              const slippage = e.target.value;
              handleSlippageChange({
                slippage,
                disabled: false,
                recommend: String(recommendSlippage),
              });
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsCustomInputActive(false);
                if (!customSlippageNum) {
                  setOperateTab(SlippageType.recommend);
                  return;
                }
                const deleted = !customSlippageNum || customSlippageNum < 0;
                if (deleted && customSlippage) {
                  handleSlippageChange({
                    slippage: customSlippage,
                    disabled: deleted,
                    deleted,
                    recommend: String(recommendSlippage),
                  });
                }
              }, 10);
            }}
          />
          {Number(customSlippage) >= MAX_SWAP_SLIPPAGE && (
            <Box
              sx={{
                typography: 'h6',
                mt: 6,
                color: 'error.main',
              }}
            >
              <Trans>Maximum slippage do not exceed 50%</Trans>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return null;
}

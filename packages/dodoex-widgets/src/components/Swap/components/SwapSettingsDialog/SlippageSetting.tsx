import React from 'react';
import { useSwapSettingStore } from '../../../../hooks/Swap/useSwapSettingStore';
import { useSwapSlippage } from '../../../../hooks/Swap/useSwapSlippage';
import { TokenInfo } from '../../../../hooks/Token';
import BigNumber from 'bignumber.js';
import {
  Box,
  QuestionTooltip,
  LoadingSkeleton,
  Checkbox,
  Tabs,
  TabListButton,
  TabButton,
  alpha,
  Input,
  TabPanel,
  useTheme,
  Tooltip,
} from '@dodoex/components';
import { Alarm } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import SlippageCurveChart from './SlippageCurveChart';
import { SlippageWarning } from './SlippageWarning';
import { useUserOptions } from '../../../UserOptionsProvider';
import { MAX_SWAP_SLIPPAGE } from '../../../../constants/swap';

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

  return (
    <>
      <Box
        sx={{
          mt: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          <Trans>Max Slippage</Trans>
          <QuestionTooltip
            title={
              <>
                <Trans>
                  The dynamic slippage is provided by DODO team through
                  analyzing historical transactions.
                </Trans>
                <br />
                <Box
                  component="a"
                  href={t`https://blog.dodoex.io/introducing-the-dodo-smart-slippage-3d32d13a4fef`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'underline',
                  }}
                  onClick={(evt) => {
                    evt.stopPropagation();
                  }}
                >
                  <Trans>Learn More</Trans>
                  {'>'}
                </Box>
              </>
            }
            ml={7}
          />
        </Box>
        {forecastSlippageQuery.isLoading || !!recommendSlippage ? (
          <LoadingSkeleton
            loading={forecastSlippageQuery.isLoading}
            loadingProps={{
              width: 100,
            }}
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              typography: 'body2',
              cursor: 'pointer',
              color: 'text.secondary',
            }}
          >
            <Trans>Advanced</Trans>
            <Checkbox
              sx={{
                top: -1,
              }}
              size={16}
              checked={advanced}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const { checked } = evt.target;
                useSwapSettingStore.setState({
                  slippageAdvanced: checked,
                });
              }}
            />
          </LoadingSkeleton>
        ) : (
          ''
        )}
      </Box>
      {!!operateTab && (
        <Tabs
          value={operateTab}
          onChange={(_, v) => {
            setOperateTab(v as SlippageType);
            if (v === SlippageType.custom) {
              setIsCustomInputActive(true);
            }
          }}
        >
          <TabListButton
            variant="inPaper"
            sx={{
              mt: 16,
            }}
          >
            <TabButton
              value={SlippageType.recommend}
              variant="inPaper"
              sx={{
                position: 'relative',
                '&:not(:hover) .weak': {
                  color: alpha(theme.palette.secondary.contrastText, 0.5),
                },
              }}
            >
              <>
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    ml: 4,
                    typography: 'h6',
                    fontWeight: 600,
                    padding: theme.spacing(0, 8),
                    borderRadius: 4,
                    backgroundColor: isCustomActive
                      ? alpha(theme.palette.purple.main, 0.1)
                      : '#FFF',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background: isCustomActive
                        ? `linear-gradient(90deg, ${
                            theme.palette.purple.main
                          } -1.33%, ${
                            theme.palette.mode === 'dark'
                              ? '#E6D9FF'
                              : '#BFAFF3'
                          } 98.67%)`
                        : `linear-gradient(90deg, ${theme.palette.purple.main} -1.33%, #BFAFF3 98.67%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    New
                  </Box>
                </Box>
                <Box
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  {recommendSlippageIsRecommend ? (
                    <Box
                      sx={{
                        flexGrow: 1,
                        typography: 'body2',
                        fontWeight: 600,
                      }}
                    >
                      {recommendSlippage.toString() || '-'}%
                    </Box>
                  ) : (
                    <Tooltip
                      title={
                        <Trans>
                          This trading pair does not have enough historical data
                          and has used the default dynamic slippage.
                        </Trans>
                      }
                      sx={{
                        ml: 0,
                        maxWidth: 240,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          typography: 'body2',
                          fontWeight: 600,
                          color: theme.palette.warning.main,
                          gap: 4,
                        }}
                      >
                        <Box
                          component={Alarm}
                          sx={{
                            position: 'relative',
                            top: -2,
                            width: 18,
                            height: 18,
                          }}
                        />
                        <span>{recommendSlippage.toString() || '-'}%</span>
                      </Box>
                    </Tooltip>
                  )}
                  <Box
                    sx={{
                      typography: 'h6',
                      fontWeight: 600,
                    }}
                    className="weak"
                  >
                    <Trans>Dynamic</Trans>
                  </Box>
                </Box>
              </>
            </TabButton>
            <TabButton
              value={SlippageType.custom}
              variant="inPaper"
              sx={{
                position: 'relative',
                p: 0,
                '&:not(:hover) .weak': {
                  color: 'text.secondary',
                },
              }}
            >
              <Box
                sx={{
                  px: 16,
                  py: 12,
                  typography: 'body2',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
                onClick={() => {
                  setTimeout(() => {
                    setIsCustomInputActive(true);
                  });
                }}
              >
                {isCustomInputActive ? (
                  <Input
                    ref={customInputRef}
                    placeholder="-"
                    sx={{
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      '& input': {
                        textAlign: 'center',
                        typography: 'body2',
                        p: 0,
                        boxSizing: 'border-box',
                        height: 19,
                        color: isCustomActive
                          ? theme.palette.secondary.contrastText
                          : theme.palette.text.secondary,
                        '&::placeholder': {
                          color: 'custom.input.placeholder',
                          opacity: 1,
                        },
                      },
                    }}
                    inputMode="decimal"
                    value={customSlippage || ''}
                    autoFocus
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
                        const deleted =
                          !customSlippageNum || customSlippageNum < 0;
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
                    onKeyDown={(evt) => {
                      if (evt.code === 'Enter') {
                        evt.preventDefault();
                        customInputRef.current?.blur();
                      }
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      color:
                        customSlippage && isCustomActive
                          ? theme.palette.warning.main
                          : undefined,
                    }}
                  >
                    {customSlippage && (
                      <Box
                        component={Alarm}
                        sx={{
                          position: 'relative',
                          top: -2,
                          width: 18,
                          height: 18,
                        }}
                      />
                    )}
                    {customSlippage || '-'}%
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    typography: 'h6',
                    fontWeight: 600,
                  }}
                  className="weak"
                >
                  <Trans>Custom</Trans>
                </Box>
              </Box>
            </TabButton>
          </TabListButton>
          <TabPanel value={SlippageType.recommend}>
            {/* There is no percentage inside this component, but there is a percentage outside. The passed value needs to be converted */}
            {!!forecastSlippageQuery.slippageData.slippageList?.length &&
            advanced ? (
              <SlippageCurveChart
                data={forecastSlippageQuery.slippageData.slippageList}
                activeSlippage={activeSlippage}
                loading={forecastSlippageQuery.isLoading}
                handleChangeCustomSlippage={
                  handleSlippageCurveChartChangeCustom
                }
                sx={{
                  mt: 8,
                }}
              />
            ) : (
              ''
            )}
          </TabPanel>
          <TabPanel value={SlippageType.custom}>
            <Box sx={{ mt: 8 }}></Box>
            {customSlippageNum > recommendSlippage && (
              <SlippageWarning
                title={t`Higher than dynamic slippage`}
                desc={t`Dynamic slippage is ${recommendSlippage}%,the current slippage setting is higher than the dynamic slippage, which means you are willing to accept a worse final execution price.`}
                doNotChecked={notRemindAgainSlippageHigher}
                onChangeDoNotChecked={(notRemindAgainSlippageHigher) =>
                  useSwapSettingStore.setState({
                    notRemindAgainSlippageHigher,
                  })
                }
              />
            )}
            {!!customSlippageNum && customSlippageNum < recommendSlippage && (
              <SlippageWarning
                title={t`Lower than dynamic slippage`}
                desc={t`Dynamic slippage is ${recommendSlippage}% , the current slippage setting may increase the failure rate of transactions.`}
                doNotChecked={notRemindAgainSlippageLower}
                onChangeDoNotChecked={(notRemindAgainSlippageLower) =>
                  useSwapSettingStore.setState({
                    notRemindAgainSlippageLower,
                  })
                }
              />
            )}
          </TabPanel>
        </Tabs>
      )}
    </>
  );
}

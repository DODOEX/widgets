import {
  Box,
  ButtonBase,
  Skeleton,
  alpha,
  useTheme,
  HoverOpacity,
  QuestionTooltip,
  Tooltip,
  Checkbox,
} from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Warn, Switch } from '@dodoex/icons';
import { Dispatch, useMemo, useState } from 'react';
import FixedInitPriceConfirm from '../components/FixedInitPriceConfirm';
import { validInitPrice } from '../hooks/useValidation';
import { useVersionList } from '../hooks/useVersionList';
import { Actions, StateProps, Types } from '../reducer';
import { Trans } from '@lingui/macro';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { usePriceInit } from '../hooks/usePriceInit';
import { SettingItemWrapper } from './widgets';

export function InitPriceSetting({
  selectedVersion,
  isStandardVersion,
  isSingleTokenVersion,
  isFixedRatio,
  leftTokenAddress,
  baseToken,
  quoteToken,
  fixedRatioPrice,
  dispatch,
  priceInfo,
}: {
  selectedVersion: StateProps['selectedVersion'];
  isStandardVersion: boolean;
  isSingleTokenVersion: boolean;
  isFixedRatio: StateProps['isFixedRatio'];
  leftTokenAddress: StateProps['leftTokenAddress'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  fixedRatioPrice: StateProps['fixedRatioPrice'];
  dispatch: Dispatch<Actions>;
  priceInfo: ReturnType<typeof usePriceInit>;
}) {
  const theme = useTheme();

  const [cancelFixedModalVisible, setCancelFixedModalVisible] = useState(false);

  const { versionMap } = useVersionList();

  const { initPriceLabel, initPriceTips, initPriceTipsLink } =
    versionMap[selectedVersion];
  const isForward = leftTokenAddress === baseToken?.address;
  const leftTokenSymbol = isForward ? baseToken?.symbol : quoteToken?.symbol;
  const rightTokenSymbol = isForward ? quoteToken?.symbol : baseToken?.symbol;
  const { currentPrice, isErrorPrice, isNullPrice, fiatPriceLoading } =
    priceInfo;
  const currentTokenDecimals = isForward
    ? quoteToken?.decimals
    : baseToken?.decimals;

  const errorMsg = useMemo(() => {
    if (!quoteToken) return '';
    const msg = validInitPrice(
      selectedVersion,
      fixedRatioPrice,
      quoteToken.decimals,
    );
    return msg || '';
  }, [fixedRatioPrice, quoteToken, selectedVersion]);

  const errorInput = useMemo(
    () =>
      !!(
        fixedRatioPrice &&
        fixedRatioPrice !== '0' &&
        !Number(fixedRatioPrice)
      ),
    [fixedRatioPrice],
  );

  return (
    <>
      <SettingItemWrapper
        title={
          <>
            {initPriceLabel}
            {initPriceTips && (
              <QuestionTooltip
                title={
                  <>
                    {initPriceTips}
                    {initPriceTipsLink ? (
                      <>
                        {'\n'}
                        <Box
                          component="a"
                          href={initPriceTipsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                          }}
                          onClick={(evt: any) => {
                            evt.stopPropagation();
                          }}
                        >
                          <Trans>Learn More</Trans>
                          {'>'}
                        </Box>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                }
                ml={4}
                sx={{
                  width: 14,
                  height: 14,
                  alignItems: 'center',
                }}
              />
            )}
          </>
        }
        sx={{
          mt: 20,
        }}
      >
        <Box
          sx={{
            pt: isStandardVersion ? 11 : 19,
            px: 19,
            pb: 11,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor:
              errorMsg || errorInput
                ? 'error.main'
                : theme.palette.background.input,
            borderRadius: 8,
            backgroundColor: theme.palette.background.input,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 20,
          }}
        >
          {isStandardVersion ? null : (
            <>
              <Box
                sx={{
                  typography: 'body2',
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.disabled,
                    flexShrink: 0,
                  }}
                >
                  1&nbsp;{leftTokenSymbol ?? '-'}&nbsp;=
                </Box>

                <NumberInput
                  value={fixedRatioPrice}
                  onChange={(v) => {
                    dispatch({
                      type: Types.UpdateFixedRatioPrice,
                      payload: v,
                    });
                  }}
                  readOnly={isFixedRatio}
                  sx={{
                    pl: 0,
                    pr: 0,
                    mt: 0,
                    flex: '1 1 auto',
                    '& input': {
                      textAlign: 'right',
                      typography: 'h5',
                      height: 25,
                      py: 0,
                      px: 8,
                      color: theme.palette.text.primary,
                      '&::placeholder': {
                        color: theme.palette.text.disabled,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: theme.palette.text.disabled,
                    flexShrink: 0,
                  }}
                >
                  {rightTokenSymbol ?? '-'}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  component={ButtonBase}
                  onClick={() => {
                    dispatch({
                      type: Types.ToggleLeftToken,
                    });
                  }}
                >
                  <HoverOpacity
                    weak
                    component={Switch}
                    sx={{
                      marginLeft: 8,
                      p: theme.spacing(2),
                      color: theme.palette.text.primary,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: '50%',
                    }}
                  />
                </Box>
              </Box>

              {errorMsg && (
                <Box
                  sx={{
                    typography: 'h6',
                    color: 'error.main',
                    mt: -14,
                  }}
                >
                  {errorMsg}
                </Box>
              )}
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isStandardVersion ? 'flex-start' : 'flex-end',
              typography: 'h6',
              color: theme.palette.text.primary,
              fontWeight: 500,
            }}
          >
            =<Trans>Current Market Price:</Trans>&nbsp;
            {fiatPriceLoading ? (
              <Skeleton sx={{ borderRadius: 4 }} width={50} height={17} />
            ) : isNullPrice ? (
              <Tooltip title={<Trans>Failed to get price of the token</Trans>}>
                <Box
                  component={Warn}
                  sx={{
                    width: 14,
                    height: 14,
                    color: theme.palette.error.main,
                    typography: 'h6',
                  }}
                />
              </Tooltip>
            ) : (
              formatTokenAmountNumber({
                input: currentPrice,
                decimals: currentTokenDecimals,
              })
            )}
            &nbsp;{rightTokenSymbol}
            {isErrorPrice ? null : isSingleTokenVersion ? null : (
              <Checkbox
                checked={isFixedRatio}
                onChange={(evt: any) => {
                  if (!evt.target.checked) {
                    setCancelFixedModalVisible(true);
                    return;
                  }
                  dispatch({
                    type: Types.UpdateIsFixedRatio,
                    payload: true,
                  });
                  if (!currentTokenDecimals) {
                    throw new Error('currentTokenDecimals is undefined');
                  }
                  if (currentPrice && !currentPrice.isNaN()) {
                    dispatch({
                      type: Types.UpdateFixedRatioPrice,
                      payload: currentPrice
                        .dp(currentTokenDecimals, BigNumber.ROUND_DOWN)
                        .toString(),
                    });
                  }
                }}
                sx={{
                  ml: 8,
                }}
              />
            )}
          </Box>
        </Box>
      </SettingItemWrapper>

      <FixedInitPriceConfirm
        on={cancelFixedModalVisible}
        onClose={() => setCancelFixedModalVisible(false)}
        onConfirm={() => {
          dispatch({
            type: Types.UpdateIsFixedRatio,
            payload: false,
          });
        }}
      />
    </>
  );
}

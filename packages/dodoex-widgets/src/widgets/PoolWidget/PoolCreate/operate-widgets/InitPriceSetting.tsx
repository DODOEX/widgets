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
import {
  ChangeEvent,
  Dispatch,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import FixedInitPriceConfirm from '../components/FixedInitPriceConfirm';
import { validInitPrice } from '../hooks/useValidation';
import { useVersionList } from '../hooks/useVersionList';
import { Actions, StateProps, Types } from '../reducer';
import { Version } from '../types';
import { useFetchFiatPrice } from '../../../../hooks/Swap';
import { t, Trans } from '@lingui/macro';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';

export function InitPriceSetting({
  isEdit,
  selectedVersion,
  isFixedRatio,
  leftTokenAddress,
  baseToken,
  quoteToken,
  fixedRatioPrice,
  dispatch,
}: {
  isEdit?: boolean;
  selectedVersion: StateProps['selectedVersion'];
  isFixedRatio: StateProps['isFixedRatio'];
  leftTokenAddress: StateProps['leftTokenAddress'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  fixedRatioPrice: StateProps['fixedRatioPrice'];
  dispatch: Dispatch<Actions>;
}) {
  const theme = useTheme();

  const [cancelFixedModalVisible, setCancelFixedModalVisible] = useState(false);

  const { versionMap } = useVersionList();
  const { fromFiatPrice, toFiatPrice, loading } = useFetchFiatPrice({
    fromToken: baseToken,
    toToken: quoteToken,
  });

  const { initPriceLabel, initPriceTips, initPriceTipsLink } =
    versionMap[selectedVersion];
  const isForward = leftTokenAddress === baseToken?.address;
  const leftTokenSymbol = isForward ? baseToken?.symbol : quoteToken?.symbol;
  const rightTokenSymbol = isForward ? quoteToken?.symbol : baseToken?.symbol;
  const baseTokenFiatPrice = baseToken ? fromFiatPrice : undefined;
  const quoteTokenFiatPrice = quoteToken ? toFiatPrice : undefined;
  const currentPrice = useMemo(() => {
    const base2QuotePrice =
      baseTokenFiatPrice && quoteTokenFiatPrice
        ? new BigNumber(baseTokenFiatPrice).div(quoteTokenFiatPrice)
        : undefined;
    const quote2basePrice =
      baseTokenFiatPrice && quoteTokenFiatPrice
        ? new BigNumber(quoteTokenFiatPrice).div(baseTokenFiatPrice)
        : undefined;
    return isForward ? base2QuotePrice : quote2basePrice;
  }, [baseTokenFiatPrice, isForward, quoteTokenFiatPrice]);
  const currentTokenDecimals = isForward
    ? quoteToken?.decimals
    : baseToken?.decimals;
  const isNullPrice = !currentPrice || currentPrice.isNaN();
  const isErrorPrice = !loading && isNullPrice;

  // If the initial fiat currency price query fails, the user is allowed to enter the price and the checkbox is hidden.
  useLayoutEffect(() => {
    if (isErrorPrice) {
      dispatch({
        type: Types.UpdateIsFixedRatio,
        payload: false,
      });
    }
  }, [dispatch, isErrorPrice]);

  // The initial legal currency price query is successful, and fixedRatioPrice is initialized using this price.
  useLayoutEffect(() => {
    if (!isEdit && selectedVersion !== Version.singleToken) {
      dispatch({
        type: Types.InitFixedRatioPrice,
        payload: {
          baseTokenFiatPrice:
            baseTokenFiatPrice !== undefined
              ? Number(baseTokenFiatPrice)
              : baseTokenFiatPrice,
          quoteTokenFiatPrice:
            quoteTokenFiatPrice !== undefined
              ? Number(quoteTokenFiatPrice)
              : quoteTokenFiatPrice,
        },
      });
    }
  }, [
    isEdit,
    baseTokenFiatPrice,
    dispatch,
    quoteTokenFiatPrice,
    selectedVersion,
  ]);

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
      <Box
        sx={{
          mt: 20,
          px: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: theme.palette.text.secondary,
              }}
            >
              {initPriceLabel}
            </Box>
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
                  mr: 14,
                }}
              />
            )}
            <Box
              sx={{
                ml: 'auto',
                typography: 'body2',
              }}
            >
              =<Trans>Current:</Trans>
            </Box>
          </Box>

          <Box
            sx={{
              typography: 'body2',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              wordBreak: 'break-all',
            }}
          >
            {loading ? (
              <Skeleton sx={{ borderRadius: 4 }} width={50} height={19} />
            ) : isNullPrice ? (
              <Tooltip title={t`Failed to get price of the token`}>
                <Box
                  component={Warn}
                  sx={{
                    width: 14,
                    height: 14,
                    color: 'error.main',
                    typography: 'h6',
                    mt: -2,
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
          </Box>
        </Box>

        {isErrorPrice
          ? null
          : selectedVersion !== Version.singleToken && (
              <Checkbox
                sx={{
                  top: -1,
                }}
                checked={isFixedRatio}
                onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                  if (!evt.target.checked) {
                    setCancelFixedModalVisible(true);
                    return;
                  }
                  dispatch({
                    type: Types.UpdateIsFixedRatio,
                    payload: true,
                  });
                  if (!isNullPrice) {
                    if (currentTokenDecimals === undefined) {
                      throw new Error('currentTokenDecimals is undefined');
                    }
                    dispatch({
                      type: Types.UpdateFixedRatioPrice,
                      payload: currentPrice
                        .dp(currentTokenDecimals, BigNumber.ROUND_DOWN)
                        .toString(),
                    });
                  }
                }}
              />
            )}
      </Box>

      {selectedVersion !== Version.standard && (
        <>
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.primary,
              mt: 12,
              mx: 20,
              pt: 16,
              pb: 16,
              display: 'flex',
              alignItems: 'center',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor:
                errorMsg || errorInput
                  ? 'error.main'
                  : theme.palette.border.main,
              borderRadius: 8,
              backgroundColor: 'background.input',
            }}
          >
            <Box
              sx={{
                ml: 16,
                fontWeight: 600,
                color: theme.palette.text.disabled,
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
                pl: 8,
                pr: 12,
                mt: 0,
                flex: '1 1 auto',
                '& input': {
                  textAlign: 'right',
                  typography: 'h5',
                  height: 25,
                  p: theme.spacing(0),
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
                mr: 16,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.text.disabled,
              }}
              component={ButtonBase}
              onClick={() => {
                dispatch({
                  type: Types.ToggleLeftToken,
                });
              }}
            >
              {rightTokenSymbol ?? '-'}
              <HoverOpacity
                weak
                component={Switch}
                sx={{
                  marginLeft: 16,
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
                mt: 6,
                mx: 20,
              }}
            >
              {errorMsg}
            </Box>
          )}
        </>
      )}

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

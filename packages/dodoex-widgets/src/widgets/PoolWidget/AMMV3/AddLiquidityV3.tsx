import { alpha, Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import WidgetContainer from '../../../components/WidgetContainer';
import { tokenApi } from '../../../constants/api';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { Buttons } from './components/Buttons';
import { CurrencyInputPanel } from './components/CurrencyInputPanel';
import { FeeSelector } from './components/FeeSelector';
import LiquidityChartRangeInput from './components/LiquidityChartRangeInput';
import { RangeSelector } from './components/RangeSelector';
import { RateToggle } from './components/RateToggle';
import { ReviewModal } from './components/ReviewModal';
import { TokenPairSelect } from './components/TokenPairSelect';
import { DynamicSection, YellowCard } from './components/widgets';
import { useRangeHopCallbacks } from './hooks/useRangeHopCallbacks';
import { useV3DerivedMintInfo } from './hooks/useV3DerivedMintInfo';
import { useV3MintActionHandlers } from './hooks/useV3MintActionHandlers';
import { reducer, Types } from './reducer';
import {
  Currency,
  CurrencyAmount,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
} from './sdks/sdk-core';
import { NonfungiblePositionManager } from './sdks/v3-sdk';
import { Bound, Field } from './types';
import { convertBackToTokenInfo } from './utils';
import { maxAmountSpend } from './utils/maxAmountSpend';
import { toSlippagePercent } from './utils/slippage';
import { useUserOptions } from '../../../components/UserOptionsProvider';

export default function AddLiquidityV3({
  params,
  handleGoBack,
  handleGoToPoolList,
  noHeader,
}: {
  params?: {
    from?: string;
    to?: string;
    fee?: string;
  };
  handleGoBack: () => void;
  handleGoToPoolList: () => void;
  noHeader?: boolean;
}) {
  const { chainId, account } = useWalletInfo();
  const theme = useTheme();
  const submission = useSubmission();
  const { isMobile } = useWidgetDevice();

  const defaultBaseTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(chainId, params?.from, account),
  });
  const defaultQuoteTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(chainId, params?.to, account),
  });

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    baseToken: null,
    quoteToken: null,
    feeAmount: params?.fee ? Number(params?.fee) : undefined,
    independentField: Field.CURRENCY_A,
    typedValue: '',
    startPriceTypedValue: '',
    leftRangeTypedValue: '',
    rightRangeTypedValue: '',
  });

  useEffect(() => {
    if (!defaultBaseTokenQuery.data) {
      return;
    }
    dispatch({
      type: Types.UpdateDefaultBaseToken,
      payload: defaultBaseTokenQuery.data,
    });
  }, [defaultBaseTokenQuery]);
  useEffect(() => {
    if (!defaultQuoteTokenQuery.data) {
      return;
    }
    dispatch({
      type: Types.UpdateDefaultQuoteToken,
      payload: defaultQuoteTokenQuery.data,
    });
  }, [defaultQuoteTokenQuery]);

  const { independentField, typedValue, startPriceTypedValue } = state;

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    isTaxed,
  } = useV3DerivedMintInfo({ state });

  const formattedPrice = useMemo(() => {
    return (invertPrice ? price?.invert() : price)?.toSignificant();
  }, [invertPrice, price]);

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers({ noLiquidity, dispatch });

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: undefined,
    type: 'AMMV3',
  });

  const isValid = !errorMessage && !invalidRange;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  const approvalA = useTokenStatus(
    convertBackToTokenInfo(parsedAmounts[Field.CURRENCY_A]?.currency),
    {
      contractAddress: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
      overrideBalance: currencyBalances[Field.CURRENCY_A]
        ? new BigNumber(currencyBalances[Field.CURRENCY_A].toSignificant())
        : undefined,
      amount: parsedAmounts[Field.CURRENCY_A]
        ? new BigNumber(parsedAmounts[Field.CURRENCY_A].toSignificant())
        : undefined,
    },
  );
  const approvalB = useTokenStatus(
    convertBackToTokenInfo(parsedAmounts[Field.CURRENCY_B]?.currency),
    {
      contractAddress: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
      overrideBalance: currencyBalances[Field.CURRENCY_B]
        ? new BigNumber(currencyBalances[Field.CURRENCY_B].toSignificant())
        : undefined,
      amount: parsedAmounts[Field.CURRENCY_B]
        ? new BigNumber(parsedAmounts[Field.CURRENCY_B].toSignificant())
        : undefined,
    },
  );

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    pricesAtTicks;

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  } = useRangeHopCallbacks({
    tickLower,
    tickUpper,
    pool,
    state,
    dispatch,
  });

  const handleSetFullRange = useCallback(() => {
    getSetFullRange();
  }, [getSetFullRange]);

  const { deadLine: ddl } = useUserOptions();
  const onAddMutation = useMutation({
    mutationFn: async () => {
      if (!account || !chainId || !position) {
        return;
      }

      if (!state.baseToken || !state.quoteToken) {
        return;
      }

      const deadline = Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60);

      const useNative = state.baseToken.isNative
        ? state.baseToken
        : state.quoteToken.isNative
          ? state.quoteToken
          : undefined;

      try {
        const { calldata, value } =
          NonfungiblePositionManager.addCallParameters(position, {
            slippageTolerance: toSlippagePercent(slipperValue * 100),
            recipient: account,
            deadline: deadline.toString(),
            useNative,
            createPool: noLiquidity,
          });
        let txn: { to: string; data: string; value: string } = {
          to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
          data: calldata,
          value,
        };

        const succ = await submission.execute(
          t`Pool Creation`,
          {
            opcode: OpCode.TX,
            ...txn,
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.createAMMV3Pool]: '1',
            },
          },
        );
        if (succ === ExecutionResult.Success) {
          setTimeout(() => {
            handleGoToPoolList();
          }, 100);
        }
      } catch (error) {
        console.error('onAddMutation', error);
      }
    },
  });

  return (
    <WidgetContainer sx={noHeader ? { padding: 0 } : {}}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {noHeader ? null : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 20,
              py: 24,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              component={ButtonBase}
              onClick={handleGoBack}
              sx={{
                flexGrow: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.text.primary,
                width: 24,
                height: 24,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M20 11.5H7.83L13.42 5.91L12 4.5L4 12.5L12 20.5L13.41 19.09L7.83 13.5H20V11.5Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                typography: 'caption',
                color: theme.palette.text.primary,
              }}
            >{t`Add liquidity`}</Box>
            <Box
              sx={{
                flexGrow: 0,
                flexShrink: 0,
                width: 24,
                height: 24,
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 20,
            p: 0,
          }}
        >
          {noHeader ? null : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 12,
              }}
            >
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'left',
                }}
              >
                {t`Select pair`}
              </Box>
              <TokenPairSelect
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                dispatch={dispatch}
              />
              <FeeSelector
                disabled={!state.baseToken || !state.quoteToken}
                feeAmount={state.feeAmount}
                dispatch={dispatch}
              />
            </Box>
          )}
          <DynamicSection disabled={!state.feeAmount || invalidPool}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'left',
                }}
              >
                {t`Set price range`}
              </Box>
              {Boolean(state.baseToken && state.quoteToken) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    [theme.breakpoints.up('tablet')]: {
                      ml: 'auto',
                      width: 'auto',
                    },
                  }}
                >
                  <Button
                    size={Button.Size.small}
                    variant={Button.Variant.outlined}
                    onClick={handleSetFullRange}
                    sx={{
                      py: 4,
                      px: 12,
                      height: 26,
                      typography: 'h6',
                      fontWeight: 600,
                      ...(isMobile
                        ? {
                            flexGrow: 0,
                            flexShrink: 1,
                            flexBasis: '50%',
                          }
                        : undefined),
                    }}
                  >{t`Full range`}</Button>
                  <RateToggle
                    baseToken={state.baseToken}
                    quoteToken={state.quoteToken}
                    handleRateToggle={() => {
                      if (
                        !ticksAtLimit[Bound.LOWER] &&
                        !ticksAtLimit[Bound.UPPER]
                      ) {
                        onLeftRangeInput(
                          (invertPrice
                            ? priceLower
                            : priceUpper?.invert()
                          )?.toSignificant(6) ?? '',
                        );
                        onRightRangeInput(
                          (invertPrice
                            ? priceUpper
                            : priceLower?.invert()
                          )?.toSignificant(6) ?? '',
                        );
                        onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '');
                      }
                      dispatch({
                        type: Types.ToggleRate,
                        payload: undefined,
                      });
                    }}
                    sx={
                      isMobile
                        ? {
                            flexGrow: 0,
                            flexShrink: 1,
                            flexBasis: '50%',
                          }
                        : undefined
                    }
                  />
                </Box>
              )}
            </Box>
            <RangeSelector
              priceLower={priceLower}
              priceUpper={priceUpper}
              getDecrementLower={getDecrementLower}
              getIncrementLower={getIncrementLower}
              getDecrementUpper={getDecrementUpper}
              getIncrementUpper={getIncrementUpper}
              onLeftRangeInput={onLeftRangeInput}
              onRightRangeInput={onRightRangeInput}
              currencyA={state.baseToken}
              currencyB={state.quoteToken}
              feeAmount={state.feeAmount}
              ticksAtLimit={ticksAtLimit}
            />
            {outOfRange && (
              <YellowCard>
                {t`Your position will not earn fees or be used in trades until the market price moves into your range.`}
              </YellowCard>
            )}
            {invalidRange && (
              <YellowCard>
                {t`Invalid range selected. The min price must be lower than the max price.`}
              </YellowCard>
            )}
          </DynamicSection>
          {noLiquidity ? (
            <DynamicSection>
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'left',
                }}
              >
                {t`Starting price`}
              </Box>
              <Box
                sx={{
                  p: 8,
                  borderRadius: 8,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  typography: 'h6',
                  color: theme.palette.primary.main,
                }}
              >
                {t`This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.`}
              </Box>
              <Box
                sx={{
                  px: 16,
                  py: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.palette.border.main,
                  borderStyle: 'solid',
                }}
              >
                <NumberInput
                  sx={{
                    backgroundColor: 'transparent',
                  }}
                  value={startPriceTypedValue}
                  onChange={onStartPriceInput}
                />
              </Box>
            </DynamicSection>
          ) : (
            <DynamicSection disabled={!state.feeAmount || invalidPool}>
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {t`Current price`}
                <Box>
                  {formattedPrice}&nbsp;{t`per`}&nbsp;
                  {state.baseToken?.symbol ?? ''}
                </Box>
              </Box>
              <LiquidityChartRangeInput
                currencyA={state.baseToken ?? undefined}
                currencyB={state.quoteToken ?? undefined}
                feeAmount={state.feeAmount}
                ticksAtLimit={ticksAtLimit}
                price={
                  price
                    ? parseFloat(
                        (invertPrice ? price.invert() : price).toSignificant(8),
                      )
                    : undefined
                }
                priceLower={priceLower}
                priceUpper={priceUpper}
                onLeftRangeInput={onLeftRangeInput}
                onRightRangeInput={onRightRangeInput}
                interactive={true}
              />
            </DynamicSection>
          )}
          <DynamicSection
            disabled={
              invalidPool ||
              invalidRange ||
              (noLiquidity && !startPriceTypedValue)
            }
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.primary,
                textAlign: 'left',
              }}
            >
              {t`Deposit amounts`}
            </Box>
            <Box>
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                maxAmount={maxAmounts[Field.CURRENCY_A]}
                balance={currencyBalances[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A] ?? null}
                locked={depositADisabled}
                onChangeNativeCurrenct={
                  noHeader
                    ? (payload) => {
                        dispatch({
                          type: Types.UpdateBaseToken,
                          payload,
                        });
                      }
                    : undefined
                }
              />
              <CardPlusConnected />
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                maxAmount={maxAmounts[Field.CURRENCY_B]}
                balance={currencyBalances[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B] ?? null}
                locked={depositBDisabled}
                onChangeNativeCurrenct={
                  noHeader
                    ? (payload) => {
                        dispatch({
                          type: Types.UpdateQuoteToken,
                          payload,
                        });
                      }
                    : undefined
                }
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 8,
                px: 12,
                height: 36,
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: theme.palette.border.main,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                <Trans>Slippage Tolerance</Trans>
              </Box>
              <SlippageSetting
                value={slipper}
                onChange={setSlipper}
                disabled={false}
                type="AMMV3"
                sx={{
                  mt: 0,
                }}
              />
            </Box>
          </DynamicSection>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 20,
            py: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Buttons
            chainId={chainId}
            approvalA={approvalA}
            approvalB={approvalB}
            parsedAmounts={parsedAmounts}
            isValid={isValid}
            depositADisabled={depositADisabled}
            depositBDisabled={depositBDisabled}
            errorMessage={errorMessage}
            setShowConfirm={setShowConfirm}
          />
        </Box>

        <ReviewModal
          parsedAmounts={parsedAmounts}
          position={position}
          existingPosition={undefined}
          priceLower={priceLower}
          priceUpper={priceUpper}
          outOfRange={outOfRange}
          ticksAtLimit={ticksAtLimit}
          on={showConfirm}
          onClose={() => {
            setShowConfirm(false);
          }}
          onConfirm={onAddMutation.mutate}
          loading={onAddMutation.isPending}
        />
      </Box>
    </WidgetContainer>
  );
}

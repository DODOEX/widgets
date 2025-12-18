import { alpha, Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import SquaredGoBack from '../../../components/SquaredGoBack';
import { CardPlus } from '../../../components/Swap/components/TokenCard';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { tokenApi } from '../../../constants/api';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { PoolTypeTag } from '../PoolList/components/tags';
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
import { RangeSetList } from './components/RangeSetList';
import { step } from '@reown/appkit/networks';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { PoolState } from './hooks/usePools';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { formatReadableNumber } from '../../../utils';
import { BIPS_BASE } from './constants/misc';
import { formatTickPrice } from './utils/formatTickPrice';

export default function AddLiquidityV3({
  params,
  handleGoBack,
  handleGoToPoolList,
}: {
  params?: {
    from?: string;
    to?: string;
    fee?: string;
  };
  handleGoBack: () => void;
  handleGoToPoolList: () => void;
}) {
  const { account, onlyChainId, defaultChainId } = useWalletInfo();
  const chainId = onlyChainId ?? defaultChainId;
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
    step: 1,
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
    invalidPrice,
    poolState,
  } = useV3DerivedMintInfo({ state, chainId });

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

  const handleSetFullRange = useCallback(
    (part: number) => {
      if (part !== 1) {
        if (formattedPrice) {
          const currentPrice = new BigNumber(formattedPrice);
          const minPrice = currentPrice.multipliedBy(1 - part);
          const maxPrice = currentPrice.multipliedBy(1 + part);
          onLeftRangeInput(minPrice.dp(5, BigNumber.ROUND_DOWN).toString());
          onRightRangeInput(maxPrice.dp(5, BigNumber.ROUND_DOWN).toString());
        }

        return;
      }

      getSetFullRange();
    },
    [formattedPrice, getSetFullRange, onLeftRangeInput, onRightRangeInput],
  );

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

  const step = state.step || 1;
  const stepMobileScrollRef = React.useRef<HTMLDivElement>(null);
  const handleChangeStep = (step: number) => {
    dispatch({
      type: Types.UpdateStep,
      payload: step,
    });
    stepMobileScrollRef.current
      ?.querySelector(`[data-id="step-box-${step}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        [theme.breakpoints.up('tablet')]: {
          mx: 'auto',
          width: 'max-content',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          mx: 16,
          pb: 20,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'border.main',
          mb: 20,
          [theme.breakpoints.up('tablet')]: {
            mx: 0,
          },
        }}
      >
        <SquaredGoBack />

        <Box
          sx={{
            typography: 'caption',
            fontWeight: 600,
            color: 'text.primary',
            mr: 'auto',
          }}
        >
          <Trans>Add liquidity</Trans>
        </Box>

        <PoolTypeTag poolType="AMM V3" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.down('tablet')]: {
            flex: 1,
          },
          [theme.breakpoints.up('tablet')]: {
            gap: 12,
            mx: 'auto',
            flexDirection: 'row',
            width: 'max-content',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 20,
            py: 16,
            pr: 16,
            backgroundColor: theme.palette.background.paperContrast,
            borderRadius: theme.spacing(20, 20, 0, 0),
            height: 'max-content',
            [theme.breakpoints.down('tablet')]: {
              overflowX: 'auto',
              maxWidth: '100vw',
            },
            [theme.breakpoints.up('tablet')]: {
              p: 28,
              backgroundColor: theme.palette.background.paper,
              flexDirection: 'column',
              borderRadius: 20,
            },
          }}
          ref={stepMobileScrollRef}
        >
          <StepBox
            activeIndex={step}
            index={1}
            description={<Trans>Select token and fee tier</Trans>}
            hasNext
          />
          <StepBox
            activeIndex={step}
            index={2}
            description={<Trans>Select price range</Trans>}
            hasNext
          />
          <StepBox
            activeIndex={step}
            index={3}
            description={<Trans>Enter deposit amount</Trans>}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            [theme.breakpoints.down('tablet')]: {
              flex: 1,
            },
            [theme.breakpoints.up('tablet')]: {
              width: 'max-content',
            },
          }}
        >
          {!isMobile && (
            <>
              {step > 1 &&
                !!(state.baseToken && state.quoteToken && state.feeAmount) && (
                  <EditStep onEdit={() => handleChangeStep(1)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TokenLogoPair
                        tokens={[state.baseToken, state.quoteToken]}
                        width={24}
                        height={24}
                      />
                      <Box
                        sx={{ typography: 'h5' }}
                      >{`${state.baseToken.symbol}/${state.quoteToken.symbol}`}</Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          px: 8,
                          height: 24,
                          backgroundColor: theme.palette.background.tag,
                          color: 'text.secondary',
                          borderRadius: 4,
                          typography: 'h6',
                        }}
                      >
                        {formatReadableNumber({
                          input: new BigNumber(state.feeAmount?.toString()).div(
                            BIPS_BASE,
                          ),
                        })}
                        %
                      </Box>
                    </Box>
                  </EditStep>
                )}

              {step > 2 &&
                priceLower !== undefined &&
                priceUpper !== undefined && (
                  <EditStep onEdit={() => handleChangeStep(2)}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        typography: 'h5',
                      }}
                    >
                      <Box sx={{ color: 'text.secondary' }}>
                        <Trans>Price Range</Trans>
                      </Box>
                      {`${formatTickPrice({
                        price: priceLower,
                        atLimit: ticksAtLimit,
                        direction: Bound.LOWER,
                      })} - ${formatTickPrice({
                        price: priceUpper,
                        atLimit: ticksAtLimit,
                        direction: Bound.UPPER,
                      })} ${state.baseToken?.symbol}/${state.quoteToken?.symbol}`}
                    </Box>
                  </EditStep>
                )}
            </>
          )}

          <Box
            sx={{
              px: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              backgroundColor: theme.palette.background.paper,
              [theme.breakpoints.down('tablet')]: {
                flex: 1,
                justifyContent: 'space-between',
              },
              [theme.breakpoints.up('tablet')]: {
                px: 0,
                width: 600,
                borderRadius: 16,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 20,
                py: 20,
                [theme.breakpoints.down('tablet')]: {
                  flex: 1,
                },
                [theme.breakpoints.up('tablet')]: {
                  px: 20,
                },
              }}
            >
              {step === 1 && (
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
                    <Box
                      sx={{
                        mt: 8,
                        typography: 'body2',
                        color: theme.palette.text.secondary,
                      }}
                    >{t`Select the token you want to create a liquidity pool for.`}</Box>
                  </Box>
                  <TokenPairSelect
                    chainId={chainId}
                    baseToken={state.baseToken}
                    quoteToken={state.quoteToken}
                    dispatch={dispatch}
                  />
                  <Box
                    sx={{
                      mt: 8,
                      typography: 'body1',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      textAlign: 'left',
                    }}
                  >
                    {t`Fee tier`}
                    <Box
                      sx={{
                        mt: 8,
                        typography: 'body2',
                        color: theme.palette.text.secondary,
                      }}
                    >{t`The % you will earn in fees.`}</Box>
                  </Box>
                  <FeeSelector
                    disabled={!state.baseToken || !state.quoteToken}
                    feeAmount={state.feeAmount}
                    dispatch={dispatch}
                  />
                </Box>
              )}

              {step === 2 && (
                <>
                  <DynamicSection disabled={!state.feeAmount || invalidPool}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
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
                              onFieldAInput(
                                formattedAmounts[Field.CURRENCY_B] ?? '',
                              );
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
                      )}
                    </Box>

                    <RangeSetList onSelect={handleSetFullRange} />

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
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1,
                          ),
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
                        }}
                      >
                        {t`Current price`}
                        <Box>
                          {formattedPrice}&nbsp;{t`per`}&nbsp;
                          {state.baseToken?.symbol ?? ''}
                        </Box>
                      </Box>
                      <LiquidityChartRangeInput
                        chainId={chainId}
                        currencyA={state.baseToken ?? undefined}
                        currencyB={state.quoteToken ?? undefined}
                        feeAmount={state.feeAmount}
                        ticksAtLimit={ticksAtLimit}
                        price={
                          price
                            ? parseFloat(
                                (invertPrice
                                  ? price.invert()
                                  : price
                                ).toSignificant(8),
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
                </>
              )}

              {step === 3 && (
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
                    />
                    <CardPlus />
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.CURRENCY_B]}
                      onUserInput={onFieldBInput}
                      maxAmount={maxAmounts[Field.CURRENCY_B]}
                      balance={currencyBalances[Field.CURRENCY_B]}
                      currency={currencies[Field.CURRENCY_B] ?? null}
                      locked={depositBDisabled}
                    />
                  </Box>
                  <SlippageSetting
                    value={slipper}
                    onChange={setSlipper}
                    disabled={false}
                    type="AMMV3"
                  />
                </DynamicSection>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                py: 16,
                backgroundColor: theme.palette.background.paper,
                [theme.breakpoints.down('tablet')]: {
                  position: 'sticky',
                  bottom: 0,
                },
                [theme.breakpoints.up('tablet')]: {
                  px: 20,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  borderTop: `solid 1px ${theme.palette.border.main}`,
                },
              }}
            >
              {isMobile && step !== 1 && (
                <Button
                  fullWidth
                  variant={Button.Variant.outlined}
                  size={Button.Size.big}
                  onClick={() => {
                    handleChangeStep(step - 1);
                  }}
                >{t`Back`}</Button>
              )}
              {step === 1 ? (
                <NextButton
                  chainId={chainId}
                  disabled={invalidRange}
                  errorMessage={
                    poolState === PoolState.INVALID
                      ? t`Invalid pair`
                      : undefined
                  }
                  onClick={() => handleChangeStep(2)}
                />
              ) : step === 2 ? (
                <NextButton
                  chainId={chainId}
                  disabled={
                    invalidRange ||
                    !price ||
                    tickLower === undefined ||
                    tickUpper === undefined
                  }
                  errorMessage={
                    invalidPrice ? t`Invalid price range` : undefined
                  }
                  onClick={() => handleChangeStep(3)}
                />
              ) : (
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
              )}
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
        </Box>
      </Box>
    </Box>
  );
}

function StepBox({
  activeIndex,
  index,
  description,
  hasNext,
}: {
  activeIndex: number;
  index: number;
  description: React.ReactNode;
  hasNext?: boolean;
}) {
  const done = activeIndex > index;
  const active = activeIndex === index;
  const disabled = activeIndex < index;
  const theme = useTheme();
  let backgroundColor: string | undefined = theme.palette.tabActive.main;
  let color = theme.palette.tabActive.contrastText;
  let border: string | undefined = undefined;
  if (active) {
    backgroundColor = theme.palette.primary.main;
    color = theme.palette.primary.contrastText;
  } else if (disabled) {
    backgroundColor = undefined;
    color = theme.palette.text.disabled;
    border = `1px solid ${theme.palette.border.main}`;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          [theme.breakpoints.down('tablet')]: {
            pl: 16,
          },
        }}
        data-id={`step-box-${index}`}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor,
            color,
            border,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {done ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.1401 5.33301L8.88897 15.5841L4.86008 11.5708L2.66675 13.7641L8.88897 19.9863L21.3334 7.5419L19.1401 5.33301Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            index
          )}
        </Box>
        <Box
          sx={{
            color: disabled
              ? theme.palette.text.disabled
              : theme.palette.text.primary,
          }}
        >
          <Box sx={{ typography: 'h5' }}>
            <Trans>Step {index}</Trans>
          </Box>
          <Box
            sx={{
              mt: 4,
              typography: 'body2',
              whiteSpace: 'nowrap',
              color: disabled ? 'text.disabled' : 'primary.main',
            }}
          >
            {description}
          </Box>
        </Box>
      </Box>
      {hasNext && (
        <Box
          sx={{
            ml: 23.5,
            width: '1px',
            height: 40,
            backgroundColor: !done ? theme.palette.border.main : 'primary.main',
            [theme.breakpoints.down('tablet')]: {
              display: 'none',
            },
          }}
        />
      )}
    </>
  );
}

function NextButton({
  chainId,
  onClick,
  disabled,
  danger,
  errorMessage,
}: {
  chainId: number | undefined;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  errorMessage?: React.ReactNode;
}) {
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        size={Button.Size.big}
        onClick={onClick}
        disabled={disabled || !!errorMessage}
        danger={danger}
      >
        {errorMessage ?? t`Next`}
      </Button>
    </NeedConnectButton>
  );
}

function EditStep({
  onEdit,
  children,
}: React.PropsWithChildren<{
  onEdit: () => void;
}>) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 28,
        py: 20,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 20,
      }}
    >
      {children}
      <ButtonBase
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: `1px solid ${theme.palette.border.main}`,
          borderRadius: 8,
          px: 8,
          py: 4,
          typography: 'body2',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
        onClick={onEdit}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8 4L18.5 9.7L10.8 17.4H5.1V11.7L12.8 4ZM7 12.4V15.4H10L15.5 9.7L12.8 6.9L7 12.4ZM5 18.4H8V20.4H5V18.4ZM9 18.4H13V20.4H9V18.4ZM14 18.4H19V20.4H14V18.4Z"
            fill="currentColor"
          />
        </svg>
        <Trans>Edit</Trans>
      </ButtonBase>
    </Box>
  );
}

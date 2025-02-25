import { CLMM } from '@dodoex/api';
import { alpha, Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { formatTokenAmountNumber } from '../../../utils';
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
import { useTokenInfo } from './hooks/useTokenInfo';
import { useV3DerivedMintInfo } from './hooks/useV3DerivedMintInfo';
import { useV3MintActionHandlers } from './hooks/useV3MintActionHandlers';
import { reducer, Types } from './reducer';
import { Bound, Field } from './types';
import { maxAmountSpend } from './utils/maxAmountSpend';

export default function AddLiquidityV3({
  params,
  handleGoBack,
  handleGoToPoolList,
}: {
  params?: {
    mint1?: string;
    mint2?: string;
    fee?: string;
  };
  handleGoBack: () => void;
  handleGoToPoolList: () => void;
}) {
  const { chainId, account } = useWalletInfo();
  const theme = useTheme();
  const submission = useSubmission();
  const { isMobile } = useWidgetDevice();

  const defaultMint1 = useTokenInfo({
    mint: params?.mint1,
    chainId,
  });
  const defaultMint2 = useTokenInfo({
    mint: params?.mint2,
    chainId,
  });

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    mint1: null,
    mint2: null,
    feeAmount: params?.fee ? Number(params?.fee) : undefined,
    independentField: Field.MINT_1,
    typedValue: '',
    startPriceTypedValue: '',
    leftRangeTypedValue: '',
    rightRangeTypedValue: '',
  });

  useEffect(() => {
    if (!defaultMint1) {
      return;
    }
    dispatch({
      type: Types.UpdateDefaultMint1,
      payload: defaultMint1,
    });
  }, [defaultMint1]);
  useEffect(() => {
    if (!defaultMint2) {
      return;
    }
    dispatch({
      type: Types.UpdateDefaultMint2,
      payload: defaultMint2,
    });
  }, [defaultMint2]);

  const { independentField, typedValue, startPriceTypedValue } = state;

  const {
    poolInfo,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    mintBalances,
    position,
    noLiquidity,
    mints,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo({ state });

  const {
    onField1Input,
    onField2Input,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers({ dispatch });

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: CLMM,
  });

  const isValid = !errorMessage && !invalidRange;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toString() ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: BigNumber } = [
    Field.MINT_1,
    Field.MINT_2,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(mintBalances[field]),
    };
  }, {});

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
    poolInfo,
    state,
    dispatch,
  });

  const handleSetFullRange = useCallback(() => {
    getSetFullRange();

    const minPrice = pricesAtLimit[Bound.LOWER];
    if (minPrice) {
      onLeftRangeInput(minPrice.dp(5).toString());
    }
    const maxPrice = pricesAtLimit[Bound.UPPER];
    if (maxPrice) {
      onRightRangeInput(maxPrice.dp(5).toString());
    }
  }, [getSetFullRange, onLeftRangeInput, onRightRangeInput, pricesAtLimit]);

  const onAddMutation = useMutation({
    mutationFn: async () => {
      if (!account || !chainId) {
        return;
      }

      // if (!state.baseToken || !state.quoteToken) {
      //   return;
      // }

      // const deadline = Math.ceil(Date.now() / 1000) + 10 * 60;

      // const useNative = state.baseToken.isNative
      //   ? state.baseToken
      //   : state.quoteToken.isNative
      //     ? state.quoteToken
      //     : undefined;

      try {
        // const { calldata, value } =
        //   NonfungiblePositionManager.addCallParameters(position, {
        //     slippageTolerance: toSlippagePercent(slipperValue * 100),
        //     recipient: account,
        //     deadline: deadline.toString(),
        //     useNative,
        //     createPool: noLiquidity,
        //   });
        // let txn: { to: string; data: string; value: string } = {
        //   to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        //   data: calldata,
        //   value,
        // };
        // const succ = await submission.executeCustom(
        //   t`Pool Creation`,
        //   {
        //     opcode: OpCode.TX,
        //     ...txn,
        //   },
        //   {
        //     early: false,
        //     metadata: {
        //       [MetadataFlag.createAMMV3Pool]: '1',
        //     },
        //   },
        // );
        // if (succ === ExecutionResult.Success) {
        //   setTimeout(() => {
        //     handleGoToPoolList();
        //   }, 100);
        // }
      } catch (error) {
        console.error('onAddMutation', error);
      }
    },
  });

  return (
    <WidgetContainer>
      <Box
        sx={{
          mx: 'auto',
          borderRadius: isMobile ? 0 : 16,
          backgroundColor: 'background.paper',
          width: isMobile ? '100%' : 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 20,
            p: 20,
          }}
        >
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
              mint1={state.mint1}
              mint2={state.mint2}
              dispatch={dispatch}
            />
            <FeeSelector
              disabled={!state.mint1 || !state.mint2}
              feeAmount={state.feeAmount}
              dispatch={dispatch}
            />
          </Box>
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
              {Boolean(state.mint1 && state.mint2) && (
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
                    mint1={state.mint1}
                    mint2={state.mint2}
                    handleRateToggle={() => {
                      if (
                        !ticksAtLimit[Bound.LOWER] &&
                        !ticksAtLimit[Bound.UPPER]
                      ) {
                        onLeftRangeInput(priceLower?.dp(6).toString() ?? '');
                        onRightRangeInput(priceUpper?.dp(6).toString() ?? '');
                        onField1Input(formattedAmounts[Field.MINT_2] ?? '');
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
              mint1={state.mint1}
              mint2={state.mint2}
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
                }}
              >
                {t`Current price`}
                <Box>
                  {formatTokenAmountNumber({
                    input: price?.toString(),
                    decimals: 9,
                  })}
                  &nbsp;{t`per`}&nbsp;
                  {state.mint1?.symbol ?? ''}
                </Box>
              </Box>
              <LiquidityChartRangeInput
                mint1={state.mint1}
                mint2={state.mint2}
                feeAmount={state.feeAmount}
                ticksAtLimit={ticksAtLimit}
                price={price ? price.toNumber() : undefined}
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
                value={formattedAmounts[Field.MINT_1]}
                onUserInput={onField1Input}
                maxAmount={maxAmounts[Field.MINT_1]}
                balance={mintBalances[Field.MINT_1]}
                mint={mints[Field.MINT_1] ?? null}
                locked={depositADisabled}
              />
              <CardPlusConnected />
              <CurrencyInputPanel
                value={formattedAmounts[Field.MINT_2]}
                onUserInput={onField2Input}
                maxAmount={maxAmounts[Field.MINT_2]}
                balance={mintBalances[Field.MINT_2]}
                mint={mints[Field.MINT_2] ?? null}
                locked={depositBDisabled}
              />
            </Box>
            <SlippageSetting
              value={slipper}
              onChange={setSlipper}
              disabled={false}
              type={CLMM}
            />
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
            parsedAmounts={parsedAmounts}
            isValid={isValid}
            errorMessage={errorMessage}
            setShowConfirm={setShowConfirm}
          />
        </Box>

        <ReviewModal
          position={position}
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

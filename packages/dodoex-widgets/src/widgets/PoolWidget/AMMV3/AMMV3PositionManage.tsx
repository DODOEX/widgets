import {
  Box,
  ButtonBase,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo, useReducer, useState } from 'react';
import Dialog from '../../../components/Dialog';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import TokenLogo from '../../../components/TokenLogo';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { formatTokenAmountNumber } from '../../../utils';
import { SliderPercentageCard } from '../PoolOperate/components/SliderPercentageCard';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { initSliderPercentage } from '../PoolOperate/hooks/usePercentageRemove';
import { Buttons } from './components/Buttons';
import { ClaimButton } from './components/ClaimButton';
import { CurrencyInputPanel } from './components/CurrencyInputPanel';
import { PositionAmountPreview } from './components/PositionAmountPreview';
import { PositionSelectedRangePreview } from './components/PositionSelectedRangePreview';
import { RemoveButton } from './components/RemoveButton';
import { ReviewModal } from './components/ReviewModal';
import { useDerivedPositionInfo } from './hooks/useDerivedPositionInfo';
import { useDerivedV3BurnInfo } from './hooks/useDerivedV3BurnInfo';
import { useV3DerivedMintInfo } from './hooks/useV3DerivedMintInfo';
import { useV3MintActionHandlers } from './hooks/useV3MintActionHandlers';
import { useV3PositionFees } from './hooks/useV3PositionFees';
import { useV3PositionFromTokenId } from './hooks/useV3Positions';
import { reducer, Types } from './reducer';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
} from './sdks/sdk-core';
import { FeeAmount, NonfungiblePositionManager } from './sdks/v3-sdk';
import { Bound, Field, OperateType } from './types';
import { buildCurrency, convertBackToTokenInfo } from './utils';
import { maxAmountSpend } from './utils/maxAmountSpend';
import { toSlippagePercent } from './utils/slippage';
import { basicTokenMap, CONTRACT_QUERY_KEY } from '@dodoex/api';
import { useUserOptions } from '../../../components/UserOptionsProvider';

const RewardItem = ({
  token,
  amount,
}: {
  token: Currency | undefined;
  amount: CurrencyAmount<Currency> | undefined;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        typography: 'h5',
        color: theme.palette.text.primary,
      }}
    >
      <TokenLogo
        address={token?.address ?? ''}
        chainId={token?.chainId}
        noShowChain
        width={24}
        height={24}
        marginRight={0}
      />
      <Box>{token?.symbol}</Box>
      <Box
        sx={{
          ml: 'auto',
        }}
      >
        {formatTokenAmountNumber({
          input: amount?.toSignificant(),
          decimals: token?.decimals,
        })}
      </Box>
    </Box>
  );
};

export interface AMMV3PositionManageProps {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  feeAmount: FeeAmount;
  tokenId: string;
  onClose: (() => void) | undefined;
  noHeader?: boolean;
}

export const AMMV3PositionManage = ({
  chainId,
  baseToken,
  quoteToken,
  feeAmount,
  tokenId,
  onClose,
  noHeader,
}: AMMV3PositionManageProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const submission = useSubmission();
  const queryClient = useQueryClient();

  const { account } = useWalletInfo();

  const { position: existingPositionDetails, loading: positionLoading } =
    useV3PositionFromTokenId(tokenId, chainId);
  const hasExistingPosition = !!existingPositionDetails && !positionLoading;
  const { position: existingPosition } = useDerivedPositionInfo(
    existingPositionDetails,
    baseToken,
    quoteToken,
  );

  const [operateType, setOperateType] = useState<OperateType>('stake');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [sliderPercentage, setSliderPercentage] =
    useState(initSliderPercentage);

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    baseToken: buildCurrency(baseToken),
    quoteToken: buildCurrency(quoteToken),
    feeAmount,
    independentField: Field.CURRENCY_A,
    typedValue: '',
    startPriceTypedValue: '',
    leftRangeTypedValue: '',
    rightRangeTypedValue: '',
  });

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
  } = useV3DerivedMintInfo({ state, existingPosition });

  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0: feeValue0Remove,
    feeValue1: feeValue1Remove,
    error,
  } = useDerivedV3BurnInfo({
    position: existingPositionDetails,
    asWETH: undefined,
    percent: sliderPercentage,
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
  });
  const removed = existingPositionDetails?.liquidity === '0';
  const basicToken = basicTokenMap[chainId]
    ? {
        ...basicTokenMap[chainId],
        chainId,
      }
    : undefined;
  const wrappedAddressLow = basicToken?.wrappedTokenAddress.toLowerCase();
  const canReceiveNativeToken0 =
    liquidityValue0?.currency.isNative ||
    liquidityValue0?.currency.address.toLowerCase() === wrappedAddressLow;
  const canReceiveNativeToken1 =
    liquidityValue1?.currency.isNative ||
    liquidityValue1?.currency.address.toLowerCase() === wrappedAddressLow;
  const canReceiveNativeToken =
    canReceiveNativeToken0 || canReceiveNativeToken1;
  const [receiveNative, setReceiveNative] = useState(true);

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees({
    pool: pool ?? undefined,
    tokenId,
    asWETH: false,
    chainId,
  });
  const inverted = false;
  const feeValueUpper = inverted ? feeValue0 : feeValue1;
  const feeValueLower = inverted ? feeValue1 : feeValue0;

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

  // get formatted amounts
  const formattedAmounts = useMemo(() => {
    return {
      [independentField]: typedValue,
      [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    };
  }, [dependentField, independentField, parsedAmounts, typedValue]);

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } =
    useMemo(() => {
      return [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
          return {
            ...accumulator,
            [field]: maxAmountSpend(currencyBalances[field]),
          };
        },
        {},
      );
    }, [currencyBalances]);

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

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    pricesAtTicks;

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
            tokenId,
            slippageTolerance: toSlippagePercent(slipperValue * 100),
            deadline: deadline.toString(),
            useNative,
          });
        let txn: { to: string; data: string; value: string } = {
          to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
          data: calldata,
          value,
        };

        const succ = await submission.execute(
          t`Add Liquidity`,
          {
            opcode: OpCode.TX,
            ...txn,
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.addAMMV3Pool]: '1',
            },
          },
        );
        if (succ === ExecutionResult.Success) {
          setShowConfirm(false);
          setTimeout(() => {
            onClose?.();
          }, 100);
        }
        queryClient.invalidateQueries({
          queryKey: [CONTRACT_QUERY_KEY, 'ammv3'],
          refetchType: 'all',
        });
      } catch (error) {
        console.error('onAddMutation', error);
      }
    },
  });

  const onRemoveMutation = useMutation({
    mutationFn: async () => {
      if (
        !account ||
        !chainId ||
        !positionSDK ||
        !liquidityPercentage ||
        !liquidityValue0 ||
        !liquidityValue1
      ) {
        return;
      }

      const deadline = Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60);

      try {
        let expectedCurrencyOwed0 =
          feeValue0Remove ??
          CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0);
        let expectedCurrencyOwed1 =
          feeValue1Remove ??
          CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0);
        if (receiveNative && basicToken) {
          if (canReceiveNativeToken0) {
            expectedCurrencyOwed0 = CurrencyAmount.fromRawAmount(
              buildCurrency(basicToken)!,
              0,
            );
          } else if (canReceiveNativeToken1) {
            expectedCurrencyOwed1 = CurrencyAmount.fromRawAmount(
              buildCurrency(basicToken)!,
              0,
            );
          }
        }

        const { calldata, value } =
          NonfungiblePositionManager.removeCallParameters(positionSDK, {
            tokenId: tokenId.toString(),
            liquidityPercentage,
            slippageTolerance: toSlippagePercent(slipperValue * 100),
            deadline: deadline.toString(),
            collectOptions: {
              expectedCurrencyOwed0,
              expectedCurrencyOwed1,
              recipient: account,
            },
          });
        let txn: { to: string; data: string; value: string } = {
          to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
          data: calldata,
          value,
        };

        const succ = await submission.execute(
          t`Remove Liquidity`,
          {
            opcode: OpCode.TX,
            ...txn,
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.removeAMMV3Pool]: '1',
            },
          },
        );
        if (succ === ExecutionResult.Success) {
          setTimeout(() => {
            onClose?.();
          }, 100);
        }
        queryClient.invalidateQueries({
          queryKey: [CONTRACT_QUERY_KEY, 'ammv3'],
          refetchType: 'all',
        });
      } catch (error) {
        console.error('onRemoveMutation', error);
      }
    },
  });

  const onClaimMutation = useMutation({
    mutationFn: async () => {
      if (!account || !chainId || !pool) {
        return;
      }

      try {
        const { calldata, value } =
          NonfungiblePositionManager.collectCallParameters({
            tokenId: tokenId.toString(),
            expectedCurrencyOwed0:
              feeValue0 ?? CurrencyAmount.fromRawAmount(pool.token0, 0),
            expectedCurrencyOwed1:
              feeValue1 ?? CurrencyAmount.fromRawAmount(pool.token1, 0),
            recipient: account,
          });
        let txn: { to: string; data: string; value: string } = {
          to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
          data: calldata,
          value,
        };

        const succ = await submission.execute(
          t`Claim Rewards`,
          {
            opcode: OpCode.TX,
            ...txn,
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.claimAMMV3Pool]: '1',
            },
          },
        );
        if (succ === ExecutionResult.Success) {
          setTimeout(() => {
            onClose?.();
          }, 100);
        }
        queryClient.invalidateQueries({
          queryKey: [CONTRACT_QUERY_KEY, 'ammv3'],
          refetchType: 'all',
        });
      } catch (error) {
        console.error('onClaimMutation', error);
      }
    },
  });

  const content = useMemo(() => {
    const operateTypes = [
      { key: 'stake', value: t`Add` },
      { key: 'unstake', value: t`Remove` },
      { key: 'claim', value: t`Claim` },
    ];
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {!noHeader && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 10,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {t`Add liquidity`}
            </Box>

            {onClose ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  borderWidth: 1,
                  color: 'text.secondary',
                  cursor: 'pointer',
                }}
              >
                <Box
                  component={Error}
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                  onClick={() => {
                    onClose();
                  }}
                />
              </Box>
            ) : undefined}
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {hasExistingPosition && existingPosition && (
            <Box sx={{ mx: 10, mb: 16 }}>
              <PositionAmountPreview
                position={existingPosition}
                inRange={!outOfRange}
              />
            </Box>
          )}

          <Tabs
            value={operateType}
            onChange={(_, value) => {
              setOperateType(value as OperateType);
            }}
          >
            <TabsButtonGroup
              tabs={operateTypes}
              variant="inPaper"
              tabsListSx={{
                mx: 10,
              }}
            />
            <TabPanel value="stake">
              {hasExistingPosition && existingPosition && (
                <Box sx={{ mt: 16, mx: 10 }}>
                  <PositionSelectedRangePreview
                    position={existingPosition}
                    title={t`Selected Range`}
                    ticksAtLimit={ticksAtLimit}
                  />
                </Box>
              )}

              <Box
                sx={{
                  mt: 16,
                  mx: 10,
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
                    color: theme.palette.text.secondary,
                    textAlign: 'left',
                  }}
                >
                  {t`Add more liquidity`}
                </Box>
                <Box>
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onFieldAInput}
                    maxAmount={maxAmounts[Field.CURRENCY_A]}
                    balance={currencyBalances[Field.CURRENCY_A]}
                    currency={currencies[Field.CURRENCY_A] ?? null}
                    locked={depositADisabled}
                    onChangeNativeCurrenct={(payload) => {
                      dispatch({
                        type: Types.UpdateBaseToken,
                        payload,
                      });
                    }}
                  />
                  <CardPlusConnected />
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onUserInput={onFieldBInput}
                    maxAmount={maxAmounts[Field.CURRENCY_B]}
                    balance={currencyBalances[Field.CURRENCY_B]}
                    currency={currencies[Field.CURRENCY_B] ?? null}
                    locked={depositBDisabled}
                    onChangeNativeCurrenct={(payload) => {
                      dispatch({
                        type: Types.UpdateQuoteToken,
                        payload,
                      });
                    }}
                  />
                </Box>
                <SlippageSetting
                  value={slipper}
                  onChange={setSlipper}
                  disabled={false}
                  type="AMMV3"
                />
              </Box>

              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  px: 10,
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
            </TabPanel>
            <TabPanel value="unstake">
              <Box
                sx={{
                  mt: 16,
                  mx: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 12,
                }}
              >
                <SliderPercentageCard
                  disabled={false}
                  value={sliderPercentage}
                  onChange={(v) => setSliderPercentage(v)}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 8,
                  }}
                >
                  {canReceiveNativeToken && (
                    <ButtonBase
                      sx={{
                        px: 12,
                        py: 4,
                        borderRadius: 20,
                        border: `solid 1px ${theme.palette.border.main}`,
                        typography: 'body2',
                        color: theme.palette.primary.main,
                      }}
                      onClick={() => setReceiveNative((prev) => !prev)}
                    >
                      <Trans>
                        Receive{' '}
                        {!receiveNative
                          ? basicToken?.symbol
                          : basicToken?.wrappedTokenSymbol}
                      </Trans>
                    </ButtonBase>
                  )}
                  <SlippageSetting
                    value={slipper}
                    onChange={setSlipper}
                    disabled={false}
                    type="AMMV3"
                    sx={
                      canReceiveNativeToken
                        ? {
                            m: 0,
                            px: 12,
                            py: 4,
                            borderRadius: 20,
                            backgroundColor:
                              theme.palette.background.paperDarkContrast,
                          }
                        : undefined
                    }
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 16,
                  mx: 10,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Receive
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      {liquidityValue0
                        ? formatTokenAmountNumber({
                            input: liquidityValue0.toExact(),
                            decimals: liquidityValue0.currency.decimals,
                          })
                        : '-'}
                    </Box>
                    &nbsp;
                    {canReceiveNativeToken0 && receiveNative
                      ? basicToken?.symbol
                      : liquidityValue0?.currency?.symbol}
                  </Box>
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      {liquidityValue1
                        ? formatTokenAmountNumber({
                            input: liquidityValue1.toExact(),
                            decimals: liquidityValue1.currency.decimals,
                          })
                        : '-'}
                    </Box>
                    &nbsp;
                    {canReceiveNativeToken1 && receiveNative
                      ? basicToken?.symbol
                      : liquidityValue1?.currency?.symbol}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  mt: 20,
                  display: 'flex',
                  alignItems: 'center',
                  px: 10,
                  py: 16,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <RemoveButton
                  chainId={chainId}
                  disabled={
                    removed || sliderPercentage === 0 || !liquidityValue0
                  }
                  removed={removed}
                  error={error}
                  onConfirm={onRemoveMutation.mutate}
                  isLoading={onRemoveMutation.isPending}
                />
              </Box>
            </TabPanel>
            <TabPanel value="claim">
              <Box
                sx={{
                  mx: 10,
                  mt: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: theme.palette.border.main,
                }}
              >
                <Box
                  sx={{
                    py: 12,
                    px: 10,
                    typography: 'body1',
                    color: theme.palette.text.primary,
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                    borderBottomColor: theme.palette.border.main,
                  }}
                >
                  {t`Claim fees`}
                </Box>
                <Box
                  sx={{
                    p: 20,
                  }}
                >
                  <RewardItem
                    token={feeValueUpper?.currency}
                    amount={feeValueUpper}
                  />
                  <RewardItem
                    token={feeValueLower?.currency}
                    amount={feeValueLower}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  mx: 10,
                  mt: 16,
                  typography: 'h6',
                  color: theme.palette.text.secondary,
                }}
              >
                {t`*Collecting fees will withdraw currently available fees for you.`}
              </Box>
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  mt: 20,
                  display: 'flex',
                  alignItems: 'center',
                  px: 10,
                  py: 16,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <ClaimButton
                  chainId={chainId}
                  disabled={onClaimMutation.isPending}
                  onConfirm={onClaimMutation.mutate}
                  isLoading={onClaimMutation.isPending}
                />
              </Box>
            </TabPanel>
          </Tabs>
        </Box>
      </Box>
    );
  }, [
    approvalA,
    approvalB,
    chainId,
    currencies,
    currencyBalances,
    depositADisabled,
    depositBDisabled,
    error,
    errorMessage,
    existingPosition,
    feeValueLower,
    feeValueUpper,
    formattedAmounts,
    hasExistingPosition,
    isValid,
    liquidityValue0,
    liquidityValue1,
    maxAmounts,
    onAddMutation.isPending,
    onAddMutation.mutate,
    onClaimMutation.isPending,
    onClaimMutation.mutate,
    onClose,
    onFieldAInput,
    onFieldBInput,
    onRemoveMutation.isPending,
    onRemoveMutation.mutate,
    operateType,
    outOfRange,
    parsedAmounts,
    position,
    priceLower,
    priceUpper,
    removed,
    setSlipper,
    showConfirm,
    sliderPercentage,
    slipper,
    theme.palette.background.paper,
    theme.palette.border.main,
    theme.palette.primary.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
    ticksAtLimit,
  ]);

  if (isMobile) {
    return (
      <Dialog
        open={baseToken != null && quoteToken != null}
        onClose={onClose}
        scope={!isMobile}
        modal={isMobile}
        id="pool-operate"
      >
        {content}
      </Dialog>
    );
  }

  return content;
};

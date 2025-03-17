import { CLMM } from '@dodoex/api';
import { alpha, Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import {
  getRecentBlockHash,
  OpenPositionFromBaseExtInfo,
  TxBuilder,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
import { PublicKey, Signer, Transaction } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { clmmConfigMap } from '../../../hooks/raydium-sdk-V2/common/programId';
import { useRaydiumSDKContext } from '../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { MetadataFlag } from '../../../hooks/Submission/types';
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
import { createPool, openPositionFromBase } from './utils/openPositionFromBase';

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
  const raydium = useRaydiumSDKContext();
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
    mint1: undefined,
    mint2: undefined,
    feeAmount: params?.fee ? Number(params?.fee) : undefined,
    selectedMintIndex: 0,
    independentField: Field.DEPOSIT_1,
    typedValue: '',
    startPriceTypedValue: '1',
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

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: CLMM,
  });

  const {
    mintA,
    mintB,
    poolInfo,
    poolKeys,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    depositBalances,
    position,
    poolIsNoExisted,
    mints,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
  } = useV3DerivedMintInfo({ state, slipperValue });

  const {
    onField1Input,
    onField2Input,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers({ dispatch });

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
    Field.DEPOSIT_1,
    Field.DEPOSIT_2,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(depositBalances[field]),
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

    // const minPrice = pricesAtLimit[Bound.LOWER];
    // if (minPrice) {
    //   onLeftRangeInput(minPrice.dp(5).toString());
    // }
    // const maxPrice = pricesAtLimit[Bound.UPPER];
    // if (maxPrice) {
    //   onRightRangeInput(maxPrice.dp(5).toString());
    // }
  }, [getSetFullRange, onLeftRangeInput, onRightRangeInput, pricesAtLimit]);

  const onAddMutation = useMutation({
    mutationFn: async () => {
      if (!account || !chainId) {
        return;
      }

      if (!poolInfo) {
        throw new Error('poolInfo is undefined');
      }

      if (!price) {
        throw new Error('price is undefined');
      }

      if (!raydium) {
        throw new Error('raydium is undefined');
      }

      const clmmConfig = clmmConfigMap[chainId];

      if (!clmmConfig) {
        throw new Error('Invalid config');
      }

      const clmm = raydium.clmm;

      raydium.clmm.scope.checkOwner();
      const txBuilder = new TxBuilder({
        connection: clmm.scope.connection,
        feePayer: clmm.scope.ownerPubKey,
        cluster: clmm.scope.cluster,
        owner: clmm.scope.owner,
        blockhashCommitment: clmm.scope.blockhashCommitment,
        loopMultiTxStatus: clmm.scope.loopMultiTxStatus,
        api: clmm.scope.api,
        signAllTransactions: clmm.scope.signAllTransactions,
      });

      const createPoolExtInfo = poolIsNoExisted
        ? await createPool({
            programId: clmmConfig.programId,
            mint1: poolInfo.mintA,
            mint2: poolInfo.mintB,
            ammConfig: {
              ...poolInfo.config,
              id: new PublicKey(poolInfo.config.id),
              fundOwner: '',
              description: '',
            },
            initialPrice: new Decimal(price.toString()),
            // startTime: new BN(0),
            // txVersion: TxVersion.LEGACY,
            // optional: set up priority fee here
            // computeBudgetConfig: {
            //   units: 600000,
            //   microLamports: 46591500,
            // },
            clmm,
            txBuilder,
          })
        : undefined;

      if (!position) {
        throw new Error('position is undefined');
      }

      const openPositionFromBaseExtInfo = await openPositionFromBase({
        poolInfo,
        poolKeys: poolKeys ?? createPoolExtInfo?.address,
        tickUpper: Math.max(position.tickLower, position.tickUpper),
        tickLower: Math.min(position.tickLower, position.tickUpper),
        base: 'MintA',
        ownerInfo: {
          useSOLBalance: true,
        },
        baseAmount: new BN(
          new Decimal(typedValue || '0')
            .mul(10 ** poolInfo.mintA.decimals)
            .toFixed(0),
        ),
        otherAmountMax: new BN(
          position.amountB
            .multipliedBy(new BigNumber(10 ** poolInfo.mintB.decimals))
            .toFixed(0),
        ),
        // nft2022: true,
        // txVersion: TxVersion.V0,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000,
        // },
        clmm,
        txBuilder,
      });

      // 恢复并调整计算预算和小费指令
      txBuilder.addCustomComputeBudget({
        units: 600000,
        microLamports: 1000,
      });

      const { transaction, signers } =
        await txBuilder.versionBuild<OpenPositionFromBaseExtInfo>({
          txVersion: TxVersion.LEGACY,
          extInfo: openPositionFromBaseExtInfo,
          // addLookupTableInfo: false,
        });

      // 参考 @raydium-io/raydium-sdk-v2 src/common/txTool/txTool.ts build 方法
      async function execute() {
        if (!raydium) {
          throw new Error('raydium is undefined');
        }
        const recentBlockHash = await getRecentBlockHash(
          raydium.connection,
          raydium.blockhashCommitment,
        );
        transaction.recentBlockhash = recentBlockHash;

        // 对 positionNftMint 签名
        // { pubkey: positionNftMint, isSigner: true, isWritable: true },
        if (signers.length) {
          transaction.sign(...signers);
        }

        const txs = await clmm.scope.signAllTransactions?.([transaction]);
        if (signers.length) {
          for (const item of txs) {
            try {
              // 注释掉，否则报错：Signature verification failed. Missing signature for public key [`CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n`]
              // CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n 是钱包地址，应该会自动签名，非常奇怪
              // item.sign(...signers);
            } catch (e) {
              //
            }
          }
        }
        const rawTransaction = txs?.[0]?.serialize();
        if (!rawTransaction) {
          throw new Error('rawTransaction is undefined');
        }
        return {
          txId: await clmm.scope.connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
          }),
          signedTx: txs?.[0],
        };
      }

      const txResult = await submission.executeCustom({
        brief: poolIsNoExisted ? t`Pool Creation` : t`Add Liquidity`,
        metadata: {
          [poolIsNoExisted
            ? MetadataFlag.createAMMV3Pool
            : MetadataFlag.addAMMV3Pool]: true,
        },
        handler: async (params) => {
          const { txId } = await execute();
          params.onSuccess(txId);
        },
        successBack: () => {
          handleGoBack();
        },
        submittedBack: () => {
          handleGoBack();
        },
      });

      return txResult;
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const perPriceText =
    mintA && mintB
      ? state.selectedMintIndex === 0
        ? `${mintB?.symbol} per ${mintA?.symbol}`
        : `${mintA?.symbol} per ${mintB?.symbol}`
      : '-';
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
              {mintA && mintB && (
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
                    mintA={mintA}
                    mintB={mintB}
                    selectedMintIndex={state.selectedMintIndex}
                    handleRateToggle={() => {
                      dispatch({
                        type: Types.UpdateSelectedMintIndex,
                        payload: state.selectedMintIndex === 0 ? 1 : 0,
                      });

                      // if (
                      //   !ticksAtLimit[Bound.LOWER] &&
                      //   !ticksAtLimit[Bound.UPPER]
                      // ) {
                      //   onLeftRangeInput(priceLower?.dp(6).toString() ?? '');
                      //   onRightRangeInput(priceUpper?.dp(6).toString() ?? '');
                      //   onField1Input(formattedAmounts[Field.MINT_2] ?? '');
                      // }
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
              ticksAtLimit={ticksAtLimit}
              perPriceText={perPriceText}
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

          {poolIsNoExisted ? (
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
                  suffix={
                    <Box
                      sx={{
                        typography: 'h6',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {perPriceText}
                    </Box>
                  }
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
              (poolIsNoExisted && !startPriceTypedValue)
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
                value={formattedAmounts[Field.DEPOSIT_1]}
                onUserInput={onField1Input}
                maxAmount={maxAmounts[Field.DEPOSIT_1]}
                balance={depositBalances[Field.DEPOSIT_1]}
                mint={mints[Field.DEPOSIT_1] ?? null}
                locked={depositADisabled}
              />
              <CardPlusConnected />
              <CurrencyInputPanel
                value={formattedAmounts[Field.DEPOSIT_2]}
                onUserInput={onField2Input}
                maxAmount={maxAmounts[Field.DEPOSIT_2]}
                balance={depositBalances[Field.DEPOSIT_2]}
                mint={mints[Field.DEPOSIT_2] ?? null}
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

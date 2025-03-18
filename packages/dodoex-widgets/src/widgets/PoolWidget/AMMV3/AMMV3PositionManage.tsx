import { CLMM } from '@dodoex/api';
import {
  Box,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import { ApiV3Token, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useReducer, useState } from 'react';
import Dialog from '../../../components/Dialog';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import TokenLogo from '../../../components/TokenLogo';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useRaydiumSDKContext } from '../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { ExecutionResult, MetadataFlag } from '../../../hooks/Submission/types';
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
import { useTokenInfo } from './hooks/useTokenInfo';
import { useV3DerivedMintInfo } from './hooks/useV3DerivedMintInfo';
import { useV3MintActionHandlers } from './hooks/useV3MintActionHandlers';
import { useV3PositionFromNFTMint } from './hooks/useV3PositionFromNFTMint';
import { reducer, Types } from './reducer';
import { FeeAmount } from './sdks/v3-sdk/constants';
import { Field, OperateType } from './types';
import { maxAmountSpend } from './utils/maxAmountSpend';
import { Error as ErrorIcon } from '@dodoex/icons';

const RewardItem = ({
  mint,
  rewardAmountOwed,
}: {
  mint: ApiV3Token | undefined;
  rewardAmountOwed: BN | undefined;
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
        address={mint?.address ?? ''}
        chainId={mint?.chainId}
        noShowChain
        width={24}
        height={24}
        marginRight={0}
      />
      <Box>{mint?.symbol}</Box>
      <Box
        sx={{
          ml: 'auto',
        }}
      >
        {formatTokenAmountNumber({
          input: rewardAmountOwed?.toString(),
          decimals: mint?.decimals,
        })}
      </Box>
    </Box>
  );
};

export interface AMMV3PositionManageProps {
  mint1Address: string;
  mint2Address: string;
  feeAmount: FeeAmount;
  poolId: string;
  nftMint: string;
  onClose: (() => void) | undefined;
}

export const AMMV3PositionManage = ({
  mint1Address,
  mint2Address,
  feeAmount,
  poolId,
  nftMint,
  onClose,
}: AMMV3PositionManageProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const submission = useSubmission();
  const queryClient = useQueryClient();

  const { account, chainId } = useWalletInfo();
  const raydium = useRaydiumSDKContext();

  const { position: existingPosition } = useV3PositionFromNFTMint({
    chainId,
    nftMint,
    poolId,
  });

  const { positionInfo, pool } = useDerivedPositionInfo({
    position: existingPosition,
  });

  const [operateType, setOperateType] = useState<OperateType>('stake');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [sliderPercentage, setSliderPercentage] =
    useState(initSliderPercentage);

  const defaultMint1 = useTokenInfo({
    mint: mint1Address,
    chainId,
  });
  const defaultMint2 = useTokenInfo({
    mint: mint2Address,
    chainId,
  });

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    mint1: defaultMint1,
    mint2: defaultMint2,
    feeAmount,
    selectedMintIndex: 0,
    independentField: Field.DEPOSIT_1,
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

  const { independentField, typedValue } = state;

  const { slipper, setSlipper, slipperValue } = useSlipper({
    type: CLMM,
  });

  const {
    mintA,
    mintB,
    dependentField,
    parsedAmounts,
    depositBalances,
    position,
    mints,
    errorMessage,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
  } = useV3DerivedMintInfo({ state, existingPosition, slipperValue });

  const removed =
    existingPosition?.liquidity && existingPosition.liquidity.eq(new BN(0));

  const { onField1Input, onField2Input } = useV3MintActionHandlers({
    dispatch,
  });

  const isValid = !errorMessage && !invalidRange;

  // get formatted amounts
  const formattedAmounts = useMemo(() => {
    return {
      [independentField]: typedValue,
      [dependentField]: parsedAmounts[dependentField]?.toString() ?? '',
    };
  }, [dependentField, independentField, parsedAmounts, typedValue]);

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

  const onAddMutation = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('account is undefined');
      }

      if (!raydium) {
        throw new Error('raydium is undefined');
      }

      if (!existingPosition) {
        throw new Error('existingPosition is undefined');
      }

      if (!pool?.poolInfo) {
        throw new Error('poolInfo is undefined');
      }

      if (!position) {
        throw new Error('position is undefined');
      }

      const { execute } = await raydium.clmm.increasePositionFromLiquidity({
        poolInfo: pool.poolInfo,
        poolKeys: pool.poolKeys,
        ownerPosition: existingPosition,
        ownerInfo: {
          useSOLBalance: true,
        },
        liquidity: new BN(
          new Decimal(position.liquidity.toString())
            .mul(1 - slipperValue)
            .toFixed(0),
        ),
        amountMaxA: new BN(
          new Decimal(typedValue || '0')
            .mul(10 ** pool.poolInfo.mintA.decimals)
            .toFixed(0),
        ),
        amountMaxB: new BN(
          position.amountB
            .multipliedBy(1 + slipperValue)
            .multipliedBy(new BigNumber(10 ** pool.poolInfo.mintB.decimals))
            .toFixed(0),
        ),
        checkCreateATAOwner: true,
        txVersion: TxVersion.LEGACY,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 46591500,
        // },

        // optional: add transfer sol to tip account instruction. e.g sent tip to jito
        // txTipConfig: {
        //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
        //   amount: new BN(10000000), // 0.01 sol
        // },
      });

      const txResult = await submission.executeCustom({
        brief: t`Add Liquidity`,
        metadata: {
          [MetadataFlag.addAMMV3Pool]: true,
        },
        handler: async (params) => {
          const { txId } = await execute({ sendAndConfirm: true });
          params.onSuccess(txId);
        },
      });
      if (txResult === ExecutionResult.Success) {
        setShowConfirm(false);
        setTimeout(() => {
          onClose?.();
        }, 100);
      }
      queryClient.invalidateQueries({
        queryKey: ['clmm'],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onRemoveMutation = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('account is undefined');
      }

      if (!raydium) {
        throw new Error('raydium is undefined');
      }

      if (!existingPosition) {
        throw new Error('existingPosition is undefined');
      }

      if (!pool?.poolInfo) {
        throw new Error('poolInfo is undefined');
      }
      const newLiquidity = existingPosition.liquidity.mul(
        new BN(1).sub(new BN(sliderPercentage).div(new BN(100))),
      );
      console.log(
        'v2 newLiquidity',
        existingPosition.liquidity.toString(),
        sliderPercentage,
        new BN(1).sub(new BN(sliderPercentage).div(new BN(100))).toString(),
        newLiquidity.toString(),
      );
      const closePosition = newLiquidity.lte(new BN(0));
      const { execute } = await raydium.clmm.decreaseLiquidity({
        poolInfo: pool.poolInfo,
        poolKeys: pool.poolKeys,
        ownerPosition: existingPosition,
        ownerInfo: {
          useSOLBalance: true,
          // if liquidity wants to decrease doesn't equal to position liquidity, set closePosition to false
          closePosition,
        },
        liquidity: newLiquidity,
        amountMinA: new BN(0),
        amountMinB: new BN(0),
        txVersion: TxVersion.LEGACY,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 46591500,
        // },
        // optional: add transfer sol to tip account instruction. e.g sent tip to jito
        // txTipConfig: {
        //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
        //   amount: new BN(10000000), // 0.01 sol
        // },
      });

      const txResult = await submission.executeCustom({
        brief: t`Remove Liquidity`,
        metadata: {
          [MetadataFlag.removeAMMV3Pool]: true,
        },
        handler: async (params) => {
          const { txId } = await execute({ sendAndConfirm: true });
          params.onSuccess(txId);
        },
      });

      if (txResult === ExecutionResult.Success) {
        setTimeout(() => {
          onClose?.();
        }, 100);
      }
      queryClient.invalidateQueries({
        queryKey: ['clmm'],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error('onRemoveMutation', error);
    },
  });

  const onClaimMutation = useMutation({
    mutationFn: async () => {
      if (!raydium) {
        throw new Error('raydium is undefined');
      }

      if (!pool?.poolInfo) {
        throw new Error('poolInfo is undefined');
      }

      const { execute } = await raydium.clmm.collectRewards({
        poolInfo: pool.poolInfo,
        ownerInfo: {
          useSOLBalance: true,
        },
        rewardMints: pool.poolInfo.rewardDefaultInfos.map(
          (info) => new PublicKey(info.mint.address),
        ),
        associatedOnly: true,
        checkCreateATAOwner: true,
        computeBudgetConfig: undefined,
        txTipConfig: undefined,
      });

      const txResult = await submission.executeCustom({
        brief: t`Claim Rewards`,
        metadata: {
          [MetadataFlag.claimAMMV3Pool]: true,
        },
        handler: async (params) => {
          const { txId } = await execute();
          params.onSuccess(txId);
        },
      });

      if (txResult === ExecutionResult.Success) {
        setTimeout(() => {
          onClose?.();
        }, 100);
      }
      queryClient.invalidateQueries({
        queryKey: ['clmm'],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error('onClaimMutation', error);
    },
  });

  const content = useMemo(() => {
    const operateTypes = [
      { key: 'stake', value: t`Stake` },
      { key: 'unstake', value: t`Unstake` },
      { key: 'claim', value: t`Claim` },
    ];
    return (
      <Box
        sx={{
          borderRadius: 16,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 20,
            py: 24,
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
                component={ErrorIcon}
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

        <Box sx={{ mx: 20, mb: 16 }}>
          <PositionAmountPreview
            existingPosition={existingPosition}
            positionInfo={positionInfo}
            inRange={!outOfRange}
            removed={removed}
            mintA={mintA}
            mintB={mintB}
            feeAmount={feeAmount}
          />
        </Box>

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
              mx: 20,
            }}
          />
          <TabPanel value="stake">
            {position && (
              <Box sx={{ mt: 16, mx: 20 }}>
                <PositionSelectedRangePreview
                  position={position}
                  title={t`Selected Range`}
                  ticksAtLimit={ticksAtLimit}
                />
              </Box>
            )}

            <Box
              sx={{
                mt: 16,
                mx: 20,
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
          </TabPanel>
          <TabPanel value="unstake">
            <Box
              sx={{
                mt: 16,
                mx: 20,
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
              <SlippageSetting
                value={slipper}
                onChange={setSlipper}
                disabled={false}
                type={CLMM}
              />
            </Box>
            <Box
              sx={{
                mt: 16,
                mx: 20,
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
                    {positionInfo?.pooledAmountA
                      ? formatTokenAmountNumber({
                          input: positionInfo.pooledAmountA.multipliedBy(
                            sliderPercentage / 100,
                          ),
                          decimals: mintA?.decimals,
                        })
                      : '-'}
                  </Box>
                  &nbsp;{mintA?.symbol}
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
                    {positionInfo?.pooledAmountB
                      ? formatTokenAmountNumber({
                          input: positionInfo.pooledAmountB.multipliedBy(
                            sliderPercentage / 100,
                          ),
                          decimals: mintB?.decimals,
                        })
                      : '-'}
                  </Box>
                  &nbsp;{mintB?.symbol}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 20,
                display: 'flex',
                alignItems: 'center',
                px: 20,
                py: 16,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <RemoveButton
                chainId={chainId}
                disabled={removed || sliderPercentage === 0}
                removed={removed}
                onConfirm={onRemoveMutation.mutate}
                isLoading={onRemoveMutation.isPending}
              />
            </Box>
          </TabPanel>
          <TabPanel value="claim">
            <Box
              sx={{
                mx: 20,
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
                  px: 20,
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
                {pool?.poolInfo.rewardDefaultInfos.map((r, i) => {
                  const rewardAmountOwed =
                    existingPosition?.rewardInfos[i].rewardAmountOwed;
                  return (
                    <RewardItem
                      key={r.mint.address}
                      mint={r.mint}
                      rewardAmountOwed={rewardAmountOwed}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box
              sx={{
                mx: 20,
                mt: 16,
                typography: 'h6',
                color: theme.palette.text.secondary,
              }}
            >
              {t`*Collecting fees will withdraw currently available fees for you.`}
            </Box>
            <Box
              sx={{
                mt: 20,
                display: 'flex',
                alignItems: 'center',
                px: 20,
                py: 16,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <ClaimButton
                chainId={chainId}
                disabled={
                  onClaimMutation.isPending ||
                  !pool?.poolInfo ||
                  pool?.poolInfo.rewardDefaultInfos.length === 0
                }
                onConfirm={onClaimMutation.mutate}
                isLoading={onClaimMutation.isPending}
              />
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    );
  }, [
    chainId,
    depositADisabled,
    depositBDisabled,
    depositBalances,
    errorMessage,
    existingPosition,
    feeAmount,
    formattedAmounts,
    isValid,
    maxAmounts,
    mintA,
    mintB,
    mints,
    onAddMutation.isPending,
    onAddMutation.mutate,
    onClaimMutation.isPending,
    onClaimMutation.mutate,
    onClose,
    onField1Input,
    onField2Input,
    onRemoveMutation.isPending,
    onRemoveMutation.mutate,
    operateType,
    outOfRange,
    pool?.poolInfo,
    position,
    positionInfo,
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
        open={mintA != null && mintB != null}
        onClose={onClose}
        scope={!isMobile}
        modal={undefined}
        id="pool-operate"
      >
        {content}
      </Dialog>
    );
  }

  return content;
};

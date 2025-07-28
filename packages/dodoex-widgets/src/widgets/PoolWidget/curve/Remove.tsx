import { CONTRACT_QUERY_KEY } from '@dodoex/api';
import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { Interface } from '@ethersproject/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import TokenLogo from '../../../components/TokenLogo';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { OperateButtonContainer } from './components/OperateButtonContainer';
import { SlippageBonus } from './components/SlippageBonus';
import { useLpTokenBalances } from './hooks/useLpTokenBalances';
import { OperateCurvePoolT } from './types';
import { curveApi } from './utils';

function RadioButton({
  disabled,
  selected,
  onClick,
  children,
  iconVisible,
}: {
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  iconVisible: boolean;
}) {
  const theme = useTheme();

  const iconColor = selected
    ? theme.palette.success.main
    : theme.palette.text.secondary;
  return (
    <Box
      component={ButtonBase}
      disabled={disabled}
      onClick={onClick}
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {iconVisible && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
        >
          {selected ? (
            <>
              <rect
                x="0.5"
                y="1"
                width="17"
                height="17"
                rx="8.5"
                stroke={iconColor}
              />
              <rect
                x="4.5"
                y="5"
                width="9"
                height="9"
                rx="4.5"
                fill={iconColor}
                stroke={iconColor}
              />
            </>
          ) : (
            <rect
              x="0.5"
              y="1"
              width="17"
              height="17"
              rx="8.5"
              stroke={iconColor}
            />
          )}
        </svg>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'body2',
          fontWeight: 500,
          lineHeight: '19px',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export interface RemoveProps {
  operateCurvePool: OperateCurvePoolT;
}

export const Remove = ({ operateCurvePool }: RemoveProps) => {
  const theme = useTheme();
  const { account, chainId: currentChainId } = useWalletInfo();
  const submission = useSubmission();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  const [withdrawType, setWithdrawType] = useState<
    'oneCoin' | 'balanced' | 'custom'
  >('oneCoin');

  const [selectedOneCoinIndex, setSelectedOneCoinIndex] = useState<number>(0);

  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: operateCurvePool.pool.address,
  });

  const { lpTokenBalance, userTokenBalances, lpTokenBalanceLoading } =
    useLpTokenBalances({
      pool: operateCurvePool.pool,
      account,
    });

  const resetInputValues = useCallback(() => {
    const initialInputs: Record<string, string> = {};
    operateCurvePool.pool.coins.forEach((coin) => {
      initialInputs[coin.address] = '';
    });
    setTokenInputs(initialInputs);
  }, [operateCurvePool.pool.coins]);

  useEffect(() => {
    resetInputValues();
  }, [resetInputValues]);

  const handleInputChange = (coinAddress: string, value: string) => {
    setTokenInputs((prev) => ({
      ...prev,
      [coinAddress]: value,
    }));
  };
  const inputValueBN = useMemo(() => {
    const B = new BigNumber(inputValue);
    if (!B.isFinite()) {
      return null;
    }
    return B;
  }, [inputValue]);

  const withdrawOneCoinQuery = useQuery(
    curveApi.calcWithdrawOneCoin(
      operateCurvePool.pool.chainId,
      operateCurvePool.pool.address,
      inputValueBN
        ? inputValueBN
            .multipliedBy(10 ** operateCurvePool.pool.decimals)
            .dp(0, BigNumber.ROUND_DOWN)
            .toString()
        : '0',
      selectedOneCoinIndex,
    ),
  );

  const removeLiquidityOneCoinMutation = useMutation({
    mutationFn: async () => {
      if (!account || !withdrawOneCoinQuery.data) {
        return;
      }

      try {
        const iface = new Interface([
          {
            inputs: [
              { name: '_burn_amount', type: 'uint256' },
              { name: 'i', type: 'int128' },
              { name: '_min_received', type: 'uint256' },
            ],
            name: 'remove_liquidity_one_coin',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);
        const burnAmount = inputValueBN
          ? inputValueBN
              .multipliedBy(10 ** operateCurvePool.pool.decimals)
              .dp(0, BigNumber.ROUND_DOWN)
              .toString()
          : '0';

        const minReceived = withdrawOneCoinQuery.data
          .multipliedBy(1 - slipperValue)
          .dp(0, BigNumber.ROUND_DOWN)
          .toString();

        const encodedData = iface.encodeFunctionData(
          'remove_liquidity_one_coin',
          [burnAmount, selectedOneCoinIndex, minReceived],
        );

        const refetch = () => {
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'curve'],
            refetchType: 'all',
          });
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'token', 'getFetchTokenQuery'],
            refetchType: 'all',
          });
        };

        const result = await submission.execute(
          'remove_liquidity_one_coin',
          {
            opcode: OpCode.TX,
            data: encodedData,
            to: operateCurvePool.pool.address,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.curveRemoveLiquidityOneCoin]: true,
            },
            submittedBack: () => {
              refetch();
            },
            successBack: () => {
              refetch();
              setInputValue('');
            },
          },
        );

        return result;
      } catch (error) {
        console.error('curve remove_liquidity_one_coin', error);
      }
    },
  });

  const removeLiquidityMutation = useMutation({
    mutationFn: async () => {
      if (!account) {
        return;
      }

      try {
        const iface = new Interface([
          {
            inputs: [
              { name: '_burn_amount', type: 'uint256' },
              { name: '_min_amounts', type: 'uint256[]' },
            ],
            name: 'remove_liquidity',
            outputs: [{ name: '', type: 'uint256[]' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);
        const burnAmount = inputValueBN
          ? inputValueBN
              .multipliedBy(10 ** operateCurvePool.pool.decimals)
              .dp(0, BigNumber.ROUND_DOWN)
              .toString()
          : '0';

        const minAmounts = operateCurvePool.pool.coins.map((coin, index) => {
          return userTokenBalances?.[index] &&
            inputValueBN &&
            lpTokenBalance &&
            lpTokenBalance.gt(0)
            ? userTokenBalances[index]
                .multipliedBy(inputValueBN)
                .div(lpTokenBalance)
                .multipliedBy(10 ** coin.decimals)
                .multipliedBy(1 - slipperValue)
                .dp(0, BigNumber.ROUND_DOWN)
                .toString()
            : '0';
        });

        const encodedData = iface.encodeFunctionData('remove_liquidity', [
          burnAmount,
          minAmounts,
        ]);

        const refetch = () => {
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'curve'],
            refetchType: 'all',
          });
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'token', 'getFetchTokenQuery'],
            refetchType: 'all',
          });
        };

        const result = await submission.execute(
          'remove_liquidity',
          {
            opcode: OpCode.TX,
            data: encodedData,
            to: operateCurvePool.pool.address,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.curveRemoveLiquidity]: true,
            },
            submittedBack: () => {
              refetch();
            },
            successBack: () => {
              refetch();
              setInputValue('');
            },
          },
        );

        return result;
      } catch (error) {
        console.error('curve remove_liquidity', error);
      }
    },
  });

  const withdrawLpTokenQuery = useQuery({
    ...curveApi.calcTokenAmount(
      operateCurvePool.pool.chainId,
      operateCurvePool.pool.address,
      operateCurvePool.pool.coins.map((coin) => {
        const amount = tokenInputs[coin.address] || '0';
        const amountBN = new BigNumber(amount);
        if (!amountBN.isFinite()) {
          return '0';
        }
        return amountBN
          .multipliedBy(10 ** coin.decimals)
          .dp(0, BigNumber.ROUND_DOWN)
          .toString();
      }),
      false,
    ),
  });

  useEffect(() => {
    if (
      withdrawType === 'custom' &&
      withdrawLpTokenQuery.isSuccess &&
      withdrawLpTokenQuery.data
    ) {
      const withdrawLpTokenBN = withdrawLpTokenQuery.data
        .dividedBy(10 ** operateCurvePool.pool.decimals)
        .dp(operateCurvePool.pool.decimals, BigNumber.ROUND_DOWN);

      setInputValue(withdrawLpTokenBN.toString());
    }
  }, [
    withdrawLpTokenQuery.isSuccess,
    withdrawLpTokenQuery.data,
    withdrawType,
    operateCurvePool.pool.decimals,
  ]);

  const removeLiquidityImBalanceMutation = useMutation({
    mutationFn: async () => {
      if (!account || !withdrawLpTokenQuery.data) {
        return;
      }

      try {
        const iface = new Interface([
          {
            inputs: [
              { name: '_amounts', type: 'uint256[]' },
              { name: '_max_burn_amount', type: 'uint256' },
            ],
            name: 'remove_liquidity_imbalance',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);

        const amounts = operateCurvePool.pool.coins.map((coin) => {
          const amount = tokenInputs[coin.address] || '0';
          const amountBN = new BigNumber(amount);
          if (!amountBN.isFinite()) {
            return '0';
          }
          return amountBN
            .multipliedBy(10 ** coin.decimals)
            .dp(0, BigNumber.ROUND_DOWN)
            .toString();
        });
        const maxBurnAmount = withdrawLpTokenQuery.data
          .multipliedBy(1 + slipperValue)
          .dp(0, BigNumber.ROUND_DOWN)
          .toString();

        const encodedData = iface.encodeFunctionData(
          'remove_liquidity_imbalance',
          [amounts, maxBurnAmount],
        );

        const refetch = () => {
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'curve'],
            refetchType: 'all',
          });
          queryClient.invalidateQueries({
            queryKey: [CONTRACT_QUERY_KEY, 'token', 'getFetchTokenQuery'],
            refetchType: 'all',
          });
        };

        const result = await submission.execute(
          'remove_liquidity_imbalance',
          {
            opcode: OpCode.TX,
            data: encodedData,
            to: operateCurvePool.pool.address,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.curveRemoveLiquidityImBalance]: true,
            },
            submittedBack: () => {
              refetch();
            },
            successBack: () => {
              refetch();
              setInputValue('');
              resetInputValues();
            },
          },
        );

        return result;
      } catch (error) {
        console.error('curve remove_liquidity_imbalance', error);
      }
    },
  });

  const confirmButton = useMemo(() => {
    if (!account || operateCurvePool.pool.chainId !== currentChainId) {
      return (
        <NeedConnectButton chainId={operateCurvePool.pool.chainId} fullWidth />
      );
    }

    if (!inputValue || inputValue === '0') {
      return (
        <Button fullWidth disabled>
          Please enter amount
        </Button>
      );
    }

    const inputValueBN = new BigNumber(inputValue);
    if (!inputValueBN.isFinite()) {
      return (
        <Button fullWidth disabled>
          Invalid input
        </Button>
      );
    }

    if (lpTokenBalanceLoading) {
      return (
        <Button fullWidth disabled isLoading>
          Loading...
        </Button>
      );
    }

    if (!lpTokenBalance || lpTokenBalance.lte(0)) {
      return (
        <Button fullWidth disabled>
          No LP token balance
        </Button>
      );
    }

    if (inputValueBN.gt(lpTokenBalance)) {
      return (
        <Button fullWidth disabled>
          Insufficient LP token balance
        </Button>
      );
    }

    if (withdrawType === 'oneCoin') {
      if (withdrawOneCoinQuery.isLoading || !withdrawOneCoinQuery.data) {
        return (
          <Button fullWidth disabled isLoading>
            Calculating...
          </Button>
        );
      }

      if (withdrawOneCoinQuery.data.lte(0)) {
        return (
          <Button fullWidth disabled>
            Invalid input
          </Button>
        );
      }

      return (
        <Button
          fullWidth
          disabled={removeLiquidityOneCoinMutation.isPending}
          isLoading={removeLiquidityOneCoinMutation.isPending}
          onClick={() => {
            removeLiquidityOneCoinMutation.mutate();
          }}
        >
          Remove
        </Button>
      );
    }

    if (withdrawType === 'balanced') {
      return (
        <Button
          fullWidth
          disabled={removeLiquidityMutation.isPending}
          isLoading={removeLiquidityMutation.isPending}
          onClick={() => {
            removeLiquidityMutation.mutate();
          }}
        >
          Remove
        </Button>
      );
    }

    if (withdrawType === 'custom') {
      const hasAnyInput = Object.values(tokenInputs).some(
        (value) => value && value !== '0',
      );
      if (!hasAnyInput) {
        return (
          <Button fullWidth disabled>
            Please enter amount
          </Button>
        );
      }

      for (const coin of operateCurvePool.pool.coins) {
        const inputValue = tokenInputs[coin.address];
        if (!inputValue || inputValue === '0') continue;
        const inputBN = new BigNumber(inputValue);

        if (!inputBN.isFinite()) {
          return (
            <Button fullWidth disabled>
              Invalid input
            </Button>
          );
        }
      }

      if (withdrawLpTokenQuery.isLoading || !withdrawLpTokenQuery.data) {
        return (
          <Button fullWidth disabled isLoading>
            Calculating...
          </Button>
        );
      }

      if (withdrawLpTokenQuery.data.lte(0)) {
        return (
          <Button fullWidth disabled>
            Invalid input
          </Button>
        );
      }

      const withdrawLpTokenBN = withdrawLpTokenQuery.data
        .dividedBy(10 ** operateCurvePool.pool.decimals)
        .dp(operateCurvePool.pool.decimals, BigNumber.ROUND_DOWN);

      if (withdrawLpTokenBN.gt(inputValueBN)) {
        return (
          <Button fullWidth disabled>
            Insufficient input amount
          </Button>
        );
      }

      if (withdrawLpTokenBN.gt(lpTokenBalance)) {
        return (
          <Button fullWidth disabled>
            Insufficient LP token balance
          </Button>
        );
      }

      return (
        <Button
          fullWidth
          disabled={removeLiquidityImBalanceMutation.isPending}
          isLoading={removeLiquidityImBalanceMutation.isPending}
          onClick={() => {
            removeLiquidityImBalanceMutation.mutate();
          }}
        >
          Remove
        </Button>
      );
    }

    return null;
  }, [
    account,
    operateCurvePool.pool.chainId,
    operateCurvePool.pool.decimals,
    operateCurvePool.pool.coins,
    currentChainId,
    inputValue,
    lpTokenBalanceLoading,
    lpTokenBalance,
    withdrawType,
    withdrawOneCoinQuery.isLoading,
    withdrawOneCoinQuery.data,
    removeLiquidityOneCoinMutation,
    removeLiquidityMutation,
    tokenInputs,
    withdrawLpTokenQuery.isLoading,
    withdrawLpTokenQuery.data,
    removeLiquidityImBalanceMutation,
  ]);

  return (
    <>
      <Box
        sx={{
          pb: 100,
          px: 20,
          pt: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          [theme.breakpoints.up('tablet')]: {
            pb: 20,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 8,
          }}
        >
          <Box
            sx={{
              px: 20,
              py: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 16,
              backgroundColor: theme.palette.background.cardInput,
            }}
          >
            <Box>
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  lineHeight: '22px',
                  color: theme.palette.text.primary,
                }}
              >
                LP Tokens
              </Box>
              <Box
                component={ButtonBase}
                onClick={() => {
                  if (!lpTokenBalance) {
                    return;
                  }

                  setInputValue(
                    lpTokenBalance
                      .dp(operateCurvePool.pool.decimals, BigNumber.ROUND_DOWN)
                      .toString(),
                  );
                }}
                sx={{
                  mt: 4,
                  typography: 'h6',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                Balance:&nbsp;
                {lpTokenBalance
                  ? formatTokenAmountNumber({
                      input: lpTokenBalance,
                      decimals: operateCurvePool.pool.decimals,
                    })
                  : '-'}
              </Box>
            </Box>

            <NumberInput
              value={inputValue}
              onChange={(v) => {
                setInputValue(v);
              }}
              decimals={operateCurvePool.pool.decimals}
              typography="h4"
              sx={{
                mt: 0,
                '& input': {
                  fontSize: 24,
                  typography: 'h4',
                  lineHeight: '33px',
                  fontWeight: 600,
                  textAlign: 'right',
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  color: 'text.primary',
                  '&::placeholder': {
                    fontSize: 24,
                    typography: 'h4',
                    lineHeight: '33px',
                    fontWeight: 600,
                    color: 'text.disabled',
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              p: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 20,
              borderRadius: 8,
              border: `1px solid ${theme.palette.border.main}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'oneCoin'}
                onClick={() => {
                  setWithdrawType('oneCoin');
                }}
              >
                One coin
              </RadioButton>
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'balanced'}
                onClick={() => {
                  setWithdrawType('balanced');
                }}
              >
                Balanced
              </RadioButton>
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'custom'}
                onClick={() => {
                  setWithdrawType('custom');
                }}
              >
                Custom
              </RadioButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {operateCurvePool.pool.coins.map((coin, index) => {
                return (
                  <RadioButton
                    iconVisible={
                      withdrawType === 'oneCoin' || withdrawType === 'balanced'
                    }
                    key={coin.address}
                    disabled={false}
                    selected={
                      withdrawType === 'oneCoin'
                        ? selectedOneCoinIndex === index
                        : true
                    }
                    onClick={() => {
                      if (withdrawType === 'oneCoin') {
                        setSelectedOneCoinIndex(index);
                      }
                    }}
                  >
                    <TokenLogo
                      width={24}
                      height={24}
                      address={coin.address}
                      chainId={coin.chainId}
                      noShowChain
                      noBorder
                      marginRight={0}
                    />
                    <Box
                      sx={{
                        typography: 'body1',
                        fontWeight: 600,
                        lineHeight: '22px',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {coin.symbol}
                    </Box>
                    {withdrawType === 'oneCoin' && (
                      <Box
                        sx={{
                          ml: 'auto',
                          typography: 'body1',
                          fontWeight: 600,
                          lineHeight: '22px',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {selectedOneCoinIndex === index
                          ? formatTokenAmountNumber({
                              input: withdrawOneCoinQuery.data?.div(
                                10 ** coin.decimals,
                              ),
                              decimals: coin.decimals,
                            })
                          : '0'}
                      </Box>
                    )}

                    {withdrawType === 'balanced' && (
                      <Box
                        sx={{
                          ml: 'auto',
                          typography: 'body1',
                          fontWeight: 600,
                          lineHeight: '22px',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {userTokenBalances?.[index] &&
                        inputValueBN &&
                        lpTokenBalance &&
                        lpTokenBalance.gt(0)
                          ? formatTokenAmountNumber({
                              input: userTokenBalances[index]
                                .multipliedBy(inputValueBN)
                                .div(lpTokenBalance),
                              decimals: coin.decimals,
                            })
                          : '-'}
                      </Box>
                    )}

                    {withdrawType === 'custom' && (
                      <Box
                        sx={{
                          ml: 'auto',
                        }}
                      >
                        <NumberInput
                          value={tokenInputs[coin.address] || ''}
                          onChange={(v) => {
                            handleInputChange(coin.address, v);
                          }}
                          decimals={coin.decimals}
                          sx={{
                            mt: 0,
                            '& input': {
                              fontSize: 16,
                              typography: 'body1',
                              lineHeight: '22px',
                              fontWeight: 600,
                              textAlign: 'right',
                              border: `1px solid ${theme.palette.border.main}`,
                              borderRadius: 8,
                              outline: 'none',
                              padding: 0,
                              color: 'text.primary',
                              height: 38,
                              width: 160,
                              px: 12,
                              '&::placeholder': {
                                fontSize: 16,
                                typography: 'body1',
                                lineHeight: '22px',
                                fontWeight: 600,
                                color: 'text.disabled',
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                  </RadioButton>
                );
              })}
            </Box>
          </Box>

          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            sx={
              {
                // width: 'auto',
                // display: 'inline-flex',
                // ml: 0,
              }
            }
          />
        </Box>

        <SlippageBonus />
      </Box>

      <OperateButtonContainer>{confirmButton}</OperateButtonContainer>
    </>
  );
};

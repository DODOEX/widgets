import { CONTRACT_QUERY_KEY } from '@dodoex/api';
import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { Interface } from '@ethersproject/abi';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import TokenLogo from '../../../components/TokenLogo';
import { tokenApi } from '../../../constants/api';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { ApprovalState, BalanceState } from '../../../hooks/Token/type';
import { useGetTokenStatus } from '../../../hooks/Token/useGetTokenStatus';
import { formatTokenAmountNumber } from '../../../utils';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { OperateButtonContainer } from './components/OperateButtonContainer';
import { SlippageBonus } from './components/SlippageBonus';
import { useLpTokenBalances } from './hooks/useLpTokenBalances';
import { OperateCurvePoolT } from './types';
import { curveApi } from './utils';

export interface AddProps {
  operateCurvePool: OperateCurvePoolT;
}

export const Add = ({ operateCurvePool }: AddProps) => {
  const theme = useTheme();
  const { account, chainId: currentChainId } = useWalletInfo();
  const submission = useSubmission();
  const queryClient = useQueryClient();

  const [balancedProportionOn, setBalancedProportionOn] = useState(false);

  // 为每个代币创建输入值状态
  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});
  const tokenInputsRef = useRef(tokenInputs);
  tokenInputsRef.current = tokenInputs;

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: operateCurvePool.pool.address,
  });

  const {
    lpTokenTotalSupply,
    tokenBalances,
    lpTokenBalance,
    userTokenBalances,
  } = useLpTokenBalances({
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

  // 初始化输入值状态
  useEffect(() => {
    resetInputValues();
  }, [resetInputValues]);

  // 处理输入值变化
  const handleInputChange = (coinAddress: string, value: string) => {
    setTokenInputs((prev) => {
      const newInputs = {
        ...prev,
        [coinAddress]: value,
      };

      // 如果在平衡模式下，根据比例自动调整其他输入框
      if (balancedProportionOn && tokenBalances) {
        const changedCoinIndex = operateCurvePool.pool.coins.findIndex(
          (coin) => coin.address === coinAddress,
        );

        if (changedCoinIndex !== -1) {
          const changedBalance = tokenBalances[changedCoinIndex];
          const inputValue = new BigNumber(value || '0');

          // 如果输入值为 0 或空，将所有其他输入框也设置为 0
          if (inputValue.isZero() || value === '') {
            operateCurvePool.pool.coins.forEach((coin) => {
              if (coin.address !== coinAddress) {
                newInputs[coin.address] = '0';
              }
            });
          } else if (
            changedBalance &&
            changedBalance.gt(0) &&
            inputValue.gt(0)
          ) {
            // 根据当前输入值和余额比例计算其他代币的输入值
            operateCurvePool.pool.coins.forEach((coin, index) => {
              if (index !== changedCoinIndex) {
                const balance = tokenBalances[index];
                if (balance && balance.gt(0)) {
                  // 计算比例：当前代币余额 / 修改的代币余额
                  const ratio = balance.div(changedBalance);
                  // 根据修改的输入值计算新的输入值
                  const newInputValue = inputValue
                    .multipliedBy(ratio)
                    .dp(coin.decimals, BigNumber.ROUND_DOWN)
                    .toString();
                  newInputs[coin.address] = newInputValue;
                } else {
                  newInputs[coin.address] = '0';
                }
              }
            });
          }
        }
      }

      return newInputs;
    });
  };

  // 处理最大余额点击
  const handleMaxBalance = (
    coinAddress: string,
    balance: BigNumber | undefined,
    decimals: number,
  ) => {
    if (!balance) return;
    const formattedBalance = balance
      .dp(decimals, BigNumber.ROUND_DOWN)
      .toString();
    handleInputChange(coinAddress, formattedBalance);
  };

  const tokensQueries = useQueries({
    queries: operateCurvePool.pool.coins.map((t) => {
      const query = tokenApi.getFetchTokenQuery(
        t.chainId,
        t.address,
        account,
        operateCurvePool.pool.address,
      );

      return {
        queryKey: query.queryKey,
        enabled:
          query.enabled &&
          t.chainId != null &&
          t.address != null &&
          account != null &&
          operateCurvePool.pool.address != null,
        queryFn: query.queryFn,
      };
    }),
    combine: (results) => {
      return {
        data: results.map((result) => {
          return {
            address: result.data?.address,
            symbol: result.data?.symbol,
            balance: result.data?.balance,
            allowance: result.data?.allowance,
          };
        }),
        loading: results.some((result) => result.isLoading),
      };
    },
  });

  const { getApprovalState, getBalanceState, getPendingRest, submitApprove } =
    useGetTokenStatus({
      account,
      chainId: operateCurvePool.pool.chainId,
      contractAddress: operateCurvePool.pool.address,
    });

  // 计算平衡比例输入值的函数
  const calculateBalancedProportions = useCallback(
    (
      baseInputValue?: string,
      currentTokenInputs?: Record<string, string>,
      currentTokensQueriesData?: any[],
    ) => {
      if (!tokenBalances) return {};

      const newTokenInputs: Record<string, string> = {};
      const tokenInputsToUse = currentTokenInputs || tokenInputs;
      const tokensQueriesDataToUse =
        currentTokensQueriesData || tokensQueries.data;

      // 找到第一个非零余额作为基准
      const firstNonZeroIndex = tokenBalances.findIndex(
        (balance) => balance && balance.gt(0),
      );

      if (firstNonZeroIndex !== -1) {
        const baseBalance = tokenBalances[firstNonZeroIndex];
        const baseCoin = operateCurvePool.pool.coins[firstNonZeroIndex];

        // 确定基准值：按照优先级顺序
        let finalBaseInputValue: string;

        if (baseInputValue !== undefined) {
          // 如果传入了基准值，直接使用
          finalBaseInputValue = baseInputValue;
        } else {
          // 按照优先级顺序确定基准值
          // 1. 不为空的第一个输入框
          const firstNonEmptyInput = Object.values(tokenInputsToUse).find(
            (value) => value && value !== '0' && value !== '',
          );
          if (firstNonEmptyInput) {
            finalBaseInputValue = firstNonEmptyInput;
          } else {
            // 2. 第一个代币最大余额
            const firstCoinBalance = tokensQueriesDataToUse?.find(
              (t) =>
                t.address?.toLowerCase() === baseCoin.address?.toLowerCase(),
            )?.balance;
            if (firstCoinBalance && firstCoinBalance.gt(0)) {
              finalBaseInputValue = firstCoinBalance
                .dp(baseCoin.decimals, BigNumber.ROUND_DOWN)
                .toString();
            } else {
              // 3. 默认值 1
              finalBaseInputValue = '1';
            }
          }
        }

        const baseInputBN = new BigNumber(finalBaseInputValue);

        // 设置基准代币的输入值
        newTokenInputs[baseCoin.address] = finalBaseInputValue;

        // 根据比例计算其他代币的输入值
        operateCurvePool.pool.coins.forEach((coin, index) => {
          if (index !== firstNonZeroIndex) {
            const balance = tokenBalances[index];
            if (balance && balance.gt(0) && baseBalance.gt(0)) {
              // 计算比例：当前代币余额 / 基准代币余额
              const ratio = balance.div(baseBalance);
              // 根据基准输入值计算新的输入值
              const inputValue = baseInputBN
                .multipliedBy(ratio)
                .dp(coin.decimals, BigNumber.ROUND_DOWN)
                .toString();
              newTokenInputs[coin.address] = inputValue;
            } else {
              newTokenInputs[coin.address] = '0';
            }
          }
        });
      }

      return newTokenInputs;
    },
    [
      operateCurvePool.pool.coins,
      tokenBalances,
      tokenInputs,
      tokensQueries.data,
    ],
  );

  // 处理平衡比例模式
  const handleBalancedProportion = () => {
    const newBalancedProportionOn = !balancedProportionOn;
    setBalancedProportionOn(newBalancedProportionOn);

    // 如果开启平衡模式且有 tokenBalances 数据，则根据比例设置输入值
    if (newBalancedProportionOn && tokenBalances) {
      const balancedInputs = calculateBalancedProportions(
        undefined,
        tokenInputsRef.current,
        tokensQueries.data,
      );
      setTokenInputs(balancedInputs);
    }
  };

  const lpTokenReceivedQuery = useQuery(
    curveApi.calcTokenAmount(
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
      true,
    ),
  );

  const onAddMutation = useMutation({
    mutationFn: async () => {
      if (!account || !lpTokenReceivedQuery.data) {
        return;
      }

      try {
        const iface = new Interface([
          {
            inputs: [
              { name: '_amounts', type: 'uint256[]' },
              { name: '_min_mint_amount', type: 'uint256' },
            ],
            name: 'add_liquidity',
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
        const minMintAmount = lpTokenReceivedQuery.data
          .multipliedBy(1 - slipperValue)
          .dp(0, BigNumber.ROUND_DOWN)
          .toString();

        const encodedData = iface.encodeFunctionData('add_liquidity', [
          amounts,
          minMintAmount,
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
          'add_liquidity',
          {
            opcode: OpCode.TX,
            data: encodedData,
            to: operateCurvePool.pool.address,
            value: '0x0',
          },
          {
            metadata: {
              [MetadataFlag.curveAddLiquidity]: true,
            },
            submittedBack: () => {
              refetch();
            },
            successBack: () => {
              refetch();
              resetInputValues();
            },
          },
        );

        return result;
      } catch (error) {
        console.error('curve add_liquidity', error);
      }
    },
  });

  const confirmButton = useMemo(() => {
    if (!account || operateCurvePool.pool.chainId !== currentChainId) {
      return (
        <NeedConnectButton chainId={operateCurvePool.pool.chainId} fullWidth />
      );
    }

    if (tokensQueries.loading) {
      return (
        <Button fullWidth disabled isLoading>
          Loading...
        </Button>
      );
    }

    // 检查是否有任何输入
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

    // 检查每个输入是否超过余额
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

      const result = tokensQueries.data.find(
        (t) => t.address?.toLowerCase() === coin.address?.toLowerCase(),
      );

      const balance = result?.balance ?? null;
      const allowance = result?.allowance ?? null;

      const balanceState = getBalanceState(inputBN, coin, balance);
      const pendingRest = getPendingRest(coin, allowance);
      const approvalState = getApprovalState(coin, inputBN, balance, allowance);

      if (
        balanceState === BalanceState.Loading ||
        approvalState === ApprovalState.Loading
      ) {
        return (
          <Button fullWidth disabled>
            Loading...
          </Button>
        );
      }

      if (balanceState === BalanceState.Insufficient) {
        return (
          <Button fullWidth disabled>
            Insufficient {coin.symbol} balance
          </Button>
        );
      }

      if (approvalState === ApprovalState.Approving) {
        return (
          <Button fullWidth disabled>
            {coin.symbol} Approval Pending
          </Button>
        );
      }

      if (approvalState === ApprovalState.Insufficient) {
        return (
          <Button
            fullWidth
            onClick={() => {
              submitApprove(coin, pendingRest);
            }}
          >
            Approve {coin.symbol}
          </Button>
        );
      }
    }

    if (lpTokenReceivedQuery.isLoading || !lpTokenReceivedQuery.data) {
      return (
        <Button fullWidth disabled isLoading>
          Calculating...
        </Button>
      );
    }

    if (lpTokenReceivedQuery.data.lte(0)) {
      return (
        <Button fullWidth disabled>
          Invalid input
        </Button>
      );
    }

    return (
      <Button
        fullWidth
        disabled={onAddMutation.isPending}
        isLoading={onAddMutation.isPending}
        onClick={() => {
          onAddMutation.mutate();
        }}
      >
        Add
      </Button>
    );
  }, [
    account,
    currentChainId,
    getApprovalState,
    getBalanceState,
    getPendingRest,
    lpTokenReceivedQuery.data,
    lpTokenReceivedQuery.isLoading,
    onAddMutation,
    operateCurvePool.pool.chainId,
    operateCurvePool.pool.coins,
    submitApprove,
    tokenInputs,
    tokensQueries.data,
    tokensQueries.loading,
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
            gap: 4,
          }}
        >
          {operateCurvePool.pool.coins.map((coin) => {
            const balance = tokensQueries.data.find(
              (t) => t.address?.toLowerCase() === coin.address?.toLowerCase(),
            )?.balance;

            return (
              <Box
                key={coin.symbol}
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
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
                  </Box>
                  <Box
                    component={ButtonBase}
                    onClick={() => {
                      if (balance) {
                        handleMaxBalance(coin.address, balance, coin.decimals);
                      }
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
                    {balance
                      ? formatTokenAmountNumber({
                          input: balance,
                          decimals: coin.decimals,
                        })
                      : '-'}
                  </Box>
                </Box>

                <NumberInput
                  value={tokenInputs[coin.address] || ''}
                  onChange={(v) => {
                    handleInputChange(coin.address, v);
                  }}
                  decimals={coin.decimals}
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
            );
          })}
        </Box>

        <Box
          sx={{
            mt: -8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <Box
            component={ButtonBase}
            onClick={handleBalancedProportion}
            sx={{
              px: 11,
              py: 3,
              borderRadius: 20,
              border: `1px solid ${balancedProportionOn ? theme.palette.primary.main : theme.palette.border.main}`,
              typography: 'body2',
              fontWeight: 500,
              lineHeight: '19px',
              color: balancedProportionOn
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              backgroundColor: balancedProportionOn
                ? theme.palette.primary.main
                : 'transparent',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            Balanced proportion:&nbsp;
            {balancedProportionOn ? 'ON' : 'OFF'}
          </Box>

          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            sx={{
              width: 'auto',
              display: 'inline-flex',
              ml: 0,
            }}
          />
        </Box>

        <SlippageBonus />
      </Box>

      <OperateButtonContainer>{confirmButton}</OperateButtonContainer>
    </>
  );
};

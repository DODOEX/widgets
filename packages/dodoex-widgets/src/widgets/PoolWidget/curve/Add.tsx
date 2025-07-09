import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import TokenLogo from '../../../components/TokenLogo';
import { QuestionTooltip } from '../../../components/Tooltip';
import { tokenApi } from '../../../constants/api';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { formatTokenAmountNumber } from '../../../utils';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { OperateButtonContainer } from './components/OperateButtonContainer';
import { OperateCurvePoolT } from './types';
import { useGetTokenStatus } from '../../../hooks/Token/useGetTokenStatus';
import { ApprovalState, BalanceState } from '../../../hooks/Token/type';

export interface AddProps {
  operateCurvePool: OperateCurvePoolT;
}

export const Add = ({ operateCurvePool }: AddProps) => {
  const theme = useTheme();
  const { account, chainId: currentChainId } = useWalletInfo();

  const [balancedProportionOn, setBalancedProportionOn] = useState(false);

  // 为每个代币创建输入值状态
  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: operateCurvePool.pool.address,
  });

  // 初始化输入值状态
  useEffect(() => {
    const initialInputs: Record<string, string> = {};
    operateCurvePool.pool.coins.forEach((coin) => {
      initialInputs[coin.address] = '';
    });
    setTokenInputs(initialInputs);
  }, [operateCurvePool.pool.coins]);

  // 处理输入值变化
  const handleInputChange = (coinAddress: string, value: string) => {
    setTokenInputs((prev) => ({
      ...prev,
      [coinAddress]: value,
    }));
  };

  // 处理平衡比例模式
  const handleBalancedProportion = () => {
    setBalancedProportionOn(!balancedProportionOn);
    // TODO: 实现平衡比例逻辑
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

      // console.log(
      //   'balance',
      //   coin.symbol,
      //   inputBN.toString(),
      //   balance?.toString(),
      //   allowance?.toString(),
      //   balanceState,
      //   pendingRest,
      //   approvalState,
      // );

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

    return (
      <Button
        fullWidth
        onClick={() => {
          // TODO: 实现添加流动性逻辑
          // 这里可以处理添加流动性的逻辑
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
                    <Box
                      sx={{
                        width: 24,
                      }}
                    >
                      <TokenLogo
                        width={24}
                        height={24}
                        address={coin.address}
                        chainId={coin.chainId}
                        noShowChain
                        noBorder
                      />
                    </Box>
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            px: 12,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${theme.palette.border.main}`,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              fontWeight: 500,
              lineHeight: '19px',
              color: theme.palette.text.secondary,
              textTransform: 'capitalize',
            }}
          >
            Slippage Bonus (incl. pricing)
            <QuestionTooltip title="Bonus comes as an advantage from current coin prices which usually appears for coins which are low in balance" />
          </Box>
          <Box
            sx={{
              typography: 'body2',
              fontWeight: 600,
              lineHeight: '19px',
              color: theme.palette.success.main,
            }}
          >
            1.526%
          </Box>
        </Box>
      </Box>

      <OperateButtonContainer>{confirmButton}</OperateButtonContainer>
    </>
  );
};

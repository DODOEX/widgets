import {
  getFetchVE33V2GaugeBalanceOfQueryOptions,
  getFetchVE33V2PairBalanceOfQueryOptions,
  getFetchVE33V3GaugeStakedContainsQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';
import { Error } from '@dodoex/icons';
import { PoolTypeE, Ve33PoolInfoI } from './types';
import Dialog from '../../components/Dialog';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import {
  Box,
  Button,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { RemoveButton } from './Ve33V3PoolOperate/components/RemoveButton';
import { FailedList } from '../../components/List/FailedList';
import {
  CardPlusConnected,
  TokenCard,
} from '../../components/Swap/components/TokenCard';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { PoolHead } from './components/PoolHead';
import NeedConnectButton from '../../components/ConnectWallet/NeedConnectButton';
import BigNumber from 'bignumber.js';
import TokenStatusButton from '../../components/TokenStatusButton';
import useVe33V3StakeApproveStatus from './hooks/useVe33V3StakeApproveStatus';
import {
  getPositionAmount0,
  getPositionAmount1,
} from './Ve33V3PoolOperate/utils/getPositionAmount';
import { TokenInfo } from '../../hooks/Token';
import { SliderPercentageCard } from './Ve33V2PoolOperate/components/SliderPercentageCard';
import { useVe33V3Stake } from './hooks/useVe33V3Stake';
import { useVe33V3UnStake } from './hooks/useVe33V3UnStake';
import { useVe33PositionAmounts } from './hooks/useVe33PositionAmounts';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
import { useTokenStatus } from '../../hooks/Token/useTokenStatus';
import { useVe33V2Stake } from './hooks/useVe33V2Stake';
import { TokenLpCard } from '../../components/Swap/components/TokenCard/TokenLpCard';
import { formatUnits } from '@dodoex/contract-request';
import { useVe33V2UnStake } from './hooks/useVe33V2UnStake';
import { byWei } from '../../utils';

export enum OperateType {
  Stake = 1,
  UnStake,
}

export default function Ve33StakeDialog({
  poolInfo,
  tokenId,
  operateType: operateTypeProps,
  onClose,
}: {
  poolInfo?: Ve33PoolInfoI;
  tokenId?: number;
  operateType?: OperateType;
  onClose: () => void;
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const [operateType, setOperateType] = React.useState<OperateType>(
    operateTypeProps ?? OperateType.Stake,
  );
  React.useEffect(() => {
    if (operateTypeProps) {
      setOperateType(operateTypeProps);
    }
  }, [operateTypeProps]);
  const operateTypes = [
    { key: OperateType.Stake, value: t`Stake` },
    { key: OperateType.UnStake, value: t`UnStake` },
  ];

  const isV2 = poolInfo?.type === PoolTypeE.Pool;

  return (
    <Dialog open={!!poolInfo} onClose={onClose} modal id="pool-operate">
      <Box
        sx={{
          width: isMobile ? '100%' : 420,
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
          {poolInfo && (
            <PoolHead
              chainId={poolInfo.chainId}
              poolInfo={poolInfo}
              size="small"
            />
          )}

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
          <TabPanel value={OperateType.Stake}>
            {isV2 ? (
              <StakeV2Panel poolInfo={poolInfo} onClose={onClose} />
            ) : (
              <StakeV3Panel
                poolInfo={poolInfo}
                tokenId={tokenId}
                onClose={onClose}
              />
            )}
          </TabPanel>
          <TabPanel value={OperateType.UnStake}>
            {isV2 ? (
              <UnStakeV2Panel poolInfo={poolInfo} onClose={onClose} />
            ) : (
              <UnStakeV3Panel
                poolInfo={poolInfo}
                tokenId={tokenId}
                onClose={onClose}
              />
            )}
          </TabPanel>
        </Tabs>
      </Box>
    </Dialog>
  );
}

function StakeV3Panel({
  poolInfo,
  tokenId,
  onClose,
}: {
  poolInfo?: Ve33PoolInfoI;
  tokenId?: number;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [percentage, setPercentage] = React.useState(100);
  const stakeTokenStatus = useVe33V3StakeApproveStatus({
    poolInfo,
    tokenId,
  });
  const { account } = useWalletInfo();
  const fetchStakedContains = useQuery(
    getFetchVE33V3GaugeStakedContainsQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
      tokenId,
    ),
  );

  const {
    isLoading: isLoadingPositionAmounts,
    liquidity,
    tickCurrent,
    tickLower,
    tickUpper,
    sqrtPriceX96,
    amount0Bg,
    amount1Bg,
    refetch: refetchPositionAmounts,
    errorRefetch: errorRefetchPositionAmounts,
  } = useVe33PositionAmounts({
    poolInfo,
    tokenId,
  });
  const isLoading = isLoadingPositionAmounts || fetchStakedContains.isLoading;
  const errorRefetch =
    errorRefetchPositionAmounts || fetchStakedContains.isError
      ? () => {
          errorRefetchPositionAmounts?.();
          if (fetchStakedContains.isError) {
            fetchStakedContains.refetch();
          }
        }
      : undefined;
  const refetch = () => {
    refetchPositionAmounts();
    fetchStakedContains.refetch();
  };

  const addLiquidity =
    !fetchStakedContains.data && liquidity
      ? new BigNumber(liquidity.toString()).times(percentage / 100)
      : null;

  const addAmount0 =
    addLiquidity && tickCurrent
      ? new BigNumber(
          getPositionAmount0({
            tickCurrent,
            tickLower: tickLower!,
            tickUpper: tickUpper!,
            liquidity: addLiquidity?.toString() || '0',
            roundUp: false,
            sqrtRatioX96: sqrtPriceX96,
          }).toString(),
        )
          .div(10 ** poolInfo?.baseToken.decimals!)
          .toString()
      : '';
  const addAmount1 =
    addLiquidity && tickCurrent
      ? new BigNumber(
          getPositionAmount1({
            tickCurrent,
            tickLower: tickLower!,
            tickUpper: tickUpper!,
            liquidity: addLiquidity?.toString() || '0',
            roundUp: false,
            sqrtRatioX96: sqrtPriceX96,
          }).toString(),
        )
          .div(10 ** poolInfo?.quoteToken.decimals!)
          .toString()
      : '';

  const stakeMutation = useVe33V3Stake({
    gaugeAddress: poolInfo?.gaugeAddress,
    tokenId,
    refetch: () => {
      refetch();
      onClose();
    },
  });

  return (
    <>
      {!!errorRefetch && <FailedList refresh={errorRefetch} />}
      <Box
        sx={{
          mt: 20,
          mx: 20,
        }}
      >
        <InputGroup
          baseToken={poolInfo?.baseToken}
          quoteToken={poolInfo?.quoteToken}
          amt0={addAmount0}
          amt1={addAmount1}
          percentage={percentage}
          onChangePercentage={setPercentage}
          overrideBalance0={
            !fetchStakedContains.data ? amount0Bg : new BigNumber(0)
          }
          overrideBalance1={
            !fetchStakedContains.data ? amount1Bg : new BigNumber(0)
          }
          overrideBalanceLoading={isLoading}
          disabled
        />
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          px: 20,
          py: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NeedConnectButton
          fullWidth
          includeButton
          size={Button.Size.big}
          chainId={poolInfo?.chainId}
        >
          <TokenStatusButton
            status={stakeTokenStatus}
            buttonProps={{
              size: Button.Size.big,
              fullWidth: true,
              disabled: fetchStakedContains.data,
            }}
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={!liquidity || !percentage}
              isLoading={stakeMutation.isPending}
              onClick={() => stakeMutation.mutate()}
            >
              <Trans>Stake</Trans>
            </Button>
          </TokenStatusButton>
        </NeedConnectButton>
      </Box>
    </>
  );
}

function UnStakeV3Panel({
  poolInfo,
  tokenId,
  onClose,
}: {
  poolInfo?: Ve33PoolInfoI;
  tokenId?: number;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [percentage, setPercentage] = React.useState(100);
  const { account } = useWalletInfo();
  const fetchStakedContains = useQuery(
    getFetchVE33V3GaugeStakedContainsQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
      tokenId,
    ),
  );

  const {
    isLoading: isLoadingPositionAmounts,
    liquidity,
    tickCurrent,
    tickLower,
    tickUpper,
    sqrtPriceX96,
    amount0Bg,
    amount1Bg,
    refetch: refetchPositionAmounts,
    errorRefetch: errorRefetchPositionAmounts,
  } = useVe33PositionAmounts({
    poolInfo,
    tokenId,
  });
  const isLoading = isLoadingPositionAmounts || fetchStakedContains.isLoading;
  const errorRefetch =
    errorRefetchPositionAmounts || fetchStakedContains.isError
      ? () => {
          errorRefetchPositionAmounts?.();
          if (fetchStakedContains.isError) {
            fetchStakedContains.refetch();
          }
        }
      : undefined;
  const refetch = () => {
    refetchPositionAmounts();
    fetchStakedContains.refetch();
  };

  const removeLiquidity =
    fetchStakedContains.data && liquidity
      ? new BigNumber(liquidity.toString()).times(percentage / 100)
      : null;
  const removeAmount0 =
    removeLiquidity && tickCurrent
      ? new BigNumber(
          getPositionAmount0({
            tickCurrent,
            tickLower: tickLower!,
            tickUpper: tickUpper!,
            liquidity: removeLiquidity?.toString() || '0',
            roundUp: false,
            sqrtRatioX96: sqrtPriceX96,
          }).toString(),
        )
          .div(10 ** poolInfo?.baseToken.decimals!)
          .toString()
      : '';
  const removeAmount1 =
    removeLiquidity && tickCurrent
      ? new BigNumber(
          getPositionAmount1({
            tickCurrent,
            tickLower: tickLower!,
            tickUpper: tickUpper!,
            liquidity: removeLiquidity?.toString() || '0',
            roundUp: false,
            sqrtRatioX96: sqrtPriceX96,
          }).toString(),
        )
          .div(10 ** poolInfo?.quoteToken.decimals!)
          .toString()
      : '';

  const unStakeMutation = useVe33V3UnStake({
    gaugeAddress: poolInfo?.gaugeAddress,
    tokenId,
    refetch: () => {
      refetch();
      onClose();
    },
  });

  const removed = !liquidity;

  return (
    <>
      {!!errorRefetch && <FailedList refresh={errorRefetch} />}
      <Box
        sx={{
          mt: 20,
          mx: 20,
        }}
      >
        <InputGroup
          baseToken={poolInfo?.baseToken}
          quoteToken={poolInfo?.quoteToken}
          amt0={removeAmount0}
          amt1={removeAmount1}
          percentage={percentage}
          onChangePercentage={setPercentage}
          overrideBalance0={
            fetchStakedContains.data ? amount0Bg : new BigNumber(0)
          }
          overrideBalance1={
            fetchStakedContains.data ? amount1Bg : new BigNumber(0)
          }
          overrideBalanceLoading={isLoading}
          disabled
        />
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
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
          chainId={poolInfo?.chainId!}
          disabled={removed || !percentage}
          removed={removed}
          isLoading={unStakeMutation.isPending}
          onConfirm={unStakeMutation.mutate}
          removeText={t`Unstake`}
        />
      </Box>
    </>
  );
}

function StakeV2Panel({
  poolInfo,
  onClose,
}: {
  poolInfo?: Ve33PoolInfoI;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [percentage, setPercentage] = React.useState(100);
  const { account } = useWalletInfo();
  const fetchLiquidity = useQuery(
    getFetchVE33V2PairBalanceOfQueryOptions(
      poolInfo?.chainId,
      poolInfo?.id,
      account,
    ),
  );
  const isLoading = fetchLiquidity.isLoading;
  const errorRefetch = fetchLiquidity.isError
    ? () => {
        if (fetchLiquidity.isError) {
          fetchLiquidity.refetch();
        }
      }
    : undefined;
  const refetch = () => {
    fetchLiquidity.refetch();
  };

  const liquidity = fetchLiquidity.data;
  const addLiquidity = liquidity
    ? new BigNumber(liquidity.toString()).times(percentage / 100)
    : null;

  const stakeTokenStatus = useTokenStatus(
    poolInfo
      ? {
          symbol: `vAMM-${poolInfo.baseToken.symbol}/${poolInfo.quoteToken.symbol}`,
          name: `Volatile AMM - ${poolInfo.baseToken.symbol}/${poolInfo.quoteToken.symbol}`,
          decimals: 18,
          address: poolInfo.id,
          chainId: poolInfo.chainId,
        }
      : null,
    {
      contractAddress: poolInfo?.gaugeAddress,
      amount: addLiquidity?.toString(),
      overrideBalance: liquidity
        ? new BigNumber(liquidity?.toString())
        : undefined,
    },
  );

  const stakeMutation = useVe33V2Stake({
    gaugeAddress: poolInfo?.gaugeAddress,
    amount: addLiquidity?.toString() ?? '',
    refetch: () => {
      refetch();
      onClose();
    },
  });

  return (
    <>
      {!!errorRefetch && <FailedList refresh={errorRefetch} />}
      <Box
        sx={{
          mt: 20,
          mx: 20,
        }}
      >
        <SliderPercentageCard
          disabled={isLoading}
          value={percentage}
          onChange={setPercentage}
          hideNumberInput
          sx={{
            mb: 20,
            px: 20,
          }}
        />
        <TokenLpCard
          tokenPair={[poolInfo?.baseToken, poolInfo?.quoteToken]}
          amt={addLiquidity ? byWei(addLiquidity, 18).toString() : ''}
          decimals={18}
          readOnly
          onInputChange={() => {}}
          overrideBalance={
            liquidity ? new BigNumber(formatUnits(liquidity, 18)) : undefined
          }
          overrideBalanceLoading={isLoading}
        />
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          px: 20,
          py: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NeedConnectButton
          fullWidth
          includeButton
          size={Button.Size.big}
          chainId={poolInfo?.chainId}
        >
          <TokenStatusButton
            status={stakeTokenStatus}
            buttonProps={{
              size: Button.Size.big,
              fullWidth: true,
              disabled: fetchLiquidity.isLoading,
            }}
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={!liquidity || !percentage}
              isLoading={stakeMutation.isPending}
              onClick={() => stakeMutation.mutate()}
            >
              <Trans>Stake</Trans>
            </Button>
          </TokenStatusButton>
        </NeedConnectButton>
      </Box>
    </>
  );
}

function UnStakeV2Panel({
  poolInfo,
  onClose,
}: {
  poolInfo?: Ve33PoolInfoI;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [percentage, setPercentage] = React.useState(100);
  const { account } = useWalletInfo();
  const fetchLiquidity = useQuery(
    getFetchVE33V2GaugeBalanceOfQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
    ),
  );
  const isLoading = fetchLiquidity.isLoading;
  const errorRefetch = fetchLiquidity.isError
    ? () => {
        if (fetchLiquidity.isError) {
          fetchLiquidity.refetch();
        }
      }
    : undefined;
  const refetch = () => {
    fetchLiquidity.refetch();
  };

  const liquidity = fetchLiquidity.data;
  const removeLiquidity = liquidity
    ? new BigNumber(liquidity.toString()).times(percentage / 100)
    : null;

  const unStakeMutation = useVe33V2UnStake({
    gaugeAddress: poolInfo?.gaugeAddress,
    amount: removeLiquidity?.toString() ?? '',
    refetch: () => {
      refetch();
      onClose();
    },
  });

  const removed = !liquidity;

  return (
    <>
      {!!errorRefetch && <FailedList refresh={errorRefetch} />}
      <Box
        sx={{
          mt: 20,
          mx: 20,
        }}
      >
        <SliderPercentageCard
          disabled={isLoading}
          value={percentage}
          onChange={setPercentage}
          hideNumberInput
          sx={{
            px: 20,
          }}
        />
        <TokenLpCard
          tokenPair={[poolInfo?.baseToken, poolInfo?.quoteToken]}
          amt={removeLiquidity ? byWei(removeLiquidity, 18).toString() : ''}
          decimals={18}
          readOnly
          onInputChange={() => {}}
          overrideBalance={
            liquidity ? new BigNumber(formatUnits(liquidity, 18)) : undefined
          }
          overrideBalanceLoading={isLoading}
        />
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
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
          chainId={poolInfo?.chainId!}
          disabled={removed || !percentage}
          removed={removed}
          isLoading={unStakeMutation.isPending}
          onConfirm={unStakeMutation.mutate}
          removeText={t`Unstake`}
        />
      </Box>
    </>
  );
}

function InputGroup({
  amt0,
  amt1,
  percentage,
  onChangePercentage,
  overrideBalance0,
  overrideBalance1,
  overrideBalanceLoading,
  baseToken,
  quoteToken,
  disabled,
}: {
  amt0: string;
  amt1: string;
  percentage: number;
  onChangePercentage: (p: number) => void;
  overrideBalance0: BigNumber | null;
  overrideBalance1: BigNumber | null;
  overrideBalanceLoading: boolean;
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  disabled?: boolean;
}) {
  return (
    <>
      <SliderPercentageCard
        disabled={overrideBalanceLoading || disabled}
        value={percentage}
        onChange={onChangePercentage}
        hideNumberInput
        sx={{
          px: 20,
        }}
      />
      <TokenCard
        sx={{
          mt: 20,
        }}
        token={baseToken}
        amt={amt0}
        showMaxBtn
        showPercentage
        overrideBalance={overrideBalance0}
        overrideBalanceLoading={overrideBalanceLoading}
        readOnly
        onInputChange={() => {}}
      />
      <CardPlusConnected />
      <TokenCard
        token={quoteToken}
        amt={amt1}
        showMaxBtn
        showPercentage
        overrideBalance={overrideBalance1}
        overrideBalanceLoading={overrideBalanceLoading}
        readOnly
        onInputChange={() => {}}
      />
    </>
  );
}

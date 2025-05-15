import { basicTokenMap, ChainId } from '@dodoex/api';
import { Box, Button, LoadingSkeleton, Select } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useLiquidityOperateAmount } from './hooks/useLiquidityOperateAmount';
import SlippageSetting, { useSlipper } from './components/SlippageSetting';
import ComparePrice from './components/ComparePrice';
import OperateBtn from './components/OperateBtn';
import { t, Trans } from '@lingui/macro';
import { useComparePrice } from './hooks/useComparePrice';
import Confirm from '../../../components/Confirm';
import {
  initSliderPercentage,
  RemoveMode,
  usePercentageRemove,
} from './hooks/usePercentageRemove';
import { SliderPercentageCard } from './components/SliderPercentageCard';
import { toWei } from '../../../utils';
import { TokenInfo } from '../../../hooks/Token';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { Ve33PoolInfoI } from '../types';
import { useWithdrawInfo } from './hooks/useWithdrawInfo';
import { useVe33V2BalanceInfo } from './hooks/useVe33V2BalanceInfo';
import { useVe33RemoveLiquidity } from './hooks/useVe33V2RemoveLiquidity';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { getVE33V2RouterContractAddressByChainId } from '@dodoex/dodo-contract-request';

export function RemovePoolOperate({
  submittedBack: submittedBackProps,
  pool,
}: {
  submittedBack?: () => void;
  pool?: Ve33PoolInfoI;
}) {
  const { account } = useWeb3React();

  const balanceInfo = useVe33V2BalanceInfo({
    pool,
    account,
  });

  const baseOverride = balanceInfo.userLpToToken0;
  const quoteOverride = balanceInfo.userLpToToken1;
  const overrideBalanceLoading = balanceInfo.userLpToTokenBalanceLoading;

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: pool?.type,
  });

  const {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount: handleChangeBaseAmountOrigin,
    handleChangeQuoteAmount: handleChangeQuoteAmountOrigin,

    addPortion,
    midPrice,
    amountLoading,
    amountCheckedDisabled,

    reset,
  } = useLiquidityOperateAmount({
    pool,
    maxBaseAmount: baseOverride,
    maxQuoteAmount: quoteOverride,
  });
  const [baseAmountDelay, setBaseAmountDelay] = React.useState('');
  const [quoteAmountDelay, setQuoteAmountDelay] = React.useState('');
  React.useEffect(() => {
    const time = setTimeout(() => {
      setBaseAmountDelay(baseAmount);
    }, 80);
    return () => clearTimeout(time);
  }, [baseAmount]);
  React.useEffect(() => {
    const time = setTimeout(() => {
      setQuoteAmountDelay(quoteAmount);
    }, 80);
    return () => clearTimeout(time);
  }, [quoteAmount]);
  const handleChangeBaseAmount = (amount: string) => {
    handleChangeBaseAmountOrigin(amount);
  };
  const handleChangeQuoteAmount = (amount: string) => {
    handleChangeQuoteAmountOrigin(amount);
  };

  const basicToken = pool?.chainId
    ? basicTokenMap[pool.chainId as ChainId]
    : undefined;
  const basicAddressLow = basicToken?.address?.toLowerCase();
  const basicWrappedAddressLow = basicToken?.wrappedTokenAddress?.toLowerCase();
  const isBaseEther =
    !!pool &&
    [basicAddressLow, basicWrappedAddressLow].includes(
      pool.baseToken.address.toLowerCase(),
    );
  const isQuoteEther =
    !!pool &&
    [basicAddressLow, basicWrappedAddressLow].includes(
      pool.quoteToken.address.toLowerCase(),
    );
  const canWithdrawBasicToken = pool && (isBaseEther || isQuoteEther);
  const [receiveWrapped, setReceiveWrapped] = React.useState(false);

  const withdrawBaseToken =
    canWithdrawBasicToken && isBaseEther && !receiveWrapped && basicToken
      ? pool
        ? {
            ...pool.baseToken,
            symbol: basicToken.symbol,
            address: basicToken.address,
          }
        : undefined
      : pool?.baseToken;
  const withdrawQuoteToken =
    canWithdrawBasicToken && isQuoteEther && !receiveWrapped && basicToken
      ? pool
        ? {
            ...pool.quoteToken,
            symbol: basicToken.symbol,
            address: basicToken.address,
          }
        : undefined
      : pool?.quoteToken;

  const withdrawInfo = useWithdrawInfo({
    pool: pool
      ? {
          chainId: pool.chainId,
          address: pool.id,
          baseToken: withdrawBaseToken as TokenInfo,
          quoteToken: withdrawQuoteToken as TokenInfo,
        }
      : pool,
    baseAmount: baseAmountDelay,
    quoteAmount: quoteAmountDelay,
  });

  const {
    mode,
    modeOptions,
    handleChangeMode,

    sliderPercentage,
    handleChangeSliderPercentage,

    // resetPercentage,
  } = usePercentageRemove({
    pool,
    baseOverride,
    quoteOverride,
    resetAmount: reset,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
  });

  const prevPool = usePrevious(pool);
  React.useEffect(() => {
    if (pool?.id !== prevPool?.id) {
      reset();
      resetSlipper();
      handleChangeMode(RemoveMode.percentage);
      handleChangeSliderPercentage(initSliderPercentage);
    }
  }, [pool]);
  React.useEffect(() => {
    if (mode === RemoveMode.percentage) {
      handleChangeSliderPercentage(sliderPercentage);
    }
  }, [baseOverride?.toString(), quoteOverride?.toString()]);

  const canOperate = Boolean(pool && account);
  const [showCompareConfirm, setShowCompareConfirm] = React.useState(false);
  const { isShowCompare, lqAndDodoCompareText, isWarnCompare } =
    useComparePrice(pool?.baseToken, pool?.quoteToken, midPrice);

  const proxyContract = pool
    ? getVE33V2RouterContractAddressByChainId(pool?.chainId)
    : undefined;
  const lpTokenStatus = useTokenStatus(
    pool?.baseToken
      ? {
          ...pool.baseToken,
          decimals: 18,
          symbol: `${pool.baseToken.symbol}/${pool.quoteToken?.symbol} LP`,
          address: pool?.id,
        }
      : undefined,
    {
      amount: balanceInfo.userLp,
      contractAddress: proxyContract,
      skipQuery: !proxyContract,
    },
  );
  const isOverBalance = lpTokenStatus.insufficientBalance;
  const disabled =
    !pool ||
    isOverBalance ||
    !midPrice ||
    balanceInfo.userLpToTokenBalanceLoading ||
    amountCheckedDisabled ||
    !!withdrawInfo.receiveAmountBg?.lte(0);

  const submitBtnText = isOverBalance ? t`Insufficient balance` : t`Remove`;

  const submittedBack = () => {
    reset();
    resetSlipper();
    if (submittedBackProps) {
      submittedBackProps();
    }
  };
  const liquidityDecimals = 18;
  const liquidityAmountBg = balanceInfo.userLp?.times(sliderPercentage / 100);
  const liquidityAmountWei =
    liquidityAmountBg && liquidityDecimals !== undefined
      ? toWei(liquidityAmountBg, liquidityDecimals).toString()
      : '';
  const removeLiquidityMutataion = useVe33RemoveLiquidity({
    baseToken: withdrawBaseToken,
    quoteToken: withdrawQuoteToken,
    baseAmount,
    quoteAmount,
    liquidityAmount: liquidityAmountWei,
    slippage: slipperValue,
    stable: !!pool?.stable,
    submittedBack,
    successBack: () => {
      balanceInfo.refetch();
    },
  });
  const submitLq = () => {
    return removeLiquidityMutataion.mutate();
  };

  return (
    <>
      <Box
        sx={{
          pb: 18,
          px: 20,
        }}
      >
        <Box
          sx={{
            pt: 20,
          }}
        >
          <SliderPercentageCard
            disabled={balanceInfo.userLpToTokenBalanceLoading || !canOperate}
            value={sliderPercentage}
            onChange={handleChangeSliderPercentage}
          />
        </Box>
        <LoadingSkeleton
          loading={balanceInfo.userLpToTokenBalanceLoading || amountLoading}
          sx={{
            mt: 8,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {canWithdrawBasicToken && (
              <Box
                sx={{
                  px: 12,
                  py: 4,
                  borderRadius: 20,
                  borderWidth: 1,
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                  cursor: 'pointer',
                  typography: 'body2',
                  '&:hover': {
                    backgroundColor: 'hover.default',
                  },
                }}
                component="button"
                onClick={() => setReceiveWrapped((prev) => !prev)}
              >
                <Trans>
                  Receive{' '}
                  {receiveWrapped
                    ? basicToken?.symbol
                    : basicToken?.wrappedTokenSymbol}
                </Trans>
              </Box>
            )}
            <SlippageSetting
              value={slipper}
              onChange={setSlipper}
              disabled={!canOperate}
              type={pool?.type}
              sx={{
                margin: 0,
              }}
            />
          </Box>
        </LoadingSkeleton>
        {!!pool && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 20,
              mb: 14,
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: 'text.secondary',
                position: 'relative',
                top: 2,
              }}
            >
              <Trans>Receive</Trans>
            </Box>
            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              {withdrawInfo.receiveList.map((receive, index) => (
                <Box
                  key={receive.symbol}
                  sx={{
                    mt: index > 0 ? 4 : 0,
                  }}
                >
                  <LoadingSkeleton
                    component="span"
                    loadingSx={{
                      mr: 8,
                      width: 100,
                    }}
                    sx={{
                      display: 'inline-block',
                      typography: 'h5',
                      fontWeight: 600,
                      color:
                        withdrawInfo.receiveBaseAmount &&
                        withdrawInfo.receiveBaseAmount !== '0'
                          ? 'primary.main'
                          : 'text.primary',
                    }}
                  >
                    {receive.amount}&nbsp;
                  </LoadingSkeleton>
                  <Box
                    component="span"
                    sx={{
                      typography: 'body2',
                    }}
                  >
                    {receive.symbol}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      {/* footer */}
      <Box
        sx={{
          px: 20,
          py: 16,
          position: 'sticky',
          bottom: 0,
          borderStyle: 'solid',
          borderWidth: '1px 0 0',
          borderColor: 'border.main',
          backgroundColor: 'background.paper',
        }}
      >
        {isShowCompare && (
          <ComparePrice
            baseToken={pool?.baseToken}
            quoteToken={pool?.quoteToken}
            lqAndDodoCompareText={lqAndDodoCompareText}
            midPrice={midPrice}
          />
        )}
        {pool ? (
          <OperateBtn chainId={pool.chainId} baseTokenStatus={lpTokenStatus}>
            <Button
              fullWidth
              disabled={disabled}
              danger={isWarnCompare}
              isLoading={removeLiquidityMutataion.isPending}
              onClick={() => {
                if (disabled) return;
                if (isWarnCompare) {
                  setShowCompareConfirm(true);
                  return;
                }
                submitLq();
              }}
            >
              {submitBtnText}
            </Button>
          </OperateBtn>
        ) : (
          <Button fullWidth disabled>
            {submitBtnText}
          </Button>
        )}
      </Box>
      <Confirm
        open={showCompareConfirm}
        onClose={() => setShowCompareConfirm(false)}
        title={t`Confirm submission`}
        onConfirm={submitLq}
        modal
      >
        <Box>
          <Box>
            {t`Price discrepancy ${lqAndDodoCompareText} between liquidity pool and the quote price on DODO.`}
          </Box>
          <Box>
            {t`There is risk of being arbitraged if adding this liquidity.`}
          </Box>
        </Box>
      </Confirm>
    </>
  );
}

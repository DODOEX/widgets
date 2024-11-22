import { basicTokenMap, ChainId, PoolApi } from '@dodoex/api';
import { Box, Button, LoadingSkeleton, Select } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import {
  CardPlus,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useLiquidityOperateAmount } from './hooks/useLiquidityOperateAmount';
import Ratio from './components/Ratio';
import SlippageSetting, { useSlipper } from './components/SlippageSetting';
import ComparePrice from './components/ComparePrice';
import { OperatePool } from './types';
import OperateBtn from './components/OperateBtn';
import { t, Trans } from '@lingui/macro';
import { useComparePrice } from './hooks/useComparePrice';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import Confirm from '../../../components/Confirm';
import { useOperateLiquidity } from '../hooks/contract/useOperateLiquidity';
import { SLIPPAGE_PROTECTION } from '../../../constants/pool';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import { useRemoveLiquidityTokenStatus } from './hooks/useRemoveLiquidityTokenStatus';
import { useCheckToken } from './hooks/useCheckToken';
import {
  initSliderPercentage,
  RemoveMode,
  usePercentageRemove,
} from './hooks/usePercentageRemove';
import { useWithdrawInfo } from '../hooks/contract/useWithdrawInfo';
import TokenList from './components/TokenList';
import { SliderPercentageCard } from './components/SliderPercentageCard';
import { useAMMV2RemoveLiquidity } from '../hooks/useAMMV2RemoveLiquidity';
import { useQuery } from '@tanstack/react-query';
import { poolApi } from '../utils';
import { toWei } from '../../../utils';
import { TokenInfo } from '../../../hooks/Token';

export function RemovePoolOperate({
  submittedBack: submittedBackProps,
  onlyShowSide,
  pool,
  balanceInfo,
}: {
  submittedBack?: () => void;
  onlyShowSide?: 'base' | 'quote';
  pool?: OperatePool;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
}) {
  const { account } = useWeb3React();
  const baseOverride = balanceInfo.userBaseLpToTokenBalance;
  const quoteOverride = balanceInfo.userQuoteLpToTokenBalance;
  const overrideBalanceLoading = balanceInfo.loading;

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: pool?.address,
  });

  const { isBase, checkToken, checkTokenType, setCheckToken } =
    useCheckToken(pool);

  const {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount: handleChangeBaseAmountOrigin,
    handleChangeQuoteAmount: handleChangeQuoteAmountOrigin,

    addPortion,
    midPrice,
    amountLoading,
    amountCheckedDisabled,
    uniV2Pair,

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

  const isAMMV2 = pool?.type === 'AMMV2';
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
  const canWithdrawBasicToken =
    isAMMV2 && pool && (isBaseEther || isQuoteEther);
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
          ...pool,
          baseToken: withdrawBaseToken as TokenInfo,
          quoteToken: withdrawQuoteToken as TokenInfo,
        }
      : pool,
    isBase,
    baseAmount: baseAmountDelay,
    quoteAmount: quoteAmountDelay,
  });

  const {
    mode,
    modeOptions,
    handleChangeMode,

    sliderPercentage,
    handleChangeSliderPercentage,

    resetPercentage,
  } = usePercentageRemove({
    isBase,
    pool,
    baseOverride,
    quoteOverride,
    resetAmount: reset,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
  });

  React.useEffect(() => {
    reset();
    resetPercentage();
  }, [checkTokenType]);
  React.useEffect(() => {
    reset();
    resetSlipper();
    handleChangeMode(RemoveMode.percentage);
    handleChangeSliderPercentage(initSliderPercentage);
  }, [pool]);
  React.useEffect(() => {
    if (mode === RemoveMode.percentage) {
      handleChangeSliderPercentage(sliderPercentage);
    }
  }, [baseOverride?.toString(), quoteOverride?.toString()]);

  const canOperate = PoolApi.utils.canOperateLiquidity(
    pool?.type,
    undefined,
    pool?.creator,
    account,
  );

  const [showCompareConfirm, setShowCompareConfirm] = React.useState(false);
  const { isShowCompare, lqAndDodoCompareText, isWarnCompare } =
    useComparePrice(pool?.baseToken, pool?.quoteToken, midPrice);

  const feeRateQuery = useQuery(
    poolApi.getFeeRateQuery(pool?.chainId, pool?.address, pool?.type, account),
  );
  const feeRate = feeRateQuery.data?.mtFeeRate
    ?.plus(feeRateQuery.data?.lpFeeRate ?? 0)
    ?.toNumber();

  const { baseTokenStatus, quoteTokenStatus } = useRemoveLiquidityTokenStatus({
    pool,
    baseAmount,
    quoteAmount,
    balanceInfo,
  });
  const isOverBalance =
    baseTokenStatus.insufficientBalance || quoteTokenStatus.insufficientBalance;
  const { isSinglePool } = balanceInfo;
  const disabled =
    !pool ||
    isOverBalance ||
    !midPrice ||
    !!balanceInfo.loading ||
    !!balanceInfo.error ||
    amountCheckedDisabled ||
    !!withdrawInfo.error ||
    withdrawInfo.loading ||
    !!withdrawInfo.receiveAmountBg?.lte(0) ||
    feeRateQuery.isLoading;

  const submitBtnText = isOverBalance ? t`Insufficient balance` : t`Remove`;

  const submittedBack = () => {
    reset();
    resetSlipper();
    if (submittedBackProps) {
      submittedBackProps();
    }
  };
  const liquidityDecimals = uniV2Pair?.pair?.liquidityToken.decimals;
  const liquidityAmountBg = balanceInfo.totalBaseLpBalance?.times(
    sliderPercentage / 100,
  );
  const liquidityAmountWei =
    liquidityAmountBg && liquidityDecimals !== undefined
      ? toWei(liquidityAmountBg, liquidityDecimals).toString()
      : '';
  const { operateLiquidityMutation } = useOperateLiquidity(pool);
  const removeAMMV2LiquidityMutataion = useAMMV2RemoveLiquidity({
    baseToken: withdrawBaseToken,
    quoteToken: withdrawQuoteToken,
    baseAmount,
    quoteAmount,
    liquidityAmount: liquidityAmountWei,
    slippage: slipperValue,
    fee: feeRate,
    successBack: submittedBack,
  });
  const submitLq = () => {
    if (isAMMV2) {
      return removeAMMV2LiquidityMutataion.mutate();
    }
    operateLiquidityMutation.mutate({
      txTitle: t`Remove Liquidity`,
      isRemove: true,
      baseAmount,
      quoteAmount,
      slippageProtection: slipperValue,
      balanceInfo,
      SLIPPAGE_PROTECTION,
      submittedBack,
    });
  };

  const baseTokenBalanceUpdateLoading = false;
  const quoteBalanceUpdateLoading = false;

  return (
    <>
      <Box
        sx={{
          pb: 18,
          px: 20,
        }}
      >
        {!isAMMV2 && (
          <Box
            sx={{
              mt: 20,
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 12,
            }}
          >
            <Select
              value={mode}
              options={modeOptions}
              onChange={(_, value) => handleChangeMode(value as RemoveMode)}
              popupOffset={0}
              sx={{
                px: 20,
                py: 12,
                width: '100%',
                backgroundColor: 'transparent',
              }}
            />
            {!!pool && PoolApi.utils.singleSideLp(pool.type) && (
              <Box
                sx={{
                  pt: 20,
                  pb: 13,
                  px: 20,
                  borderStyle: 'solid',
                  borderWidth: '1px 0 0',
                }}
              >
                <TokenList
                  pool={pool}
                  balanceInfo={balanceInfo}
                  checkTokenType={checkTokenType}
                  setCheckToken={setCheckToken}
                  baseTokenBalanceUpdateLoading={baseTokenBalanceUpdateLoading}
                  quoteBalanceUpdateLoading={quoteBalanceUpdateLoading}
                />
              </Box>
            )}
          </Box>
        )}
        <Box
          sx={{
            pt: 20,
          }}
        >
          {mode === RemoveMode.percentage ? (
            <SliderPercentageCard
              disabled={balanceInfo.loading || !canOperate}
              value={sliderPercentage}
              onChange={handleChangeSliderPercentage}
            />
          ) : checkToken ? (
            <TokenCard
              amt={isBase ? baseAmount : quoteAmount}
              token={checkToken}
              canClickBalance
              showPercentage
              onInputChange={
                isBase ? handleChangeBaseAmount : handleChangeQuoteAmount
              }
              readOnly={balanceInfo.loading || !canOperate}
              overrideBalance={isBase ? baseOverride : quoteOverride}
              overrideBalanceLoading={overrideBalanceLoading}
            />
          ) : (
            <>
              <TokenCard
                amt={baseAmount}
                token={pool?.baseToken}
                canClickBalance
                showPercentage
                onInputChange={handleChangeBaseAmount}
                readOnly={balanceInfo.loading || !canOperate}
                overrideBalance={baseOverride}
                overrideBalanceLoading={overrideBalanceLoading}
              />
              {onlyShowSide ? '' : <CardPlus />}
              {onlyShowSide === 'base' ? (
                ''
              ) : (
                <TokenCard
                  amt={quoteAmount}
                  token={pool?.quoteToken}
                  canClickBalance
                  showPercentage
                  onInputChange={handleChangeQuoteAmount}
                  readOnly={balanceInfo.loading || !canOperate || isSinglePool}
                  overrideBalance={quoteOverride}
                  overrideBalanceLoading={overrideBalanceLoading}
                />
              )}
            </>
          )}
        </Box>
        <LoadingSkeleton
          loading={balanceInfo.loading || amountLoading}
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
            {isAMMV2 && canWithdrawBasicToken && (
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
          <Ratio
            pool={pool as OperatePool}
            addPortion={addPortion}
            midPrice={midPrice}
            shareOfPool={uniV2Pair?.shareOfPool}
          />
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
                    loading={withdrawInfo.loading}
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
          <OperateBtn
            chainId={pool.chainId}
            baseTokenStatus={baseTokenStatus}
            quoteTokenStatus={quoteTokenStatus}
          >
            <Button
              fullWidth
              disabled={disabled}
              danger={isWarnCompare}
              isLoading={operateLiquidityMutation.isPending}
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
      <ErrorMessageDialog
        message={operateLiquidityMutation.error?.message}
        onClose={() => operateLiquidityMutation.reset()}
      />
    </>
  );
}

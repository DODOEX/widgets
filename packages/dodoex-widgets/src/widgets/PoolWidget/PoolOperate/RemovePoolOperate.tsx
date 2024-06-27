import { PoolApi } from '@dodoex/api';
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

    reset,
  } = useLiquidityOperateAmount({
    pool,
    maxBaseAmount: baseOverride,
    maxQuoteAmount: quoteOverride,
  });
  const [baseAmountDelay, setBaseAmountDelay] = React.useState('');
  const [quoteAmountDelay, setQuoteAmountDelay] = React.useState('');
  const setDelayAmount = React.useCallback(() => {
    const time = setTimeout(() => {
      setBaseAmountDelay(baseAmount);
      setQuoteAmountDelay(quoteAmount);
    }, 80);
    return () => clearTimeout(time);
  }, [baseAmount, quoteAmount]);
  const handleChangeBaseAmount = (amount: string) => {
    handleChangeBaseAmountOrigin(amount);
    setDelayAmount();
  };
  const handleChangeQuoteAmount = (amount: string) => {
    handleChangeQuoteAmountOrigin(amount);
    setDelayAmount();
  };

  const withdrawInfo = useWithdrawInfo({
    pool,
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
    !!withdrawInfo.receiveAmountBg?.lte(0);

  const submitBtnText = isOverBalance ? t`Insufficient balance` : t`Remove`;

  const submittedBack = () => {
    reset();
    resetSlipper();
    if (submittedBackProps) {
      submittedBackProps();
    }
  };
  const { operateLiquidityMutation } = useOperateLiquidity(pool);
  const submitLq = () => {
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

  const receiveList = [] as any;

  return (
    <>
      <Box
        sx={{
          pt: 20,
          pb: 18,
          px: 20,
        }}
      >
        <Box
          sx={{
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Select
            fullWidth
            value={mode}
            options={modeOptions}
            onChange={(_, value) => handleChangeMode(value as RemoveMode)}
            notBackground
            popupOffset={0}
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
              showMaxBtn
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
                showMaxBtn
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
                  showMaxBtn
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
          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            disabled={!canOperate}
          />
          <Ratio
            pool={pool as OperatePool}
            addPortion={addPortion}
            midPrice={midPrice}
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
          pt: 16,
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

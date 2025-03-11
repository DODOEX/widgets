import { Box, Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import { AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION } from '../../../constants/pool';
import { AUTO_SWAP_SLIPPAGE_PROTECTION } from '../../../constants/swap';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import Ratio from '../AMMV2Create/Ratio';
import Setting from '../AMMV2Create/Setting';
import { useAMMV2RemoveLiquidity } from '../hooks/useAMMV2RemoveLiquidity';
import { useUniV2Pairs } from '../hooks/useUniV2Pairs';
import OperateBtn from './components/OperateBtn';
import { SliderPercentageCard } from './components/SliderPercentageCard';
import { RemoveMode, usePercentageRemove } from './hooks/usePercentageRemove';
import { OperatePool } from './types';

export function RemovePoolOperate({
  submittedBack: submittedBackProps,
  pool,
}: {
  submittedBack?: () => void;
  pool?: OperatePool;
}) {
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');

  const [slippage, setSlippage] = React.useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);
  const slippageNumber =
    slippage === AUTO_SWAP_SLIPPAGE_PROTECTION
      ? new BigNumber(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)
          .div(100)
          .toNumber()
      : slippage;

  const {
    isFront,
    price,
    invertedPrice,
    poolInfoQuery,
    lpBalanceQuery,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,
    liquidityMinted,
    pairMintAAmount,
    pairMintBAmount,
    isExists,
  } = useUniV2Pairs({
    pool:
      pool?.baseToken && pool.quoteToken
        ? {
            baseToken: pool.baseToken,
            quoteToken: pool.quoteToken,
            address: pool.address,
          }
        : undefined,
    baseAmount: undefined,
    quoteAmount: undefined,
    slippage: 0,
  });

  const {
    mode,
    modeOptions,
    handleChangeMode,

    sliderPercentage,
    handleChangeSliderPercentage,

    resetPercentage,
  } = usePercentageRemove({
    isBase: true,
    pool,
    baseOverride: lpToAmountA,
    quoteOverride: lpToAmountB,
  });

  const baseTokenStatus = useTokenStatus(pool?.baseToken, {
    amount: baseAmount,
  });
  const quoteTokenStatus = useTokenStatus(pool?.quoteToken, {
    amount: quoteAmount,
  });

  // const isOverBalance =
  //   baseTokenStatus.insufficientBalance || quoteTokenStatus.insufficientBalance;
  const isOverBalance = false;
  const disabled =
    !pool ||
    isOverBalance ||
    !!poolInfoQuery.isLoading ||
    !!poolInfoQuery.error ||
    !!lpBalanceQuery.error ||
    lpBalanceQuery.isLoading;

  const submitBtnText = isOverBalance ? t`Insufficient balance` : t`Remove`;

  const submittedBack = () => {
    if (submittedBackProps) {
      submittedBackProps();
    }
  };

  const removeAMMV2LiquidityMutation = useAMMV2RemoveLiquidity({
    liquidityAmount: lpBalance?.times(sliderPercentage / 100),
    slippage: slippageNumber,
    poolKeys: poolInfoQuery.data?.poolKeys,
    poolInfo: poolInfoQuery.data?.poolInfo,
    submittedBack,
  });

  const needToken = !pool?.baseToken || !pool?.quoteToken;

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
          {mode === RemoveMode.percentage ? (
            <SliderPercentageCard
              disabled={
                poolInfoQuery.isLoading || !lpBalance || lpBalance.lte(0)
              }
              value={sliderPercentage}
              onChange={handleChangeSliderPercentage}
            />
          ) : (
            <>
              {/* <TokenCard
                sx={{ mb: 4, pb: 28, minHeight: 'auto' }}
                amt={baseAmount}
                token={pool?.baseToken}
                canClickBalance
                showPercentage
                onInputChange={handleChangeBaseAmount}
                readOnly={balanceInfo.loading || !canOperate}
                overrideBalance={baseOverride}
                overrideBalanceLoading={overrideBalanceLoading}
              />

              <SwitchBox plus />

              <TokenCard
                sx={{ pb: 20, minHeight: 'auto' }}
                amt={quoteAmount}
                token={pool?.quoteToken}
                canClickBalance
                showPercentage
                onInputChange={handleChangeQuoteAmount}
                readOnly={balanceInfo.loading || !canOperate || isSinglePool}
                overrideBalance={quoteOverride}
                overrideBalanceLoading={overrideBalanceLoading}
              /> */}
            </>
          )}
        </Box>

        <Setting
          slippage={slippage}
          onChangeSlippage={setSlippage}
          disabled={needToken}
          sx={{
            mt: 8,
          }}
        />
        <Ratio
          baseToken={pool?.baseToken}
          quoteToken={pool?.quoteToken}
          loading={poolInfoQuery.isLoading}
          midPrice={isFront ? price : invertedPrice}
          lpBalancePercentage={isExists ? lpBalancePercentage : 100}
        />
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
        {pool ? (
          <OperateBtn
            chainId={pool.chainId}
            baseTokenStatus={baseTokenStatus}
            quoteTokenStatus={quoteTokenStatus}
          >
            <Button
              fullWidth
              disabled={disabled}
              isLoading={removeAMMV2LiquidityMutation.isPending}
              onClick={() => {
                if (disabled) return;
                removeAMMV2LiquidityMutation.mutate();
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

      <ErrorMessageDialog
        message={removeAMMV2LiquidityMutation.error?.message}
        onClose={() => removeAMMV2LiquidityMutation.reset()}
      />
    </>
  );
}

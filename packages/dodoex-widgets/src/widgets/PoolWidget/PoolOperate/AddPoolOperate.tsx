import { Box, Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import React from 'react';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import { SwitchBox } from '../../../components/Swap/components/SwitchBox';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import ConfirmDialog from '../AMMV2Create/ConfirmDialog';
import Ratio from '../AMMV2Create/Ratio';
import Setting from '../AMMV2Create/Setting';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import OperateBtn from './components/OperateBtn';
import { useLiquidityOperateAmount } from './hooks/useLiquidityOperateAmount';
import { OperatePool } from './types';

export function AddPoolOperate({
  submittedBack: submittedBackProps,
  pool,
}: {
  submittedBack?: () => void;
  pool?: OperatePool;
}) {
  const isAMMV2 = pool?.type === 'SVM_AMMV2';

  const [showConfirmAMMV2, setShowConfirmAMMV2] = React.useState(false);

  const {
    baseAmount,
    quoteAmount,
    midPrice,
    amountCheckedDisabled,
    uniV2Pair,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,
    reset,
    slippage,
    slippageNumber,
    setSlippage,
  } = useLiquidityOperateAmount({
    pool,
  });

  React.useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  const baseTokenStatus = useTokenStatus(pool?.baseToken, {
    amount: baseAmount,
  });
  const quoteTokenStatus = useTokenStatus(pool?.quoteToken, {
    amount: quoteAmount,
  });

  const isOverBalance =
    baseTokenStatus.insufficientBalance || quoteTokenStatus.insufficientBalance;

  const disabled =
    !pool ||
    isOverBalance ||
    !midPrice ||
    !!uniV2Pair.poolInfoQuery.isLoading ||
    !!uniV2Pair.poolInfoQuery.error ||
    amountCheckedDisabled ||
    uniV2Pair.poolInfoQuery.isLoading;

  let submitBtnText = isAMMV2 ? t`Supply` : t`Add`;
  if (isOverBalance) {
    submitBtnText = t`Insufficient balance`;
  }

  const operateAMMV2LiquidityMutation = useAMMV2AddLiquidity({
    baseToken: pool?.baseToken,
    quoteToken: pool?.quoteToken,
    pairMintAAmount: uniV2Pair.pairMintAAmount,
    pairMintBAmount: uniV2Pair.pairMintBAmount,
    isExists: uniV2Pair.isExists,
    poolKeys: uniV2Pair.poolInfoQuery.data?.poolKeys,
    poolInfo: uniV2Pair.poolInfoQuery.data?.poolInfo,
    slippage: slippageNumber,
    submittedBack: () => {
      reset();
      if (submittedBackProps) {
        submittedBackProps();
      }
      setShowConfirmAMMV2(false);
    },
  });

  const needToken = !pool?.baseToken || !pool?.quoteToken;
  return (
    <>
      <Box
        sx={{
          pt: 20,
          pb: 18,
          px: 20,
        }}
      >
        <TokenCard
          sx={{ mb: 4, pb: 28, minHeight: 'auto' }}
          amt={baseAmount}
          token={pool?.baseToken}
          canClickBalance
          showPercentage
          onInputChange={handleChangeBaseAmount}
          readOnly={uniV2Pair.poolInfoQuery.isLoading}
        />

        <SwitchBox plus />

        <TokenCard
          sx={{ pb: 20, minHeight: 'auto' }}
          amt={quoteAmount}
          token={pool?.quoteToken}
          canClickBalance
          showPercentage
          onInputChange={handleChangeQuoteAmount}
          readOnly={uniV2Pair.poolInfoQuery.isLoading}
        />

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
          loading={uniV2Pair.poolInfoQuery.isLoading}
          midPrice={midPrice}
          lpBalancePercentage={
            uniV2Pair.isExists ? uniV2Pair.lpBalancePercentage : 100
          }
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
              isLoading={operateAMMV2LiquidityMutation.isPending}
              onClick={() => {
                if (disabled) return;
                setShowConfirmAMMV2(true);
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
        message={operateAMMV2LiquidityMutation.error?.message}
        onClose={() => operateAMMV2LiquidityMutation.reset()}
      />

      {isAMMV2 && !!pool && (
        <ConfirmDialog
          open={showConfirmAMMV2}
          onClose={() => setShowConfirmAMMV2(false)}
          slippage={slippageNumber}
          baseToken={pool.baseToken}
          quoteToken={pool.quoteToken}
          pairMintAAmount={uniV2Pair.pairMintAAmount}
          pairMintBAmount={uniV2Pair.pairMintBAmount}
          feeRate={pool.lpFeeRate}
          price={uniV2Pair?.price}
          lpAmount={uniV2Pair?.liquidityMinted}
          lpBalancePercentage={
            uniV2Pair.isExists ? uniV2Pair.lpBalancePercentage : 100
          }
          pairAddress={pool.address}
          createMutation={operateAMMV2LiquidityMutation}
        />
      )}
    </>
  );
}

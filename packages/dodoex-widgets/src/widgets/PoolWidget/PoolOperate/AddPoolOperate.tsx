import { PoolApi } from '@dodoex/api';
import { Box, Button, LoadingSkeleton } from '@dodoex/components';
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
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { t } from '@lingui/macro';
import { useComparePrice } from './hooks/useComparePrice';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import Confirm from '../../../components/Confirm';
import { useOperateLiquidity } from '../hooks/contract/useOperateLiquidity';
import { SLIPPAGE_PROTECTION } from '../../../constants/pool';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';

export function AddPoolOperate({
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
  const {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,

    addPortion,
    midPrice,
    amountLoading,
    amountCheckedDisabled,

    reset,
  } = useLiquidityOperateAmount({
    pool,
  });
  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: pool?.address,
  });

  React.useEffect(() => {
    reset();
    resetSlipper();
  }, [pool]);

  const canOperate = PoolApi.utils.canOperateLiquidity(
    pool?.type,
    undefined,
    pool?.creator,
    account,
  );

  const [showCompareConfirm, setShowCompareConfirm] = React.useState(false);
  const { isShowCompare, lqAndDodoCompareText, isWarnCompare } =
    useComparePrice(pool?.baseToken, pool?.quoteToken, midPrice);

  const baseTokenStatus = useTokenStatus(pool?.baseToken, {
    amount: baseAmount,
  });
  const quoteTokenStatus = useTokenStatus(pool?.quoteToken, {
    amount: quoteAmount,
  });

  const isOverBalance =
    baseTokenStatus.insufficientBalance || quoteTokenStatus.insufficientBalance;
  const { isSinglePool } = balanceInfo;
  const disabled =
    !pool ||
    isOverBalance ||
    !midPrice ||
    !balanceInfo.loading ||
    !balanceInfo.error ||
    amountCheckedDisabled;

  const submitBtnText = isOverBalance ? t`Insufficient balance` : t`Add`;

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
      txTitle: t`Add Liquidity`,
      isRemove: false,
      baseAmount,
      quoteAmount,
      slippageProtection: slipperValue,
      balanceInfo,
      SLIPPAGE_PROTECTION,
      submittedBack,
    });
  };

  return (
    <>
      <Box
        sx={{
          pt: 20,
          pb: 18,
          px: 20,
        }}
      >
        {onlyShowSide === 'quote' ? (
          ''
        ) : (
          <TokenCard
            amt={baseAmount}
            token={pool?.baseToken}
            showMaxBtn
            onInputChange={handleChangeBaseAmount}
            readOnly={balanceInfo.loading || !canOperate}
          />
        )}
        {onlyShowSide ? '' : <CardPlus />}
        {onlyShowSide === 'base' ? (
          ''
        ) : (
          <TokenCard
            amt={quoteAmount}
            token={pool?.quoteToken}
            showMaxBtn
            onInputChange={handleChangeQuoteAmount}
            readOnly={balanceInfo.loading || !canOperate || isSinglePool}
          />
        )}
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

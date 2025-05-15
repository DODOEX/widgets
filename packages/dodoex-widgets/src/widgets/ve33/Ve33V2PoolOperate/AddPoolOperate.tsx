import { Box, Button, LoadingSkeleton } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import {
  CardPlus,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useLiquidityOperateAmount } from './hooks/useLiquidityOperateAmount';
import SlippageSetting, { useSlipper } from './components/SlippageSetting';
import ComparePrice from './components/ComparePrice';
import OperateBtn from './components/OperateBtn';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { t } from '@lingui/macro';
import { useComparePrice } from './hooks/useComparePrice';
import Confirm from '../../../components/Confirm';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { Ve33PoolInfoI } from '../types';
import { useVe33AddLiquidity } from './hooks/useVe33V2AddLiquidity';
import V2ConfirmDialog from './components/V2ConfirmDialog';
import { getVE33V2RouterContractAddressByChainId } from '@dodoex/dodo-contract-request';
import BigNumber from 'bignumber.js';

export function AddPoolOperate({
  submittedBack: submittedBackProps,
  onlyShowSide,
  pool,
}: {
  submittedBack?: () => void;
  onlyShowSide?: 'base' | 'quote';
  pool?: Ve33PoolInfoI;
}) {
  const { account } = useWeb3React();
  const {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,

    midPrice,
    amountLoading,
    amountCheckedDisabled,
    balanceInfo,

    reset,
  } = useLiquidityOperateAmount({
    pool,
  });
  const [showConfirmAMMV2, setShowConfirmAMMV2] = React.useState(false);
  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: pool?.type,
  });

  const prevPool = usePrevious(pool);
  React.useEffect(() => {
    if (pool?.id !== prevPool?.id) {
      reset();
      resetSlipper();
    }
  }, [pool]);

  const canOperate = Boolean(pool && account);
  const [showCompareConfirm, setShowCompareConfirm] = React.useState(false);
  const { isShowCompare, lqAndDodoCompareText, isWarnCompare } =
    useComparePrice(pool?.baseToken, pool?.quoteToken, midPrice);

  const proxyContract = pool
    ? getVE33V2RouterContractAddressByChainId(pool?.chainId)
    : undefined;
  const baseTokenStatus = useTokenStatus(pool?.baseToken, {
    amount: baseAmount,
    contractAddress: proxyContract,
  });
  const quoteTokenStatus = useTokenStatus(pool?.quoteToken, {
    amount: quoteAmount,
    contractAddress: proxyContract,
  });

  const loading = balanceInfo.userLpToTokenBalanceLoading;

  const isOverBalance =
    baseTokenStatus.insufficientBalance || quoteTokenStatus.insufficientBalance;
  const disabled =
    !pool ||
    isOverBalance ||
    !midPrice ||
    amountCheckedDisabled ||
    loading ||
    !!balanceInfo.userLpToTokenBalanceErrorRefetch;

  let submitBtnText = t`Add`;
  if (isOverBalance) {
    submitBtnText = t`Insufficient balance`;
  }
  const submittedBack = () => {
    reset();
    resetSlipper();
    if (submittedBackProps) {
      submittedBackProps();
    }
  };
  const submitLq = () => {
    setShowConfirmAMMV2(true);
  };

  const operateLiquidityMutation = useVe33AddLiquidity({
    baseToken: pool?.baseToken,
    quoteToken: pool?.quoteToken,
    baseAmount,
    quoteAmount,
    stable: !!pool?.stable,
    fee: pool?.fee,
    slippage: slipperValue,
    submittedBack: () => {
      submittedBack();
      setShowConfirmAMMV2(false);
    },
    successBack: () => {
      balanceInfo.refetch();
    },
  });

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
            canClickBalance
            showPercentage
            onInputChange={handleChangeBaseAmount}
            readOnly={loading || !canOperate}
          />
        )}
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
            readOnly={loading || !canOperate}
          />
        )}
        <LoadingSkeleton
          loading={loading || amountLoading}
          sx={{
            mt: 8,
          }}
        >
          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            disabled={!canOperate}
            type={pool?.type}
          />
        </LoadingSkeleton>
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
              // isLoading={
              //   operateLiquidityMutation.isPending ||
              //   operateAMMV2LiquidityMutation.isPending
              // }
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
      {!!pool && (
        <V2ConfirmDialog
          open={showConfirmAMMV2}
          onClose={() => setShowConfirmAMMV2(false)}
          slippage={slipperValue}
          baseToken={pool.baseToken}
          baseAmount={baseAmount}
          quoteToken={pool.quoteToken}
          quoteAmount={quoteAmount}
          fee={pool.fee}
          price={
            balanceInfo.price
              ? new BigNumber(balanceInfo.price.toSignificant())
              : undefined
          }
          lpAmount={balanceInfo?.liquidityMinted}
          shareOfPool={balanceInfo?.shareOfPool}
          pairAddress={pool.id}
          createMutation={operateLiquidityMutation}
        />
      )}
    </>
  );
}

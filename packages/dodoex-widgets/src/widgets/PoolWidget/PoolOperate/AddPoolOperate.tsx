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
import ConfirmDialog from '../AMMV2Create/ConfirmDialog';
import { useQuery } from '@tanstack/react-query';
import { poolApi } from '../utils';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import {
  getUniswapV2Router02ContractAddressByChainId,
  getUniswapV2Router02FixedFeeContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { useSlipper } from './components/SlippageSetting';

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
    uniV2Pair,

    reset,
  } = useLiquidityOperateAmount({
    pool,
  });
  const feeRateQuery = useQuery(
    poolApi.getFeeRateQuery(pool?.chainId, pool?.address, pool?.type, account),
  );
  const feeNumber = feeRateQuery.data?.mtFeeRate
    ?.plus(feeRateQuery.data?.lpFeeRate ?? 0)
    ?.toNumber();
  const isAMMV2 = pool?.type === 'AMMV2';
  const [showConfirmAMMV2, setShowConfirmAMMV2] = React.useState(false);
  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: pool?.address,
    type: pool?.type,
  });

  const prevPool = usePrevious(pool);
  React.useEffect(() => {
    if (pool?.address !== prevPool?.address) {
      reset();
      resetSlipper();
    }
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

  const proxyContract = isAMMV2
    ? pool.chainId
      ? getUniswapV2Router02ContractAddressByChainId(pool.chainId) ||
        getUniswapV2Router02FixedFeeContractAddressByChainId(pool.chainId)
      : undefined
    : undefined;
  const baseTokenStatus = useTokenStatus(pool?.baseToken, {
    amount: baseAmount,
    contractAddress: proxyContract,
  });
  const quoteTokenStatus = useTokenStatus(pool?.quoteToken, {
    amount: quoteAmount,
    contractAddress: proxyContract,
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
    feeRateQuery.isLoading;

  let submitBtnText = isAMMV2 ? t`Supply` : t`Add`;
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
  const { operateLiquidityMutation } = useOperateLiquidity(pool);
  const submitLq = () => {
    if (isAMMV2) {
      setShowConfirmAMMV2(true);
      return;
    }
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

  const operateAMMV2LiquidityMutation = useAMMV2AddLiquidity({
    baseToken: pool?.baseToken,
    quoteToken: pool?.quoteToken,
    baseAmount,
    quoteAmount,
    fee: feeNumber,
    isExists: true,
    slippage: slipperValue,
    submittedBack: () => {
      submittedBack();
      setShowConfirmAMMV2(false);
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
            canClickBalance
            showPercentage
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
          <Ratio
            pool={pool as OperatePool}
            addPortion={addPortion}
            midPrice={midPrice}
            shareOfPool={uniV2Pair?.shareOfPool}
            slipper={slipper}
            setSlipper={setSlipper}
            canOperate={canOperate}
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
              isLoading={
                operateLiquidityMutation.isPending ||
                operateAMMV2LiquidityMutation.isPending
              }
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
      {isAMMV2 && !!pool && (
        <ConfirmDialog
          open={showConfirmAMMV2}
          onClose={() => setShowConfirmAMMV2(false)}
          slippage={slipperValue}
          baseToken={pool.baseToken}
          baseAmount={baseAmount}
          quoteToken={pool.quoteToken}
          quoteAmount={quoteAmount}
          fee={feeNumber}
          price={uniV2Pair?.price}
          lpAmount={uniV2Pair?.liquidityMinted}
          shareOfPool={uniV2Pair?.shareOfPool}
          pairAddress={pool.address}
          createMutation={operateAMMV2LiquidityMutation}
        />
      )}
    </>
  );
}

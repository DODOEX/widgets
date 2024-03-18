import { PoolApi } from '@dodoex/api';
import { Box, LoadingSkeleton } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import {
  CardPlus,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useLiquidityOperateAmount } from './hooks/useLiquidityOperateAmount';
import Ratio from './Ratio';
import SlippageSetting, { useSlipper } from './SlippageSetting';
import { OperatePool } from './types';

export function AddPoolOperate({
  refetch,
  submittedBack: submittedBackProps,
  onlyShowSide,
  pool,
}: {
  refetch?: () => void;
  submittedBack?: () => void;
  onlyShowSide?: 'base' | 'quote';
  pool?: OperatePool;
}) {
  const { account } = useWeb3React();
  const {
    baseAmount,
    quoteAmount,
    handleChangeBaseAmount,
    handleChangeQuoteAmount,

    addPortion,
    midPrice,
  } = useLiquidityOperateAmount({
    pool,
  });
  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: pool?.address,
  });

  const canOperate = PoolApi.utils.canOperateLiquidity(
    pool?.type,
    undefined,
    pool?.creator,
    account,
  );
  return (
    <>
      <Box
        sx={{
          px: 20,
        }}
      >
        <Box
          sx={{
            pt: 20,
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
            />
          )}
          {onlyShowSide ? '' : <CardPlus />}
          {onlyShowSide === 'base' ? (
            ''
          ) : (
            <TokenCard
              readOnly
              amt={quoteAmount}
              token={pool?.quoteToken}
              showMaxBtn
              onInputChange={handleChangeQuoteAmount}
            />
          )}
          <LoadingSkeleton>
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
      </Box>
    </>
  );
}

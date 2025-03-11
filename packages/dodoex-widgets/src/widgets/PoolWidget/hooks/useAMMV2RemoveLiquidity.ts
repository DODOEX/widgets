import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiV3PoolInfoStandardItemCpmm,
  CpmmKeys,
  Percent,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useRaydiumSDKContext } from '../../../hooks/raydium-sdk-V2/RaydiumSDKContext';
import { useSubmission } from '../../../hooks/Submission';
import { MetadataFlag } from '../../../hooks/Submission/types';

export function useAMMV2RemoveLiquidity({
  liquidityAmount,
  slippage,
  poolInfo,
  poolKeys,
  submittedBack,
}: {
  liquidityAmount: BigNumber | undefined;
  slippage: number;
  poolInfo?: ApiV3PoolInfoStandardItemCpmm;
  poolKeys?: CpmmKeys;
  submittedBack?: () => void;
}) {
  const submission = useSubmission();

  const raydium = useRaydiumSDKContext();
  useLingui();

  return useMutation({
    mutationFn: async () => {
      if (!raydium) {
        throw new Error('raydium is undefined');
      }
      if (!poolInfo || !poolKeys) {
        throw new Error('poolInfo or poolKeys is undefined');
      }
      if (!liquidityAmount) {
        throw new Error('liquidityAmount is undefined');
      }

      const lpAmount = new BN(
        new Decimal(liquidityAmount.toString())
          .mul(10 ** poolInfo.lpMint.decimals)
          .toFixed(0, Decimal.ROUND_DOWN),
      );
      const slippagePercent = new Percent(slippage * 100 * 100, 100 * 100);

      const { execute } = await raydium.cpmm.withdrawLiquidity({
        poolInfo,
        poolKeys,
        lpAmount,
        txVersion: TxVersion.LEGACY,
        slippage: slippagePercent,
      });

      const txResult = await submission.executeCustom({
        brief: t`Remove liquidity`,
        metadata: {
          [MetadataFlag.removeLiqidityAMMV2Position]: true,
        },
        handler: async (params) => {
          const { txId } = await execute({ sendAndConfirm: true });
          params.onSuccess(txId);
        },
        submittedBack,
      });
      return txResult;
    },
  });
}

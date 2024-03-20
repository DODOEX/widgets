import { PoolType } from '@dodoex/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { SLIPPAGE_PROTECTION } from '../../../../constants/pool';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { TokenInfo } from '../../../../hooks/Token';
import { poolApi } from '../../utils';
import { getModifyDPPPoolParams } from './getModifyDPPPoolParams';

const computeAmount = (
  newAmount: string,
  oldAmount: BigNumber | undefined,
  isRemove: boolean,
) => {
  if (!oldAmount) return newAmount;
  if (!newAmount || newAmount === '0') {
    return oldAmount.toString();
  }
  if (isRemove) {
    return oldAmount.minus(newAmount).toString();
  }
  return oldAmount.plus(newAmount).toString();
};

export function useModifyDppPool({
  pool,
}: {
  pool?: {
    chainId: number;
    address: string;
    type: PoolType;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    lpFeeRate: string;
  };
}) {
  const submission = useSubmission();
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      pool?.chainId as number,
      pool?.address,
      pool?.type,
      pool?.baseToken?.decimals,
      pool?.quoteToken?.decimals,
    ),
  );
  const modifyDPPMutation = useMutation({
    mutationFn: async ({
      baseAmount,
      quoteAmount,
      isRemove = false,
      txTitle,
      submittedBack,
    }: {
      baseAmount: string;
      quoteAmount: string;
      isRemove?: boolean;
      txTitle: string;
      submittedBack?: () => void;
    }) => {
      if (!pool) {
        throw new Error('pool is undefined');
      }
      if (pool.lpFeeRate === undefined) {
        throw new Error('lpFeeRate is undefined');
      }
      if (!pmmStateQuery.data) {
        throw new Error('pmmStateQuery.data is undefined');
      }
      const { pmmParamsBG, baseReserve, quoteReserve } = pmmStateQuery.data;
      const i = pmmParamsBG.i.toNumber();
      const k = pmmParamsBG.k.toNumber();
      const params = await getModifyDPPPoolParams({
        SLIPPAGE_PROTECTION,
        srcPool: {
          ...pool,
          baseReserve,
          quoteReserve,
          i: i,
          k: k,
          feeRate: pool.lpFeeRate ?? '',
        },
        baseToken: pool?.baseToken,
        quoteToken: pool?.quoteToken,
        baseAmount: computeAmount(
          baseAmount,
          baseReserve ? new BigNumber(baseReserve) : undefined,
          isRemove,
        ),
        quoteAmount: computeAmount(
          quoteAmount,
          quoteReserve ? new BigNumber(quoteReserve) : undefined,
          isRemove,
        ),
        feeRate: new BigNumber(pool?.lpFeeRate || 0).times(100).toString(),
        initPrice: String(i),
        slippageCoefficient: String(k),
      });
      if (!params) {
        throw new Error(`modify pool failed: ${pool.address}`);
      }
      return submission.execute(
        txTitle,
        {
          opcode: OpCode.TX,
          ...params,
          value: params.value ?? 0,
        },
        {
          metadata: {
            [isRemove
              ? MetadataFlag.removeLiquidity
              : MetadataFlag.addLiquidity]: true,
          },
          submittedBack,
        },
      );
    },
  });

  return {
    modifyDPPMutation,
  };
}

import { ChainId, contractConfig } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';
import { OperatePool } from '../types';

export function useRemoveLiquidityTokenStatus({
  pool,
  baseAmount,
  quoteAmount,
  balanceInfo,
}: {
  pool: OperatePool | undefined;
  baseAmount: string;
  quoteAmount: string;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
}) {
  const { chainId, baseToken, quoteToken } = pool ?? {};
  const baseLpAmount =
    balanceInfo.baseLpToTokenProportion && baseToken
      ? new BigNumber(baseAmount)
          .div(balanceInfo.baseLpToTokenProportion)
          .dp(Number(baseToken.decimals), BigNumber.ROUND_DOWN)
          .toString()
      : undefined;
  const quoteLpAmount =
    balanceInfo.quoteLpToTokenProportion && quoteToken
      ? new BigNumber(quoteAmount)
          .div(balanceInfo.quoteLpToTokenProportion)
          .dp(Number(quoteToken.decimals), BigNumber.ROUND_DOWN)
          .toString()
      : undefined;

  let proxyContractAddress = '';
  if (chainId) {
    proxyContractAddress =
      contractConfig[chainId as ChainId].DODO_V1_PAIR_PROXY ?? '';
  }
  const baseLpTokenId = pool?.baseLpToken?.id ?? '';
  const quoteLpTokenId = pool?.quoteLpToken?.id ?? '';
  const isClassical = pool?.type === 'CLASSICAL';

  const baseTokenStatus = useTokenStatus(
    baseToken
      ? {
          ...baseToken,
          address: baseLpTokenId,
        }
      : undefined,
    {
      amount: baseLpAmount,
      skipQuery: !proxyContractAddress || !baseLpTokenId || !isClassical,
      contractAddress: proxyContractAddress,
      overrideBalance: balanceInfo.userBaseLpBalance,
    },
  );
  const quoteTokenStatus = useTokenStatus(
    quoteToken
      ? {
          ...quoteToken,
          address: quoteLpTokenId,
        }
      : undefined,
    {
      amount: quoteLpAmount,
      skipQuery: !proxyContractAddress || !quoteLpTokenId || !isClassical,
      contractAddress: proxyContractAddress,
      overrideBalance: balanceInfo.userQuoteLpBalance,
    },
  );

  return {
    baseTokenStatus,
    quoteTokenStatus,
  };
}

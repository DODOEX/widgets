import { ChainId, contractConfig } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';
import { OperatePool } from '../types';
import { getUniswapV2Router02ContractAddressByChainId } from '@dodoex/dodo-contract-request';

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

  let proxyContractAddress = '';
  const isAMMV2 = pool?.type === 'AMMV2';
  if (chainId) {
    proxyContractAddress =
      contractConfig[chainId as ChainId].DODO_V1_PAIR_PROXY ?? '';
    if (isAMMV2) {
      proxyContractAddress =
        getUniswapV2Router02ContractAddressByChainId(chainId);
    }
  }
  const baseLpTokenId = pool?.baseLpToken?.id ?? '';
  const quoteLpTokenId = pool?.quoteLpToken?.id ?? '';
  const isClassical = pool?.type === 'CLASSICAL';

  const baseTokenStatus = useTokenStatus(
    baseToken
      ? {
          ...baseToken,
          symbol: isClassical
            ? baseToken.symbol + ' LP'
            : `${baseToken.symbol}/${quoteToken?.symbol} LP`,
          address: baseLpTokenId,
        }
      : undefined,
    {
      amount: isAMMV2
        ? balanceInfo.userBaseLpToTokenBalance && balanceInfo.userBaseLpBalance
          ? new BigNumber(baseAmount)
              .div(balanceInfo.userBaseLpToTokenBalance)
              .times(balanceInfo.userBaseLpBalance)
              .toString()
          : baseAmount
        : baseAmount,
      skipQuery:
        !proxyContractAddress || !baseLpTokenId || (!isClassical && !isAMMV2),
      contractAddress: proxyContractAddress,
      overrideBalance: isAMMV2
        ? balanceInfo.userBaseLpBalance
        : balanceInfo.userBaseLpToTokenBalance,
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
      amount: quoteAmount,
      skipQuery: !proxyContractAddress || !quoteLpTokenId || !isClassical,
      contractAddress: proxyContractAddress,
      overrideBalance: balanceInfo.userQuoteLpToTokenBalance,
    },
  );

  return {
    baseTokenStatus,
    quoteTokenStatus,
  };
}

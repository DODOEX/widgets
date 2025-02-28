import { basicTokenMap, ChainId, PoolApi } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../../hooks/Token';
import { getEthersValue } from '../../../../utils/bytes';
import { formatReadableNumber } from '../../../../utils/formatter';
import { poolApi } from '../../utils';
interface ModifyPool {
  address: string;
  baseReserve: string | BigNumber;
  quoteReserve: string | BigNumber;
  feeRate: string;
  i: number;
  k: number;
}

function computeDiffer(target: any, now: any, targetDecimals: number) {
  const t = new BigNumber(target);
  const n = new BigNumber(now);
  const change = t.minus(n);
  const isAdd = t.gt(n);
  const isRemove = t.lt(n);
  const isChange = isAdd || isRemove;
  return {
    now: n,
    target: t,
    isChange,
    change,
    changeText:
      (isRemove ? '' : '+') +
      formatReadableNumber({
        input: change,
        showDecimals: targetDecimals > 6 ? 6 : 4,
        showPrecisionDecimals: 2,
      }),
    isAdd,
    isRemove,
  };
}

export function useDiffer({
  srcPool,
  newPool,
}: {
  srcPool?: ModifyPool;
  newPool: {
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    baseAmount: string;
    quoteAmount: string;
    feeRate: string;
    initPrice: string;
    slippageCoefficient: string;
  };
}) {
  if (!srcPool) return null;
  const { baseToken, quoteToken, baseAmount, quoteAmount } = newPool;
  const { baseReserve, quoteReserve } = srcPool;
  return {
    baseAmount: computeDiffer(baseAmount, baseReserve, baseToken.decimals),
    quoteAmount: computeDiffer(quoteAmount, quoteReserve, quoteToken.decimals),
    feeRate: computeDiffer(
      new BigNumber(newPool.feeRate).div(100),
      srcPool.feeRate,
      6,
    ),
    initPrice: computeDiffer(newPool.initPrice, srcPool.i, 10),
    slippageCoefficient: computeDiffer(
      newPool.slippageCoefficient || '1',
      srcPool.k,
      4,
    ),
  };
}

export const getModifyDPPPoolParams = async ({
  chainId,
  account,
  srcPool,
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  feeRate,
  initPrice,
  slippageCoefficient,
  ddl,
  SLIPPAGE_PROTECTION,
}: {
  chainId?: number;
  account?: string;
  srcPool?: ModifyPool;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: string;
  quoteAmount: string;
  feeRate: string;
  initPrice: string;
  slippageCoefficient: string;
  ddl: number | undefined;
  SLIPPAGE_PROTECTION: number;
}) => {
  const EtherToken = chainId ? basicTokenMap[chainId as ChainId] : undefined;
  const newPool = {
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    feeRate,
    initPrice,
    slippageCoefficient,
  };
  const differ = useDiffer({
    srcPool,
    newPool,
  });

  if (!account || !chainId || !differ || !srcPool) {
    return null;
  }
  const baseDecimals = Number(baseToken.decimals);
  const quoteDecimals = Number(quoteToken.decimals);
  let result: { data: string; to: string; value?: number | string };
  const k = differ.slippageCoefficient.target;

  try {
    const baseIsEtherToken = baseToken.symbol === EtherToken?.symbol;
    const quoteIsEtherToken = quoteToken.symbol === EtherToken?.symbol;
    if (differ.baseAmount.isRemove && differ.quoteAmount.isRemove) {
      const _OWNER_ = await poolApi
        .getDPPOwnerProxyAddressQuery(chainId, srcPool.address)
        .queryFn();
      const removeParams: Parameters<typeof PoolApi.encode.removeDPPPoolABI> = [
        _OWNER_,
        differ.feeRate.target.multipliedBy(10000).toNumber(),
        differ.initPrice.target.toNumber(),
        k.toNumber(),
        parseFixed(
          differ.baseAmount.change
            .abs()
            .dp(baseDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          baseDecimals,
        ).toString(),
        parseFixed(
          differ.quoteAmount.change
            .abs()
            .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          quoteDecimals,
        ).toString(),
        parseFixed(
          differ.baseAmount.now
            .multipliedBy(1 - SLIPPAGE_PROTECTION)
            .dp(baseDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          baseDecimals,
        ).toString(),
        parseFixed(
          differ.quoteAmount.now
            .multipliedBy(1 - SLIPPAGE_PROTECTION)
            .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          quoteDecimals,
        ).toString(),
        baseDecimals,
        quoteDecimals,
      ];
      result = await PoolApi.encode.removeDPPPoolABI(...removeParams);
    } else {
      // 0 - ERC20, 1 - baseInETH, 2 - quoteInETH, 3 - baseOutETH, 4 - quoteOutETH
      // let flag = 0;
      // if (
      //   baseIsEtherToken &&
      //   (differ.baseAmount.isAdd || differ.baseAmount.isRemove)
      // ) {
      //   flag = differ.baseAmount.isAdd ? 1 : 3;
      // }
      // if (
      //   quoteIsEtherToken &&
      //   (differ.quoteAmount.isAdd || differ.quoteAmount.isRemove)
      // ) {
      //   flag = differ.quoteAmount.isAdd ? 2 : 4;
      // }
      const resetParams: Parameters<typeof PoolApi.encode.resetDPPPoolABI> = [
        chainId,
        srcPool.address,
        differ.feeRate.target.multipliedBy(10000).toNumber(),
        differ.initPrice.target.toNumber(),
        k.toNumber(),
        differ.baseAmount.isAdd
          ? parseFixed(
              differ.baseAmount.change
                .abs()
                .dp(baseDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              baseDecimals,
            ).toString()
          : '0',
        differ.quoteAmount.isAdd
          ? parseFixed(
              differ.quoteAmount.change
                .abs()
                .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              quoteDecimals,
            ).toString()
          : '0',
        differ.baseAmount.isAdd
          ? '0'
          : parseFixed(
              differ.baseAmount.change
                .abs()
                .dp(baseDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              baseDecimals,
            ).toString(),
        differ.quoteAmount.isAdd
          ? '0'
          : parseFixed(
              differ.quoteAmount.change
                .abs()
                .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              quoteDecimals,
            ).toString(),
        parseFixed(
          differ.baseAmount.now
            .multipliedBy(1 - SLIPPAGE_PROTECTION)
            .dp(baseDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          baseDecimals,
        ).toString(),
        parseFixed(
          differ.quoteAmount.now
            .multipliedBy(1 - SLIPPAGE_PROTECTION)
            .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
            .toString(),
          quoteDecimals,
        ).toString(),
        // flag,
        0,
        baseDecimals,
        quoteDecimals,
        Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60),
      ];
      result = await PoolApi.encode.resetDPPPoolABI(...resetParams);
    }

    if (baseIsEtherToken && differ.baseAmount.isAdd) {
      result.value = getEthersValue(differ.baseAmount.change);
    }
    if (quoteIsEtherToken && differ.quoteAmount.isAdd) {
      result.value = getEthersValue(differ.quoteAmount.change);
    }
    return result;
  } catch (error) {
    console.error('2.0 resetDPPPool error', error);
    throw new Error(`2.0 resetDPPPool error;ERROR:${error}`);
  }
};

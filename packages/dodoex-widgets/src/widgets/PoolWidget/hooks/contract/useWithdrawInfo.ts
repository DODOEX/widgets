import { PoolType } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { formatReadableNumber } from '../../../../utils/formatter';
import { getShowDecimals } from '../../../../utils/token';
import { poolApi } from '../../utils';

export const useWithdrawInfo = ({
  pool,
  isBase,
  baseAmount,
  quoteAmount,
}: {
  pool?: {
    chainId: number;
    address: string;
    type: PoolType;
    baseToken: {
      symbol: string;
      decimals: number;
    };
    quoteToken: {
      symbol: string;
      decimals: number;
    };
  };
  isBase?: boolean;
  baseAmount: string;
  quoteAmount: string;
}) => {
  const isClassical = pool?.type === 'CLASSICAL';
  const needQueryBase = isBase || isBase === undefined;
  const baseDecimals = pool?.baseToken?.decimals;
  const quoteDecimals = pool?.quoteToken?.decimals;
  const baseQuery = useQuery({
    ...poolApi.getWithdrawBasePenaltyQuery(
      pool?.chainId,
      pool?.address,
      baseAmount && baseDecimals !== undefined
        ? parseFixed(
            new BigNumber(baseAmount)
              .dp(baseDecimals, BigNumber.ROUND_FLOOR)
              .toString(),
            baseDecimals,
          ).toString()
        : '',
      baseDecimals,
    ),
    enabled: !!pool && !!baseAmount && isClassical && needQueryBase,
  });
  const quoteQuery = useQuery({
    ...poolApi.getWithdrawBasePenaltyQuery(
      pool?.chainId,
      pool?.address,
      quoteAmount && quoteDecimals !== undefined
        ? parseFixed(
            new BigNumber(quoteAmount)
              .dp(quoteDecimals, BigNumber.ROUND_FLOOR)
              .toString(),
            quoteDecimals,
          ).toString()
        : '',
      quoteDecimals,
    ),
    enabled: !!pool && !!quoteAmount && isClassical && !needQueryBase,
  });

  let baseWithdrawFee = '';
  let quoteWithdrawFee = '';
  let receiveBaseAmount = '';
  let receiveQuoteAmount = '';
  let withdrawFee = '';
  let receiveAmountBg: BigNumber | undefined;
  let loading = false;
  let error: typeof baseQuery.error = null;

  if (pool) {
    const baseShowDecimals = getShowDecimals(pool.baseToken.decimals);
    const quoteShowDecimals = getShowDecimals(pool.quoteToken.decimals);
    receiveBaseAmount = formatReadableNumber({
      input: baseAmount,
      showDecimals: baseShowDecimals,
    });
    receiveQuoteAmount = formatReadableNumber({
      input: quoteAmount,
      showDecimals: quoteShowDecimals,
    });
    if (isClassical) {
      loading = needQueryBase ? baseQuery.isLoading : quoteQuery.isLoading;
      error = needQueryBase ? baseQuery.error : quoteQuery.error;
      if (needQueryBase) {
        if (baseQuery.data) {
          baseWithdrawFee = formatReadableNumber({
            input: baseQuery.data,
            showDecimals: baseShowDecimals,
          });
          withdrawFee = baseWithdrawFee;
          const received = new BigNumber(baseAmount).minus(baseQuery.data);
          receiveBaseAmount = received.gt(0)
            ? formatReadableNumber({
                input: received,
                showDecimals: baseShowDecimals,
              })
            : '-';
          receiveAmountBg = received;
        }
      } else if (quoteQuery.data) {
        quoteWithdrawFee = formatReadableNumber({
          input: quoteQuery.data,
          showDecimals: quoteShowDecimals,
        });
        withdrawFee = quoteWithdrawFee;
        const received = new BigNumber(quoteAmount).minus(quoteQuery.data);
        receiveBaseAmount = received.gt(0)
          ? formatReadableNumber({
              input: received,
              showDecimals: baseShowDecimals,
            })
          : '-';
        receiveAmountBg = received;
      }
    }
  }

  let receiveList: {
    amount: string;
    symbol: string;
  }[] = [];
  if (pool) {
    if (isClassical) {
      if (isBase) {
        receiveList.push({
          amount: receiveBaseAmount || '0',
          symbol: pool.baseToken.symbol,
        });
      } else {
        receiveList.push({
          amount: receiveQuoteAmount || '0',
          symbol: pool.quoteToken.symbol,
        });
      }
    } else {
      receiveList.push({
        amount: receiveBaseAmount || '0',
        symbol: pool.baseToken.symbol,
      });
      receiveList.push({
        amount: receiveQuoteAmount || '0',
        symbol: pool.quoteToken.symbol,
      });
    }
  }

  return {
    withdrawFee,
    baseWithdrawFee,
    quoteWithdrawFee,
    receiveBaseAmount,
    receiveQuoteAmount,
    receiveAmountBg,
    receiveList,
    loading,
    error,
  };
};

import BigNumber from 'bignumber.js';
import { formatReadableNumber } from '../../../../utils/formatter';
import { getShowDecimals } from '../../../../utils/token';

export const useWithdrawInfo = ({
  pool,
  baseAmount,
  quoteAmount,
}: {
  pool?: {
    chainId: number;
    address: string;
    baseToken: {
      symbol: string;
      decimals: number;
    };
    quoteToken: {
      symbol: string;
      decimals: number;
    };
  };
  baseAmount: string;
  quoteAmount: string;
}) => {
  let receiveBaseAmount = '';
  let receiveQuoteAmount = '';
  let receiveAmountBg: BigNumber | undefined;

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
  }

  let receiveList: {
    amount: string;
    symbol: string;
  }[] = [];
  if (pool) {
    receiveList.push({
      amount: receiveBaseAmount || '0',
      symbol: pool.baseToken.symbol,
    });
    receiveList.push({
      amount: receiveQuoteAmount || '0',
      symbol: pool.quoteToken.symbol,
    });
  }

  return {
    receiveBaseAmount,
    receiveQuoteAmount,
    receiveAmountBg,
    receiveList,
  };
};

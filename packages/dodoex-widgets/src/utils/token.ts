import { TokenInfo } from '../hooks/Token';
import { basicTokenMap, ChainId } from '../constants/chains';
import BigNumber from 'bignumber.js';
import { formatReadableNumber, toWei } from './formatter';

export const getTokenSymbolDisplay = (baseToken: TokenInfo): string => {
  let originSymbol = baseToken.symbol;
  if (originSymbol.indexOf('DLP_') > -1) {
    originSymbol = originSymbol.replace('DLP_', '');
  }
  if (originSymbol.indexOf('DLP') > -1) {
    originSymbol = originSymbol.replace('DLP', 'LP');
  }

  return originSymbol;
};

export const getSwapTxValue = ({
  tokenAmount,
  tokenAddress,
  chainId,
}: {
  tokenAmount: string | number | BigNumber;
  tokenAddress: string;
  chainId: ChainId;
}) => {
  let orderValue = new BigNumber(0);
  const basicToken = basicTokenMap[chainId];
  if (tokenAddress.toLowerCase() === basicToken.address.toLowerCase())
    orderValue = toWei(tokenAmount, 18);
  return `0x${orderValue.toString(16)}`;
};

export function getTokenPairCompareText({
  fromToken,
  toToken,
  fromFiatPrice,
  toFiatPrice,
  reverse,
  showDecimals = 1,
}: {
  fromToken: TokenInfo | undefined;
  toToken: TokenInfo | undefined;
  fromFiatPrice: BigNumber | undefined;
  toFiatPrice: BigNumber | undefined;
  reverse?: boolean;
  showDecimals?: number;
}) {
  const result = {
    comparePrice: null as BigNumber | null,
    comparePriceText: '',
    loading: true,
  };
  if (!fromToken || !toToken || !fromFiatPrice || !toFiatPrice) return result;
  if (reverse) {
    result.loading = false;
    result.comparePrice = fromFiatPrice.div(toFiatPrice);
    result.comparePriceText = `1 ${getTokenSymbolDisplay(
      fromToken,
    )} = ${formatReadableNumber({
      input: result.comparePrice,
      showDecimals,
    })} ${getTokenSymbolDisplay(toToken)}`;
  } else {
    result.loading = false;
    result.comparePrice = toFiatPrice.div(fromFiatPrice);
    result.comparePriceText = `1 ${getTokenSymbolDisplay(
      toToken,
    )} = ${formatReadableNumber({
      input: result.comparePrice,
      showDecimals,
    })} ${getTokenSymbolDisplay(fromToken)}`;
  }
  return result;
}

export function getShowDecimals(decimals: string | number) {
  const decimalsNumber = Number(decimals);
  return decimalsNumber > 6 ? 6 : 4;
}

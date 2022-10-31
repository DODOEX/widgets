import { TokenInfo } from '../hooks/Token';
import { basicTokenMap, ChainId } from '../constants/chains';
import BigNumber from 'bignumber.js';
import { toWei } from './formatter';

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

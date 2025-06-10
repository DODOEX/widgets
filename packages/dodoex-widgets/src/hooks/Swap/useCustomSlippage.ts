import React from 'react';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { TokenInfo } from '../Token';
import {
  CustomSwapPairSlippage,
  useSwapSettingStore,
} from './useSwapSettingStore';

export function useCustomSlippage({
  fromToken,
  toToken,
}: {
  fromToken?: TokenInfo | null;
  toToken?: TokenInfo | null;
}) {
  const { account } = useWalletInfo();
  const { customSwapPairSlippages } = useSwapSettingStore();

  const findSlippageItem = React.useCallback(
    (item: CustomSwapPairSlippage) => {
      const accountLow = account?.toLocaleLowerCase() ?? '';
      const itemAddressLowList = [
        item.from.toLocaleLowerCase(),
        item.to.toLocaleLowerCase(),
      ];
      return (
        (item.account?.toLocaleLowerCase() ?? '') === accountLow &&
        item.chainId === fromToken?.chainId &&
        itemAddressLowList.includes(fromToken?.address?.toLocaleLowerCase()) &&
        itemAddressLowList.includes(toToken?.address?.toLocaleLowerCase() ?? '')
      );
    },
    [fromToken, toToken, account],
  );

  const customSlippageFindItem =
    fromToken && toToken
      ? customSwapPairSlippages.find(findSlippageItem)
      : null;
  const customSlippageActive = !customSlippageFindItem?.disabled
    ? customSlippageFindItem
    : null;

  const handleSlippageChange = React.useCallback(
    (
      newItem: Pick<
        CustomSwapPairSlippage,
        'slippage' | 'recommend' | 'disabled' | 'deleted'
      >,
    ) => {
      useSwapSettingStore.setState((prev) => {
        if (!fromToken || !toToken) throw new Error('token is not valid.');
        const newList = [...prev.customSwapPairSlippages];
        const newCustomSlippageItem = {
          ...newItem,
          account: account?.toLowerCase() ?? '',
          from: fromToken.address.toLowerCase(),
          to: toToken.address.toLowerCase(),
          fromSymbol: fromToken.symbol,
          toSymbol: toToken.symbol,
          fromLogo: fromToken.logoURI ?? null,
          toLogo: toToken.logoURI ?? null,
          chainId: fromToken.chainId,
        } as CustomSwapPairSlippage;
        const index = newList.findIndex(findSlippageItem);
        if (index > -1) {
          newList.splice(index, 1, newCustomSlippageItem);
        } else {
          newList.push(newCustomSlippageItem);
        }
        return {
          customSwapPairSlippages: newList,
        };
      });
    },
    [account, fromToken, toToken, findSlippageItem],
  );

  const customSlippage = customSlippageActive?.slippage;
  const customSlippageNum = customSlippage ? Number(customSlippage) : 0;

  return {
    customSlippageNum,
    customSlippage,
    handleSlippageChange,
  };
}

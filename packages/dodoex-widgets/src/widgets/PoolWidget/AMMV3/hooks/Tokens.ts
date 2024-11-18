import { basicTokenMap, ChainId } from '@dodoex/api';
import { useMemo } from 'react';
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types';
import { useCurrencyInfo as useUniswapCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo';
import { isAddress } from 'utilities/src/addresses';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { UniverseChainId } from '../chains/types';
import { NATIVE_CHAIN_ID } from '../constants/tokens';
import { Currency } from '../sdks/sdk-core/entities/currency';
import { Token } from '../sdks/sdk-core/entities/token';

type Maybe<T> = T | undefined;

export function buildCurrencyId(
  chainId: UniverseChainId,
  address: string,
): string {
  return `${chainId}-${address}`;
}

export function useCurrency(
  address?: string,
  chainId?: UniverseChainId,
  skip?: boolean,
): Maybe<Currency> {
  const currencyInfo = useCurrencyInfo(address, chainId, skip);
  return currencyInfo?.currency;
}

/**
 * Returns a CurrencyInfo from the tokenAddress+chainId pair.
 */
export function useCurrencyInfo(
  currency?: Currency,
  chainId?: ChainId,
  skip?: boolean,
): Maybe<CurrencyInfo>;
export function useCurrencyInfo(
  address?: string,
  chainId?: ChainId,
  skip?: boolean,
): Maybe<CurrencyInfo>;
export function useCurrencyInfo(
  addressOrCurrency?: string | Currency,
  chainId?: ChainId,
  skip?: boolean,
): Maybe<CurrencyInfo> {
  const { chainId: connectedChainId } = useWalletInfo();
  const chainIdWithFallback =
    (typeof addressOrCurrency === 'string'
      ? chainId
      : addressOrCurrency?.chainId) ?? connectedChainId;
  const nativeAddressWithFallback =
    basicTokenMap[chainIdWithFallback as ChainId].address;

  const isNative = useMemo(
    () => checkIsNative(addressOrCurrency),
    [addressOrCurrency],
  );
  const address = useMemo(
    () => getAddress(isNative, nativeAddressWithFallback, addressOrCurrency),
    [isNative, nativeAddressWithFallback, addressOrCurrency],
  );

  const addressWithFallback =
    isNative || !address ? nativeAddressWithFallback : address;

  const currencyId = buildCurrencyId(chainIdWithFallback, addressWithFallback);
  const currencyInfo = useUniswapCurrencyInfo(currencyId, { skip });

  return useMemo(() => {
    if (!currencyInfo || !addressOrCurrency || skip) {
      return undefined;
    }

    return currencyInfo;
  }, []);
}

export const checkIsNative = (
  addressOrCurrency?: string | Currency,
): boolean => {
  return typeof addressOrCurrency === 'string'
    ? [NATIVE_CHAIN_ID, 'native', 'eth'].includes(
        addressOrCurrency.toLowerCase(),
      )
    : (addressOrCurrency?.isNative ?? false);
};

const getAddress = (
  isNative: boolean,
  nativeAddressWithFallback: string,
  addressOrCurrency?: string | Currency,
): string | undefined => {
  if (typeof addressOrCurrency === 'string') {
    if (isNative) {
      return nativeAddressWithFallback;
    } else {
      return addressOrCurrency;
    }
  }

  if (addressOrCurrency) {
    if (addressOrCurrency.isNative) {
      return nativeAddressWithFallback;
    } else if (addressOrCurrency) {
      return addressOrCurrency.address;
    }
  }

  return undefined;
};

export function useToken(
  tokenAddress?: string,
  chainId?: UniverseChainId,
): Maybe<Token> {
  const formattedAddress = isAddress(tokenAddress);
  const { chainId: connectedChainId } = useWalletInfo();
  const currency = useCurrency(
    formattedAddress ? formattedAddress : undefined,
    chainId ?? connectedChainId,
  );

  return useMemo(() => {
    if (currency && currency.isToken) {
      return currency;
    }
    return undefined;
  }, [currency]);
}

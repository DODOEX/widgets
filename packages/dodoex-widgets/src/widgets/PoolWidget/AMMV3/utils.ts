import { basicTokenMap, ChainId } from '@dodoex/api';
import { TokenInfo } from '../../../hooks/Token';
import { Token } from './sdks/sdk-core';
import { NativeCurrency } from './sdks/sdk-core/entities/nativeCurrency';

export function getNativeAddress(chainId: ChainId): string {
  return basicTokenMap[chainId].address;
}

export function areAddressesEqual(
  a1: Maybe<Address>,
  a2: Maybe<Address>,
): boolean {
  const validA1 = a1?.toLowerCase();
  const validA2 = a2?.toLowerCase();
  return validA1 !== null && validA2 !== null && validA1 === validA2;
}

export const isNativeCurrencyAddress = (
  chainId: ChainId,
  address: Maybe<Address>,
): boolean => {
  if (!address) {
    return true;
  }

  return areAddressesEqual(address, getNativeAddress(chainId));
};

function isNonNativeAddress(
  chainId: ChainId,
  address: Maybe<string>,
): address is string {
  return !isNativeCurrencyAddress(chainId, address);
}

export function buildCurrency(
  token: TokenInfo | null,
): Token | NativeCurrency | undefined {
  if (!token) {
    return undefined;
  }

  const { name, chainId, address, decimals, symbol } = token;

  const result = isNonNativeAddress(chainId, address)
    ? new Token(
        chainId,
        address,
        decimals,
        symbol ?? undefined,
        name ?? undefined,
      )
    : new NativeCurrency(chainId);

  return result;
}

export function convertBackToTokenInfo(
  currency: Token | NativeCurrency | undefined | null,
): TokenInfo | undefined {
  if (!currency) {
    return undefined;
  }
  return {
    chainId: currency.chainId,
    address: currency.address,
    decimals: currency.decimals,
    symbol: currency.symbol ?? '',
    name: currency.name ?? '',
  };
}

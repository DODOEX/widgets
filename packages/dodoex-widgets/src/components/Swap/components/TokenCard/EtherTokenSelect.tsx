import { basicTokenMap, ChainId } from '@dodoex/api';
import Select from '../../../Select';
import { TokenInfo } from '../../../../hooks/Token';
import React from 'react';
import TokenLogo from '../../../TokenLogo';

export default function EtherTokenSelect({
  chainId,
  token,
  onTokenChange,
  children,
}: React.PropsWithChildren<{
  chainId: ChainId | undefined;
  token: TokenInfo | undefined | null;
  onTokenChange?: (token: TokenInfo, isOccupied: boolean) => void;
}>) {
  const basicToken = React.useMemo(
    () => (chainId ? basicTokenMap[chainId] : null),
    [chainId],
  );
  const isShow =
    !!token &&
    !!basicToken &&
    token.chainId === chainId &&
    [
      basicToken.address.toLowerCase(),
      basicToken.wrappedTokenAddress.toLowerCase(),
    ].includes(token.address.toLocaleLowerCase());
  const options = React.useMemo(() => {
    if (!basicToken) return [];
    return [
      {
        key: basicToken.address,
        value: basicToken.symbol,
        logo: <TokenLogo chainId={chainId} address={basicToken.address} />,
      },
      {
        key: basicToken.wrappedTokenAddress,
        value: basicToken.wrappedTokenSymbol,
        logo: <TokenLogo chainId={chainId} address={basicToken.address} />,
      },
    ];
  }, [basicToken]);

  if (!isShow) return <>{children}</>;

  return (
    <Select
      value={token.address}
      onChange={(value) => {
        if (value === basicToken?.address) {
          onTokenChange?.(
            {
              chainId,
              ...basicToken,
            } as TokenInfo,
            false,
          );
        } else {
          onTokenChange?.(
            {
              chainId,
              decimals: basicToken.decimals,
              address: basicToken.wrappedTokenAddress,
              symbol: basicToken.wrappedTokenSymbol,
              name: basicToken.wrappedTokenSymbol,
            },
            false,
          );
        }
      }}
      options={options}
    />
  );
}

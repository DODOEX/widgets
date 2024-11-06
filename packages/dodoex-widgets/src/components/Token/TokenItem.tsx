import { Box } from '@dodoex/components';
import TokenLogo from '../TokenLogo';
import React from 'react';

export default function TokenItem({
  chainId,
  address,
  showName,
  size,
  offset,
  rightContent,
}: {
  chainId: number;
  address: string;
  showName: string;
  size: number;
  offset?: number;
  rightContent?: React.ReactNode;
}) {
  const LogoAndSymbol = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: offset,
      }}
    >
      <TokenLogo
        chainId={chainId}
        address={address}
        width={size}
        height={size}
        noShowChain
        marginRight={0}
      />
      {showName}
    </Box>
  );

  if (!rightContent) {
    return LogoAndSymbol;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {LogoAndSymbol}
      {rightContent}
    </Box>
  );
}

import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { CSSProperties, useMemo } from 'react';
import { chainListMap } from '../../../constants/chainList';
import { ChainId } from '../../../constants/chains';
import { TokenInfo } from '../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import TokenLogo from '../../TokenLogo';

/**
 * token 数量附带有 chain 名称和 logo
 */
export function TokenWithChain({
  chainId,
  token,
  amount,
}: {
  chainId: number;
  token?: TokenInfo;
  amount?: string | null | BigNumber;
}) {
  const theme = useTheme();

  const chain = useMemo(() => {
    return chainListMap.get(chainId as ChainId);
  }, [chainId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          mb: 8,
          display: 'flex',
          alignItems: 'flex-end',
          alignSelf: 'center',
        }}
      >
        <TokenLogo
          address={token?.address ?? ''}
          marginRight={0}
          width={28}
          height={28}
          url={token?.logoURI}
        />
        {chain ? (
          <Box
            component={chain.logo}
            sx={{
              width: 12,
              height: 12,
              position: 'relative',
              left: -6,
            }}
          />
        ) : (
          ''
        )}
      </Box>
      <Box
        sx={{
          color: theme.palette.text.primary,
          typography: 'body1',
          fontWeight: 600,
          width: '100%',
          wordBreak: 'break-word',
          textAlign: 'center',
        }}
      >
        {formatTokenAmountNumber({
          input: amount,
          decimals: token?.decimals,
        })}
        &nbsp;{token?.symbol}
      </Box>
      <Box
        sx={{
          color: theme.palette.text.secondary,
          typography: 'h6',
          alignSelf: 'center',
        }}
      >
        <Trans>on</Trans>&nbsp;{chain?.name}
      </Box>
    </Box>
  );
}

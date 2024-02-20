import { Box, BoxProps, useTheme } from '@dodoex/components';
import { chainListMap } from '../constants/chainList';
import { ChainId } from '../constants/chains';
import TokenLogo from './TokenLogo';

export function TokenLogoPair({
  tokens,
  width = 24,
  height = 24,
  gap = -4,
  cross,
  mr,
  chainId,
  showChainLogo,
  sx,
}: {
  tokens: Array<
    | {
        address?: string;
        logoURI?: string;
      }
    | string
  >;
  width?: number;
  height?: number;
  gap?: number;
  cross?: boolean;
  mr?: number;
  chainId?: number;
  showChainLogo?: boolean;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  if (!tokens || tokens.length <= 0) {
    return null;
  }

  const chainLogoSize = width / 2;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mr,
        position: 'relative',
        zIndex: 0,
        ...sx,
      }}
    >
      {tokens.map((token, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Box
            key={index}
            sx={{
              zIndex: tokens.length - index,
              ml: index > 0 ? gap : 0,
              borderRadius: '50%',
              backgroundColor: theme.palette.background.default,
            }}
          >
            {typeof token === 'object' ? (
              <TokenLogo
                address={token.address}
                width={width}
                height={width}
                chainId={chainId}
                url={token.logoURI}
                cross={cross}
                noShowChain
                noBorder
                marginRight={0}
              />
            ) : (
              <Box component="img" height={width} src={token} />
            )}
          </Box>
        );
      })}
      {showChainLogo && chainListMap.has(chainId as ChainId) ? (
        <Box
          component={chainListMap.get(chainId as ChainId)?.logo}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: tokens.length + 1,
            transform: 'translateX(50%)',
            width: chainLogoSize,
            height: chainLogoSize,
          }}
        />
      ) : (
        ''
      )}
    </Box>
  );
}

import { alpha, Box, BoxProps, Skeleton, useTheme } from '@dodoex/components';
import { chainListMap } from '../constants/chainList';
import { ChainId } from '@dodoex/api';
import TokenLogo from './TokenLogo';
import { useUserOptions } from './UserOptionsProvider';

export interface TokenLogoPairProps {
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
}
export function TokenLogoPair({
  tokens,
  width = 24,
  height = 24,
  gap = -4,
  cross,
  mr,
  chainId,
  showChainLogo: showChainLogoProps,
  sx,
}: TokenLogoPairProps) {
  const theme = useTheme();
  const { onlyChainId } = useUserOptions();
  const showChainLogo = showChainLogoProps && !onlyChainId;

  const chainLogoSize = width / 2;

  if (!tokens || tokens.length <= 0) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          mr,
          position: 'relative',
          zIndex: 0,
          ...sx,
        }}
      >
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          width={52}
          height={24}
          viewBox="0 0 52 24"
          fill="none"
          sx={{
            height: width,
            width: 'auto',
            color: alpha(
              theme.palette.text.primary,
              theme.palette.mode === 'light' ? 0.11 : 0.13,
            ),
            animation: 'pulseKeyframe 2s ease-in-out 0.5s infinite',
            '@keyframes pulseKeyframe': {
              '0%': {
                opacity: 1,
              },

              '50%': {
                opacity: 0.4,
              },

              '100%': {
                opacity: 1,
              },
            },
          }}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.3746 4.50813C19.1755 1.76008 15.7933 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C15.7933 24 19.1755 22.2399 21.3746 19.4919C19.8788 17.3743 19 14.7898 19 12C19 9.21023 19.8788 6.62571 21.3746 4.50813ZM22 5.36441C24.1498 2.13102 27.8261 0 32 0C38.3911 0 43.6152 4.99623 43.9797 11.296C41.0986 12.163 39 14.8364 39 18C39 19.1371 39.2711 20.2108 39.7523 21.1602C37.6611 22.9317 34.9553 24 32 24C27.8261 24 24.1498 21.869 22 18.6356C20.7363 16.735 20 14.4535 20 12C20 9.54653 20.7363 7.26502 22 5.36441ZM52 18C52 21.3137 49.3137 24 46 24C43.5588 24 41.458 22.542 40.5211 20.4493C40.5042 20.4116 40.4876 20.3736 40.4715 20.3355C40.1679 19.6176 40 18.8284 40 18C40 15.3894 41.6673 13.1682 43.9952 12.3431C44.6221 12.1209 45.2969 12 46 12C49.3137 12 52 14.6863 52 18Z"
            fill="currentColor"
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
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
              // zIndex: tokens.length - index,
              display: 'inline-flex',
              width,
              height: width,
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

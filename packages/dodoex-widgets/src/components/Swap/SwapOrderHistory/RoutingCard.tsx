import { Box, useTheme, Tooltip } from '@dodoex/components';
import React from 'react';
import { TokenApi } from '@dodoex/api';
import { MidPathType } from '../../../hooks/useRouteVisionData';
import { TokenInfo } from '../../../hooks/Token';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { Trans } from '@lingui/macro';
import { getEtherscanPage } from '../../../utils';
import TokenLogo from '../../TokenLogo';

const { isSameAddress } = TokenApi.utils;

function useTokenInfo({
  routing,
  fromTokenRaw,
  toTokenRaw,
  targetTokenAddress,
}: {
  routing: MidPathType;
  fromTokenRaw: TokenInfo;
  toTokenRaw: TokenInfo;
  targetTokenAddress: string;
}) {
  const token = React.useMemo(() => {
    if (isSameAddress(fromTokenRaw.address, targetTokenAddress)) {
      return fromTokenRaw;
    }
    if (isSameAddress(toTokenRaw.address, targetTokenAddress)) {
      return toTokenRaw;
    }
    return null;
  }, [fromTokenRaw, routing.chainId, targetTokenAddress, toTokenRaw]);

  return token;
}

export default function RoutingCard({
  routing,
  fromTokenRaw,
  toTokenRaw,
}: {
  routing: MidPathType;
  fromTokenRaw: TokenInfo;
  toTokenRaw: TokenInfo;
}) {
  const { poolDetails } = routing;
  const theme = useTheme();

  const fromToken = useTokenInfo({
    fromTokenRaw,
    toTokenRaw,
    routing,
    targetTokenAddress: routing.fromToken,
  });

  const toToken = useTokenInfo({
    fromTokenRaw,
    toTokenRaw,
    routing,
    targetTokenAddress: routing.toToken,
  });

  const keys = Array.from(poolDetails.keys());
  const { isMobile } = useWidgetDevice();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.hover.default,
        borderRadius: 8,
        borderColor: theme.palette.border.main,
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        mx: isMobile ? 0 : 4,
      }}
    >
      {keys.map((key, index) => {
        const pool = poolDetails.get(key);
        if (!pool) {
          return null;
        }
        return (
          <React.Fragment key={key}>
            {index > 0 && (
              <Box
                sx={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: theme.palette.background.paperDarkContrast,
                }}
              />
            )}
            <Box
              sx={{
                typography: 'body2',
                color: theme.palette.text.secondary,
                textTransform: 'capitalize',
              }}
            >
              <Trans>On</Trans>&nbsp;{key}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {pool.map((p) => {
                return (
                  <Box
                    key={p.poolAddress}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      typography: 'body1',
                      color: theme.palette.text.primary,
                      gap: 20,
                    }}
                  >
                    <Tooltip
                      title={`${fromToken?.symbol ?? '-'}/${
                        toToken?.symbol ?? '-'
                      }`}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: theme.palette.text.secondary,
                          cursor: 'default',
                          '&:hover': p.poolAddress
                            ? {
                                color: theme.palette.text.primary,
                                cursor: 'pointer',
                              }
                            : undefined,
                        }}
                        onClick={() => {
                          if (!p.poolAddress) {
                            return;
                          }
                          getEtherscanPage(routing.chainId, p.poolAddress);
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TokenLogo
                            width={20}
                            height={20}
                            address={routing.fromToken}
                            chainId={routing.chainId}
                            sx={{
                              marginRight: -4,
                            }}
                          />
                          <TokenLogo
                            width={20}
                            height={20}
                            address={routing.toToken}
                            chainId={routing.chainId}
                          />
                        </Box>

                        {p.poolAddress && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.33333 3.33333V12.6667H12.6667V7.99999H14V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.59333 14 2 13.4 2 12.6667V3.33333C2 2.6 2.59333 2 3.33333 2H8V3.33333H3.33333ZM9.33333 3.33333V2H14V6.66666H12.6667V4.27333L6.11333 10.8267L5.17333 9.88666L11.7267 3.33333H9.33333Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>
                        )}
                      </Box>
                    </Tooltip>

                    {p.poolPart}
                  </Box>
                );
              })}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
}

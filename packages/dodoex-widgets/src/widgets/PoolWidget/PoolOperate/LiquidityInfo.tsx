import {
  Box,
  useTheme,
  LoadingSkeleton,
  Tooltip,
  HoverOpacity,
  BaseButton,
  RotatingIcon,
} from '@dodoex/components';
import { ArrowRight, DetailBorder, Link } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../components/TokenLogo';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { ChainId } from '../../../constants/chains';
import { TokenInfo } from '../../../hooks/Token';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { formatReadableNumber } from '../../../utils';

export interface LiquidityInfoProps {
  loading?: boolean;
  hidePoolInfo?: boolean;
  pool?: {
    chainId?: number;
    address?: string;
    baseToken?: TokenInfo;
    quoteToken?: TokenInfo;
  };
  myPoolInfoLoading?: boolean;
}
export default function LiquidityInfo({
  loading,
  hidePoolInfo,
  pool,
  myPoolInfoLoading,
}: LiquidityInfoProps) {
  const theme = useTheme();
  if (!pool?.baseToken || !pool.quoteToken) return null;
  return (
    <Box
      sx={{
        mt: 16,
        mx: 20,
        border: 'solid 1px',
        borderColor: 'border.main',
        borderRadius: 12,
      }}
    >
      {!hidePoolInfo ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: theme.spacing(12, 20),
            borderStyle: 'solid',
            borderColor: 'border.main',
            borderWidth: theme.spacing(0, 0, 1),
          }}
        >
          <Box>
            <LoadingSkeleton
              loading={loading}
              loadingSx={{
                width: 100,
              }}
              sx={{
                typography: 'body2',
                fontWeight: 600,
              }}
            >
              {pool?.baseToken?.symbol}/{pool?.quoteToken?.symbol}
            </LoadingSkeleton>
            <LoadingSkeleton loading={loading}>
              <AddressWithLinkAndCopy
                address={pool?.address ?? ''}
                truncate
                iconSize={14}
                iconSpace={4}
                customChainId={pool?.chainId}
                sx={{
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              />
            </LoadingSkeleton>
          </Box>
          {pool?.address ? (
            <Box
              component={BaseButton}
              sx={{
                typography: 'body2',
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
              onClick={() => {
                useRouterStore.getState().push({
                  type: PageType.PoolDetail,
                  params: {
                    chainId: pool.chainId as ChainId,
                    address: pool.address as string,
                  },
                });
              }}
            >
              <Trans>Details</Trans>
              <Box
                component={ArrowRight}
                sx={{
                  ml: 4,
                  position: 'relative',
                  top: 1.2,
                  width: 16,
                  height: 16,
                }}
              />
            </Box>
          ) : (
            ''
          )}
        </Box>
      ) : (
        ''
      )}
      <Box
        sx={{
          p: theme.spacing(12, 20),
        }}
      >
        <Box
          sx={{
            typography: 'h6',
            color: 'text.secondary',
          }}
        >
          <Trans>My Liquidity</Trans>
        </Box>
        <Box
          sx={{
            mt: 12,
          }}
        >
          <LoadingSkeleton
            loading={loading}
            loadingSx={{
              width: 100,
            }}
          >
            {/* {liquidityLpList.map((item) => (
              <Box
                key={item.address}
                sx={{
                  display: 'flex',
                }}
              >
                {pool ? (
                  <Box
                    sx={{
                      position: 'relative',
                      top: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                ) : (
                  <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    sx={{
                      mr: 4,
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {item.label}
                  <Tooltip
                    title={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        {item.tokenBalanceList.map((son) => (
                          <Box
                            key={son.token.address}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              typography: 'body2',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <TokenLogo
                                address={son.token.address}
                                width={14}
                                height={14}
                                url={son.token.logoURI}
                                marginRight={4}
                              />
                              {son.token.symbol}
                            </Box>
                            <LoadingSkeleton loading={myPoolInfoLoading}>
                              {son.balance &&
                              !son.balance.isZero() &&
                              !son.balance.isNaN()
                                ? '~'
                                : ''}
                              {formatReadableNumber({
                                input: son.balance,
                              })}
                            </LoadingSkeleton>
                          </Box>
                        ))}
                      </Box>
                    }
                    tooltipSx={{
                      '& .MuiTooltip-tooltip': {
                        padding: 20,
                        width: 256,
                      },
                    }}
                  >
                    <HoverOpacity
                      component={DetailBorder}
                      sx={{
                        ml: 4,
                        width: 16,
                        height: 16,
                      }}
                    />
                  </Tooltip>
                  <Box
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getEtherscanPage(chainId, item.address, 'address')}
                    sx={{
                      display: 'inline-block',
                      height: 16,
                    }}
                  >
                    <HoverOpacity
                      component={Link}
                      sx={{
                        ml: 4,
                        width: 16,
                        height: 16,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))} */}
          </LoadingSkeleton>
        </Box>
      </Box>
    </Box>
  );
}

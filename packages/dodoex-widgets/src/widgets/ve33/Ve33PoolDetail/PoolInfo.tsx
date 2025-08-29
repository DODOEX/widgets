import {
  alpha,
  Box,
  LoadingSkeleton,
  Skeleton,
  useTheme,
} from '@dodoex/components';
import { PoolTypeE, Ve33PoolInfoI } from '../types';
import { t, Trans } from '@lingui/macro';
import {
  formatApy,
  formatShortNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import TokenLogo from '../../../components/TokenLogo';
import { useFetchFiatPriceBatch } from '../../../hooks/useFetchFiatPriceBatch';
import BigNumber from 'bignumber.js';
import { useVe33V3Positions } from './useVe33V3Positions';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';

export default function PoolInfo({
  poolInfo,
  isLoading,
}: {
  poolInfo?: Ve33PoolInfoI;
  isLoading?: boolean;
}) {
  const theme = useTheme();
  const fiatQuery = useFetchFiatPriceBatch({
    tokens: poolInfo ? [poolInfo.baseToken, poolInfo.quoteToken] : [],
  });
  const isV3 = poolInfo?.type === PoolTypeE.CLPool;
  const { account } = useWalletInfo();
  const { isMobile } = useWidgetDevice();
  const fetchPositions = useVe33V3Positions({
    poolInfo,
    account,
  });
  const isFetchPositionsLoading = fetchPositions.positionsQuery.some(
    (item) => item.isLoading,
  );
  let myBaseTVL = 0,
    myQuoteTVL = 0;
  fetchPositions.positionsQuery.forEach((position) => {
    myBaseTVL += position.data?.amount0 ?? 0;
    myQuoteTVL += position.data?.amount1 ?? 0;
  });

  const baseTVL = Number(poolInfo?.totalValueLockedToken0) || 0;
  const quoteTVL = Number(poolInfo?.totalValueLockedToken1) || 0;
  let baseTVLUsd = 0;
  let quoteTVLUsd = 0;
  let totalUSD = 0;
  if (poolInfo) {
    baseTVLUsd = new BigNumber(
      fiatQuery.data?.get(poolInfo?.baseToken.address) ?? 0,
    )
      .times(baseTVL)
      .toNumber();
    quoteTVLUsd = new BigNumber(
      fiatQuery.data?.get(poolInfo?.quoteToken.address) ?? 0,
    )
      .times(quoteTVL)
      .toNumber();
    totalUSD = baseTVLUsd + quoteTVLUsd;
  }
  const basePercentage =
    totalUSD && baseTVLUsd ? (baseTVLUsd / totalUSD) * 100 : 0;
  const quotePercentage =
    totalUSD && quoteTVLUsd ? (quoteTVLUsd / totalUSD) * 100 : 0;

  return (
    <Box
      sx={{
        p: 20,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: theme.palette.background.paperContrast,
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            flexBasis: '50%',
            px: 20,
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: isMobile ? 'h6' : 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>TVL</Trans>
          </Box>
          <LoadingSkeleton
            loading={isLoading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: isMobile ? 'body1' : 'caption',
              fontWeight: 600,
            }}
          >
            {formatTokenAmountNumber({
              input: totalUSD || poolInfo?.totalValueLockedUSD,
              decimals: 18,
            })}
          </LoadingSkeleton>
        </Box>
        <Box
          sx={{
            height: 48,
            width: '1px',
            flexGrow: 0,
            flexShrink: 0,
            backgroundColor: theme.palette.border.main,
          }}
        />
        <Box
          sx={{
            flexBasis: '50%',
            px: 20,
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: isMobile ? 'h6' : 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>APR</Trans>
          </Box>
          <LoadingSkeleton
            loading={isLoading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: isMobile ? 'body1' : 'caption',
              fontWeight: 600,
            }}
          >
            {formatApy(
              Number(poolInfo?.apr.fees) + Number(poolInfo?.apr.incentives),
            )}
          </LoadingSkeleton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 20,
          typography: isMobile ? 'h6' : 'body2',
          color: theme.palette.text.secondary,
        }}
      >
        <span>{t`Total ${poolInfo?.baseToken.symbol}`}</span>
        <span>{t`Total ${poolInfo?.quoteToken.symbol}`}</span>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 8,
          typography: 'body2',
        }}
      >
        <LoadingSkeleton
          loading={isLoading}
          loadingProps={{
            width: 100,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: isMobile ? 'body2' : 'h5',
              fontWeight: 600,
            }}
          >
            {formatTokenAmountNumber({
              input: baseTVL,
              decimals: poolInfo?.baseToken.decimals,
            })}
          </Box>
          <Box
            sx={{
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            ~${baseTVLUsd ? formatShortNumber(baseTVLUsd) : 0}
          </Box>
        </LoadingSkeleton>
        <LoadingSkeleton
          loading={isLoading}
          loadingProps={{
            width: 100,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: isMobile ? 'h6' : 'body2',
              color: 'text.secondary',
            }}
          >
            ~${quoteTVLUsd ? formatShortNumber(quoteTVLUsd) : 0}
          </Box>
          <Box
            sx={{
              typography: isMobile ? 'body2' : 'h5',
              fontWeight: 600,
            }}
          >
            {formatTokenAmountNumber({
              input: quoteTVL,
              decimals: poolInfo?.quoteToken.decimals,
            })}
          </Box>
        </LoadingSkeleton>
      </Box>
      {isLoading ? (
        <Skeleton
          height="fit-content"
          width="100%"
          sx={{
            mt: 16,
            height: 28,
            borderRadius: 12,
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            height: 28,
            mt: 16,
            typography: isMobile ? 'h6' : 'body2',
            borderRadius: 12,
            backgroundColor: alpha(theme.palette.secondary.main, 0.2),
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              minWidth: totalUSD ? `${basePercentage}%` : '50%',
              backgroundColor: alpha(theme.palette.purple.main, 0.2),
              px: 4,
              height: '100%',
            }}
          >
            <TokenLogo
              address={poolInfo?.baseToken.address}
              chainId={poolInfo?.baseToken.chainId}
              width={18}
              height={18}
              marginRight={0}
            />
            {basePercentage}%
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              px: 4,
              height: '100%',
            }}
          >
            <TokenLogo
              address={poolInfo?.quoteToken.address}
              chainId={poolInfo?.quoteToken.chainId}
              width={18}
              height={18}
              marginRight={0}
            />
            {quotePercentage}%
          </Box>
        </Box>
      )}

      {isV3 && account && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 20,
              typography: isMobile ? 'h6' : 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            <span>{t`My ${poolInfo?.baseToken.symbol}`}</span>
            <span>{t`My ${poolInfo?.quoteToken.symbol}`}</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 8,
              typography: isMobile ? 'h6' : 'body2',
            }}
          >
            <LoadingSkeleton
              loading={isLoading || isFetchPositionsLoading}
              loadingProps={{
                width: 100,
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  typography: isMobile ? 'body2' : 'h5',
                  fontWeight: 600,
                }}
              >
                {formatTokenAmountNumber({
                  input: myBaseTVL,
                  decimals: poolInfo?.baseToken.decimals,
                })}
              </Box>
              <Box
                sx={{
                  typography: isMobile ? 'h6' : 'body2',
                  color: 'text.secondary',
                }}
              >
                ~$
                {myBaseTVL
                  ? formatShortNumber(
                      new BigNumber(
                        fiatQuery.data?.get(poolInfo?.baseToken.address) ?? 0,
                      ).times(myBaseTVL),
                    )
                  : 0}
              </Box>
            </LoadingSkeleton>
            <LoadingSkeleton
              loading={isLoading || isFetchPositionsLoading}
              loadingProps={{
                width: 100,
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  typography: isMobile ? 'h6' : 'body2',
                  color: 'text.secondary',
                }}
              >
                ~
                {myQuoteTVL
                  ? formatShortNumber(
                      new BigNumber(
                        fiatQuery.data?.get(poolInfo?.quoteToken.address) ?? 0,
                      ).times(myQuoteTVL),
                    )
                  : 0}
              </Box>
              <Box
                sx={{
                  typography: isMobile ? 'body2' : 'h5',
                  fontWeight: 600,
                }}
              >
                {formatTokenAmountNumber({
                  input: myQuoteTVL,
                  decimals: poolInfo?.quoteToken.decimals,
                })}
              </Box>
            </LoadingSkeleton>
          </Box>
        </>
      )}
    </Box>
  );
}

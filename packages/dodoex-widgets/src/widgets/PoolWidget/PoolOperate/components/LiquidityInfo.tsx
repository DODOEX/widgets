import { ChainId } from '@dodoex/api';
import {
  Box,
  ButtonBase,
  LoadingSkeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { formatPercentageNumber } from '../../../../utils';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';
import { poolApi } from '../../utils';
import { OperatePool } from '../types';
import { MyLiquidityInfo } from './MyLiquidityInfo';

export interface LiquidityInfoProps {
  loading?: boolean;
  hidePoolInfo?: boolean;
  pool: OperatePool;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
}

export default function LiquidityInfo({
  loading: loadingProps,
  hidePoolInfo,
  pool,
  balanceInfo,
}: LiquidityInfoProps) {
  const theme = useTheme();
  const loading = loadingProps || !pool;

  const { account } = useWalletInfo();
  const feeRateQuery = useQuery(
    poolApi.getFeeRateQuery(pool?.chainId, pool?.address, pool?.type, account),
  );
  const feeRate = feeRateQuery.data?.lpFeeRate?.plus(
    feeRateQuery.data?.mtFeeRate ?? 0,
  );

  const isAMMV2 = pool?.type === 'AMMV2';

  return (
    <Box
      sx={{
        mt: 0,
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
                mb: 4,
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                typography: 'body2',
                fontWeight: 600,
              }}
            >
              {pool?.baseToken?.symbol}/{pool?.quoteToken?.symbol}
              {pool?.type === 'AMMV2' && (
                <LoadingSkeleton
                  loading={feeRateQuery.isLoading}
                  loadingProps={{
                    width: 30,
                  }}
                  sx={{
                    typography: 'h6',
                  }}
                >
                  <Tooltip
                    title={
                      <Box
                        sx={{
                          typography: 'h6',
                          '& > b': {
                            fontWeight: 600,
                            color: 'primary.main',
                          },
                        }}
                      >
                        🌟
                        <b>
                          <Trans>Tips:</Trans>
                        </b>{' '}
                        <Trans>
                          By adding liquidity you’ll earn{' '}
                          <b>{formatPercentageNumber({ input: feeRate })}</b> of
                          all trades on this pair proportional to your share of
                          the pool. Fees are added to the pool, accrue in real
                          time and can be claimed by withdrawing your liquidity.
                        </Trans>
                      </Box>
                    }
                    sx={{
                      maxWidth: 240,
                    }}
                  >
                    <Box
                      sx={{
                        px: 8,
                        py: 4,
                        borderRadius: 4,
                        typography: 'h6',
                        backgroundColor: 'background.tag',
                        color: 'text.disabled',
                      }}
                    >
                      {formatPercentageNumber({
                        input: feeRate,
                      })}
                    </Box>
                  </Tooltip>
                </LoadingSkeleton>
              )}
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
          {pool?.address && !isAMMV2 ? (
            <Box
              component={ButtonBase}
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
      <MyLiquidityInfo
        pool={pool}
        balanceInfo={balanceInfo}
        loading={loadingProps}
      />
    </Box>
  );
}

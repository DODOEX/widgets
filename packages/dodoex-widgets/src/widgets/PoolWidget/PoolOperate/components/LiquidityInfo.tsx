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
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { getPoolFeeRate } from '../../utils';
import { OperatePool } from '../types';

export interface LiquidityInfoProps {
  hidePoolInfo?: boolean;
  pool: OperatePool;
  children: React.ReactNode;
}

export default function LiquidityInfo({
  hidePoolInfo,
  pool,
  children,
}: LiquidityInfoProps) {
  const theme = useTheme();
  const loading = !pool;

  const isAMMV2 = pool?.type === 'SVM_AMMV2';

  const feeRate = pool
    ? getPoolFeeRate({
        type: pool.type,
        lpFeeRate: pool.lpFeeRate ?? '0',
        mtFeeRate: pool.mtFeeRate ?? '0',
      })
    : '-';
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
              {isAMMV2 && (
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
                        By adding liquidity you’ll earn <b>{feeRate}</b> of all
                        trades on this pair proportional to your share of the
                        pool. Fees are added to the pool, accrue in real time
                        and can be claimed by withdrawing your liquidity.
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
                    {feeRate}
                  </Box>
                </Tooltip>
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
      <Box
        sx={{
          p: theme.spacing(12, 20),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

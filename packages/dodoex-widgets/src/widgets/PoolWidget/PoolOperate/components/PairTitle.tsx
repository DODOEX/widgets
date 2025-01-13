import {
  Box,
  BoxProps,
  LoadingSkeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { formatPercentageNumber } from '../../../../utils';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';
import { getPoolAMMOrPMM, poolApi } from '../../utils';
import { OperatePool } from '../types';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import GoPoolDetailBtn from '../../PoolList/components/GoPoolDetailBtn';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';

export function PairTitle({
  loading: loadingProps,
  pool,
}: {
  loading?: boolean;
  pool: OperatePool;
}) {
  const theme = useTheme();
  const loading = loadingProps || !pool;
  const { onlyChainId, supportAMMV2, supportAMMV3, notSupportPMM } =
    useUserOptions();

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
        mb: 28,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {pool && (
        <TokenLogoPair
          tokens={[pool.baseToken, pool.quoteToken]}
          chainId={pool.chainId}
          width={32}
          mr={0}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              typography: 'caption',
            }}
          >
            {pool?.baseToken?.symbol}/{pool?.quoteToken?.symbol}
          </Box>
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
                      <b>{formatPercentageNumber({ input: feeRate })}</b> of all
                      trades on this pair proportional to your share of the
                      pool. Fees are added to the pool, accrue in real time and
                      can be claimed by withdrawing your liquidity.
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
                    backgroundColor: 'rgba(26, 26, 27, 0.10)',
                    color: 'rgba(26, 26, 27, 0.30)',
                  }}
                >
                  {formatPercentageNumber({
                    input: feeRate,
                  })}
                </Box>
              </Tooltip>
            </LoadingSkeleton>
          )}
          {(supportAMMV2 || supportAMMV3) &&
            pool &&
            getPoolAMMOrPMM(pool?.type) === 'PMM' && (
              <GoPoolDetailBtn
                chainId={pool.chainId}
                address={pool.address}
                sx={{
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                  width: 20,
                  height: 20,
                  padding: 0,
                }}
              />
            )}
        </Box>
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
      </Box>
    </Box>
  );
}

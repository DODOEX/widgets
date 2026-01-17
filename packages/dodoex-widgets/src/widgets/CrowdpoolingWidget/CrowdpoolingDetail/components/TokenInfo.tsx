import { Box, LoadingSkeleton } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { CPDetail } from '../../types';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchCP_SETTLED_TIME_QueryOptions,
  getFetchERC20TotalSupplyQueryOptions,
} from '@dodoex/dodo-contract-request';
import { formatUnits } from '@dodoex/contract-request';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import BigNumber from 'bignumber.js';
import { isCPV2 } from '../../helper';
import dayjs from 'dayjs';

interface TokenInfoProps {
  detail: CPDetail | undefined;
}

export function TokenInfo({ detail }: TokenInfoProps) {
  const totalSupplyQuery = useQuery(
    getFetchERC20TotalSupplyQueryOptions(
      detail?.chainId,
      detail?.baseToken.address,
    ),
  );
  const fetchSettledTime = useQuery(
    getFetchCP_SETTLED_TIME_QueryOptions(detail?.chainId, detail?.id),
  );
  const tokenCliffRateBg = Number(detail?.tokenCliffRate)
    ? new BigNumber(detail?.tokenCliffRate).div(1e16)
    : null;
  const settledTime = Number(fetchSettledTime.data) * 1000;
  const tokenClaimDuration = Number(detail?.tokenClaimDuration) * 1000;
  const tokenVestingDuration = Number(detail?.tokenVestingDuration) * 1000;
  const showClaimInfo = !!(
    tokenCliffRateBg?.gt(0) ||
    settledTime ||
    tokenClaimDuration ||
    tokenVestingDuration
  );
  const isV2 = isCPV2(detail?.version);

  return (
    <Box
      sx={{
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          mb: 20,
          typography: 'h5',
        }}
      >
        <Trans>Token Information</Trans>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            mobile: 'repeat(1, 1fr)',
            tablet: 'repeat(4, 1fr)',
          },
          gap: 12,
        }}
      >
        <InfoItem
          label={<Trans>Crowdpooling Token Name</Trans>}
          loading={!detail}
          value={`${detail?.baseToken.symbol}`}
        />
        <InfoItem
          label={<Trans>Total Supply</Trans>}
          loading={totalSupplyQuery.isLoading || !detail}
          value={formatTokenAmountNumber({
            input: totalSupplyQuery.data
              ? formatUnits(totalSupplyQuery.data, detail?.baseToken.decimals)
              : '-',
            decimals: detail?.baseToken.decimals,
          })}
        />
        <InfoItem
          label={<Trans>Tokens for Sale</Trans>}
          loading={!detail}
          value={formatTokenAmountNumber({
            input: detail?.salesBase,
            decimals: detail?.baseToken.decimals,
          })}
        />
        <InfoItem
          label={<Trans>Total Tokens of Poolin</Trans>}
          loading={!detail}
          value={formatTokenAmountNumber({
            input: detail?.totalBase,
            decimals: detail?.baseToken.decimals,
          })}
        />
      </Box>

      <InfoItemBetween
        label={<Trans>Address</Trans>}
        loading={!detail}
        value={
          <AddressWithLinkAndCopy
            truncate
            address={detail?.baseToken.address || ''}
            showCopy
            iconSize={14}
            iconSpace={4}
            customChainId={detail?.chainId}
          />
        }
      />
      {showClaimInfo && isV2 && (
        <>
          <InfoItemBetween
            label={<Trans>Initial Claim Percentage (%)</Trans>}
            value={formatReadableNumber({
              input: tokenCliffRateBg || '',
              showDecimals: 2,
            })}
          />
          <InfoItemBetween
            label={<Trans>Time to collect tokens</Trans>}
            value={
              detail.settled && settledTime ? (
                dayjs(settledTime + tokenClaimDuration).format(
                  'YYYY/MM/DD HH:mm',
                )
              ) : (
                <>
                  <Trans>After Settle</Trans>{' '}
                  <Trans>
                    {formatReadableNumber({
                      input: new BigNumber(tokenClaimDuration).div(
                        24 * 60 * 60,
                      ),
                      showDecimals: 0,
                    })}{' '}
                    Days
                  </Trans>
                </>
              )
            }
          />
          <InfoItemBetween
            label={<Trans>Token release cycle</Trans>}
            value={
              detail.settled && settledTime ? (
                dayjs(
                  settledTime + tokenClaimDuration + tokenVestingDuration,
                ).format('YYYY/MM/DD HH:mm')
              ) : (
                <>
                  <Trans>After Settle</Trans>{' '}
                  <Trans>
                    {formatReadableNumber({
                      input: new BigNumber(tokenVestingDuration).div(
                        24 * 60 * 60,
                      ),
                      showDecimals: 0,
                    })}{' '}
                    Days
                  </Trans>
                </>
              )
            }
          />
        </>
      )}
    </Box>
  );
}

function InfoItem({
  label,
  value,
  loading,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: 8,
        borderRadius: 8,
        backgroundColor: 'background.default',
        textAlign: 'center',
        typography: 'body2',
      }}
    >
      <Box
        sx={{
          color: 'text.secondary',
          mb: 4,
        }}
      >
        {label}
      </Box>
      <LoadingSkeleton
        loading={loading}
        loadingProps={{ width: 80 }}
        sx={{
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {value}
      </LoadingSkeleton>
    </Box>
  );
}

function InfoItemBetween({
  label,
  value,
  loading,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 12,
      }}
    >
      <Box sx={{ color: 'text.secondary' }}>{label}</Box>
      <LoadingSkeleton loading={loading} loadingProps={{ width: 100 }}>
        {value}
      </LoadingSkeleton>
    </Box>
  );
}

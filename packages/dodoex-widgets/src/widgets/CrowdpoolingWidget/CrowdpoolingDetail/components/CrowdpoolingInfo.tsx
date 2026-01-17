import {
  Box,
  LoadingSkeleton,
  useMediaDevices,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import dayjs from 'dayjs';
import { CPDetail } from '../../types';
import { PageType, useRouterStore } from '../../../../router';
import { useQuery } from '@tanstack/react-query';
import { getFetchCP_IS_OVERCAP_STOPQueryOptions } from '@dodoex/dodo-contract-request';
import { useMemo } from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { secondsToDays } from '../../../../utils/time';
import { formatReadableNumber } from '../../../../utils';
import BigNumber from 'bignumber.js';
import CountdownTime from '../../../../components/CountdownTime';
import { isCPV2 } from '../../helper';

interface CrowdpoolingInfoProps {
  detail: CPDetail | undefined;
}

export function CrowdpoolingInfo({ detail }: CrowdpoolingInfoProps) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const router = useRouterStore();

  const isSkipOverflowLimitFetch = !isCPV2(detail?.version);
  const fetchIsOverflowLimit = useQuery(
    getFetchCP_IS_OVERCAP_STOPQueryOptions(
      detail?.chainId,
      isSkipOverflowLimitFetch ? undefined : detail?.id,
    ),
  );
  const overflowLimitText = useMemo(() => {
    if (
      isSkipOverflowLimitFetch ||
      fetchIsOverflowLimit.isError ||
      typeof fetchIsOverflowLimit.data !== 'boolean'
    ) {
      return '--';
    }
    if (fetchIsOverflowLimit.data) {
      return <Trans>Stocks last</Trans>;
    }
    return <Trans>Over-fundraising is allowed</Trans>;
  }, [fetchIsOverflowLimit.data, isSkipOverflowLimitFetch]);

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: {
            mobile: 'flex-start',
            tablet: 'center',
          },
          mb: 20,
          typography: 'h5',
          flexDirection: {
            mobile: 'column',
            tablet: 'row',
          },
          gap: 8,
        }}
      >
        <Trans>Crowdpooling Information</Trans>
        {!!detail && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              typography: 'body1',
              fontWeight: 600,
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.7,
              },
            }}
            onClick={() => {
              router.push({
                type: PageType.CrowdpoolingDetail,
                params: {
                  chainId: detail.chainId,
                  address: detail.id,
                },
              });
            }}
          >
            <Trans>
              View detail
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.143 5.67542L14.1613 5.65714L14.143 5.63887V3.85715H12.3613L12.343 3.83887L12.3247 3.85715H6.4287V6.42858H9.75327L3.32471 12.8571L5.14298 14.6754L11.5716 8.24685V11.5714H14.143V5.67542Z"
                  fill="currentColor"
                />
              </svg>
            </Trans>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: {
            mobile: 'flex',
            tablet: 'grid',
          },
          flexDirection: {
            mobile: 'row',
            tablet: 'initial',
          },
          flexWrap: {
            mobile: 'wrap',
          },
          gridTemplateColumns: {
            tablet: 'repeat(4, 1fr)',
          },
          gap: 12,
          ...(isMobile && {
            '& > :nth-of-type(1), & > :nth-of-type(2)': {
              width: 'calc(50% - 6px)',
            },
            '& > :nth-of-type(n+3)': {
              width: '100%',
            },
          }),
        }}
      >
        <InfoItem
          label={<Trans>Start Time</Trans>}
          loading={!detail}
          value={dayjs(detail?.bidStartTime).format('YYYY/MM/DD HH:mm:ss')}
        />
        <InfoItem
          label={<Trans>End Time</Trans>}
          loading={!detail}
          value={dayjs(detail?.bidEndTime).format('YYYY/MM/DD HH:mm:ss')}
        />
        <InfoItem
          label={<Trans>Crowdpooling Type</Trans>}
          loading={!detail || fetchIsOverflowLimit.isLoading}
          value={overflowLimitText}
        />
        <InfoItem
          label={<Trans>Creator</Trans>}
          loading={!detail}
          value={
            <AddressWithLinkAndCopy
              truncate
              showCopy
              address={detail?.creator}
              iconSize={14}
              iconSpace={4}
              customChainId={detail?.chainId}
            />
          }
        />
      </Box>

      <Box
        sx={{
          mt: 12,
          p: 16,
          borderRadius: 8,
          backgroundColor: theme.palette.background.paperDarkContrast,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pb: 8,
            mb: 8,
            borderBottom: `solid 1px ${theme.palette.border.main}`,
            typography: 'body2',
            ...(isMobile
              ? {
                  flexDirection: 'column',
                  gap: 4,
                }
              : {
                  alignItems: 'center',
                }),
          }}
        >
          <Box sx={{ color: 'text.secondary' }}>
            <Trans>Liquidity Protection</Trans>
          </Box>
          <Box>
            {t`${secondsToDays(detail?.freezeDuration ?? 0)} Days`}
            {detail?.isEscalation && (
              <Box sx={{ color: 'text.secondary' }} component="span">
                {' '}
                (<Trans>Remaining</Trans>:
                <CountdownTime endTime={detail?.calmEndTime} />)
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ typography: 'h6', color: 'text.secondary' }}>
          <Trans>
            After the end of a Crowdpooling campaign, there is a Liquidity
            Protection period. During this period, the Crowdpooling campaign
            creator's funds will be locked to guarantee sufficient market depth
            and liquidity.
          </Trans>
        </Box>
      </Box>

      {detail?.version?.includes('2') && (
        <Box
          sx={{
            mt: 12,
            p: 16,
            borderRadius: 8,
            backgroundColor: theme.palette.background.paperDarkContrast,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pb: 8,
              mb: 8,
              borderBottom: `solid 1px ${theme.palette.border.main}`,
              typography: 'body2',
              ...(isMobile
                ? {
                    flexDirection: 'column',
                    gap: 4,
                  }
                : {
                    alignItems: 'center',
                  }),
            }}
          >
            <Box sx={{ color: 'text.secondary' }}>
              <Trans>Pool Building Fee (%)</Trans>
            </Box>
            <Box>{`${formatReadableNumber({ input: new BigNumber(detail.feeRate).div(1e16), showDecimals: 2 })}%`}</Box>
          </Box>
          <Box sx={{ typography: 'h6', color: 'text.secondary' }}>
            <Trans>
              This is the trading fee rate of the liquidity pool generated at
              the end of the Crowdpooling campaign; by default this is set to
              0.3%.
            </Trans>
          </Box>
        </Box>
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
          display: 'flex',
          justifyContent: 'center',
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {value}
      </LoadingSkeleton>
    </Box>
  );
}

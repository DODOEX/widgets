import { Box, useTheme, HoverOpacity } from '@dodoex/components';
import { CPDetail } from '../../types';
import React from 'react';
import { t, Trans } from '@lingui/macro';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { EmptyAddress } from '../../../../constants/address';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { ArrowTopRight } from '@dodoex/icons';
import { useQuery } from '@tanstack/react-query';
import { getFetchCP_SETTLED_TIME_QueryOptions } from '@dodoex/dodo-contract-request';

interface Props {
  detail: CPDetail;
  dvmPoolAddress?: string;
  totalSupply: BigNumber;
}

export const ParametersTable: React.FC<Props> = ({
  detail,
  dvmPoolAddress,
  totalSupply,
}: Props) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const router = useRouterStore();

  const fetchSettledTime = useQuery(
    getFetchCP_SETTLED_TIME_QueryOptions(detail?.chainId, detail?.id),
  );

  const settledTime = fetchSettledTime.data
    ? Number(fetchSettledTime.data) * 1000
    : 0;

  const formatDateTime = (timestamp: number) => {
    return dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss');
  };

  const handleViewPoolDetail = () => {
    if (dvmPoolAddress) {
      router.push({
        type: PageType.PoolDetail,
        params: {
          address: dvmPoolAddress,
          chainId: detail.chainId,
        },
      });
    }
  };

  return (
    <Box
      sx={{
        mt: 30,
        display: 'flex',
        position: 'relative',
        flexDirection: isMobile ? 'column' : 'row',
        '&:after': {
          ...(isMobile ? { display: 'none' } : {}),
          content: '""',
          position: 'absolute',
          width: '1px',
          height: 130,
          backgroundColor: theme.palette.border.main,
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
        },
      }}
    >
      <Box
        sx={{
          flex: '1 0 50%',
          pr: isMobile ? 0 : 30,
          overflow: 'hidden',
        }}
      >
        <ParameterItem
          title={<Trans>Liquidity Protection</Trans>}
          value={
            <>
              {detail.protectionDays || Math.floor(detail.freezeDuration / 86400)}{' '}
              <Trans>Days</Trans>
            </>
          }
        />
        <ParameterItem
          title={<Trans>Start Time</Trans>}
          value={formatDateTime(detail.bidStartTime)}
        />
        <ParameterItem
          title={<Trans>End Time</Trans>}
          value={formatDateTime(detail.bidEndTime)}
        />
        {detail.isEscalation && (
          <ParameterItem
            title={<Trans>End Calm Time</Trans>}
            value={formatDateTime(detail.calmEndTime)}
          />
        )}
        <ParameterItem
          title={<Trans>Liquidity Protection Time</Trans>}
          value={formatDateTime(
            detail.freezeDuration +
              (settledTime || detail.calmEndTime || detail.bidEndTime),
          )}
        />
        <ParameterItem
          title={<Trans>Creator</Trans>}
          value={
            <AddressWithLinkAndCopy
              truncate
              address={detail.creator}
              customChainId={detail.chainId}
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                '& svg': {
                  color: theme.palette.text.primary,
                  '&:hover': {
                    opacity: 0.5,
                  },
                },
              }}
            />
          }
        />
        <ParameterItem
          title={<Trans>Creation Time</Trans>}
          value={formatDateTime(detail.createTime)}
        />
      </Box>

      <Box
        sx={{
          flex: '1 0 50%',
          pl: isMobile ? 0 : 30,
        }}
      >
        <ParameterItem
          title={<Trans>Name</Trans>}
          value={`${detail.baseToken.symbol} (${detail.baseToken.name})`}
        />
        <ParameterItem
          title={<Trans>Address</Trans>}
          value={
            <AddressWithLinkAndCopy
              truncate
              address={detail.baseToken.address}
              customChainId={detail.chainId}
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                '& svg': {
                  color: theme.palette.text.primary,
                  '&:hover': {
                    opacity: 0.5,
                  },
                },
              }}
            />
          }
        />

        <ParameterItem
          title={<Trans>Total Supply</Trans>}
          value={totalSupply.toString()}
        />
        {dvmPoolAddress && dvmPoolAddress !== EmptyAddress && (
          <ParameterItem
            title={<Trans>Pool Address</Trans>}
            value={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AddressWithLinkAndCopy
                  truncate
                  address={dvmPoolAddress}
                  customChainId={detail.chainId}
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    '& svg': {
                      color: theme.palette.text.primary,
                      '&:hover': {
                        opacity: 0.5,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    ml: 20,
                    pr: 10,
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      width: '1px',
                      height: 12,
                      backgroundColor: theme.palette.border.main,
                      position: 'absolute',
                      left: -10,
                      top: 0,
                      bottom: 0,
                      margin: 'auto',
                    },
                  }}
                >
                  <HoverOpacity
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color:
                        theme.palette.mode === 'light'
                          ? '#B15600'
                          : theme.palette.primary.main,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={handleViewPoolDetail}
                  >
                    <Trans>View Detail</Trans>
                    <Box
                      component={ArrowTopRight}
                      sx={{ ml: 4, width: 16, height: 16 }}
                    />
                  </HoverOpacity>
                </Box>
              </Box>
            }
          />
        )}
      </Box>
    </Box>
  );
};

function ParameterItem({
  title,
  value,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 10,
      }}
    >
      <Box
        sx={{
          color: 'text.secondary',
          flexShrink: 0,
          mr: 12,
          typography: 'body2',
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          lineHeight: '20px',
          fontSize: 16,
          fontWeight: 500,
          overflow: 'hidden',
          color: 'text.primary',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

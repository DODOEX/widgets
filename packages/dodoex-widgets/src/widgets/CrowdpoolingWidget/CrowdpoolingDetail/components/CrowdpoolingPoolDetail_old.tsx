import { Box, useTheme, Button, Tabs, TabPanel, alpha } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import { PageType, useRouterStore } from '../../../../router';
import { Page } from '../../../../router/types';
import { usePoolDetail } from '../../../PoolWidget/hooks/usePoolDetail';
import GoBack from '../../../../components/GoBack';
import WidgetContainer from '../../../../components/WidgetContainer';
import WidgetConfirm from '../../../../components/WidgetConfirm';
import React from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { formatReadableNumber, formatPercentageNumber } from '../../../../utils';
import BigNumber from 'bignumber.js';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import dayjs from 'dayjs';
import QuestionTooltip from '../../../../components/Tooltip/QuestionTooltip';

interface CrowdpoolingPoolDetailProps {
  params: Page<PageType.CrowdpoolingPoolDetail>['params'];
}

export function CrowdpoolingPoolDetail({ params }: CrowdpoolingPoolDetailProps) {
  const theme = useTheme();
  const router = useRouterStore();
  const [activeTab, setActiveTab] = React.useState(0);
  const [chartTab, setChartTab] = React.useState(0);
  const [timeRange, setTimeRange] = React.useState<'1H' | '1D'>('1D');

  const { poolDetail: pool, ...fetchPoolQuery } = usePoolDetail({
    id: params?.address,
    chainId: params?.chainId,
  });

  const [noResultModalVisible, setNoResultModalVisible] = React.useState<
    'initial' | 'open' | 'close'
  >('initial');

  if (
    !fetchPoolQuery.isPending &&
    !fetchPoolQuery.error &&
    !pool &&
    noResultModalVisible === 'initial'
  ) {
    setNoResultModalVisible('open');
  }

  const handleGoBack = () => {
    router.push({
      type: PageType.CrowdpoolingList,
    });
  };

  // Mock data - in production, this should come from pool details and CP data
  const mockData = {
    progress: 84.6,
    participants: 910,
    pooled: '905.74K',
    totalSupply: '10,000',
    tokensForSale: '3,000',
    hardCap: '6,000',
    percentForSale: '30.00%',
    price: '1 ETH = 3141 USDT',
  };

  return (
    <WidgetContainer>
      <Box
        sx={{
          p: { mobile: 20, tablet: 40 },
          maxWidth: 1140,
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 44 }}>
          <GoBack onClick={handleGoBack} />
        </Box>

        {/* Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 32 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {pool?.baseToken && pool?.quoteToken && (
              <>
                <TokenLogo
                  address={pool.baseToken.address}
                  chainId={pool.chainId}
                  width={24}
                  height={24}
                  url={pool.baseToken.logoURI}
                />
                <TokenLogo
                  address={pool.quoteToken.address}
                  chainId={pool.chainId}
                  width={24}
                  height={24}
                  url={pool.quoteToken.logoURI}
                  sx={{ ml: -1 }}
                />
              </>
            )}
            <Box sx={{ typography: 'h3', fontWeight: 600 }}>
              <Trans>Add Liquidity</Trans>
            </Box>
          </Box>
        </Box>

        {/* Main Content Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { mobile: '1fr', tablet: '785px 1fr' },
            gap: 12,
            mb: 32,
          }}
        >
          {/* Left: Chart Section */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 16,
              p: 20,
            }}
          >
            {/* Chart Tabs */}
            <Box sx={{ borderBottom: `1px solid ${theme.palette.border.main}`, mb: 20 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 32,
                  pb: 12,
                }}
              >
                <Box
                  onClick={() => setChartTab(0)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: chartTab === 0 ? 'text.primary' : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 12,
                    '&::after': chartTab === 0 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Taker Token</Trans>
                </Box>
                <Box
                  onClick={() => setChartTab(1)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: chartTab === 1 ? 'text.primary' : 'text.secondary',
                    cursor: 'pointer',
                  }}
                >
                  <Trans>Creators</Trans>
                </Box>
                <Box
                  onClick={() => setChartTab(2)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: chartTab === 2 ? 'text.primary' : 'text.secondary',
                    cursor: 'pointer',
                  }}
                >
                  <Trans>Depth Chart</Trans>
                </Box>
              </Box>
            </Box>

            {/* Price Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 20 }}>
              <Box>
                <Box sx={{ typography: 'h4', fontWeight: 600, mb: 4 }}>
                  {pool?.baseToken?.symbol} / {pool?.quoteToken?.symbol}
                </Box>
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  1 {pool?.baseToken?.symbol} = {pool?.baseToken?.price || 0} {pool?.quoteToken?.symbol}
                </Box>
              </Box>

              {/* Time Range Toggle */}
              <Box
                sx={{
                  display: 'flex',
                  borderRadius: 12,
                  backgroundColor: theme.palette.background.tag,
                  p: 1,
                }}
              >
                <Box
                  onClick={() => setTimeRange('1H')}
                  sx={{
                    px: 12,
                    py: 4,
                    cursor: 'pointer',
                    typography: 'caption',
                    fontWeight: 500,
                    borderRadius: 11,
                    ...(timeRange === '1H' && {
                      backgroundColor: theme.palette.background.paper,
                      color: 'text.primary',
                    }),
                    ...(timeRange !== '1H' && {
                      color: 'text.secondary',
                    }),
                  }}
                >
                  1 H
                </Box>
                <Box
                  onClick={() => setTimeRange('1D')}
                  sx={{
                    px: 12,
                    py: 4,
                    cursor: 'pointer',
                    typography: 'caption',
                    fontWeight: 500,
                    borderRadius: 11,
                    ...(timeRange === '1D' && {
                      backgroundColor: theme.palette.background.paper,
                      color: 'text.primary',
                    }),
                    ...(timeRange !== '1D' && {
                      color: 'text.secondary',
                    }),
                  }}
                >
                  1 D
                </Box>
              </Box>
            </Box>

            {/* Chart Placeholder */}
            <Box
              sx={{
                height: 410,
                backgroundColor: theme.palette.background.tag,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Trans>Chart data loading...</Trans>
            </Box>
          </Box>

          {/* Right: Info Card */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 16,
              p: 20,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Progress */}
            <Box sx={{ mb: 20 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 8 }}>
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  <Trans>Progress</Trans>
                </Box>
                <Box sx={{ typography: 'h4', fontWeight: 600 }}>
                  {mockData.progress}%
                </Box>
              </Box>
              <Box
                sx={{
                  height: 8,
                  backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(mockData.progress, 100)}%`,
                    height: '100%',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, mb: 20 }}>
              <StatsCard
                icon="participants"
                label={<Trans>Participants</Trans>}
                value={mockData.participants.toString()}
              />
              <StatsCard
                icon="pooled"
                label={<Trans>Pooled(WETH)</Trans>}
                value={mockData.pooled}
              />
            </Box>

            {/* Details Grid */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, mb: 20 }}>
              <InfoRow
                label={<Trans>Total Supplied by Creator</Trans>}
                value={mockData.totalSupply}
                icon={pool?.baseToken}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoRow
                  label={<Trans>Price</Trans>}
                  value={mockData.price}
                  small
                />
                <InfoRow
                  label={<Trans>% of Tokens for Sale</Trans>}
                  value={mockData.percentForSale}
                  small
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoRow
                  label={<Trans>Hard Cap</Trans>}
                  value={mockData.hardCap}
                  icon={pool?.quoteToken}
                  small
                />
                <InfoRow
                  label={<Trans>Tokens for Sale</Trans>}
                  value={mockData.tokensForSale}
                  icon={pool?.baseToken}
                  small
                />
              </Box>
            </Box>

            {/* Retrieve Button */}
            <Button
              fullWidth
              sx={{
                height: 60,
                borderRadius: 16,
              }}
            >
              <Trans>Retrieve LPtoken</Trans>
            </Button>
          </Box>
        </Box>

        {/* Parameters Section */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 16,
            p: 20,
          }}
        >
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue as number)}>
            {/* Tab Headers */}
            <Box sx={{ borderBottom: `1px solid ${theme.palette.border.main}`, mb: 20 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 32,
                  pb: 12,
                }}
              >
                <Box
                  onClick={() => setActiveTab(0)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: activeTab === 0 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 12,
                    '&::after': activeTab === 0 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Parameters</Trans>
                </Box>
                <Box
                  onClick={() => setActiveTab(1)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: activeTab === 1 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 12,
                    '&::after': activeTab === 1 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Swaps</Trans>
                </Box>
                <Box
                  onClick={() => setActiveTab(2)}
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: activeTab === 2 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 12,
                    '&::after': activeTab === 2 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Creators</Trans>
                </Box>
              </Box>
            </Box>

            {/* Parameters Table */}
            <TabPanel value={activeTab} index={0}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1px 1fr' },
                gap: 0,
              }}
            >
              {/* Left Column */}
              <Box>
                <ParamRow
                  label={<Trans>Liquidity Protection</Trans>}
                  value="1 Days"
                  showTooltip
                />
                <ParamRow
                  label={<Trans>Start Time</Trans>}
                  value="2021/11/15 09:34:10"
                />
                <ParamRow
                  label={<Trans>Liquidity Protection Until</Trans>}
                  value="2021/11/16 11:44:00"
                  highlighted
                />
                <ParamRow
                  label={<Trans>Creator</Trans>}
                  value="0x0000...0000"
                  showTooltip
                  showLink
                  highlighted
                />
                <ParamRow
                  label={<Trans>Creation Date</Trans>}
                  value="2021/11/14 10:09:10"
                  highlighted
                />
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  width: 1,
                  backgroundColor: theme.palette.border.main,
                  mx: 0,
                }}
              />

              {/* Right Column */}
              <Box>
                <ParamRow
                  label={<Trans>Token Name</Trans>}
                  value={`${pool?.baseToken?.symbol}(${pool?.baseToken?.symbol})`}
                />
                <ParamRow
                  label={<Trans>Address</Trans>}
                  value={pool?.address || '0x9813...0457'}
                  showLink
                />
                <ParamRow
                  label={<Trans>Total Supply</Trans>}
                  value="10000000000"
                />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 20, textAlign: 'center', color: 'text.secondary' }}>
              <Trans>Swaps data will be displayed here</Trans>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 20, textAlign: 'center', color: 'text.secondary' }}>
              <Trans>Creators data will be displayed here</Trans>
            </Box>
          </TabPanel>
          </Tabs>
        </Box>
      </Box>

      <WidgetConfirm
        singleBtn
        open={noResultModalVisible === 'open'}
        onClose={() => setNoResultModalVisible('close')}
        onConfirm={() => setNoResultModalVisible('close')}
        title={t`Pool not found. Please switch to another network and retry.`}
      />
    </WidgetContainer>
  );
}

// Helper Components
function StatsCard({
  icon,
  label,
  value,
}: {
  icon: 'participants' | 'pooled';
  label: React.ReactNode;
  value: string;
}) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.text.primary, 0.05),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Icon placeholder */}
        <Box sx={{ width: 24, height: 24, backgroundColor: alpha(theme.palette.text.primary, 0.1), borderRadius: '50%' }} />
      </Box>
      <Box>
        <Box sx={{ typography: 'h4', fontWeight: 600 }}>{value}</Box>
        <Box sx={{ typography: 'caption', color: 'text.secondary' }}>{label}</Box>
      </Box>
    </Box>
  );
}

function InfoRow({
  label,
  value,
  icon,
  small,
}: {
  label: React.ReactNode;
  value: string;
  icon?: { address?: string; logoURI?: string };
  small?: boolean;
}) {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ typography: 'caption', color: 'text.secondary', mb: 4 }}>
        {label}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <TokenLogo
            address={icon.address || ''}
            width={small ? 16 : 24}
            height={small ? 16 : 24}
            url={icon.logoURI}
          />
        )}
        <Box sx={{ typography: small ? 'body2' : 'h5', fontWeight: 600 }}>
          {value}
        </Box>
      </Box>
    </Box>
  );
}

function ParamRow({
  label,
  value,
  showTooltip,
  showLink,
  highlighted,
}: {
  label: React.ReactNode;
  value: string;
  showTooltip?: boolean;
  showLink?: boolean;
  highlighted?: boolean;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 9,
        px: 21,
        ...(highlighted && {
          backgroundColor: theme.palette.background.tag,
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
          {label}
        </Box>
        {showTooltip && (
          <QuestionTooltip title="Tooltip content" />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {showLink ? (
          <AddressWithLinkAndCopy
            address={value}
            truncate
            sx={{
              typography: 'caption',
              color: 'text.primary',
            }}
          />
        ) : (
          <Box sx={{ typography: 'caption', color: 'text.primary' }}>
            {value}
          </Box>
        )}
      </Box>
    </Box>
  );
}

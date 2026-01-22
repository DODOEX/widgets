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
    currentAmount: '6.004 WETH',
    currentTime: 'January 4, 2025 10:55 AM',
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
        <Box sx={{ mb: 16 }}>
          <GoBack 
            onClick={handleGoBack} 
            text={<Trans>Go back</Trans>}
            sx={{
              '& .MuiTypography-root': {
                fontSize: 16,
                fontWeight: 500,
              }
            }}
          />
        </Box>

        {/* Title: Address Display */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 28 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AddressWithLinkAndCopy
              address={pool?.address || params?.address || '0x4165a3dA5e5852e58f5e58'}
              truncate
              showCopy
              size="big"
              iconSize={24}
              iconSpace={12}
              sx={{
                fontSize: 32,
                fontWeight: 600,
                lineHeight: '44px',
                color: 'text.primary',
              }}
            />
          </Box>
          {/* Status badge */}
          <Box
            sx={{
              px: 8,
              py: 4,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 'normal',
            }}
          >
            <Trans>Processing</Trans>
          </Box>
        </Box>

        {/* Main Content Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { mobile: '1fr', tablet: '1fr 340px' },
            gap: 12,
            mb: 12,
          }}
        >
          {/* Left: Chart Section */}
          <Box
            sx={{
              backgroundColor: '#F2F2F2',
              borderRadius: 16,
              p: 20,
            }}
          >
            {/* Chart Tabs */}
            <Box sx={{ mb: 20 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 32,
                  borderBottom: `1px solid ${theme.palette.border.main}`,
                  pb: 0,
                }}
              >
                <Box
                  onClick={() => setChartTab(0)}
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 'normal',
                    color: chartTab === 0 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': chartTab === 0 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 24,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Crowdpooling amount</Trans>
                </Box>
                <Box
                  onClick={() => setChartTab(1)}
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 'normal',
                    color: chartTab === 1 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': chartTab === 1 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 24,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Creators</Trans>
                </Box>
                <Box
                  onClick={() => setChartTab(2)}
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 'normal',
                    color: chartTab === 2 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': chartTab === 2 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 24,
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  <Trans>Depth Chart</Trans>
                </Box>
              </Box>
            </Box>

            {/* Price Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 30 }}>
              <Box>
                {/* Current Amount - 20px Display */}
                <Box sx={{ fontSize: 20, fontWeight: 600, lineHeight: '27px', mb: 8, color: 'text.primary' }}>
                  {mockData.currentAmount}
                </Box>
                
                {/* Time & Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary' }}>
                    {mockData.currentTime}
                  </Box>
                  {/* Refresh icon placeholder */}
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
                    px: 10,
                    py: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: '16px',
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
                    px: 10,
                    py: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: '16px',
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

            {/* Chart Area */}
            <Box
              sx={{
                height: 410,
                backgroundColor: theme.palette.background.tag,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                position: 'relative',
              }}
            >
              {/* Chart implementation would go here */}
              <Trans>Chart data loading...</Trans>
            </Box>
          </Box>

          {/* Right: Info Card */}
          <Box
            sx={{
              backgroundColor: '#F2F2F2',
              borderRadius: 16,
              p: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {/* Progress */}
              <Box sx={{ mb: 28 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 8 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary' }}>
                    <Trans>Progress</Trans>
                  </Box>
                  <Box sx={{ fontSize: 20, fontWeight: 600, lineHeight: '27px' }}>
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
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, mb: 26 }}>
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

              {/* Total Supplied by Creator */}
              <Box sx={{ mb: 18 }}>
                <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary', mb: 6 }}>
                  <Trans>Total Supplied by Creator</Trans>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {pool?.baseToken && (
                    <TokenLogo
                      address={pool.baseToken.address}
                      chainId={pool.chainId}
                      width={24}
                      height={24}
                      url={pool.baseToken.logoURI}
                    />
                  )}
                  <Box sx={{ fontSize: 20, fontWeight: 600, lineHeight: '27px' }}>
                    {mockData.totalSupply}
                  </Box>
                </Box>
              </Box>

              {/* Price & % Row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, mb: 18 }}>
                <Box>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary', mb: 6 }}>
                    <Trans>Price</Trans>
                  </Box>
                  <Box sx={{ fontSize: 14, fontWeight: 600, lineHeight: '19px' }}>
                    {mockData.price}
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary', mb: 6 }}>
                    <Trans>% of Tokens for Sale</Trans>
                  </Box>
                  <Box sx={{ fontSize: 14, fontWeight: 600, lineHeight: '19px' }}>
                    {mockData.percentForSale}
                  </Box>
                </Box>
              </Box>

              {/* Hard Cap & Tokens for Sale Row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, mb: 28 }}>
                <Box>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary', mb: 6 }}>
                    <Trans>Hard Cap</Trans>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {pool?.quoteToken && (
                      <TokenLogo
                        address={pool.quoteToken.address}
                        chainId={pool.chainId}
                        width={16}
                        height={16}
                        url={pool.quoteToken.logoURI}
                      />
                    )}
                    <Box sx={{ fontSize: 14, fontWeight: 600, lineHeight: '19px' }}>
                      {mockData.hardCap}
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary', mb: 6 }}>
                    <Trans>Tokens for Sale</Trans>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {pool?.baseToken && (
                      <TokenLogo
                        address={pool.baseToken.address}
                        chainId={pool.chainId}
                        width={16}
                        height={16}
                        url={pool.baseToken.logoURI}
                      />
                    )}
                    <Box sx={{ fontSize: 14, fontWeight: 600, lineHeight: '19px' }}>
                      {mockData.tokensForSale}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Retrieve Button */}
            <Button
              fullWidth
              sx={{
                height: 60,
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '16px',
              }}
            >
              <Trans>Retrieve LPtoken</Trans>
            </Button>
          </Box>
        </Box>

        {/* Parameters Section */}
        <Box
          sx={{
            backgroundColor: '#F2F2F2',
            borderRadius: 16,
            p: 20,
          }}
        >
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue as number)}>
            {/* Tab Headers */}
            <Box sx={{ mb: 20 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 32,
                  borderBottom: `1px solid ${theme.palette.border.main}`,
                  pb: 0,
                }}
              >
                <Box
                  onClick={() => setActiveTab(0)}
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: '22px',
                    color: activeTab === 0 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': activeTab === 0 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 26,
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
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: '22px',
                    color: activeTab === 1 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': activeTab === 1 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 26,
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
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: '22px',
                    color: activeTab === 2 ? theme.palette.primary.main : 'text.secondary',
                    cursor: 'pointer',
                    position: 'relative',
                    pb: 10,
                    '&::after': activeTab === 2 ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: 26,
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
            <TabPanel value={0}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1px 1fr' },
                  gap: 0,
                }}
              >
                {/* Left Column - 6 rows */}
                <Box sx={{ pr: 21 }}>
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
                    label={<Trans>End Time</Trans>}
                    value="2021/11/16 09:34:10"
                  />
                  <ParamRow
                    label={<Trans>Liquidity Protection Until</Trans>}
                    value="2021/11/16 11:44:00"
                    
                  />
                  <ParamRow
                    label={<Trans>Creator</Trans>}
                    value="0x0000...0000"
                    showTooltip
                    showLink
                    
                  />
                  <ParamRow
                    label={<Trans>Creation Date</Trans>}
                    value="2021/11/14 10:09:10"
                    
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

                {/* Right Column - 3 rows */}
                <Box sx={{ pl: 21 }}>
                  <ParamRow
                    label={<Trans>Token Name</Trans>}
                    value={`${pool?.baseToken?.symbol || 'ETH'}(${pool?.baseToken?.symbol || 'ETH'})`}
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

            <TabPanel value={1}>
              <Box sx={{ p: 20, textAlign: 'center', color: 'text.secondary' }}>
                <Trans>Swaps data will be displayed here</Trans>
              </Box>
            </TabPanel>

            <TabPanel value={2}>
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
        {/* Icon placeholder - should be replaced with actual icon */}
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            backgroundColor: alpha(theme.palette.text.primary, 0.1), 
            borderRadius: '50%' 
          }} 
        />
      </Box>
      <Box>
        <Box sx={{ fontSize: 20, fontWeight: 600, lineHeight: '27px' }}>{value}</Box>
        <Box sx={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: 'text.secondary' }}>{label}</Box>
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
        minHeight: 34,
        py: 9,
        ...(highlighted && {
          backgroundColor: theme.palette.background.tag,
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ fontSize: 12, fontWeight: 500, lineHeight: '16px', color: 'text.secondary' }}>
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
              fontSize: 12,
              fontWeight: 500,
              lineHeight: '16px',
              color: 'text.primary',
              textDecoration: 'underline',
            }}
          />
        ) : (
          <Box sx={{ fontSize: 12, fontWeight: 500, lineHeight: '16px', color: 'text.primary' }}>
            {value}
          </Box>
        )}
      </Box>
    </Box>
  );
}

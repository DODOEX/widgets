import { Box, alpha, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React, { useMemo, useState } from 'react';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import GoBack from '../../../components/GoBack';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useCPDetail } from '../CrowdpoolingDetail/hooks/useCPDetail';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { useCPDynamicStatus } from '../CrowdpoolingDetail/hooks/useCPDynamicStatus';
import CrowdpoolingAmountChart from './components/CrowdpoolingAmountChart';
import DepthAndLiquidityChart from './components/DepthAndLiquidityChart';
import { CreatorsTable } from './components/CreatorsTable';
import { ParametersTable } from './components/ParametersTable';
import SwapsTable from './components/SwapsTable';
import BigNumber from 'bignumber.js';
import { getPmmModel } from '@dodoex/api';
import Confirm from '../../../components/Confirm';
import { useCPPmmState } from './hooks/useCPPmmState';
import { ReactComponent as TradersIcon } from '../../../assets/icons/users.svg';
import { ReactComponent as PooledIcon } from '../../../assets/icons/pooled.svg';
import { formatReadableNumber } from '../../../utils';
import { useQuery } from '@tanstack/react-query';
import { getFetchERC20TotalSupplyQueryOptions } from '@dodoex/dodo-contract-request';
import { formatUnits } from '@dodoex/contract-request';

type CPDetailChartType = 'taker-token' | 'creators' | 'depth-chart';
type CPDetailTableType = 'parameters' | 'swaps' | 'creators';

export default function CrowdpoolingPoolDetail({
  params,
}: {
  params?: Page<PageType.CrowdpoolingPoolDetail>['params'];
}) {
  const router = useRouterStore();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account, queryChainId } = useWalletInfo();

  const address = params?.address || '';
  const chainId = params?.chainId ?? queryChainId;

  const [activeChartType, setActiveChartType] =
    useState<CPDetailChartType>('taker-token');
  const [activeTableType, setActiveTableType] =
    useState<CPDetailTableType>('parameters');
  const [noResultModalVisible, setNoResultModalVisible] = useState(false);

  const { detail, loading, error, refetch } = useCPDetail({
    id: address,
    chainId,
    account,
  });

  const isSettled = detail?.settled;

  const { status } = useCPDynamicStatus({
    cp: detail,
    isSettled,
  });

  const poolAddress = useMemo(() => {
    if (isSettled) {
      return detail?.dvm?.id;
    } else if (isSettled === false) {
      return address;
    }
    return undefined;
  }, [isSettled, detail, address]);

  const { pmmState, } = useCPPmmState({
    chainId,
    poolAddress,
    totalBase: detail?.totalBase,
    baseDecimals: detail?.baseToken.decimals,
    quoteDecimals: detail?.quoteToken.decimals,
    isSettled,
  });

  const pmmModel = pmmState ? getPmmModel(pmmState) : undefined;
  const midPrice = pmmModel?.getMidPrice();

  const handleGotoList = () => {
    router.push({
      type: PageType.CrowdpoolingList,
    });
  };

  // Query ERC20 token totalSupply from contract
  const totalSupplyQuery = useQuery(
    getFetchERC20TotalSupplyQueryOptions(
      detail?.chainId,
      detail?.baseToken.address,
    ),
  );

  // Use queried totalSupply, fallback to 0
  const totalSupply = useMemo(() => {
    if (!totalSupplyQuery.data || !detail?.baseToken.decimals) {
      return new BigNumber(0);
    }
    return new BigNumber(
      formatUnits(totalSupplyQuery.data, detail.baseToken.decimals),
    );
  }, [totalSupplyQuery.data, detail?.baseToken.decimals]);

  // Get summary stats
  const sumList = useMemo(() => {
    if (!detail) return [];
    return [
      {
        title: t`Participants`,
        sum: detail.investorsCount ? detail.investorsCount.toString() : '--',
        icon: TradersIcon,
      },
      {
        title: t`Pooled (${detail.quoteToken?.symbol || '--'})`,
        sum: formatReadableNumber({
          input: detail.poolQuote,
          showDecimals: 2,
        }) || '--',
        icon: PooledIcon,
      },
    ];
  }, [detail]);

  if (!loading && !detail && !error) {
    return (
      <Confirm
        open
        title={<Trans>Crowdpooling not found</Trans>}
        singleBtn
        onClose={() => setNoResultModalVisible(false)}
        onConfirm={handleGotoList}
        modal
      />
    );
  }

  const chartTabs = [
    { value: 'taker-token', label: t`Crowdpooling amount` },
    { value: 'creators', label: t`Creators` },
    { value: 'depth-chart', label: t`Depth Chart` },
  ];

  const tableTabs = [
    { value: 'parameters', label: t`Parameters` },
    { value: 'swaps', label: t`Swaps` },
    { value: 'creators', label: t`Creators` },
  ];

  return (
    <WidgetContainer
      sx={{
        position: 'relative',
      }}
    >
      {/* Header */}
      <GoBack
        onClick={handleGotoList}
        sx={{
          ...(isMobile
            ? undefined
            : {
                mb: 20,
              }),
        }}
      />

      {/* Title and Status */}
      <Box
        sx={{
          width: '100%',
          mt: isMobile ? 20 : 0,
          mb: 20,
          px: isMobile ? 20 : 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 14 : 0,
        }}
      >
        <AddressWithLinkAndCopy
          truncate
          showCopy
          address={address}
          customChainId={chainId}
          iconSize={24}
          sx={{
            color: theme.palette.text.primary,
            fontSize: 32,
            fontWeight: 600,
          }}
        />
        {status && (
          <Box
            sx={{
              px: 12,
              py: 6,
              borderRadius: 8,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              typography: 'body1',
              fontWeight: 600,
            }}
          >
            {status}
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          gap: 14,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {/* Left Section - Charts */}
        <Box
          sx={{
            flex: 1,
            p: 20,
            borderRadius: 16,
            backgroundColor: 'background.paper',
            ...(isMobile && {
              mx: 20,
            }),
          }}
        >
          {/* Chart Tabs */}
          <Box
            sx={{
              display: 'flex',
              gap: 28,
              borderBottom: `1px solid ${theme.palette.border.main}`,
            }}
          >
            {chartTabs.map((tab) => (
              <Box
                key={tab.value}
                onClick={() =>
                  setActiveChartType(tab.value as CPDetailChartType)
                }
                sx={{
                  pb: 16,
                  position: 'relative',
                  typography: 'h5',
                  cursor: 'pointer',
                  color:
                    activeChartType === tab.value
                      ? 'text.primary'
                      : 'text.secondary',
                  '&:hover': {
                    opacity: 0.8,
                  },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    backgroundColor:
                      activeChartType === tab.value
                        ? theme.palette.primary.main
                        : 'transparent',
                  },
                }}
              >
                {tab.label}
              </Box>
            ))}
          </Box>

          {/* Chart Content */}
          <Box sx={{ minHeight: 400 }}>
            {activeChartType === 'depth-chart' ? (
              detail?.baseToken && detail?.quoteToken ? (
                <DepthAndLiquidityChart
                  baseToken={detail.baseToken}
                  quoteToken={detail.quoteToken}
                  pmmParams={pmmState}
                  pmmModel={pmmModel}
                  midPrice={midPrice}
                />
              ) : null
            ) : (
              <CrowdpoolingAmountChart
                detail={detail}
                activeChartType={
                  activeChartType as 'taker-token' | 'creators'
                }
              />
            )}
          </Box>
        </Box>

        {/* Right Section - Stats Card */}
        <Box
          sx={{
            width: isMobile ? 'auto' : 343,
            p: 20,
            mx: isMobile ? 20 : 0,
            borderRadius: 20,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Progress */}
          {!detail?.isEscalation && (
            <Box sx={{ mb: 20 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 8,
                  typography: 'body2',
                }}
              >
                <Box sx={{ color: 'text.secondary' }}>
                  <Trans>Progress</Trans>
                </Box>
                <Box sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {detail?.progress}%
                </Box>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.background.paperDarkContrast,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(detail?.progress || 0, 100)}%`,
                    height: '100%',
                    backgroundColor: 'primary.main',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Summary Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 14,
              mb: 20,
            }}
          >
            {sumList.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Box
                  sx={{
                    minWidth: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: theme.palette.background.paperDarkContrast,
                  }}
                >
                  <Box
                    component={item.icon}
                    sx={{
                      width: 20,
                      height: 20,
                      '& path': {
                        fill: theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ typography: 'h5', fontWeight: 500 }}>
                    {item.sum}
                  </Box>
                  <Box sx={{ typography: 'h6', color: 'text.secondary' }}>
                    {item.title}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Detail Info would go here - from ActionCard */}
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            <Trans>Detailed information and actions will be displayed here</Trans>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section - Tables */}
      <Box
        sx={{
          mt: 14,
          p: 20,
          mx: isMobile ? 20 : 0,
          borderRadius: 16,
          backgroundColor: 'background.paper',
          minHeight: 317,
        }}
      >
        {/* Table Tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 28,
            borderBottom: `1px solid ${theme.palette.border.main}`,
          }}
        >
          {tableTabs.map((tab) => (
            <Box
              key={tab.value}
              onClick={() => setActiveTableType(tab.value as CPDetailTableType)}
              sx={{
                pb: 16,
                position: 'relative',
                typography: 'h5',
                cursor: 'pointer',
                color:
                  activeTableType === tab.value
                    ? 'text.primary'
                    : 'text.secondary',
                '&:hover': {
                  opacity: 0.8,
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  backgroundColor:
                    activeTableType === tab.value
                      ? theme.palette.primary.main
                      : 'transparent',
                },
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>

        {/* Table Content */}
        <Box sx={{ display: activeTableType !== 'parameters' ? 'none' : 'block' }}>
          {detail && (
            <ParametersTable
              detail={detail}
              dvmPoolAddress={detail.dvm?.id}
              totalSupply={totalSupply}
            />
          )}
        </Box>
        <Box
          sx={{
            display: activeTableType !== 'swaps' ? 'none' : 'flex',
            flex: 1,
          }}
        >
          {detail && (
            <SwapsTable poolAddress={address} chainId={chainId} />
          )}
        </Box>
        <Box
          sx={{
            display: activeTableType !== 'creators' ? 'none' : 'flex',
            flex: 1,
          }}
        >
          {detail && <CreatorsTable detail={detail} />}
        </Box>
      </Box>
    </WidgetContainer>
  );
}

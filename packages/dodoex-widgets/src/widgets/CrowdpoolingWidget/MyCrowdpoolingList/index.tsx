import { Box, Input, Button, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useState, useMemo } from 'react';
import { CP_STATUS } from '../types';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { useMyCPList } from './hooks/useMyCPList';
import { PriceCell } from './components/PriceCell';
import { ProgressCell } from './components/ProgressCell';
import { StatusTag } from './components/StatusTag';
import { OperationButton } from './components/OperationButton';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import { Search } from '@dodoex/icons';
import Table from '../../../components/Table';
import WidgetContainer from '../../../components/WidgetContainer';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';

export default function MyCrowdpoolingList() {
  const { queryChainId: chainId } = useWalletInfo();
  const theme = useTheme();
  const { documentUrls } = useUserOptions();
  const { data, isLoading: loading, error, refetch } = useMyCPList();
  const [filter, setFilter] = useState('');

  const filteredData = useMemo(() => {
    const crowdPoolings = data ?? [];
    if (!filter) return crowdPoolings;
    return crowdPoolings.filter(
      (item) =>
        item.id.toLowerCase() === filter.toLowerCase() ||
        item.baseToken.address.toLowerCase() === filter.toLowerCase() ||
        item.quoteToken.address.toLowerCase() === filter.toLowerCase(),
    );
  }, [data, filter, chainId]);

  const tableData = useMemo(() => {
    return filteredData.map((item) => ({
      key: item.id,
      address: (
        <AddressWithLinkAndCopy
          address={item.id}
          truncate
          customChainId={item.chainId}
        />
      ),
      price: (
        <PriceCell
          price={item.price}
          baseToken={item.baseToken}
          quoteToken={item.quoteToken}
        />
      ),
      supply: (
        <Box sx={{ typography: 'body1' }}>
          {formatTokenAmountNumber({
            input: item.totalBase,
            decimals: item.baseToken.decimals,
          })}{' '}
          {item.baseToken.symbol}
        </Box>
      ),
      progress: (
        <ProgressCell
          progress={item.progress}
          poolQuote={item.poolQuote}
          quoteToken={item.quoteToken}
        />
      ),
      status: <StatusTag status={item.status} />,
      operate: <OperationButton data={item} />,
    }));
  }, [filteredData]);

  const columns = [
    { key: 'address', label: <Trans>Crowdpooling Address</Trans> },
    { key: 'price', label: <Trans>Price</Trans> },
    { key: 'supply', label: <Trans>Total Supply</Trans> },
    { key: 'progress', label: <Trans>Progress</Trans> },
    { key: 'status', label: <Trans>Status</Trans> },
    { key: 'operate', label: '', align: 'center' as const },
  ];

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '100%',
        [theme.breakpoints.down('tablet')]: {
          pt: 28,
          px: 16,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          textAlign: 'center',
          [theme.breakpoints.up('tablet')]: {
            mx: 'auto',
          },
        }}
      >
        <Box sx={{ typography: 'h2', whiteSpace: 'pre-wrap' }}>
          <Trans>
            Equitable One-stop Token Distribution {'\n'}Fair Launch with No
            Front-running
          </Trans>
        </Box>
        <Box
          component="a"
          href={documentUrls?.crowdpoolingList}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            '&:hover': {
              opacity: 0.7,
            },
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 0H16C17.1 0 18 0.9 18 2V16C18 17.1 17.1 18 16 18H2C0.9 18 0 17.1 0 16V2C0 0.9 0.9 0 2 0ZM4 14H11V12H4V14ZM14 10H4V8H14V10ZM4 6H14V4H4V6Z"
              fill="currentColor"
            />
          </svg>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              typography: 'h6',
              fontWeight: 600,
            }}
          >
            <Trans>SEE HOW IT WORKS</Trans>
            <Box
              sx={{
                display: 'block',
                height: '1.5px',
                backgroundColor: 'currentColor',
                opacity: 0.5,
                borderRadius: '0.75px',
              }}
            />
          </Box>
        </Box>
        <Button
          size={Button.Size.big}
          sx={{
            width: {
              mobile: '100%',
              tablet: 323,
            },
          }}
        >
          <Trans>Create Crowdpooling</Trans>
        </Button>
      </Box>

      <Box
        sx={{
          typography: 'h5',
          fontWeight: 600,
        }}
      >
        <Trans>My Pools</Trans>
      </Box>

      {/* Search Input */}
      <Input
        fullWidth
        height={48}
        placeholder="Search by pool address or token address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        suffixGap={16}
        prefix={
          <Box
            component={Search}
            width={20}
            height={20}
            sx={{
              color: 'text.secondary',
            }}
          />
        }
        sx={{
          width: {
            mobile: '100%',
            tablet: 433,
          },
        }}
      />

      {/* Table */}
      <Table
        sx={{
          flex: 1,
          minHeight: 400,
        }}
        empty={!tableData.length}
        loading={loading}
        errorRefetch={error ? refetch : undefined}
      >
        <Box component="thead">
          <Box component="tr">
            {columns.map((col) => (
              <Box
                component="th"
                key={col.key}
                align={col.align || 'left'}
                sx={{
                  color: 'text.primary',
                  textAlign: col.align || 'left',
                }}
              >
                {col.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {tableData.map((row) => (
            <Box component="tr" key={row.key}>
              <Box component="td" sx={{ px: 24, py: 20 }}>
                {row.address}
              </Box>
              <Box component="td" sx={{ px: 24, py: 20 }}>
                {row.price}
              </Box>
              <Box component="td" sx={{ px: 24, py: 20 }}>
                {row.supply}
              </Box>
              <Box component="td" sx={{ px: 24, py: 20 }}>
                {row.progress}
              </Box>
              <Box component="td" sx={{ px: 24, py: 20 }}>
                {row.status}
              </Box>
              <Box component="td" align="center" sx={{ px: 24, py: 20 }}>
                {row.operate}
              </Box>
            </Box>
          ))}
        </Box>
      </Table>
    </WidgetContainer>
  );
}

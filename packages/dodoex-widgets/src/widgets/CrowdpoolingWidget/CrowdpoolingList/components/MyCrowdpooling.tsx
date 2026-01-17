import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { formatReadableNumber } from '../../../../utils';

export enum CP_STATUS {
  WAITING = 'WAITING',
  PROGRESSING = 'PROGRESSING',
  CALMING = 'CALMING',
  ENDED = 'ENDED',
}

interface CPItem {
  id: string;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  price: string;
  totalBase: string;
  progress: number;
  poolQuote: string;
  poolQuoteCap: string;
  status: CP_STATUS;
  address: string;
}

interface MyCrowdpoolingProps {
  onRowClick: (address: string, chainId: number) => void;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        mt: 12,
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 2,
          position: 'relative',
          backgroundColor: 'custom.background.paperDarkContrast',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            borderRadius: 1,
            backgroundColor: 'primary.main',
            width: `${value}%`,
            maxWidth: '100%',
          },
        }}
      />
      <Box sx={{ typography: 'body1' }}>{value}%</Box>
    </Box>
  );
}

function StatusTag({ status }: { status: CP_STATUS }) {
  let bgColor = 'rgba(150, 86, 255, 0.1)';
  let textColor = '#9656FF';

  if (status === CP_STATUS.PROGRESSING) {
    bgColor = 'rgba(76, 216, 100, 0.1)';
    textColor = '#4CD864';
  } else if (status === CP_STATUS.ENDED) {
    bgColor = 'custom.background.paperDarkContrast';
    textColor = 'text.weak';
  } else if (status === CP_STATUS.CALMING) {
    bgColor = 'rgba(150, 86, 255, 0.1)';
    textColor = '#9656FF';
  }

  return (
    <Box
      sx={{
        padding: '4px 8px',
        borderRadius: 4,
        textAlign: 'center',
        backgroundColor: bgColor,
        color: textColor,
        typography: 'h6',
      }}
    >
      <Trans>{status}</Trans>
    </Box>
  );
}

export default function MyCrowdpooling({ onRowClick }: MyCrowdpoolingProps) {
  const mockData: CPItem[] = [
    {
      id: '1',
      baseTokenSymbol: 'USDT',
      quoteTokenSymbol: 'ETH',
      price: '1.23',
      totalBase: '1000000',
      progress: 75,
      poolQuote: '750000',
      poolQuoteCap: '1000000',
      status: CP_STATUS.WAITING,
      address: '0x1234...5678',
    },
    {
      id: '2',
      baseTokenSymbol: 'USDC',
      quoteTokenSymbol: 'ETH',
      price: '0.85',
      totalBase: '500000',
      progress: 60,
      poolQuote: '300000',
      poolQuoteCap: '500000',
      status: CP_STATUS.PROGRESSING,
      address: '0xabcd...efgh',
    },
    {
      id: '3',
      baseTokenSymbol: 'DAI',
      quoteTokenSymbol: 'ETH',
      price: '0.95',
      totalBase: '2000000',
      progress: 40,
      poolQuote: '800000',
      poolQuoteCap: '2000000',
      status: CP_STATUS.PROGRESSING,
      address: '0x9876...5432',
    },
    {
      id: '4',
      baseTokenSymbol: 'WBTC',
      quoteTokenSymbol: 'ETH',
      price: '1.50',
      totalBase: '100000',
      progress: 90,
      poolQuote: '90000',
      poolQuoteCap: '100000',
      status: CP_STATUS.CALMING,
      address: '0x5555...1111',
    },
    {
      id: '5',
      baseTokenSymbol: 'USDT',
      quoteTokenSymbol: 'ETH',
      price: '2.00',
      totalBase: '300000',
      progress: 100,
      poolQuote: '300000',
      poolQuoteCap: '300000',
      status: CP_STATUS.ENDED,
      address: '0xaaaa...bbbb',
    },
    {
      id: '6',
      baseTokenSymbol: 'LINK',
      quoteTokenSymbol: 'ETH',
      price: '1.80',
      totalBase: '400000',
      progress: 85,
      poolQuote: '340000',
      poolQuoteCap: '400000',
      status: CP_STATUS.ENDED,
      address: '0xcccc...dddd',
    },
  ];

  return (
    <Box>
      <Box sx={{ typography: 'h5', mb: 28 }}>
        <Trans>My Crowdpoolings</Trans>
      </Box>

      <Box
        sx={{
          borderRadius: 12,
          backgroundColor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {mockData.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 20,
              borderBottom: '1px solid',
              borderColor: 'border.default',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'background.default',
              },
            }}
            onClick={() => onRowClick(item.address, 1)}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  mb: 12,
                }}
              >
                <Box
                  sx={{
                    minWidth: 80,
                    typography: 'body2',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Price</Trans>
                </Box>
                <Box
                  sx={{
                    typography: 'body1',
                    fontWeight: 600,
                    minWidth: 140,
                  }}
                >
                  {formatReadableNumber({
                    input: item.price,
                    showDecimals: 2,
                  })}{' '}
                  {item.quoteTokenSymbol}
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 8,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Box
                    sx={{
                      typography: 'body2',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Supply</Trans>
                  </Box>
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  >
                    {formatReadableNumber({
                      input: item.totalBase,
                      showDecimals: 2,
                    })}{' '}
                    {item.baseTokenSymbol}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 8,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Box
                    sx={{
                      typography: 'body2',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Raised</Trans>
                  </Box>
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      minWidth: 140,
                    }}
                  >
                    {formatReadableNumber({
                      input: item.poolQuote,
                      showDecimals: 2,
                    })}{' '}
                    {item.quoteTokenSymbol}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Progress</Trans>
                </Box>
                <Box sx={{ minWidth: 100 }}>
                  <ProgressBar value={item.progress} />
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>Status</Trans>
                </Box>
                <Box sx={{ minWidth: 100 }}>
                  <StatusTag status={item.status} />
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 0,
                  minWidth: 100,
                }}
              >
                <AddressWithLinkAndCopy
                  address={item.address}
                  showCopy
                  truncate
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                    width: '100%',
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

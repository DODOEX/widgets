import { Box, LoadingSkeleton } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { formatReadableNumber } from '../../../../utils';

interface DashboardCardProps {
  totalBase: string;
  address: string;
  baseSymbol: string;
  quoteSymbol: string;
  quoteBaseRate: string;
  poolQuote: string;
  poolQuoteCap: string;
  chain: string;
}

function Item({
  item,
  loading,
}: {
  item?: DashboardCardProps;
  loading?: boolean;
}) {
  const decimals = 2;

  return (
    <Box
      sx={{
        borderRadius: 16,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          pt: 24,
          px: 20,
          pb: 24,
          flexDirection: 'column',
          backgroundColor: 'custom.background.paperContrast',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <LoadingSkeleton
            sx={{
              width: '100%',
            }}
            loading={loading}
          >
            <Box sx={{ typography: 'caption', display: 'flex' }}>
              <Box sx={{ color: 'primary.main' }}>{item?.baseSymbol || ''}</Box>
              <Box sx={{ color: 'text.secondary' }}>({item?.chain || ''})</Box>
            </Box>
          </LoadingSkeleton>
        </Box>
        <Box>
          <LoadingSkeleton
            sx={{
              mt: 4,
            }}
            loading={loading}
          >
            <Box sx={{ typography: 'h2', color: 'primary.main' }}>
              {item
                ? formatReadableNumber({
                    input: item.totalBase,
                    showDecimals: decimals,
                  })
                : '--'}
            </Box>
          </LoadingSkeleton>

          <Box
            sx={{
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            <Trans>Total Supply</Trans>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          pt: 24,
          px: 20,
          pb: 20,
        }}
      >
        <Box
          sx={{
            mb: 16,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              mb: 2,
              color: 'text.secondary',
            }}
          >
            <Trans>Address</Trans>
          </Box>
          <LoadingSkeleton loading={loading}>
            {item && (
              <AddressWithLinkAndCopy
                address={item.address}
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                }}
                showCopy
                truncate
              />
            )}
          </LoadingSkeleton>
        </Box>
        <Box sx={{ mb: 16 }}>
          <Box
            sx={{
              typography: 'body2',
              mb: 2,
              color: 'text.secondary',
            }}
          >
            <Trans>Price</Trans>
          </Box>
          <LoadingSkeleton loading={loading}>
            <Box sx={{ typography: 'caption' }}>
              {t`1 ${item?.baseSymbol || ''} = ${formatReadableNumber({
                input: item?.quoteBaseRate || 0,
                showDecimals: decimals,
              })} ${item?.quoteSymbol || ''}`}
            </Box>
          </LoadingSkeleton>
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
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

            <Box
              sx={{
                typography: 'body2',
                color: 'primary.main',
              }}
            >
              <LoadingSkeleton
                sx={{
                  width: '40px !important',
                }}
                loading={loading}
              >
                {t`${formatReadableNumber({
                  input:
                    ((Number(item?.poolQuote) || 0) /
                      (Number(item?.poolQuoteCap) || 1)) *
                    100,
                  showDecimals: 1,
                })}%`}
              </LoadingSkeleton>
            </Box>
          </Box>
          <LoadingSkeleton
            sx={{
              mt: 4,
            }}
            loading={loading}
          >
            <Box
              sx={{
                width: '100%',
                position: 'relative',
                backgroundColor: 'custom.background.paperDarkContrast',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'primary.main',
                  width: `${((Number(item?.poolQuote) || 0) / (Number(item?.poolQuoteCap) || 1)) * 100}%`,
                  maxWidth: '100%',
                },
                height: 6,
                overflow: 'hidden',
                borderRadius: 3,
                mt: 9,
                mb: 9,
              }}
            />
          </LoadingSkeleton>

          <Box
            sx={{
              typography: 'body2',
              textAlign: 'right',
            }}
          >
            <LoadingSkeleton
              sx={{
                mt: 4,
              }}
              loading={loading}
            >
              {t`Raised ${formatReadableNumber({
                input: item?.poolQuote || 0,
                showDecimals: decimals,
              })} ${item?.quoteSymbol || ''}`}
            </LoadingSkeleton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface DashboardProps {
  loading?: boolean;
  dashboardList?: DashboardCardProps[];
  error?: any;
  refresh?: () => void;
}

export default function Dashboard({
  loading,
  dashboardList,
  error,
  refresh,
}: DashboardProps) {
  return (
    <Box
      sx={{
        mt: 28,
      }}
    >
      <Box sx={{ typography: 'h5' }}>
        <Trans>Popular Campaigns</Trans>
      </Box>

      {error ? (
        <Box
          sx={{
            mt: 20,
            mb: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 40,
            color: 'text.secondary',
          }}
        >
          <Trans>Failed to load data</Trans>
          <Box
            component="button"
            onClick={refresh}
            sx={{
              ml: 16,
              color: 'primary.main',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
            }}
          >
            <Trans>Retry</Trans>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 20,
            display: 'grid',
            gap: 16,
            gridTemplateColumns: {
              tablet: 'repeat(3, 1fr)',
            },
          }}
        >
          {loading ? (
            <Item loading={loading} />
          ) : dashboardList && dashboardList.length > 0 ? (
            dashboardList.map((item) => <Item key={item.address} item={item} />)
          ) : null}
        </Box>
      )}
    </Box>
  );
}

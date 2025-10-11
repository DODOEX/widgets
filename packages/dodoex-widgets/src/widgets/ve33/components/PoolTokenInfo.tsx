import {
  Box,
  HoverOpacity,
  LoadingSkeleton,
  Skeleton,
  useTheme,
} from '@dodoex/components';
import { TokenInfo } from '../../../hooks/Token';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Tooltip } from '@dodoex/components';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { PoolTypeTag, PoolTypeTagProps } from './PoolTypeTag';

export default function PoolTokenInfo({
  item,
}: {
  item?: PoolTypeTagProps & {
    id: string;
    gaugeAddress: string;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    chainId: number;
  };
}) {
  const theme = useTheme();
  const { baseToken, quoteToken, chainId } = item ?? {};

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {!!(baseToken && quoteToken) ? (
        <TokenLogoPair
          tokens={[baseToken, quoteToken]}
          width={24}
          mr={0}
          chainId={chainId}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Skeleton variant="circular" width={24} />
          <Skeleton
            variant="circular"
            width={24}
            sx={{
              ml: -4,
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <LoadingSkeleton
          loading={!item}
          loadingProps={{
            width: 100,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            typography: 'body2',
            fontWeight: 600,
          }}
        >
          {`${baseToken?.symbol}/${quoteToken?.symbol}`}

          <Tooltip
            title={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: 240,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      typography: 'h6',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Pool Address
                  </Box>
                  <AddressWithLinkAndCopy
                    address={item?.id!}
                    customChainId={chainId}
                    showCopy
                    truncate
                    iconSpace={4}
                    iconSize={14}
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      typography: 'h6',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Gauge Address
                  </Box>
                  <AddressWithLinkAndCopy
                    address={item?.gaugeAddress!}
                    customChainId={chainId}
                    showCopy
                    truncate
                    iconSpace={4}
                    iconSize={14}
                    size="small"
                  />
                </Box>
              </Box>
            }
            placement="top"
            onlyHover
            sx={{
              maxWidth: 300,
            }}
          >
            <HoverOpacity
              sx={{
                width: 14,
                height: 14,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.99999 1.16675C3.77999 1.16675 1.16666 3.78008 1.16666 7.00008C1.16666 10.2201 3.77999 12.8334 6.99999 12.8334C10.22 12.8334 12.8333 10.2201 12.8333 7.00008C12.8333 3.78008 10.22 1.16675 6.99999 1.16675ZM7.58336 5.25006V4.08339H6.4167V5.25006H7.58336ZM7.58336 9.91673V6.41673H6.4167V9.91673H7.58336ZM2.33336 7.00006C2.33336 9.57256 4.42753 11.6667 7.00003 11.6667C9.57253 11.6667 11.6667 9.57256 11.6667 7.00006C11.6667 4.42756 9.57253 2.33339 7.00003 2.33339C4.42753 2.33339 2.33336 4.42756 2.33336 7.00006Z"
                  fill="currentColor"
                />
              </svg>
            </HoverOpacity>
          </Tooltip>
        </LoadingSkeleton>
        {item ? (
          <PoolTypeTag type={item.type} stable={item.stable} fee={item.fee} />
        ) : (
          <Skeleton variant="rounded" width={100} height={20} sx={{ mt: 2 }} />
        )}
      </Box>
    </Box>
  );
}

import { ChainId } from '@dodoex/api';
import { Box, HoverOpacity, Tooltip, useTheme } from '@dodoex/components';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { WIDGET_CLASS_NAME } from '../../../components/Widget';
import { Ve33PoolInfoI } from '../types';
import { PoolTypeTag } from './PoolTypeTag';

export interface PoolHeadProps {
  chainId: ChainId;
  poolInfo: Ve33PoolInfoI;
  size?: 'small' | 'medium';
}

export const PoolHead = ({
  chainId,
  poolInfo,
  size = 'medium',
}: PoolHeadProps) => {
  const { baseToken, quoteToken } = poolInfo;
  const theme = useTheme();

  const isSmall = size === 'small';
  const tokenLogoWidth = isSmall ? 28 : 36;
  const typography = isSmall ? 'body1' : 'h4';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <TokenLogoPair
        tokens={[baseToken, quoteToken]}
        width={tokenLogoWidth}
        mr={0}
        chainId={chainId}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            typography,
            fontWeight: 600,
          }}
        >
          {`${baseToken.symbol}/${quoteToken.symbol}`}

          <PoolTypeTag
            type={poolInfo.type}
            stable={poolInfo.stable}
            fee={poolInfo.fee}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <AddressWithLinkAndCopy
            address={poolInfo.id}
            customChainId={chainId}
            showCopy
            truncate
            iconSpace={4}
            iconSize={14}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.text.primary,
              },
            }}
          />
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
                    address={poolInfo.id}
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
                    address={poolInfo.gaugeAddress}
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
            container={document.querySelector(`.${WIDGET_CLASS_NAME}`)}
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
        </Box>
      </Box>
    </Box>
  );
};

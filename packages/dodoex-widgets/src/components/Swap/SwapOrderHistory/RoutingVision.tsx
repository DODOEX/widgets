import { Box, BoxProps, useTheme } from '@dodoex/components';
import React from 'react';
import { TokenInfo } from '../../../hooks/Token';
import { MidPathType } from '../../../hooks/useRouteVisionData';
import TokenLogo from '../../TokenLogo';
import RoutingCard from './RoutingCard';

export function Dot({ sx }: { sx?: BoxProps['sx'] }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 5,
        height: 5,
        backgroundColor: theme.palette.text.primary,
        borderRadius: '50%',
        flex: '0 0 auto',
        ...sx,
      }}
    />
  );
}

export function Triangle({ sx }: { sx?: BoxProps['sx'] }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '0',
        height: '0',
        borderBottom: '3px solid transparent',
        borderTop: '3px solid transparent',
        borderLeft: `5px solid ${theme.palette.text.primary}`,
        flex: '0 0 auto',
        ...sx,
      }}
    />
  );
}

export function DashedLine({ sx }: { sx?: BoxProps['sx'] }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderTopWidth: 1,
        borderTopStyle: 'dashed',
        borderTopColor: theme.palette.text.primary,
        flexGrow: 1,
        flexShrink: 0,
        ...sx,
      }}
    />
  );
}

function DotLineTriangle() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        ml: 7,
      }}
    >
      <Dot />
      <Box
        sx={{
          width: '1px',
          height: '22px',
          borderLeftWidth: 1,
          borderLeftStyle: 'dashed',
          borderLeftColor: theme.palette.text.primary,
        }}
      />
      <Triangle
        sx={{
          transform: 'rotate(90deg)',
        }}
      />
    </Box>
  );
}

interface Props {
  routeData: MidPathType[];
  fromTokenRaw: TokenInfo;
  toTokenRaw: TokenInfo;
}
/**
 * Path visualization
 */
export function MobileRoutingVision({
  routeData,
  fromTokenRaw,
  toTokenRaw,
  sx,
}: Props & {
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pb: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        maxHeight: `calc(80vh - 64px - 48px - 24px - 50px - 60px)`,
        overflow: 'auto',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <TokenLogo
          width={20}
          height={20}
          address={fromTokenRaw.address}
          chainId={fromTokenRaw.chainId}
        />
        <Box
          sx={{
            typography: 'body1',
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {fromTokenRaw.symbol || '-'}
        </Box>
      </Box>

      <DotLineTriangle />

      {routeData.map((r, index) => {
        return (
          <React.Fragment key={r.fromToken}>
            {index > 0 && <DotLineTriangle />}
            <RoutingCard
              routing={r}
              fromTokenRaw={fromTokenRaw}
              toTokenRaw={toTokenRaw}
            />
          </React.Fragment>
        );
      })}

      <DotLineTriangle />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <TokenLogo
          width={20}
          height={20}
          address={toTokenRaw.address}
          chainId={toTokenRaw.chainId}
        />
        <Box
          sx={{
            typography: 'body1',
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {toTokenRaw.symbol || '-'}
        </Box>
      </Box>
    </Box>
  );
}

export function PCRoutingVision({
  routeData,
  fromTokenRaw,
  toTokenRaw,
}: Props) {
  const theme = useTheme();
  const isMobile = false;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TokenLogo
            width={20}
            height={20}
            address={fromTokenRaw.address}
            chainId={fromTokenRaw.chainId}
          />
          <Box
            sx={{
              typography: 'body1',
              color: theme.palette.text.primary,
              fontWeight: 500,
            }}
          >
            {fromTokenRaw.symbol || '-'}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              color: theme.palette.text.primary,
              fontWeight: 500,
            }}
          >
            {toTokenRaw.symbol || '-'}
          </Box>
          <TokenLogo
            width={20}
            height={20}
            address={toTokenRaw.address}
            chainId={toTokenRaw.chainId}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 5,
          display: 'flex',
          alignItems: 'flex-start',
          mx: 7.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Dot />
          <Box
            sx={{
              width: '1px',
              height: '48px',
              borderLeftWidth: 1,
              borderLeftStyle: 'dashed',
              borderLeftColor: theme.palette.text.primary,
            }}
          />
        </Box>

        <DashedLine
          sx={{
            mt: 48 + 4,
            ml: -2.5,
            minWidth: 59,
          }}
        />

        <Triangle
          sx={{
            mt: 52.5 - 3,
          }}
        />
        <Box
          sx={{
            mt: 23,
            maxWidth: isMobile ? 4 + 453 + 4 : 4 + 150 + 453 + 150 + 4,
            display: 'flex',
            alignItems: 'flex-start',
            overflow: 'auto',
          }}
        >
          {routeData.map((r, index) => {
            return (
              <React.Fragment key={r.fromToken}>
                {index > 0 && (
                  <Box
                    sx={{
                      mt: 52.5 - 3 - 23,
                      display: 'flex',
                      alignItems: 'center',
                      width: '24px',
                      flexShrink: 0,
                    }}
                  >
                    <Dot />
                    <DashedLine />
                    <Triangle />
                  </Box>
                )}
                <RoutingCard
                  routing={r}
                  fromTokenRaw={fromTokenRaw}
                  toTokenRaw={toTokenRaw}
                />
              </React.Fragment>
            );
          })}
        </Box>

        <Dot
          sx={{
            mt: 53.5 - 2.5,
          }}
        />

        <DashedLine
          sx={{
            mt: 48 + 5,
            mr: -2.5,
            minWidth: 59,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Triangle
            sx={{
              transform: 'rotate(-90deg)',
            }}
          />
          <Box
            sx={{
              width: '1px',
              height: '48px',
              borderLeftWidth: 1,
              borderLeftStyle: 'dashed',
              borderLeftColor: theme.palette.text.primary,
            }}
          />
        </Box>
      </Box>
    </>
  );
}

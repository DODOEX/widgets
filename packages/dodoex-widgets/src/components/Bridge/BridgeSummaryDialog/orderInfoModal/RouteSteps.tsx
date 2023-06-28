import { Box, useTheme } from '@dodoex/components';
import { CSSProperties, useMemo } from 'react';
import { chainListMap } from '../../../../constants/chainList';
import { ChainId } from '../../../../constants/chains';
import { BridgeRouteI } from '../../../../hooks/Bridge';
import { CrossStep } from './CrossStep';
import { SwapStep } from './SwapStep';

export function RouteSteps({
  marginTop = 20,
  route,
}: {
  marginTop?: CSSProperties['marginTop'];
  route: BridgeRouteI;
}) {
  const theme = useTheme();

  const { fromChainId, toChainId } = route;

  const {
    step: { includedSteps },
  } = route;

  const [fromChain, toChain] = useMemo(() => {
    return [
      chainListMap[fromChainId as ChainId],
      chainListMap[toChainId as ChainId],
    ];
  }, [fromChainId, toChainId]);

  return (
    <Box
      sx={{
        mt: marginTop,
        pl: 10,
      }}
    >
      <Box
        sx={{
          borderLeft: `1px dashed ${theme.palette.text.primary}`,
          opacity: 1,
          pb: 24,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <Box
            component={fromChain?.logo}
            sx={{
              width: '20px',
              marginLeft: -10.5,
              pt: 1,
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <Box
            sx={{
              ml: 8,
              typography: 'body1',
            }}
          >
            {fromChain.name}
          </Box>
        </Box>
      </Box>

      {includedSteps.map((innerStep, index) => {
        const { toolDetails, type, estimate } = innerStep;
        if (type === 'swap') {
          return (
            <SwapStep
              key={index}
              chainId={estimate.fromToken.chainId}
              fromTokenAmount={estimate.fromTokenAmount}
              toTokenAmount={estimate.toTokenAmount}
              fromTokenDecimals={estimate.fromToken.decimals}
              fromTokenSymbol={estimate.fromToken.symbol}
              toTokenDecimals={estimate.toToken.decimals}
              toTokenSymbol={estimate.toToken.symbol}
              hash={null}
              toolDetails={toolDetails}
            />
          );
        }
        if (type === 'cross') {
          return (
            <CrossStep
              key={index}
              fromChainId={estimate.fromToken.chainId}
              toChainId={estimate.toToken.chainId}
              fromTokenAmount={estimate.fromTokenAmount}
              toTokenAmount={estimate.toTokenAmount}
              fromTokenDecimals={estimate.fromToken.decimals}
              fromTokenSymbol={estimate.fromToken.symbol}
              toTokenDecimals={estimate.toToken.decimals}
              toTokenSymbol={estimate.toToken.symbol}
              fromHash={null}
              toHash={null}
              toolDetails={toolDetails}
            />
          );
        }
        return null;
      })}

      <Box
        sx={{
          opacity: 0.5,
          pb: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <Box
            component={toChain?.logo}
            sx={{
              width: '20px',
              marginLeft: -10.5,
              pt: 1,
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <Box
            sx={{
              ml: 8,
              typography: 'body1',
            }}
          >
            {toChain.name}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

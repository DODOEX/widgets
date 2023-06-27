import { getChain } from '@dodoex/wallet';
import { Box, CardMedia, useTheme } from '@mui/material';
import { CSSProperties, useMemo } from 'react';
import { BridgeOrderI } from '../../types';
import { CrossStep } from './CrossStep';
import { SwapStep } from './SwapStep';

export function RouteSteps({
  marginTop = 20,
  orderDetail,
}: {
  marginTop?: CSSProperties['marginTop'];
  orderDetail: BridgeOrderI;
}) {
  const theme = useTheme();

  const { fromChainId, toChainId, fromHash, toHash, route, subStatus } =
    orderDetail;

  const {
    step: { includedSteps },
  } = route;

  const [fromChain, toChain] = useMemo(() => {
    return [getChain(fromChainId), getChain(toChainId)];
  }, [fromChainId, toChainId]);

  // const isFailedStatus = isFailedStatusOrder(subStatus);
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
          <CardMedia
            component="img"
            image={fromChain?.logo}
            alt={fromChain?.showName}
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
            {fromChain.showName}
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
              hash={index > 0 ? toHash : fromHash}
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
              fromHash={fromHash}
              toHash={toHash}
              toolDetails={toolDetails}
            />
          );
        }
        return null;
      })}

      <Box
        sx={{
          opacity: subStatus === 'DONE' ? 1 : 0.5,
          pb: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <CardMedia
            component="img"
            image={toChain?.logo}
            alt={toChain?.showName}
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
            {toChain.showName}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

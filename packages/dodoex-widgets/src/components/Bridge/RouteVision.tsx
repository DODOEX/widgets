import { Box } from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { BridgeRouteI } from '../../hooks/Bridge';
import { productList } from './SelectBridgeDialog/productList';

export interface RouteVisionProps {
  route: BridgeRouteI;
}

export const RouteVision = ({ route }: RouteVisionProps) => {
  const {
    product,
    executionDuration,
    feeUSD,
    fromAmount,
    fromToken,
    fromChainId,
    toTokenAmount,
    toToken,
    toChainId,
    step: { includedSteps },
  } = route;
  const productDetail = productList.find((i) => i.id === product);

  return (
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
          flexWrap: 'wrap',
        }}
      >
        <Box
          component={productDetail?.logoURI}
          sx={{
            width: 16,
            height: 16,
          }}
        />
        <Box
          sx={{
            mx: 4,
            typography: 'body2',
            fontWeight: 600,
          }}
        >
          {productDetail?.name}
        </Box>
      </Box>
      <Box
        component={ArrowRight}
        sx={{
          width: 18,
          height: 18,
        }}
      />
    </Box>
  );
};

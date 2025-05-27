import { Box, useTheme } from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { BridgeRouteI } from '../../hooks/Bridge';
import { productList } from './SelectBridgeDialog/productList';
import { useMemo } from 'react';
import { chainListMap } from '../../constants/chainList';

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
    step,
  } = route;

  const theme = useTheme();

  const logoList = useMemo(() => {
    const fromChain = chainListMap.get(fromChainId);
    const toChain = chainListMap.get(toChainId);

    const list = [
      {
        key: 'from',
        logo: fromChain?.logo,
        title: fromChain?.name,
      },
    ];

    if (step.includedSteps.length > 0) {
      step.includedSteps.forEach((item) => {
        const productDetail = productList.find((i) => i.id === item.tool);
        const chain = chainListMap.get(item.estimate.fromToken.chainId);

        list.push({
          key: item.id,
          logo: productDetail?.logoURI ?? chain?.logo,
          title: productDetail?.name ?? chain?.name,
        });
      });
    }

    list.push({
      key: 'to',
      logo: toChain?.logo,
      title: toChain?.name,
    });

    return list;
  }, [fromChainId, step.includedSteps, toChainId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {logoList.map((item) => {
        return (
          <Box
            key={item.key}
            sx={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: theme.palette.background.tag,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component={item.logo}
                sx={{
                  width: 20,
                  height: 20,
                }}
              />
            </Box>
            <Box
              sx={{
                typography: 'body1',
                lineHeight: '22px',
                color: theme.palette.text.primary,
              }}
            >
              {item.title}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

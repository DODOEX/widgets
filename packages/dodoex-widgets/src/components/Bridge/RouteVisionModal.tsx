import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useMemo, useState } from 'react';
import { BridgeRouteI } from '../../hooks/Bridge';
import Dialog from '../Dialog';
import { RouteVision } from './RouteVision';
import { chainListMap } from '../../constants/chainList';
import { productList } from './SelectBridgeDialog/productList';

export interface RouteVisionModalProps {
  route: BridgeRouteI;
}

export const RouteVisionModal = ({ route }: RouteVisionModalProps) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const theme = useTheme();

  const { fromChainId, toChainId, step } = route;

  const logoList = useMemo(() => {
    const fromChain = chainListMap.get(fromChainId);
    const toChain = chainListMap.get(toChainId);

    const list = [
      {
        key: 'from',
        logo: fromChain?.logo,
      },
    ];

    if (step.includedSteps.length > 0) {
      step.includedSteps.forEach((item) => {
        const productDetail = productList.find((i) => i.id === item.tool);

        if (productDetail) {
          list.push({
            key: item.id,
            logo: productDetail.logoURI,
          });
        }
      });
    }

    list.push({
      key: 'to',
      logo: toChain?.logo,
    });

    return list;
  }, [fromChainId, step.includedSteps, toChainId]);

  return (
    <>
      <Box
        sx={{
          py: 4,
          pl: 8,
          pr: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          borderRadius: 12,
          backgroundColor: theme.palette.background.tag,
          cursor: 'pointer',
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
        onClick={() => {
          setIsDialogVisible(true);
        }}
      >
        <Box
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          Route:
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {logoList.map((item, index) => {
            return (
              <Box
                key={item.key}
                sx={{
                  ml: index === 0 ? 0 : -4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.border.main,
                  border: `1px solid ${theme.palette.border.main}`,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component={item.logo}
                  sx={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M2.91699 11.0833V7.58332H4.08366V9.91666H6.41699V11.0833H2.91699ZM9.91699 6.41666V4.08332H7.58366V2.91666H11.0837V6.41666H9.91699Z"
            fill="currentColor"
          />
        </svg>
      </Box>

      <Dialog
        open={isDialogVisible}
        title={<Trans>Route</Trans>}
        onClose={() => setIsDialogVisible(false)}
        modal
      >
        <Box
          sx={{
            minWidth: 800,
          }}
        >
          <RouteVision route={route} />
        </Box>
      </Dialog>
    </>
  );
};

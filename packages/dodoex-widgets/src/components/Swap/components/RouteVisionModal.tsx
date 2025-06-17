import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { Fragment, useMemo, useState } from 'react';
import { TokenInfo } from '../../../hooks/Token';
import { useRouteVisionData } from '../../../hooks/useRouteVisionData';
import TokenLogo from '../../TokenLogo';
import {
  MobileRoutingVision,
  PCRoutingVision,
} from '../SwapOrderHistory/RoutingVision';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import Dialog from './Dialog';

export interface RouteVisionModalProps {
  routeInfo: string | null;
  toToken: TokenInfo;
  fromToken: TokenInfo;
}

export const RouteVisionModal = ({
  routeInfo,
  toToken,
  fromToken,
}: RouteVisionModalProps) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const logoList = useMemo(() => {
    const list = [
      {
        key: 'from',
        logo: (
          <TokenLogo
            token={fromToken}
            noShowChain
            height={14}
            width={14}
            marginRight={0}
          />
        ),
      },
    ];

    list.push({
      key: 'to',
      logo: (
        <TokenLogo
          token={toToken}
          noShowChain
          height={14}
          width={14}
          marginRight={0}
        />
      ),
    });

    return list;
  }, [fromToken, toToken]);

  const { routeData } = useRouteVisionData({
    rawRouteData: routeInfo,
    chainId: fromToken?.chainId,
  });

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
            return <Fragment key={item.key}>{item.logo}</Fragment>;
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
            minWidth: isMobile ? '100%' : 800,
            py: 20,
            px: 20,
            borderTop: `1px solid ${theme.palette.border.main}`,
          }}
        >
          {isMobile ? (
            <MobileRoutingVision
              routeData={routeData}
              fromTokenRaw={fromToken}
              toTokenRaw={toToken}
            />
          ) : (
            <PCRoutingVision
              routeData={routeData}
              fromTokenRaw={fromToken}
              toTokenRaw={toToken}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

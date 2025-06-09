import React from 'react';
import { Box, useTheme } from '@dodoex/components';
import { MobileRoutingVision, PCRoutingVision } from './RoutingVision';
import { useTradeSwapOrderList } from '../../../hooks/Swap/useTradeSwapOrderList';
import { useRouteVisionData } from '../../../hooks/useRouteVisionData';
import { useSubmissionStatusColor } from '../../../hooks/Submission/useSubmissionStatusColor';
import { getTimeText } from '../../../utils/time';
import FoldBtn, {
  ChainName,
  StatusAndTime,
  TokenAndAmount,
} from '../../CardWidgets';
import { Trans } from '@lingui/macro';
import { ArrowTopRightBorder } from '@dodoex/icons';
import { getEtherscanPage } from '../../../utils';
import { PriceWithToggle } from './PriceWithToggle';

function Extend({
  showFold,
  isMobile,
  data,
}: {
  showFold: boolean;
  isMobile?: boolean;
  data: ReturnType<typeof useTradeSwapOrderList>['orderList'][0];
}) {
  const theme = useTheme();
  const { routeData } = useRouteVisionData({
    rawRouteData: data.routeData,
    chainId: data.fromToken.chainId,
  });
  const time = getTimeText(new Date(data.createdAt));
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        p: showFold ? 16 : 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        background: `linear-gradient(0deg, ${theme.palette.background.skeleton} 0%, ${theme.palette.background.skeleton} 100%), ${theme.palette.background.paper}`,
        maxHeight: showFold ? 400 : 0,
        transition: 'all 300ms',
        overflow: 'hidden',
        marginTop: '-4px',
        marginBottom: '4px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          typography: 'h6',
          color: theme.palette.text.secondary,
        }}
      >
        <Trans>Details</Trans>
        {isMobile && <Box>{time}</Box>}
      </Box>

      {isMobile ? (
        <MobileRoutingVision
          routeData={routeData}
          fromTokenRaw={data.fromToken}
          toTokenRaw={data.toToken}
        />
      ) : (
        <PCRoutingVision
          routeData={routeData}
          fromTokenRaw={data.fromToken}
          toTokenRaw={data.toToken}
        />
      )}
    </Box>
  );
}

export default function SameOrderCard({
  data,
  isMobile,
}: {
  data: ReturnType<typeof useTradeSwapOrderList>['orderList'][0];
  isMobile: boolean;
}) {
  const { statusText, statusColor, statusAlphaColor } =
    useSubmissionStatusColor({
      status: data.status,
    });
  const [showFold, setShowFold] = React.useState(false);
  const time = getTimeText(new Date(data.createdAt));
  const theme = useTheme();
  if (isMobile)
    return (
      <Box
        sx={{
          '&:not(:first-child)': {
            borderTop: `1px solid ${theme.palette.border.main}`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            px: 16,
            py: 20,
          }}
        >
          <Box
            sx={{
              flex: 1,
            }}
            onClick={() =>
              window.open(
                getEtherscanPage(data.fromToken.chainId, data.hash, 'tx'),
              )
            }
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <TokenAndAmount
                token={data.fromToken}
                amount={data.fromAmount ?? ''}
                hideLogo
              />
              <Box
                component="svg"
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                sx={{
                  color: 'text.secondary',
                }}
              >
                <path
                  d="M7.575 8.625L4.5 11.7L5.625 12.75L9.75 8.625L5.625 4.5L4.5 5.55L7.575 8.625ZM12.15 8.625L9.075 11.7L10.125 12.75L14.25 8.625L10.125 4.5L9.075 5.55L12.15 8.625Z"
                  fill="currentColor"
                />
              </Box>
              <TokenAndAmount
                token={data.toToken}
                amount={data.toAmount ?? ''}
                hideLogo
                sx={{
                  textAlign: 'right',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                mt: 8,
              }}
            >
              <ChainName chainId={data.fromToken.chainId} />
              <StatusAndTime
                isMobile={false}
                statusText={statusText}
                statusColor={statusColor}
                alphaColor={statusAlphaColor}
              />
            </Box>
          </Box>
          <FoldBtn
            show={showFold}
            onClick={() => setShowFold((prev) => !prev)}
          />
        </Box>
        <Extend showFold={showFold} data={data} isMobile />
      </Box>
    );
  return (
    <>
      <tr>
        <Box
          component="td"
          sx={{
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: showFold ? 0 : 8,
          }}
        >
          <TokenAndAmount
            token={data.fromToken}
            amount={data.fromAmount ?? ''}
            showChain
          />
        </Box>
        <td>
          <TokenAndAmount
            token={data.toToken}
            amount={data.toAmount ?? ''}
            showChain
            canAddMetamask
          />
        </td>
        <td>
          <StatusAndTime
            isMobile={isMobile}
            statusText={statusText}
            statusColor={statusColor}
            alphaColor={statusAlphaColor}
            time={time}
          />
        </td>
        <td>
          <PriceWithToggle
            fromToken={data.fromToken}
            toToken={data.toToken}
            fromTokenPrice={data.fromTokenPrice}
            toTokenPrice={data.toTokenPrice}
          />
        </td>
        <Box
          component="td"
          sx={{
            borderTopRightRadius: 8,
            borderBottomRightRadius: showFold ? 0 : 8,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Box
              component="a"
              href={getEtherscanPage(data.fromToken.chainId, data.hash, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 3,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component={ArrowTopRightBorder}
                sx={{
                  width: 18,
                  height: 18,
                }}
              />
            </Box>
            <Box
              sx={{
                height: 16,
                width: '1px',
                backgroundColor: 'border.main',
              }}
            />
            <FoldBtn
              show={showFold}
              onClick={() => setShowFold((prev) => !prev)}
            />
          </Box>
        </Box>
      </tr>
      <tr>
        <Box
          component="td"
          colSpan={5}
          sx={{
            p: '0 !important',
            backgroundColor: `transparent !important`,
          }}
        >
          <Extend showFold={showFold} data={data} />
        </Box>
      </tr>
    </>
  );
}

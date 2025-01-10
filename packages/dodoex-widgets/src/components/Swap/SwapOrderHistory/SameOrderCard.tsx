import { Box, useTheme } from '@dodoex/components';
import { ArrowTopRightBorder } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import React from 'react';
import { useSubmissionStatusColor } from '../../../hooks/Submission/useSubmissionStatusColor';
import { useTradeSwapOrderList } from '../../../hooks/Swap/useTradeSwapOrderList';
import { useRouteVisionData } from '../../../hooks/useRouteVisionData';
import { getEtherscanPage } from '../../../utils';
import { getTimeText } from '../../../utils/time';
import FoldBtn, { StatusAndTime, TokenAndAmount } from '../../CardWidgets';
import { PriceWithToggle } from './PriceWithToggle';
import { MobileRoutingVision, PCRoutingVision } from './RoutingVision';

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
        backgroundColor: 'background.paperContrast',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        maxHeight: showFold ? 400 : 0,
        transition: 'all 300ms',
        overflow: 'hidden',
        mb: showFold ? 6 : 0,
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
  if (isMobile)
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          my: 12,
          borderRadius: 12,
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

  const mt = 6;
  const mb = showFold ? 0 : 6;
  return (
    <>
      <Box component="tr" sx={{}}>
        <td>
          <TokenAndAmount
            token={data.fromToken}
            amount={data.fromAmount ?? ''}
            showChain
            sx={{
              mt,
              mb,
              py: 20,
              px: 24,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: showFold ? 0 : 12,
              backgroundColor: 'background.paper',
            }}
          />
        </td>
        <td>
          <TokenAndAmount
            token={data.toToken}
            amount={data.toAmount ?? ''}
            showChain
            canAddMetamask
            sx={{
              mt,
              mb,
              py: 20,
              px: 24,
              backgroundColor: 'background.paper',
            }}
          />
        </td>
        <td>
          <StatusAndTime
            isMobile={isMobile}
            statusText={statusText}
            statusColor={statusColor}
            alphaColor={statusAlphaColor}
            time={time}
            sx={{
              mt,
              mb,
              py: 20,
              px: 24,
              backgroundColor: 'background.paper',
            }}
          />
        </td>
        <td>
          <Box
            sx={{
              mt,
              mb,
              py: 20,
              px: 24,
              backgroundColor: 'background.paper',
              minHeight: 84,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <PriceWithToggle
              fromToken={data.fromToken}
              toToken={data.toToken}
              fromTokenPrice={data.fromTokenPrice}
              toTokenPrice={data.toTokenPrice}
            />
          </Box>
        </td>
        <td>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              mt,
              mb,
              py: 20,
              px: 24,
              backgroundColor: 'background.paper',
              minHeight: 84,
              borderTopRightRadius: 12,
              borderBottomRightRadius: showFold ? 0 : 12,
            }}
          >
            <Box
              component="a"
              href={getEtherscanPage(data.fromToken.chainId, data.hash, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                pr: 10,
                color: 'primary.main',
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
        </td>
      </Box>
      <tr>
        <Box
          component="td"
          colSpan={5}
          sx={{
            p: '0 !important',
          }}
        >
          <Extend showFold={showFold} data={data} />
        </Box>
      </tr>
    </>
  );
}

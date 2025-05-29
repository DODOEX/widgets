import { ChainId } from '@dodoex/api';
import { Box, useTheme } from '@dodoex/components';
import { ArrowTopRightBorder } from '@dodoex/icons';
import React, { useMemo } from 'react';
import { useCrossSwapOrderList } from '../../../hooks/Swap/useCrossSwapOrderList';
import { getEtherscanPage } from '../../../utils';
import { getTimeText } from '../../../utils/time';
import { AddressWithLinkAndCopy } from '../../AddressWithLinkAndCopy';
import { RouteVision } from '../../Bridge/RouteVision';
import FoldBtn, {
  ChainName,
  StatusAndTime,
  TokenAndAmount,
} from '../../CardWidgets';
import { QuestionTooltip } from '../../Tooltip';
import { PriceWithToggle } from './PriceWithToggle';

function Extend({
  showFold,
  isMobile,
  data,
}: {
  showFold: boolean;
  isMobile?: boolean;
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
}) {
  const itemList = useMemo(() => {
    return [
      {
        title: 'Total time spent',
        value: '-',
      },
      {
        title: 'Pay',
        value: (
          <AddressWithLinkAndCopy
            address={data.fromAddress ?? ''}
            customChainId={
              data.routeData.fromChainId ?? ChainId.ZETACHAIN_TESTNET
            }
            showCopy
            truncate
            iconSpace={4}
            iconSize={14}
            size="small"
          />
        ),
      },
      {
        title: 'Receive',
        value: (
          <AddressWithLinkAndCopy
            address={data.toAddress ?? ''}
            customChainId={
              data.routeData.toChainId ?? ChainId.ZETACHAIN_TESTNET
            }
            showCopy
            truncate
            iconSpace={4}
            iconSize={14}
            size="small"
          />
        ),
      },
      {
        title: (
          <>
            Fill Gas (Destination gas)
            <QuestionTooltip onlyHover title="-" ml={0} />
          </>
        ),
        value: '$-',
      },
      {
        title: (
          <>
            Bridge Fee
            <QuestionTooltip onlyHover title="-" ml={0} />
          </>
        ),
        value: `$${data.fees?.[0]?.amountUSD ?? '-'}`,
      },
    ];
  }, [
    data.fees,
    data.fromAddress,
    data.routeData.fromChainId,
    data.routeData.toChainId,
    data.toAddress,
  ]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        p: showFold ? 16 : 0,
        backgroundColor: 'background.paperDarkContrast',
        maxHeight: showFold ? 'auto' : 0,
        transition: 'all 300ms',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {itemList.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                flexBasis: '20%',
                flexGrow: 1,
                flexShrink: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'text.secondary',
                  typography: 'h6',
                }}
              >
                {item.title}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                  typography: 'body2',
                }}
              >
                {item.value}
              </Box>
            </Box>
          );
        })}
      </Box>

      {data.routeData.fromChainId != null &&
        data.routeData.toChainId != null && (
          <>
            <Box
              sx={{
                height: '1px',
                width: '100%',
                backgroundColor: 'border.disabled',
              }}
            />

            <RouteVision
              route={{
                fromChainId: data.routeData.fromChainId,
                toChainId: data.routeData.toChainId,
                step: data.routeData.step,
              }}
            />
          </>
        )}
    </Box>
  );
}

export default function CrossOrderCard({
  data,
  isMobile,
}: {
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
  isMobile: boolean;
}) {
  const theme = useTheme();

  const { statusText, statusColor, statusAlphaColor } = useMemo(() => {
    let statusText = 'Loading';
    let statusColor = theme.palette.text.primary;
    let statusAlphaColor: undefined | number;

    switch (data.status) {
      case 'pending':
        statusText = 'Pending';
        statusAlphaColor = 0.1;
        break;
      case 'success':
        statusText = 'Succeeded';
        statusColor = theme.palette.success.main;
        break;
      case 'failure_revert':
        statusText = 'Failed';
        statusColor = theme.palette.error.main;
        break;
      case 'abort':
        statusText = 'Aborted';
        statusColor = theme.palette.error.main;
        break;

      default:
        break;
    }

    return {
      statusText,
      statusColor,
      statusAlphaColor,
    };
  }, [
    data.status,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.text.primary,
  ]);

  const [showFold, setShowFold] = React.useState(false);
  const time = data.createdAt ? getTimeText(new Date(data.createdAt)) : '-';

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
            onClick={() => {
              if (!data.fromToken) {
                return;
              }
              window.open(
                getEtherscanPage(data.fromToken.chainId, data.hash, 'tx'),
              );
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {data.fromToken && (
                <TokenAndAmount
                  token={data.fromToken}
                  amount={data.fromAmount ?? ''}
                  hideLogo
                />
              )}

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
              {data.toToken && (
                <TokenAndAmount
                  token={data.toToken}
                  amount={data.toAmount ?? ''}
                  hideLogo
                  sx={{
                    textAlign: 'right',
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                mt: 8,
              }}
            >
              {data.fromToken && <ChainName chainId={data.fromToken.chainId} />}
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
        <td>
          {data.fromToken && (
            <TokenAndAmount
              token={data.fromToken}
              amount={data.fromAmount ?? ''}
              showChain
            />
          )}
        </td>
        <td>
          {data.toToken && (
            <TokenAndAmount
              token={data.toToken}
              amount={data.toAmount ?? ''}
              showChain
              canAddMetamask
            />
          )}
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
          {data.fromToken && data.toToken && (
            <PriceWithToggle
              fromToken={data.fromToken}
              toToken={data.toToken}
              fromTokenPrice={data.fromTokenPrice}
              toTokenPrice={data.toTokenPrice}
            />
          )}
        </td>
        <td>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Box
              component="a"
              href={
                data.fromToken && data.hash
                  ? getEtherscanPage(data.fromToken.chainId, data.hash, 'tx')
                  : undefined
              }
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                px: 10,
                py: 12,
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
      </tr>
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

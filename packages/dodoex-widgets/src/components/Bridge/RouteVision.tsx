import { Box, ButtonBase, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import React, { useMemo, useState } from 'react';
import { ChainListItem, chainListMap } from '../../constants/chainList';
import { BridgeRouteI, BridgeStepSwapStep } from '../../hooks/Bridge';
import { TokenInfo } from '../../hooks/Token/type';
import { MidPathType } from '../../hooks/useRouteVisionData';
import { getEtherscanPage } from '../../utils';
import {
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../utils/formatter';
import {
  MobileRoutingVision,
  PCRoutingVision,
} from '../Swap/SwapOrderHistory/RoutingVision';
import { productList } from './SelectBridgeDialog/productList';

export interface RouteVisionProps {
  route: Pick<BridgeRouteI, 'fromChainId' | 'toChainId' | 'step'>;
  isMobile?: boolean;
}

interface RouteVisionItemProps {
  key: string;
  logo:
    | React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
          title?: string;
        }
      >
    | undefined;
  title: string | undefined;
  fromTokenAmount?: BigNumber;
  toTokenAmount?: BigNumber;
  fromToken?: TokenInfo;
  toToken?: TokenInfo;
  fromChain?: ChainListItem;
  toChain?: ChainListItem;
  tx?: string;
  txChainId?: number;
  swapSteps?: Array<BridgeStepSwapStep>;
}

function RouteVisionItem({
  item,
  isMobile,
}: {
  item: RouteVisionItemProps;
  isMobile?: boolean;
}) {
  const theme = useTheme();

  const [isActive, setIsActive] = useState(false);

  const routeData = React.useMemo<MidPathType[]>(() => {
    if (!item.swapSteps) {
      return [];
    }

    return item.swapSteps.map((path) => {
      const { inputToken, outputToken, percent } = path;
      const poolDetails: MidPathType['poolDetails'] = new Map();

      const poolDetail = {
        poolPart: formatPercentageNumber({
          input: new BigNumber(percent).div(100),
        }),
        poolAddress:
          path.assembleArgs?.pairAddress ??
          path.assembleArgs?.id ??
          path.ammKey ??
          null,
      };

      poolDetails.set(path.assembleArgs?.pairName ?? path.label ?? '-', [
        poolDetail,
      ]);

      return {
        fromToken: inputToken.address,
        toToken: outputToken.address,
        chainId: inputToken.chainId,
        poolDetails,
      };
    });
  }, [item.swapSteps]);

  const isFrom = item.key === 'from';
  const isTo = item.key === 'to';
  const isFromOrTo = isFrom || isTo;
  return (
    <Box key={item.key}>
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

        {isFromOrTo ? null : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: 4,
              typography: 'body2',
              lineHeight: '22px',
              color: theme.palette.text.primary,
            }}
          >
            <Box>
              {formatTokenAmountNumber({
                input: item.fromTokenAmount,
                decimals: item.fromToken?.decimals,
              })}
              &nbsp;
              {item.fromToken?.symbol}
            </Box>
            <Box sx={{ color: theme.palette.text.secondary }}>On</Box>
            <Box
              component={item.fromChain?.logo}
              sx={{
                width: 18,
                height: 18,
              }}
            />
            <Box sx={{ color: theme.palette.text.secondary }}>to</Box>
            <Box>
              {formatTokenAmountNumber({
                input: item.toTokenAmount,
                decimals: item.toToken?.decimals,
              })}
              &nbsp;
              {item.toToken?.symbol}
            </Box>
            <Box sx={{ color: theme.palette.text.secondary }}>on</Box>
            <Box
              component={item.toChain?.logo}
              sx={{
                width: 18,
                height: 18,
              }}
            />
          </Box>
        )}
      </Box>

      {isTo ? null : (
        <Box
          sx={{
            pt: 8,
            pb: 24,
            ml: 9,
            borderLeftWidth: 1,
            borderLeftStyle: 'dashed',
            borderLeftColor: theme.palette.border.light,
          }}
        >
          {isFrom ? null : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
              }}
            >
              {item.tx && item.txChainId && (
                <Box
                  component="a"
                  href={getEtherscanPage(item.txChainId, item.tx, 'tx')}
                  target="_blank"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: theme.palette.text.secondary,
                    typography: 'body2',
                    lineHeight: '19px',
                    '&:hover': {
                      color: theme.palette.text.primary,
                    },
                    textDecoration: 'none',
                  }}
                >
                  TX:
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33333 3.33333V12.6667H12.6667V7.99999H14V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.59333 14 2 13.4 2 12.6667V3.33333C2 2.6 2.59333 2 3.33333 2H8V3.33333H3.33333ZM9.33333 3.33333V2H14V6.66666H12.6667V4.27333L6.11333 10.8267L5.17333 9.88666L11.7267 3.33333H9.33333Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
              )}
              {item.swapSteps && (
                <Box
                  component={ButtonBase}
                  onClick={() => setIsActive(!isActive)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    py: 2,
                    pr: 2,
                    pl: 6,
                    borderRadius: 20,
                    backgroundColor: theme.palette.background.tag,
                    color: theme.palette.text.secondary,
                    typography: 'h6',
                    lineHeight: '16px',
                    '&:hover': {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  Route
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00033 9.33334L9.33366 5.83334H4.66699L7.00033 9.33334Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
              )}
            </Box>
          )}

          {isActive && item.fromToken && item.toToken && (
            <Box
              sx={{
                mt: 8,
                ml: 20,
                p: 12,
                borderRadius: 12,
                backgroundColor: theme.palette.background.paperDarkContrast,
              }}
            >
              {isMobile ? (
                <MobileRoutingVision
                  routeData={routeData}
                  fromTokenRaw={item.fromToken}
                  toTokenRaw={item.toToken}
                />
              ) : (
                <PCRoutingVision
                  routeData={routeData}
                  fromTokenRaw={item.fromToken}
                  toTokenRaw={item.toToken}
                />
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export const RouteVision = ({ route, isMobile }: RouteVisionProps) => {
  const { fromChainId, toChainId, step } = route;

  const logoList = useMemo(() => {
    const fromChain = chainListMap.get(fromChainId);
    const toChain = chainListMap.get(toChainId);

    const list: Array<RouteVisionItemProps> = [
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
        const targetChain = chainListMap.get(item.estimate.toToken.chainId);

        list.push({
          key: item.id,
          logo: productDetail?.logoURI ?? chain?.logo,
          title: productDetail?.name ?? chain?.name,
          fromTokenAmount: item.estimate.fromTokenAmount,
          fromToken: item.estimate.fromToken,
          fromChain: chain,
          toTokenAmount: item.estimate.toTokenAmount,
          toToken: item.estimate.toToken,
          toChain: targetChain,
          tx: item.hash,
          txChainId: item.hashChainId,
          swapSteps: item.swapSteps,
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
        alignItems: 'stretch',
      }}
    >
      {logoList.map((item) => {
        return (
          <RouteVisionItem key={item.key} item={item} isMobile={isMobile} />
        );
      })}
    </Box>
  );
};

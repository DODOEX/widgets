import { Box, HoverOpacity, Tooltip, useTheme } from '@dodoex/components';
import {
  GasFee as FeeIcon,
  Time as TimeIcon,
  ArrowRight,
  Switch,
} from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { chainListMap } from '../../constants/chainList';
import { ChainId } from '../../constants/chains';
import { BridgeRouteI } from '../../hooks/Bridge';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { formatReadableTimeDuration } from '../../utils/time';
import TokenLogo from '../TokenLogo';
import { productList } from './SelectBridgeDialog/productList';
import React from 'react';
import BigNumber from 'bignumber.js';

export default function BridgeRouteShortCard({
  route,
  onClick,
}: {
  route?: BridgeRouteI;
  onClick: () => void;
}) {
  const theme = useTheme();
  if (!route) return null;
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
  } = route;
  const productDetail = productList.find((i) => i.id === product);
  const fromChain = chainListMap.get(fromChainId as ChainId);
  const toChain = chainListMap.get(toChainId as ChainId);

  const [isReverse, setIsReverse] = React.useState(false);
  const baseToken = isReverse ? toToken : fromToken;
  const quoteToken = isReverse ? fromToken : toToken;
  const baseChainId = isReverse ? toChainId : fromChainId;
  const quoteChainId = isReverse ? fromChainId : toChainId;

  return (
    <Box
      sx={{
        px: 16,
        py: 8,
        width: '100%',
        backgroundColor: 'background.tag',
        borderRadius: 12,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'hover.default',
        },
      }}
      onClick={onClick}
    >
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

          <Tooltip
            onlyHover
            placement="top"
            title={<Trans>Estimated transaction time</Trans>}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 8,
                py: 4,
                border: `solid 1px ${theme.palette.border.main}`,
                borderRadius: 4,
                typography: 'h6',
              }}
            >
              <TimeIcon
                style={{
                  color: theme.palette.text.secondary,
                  width: 14,
                  height: 14,
                }}
              />
              <Box
                sx={{
                  ml: 4,
                  lineHeight: 1,
                }}
              >
                {executionDuration !== null
                  ? formatReadableTimeDuration({
                      start: Date.now(),
                      end: Date.now() + executionDuration * 1000,
                    })
                  : '-'}
              </Box>
            </Box>
          </Tooltip>
          <Tooltip
            onlyHover
            placement="top"
            title={
              <Trans>
                Fee includes: Cross Chain fees + Swap fees. Gas fee not
                included.
              </Trans>
            }
          >
            <Box
              sx={{
                ml: 8,
                display: 'flex',
                alignItems: 'center',
                px: 8,
                py: 4,
                border: `solid 1px ${theme.palette.border.main}`,
                borderRadius: 4,
                typography: 'h6',
              }}
            >
              <FeeIcon
                style={{
                  color: theme.palette.text.secondary,
                  width: 14,
                  height: 14,
                }}
              />
              <Box
                sx={{
                  ml: 4,
                  lineHeight: 1,
                }}
              >
                {feeUSD !== null
                  ? `$${formatTokenAmountNumber({
                      input: feeUSD,
                      decimals: 6,
                    })}`
                  : '-'}
              </Box>
            </Box>
          </Tooltip>
        </Box>
        <Box
          component={ArrowRight}
          sx={{
            width: 18,
            height: 18,
          }}
        />
      </Box>

      <Box
        sx={{
          mt: 8,
          display: 'flex',
          alignItems: 'center',
          typography: 'body2',
          fontWeight: 600,
          gap: 4,
        }}
      >
        <span>1 {baseToken.symbol}</span>
        <TokenLogo
          address={baseToken?.address ?? ''}
          marginRight={0}
          width={20}
          height={20}
          url={baseToken?.logoURI}
          chainId={baseChainId}
          sx={{
            flexShrink: 0,
          }}
        />
        <span>=</span>
        <span>
          {formatTokenAmountNumber({
            input: isReverse
              ? new BigNumber(fromAmount).div(toTokenAmount)
              : toTokenAmount.div(fromAmount),
            decimals: quoteToken?.decimals,
          })}{' '}
          {quoteToken.symbol}
        </span>
        <TokenLogo
          address={quoteToken?.address ?? ''}
          marginRight={0}
          width={20}
          height={20}
          url={quoteToken?.logoURI}
          chainId={quoteChainId}
          sx={{
            flexShrink: 0,
          }}
        />
        <HoverOpacity
          component={Switch}
          sx={{
            color: 'text.secondary',
            position: 'relative',
            left: -2,
          }}
          onClick={(evt) => {
            evt.stopPropagation();
            setIsReverse((prev) => !prev);
          }}
        />
      </Box>
    </Box>
  );
}

import { Box, Tooltip, useTheme } from '@dodoex/components';
import { GasFee as FeeIcon, Time as TimeIcon, ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { chainListMap } from '../../constants/chainList';
import { ChainId } from '../../constants/chains';
import { BridgeRouteI } from '../../hooks/Bridge';
import { formatTokenAmountNumber } from '../../utils/formatter';
import { formatReadableTimeDuration } from '../../utils/time';
import TokenLogo from '../TokenLogo';
import { productList } from './SelectBridgeDialog/productList';

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
  const fromChain = chainListMap[fromChainId as ChainId];
  const toChain = chainListMap[toChainId as ChainId];
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
              marginLeft: 4,
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            {productDetail?.name}
          </Box>
          <Box
            sx={{
              display: 'block',
              mx: 8,
              width: '1px',
              height: 12,
              backgroundColor: theme.palette.border.main,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            {formatTokenAmountNumber({
              input: fromAmount,
              decimals: fromToken?.decimals,
            })}
            <Box
              sx={{
                ml: 4,
                display: 'flex',
                alignItems: 'flex-end',
                alignSelf: 'center',
                width: 18,
                height: 18,
              }}
            >
              <TokenLogo
                address={fromToken?.address ?? ''}
                marginRight={0}
                width={18}
                height={18}
                url={fromToken?.logoURI}
              />
              {fromChain ? (
                <Box
                  component={fromChain.logo}
                  sx={{
                    position: 'relative',
                    left: -6,
                    width: 10,
                    height: 10,
                    flexShrink: 0,
                  }}
                />
              ) : (
                ''
              )}
            </Box>
          </Box>
          &nbsp;=&nbsp;
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            {formatTokenAmountNumber({
              input: toTokenAmount,
              decimals: toToken?.decimals,
            })}
            <Box
              sx={{
                ml: 4,
                display: 'flex',
                alignItems: 'flex-end',
                alignSelf: 'center',
                width: 18,
                height: 18,
              }}
            >
              <TokenLogo
                address={toToken?.address ?? ''}
                marginRight={0}
                width={18}
                height={18}
                url={toToken?.logoURI}
              />
              {toChain ? (
                <Box
                  component={toChain.logo}
                  sx={{
                    width: 10,
                    height: 10,
                    position: 'relative',
                    left: -6,
                    flexShrink: 0,
                  }}
                />
              ) : (
                ''
              )}
            </Box>
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 8,
        }}
      >
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
              Fee includes: Bridge fees + Swap fees. Gas fee not included.
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
    </Box>
  );
}

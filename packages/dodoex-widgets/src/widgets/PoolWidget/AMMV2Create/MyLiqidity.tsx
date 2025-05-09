import { Pair } from '@uniswap/v2-sdk';
import { useAMMV2Balance } from '../hooks/useAMMV2Balance';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
  getEtherscanPage,
} from '../../../utils';
import BigNumber from 'bignumber.js';
import {
  Box,
  HoverOpacity,
  LoadingSkeleton,
  Tooltip,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import TokenItem from '../../../components/Token/TokenItem';
import { ArrowTopRightBorder, DetailBorder } from '@dodoex/icons';

export default function MyLiquidity({
  isExists,
  pair,
  pairAddress,
}: {
  isExists: boolean;
  pair?: Pair | null;
  pairAddress?: string;
}) {
  const {
    isBalanceLoading,
    isDepositedLoading,
    balance,
    token0Deposited,
    token1Deposited,
    poolTokenPercentage: poolTokenPercentageExists,
  } = useAMMV2Balance({
    pairAddress,
    pair,
  });
  const shareOfPoolExists = poolTokenPercentageExists
    ? `${formatReadableNumber({
        input: poolTokenPercentageExists,
        showDecimals: 2,
        roundingMode: BigNumber.ROUND_HALF_UP,
      })}%`
    : undefined;

  if (!isExists || !pair) return null;
  return (
    <Box
      sx={{
        px: 20,
        py: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'solid',
        borderColor: 'border.main',
      }}
    >
      <Box
        sx={{
          typography: 'h6',
          color: 'text.secondary',
        }}
      >
        <Trans>My Liquidity</Trans>
      </Box>
      <Box
        sx={{
          mt: 12,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenLogoPair
          width={18}
          height={18}
          tokens={[pair.token0, pair.token1]}
          mr={4}
        />
        <LoadingSkeleton
          loading={isBalanceLoading}
          loadingProps={{
            width: 50,
          }}
          sx={{
            mr: 4,
          }}
        >
          {formatTokenAmountNumber({
            input: balance,
            decimals: pair.liquidityToken?.decimals,
          })}
        </LoadingSkeleton>
        {`${pair.token0.symbol}/${pair.token1.symbol} LP`}
        <Tooltip
          title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                typography: 'body2',
                color: 'text.primary',
              }}
            >
              <TokenItem
                address={pair.token0.address}
                chainId={pair.token0.chainId}
                showName={pair.token0.symbol ?? ''}
                size={14}
                offset={4}
                rightContent={
                  <LoadingSkeleton
                    loading={isDepositedLoading}
                    loadingProps={{
                      width: 50,
                    }}
                  >
                    {formatTokenAmountNumber({
                      input: token0Deposited,
                      decimals: pair.token0.decimals,
                    })}
                  </LoadingSkeleton>
                }
              />
              <TokenItem
                address={pair.token1.address}
                chainId={pair.token1.chainId}
                showName={pair.token1.symbol ?? ''}
                size={14}
                offset={4}
                rightContent={
                  <LoadingSkeleton
                    loading={isDepositedLoading}
                    loadingProps={{
                      width: 50,
                    }}
                  >
                    {formatTokenAmountNumber({
                      input: token1Deposited,
                      decimals: pair.token1.decimals,
                    })}
                  </LoadingSkeleton>
                }
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Trans>Pool share</Trans>
                <LoadingSkeleton
                  loading={isDepositedLoading}
                  loadingProps={{
                    width: 50,
                  }}
                >
                  {shareOfPoolExists}
                </LoadingSkeleton>
              </Box>
            </Box>
          }
          sx={{
            padding: 20,
            width: 256,
          }}
        >
          <HoverOpacity
            component={DetailBorder}
            sx={{
              ml: 4,
              width: 16,
              height: 16,
              cursor: 'pointer',
            }}
          />
        </Tooltip>
        <Box
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={getEtherscanPage(
            pair.liquidityToken.chainId,
            pair.liquidityToken.address,
            'address',
          )}
          sx={{
            ml: 4,
            display: 'inline-flex',
            height: 16,
          }}
        >
          <HoverOpacity
            component={ArrowTopRightBorder}
            sx={{
              width: 16,
              height: 16,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

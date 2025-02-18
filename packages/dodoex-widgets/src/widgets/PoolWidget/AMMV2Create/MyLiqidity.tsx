import {
  Box,
  HoverOpacity,
  LoadingSkeleton,
  Tooltip,
} from '@dodoex/components';
import { ArrowTopRightBorder, DetailBorder } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { ApiV3PoolInfoStandardItemCpmm } from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';
import TokenItem from '../../../components/Token/TokenItem';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import {
  formatPercentageNumber,
  formatTokenAmountNumber,
  getEtherscanPage,
} from '../../../utils';
import { ChainId } from '@dodoex/api';

export default function MyLiquidity({
  isExists,
  poolInfo,
  poolInfoLoading,
  lpBalanceLoading,
  lpBalance,
  lpBalancePercentage,
  lpToAmountA,
  lpToAmountB,
}: {
  isExists: boolean;
  poolInfo?: ApiV3PoolInfoStandardItemCpmm;
  poolInfoLoading: boolean;
  lpBalanceLoading: boolean;
  lpBalance: BigNumber | undefined;
  lpBalancePercentage: BigNumber | undefined;
  lpToAmountA: BigNumber | undefined;
  lpToAmountB: BigNumber | undefined;
}) {
  const shareOfPoolExists = lpBalancePercentage
    ? `${formatPercentageNumber({
        input: lpBalancePercentage,
        roundingMode: BigNumber.ROUND_DOWN,
      })}`
    : undefined;

  if (!isExists || !poolInfo) {
    return null;
  }
  return (
    <Box
      sx={{
        px: 20,
        py: 12,
        borderWidth: 1,
        borderRadius: 8,
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
          tokens={[poolInfo.mintA, poolInfo.mintB]}
          mr={4}
        />
        <LoadingSkeleton
          loading={lpBalanceLoading}
          loadingProps={{
            width: 50,
          }}
          sx={{
            mr: 4,
          }}
        >
          {formatTokenAmountNumber({
            input: lpBalance,
            decimals: poolInfo.lpMint.decimals,
          })}
        </LoadingSkeleton>
        {`${poolInfo.mintA.symbol}/${poolInfo.mintB.symbol} LP`}
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
                address={poolInfo.mintA.address}
                chainId={poolInfo.mintA.chainId}
                showName={poolInfo.mintA.symbol ?? ''}
                size={14}
                offset={4}
                rightContent={
                  <LoadingSkeleton
                    loading={poolInfoLoading}
                    loadingProps={{
                      width: 50,
                    }}
                  >
                    {formatTokenAmountNumber({
                      input: lpToAmountA,
                      decimals: poolInfo.mintA.decimals,
                    })}
                  </LoadingSkeleton>
                }
              />
              <TokenItem
                address={poolInfo.mintB.address}
                chainId={poolInfo.mintB.chainId}
                showName={poolInfo.mintB.symbol ?? ''}
                size={14}
                offset={4}
                rightContent={
                  <LoadingSkeleton
                    loading={poolInfoLoading}
                    loadingProps={{
                      width: 50,
                    }}
                  >
                    {formatTokenAmountNumber({
                      input: lpToAmountB,
                      decimals: poolInfo.mintB.decimals,
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
                  loading={poolInfoLoading}
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
            ChainId.SOON_TESTNET,
            poolInfo.lpMint.address,
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

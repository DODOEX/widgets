import { PoolApi } from '@dodoex/api';
import {
  Box,
  useTheme,
  LoadingSkeleton,
  Tooltip,
  HoverOpacity,
  ButtonBase,
  RotatingIcon,
  Skeleton,
} from '@dodoex/components';
import { ArrowRight, DetailBorder, ArrowTopRightBorder } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../components/TokenLogo';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { ChainId } from '../../../constants/chains';
import { useBalanceUpdateLoading } from '../../../hooks/Submission/useBalanceUpdateLoading';
import { TokenInfo } from '../../../hooks/Token';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { formatReadableNumber, getEtherscanPage } from '../../../utils';
import { usePoolBalanceInfo } from '../hooks/usePoolBalanceInfo';
import { OperatePool } from './types';

export interface LiquidityInfoProps {
  loading?: boolean;
  hidePoolInfo?: boolean;
  pool: OperatePool;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
}

function LiquidityBalanceItem({
  chainId,
  address,
  token,
  quoteToken,
  lpBalance,
  lpBalanceLoading,
  balanceNeedUpdateLoading,
  tokenBalanceList,
}: {
  chainId: number | undefined;
  address?: string;
  token?: TokenInfo;
  quoteToken?: TokenInfo;
  lpBalance?: BigNumber | null;
  lpBalanceLoading?: boolean;
  balanceNeedUpdateLoading?: boolean;
  /**
   * The balance converted from lp to token
   */
  tokenBalanceList?: Array<{
    token: TokenInfo;
    balance: BigNumber | null | undefined;
    loading: boolean;
  }>;
}) {
  const symbol = quoteToken
    ? `${token?.symbol}/${quoteToken.symbol}`
    : token?.symbol ?? '';

  return (
    <Box
      key={address}
      sx={{
        display: 'flex',
      }}
    >
      {token ? (
        <Box
          sx={{
            position: 'relative',
            top: 2,
          }}
        >
          {quoteToken ? (
            <TokenLogoPair tokens={[token, quoteToken]} width={18} mr={4} />
          ) : (
            <TokenLogo
              address={token.address}
              width={18}
              height={18}
              chainId={chainId}
              url={token.logoURI}
              marginRight={4}
              noShowChain
            />
          )}
        </Box>
      ) : (
        <Skeleton
          width={32}
          height={32}
          sx={{
            mr: 4,
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          wordBreak: 'break-all',
        }}
      >
        <LoadingSkeleton
          loading={lpBalanceLoading}
          loadingProps={{
            width: 30,
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
          }}
        >
          {balanceNeedUpdateLoading ? (
            <RotatingIcon />
          ) : (
            formatReadableNumber({
              input: lpBalance || '-',
            })
          )}
        </LoadingSkeleton>
        {`${symbol} LP`}
        {!!tokenBalanceList?.length && (
          <Tooltip
            title={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {tokenBalanceList.map((son) => (
                  <Box
                    key={son.token.address}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      typography: 'body2',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <TokenLogo
                        address={son.token.address}
                        width={14}
                        height={14}
                        url={son.token.logoURI}
                        marginRight={4}
                        noShowChain
                      />
                      {son.token.symbol}
                    </Box>
                    <LoadingSkeleton loading={son.loading}>
                      {son.balance &&
                      !son.balance.isZero() &&
                      !son.balance.isNaN()
                        ? '~'
                        : ''}
                      {son.balance
                        ? formatReadableNumber({
                            input: son.balance,
                          })
                        : ''}
                    </LoadingSkeleton>
                  </Box>
                ))}
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
              }}
            />
          </Tooltip>
        )}
        <Box
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={chainId ? getEtherscanPage(chainId, address, 'address') : ''}
          sx={{
            display: 'inline-block',
            height: 16,
          }}
        >
          <HoverOpacity
            component={ArrowTopRightBorder}
            sx={{
              ml: 4,
              width: 14,
              height: 14,
              position: 'relative',
              top: -2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function LiquidityInfo({
  loading,
  hidePoolInfo,
  pool,
  balanceInfo,
}: LiquidityInfoProps) {
  const theme = useTheme();

  const hasQuoteSupply = pool ? PoolApi.utils.singleSideLp(pool.type) : false;

  const { isTokenLoading } = useBalanceUpdateLoading();

  let isBaseLpTokenNeedLoading = false;
  let isQuoteLpTokenNeedLoading = false;
  if (pool) {
    if (balanceInfo.userBaseLpBalance && pool.baseLpToken) {
      isBaseLpTokenNeedLoading = isTokenLoading(
        pool.baseLpToken.id,
        balanceInfo.userBaseLpBalance,
      );
    }
    if (balanceInfo.userQuoteLpBalance && pool.quoteLpToken) {
      isQuoteLpTokenNeedLoading = isTokenLoading(
        pool.quoteLpToken.id,
        balanceInfo.userQuoteLpBalance,
      );
    }
  }

  return (
    <Box
      sx={{
        mt: 16,
        mx: 20,
        border: 'solid 1px',
        borderColor: 'border.main',
        borderRadius: 12,
      }}
    >
      {!hidePoolInfo ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: theme.spacing(12, 20),
            borderStyle: 'solid',
            borderColor: 'border.main',
            borderWidth: theme.spacing(0, 0, 1),
          }}
        >
          <Box>
            <LoadingSkeleton
              loading={loading}
              loadingSx={{
                width: 100,
              }}
              sx={{
                typography: 'body2',
                fontWeight: 600,
              }}
            >
              {pool?.baseToken?.symbol}/{pool?.quoteToken?.symbol}
            </LoadingSkeleton>
            <LoadingSkeleton loading={loading}>
              <AddressWithLinkAndCopy
                address={pool?.address ?? ''}
                truncate
                iconSize={14}
                iconSpace={4}
                customChainId={pool?.chainId}
                sx={{
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              />
            </LoadingSkeleton>
          </Box>
          {pool?.address ? (
            <Box
              component={ButtonBase}
              sx={{
                typography: 'body2',
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
              onClick={() => {
                useRouterStore.getState().push({
                  type: PageType.PoolDetail,
                  params: {
                    chainId: pool.chainId as ChainId,
                    address: pool.address as string,
                  },
                });
              }}
            >
              <Trans>Details</Trans>
              <Box
                component={ArrowRight}
                sx={{
                  ml: 4,
                  position: 'relative',
                  top: 1.2,
                  width: 16,
                  height: 16,
                }}
              />
            </Box>
          ) : (
            ''
          )}
        </Box>
      ) : (
        ''
      )}
      <Box
        sx={{
          p: theme.spacing(12, 20),
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
          }}
        >
          <LoadingSkeleton
            loading={loading}
            loadingSx={{
              width: 100,
            }}
          >
            {hasQuoteSupply ? (
              <>
                <LiquidityBalanceItem
                  chainId={pool?.chainId}
                  address={pool?.address}
                  token={pool?.baseToken}
                  lpBalance={balanceInfo?.userBaseLpBalance}
                  lpBalanceLoading={balanceInfo.userLpBalanceLoading}
                  balanceNeedUpdateLoading={isBaseLpTokenNeedLoading}
                  tokenBalanceList={
                    pool
                      ? [
                          {
                            token: pool.baseToken,
                            balance: balanceInfo?.userBaseLpToTokenBalance,
                            loading: balanceInfo.userLpToTokenBalanceLoading,
                          },
                        ]
                      : undefined
                  }
                />
                <LiquidityBalanceItem
                  chainId={pool?.chainId}
                  address={pool?.address}
                  token={pool?.quoteToken}
                  lpBalance={balanceInfo?.userQuoteLpBalance}
                  lpBalanceLoading={balanceInfo.userLpBalanceLoading}
                  balanceNeedUpdateLoading={isQuoteLpTokenNeedLoading}
                  tokenBalanceList={
                    pool
                      ? [
                          {
                            token: pool.quoteToken,
                            balance: balanceInfo?.userQuoteLpToTokenBalance,
                            loading: balanceInfo.userLpToTokenBalanceLoading,
                          },
                        ]
                      : undefined
                  }
                />
              </>
            ) : (
              <LiquidityBalanceItem
                chainId={pool?.chainId}
                address={pool?.address}
                token={pool?.quoteToken}
                quoteToken={pool?.quoteToken}
                lpBalance={balanceInfo?.userBaseLpBalance}
                lpBalanceLoading={balanceInfo.userLpBalanceLoading}
                balanceNeedUpdateLoading={isBaseLpTokenNeedLoading}
                tokenBalanceList={
                  pool
                    ? [
                        {
                          token: pool.baseToken,
                          balance: balanceInfo?.userBaseLpToTokenBalance,
                          loading: balanceInfo.userLpToTokenBalanceLoading,
                        },
                        {
                          token: pool.quoteToken,
                          balance: balanceInfo?.userQuoteLpToTokenBalance,
                          loading: balanceInfo.userLpToTokenBalanceLoading,
                        },
                      ]
                    : undefined
                }
              />
            )}
          </LoadingSkeleton>
        </Box>
      </Box>
    </Box>
  );
}

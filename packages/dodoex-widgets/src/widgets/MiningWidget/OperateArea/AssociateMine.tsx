import { Box, LoadingSkeleton, Tooltip, useTheme } from '@dodoex/components';
import { DetailBorder } from '@dodoex/icons';
import BigNumber from 'bignumber.js';
import { formatTokenAmountNumber } from '../../../utils';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans, t } from '@lingui/macro';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import type { TokenInfo } from '../../../hooks/Token';
import TokenItem from '../../../components/Token/TokenItem';
import { FetchMiningListItem } from '../types';
import { useRewardListAmount } from '../hooks/useRewardListAmount';

type Tokens = Array<
  TokenInfo & {
    symbolEle?: string;
  }
>;

function Item({
  value,
  label,
  tokenList,
  loading,
}: {
  value: BigNumber | undefined;
  label: string;
  tokenList: Tokens;
  loading?: boolean;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 0,
        flexShrink: 1,
        width: '30%',
      }}
    >
      <Box
        sx={{
          typography: 'h6',
          color: theme.palette.text.secondary,
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          mt: 8,
          typography: 'body1',
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <LoadingSkeleton
          loading={loading}
          loadingProps={{
            width: 30,
          }}
        >
          {value
            ? `$${formatTokenAmountNumber({
                input: value,
                decimals: 2,
              })}`
            : '-'}
        </LoadingSkeleton>
        <Tooltip
          placement="top"
          title={
            <Box>
              {tokenList.map((token) => (
                <TokenItem
                  key={token.address + token.chainId}
                  chainId={token.chainId}
                  address={token.address}
                  showName={token.symbolEle ?? token.symbol}
                  size={20}
                  offset={6}
                />
              ))}
            </Box>
          }
        >
          <Box
            component={DetailBorder}
            sx={{
              color: theme.palette.text.secondary,
              width: 16,
              height: 16,
              '&:hover': {
                color: 'text.primary',
              },
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}

export function AssociatedMine({
  chainId,
  loading,
  miningItem,
  miningContractAddress,
  stakedTokenUSD,
  stakedTokenUSDLoading,
  miningTitle,
  associatedMineSectionShort,
  stakedTokenList,
  rewardTokenList,
  isEnded,
}: {
  chainId: number;
  loading?: boolean;
  miningItem: FetchMiningListItem;
  miningContractAddress: string;
  miningTitle: string | undefined;
  associatedMineSectionShort?: boolean;
  stakedTokenUSD: BigNumber | undefined;
  stakedTokenUSDLoading?: boolean;
  stakedTokenList: Tokens;
  rewardTokenList: Tokens;
  isEnded?: boolean;
}) {
  const theme = useTheme();

  const rewardQuery = useRewardListAmount({
    miningItem,
  });

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 8,
        borderColor: theme.palette.border.main,
        borderStyle: 'solid',
        borderWidth: 1,
        mb: 20,
      }}
    >
      {associatedMineSectionShort ? null : (
        <>
          <Box
            sx={{
              py: 12,
              px: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LoadingSkeleton
                loading={loading}
                loadingProps={{
                  width: 100,
                }}
              >
                <TokenLogoPair
                  width={24}
                  tokens={stakedTokenList}
                  gap={-6}
                  chainId={chainId}
                  mr={4}
                  showChainLogo={false}
                />
              </LoadingSkeleton>

              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.text.primary,
                      typography: 'body2',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {miningTitle ?? '-'}
                  </Box>

                  {isEnded && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.border.disabled,
                        borderRadius: 4,
                        typography: 'h6',
                        fontWeight: 500,
                        px: 8,
                        color: theme.palette.text.disabled,
                      }}
                    >
                      <Trans>Ended</Trans>
                    </Box>
                  )}
                </Box>

                <AddressWithLinkAndCopy
                  size="small"
                  truncate
                  address={miningContractAddress ?? ''}
                  iconSpace={4}
                  sx={{
                    color: theme.palette.text.secondary,
                    typography: 'h6',
                  }}
                  customChainId={chainId}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.text.secondary,
                typography: 'h6',
                cursor: 'pointer',
              }}
              onClick={() => {
                useRouterStore.getState().push({
                  type: PageType.MiningDetail,
                  params: {
                    address: miningContractAddress,
                    chainId,
                  },
                });
              }}
            >
              <Trans>Details</Trans>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M7.5 4.5L6.4425 5.5575L9.8775 9L6.4425 12.4425L7.5 13.5L12 9L7.5 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              height: '1px',
              backgroundColor: theme.palette.border.main,
            }}
          />
        </>
      )}

      <Box
        sx={{
          py: 12,
          px: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Item
          value={stakedTokenUSD}
          label={t`My Staked`}
          tokenList={stakedTokenList}
          loading={loading || stakedTokenUSDLoading}
        />
        <Box
          sx={{
            width: '1px',
            height: 30,
            backgroundColor: theme.palette.border.main,
            flexGrow: 0,
            flexShrink: 0,
          }}
        />
        <Item
          value={rewardQuery.totalRewardUSD}
          label={t`Rewards`}
          tokenList={rewardTokenList}
          loading={rewardQuery.pending || loading}
        />
      </Box>
    </Box>
  );
}

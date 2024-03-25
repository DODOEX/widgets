import {
  alpha,
  Box,
  Button,
  ButtonBase,
  HoverAddBackground,
  useTheme,
} from '@dodoex/components';
import { PoolApi, PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { ChainId } from '../../../constants/chains';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { formatExponentialNotation, truncatePoolAddress } from '../../../utils';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LoadingCard from './components/LoadingCard';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import SelectChain from '../../../components/SelectChain';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import PoolOperate, { PoolOperateProps } from '../PoolOperate';
import { graphQLRequests } from '../../../constants/api';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { Edit } from '@dodoex/icons';
import { getPoolTypeTag } from '../hooks/usePoolTypeTag';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';

export default function MyCreated({
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
}: {
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
}) {
  const theme = useTheme();
  const { minDevice } = useWidgetDevice();

  const defaultQueryFilter = {
    limit: 1000,
    page: 1,
    owner: account,
  };

  const query = graphQLRequests.getQuery(
    PoolApi.graphql.fetchDashboardPairList,
    {
      where: defaultQueryFilter,
    },
  );
  const fetchResult = useQuery({
    ...query,
  });

  const list =
    (filterChainIds
      ? fetchResult.data?.dashboard_pairs_list?.list?.filter((item) =>
          filterChainIds.includes(item?.chainId ?? 0),
        )
      : fetchResult.data?.dashboard_pairs_list?.list) ?? [];
  const [operatePool, setOperatePool] =
    React.useState<{
      address: PoolOperateProps['address'];
      operate: PoolOperateProps['operate'];
      chainId: PoolOperateProps['chainId'];
    } | null>(null);

  const filterSmallDeviceWidth = 475;

  return (
    <>
      <Box
        sx={{
          my: 16,
          display: 'flex',
          gap: 8,
          ...(minDevice(filterSmallDeviceWidth)
            ? {}
            : {
                flexDirection: 'column',
              }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <SelectChain
            chainId={activeChainId}
            setChainId={handleChangeActiveChainId}
          />
        </Box>
      </Box>

      {/* list */}
      <DataCardGroup>
        {fetchResult.isLoading ? <LoadingCard /> : ''}
        {!fetchResult.isLoading && !list?.length && !!fetchResult.error && (
          <EmptyList
            sx={{
              mt: 40,
            }}
            hasSearch={!!activeChainId}
          />
        )}
        {!!fetchResult.error && (
          <FailedList
            refresh={fetchResult.refetch}
            sx={{
              mt: 40,
            }}
          />
        )}
        <>
          {list?.map((item) => {
            if (!item) return null;
            const pairAddress = item.pairAddress ?? '';
            const chainId = item.chainId as number;
            const type = item.poolType as PoolType;
            const baseToken = {
              chainId: chainId,
              address: item.baseAddress ?? '',
              symbol: item.baseSymbol ?? '',
            };
            const quoteToken = {
              chainId: chainId,
              address: item.quoteAddress ?? '',
              symbol: item.quoteSymbol ?? '',
            };
            const { typeLabel, typeColor, typeBgColor } = getPoolTypeTag(
              type,
              item.quoteReserve ? new BigNumber(item.quoteReserve) : null,
              theme,
            );
            return (
              <Box
                key={pairAddress + chainId}
                sx={{
                  px: 20,
                  pt: 20,
                  pb: 12,
                  backgroundColor: 'background.paperContrast',
                  borderRadius: 16,
                }}
                onClick={() => {
                  useRouterStore.getState().push({
                    type: PageType.PoolDetail,
                    params: {
                      chainId: chainId as ChainId,
                      address: pairAddress as string,
                    },
                  });
                }}
              >
                {/* title */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {baseToken && quoteToken ? (
                      <TokenLogoPair
                        tokens={[baseToken, quoteToken]}
                        width={24}
                        mr={8}
                        chainId={chainId}
                        showChainLogo
                      />
                    ) : (
                      ''
                    )}
                    <Box
                      sx={{
                        typography: 'body2',
                        fontWeight: 600,
                      }}
                    >
                      {truncatePoolAddress(pairAddress)}
                    </Box>
                    {type === 'DPP' && (
                      <HoverAddBackground
                        sx={{
                          ml: 2,
                        }}
                        component={ButtonBase}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          useRouterStore.getState().push({
                            type: PageType.ModifyPool,
                            params: {
                              chainId: chainId as ChainId,
                              address: pairAddress as string,
                            },
                          });
                        }}
                      >
                        <Box
                          component={Edit}
                          sx={{
                            width: 12,
                            height: 12,
                            cursor: 'pointer',
                          }}
                        />
                      </HoverAddBackground>
                    )}
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      width: 'max-content',
                      p: 8,
                      borderRadius: 8,
                      backgroundColor: typeBgColor,
                      color: typeColor,
                    }}
                  >
                    {typeLabel}
                  </Box>
                </Box>
                {/* info */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 44,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        typography: 'h5',
                      }}
                    >
                      $
                      {item.tvl
                        ? formatExponentialNotation(new BigNumber(item.tvl))
                        : '-'}
                    </Box>
                    <Box
                      sx={{
                        typography: 'h6',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <Trans>TVL</Trans>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-block',
                      mx: 20,
                      height: 24,
                      width: '1px',
                      backgroundColor: 'custom.border.default',
                    }}
                  />
                  <Box>
                    <Box
                      sx={{
                        typography: 'h5',
                      }}
                    >
                      $
                      {item.totalFee
                        ? formatExponentialNotation(
                            new BigNumber(item.totalFee),
                          )
                        : '-'}
                    </Box>
                    <Box
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
                      }}
                    >
                      <Trans>Total Fee Revenue</Trans>
                    </Box>
                  </Box>
                </Box>
                {/* operate */}
                <Box
                  sx={{
                    mt: 20,
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  {!!account && (
                    <NeedConnectButton
                      fullWidth
                      variant={Button.Variant.outlined}
                      size={Button.Size.small}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setOperatePool({
                          address: pairAddress,
                          operate: OperateTab.Remove,
                          chainId,
                        });
                      }}
                    >
                      <Trans>Remove</Trans>
                    </NeedConnectButton>
                  )}
                  <NeedConnectButton
                    fullWidth
                    size={Button.Size.small}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setOperatePool({
                        address: pairAddress,
                        operate: OperateTab.Add,
                        chainId,
                      });
                    }}
                  >
                    <Trans>Add</Trans>
                  </NeedConnectButton>
                </Box>
              </Box>
            );
          })}
        </>
      </DataCardGroup>
      <PoolOperate
        account={account}
        address={operatePool?.address}
        operate={operatePool?.operate}
        chainId={operatePool?.chainId}
        onClose={() => setOperatePool(null)}
      />
    </>
  );
}

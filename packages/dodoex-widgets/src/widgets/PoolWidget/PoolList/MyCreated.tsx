import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  HoverAddBackground,
  HoverAddUnderLine,
  alpha,
  useTheme,
} from '@dodoex/components';
import { PoolApi, PoolType, ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { Edit } from '@dodoex/icons';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  formatExponentialNotation,
  formatReadableNumber,
  truncatePoolAddress,
} from '../../../utils';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LoadingCard from './components/LoadingCard';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import SelectChain from '../../../components/SelectChain';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import { PoolOperateProps } from '../PoolOperate';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { getPoolTypeTag } from '../hooks/usePoolTypeTag';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { FetchMyCreateListLqList } from '../utils';
import LiquidityTable from './components/LiquidityTable';
import { ArrowRight } from '@dodoex/icons';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import SkeletonTable from './components/SkeletonTable';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { CardStatus } from '../../../components/CardWidgets';

function CardList({
  account,
  list,
  setOperatePool,
}: {
  account?: string;
  list: FetchMyCreateListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  return (
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
              backgroundColor: 'background.paper',
              borderRadius: 16,
            }}
            className="gradient-card-border"
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
                    ? formatExponentialNotation(new BigNumber(item.totalFee))
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
                <Button
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
                </Button>
              )}
              <Button
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
              </Button>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function TableList({
  account,
  list,
  loading,
  operatePool,
  setOperatePool,
}: {
  account?: string;
  list: FetchMyCreateListLqList;
  loading: boolean;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  const router = useRouterStore();
  return (
    <LiquidityTable empty={!list?.length} loading={loading}>
      <Box component="thead">
        <Box component="tr">
          <Box component="th">
            <Trans>Pair</Trans>
          </Box>
          <Box component="th">
            <Trans>TVL</Trans>
          </Box>
          <Box component="th">
            <Trans>Total Fee Revenue</Trans>
          </Box>
          <Box
            component="th"
            sx={{
              width: 160,
            }}
          ></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {list?.map((item) => {
          if (!item) return null;
          const isDpp = item.poolType === 'DPP';
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

          let operateBtnText = '';
          if (
            operatePool?.pool?.address === pairAddress ||
            operatePool?.address === pairAddress
          ) {
            switch (operatePool?.operate) {
              case OperateTab.Remove:
                operateBtnText = t`Removing`;
                break;
              default:
                operateBtnText = t`Adding`;
                break;
            }
          }
          const hoverBg = theme.palette.hover.default;

          return (
            <Box
              component="tr"
              key={pairAddress + chainId}
              sx={{
                [`&:hover td${operateBtnText ? ', & td' : ''}`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
              }}
            >
              <Box component="td">
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
                      mr={10}
                      chainId={chainId}
                      showChainLogo
                    />
                  ) : (
                    ''
                  )}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <HoverAddUnderLine
                        lineSx={{
                          bottom: -1,
                        }}
                        lineColor="primary.main"
                        hoverSx={{
                          color: 'primary.main',
                          '& svg': {
                            display: 'inline-block',
                          },
                        }}
                        className="truncate-address-link"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            typography: 'body2',
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            router.push({
                              type: PageType.PoolDetail,
                              params: {
                                chainId,
                                address: pairAddress,
                              },
                            });
                          }}
                        >
                          {truncatePoolAddress(pairAddress)}
                        </Box>
                        <Box
                          component={ArrowRight}
                          sx={{
                            display: 'none',
                            width: 14,
                            height: 14,
                          }}
                        />
                      </HoverAddUnderLine>
                      {isDpp ? (
                        <Box
                          sx={{
                            typography: 'h6',
                            px: 8,
                            py: 2,
                            ml: 8,
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: 'text.primary',
                            borderRadius: 4,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.text.primary,
                                0.1,
                              ),
                            },
                          }}
                          onClick={() => {
                            router.push({
                              type: PageType.ModifyPool,
                              params: {
                                chainId,
                                address: pairAddress,
                              },
                            });
                          }}
                        >
                          <Trans>Edit</Trans>
                        </Box>
                      ) : (
                        ''
                      )}
                    </Box>
                    <Box
                      sx={{
                        typography: 'h6',
                        width: 'max-content',
                        mt: 2,
                        px: 8,
                        py: 2,
                        borderRadius: 12,
                        backgroundColor: typeBgColor,
                        color: typeColor,
                      }}
                    >
                      {typeLabel}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                  }}
                  title={
                    item.tvl
                      ? `$${formatReadableNumber({
                          input: item.tvl,
                        })}`
                      : undefined
                  }
                >
                  $
                  {item.tvl
                    ? formatExponentialNotation(new BigNumber(item.tvl))
                    : '-'}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  title={
                    item.totalFee
                      ? `$${formatReadableNumber({
                          input: item.totalFee,
                        })}`
                      : ''
                  }
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                >
                  $
                  {item.totalFee
                    ? formatExponentialNotation(new BigNumber(item.totalFee))
                    : '-'}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                  }}
                >
                  {operateBtnText ? (
                    <AddingOrRemovingBtn
                      text={operateBtnText}
                      onClick={() => setOperatePool(null)}
                    />
                  ) : (
                    <>
                      {!!account && (
                        <Button
                          variant={Button.Variant.second}
                          size={Button.Size.small}
                          onClick={(evt) => {
                            evt.stopPropagation();
                            setOperatePool({
                              operate: OperateTab.Remove,
                              chainId,
                              address: pairAddress,
                            });
                          }}
                          sx={{
                            py: 0,
                            height: 32,
                          }}
                        >
                          <Trans>Remove</Trans>
                        </Button>
                      )}
                      <Button
                        size={Button.Size.small}
                        onClick={() => {
                          setOperatePool({
                            chainId,
                            address: pairAddress,
                          });
                        }}
                        sx={{
                          py: 0,
                          height: 32,
                        }}
                      >
                        {t`Add`}
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
}

export default function MyCreated({
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
  operatePool,
  setOperatePool,
}: {
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const { isMobile } = useWidgetDevice();
  const { onlyChainId } = useUserOptions();

  const defaultQueryFilter = {
    limit: 1000,
    page: 1,
    owner: account,
  };

  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(
    PoolApi.graphql.fetchDashboardPairList,
    {
      where: defaultQueryFilter,
    },
  );
  const fetchResult = useQuery({
    ...query,
  });

  const originList =
    (filterChainIds
      ? fetchResult.data?.dashboard_pairs_list?.list?.filter((item) =>
          filterChainIds.includes(item?.chainId ?? 0),
        )
      : fetchResult.data?.dashboard_pairs_list?.list) ?? [];

  const [hideZeroTvl, setHideZeroTvl] = React.useState(false);
  const list = hideZeroTvl
    ? originList.filter((item) => !!Number(item?.tvl))
    : originList;

  return (
    <>
      <Box
        sx={{
          py: 16,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          ...(isMobile
            ? {}
            : {
                px: 0,
              }),
        }}
      >
        {!onlyChainId && (
          <SelectChain
            chainId={activeChainId}
            setChainId={handleChangeActiveChainId}
          />
        )}
        <Box
          component="label"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            typography: 'body2',
            cursor: 'pointer',
            color: 'text.secondary',
          }}
        >
          <Checkbox
            sx={{
              top: -1,
            }}
            size={16}
            checked={hideZeroTvl}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const { checked } = evt.target;
              setHideZeroTvl(checked);
            }}
          />
          <Trans>Hide TVL=0 pools</Trans>
        </Box>
      </Box>

      {/* list */}
      {isMobile ? (
        <DataCardGroup>
          {fetchResult.isLoading ? <LoadingCard /> : ''}
          {!fetchResult.isLoading && !list?.length && !fetchResult.error && (
            <EmptyList
              sx={{
                mt: 40,
              }}
              hasSearch={!!activeChainId && !onlyChainId}
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
          <CardList
            account={account}
            list={list}
            setOperatePool={setOperatePool}
          />
        </DataCardGroup>
      ) : (
        <>
          <TableList
            account={account}
            list={list}
            loading={fetchResult.isLoading}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
          <CardStatus
            loading={fetchResult.isLoading}
            refetch={fetchResult.error ? fetchResult.refetch : undefined}
            empty={!list?.length}
            hasSearch={!!activeChainId && !onlyChainId}
          />
        </>
      )}
    </>
  );
}

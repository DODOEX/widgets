import { PoolApi } from '@dodoex/api';
import {
  Box,
  Button,
  ButtonBase,
  LoadingSkeleton,
  SearchInput,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { CardStatus } from '../../../components/CardWidgets';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { TableList } from './TableList';
import { useVoteTabs, VoteTab } from '../hooks/useVoteTabs';
import {
  useVotePoolFilters,
  VotePoolFilters,
} from '../hooks/useVotePoolFilters';
import { VotePoolInfoI } from '../types';
import { compositeVotePoolInfo } from '../utils';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { Lock } from '../Ve33LockList/hooks/useFetchUserLocks';
import { t, Trans } from '@lingui/macro';
import SetVotePowerDialog from './SetVotePowerDialog';
import { SelectLock } from './widgets';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'lodash';
import { CardItem, CardList } from './CardList';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import { ArrowRight, Plus } from '@dodoex/icons';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { formatReadableTimeDuration } from '../../../utils/time';
import { getEpochVoteEnd } from '../Ve33LockOperate/utils';

export const VotePoolList = ({
  onAddIncentives,
  onGoLockPage,
}: {
  onAddIncentives: (pool: VotePoolInfoI) => void;
  onGoLockPage: () => void;
}) => {
  const { onlyChainId } = useUserOptions();
  const { chainId: connectedChainId, account } = useWalletInfo();
  const chainId = onlyChainId ?? connectedChainId;
  const { isMobile } = useWidgetDevice();
  const graphQLRequests = useGraphQLRequests();
  const theme = useTheme();
  const [filterToken, setFilterToken] = useState<string>('');
  const [selectedPoolList, setSelectedPoolList] = useState<
    Array<VotePoolInfoI>
  >([]);
  const selectedPoolListLen = selectedPoolList.length;
  const selectedPoolIdList = selectedPoolList.map((item) => item.id);
  const { voteTab, tabs, handleChangeVoteTab } = useVoteTabs();
  const { votePoolFilter, filters, handleChangeVotePoolFilter } =
    useVotePoolFilters();
  const [foldFooter, setFoldFooter] = React.useState(true);

  const scrollParentRef = useRef<HTMLDivElement>(null);
  const notUnFoldFooter = React.useRef(true);
  const onSelectPool = useCallback(
    (item: VotePoolInfoI) => {
      if (!item) return;
      setSelectedPoolList((prev) => {
        const result = [...prev];
        const index = result.findIndex((p) => p.id === item.id);
        if (index > -1) {
          result.splice(index, 1);
        } else {
          result.push(item);
        }
        if (result.length) {
          if (notUnFoldFooter.current) {
            setFoldFooter(false);
          }
        } else {
          setFoldFooter(true);
        }
        return result;
      });
    },
    [selectedPoolList, setSelectedPoolList, notUnFoldFooter.current],
  );

  const [selectedLock, setSelectedLock] = React.useState<Lock | null>(null);
  const [showVoteDialog, setShowVoteDialog] = React.useState(false);

  const fetchResult = useInfiniteQuery({
    ...graphQLRequests.getInfiniteQuery(
      PoolApi.graphql.fetchVotePoolList,
      'page',
      {
        where: {
          token_starts_with: filterToken,
          size: isMobile ? 4 : 8,
          user: voteTab === VoteTab.MyVoted ? account : null,
        },
      },
    ),
    initialPageParam: 1,
    getNextPageParam: (item) => {
      return null;
      // const { currentPage, totalCount, pageSize } = item.ve33_getPoolList ?? {};
      // if (!currentPage || !totalCount || !pageSize) {
      //   return null;
      // }
      // let totalPage = Math.floor(totalCount / pageSize);
      // if (totalCount % pageSize) {
      //   totalPage += 1;
      // }
      // if (currentPage >= totalPage) {
      //   return null;
      // }
      // return currentPage + 1;
    },
  });
  const fetchUserResult = useQuery({
    ...graphQLRequests.getQuery(PoolApi.graphql.fetchVotePoolList, {
      where: {
        token_starts_with: filterToken,
        size: 1000,
      },
    }),
  });

  const hasMore = fetchResult.hasNextPage;
  const poolList = useMemo(() => {
    const list = [] as VotePoolInfoI[];
    fetchResult.data?.pages.forEach((page) => {
      page.ve33_getVotePoolList?.forEach((pool) => {
        if (pool) {
          const votePool = compositeVotePoolInfo(pool, chainId);
          if (
            votePoolFilter === VotePoolFilters.All ||
            //@ts-ignore
            votePool.type === votePoolFilter
          ) {
            list.push(compositeVotePoolInfo(pool, chainId));
          }
        }
      });
    });
    return list;
  }, [chainId, fetchResult.data?.pages, votePoolFilter]);

  const userPoolList = useMemo(() => {
    const list = [] as VotePoolInfoI[];
    fetchUserResult.data?.ve33_getVotePoolList?.forEach((pool) => {
      if (pool) {
        const votePool = compositeVotePoolInfo(pool, chainId);
        if (
          votePoolFilter === VotePoolFilters.All ||
          //@ts-ignore
          votePool.type === votePoolFilter
        ) {
          list.push(compositeVotePoolInfo(pool, chainId));
        }
      }
    });
    return list;
  }, [chainId, fetchUserResult.data, votePoolFilter]);

  const voteRefetch = () => {
    fetchResult.refetch();
    fetchUserResult.refetch();
    setSelectedPoolList([]);
    setSelectedLock(null);
  };

  const hasSearch = !!filterToken || votePoolFilter !== VotePoolFilters.All;

  const nowTime = Date.now();
  const epochVoteEnd = getEpochVoteEnd(nowTime);

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
      ref={scrollParentRef}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 16 : 20,
          px: isMobile ? 20 : 40,
          py: 20,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? undefined : 'flex-end',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 16,
            pb: isMobile ? 16 : 20,
            borderBottom: `solid 1px ${theme.palette.border.main}`,
          }}
        >
          <Box>
            <Box
              component="h2"
              sx={{
                fontWeight: 600,
                m: 0,
                ...(isMobile
                  ? {
                      fontSize: '32px',
                      lineHeight: '44px',
                    }
                  : {
                      fontSize: '40px',
                      lineHeight: '55px',
                    }),
              }}
            >
              {t`Vote`}
            </Box>
            <Box
              sx={{
                mt: 8,
                typography: isMobile ? 'h6' : 'body2',
                color: 'text.secondary',
              }}
            >{t`Voters earn a share of transaction fees and incentives for helping govern how emissions are distributed.`}</Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 20 : 40,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  lineHeight: '56px',
                  textAlign: 'center',
                  borderRadius: 20,
                  backgroundColor: theme.palette.background.paper,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.8497 19.4833L19.483 17.8499L15.1663 13.5333V8.16659H12.833V14.4666L17.8497 19.4833ZM13.9997 25.6666C12.3858 25.6666 10.8691 25.3603 9.44967 24.7478C8.03023 24.1353 6.79551 23.3041 5.74551 22.2541C4.69551 21.2041 3.86426 19.9694 3.25176 18.5499C2.63926 17.1305 2.33301 15.6138 2.33301 13.9999C2.33301 12.386 2.63926 10.8694 3.25176 9.44992C3.86426 8.03047 4.69551 6.79575 5.74551 5.74575C6.79551 4.69575 8.03023 3.8645 9.44967 3.252C10.8691 2.6395 12.3858 2.33325 13.9997 2.33325C15.6136 2.33325 17.1302 2.6395 18.5497 3.252C19.9691 3.8645 21.2038 4.69575 22.2538 5.74575C23.3038 6.79575 24.1351 8.03047 24.7476 9.44992C25.3601 10.8694 25.6663 12.386 25.6663 13.9999C25.6663 15.6138 25.3601 17.1305 24.7476 18.5499C24.1351 19.9694 23.3038 21.2041 22.2538 22.2541C21.2038 23.3041 19.9691 24.1353 18.5497 24.7478C17.1302 25.3603 15.6136 25.6666 13.9997 25.6666ZM13.9997 23.3333C16.5858 23.3333 18.7879 22.4242 20.6059 20.6062C22.424 18.7881 23.333 16.586 23.333 13.9999C23.333 11.4138 22.424 9.21172 20.6059 7.39367C18.7879 5.57561 16.5858 4.66659 13.9997 4.66659C11.4136 4.66659 9.21148 5.57561 7.39342 7.39367C5.57537 9.21172 4.66634 11.4138 4.66634 13.9999C4.66634 16.586 5.57537 18.7881 7.39342 20.6062C9.21148 22.4242 11.4136 23.3333 13.9997 23.3333Z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
              <div>
                <Box
                  sx={{ typography: 'h6' }}
                >{t`Current voting round ends in`}</Box>
                <LoadingSkeleton
                  loadingProps={{ width: 100 }}
                  sx={{
                    mt: 8,
                    typography: isMobile ? 'caption' : 'h4',
                  }}
                >
                  {formatReadableTimeDuration({
                    start: nowTime,
                    end: epochVoteEnd * 1000,
                  })}
                </LoadingSkeleton>
              </div>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  lineHeight: '56px',
                  textAlign: 'center',
                  borderRadius: 20,
                  backgroundColor: theme.palette.background.paper,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="24"
                  height="21"
                  viewBox="0 0 24 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.833 5.43719e-09C18.7258 -4.97253e-05 19.5848 0.341046 20.2343 0.953498C20.8839 1.56595 21.2748 2.40346 21.3272 3.29467L21.333 3.5V8.575L22.026 8.267C22.7423 7.9485 23.5683 8.442 23.6593 9.198L23.6663 9.33333V18.6667C23.6665 19.2553 23.4442 19.8223 23.0439 20.254C22.6437 20.6856 22.095 20.95 21.508 20.9942L21.333 21H2.66634C2.07767 21.0002 1.51068 20.7779 1.07904 20.3776C0.64739 19.9773 0.382992 19.4287 0.338841 18.8417L0.333008 18.6667V9.33333C0.333008 8.54933 1.12051 7.99517 1.84617 8.21917L1.97451 8.267L2.66634 8.575V3.5C2.66629 2.60725 3.00739 1.74823 3.61984 1.0987C4.23229 0.449159 5.0698 0.0582079 5.96101 0.00583347L6.16634 5.43719e-09H17.833ZM17.833 2.33333H6.16634C5.85692 2.33333 5.56018 2.45625 5.34138 2.67504C5.12259 2.89383 4.99967 3.19058 4.99967 3.5V9.61217H18.9997V3.5C18.9997 3.19058 18.8768 2.89383 18.658 2.67504C18.4392 2.45625 18.1424 2.33333 17.833 2.33333ZM11.9997 5.83333C12.297 5.83366 12.583 5.94753 12.7993 6.15166C13.0155 6.35579 13.1456 6.63478 13.163 6.93163C13.1805 7.22848 13.0839 7.52078 12.893 7.7488C12.7022 7.97683 12.4315 8.12338 12.1362 8.1585L11.9997 8.16667H9.66634C9.36898 8.16634 9.08297 8.05247 8.86674 7.84834C8.65052 7.64421 8.5204 7.36522 8.50297 7.06837C8.48555 6.77152 8.58213 6.47922 8.77298 6.2512C8.96384 6.02317 9.23456 5.87662 9.52984 5.8415L9.66634 5.83333H11.9997Z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
              <div>
                <Box
                  sx={{ typography: 'h6' }}
                >{t`My voted / My total veMOMO`}</Box>
                <LoadingSkeleton
                  loadingProps={{ width: 100 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    mt: 8,
                    typography: isMobile ? 'caption' : 'h4',
                  }}
                >
                  10/100
                  <ButtonBase
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        opacity: 0.5,
                      },
                    }}
                    onClick={() => onGoLockPage?.()}
                  >
                    <Box component={Plus} sx={{ width: 18, height: 18 }} />
                  </ButtonBase>
                </LoadingSkeleton>
              </div>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
            width: '100%',
          }}
        >
          <Tabs
            value={voteTab}
            onChange={(_, value) => {
              handleChangeVoteTab(value as VoteTab);
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 16,
              flex: 1,
            }}
            className={'gradient-card-border'}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                mb: 12,
                gap: 16,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 8,
                }}
              >
                <TabsGroup
                  tabs={tabs}
                  variant="rounded"
                  tabsListSx={{
                    justifyContent: 'space-between',
                    borderBottomWidth: 0,
                    border: `1px solid ${theme.palette.border.main}`,
                    borderRadius: 24,
                    flexShrink: 0,
                    width: isMobile ? '100%' : undefined,
                  }}
                  tabSx={{
                    flex: isMobile ? 1 : undefined,
                    mb: 0,
                    borderRadius: 0,
                    padding: '0 20px',
                    typography: 'body2',
                    fontWeight: 600,
                    '&.base--selected': {
                      backgroundColor: 'background.paperDarkContrast',
                    },
                  }}
                />
                <SearchInput
                  placeholder="Select by token"
                  sx={{
                    width: isMobile ? '100%' : undefined,
                    backgroundColor: theme.palette.background.paperDarkContrast,
                    borderRadius: 24,
                  }}
                  height={40}
                  value={filterToken}
                  onChange={(e) => {
                    setFilterToken(e.target.value);
                  }}
                />
              </Box>
              {isMobile && (
                <Box
                  sx={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: theme.palette.border.main,
                  }}
                />
              )}
              <Box
                sx={{
                  display: 'flex',
                  border: `1px solid ${theme.palette.border.main}`,
                  borderRadius: '24px',
                  height: 40,
                }}
              >
                {filters.map(({ key, value }, index) => {
                  return (
                    <Box
                      sx={{
                        flex: isMobile ? 1 : undefined,
                        height: 40,
                        backgroundColor:
                          key === votePoolFilter
                            ? 'rgba(81, 62, 43, 0.1)'
                            : 'transparent',
                        borderRadius:
                          index === 0
                            ? '24px 0 0 24px'
                            : index === filters.length - 1
                              ? '0 24px 24px 0'
                              : '0',
                        borderLeft:
                          index !== 0
                            ? `solid 1px ${theme.palette.border.main}`
                            : undefined,
                        display: 'flex',
                        padding: '0 20px',
                        alignItems: 'center',
                        cursor: 'pointer',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleChangeVotePoolFilter(key)}
                      key={key}
                    >
                      {value}
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <TabPanel
              value={VoteTab.SelectToVote}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {isMobile ? (
                <InfiniteScroll
                  hasMore={hasMore}
                  threshold={300}
                  loadMore={debounce(() => {
                    if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                      fetchResult.fetchNextPage();
                    }
                  }, 500)}
                  useWindow={false}
                  getScrollParent={() => scrollParentRef.current || null}
                  loader={<CardItem key="loader" />}
                >
                  <DataCardGroup>
                    <CardStatus
                      loading={fetchResult.isLoading}
                      refetch={
                        fetchResult.error ? fetchResult.refetch : undefined
                      }
                      empty={!poolList?.length}
                      hasSearch={hasSearch}
                      loadingCard={<CardItem />}
                    >
                      <CardList
                        poolList={poolList}
                        onSelectPool={onSelectPool}
                        selectedPoolList={selectedPoolIdList}
                        onAddIncentives={onAddIncentives}
                      />
                    </CardStatus>
                  </DataCardGroup>
                </InfiniteScroll>
              ) : (
                <CardStatus
                  loading={fetchResult.isLoading}
                  refetch={fetchResult.error ? fetchResult.refetch : undefined}
                  empty={!poolList?.length}
                  hasSearch={hasSearch}
                >
                  <TableList
                    chainId={chainId}
                    poolList={poolList}
                    hasMore={hasMore}
                    loadMoreLoading={fetchResult.isFetchingNextPage}
                    loadMore={() => {
                      if (fetchResult.hasNextPage && !fetchResult.isFetching) {
                        fetchResult.fetchNextPage();
                      }
                    }}
                    onSelectPool={onSelectPool}
                    selectedPoolList={selectedPoolIdList}
                    onAddIncentives={onAddIncentives}
                  />
                </CardStatus>
              )}
            </TabPanel>
            <TabPanel
              value={VoteTab.MyVoted}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {isMobile ? (
                <DataCardGroup>
                  <CardStatus
                    loading={fetchUserResult.isLoading}
                    refetch={
                      fetchUserResult.error
                        ? fetchUserResult.refetch
                        : undefined
                    }
                    empty={!userPoolList?.length}
                    hasSearch={hasSearch}
                    loadingCard={<CardItem />}
                  >
                    <CardList
                      poolList={userPoolList}
                      onSelectPool={onSelectPool}
                      selectedPoolList={selectedPoolIdList}
                      onAddIncentives={onAddIncentives}
                    />
                  </CardStatus>
                </DataCardGroup>
              ) : (
                <CardStatus
                  loading={fetchUserResult.isLoading}
                  refetch={
                    fetchUserResult.error ? fetchUserResult.refetch : undefined
                  }
                  empty={!userPoolList?.length}
                  hasSearch={hasSearch}
                >
                  <TableList
                    chainId={chainId}
                    poolList={userPoolList}
                    onSelectPool={onSelectPool}
                    selectedPoolList={selectedPoolIdList}
                    onAddIncentives={onAddIncentives}
                  />
                </CardStatus>
              )}
            </TabPanel>
          </Tabs>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'sticky',
          right: 0,
          bottom: 0,
          width: '100%',
          boxShadow: `0px -4px 16px 0px ${theme.palette.background.paperDarkContrast}`,
          borderRadius: '24px 24px 0 0',
          backgroundColor: theme.palette.background.paper,
          padding: '0 20px',
          ...(isMobile
            ? {
                pb: 20,
                maxHeight: foldFooter ? 64 : 900,
                transition: 'all 0.5s',
                flexShrink: 0,
                overflow: 'hidden',
              }
            : {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 120,
              }),
        }}
      >
        {isMobile && (
          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              py: 20,
              width: '100%',
              typography: 'body1',
              fontWeight: 600,
              borderBottomWidth: 1,
            }}
            onClick={() => {
              setFoldFooter((prev) => !prev);
              notUnFoldFooter.current = false;
            }}
          >
            {t`Total ${selectedPoolListLen}`}
            <Box
              component={ArrowRight}
              sx={{
                transform: foldFooter ? 'rotate(90deg)' : 'rotate(-90deg)',
                transition: 'all 0.5s',
              }}
            />
          </ButtonBase>
        )}
        <SelectLock
          chainId={chainId}
          account={account}
          selectedLock={selectedLock}
          setSelectedLock={setSelectedLock}
          fullWidth={isMobile}
        />
        <Box
          sx={{
            display: 'flex',
            gap: 8,
            mt: isMobile ? 20 : 0,
          }}
        >
          {!!selectedPoolListLen && (
            <Button
              variant={Button.Variant.second}
              onClick={() => setSelectedPoolList([])}
              sx={{
                flex: 1,
              }}
            >
              <Trans>Clear</Trans>
            </Button>
          )}
          <NeedConnectButton
            chainId={chainId}
            sx={{ flex: 1 }}
            disabled={!selectedLock || !selectedPoolListLen}
            onClick={() => setShowVoteDialog(true)}
          >
            {t`Vote`}
            {selectedPoolListLen ? `(${selectedPoolListLen})` : ''}
          </NeedConnectButton>
        </Box>
      </Box>
      <SetVotePowerDialog
        chainId={chainId}
        account={account}
        open={showVoteDialog}
        onClose={() => setShowVoteDialog(false)}
        data={selectedPoolList}
        lock={selectedLock}
        setLock={setSelectedLock}
        refetch={voteRefetch}
      />
    </WidgetContainer>
  );
};

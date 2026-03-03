import {
  Box,
  Button,
  ButtonBase,
  Input,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { Crowdpooling, CrowdpoolingTabType } from '../types';
import { Error, Plus, Search } from '@dodoex/icons';
import VoteTopList from './components/VoteTopList';
import { increaseArray } from '../../../utils/utils';
import BigNumber from 'bignumber.js';
import CPCard from './components/CPCard';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useQuery } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { cpGraphqlQuery } from '@dodoex/api';
import { ThegraphKeyMap } from '../../../constants/chains';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { formatCP } from '../helper';
import RiskQuestionDialog from '../../../components/RiskQuestionDialog';
import { useLingui } from '@lingui/react';
import {
  getRiskOncePageStoreageIsOpen,
  RiskOncePageLocalStorageKey,
  setRiskOncePageStoreageIsClose,
} from '../../../constants/localstorage';
import { isFavorite, useCPFavorites } from '../../../hooks/useCPFavorites';
import { CardStatus } from '../../../components/CardWidgets';

export enum TabType {
  ProjectCrowdpooling = 1,
  Favorites,
  Participating,
  History,
}

export default function CrowdpoolingList({
  params,
}: {
  params?: {
    tab?: CrowdpoolingTabType;
  };
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const { documentUrls, dappMetadata } = useUserOptions();
  const { queryChainId, account } = useWalletInfo();

  const [activeType, setActiveType] = useState(TabType.ProjectCrowdpooling);
  const [search, setSearch] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleTabChange = (_: any, value: TabType) => {
    setActiveType(value);

    // Scroll to active tab on mobile
    if (isMobile && tabsListRef.current) {
      setTimeout(() => {
        const activeTab = tabsListRef.current?.querySelector(
          '[aria-selected="true"]',
        ) as HTMLElement;
        if (activeTab) {
          activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }, 0);
    }
  };

  const graphqlRequests = useGraphQLRequests();
  const chain = queryChainId ? ThegraphKeyMap[queryChainId] : undefined;
  const fetchCpList = useQuery(
    graphqlRequests.getQuery(cpGraphqlQuery.fetchCPList, {
      first: 1000,
      where: {
        chain,
      },
    }),
  );
  const fetchUserBidPositions = useQuery({
    ...graphqlRequests.getQuery(cpGraphqlQuery.fetchBidPosition, {
      where: {
        user: account?.toLowerCase(),
      },
    }),
    enabled: !!account,
  });
  const { favorites } = useCPFavorites();
  const showCpList = useMemo(() => {
    const bidPositions = fetchUserBidPositions.data?.bidPositions;
    const cpList = formatCP({
      chainId: queryChainId,
      crowdpoolings: fetchCpList.data?.crowdPoolings ?? [],
      bidPositions,
    });

    if (search) {
      const searchLow = search.toLowerCase();
      return cpList.filter((cp) => cp.id.toLowerCase() === searchLow);
    }

    switch (activeType) {
      case TabType.ProjectCrowdpooling:
        return cpList;
      case TabType.Favorites:
        return cpList.filter((item) =>
          isFavorite(favorites, item.id, item.chainId),
        );
      case TabType.Participating:
      case TabType.History:
        if (!bidPositions?.length) return [];
        return cpList.filter((item) =>
          bidPositions.some((bp) => bp.cp.id === item.id),
        );
      default:
        return cpList;
    }
  }, [
    fetchCpList.data,
    fetchUserBidPositions.data,
    activeType,
    favorites,
    search,
  ]);

  const handleGotoDetail = (address: string, chainId: number) => {
    useRouterStore.getState().push({
      type: PageType.CrowdpoolingDetail,
      params: {
        address,
        chainId: chainId as any,
      },
    });
  };

  const hotList = [] as Crowdpooling[];

  const { i18n } = useLingui();
  const [riskId, setRiskId] = useState('');
  const onJoin = useCallback((detail: Crowdpooling) => {
    const isNotRisk = !getRiskOncePageStoreageIsOpen(
      RiskOncePageLocalStorageKey.CpJoinEntry,
      detail.id,
    );
    if (isNotRisk) {
      handleGotoDetail(detail.id, detail.chainId);
      return;
    }
    setRiskId(detail.id);
  }, []);
  const questionList = useMemo(() => {
    return [
      {
        desc: t`How can I tell if a token is fake?`,
        answers: [
          t`Look at the name of the token`,
          t`Check the token address with the project team's official accounts to confirm the address`,
          t`Follow your friends' suggestions`,
        ],
        rightAnswerIndex: 1,
      },
      {
        desc: t`Who is responsible to ensure that proper due diligence is done on any project in a Crowdpooling and accepts any potential loss?`,
        answers: [
          dappMetadata?.name || 'DEX',
          t`The Crowdpooling token project team`,
          t`Myself`,
        ],
        rightAnswerIndex: 2,
      },
      {
        desc: t`True or False: It is possible that when investing in any project that there is no guarantee on performance or return. Cryptocurrency projects are highly speculative in nature and returns are not guaranteed.`,
        answers: [t`False`, t`True`],
        rightAnswerIndex: 1,
      },
    ];
  }, [i18n._, dappMetadata?.name]);

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        ...(isMobile
          ? {
              p: 20,
            }
          : {}),
      }}
      ref={scrollParentRef}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          textAlign: 'center',
          [theme.breakpoints.up('tablet')]: {
            mx: 'auto',
            maxWidth: 576,
          },
        }}
      >
        <Box
          sx={{
            typography: {
              mobile: 'h4',
              tablet: 'h2',
            },
          }}
        >
          <Trans>
            Easy project fundraising options and equal access for users to
            participate in token launches.
          </Trans>
        </Box>
        {!!documentUrls?.crowdpoolingList && (
          <Box
            component="a"
            href={documentUrls?.crowdpoolingList}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              '&:hover': {
                opacity: 0.7,
              },
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 0H16C17.1 0 18 0.9 18 2V16C18 17.1 17.1 18 16 18H2C0.9 18 0 17.1 0 16V2C0 0.9 0.9 0 2 0ZM4 14H11V12H4V14ZM14 10H4V8H14V10ZM4 6H14V4H4V6Z"
                fill="currentColor"
              />
            </svg>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                typography: 'h6',
                fontWeight: 600,
              }}
            >
              <Trans>SEE HOW IT WORKS</Trans>
              <Box
                sx={{
                  display: 'block',
                  height: '1.5px',
                  backgroundColor: 'currentColor',
                  opacity: 0.5,
                  borderRadius: '0.75px',
                }}
              />
            </Box>
          </Box>
        )}
        <div>
          <Input
            fullWidth
            height={isMobile ? 48 : 70}
            placeholder={t`Search by token address or Crowdpooling address`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suffixGap={4}
            sx={{
              borderRadius: 16,
            }}
            suffix={
              <>
                {!!search && (
                  <ButtonBase
                    sx={{
                      mr: 8,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      flexShrink: 0,
                      backgroundColor:
                        theme.palette.background.paperDarkContrast,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                    onClick={() => setSearch('')}
                  >
                    <Box component={Error} sx={{ width: 16, height: 16 }} />
                  </ButtonBase>
                )}
                <Box
                  component={ButtonBase}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? 40 : 62,
                    height: isMobile ? 40 : 62,
                    borderRadius: isMobile ? 8 : 12,
                    backgroundColor: 'secondary.main',
                    color: theme.palette.secondary.contrastText,
                    flexShrink: 0,
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                >
                  <Box
                    component={Search}
                    width={isMobile ? 24 : 32}
                    height={isMobile ? 24 : 32}
                  />
                </Box>
              </>
            }
          />
          <Box sx={{ mt: 8, typography: 'h6', color: 'text.secondary' }}>
            <Box component="span" sx={{ color: 'error.main' }}>
              *
            </Box>
            <Trans>
              Please always double check the address, and beware of the risk of
              counterfeit tokens.Click to learn more.
            </Trans>
          </Box>
        </div>
      </Box>

      <Tabs value={activeType} onChange={handleTabChange}>
        {!search && (
          <>
            <VoteTopList cpList={hotList} />
            <Box ref={tabsListRef}>
              <TabsGroup
                variant="default"
                tabs={[
                  {
                    key: TabType.ProjectCrowdpooling,
                    value: t`Project Crowdpooling`,
                  },
                  { key: TabType.Favorites, value: t`Favorites` },
                  { key: TabType.Participating, value: t`Participating` },
                  {
                    key: TabType.History,
                    value: t`History`,
                  },
                ]}
                tabsListSx={{
                  justifyContent: 'space-between',
                  gap: 12,
                  mb: isMobile ? 12 : 28,
                  borderTop: `solid 1px ${theme.palette.border.main}`,
                  ...(isMobile
                    ? {
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        scrollbarWidth: 'none',
                      }
                    : {}),
                }}
                rightSlot={
                  !isMobile ? (
                    <Button
                      variant={Button.Variant.outlined}
                      onClick={() => {
                        useRouterStore.getState().push({
                          type: PageType.CreateCrowdpooling,
                        });
                      }}
                      sx={{
                        height: 38,
                        px: 8,
                        minWidth: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Box component={Plus} />
                      <Trans>Create Crowdpooling</Trans>
                    </Button>
                  ) : undefined
                }
              />
            </Box>
            {isMobile && (
              <Button
                variant={Button.Variant.outlined}
                onClick={() => {
                  useRouterStore.getState().push({
                    type: PageType.CreateCrowdpooling,
                  });
                }}
                sx={{
                  height: 38,
                  px: 8,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  mb: 28,
                }}
              >
                <Box component={Plus} />
                <Trans>Create Crowdpooling</Trans>
              </Button>
            )}
          </>
        )}

        <CardStatus
          loading={fetchCpList.isLoading || fetchUserBidPositions.isLoading}
          empty={!showCpList.length}
          refetch={fetchCpList.isError ? fetchCpList.refetch : undefined}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              [theme.breakpoints.up('tablet')]: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              },
            }}
          >
            {showCpList.map((data) => (
              <CPCard data={data} key={data.id} onJoin={onJoin} />
            ))}
          </Box>
        </CardStatus>
      </Tabs>
      <RiskQuestionDialog
        state={{
          open: !!riskId,
          onClose: () => setRiskId(''),
          onConfirm: () => {
            setRiskOncePageStoreageIsClose(
              RiskOncePageLocalStorageKey.CpJoinEntry,
              riskId,
            );
            setRiskId('');
          },
        }}
        questionList={questionList}
        alertContent={t`No information is provided by ${dappMetadata?.name} and its partners or its affiliates on its website, platforms, or any public publications that provide financial offers or advice regarding any investment products or services.
If you have any questions, please refer to our Terms of Service,obtain advice from an independent financial advisor, or do not proceed if you are not fully aware of the risks involved.
${dappMetadata?.name} and its partners and affiliates shall not be liable for any loss incurred by you in regard to your investment or transaction on the ${dappMetadata?.name} platform/services.`}
        onConfirm={() => {
          handleGotoDetail(riskId, queryChainId);
          setRiskId('');
        }}
      />
    </WidgetContainer>
  );
}

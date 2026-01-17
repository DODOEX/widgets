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
import React, { useCallback, useMemo, useState } from 'react';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { Crowdpooling, CrowdpoolingTabType } from '../types';
import { Plus, Search } from '@dodoex/icons';
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

export enum Filter {
  ByAddress = 'By Address',
  ByProject = 'By Project',
  All = 'All',
}

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
  const { documentUrls, dappMetadata } = useUserOptions();
  const { queryChainId } = useWalletInfo();

  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.ByAddress);
  const [activeType, setActiveType] = useState(TabType.ProjectCrowdpooling);
  const [search, setSearch] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

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
  const showCpList = useMemo(() => {
    const cpList = formatCP({
      chainId: queryChainId,
      crowdpoolings: fetchCpList.data?.crowdPoolings ?? [],
    });
    switch (activeType) {
      case TabType.ProjectCrowdpooling:
        return cpList;
      default:
        return cpList;
    }
  }, [fetchCpList.data, activeType]);

  const handleGotoDetail = (address: string, chainId: number) => {
    useRouterStore.getState().push({
      type: PageType.CrowdpoolingDetail,
      params: {
        address,
        chainId: chainId as any,
      },
    });
  };

  const hotList = increaseArray(5).map(
    (_, i) =>
      ({
        id: String(i),
        status: 'waiting',
        progress: 50,
        price: new BigNumber(23.53),
        baseToken: {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT',
          name: 'USDT',
          decimals: 6,
        },
        quoteToken: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          symbol: 'USDC',
          name: 'USDC',
          decimals: 6,
        },
      }) as Crowdpooling,
  );

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
        <Box sx={{ typography: 'h2' }}>
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
            height={70}
            placeholder={t`Search by token address or Crowdpooling address`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suffixGap={4}
            suffix={
              <Box
                component={ButtonBase}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 62,
                  height: 62,
                  borderRadius: 12,
                  backgroundColor: 'secondary.main',
                  flexShrink: 0,
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                <Box component={Search} width={32} height={32} />
              </Box>
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

      <VoteTopList cpList={hotList} />

      {/* Filter Bar with Create Button */}
      <Tabs value={activeType} onChange={(_, v) => setActiveType(v as TabType)}>
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
            mb: 28,
            borderTop: `solid 1px ${theme.palette.border.main}`,
            [theme.breakpoints.down('tablet')]: {
              flexDirection: 'column',
            },
          }}
          rightSlot={
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
          }
        />
        <Box
          sx={{
            display: 'grid',
            gap: 12,
            [theme.breakpoints.up('tablet')]: {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
          }}
        >
          {showCpList.map((data) => (
            <CPCard data={data} key={data.id} onJoin={onJoin} />
          ))}
        </Box>
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

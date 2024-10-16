import { Box, Button, TabPanel, Tabs, TabsGroup } from '@dodoex/components';
import { Plus as PlusIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useWeb3React } from '@web3-react/core';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { MiningTabType, MiningTopTabType } from '../types';
import { SearchComponents } from './components/SearchComponents';
import { useMiningList } from '../hooks/useMiningList';
import { useMyCreatedMiningList } from '../hooks/useMyCreatedMiningList';
import { ChainId } from '@dodoex/api';
import { isTestNet } from '../../../constants/chainList';
import { useMiningListContractDataMap } from '../hooks/useMiningListContractDataMap';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LoadingCard from '../../PoolWidget/PoolList/components/LoadingCard';
import { isJoinedOrStakedProcessing } from './utils';
import { useSubmission } from '../../../hooks/Submission';
import { MiningListEmpty } from './components/MiningListEmpty';
import { MyCreated } from './components/MyCreated';

function TabPanelFlexCol({ sx, ...props }: Parameters<typeof TabPanel>[0]) {
  return (
    <TabPanel
      {...props}
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    />
  );
}

export function MiningList({
  query,
  onClickCreate,
}: {
  query?: {
    mining?: string;
    address?: string;
  };
  onClickCreate?: () => void;
}) {
  const { isMobile } = useWidgetDevice();
  const { i18n } = useLingui();
  const { account, chainId: currentChainId } = useWeb3React();
  const { requests, updateText } = useSubmission();
  const { noDocumentLink, onlyChainId } = useUserOptions();

  const scrollParentRef = React.useRef<HTMLDivElement>();

  const [activeTopTab, setActiveTopTab] = useState<MiningTopTabType>('all');
  const [activeTab, setActiveTab] = useState<MiningTabType>('active');
  const [activeChainId, setActiveChainId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState<string>(() => {
    if (!query) {
      return '';
    }
    const miningParam = query.mining;
    const addressParam = query.address;
    return miningParam || addressParam || '';
  });
  const [operateId, setOperateId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'view' | null>(null);

  const debouncedUpdateSearchText = useMemo(() => {
    return debounce((v: string) => {
      setOperateId(null);
    }, 600);
  }, []);

  const tabs = useMemo<Array<{ key: MiningTopTabType; value: string }>>(
    () => [
      {
        key: 'all',
        value: i18n._(`All Mining`),
      },
      {
        key: 'staked',
        value: i18n._(`My Mining`),
      },
      { key: 'created', value: i18n._(`My Pools`) },
    ],
    [i18n],
  );

  const chainIds = useMemo(() => {
    if (activeChainId) {
      return [activeChainId];
    }

    const supportedChainIdList = Object.values(ChainId).filter(
      (chainId) => !!Number(chainId),
    ) as ChainId[];

    if (isTestNet(currentChainId as ChainId) && currentChainId) {
      return [...supportedChainIdList, currentChainId];
    }

    return supportedChainIdList;
  }, [activeChainId, currentChainId]);

  const { miningList, error, loading, refetch } = useMiningList({
    chainIds,
    isEnded: activeTab === 'ended',
    searchText,
    account,
  });

  const {
    contractDataMap,
    othersChainContractDataMap,
    loading: contractDataLoading,
    otherChinsLoading: othersContractDataLoading,
    refetch: refetchContractData,
  } = useMiningListContractDataMap({
    currentChainId,
    account,
    miningList,
  });

  const myCreatedMining = useMyCreatedMiningList({
    chainIds,
    searchText,
    account,
  });

  const content = useMemo(() => {
    let filteredMiningList = miningList;
    if (activeTopTab === null || activeTopTab === 'all') {
      if (loading) {
        return (
          <DataCardGroup gap={12} repeatBaseForLargeScreen={2}>
            <LoadingCard />
          </DataCardGroup>
        );
      }
    }

    if (activeTopTab === 'staked') {
      filteredMiningList = miningList.filter((miningItem) =>
        isJoinedOrStakedProcessing({
          miningItem,
          requests,
          contractDataMap,
          othersChainContractDataMap,
        }),
      );
    }

    if (filteredMiningList.length === 0) {
      let notFoundText = i18n._('No LP pools match your criteria');
      if (activeTopTab === 'staked') {
        notFoundText = i18n._(
          'You are not currently providing liquidity for any LP pools.',
        );
      }
      return (
        <MiningListEmpty notFoundText={notFoundText} hasSearch={!!searchText} />
      );
    }
    return (
      <DataCardGroup gap={12} repeatBaseForLargeScreen={2}>
        {filteredMiningList.map((miningItem) => {
          const { id, chainId } = miningItem;
          const contractData =
            chainId === currentChainId
              ? contractDataMap.get(id)
              : othersChainContractDataMap.get(id);
          // const contractData =
          //   contractDataMap.get(id) ?? othersChainContractDataMap.get(id);
          return <Box key={id}>{miningItem.name}</Box>;
        })}
      </DataCardGroup>
    );
  }, [
    activeTopTab,
    contractDataMap,
    currentChainId,
    i18n,
    loading,
    miningList,
    othersChainContractDataMap,
    requests,
    searchText,
  ]);

  return (
    <WidgetContainer
      sx={{
        ...(isMobile
          ? {
              p: 20,
            }
          : {
              display: 'flex',
              gap: 12,
              flex: 1,
              overflow: 'hidden',
            }),
      }}
      ref={scrollParentRef}
    >
      <Tabs
        value={activeTopTab}
        onChange={(_, value) => {
          if (value !== activeTopTab) {
            setOperateId(null);
          }
          setActiveTopTab(value as MiningTopTabType);
        }}
        sx={
          isMobile
            ? {}
            : {
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                backgroundColor: 'background.paper',
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
              }
        }
      >
        <Box
          sx={
            isMobile
              ? {}
              : {
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 20,
                  borderBottomWidth: 1,
                }
          }
        >
          <TabsGroup
            tabs={tabs}
            variant="rounded"
            tabsListSx={{
              justifyContent: 'space-between',
              ...(isMobile
                ? {
                    mb: 16,
                  }
                : {
                    borderBottomWidth: 0,
                  }),
            }}
            tabSx={
              isMobile
                ? undefined
                : {
                    mb: 0,
                  }
            }
          />
          <Button
            variant={Button.Variant.outlined}
            fullWidth={isMobile}
            onClick={onClickCreate}
            sx={{
              height: 40,
            }}
          >
            <Box
              component={PlusIcon}
              sx={{
                mr: 4,
              }}
            />
            <Trans>Create Liquidity Mining</Trans>
          </Button>
        </Box>

        <Box
          sx={{
            py: 16,
            display: 'flex',
            gap: 8,
            ...(isMobile
              ? {}
              : {
                  px: 20,
                  borderBottomWidth: 1,
                }),
          }}
        >
          <SearchComponents
            activeTopTab={activeTopTab}
            activeTab={activeTab}
            activeChainId={activeChainId}
            searchText={searchText}
            setActiveTab={setActiveTab}
            setActiveChainId={setActiveChainId}
            setSearchText={setSearchText}
            debouncedUpdateSearchText={debouncedUpdateSearchText}
            setOperateId={setOperateId}
          />
        </Box>

        <Box
          sx={{
            mt: {
              mobile: 16,
              tablet: 20,
            },
            mx: {
              mobile: 20,
              tablet: 0,
            },
          }}
        >
          {activeTopTab === 'created' ? (
            <MyCreated
              miningList={myCreatedMining.miningList}
              loading={myCreatedMining.loading}
              error={myCreatedMining.error}
              refetch={myCreatedMining.refetch}
              hasSearch={!!searchText}
            />
          ) : (
            content
          )}
        </Box>
      </Tabs>

      <Box
        sx={{
          position: 'relative',
          width: noDocumentLink ? 'auto' : 375,
        }}
      >
        operate
      </Box>
    </WidgetContainer>
  );
}

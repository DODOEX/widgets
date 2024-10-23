import { ChainId } from '@dodoex/api';
import { Box, Button, Tabs, TabsGroup } from '@dodoex/components';
import { Plus as PlusIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import { isTestNet } from '../../../constants/chainList';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../hooks/Submission';
import { useMiningList } from '../hooks/useMiningList';
import { useMiningListContractDataMap } from '../hooks/useMiningListContractDataMap';
import { useMyCreatedMiningList } from '../hooks/useMyCreatedMiningList';
import { MiningTabType, MiningTopTabType } from '../types';
import { MiningListEmpty } from './components/MiningListEmpty';
import { MiningListLoading } from './components/MiningListLoading';
import { SearchComponents } from './components/SearchComponents';
import { HowItWorksWrapper } from './components/widgets';
import { MiningContext } from './contexts';
import BaseMiningCard from './mining-types/BaseMiningCard';
import { MyCreated } from './my-created';
import {
  EARN_MINING_CREATE_AREA,
  EARN_MINING_OPERATE_AREA,
  isJoinedOrStakedProcessing,
} from './utils';

export function MiningList({
  query,
  handleGotoCreate,
  handleGotoDetail,
}: {
  query?: {
    mining?: string;
    address?: string;
  };
  handleGotoCreate?: () => void;
  handleGotoDetail: ({
    mining,
    pool,
    chainId,
  }: {
    mining: string;
    pool: string;
    chainId: number;
  }) => void;
}) {
  const { isMobile } = useWidgetDevice();
  const { i18n } = useLingui();
  const { account, chainId: currentChainId } = useWalletInfo();
  const { noDocumentLink, onlyChainId } = useUserOptions();
  const { requests, updateText } = useSubmission();

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

  const tabs = useMemo<
    Array<{ key: NonNullable<MiningTopTabType>; value: string }>
  >(
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
    if (onlyChainId) {
      return [onlyChainId];
    }

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
  }, [activeChainId, currentChainId, onlyChainId]);

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
            <MiningListLoading />
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
          return (
            <BaseMiningCard
              key={id}
              miningItem={miningItem}
              migrationItem={undefined}
              contractData={contractData}
              contractDataLoading={
                chainId === currentChainId
                  ? contractDataLoading
                  : othersContractDataLoading
              }
              handleGotoDetail={handleGotoDetail}
            />
          );
        })}
      </DataCardGroup>
    );
  }, [
    activeTopTab,
    contractDataLoading,
    contractDataMap,
    currentChainId,
    handleGotoDetail,
    i18n,
    loading,
    miningList,
    othersChainContractDataMap,
    othersContractDataLoading,
    requests,
    searchText,
  ]);

  return (
    <MiningContext.Provider
      value={{
        operateId,
        viewType,
        setOperateId,
        setViewType,
        refetchContractData,
      }}
    >
      <WidgetContainer
        sx={{
          ...(isMobile
            ? {
                p: 20,
              }
            : {
                display: 'flex',
                gap: 0,
                flex: 1,
                overflowY: 'unset',
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
                  borderRadius: 0,
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
                    pb: 20,
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
              onClick={handleGotoCreate}
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
              pt: 16,
              display: 'flex',
              gap: 8,
              ...(isMobile
                ? {}
                : {
                    px: 0,
                    borderBottomWidth: 0,
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
              mx: 0,
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

        <HowItWorksWrapper
          id={EARN_MINING_CREATE_AREA}
          sx={{
            display:
              activeTopTab === 'created' && operateId !== null
                ? 'block'
                : 'none',
          }}
        />

        <HowItWorksWrapper
          id={EARN_MINING_OPERATE_AREA}
          sx={{
            display:
              activeTopTab !== 'created' && operateId !== null
                ? 'block'
                : 'none',
          }}
        />
      </WidgetContainer>
    </MiningContext.Provider>
  );
}

import { MiningStatusE } from '@dodoex/api';
import { Box, Skeleton, useTheme } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import Dialog from '../../../components/Dialog';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useMiningItem } from '../hooks/useMiningItem';
import { useMiningListContractDataMap } from '../hooks/useMiningListContractDataMap';
import GoBack from '../MiningList/components/GoBack';
import { HowItWorksWrapper } from '../MiningList/components/widgets';
import { useMyStakedLoading } from '../MiningList/hooks/useMyStakedLoading';
import { useRewardTokenInfo } from '../MiningList/hooks/useRewardTokenInfo';
import { useStakedInfo } from '../MiningList/hooks/useStakedInfo';
import { useStatusAndStartBlockNumber } from '../MiningList/hooks/useStatusAndStartBlockNumber';
import { OperateArea } from '../MiningList/operate-area';
import {
  EARN_MINING_DETAIL_ID,
  generateMiningDetailUrl,
} from '../MiningList/utils';
import {
  CompositeMiningContractDataI,
  OperateType,
  TabMiningI,
} from '../types';
import { MiningInfo } from './MiningInfo';

export interface InnerMiningProps {
  contractData: CompositeMiningContractDataI | undefined;
  miningItem: TabMiningI;
  refetchContractData: () => void;
  handleGotoMiningList: () => void;
}

const InnerMining = ({
  contractData,
  miningItem,
  refetchContractData,
  handleGotoMiningList,
}: InnerMiningProps) => {
  const {
    stakeTokenAddress,
    chainId,
    name,
    type,
    id,
    miningMinings,
    miningTotalDollar,
  } = miningItem;

  const { isMobile } = useWidgetDevice();

  const { account, chainId: currentChainId } = useWalletInfo();

  const [operateType, setOperateType] = useState<OperateType>(
    isMobile ? null : 'stake',
  );
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const {
    rewardTokenWithAprListArray,
    totalAprList,
    rewardTokenWithAprTotalList,
    rewardTokenTrigger,
    totalRewardUSD,
  } = useRewardTokenInfo({
    miningItem,
    contractData,
  });

  const { status, miningStatusList } = useStatusAndStartBlockNumber({
    miningItem,
  });

  useEffect(() => {
    if (status === MiningStatusE.ended) {
      setOperateType('unstake');
    }
  }, [status]);

  const { stakedTokenWithAmountList, totalStakedTokenUSD } = useStakedInfo({
    miningItem,
    contractData,
  });

  const {
    lpTokenAccountStakedBalanceLoading,
    lpTokenAccountBalanceLoading,
    addLiquiditySuccessfulPair,
  } = useMyStakedLoading({
    id,
    stakeTokenAddress,
    miningMinings,
    contractData,
    refetchContractData,
  });

  const balanceDataMap = contractData?.balanceDataMap;

  const operateArea = useMemo(() => {
    return (
      <OperateArea
        operateType={operateType}
        setOperateType={setOperateType}
        miningItem={miningItem}
        totalRewardUSD={totalRewardUSD}
        stakedTokenUSD={totalStakedTokenUSD}
        rewardTokenList={rewardTokenWithAprTotalList}
        stakedTokenWithAmountList={stakedTokenWithAmountList}
        onClose={() => setOperateType(null)}
        setShareModalVisible={setShareModalVisible}
        refetchBalance={refetchContractData}
        refetchAfterClaim={refetchContractData}
        titleSectionVisible={isMobile}
        associatedMineSectionVisible
        associatedMineSectionShort
        sx={{
          mt: !isMobile ? 24 + 28 : 0,
        }}
        addLiquidityEnable={currentChainId === chainId && !!account}
        miningStatusList={miningStatusList}
        rewardTokenWithAprListArray={rewardTokenWithAprListArray}
        balanceDataMap={balanceDataMap}
        addLiquiditySuccessfulPair={addLiquiditySuccessfulPair}
        lpTokenAccountStakedBalanceLoading={lpTokenAccountStakedBalanceLoading}
        lpTokenAccountBalanceLoading={lpTokenAccountBalanceLoading}
      />
    );
  }, [
    account,
    addLiquiditySuccessfulPair,
    balanceDataMap,
    chainId,
    currentChainId,
    isMobile,
    lpTokenAccountBalanceLoading,
    lpTokenAccountStakedBalanceLoading,
    miningItem,
    miningStatusList,
    operateType,
    refetchContractData,
    rewardTokenWithAprListArray,
    rewardTokenWithAprTotalList,
    stakedTokenWithAmountList,
    totalRewardUSD,
    totalStakedTokenUSD,
  ]);

  return (
    <>
      {/* left side */}
      <Box
        sx={{
          flexGrow: 1,
        }}
        id={EARN_MINING_DETAIL_ID}
      >
        <MiningInfo
          status={status}
          onClose={() => handleGotoMiningList()}
          onClick={(type) => setOperateType(type)}
          setShareModalVisible={setShareModalVisible}
          stakedTokenList={stakedTokenWithAmountList}
          totalAprList={totalAprList}
          miningItem={miningItem}
          rewardTokenWithAprListArray={rewardTokenWithAprListArray}
        />
      </Box>

      {/* right side */}

      {isMobile ? (
        <Dialog open={operateType !== null} height="70vh">
          {operateArea}
        </Dialog>
      ) : (
        <HowItWorksWrapper>{operateArea}</HowItWorksWrapper>
      )}
    </>
  );
};

export function MiningDetail({
  query,
  handleGotoMiningList,
}: {
  query: {
    mining?: string;
    address?: string;
    chainId: number;
  };
  handleGotoMiningList: () => void;
}) {
  const theme = useTheme();
  const { account, chainId: currentChainId } = useWeb3React();
  const { isMobile } = useWidgetDevice();

  const { miningItem, error, loading, refetch } = useMiningItem({
    miningContractAddress: query?.mining,
    poolAddress: query?.address,
    account,
    chainId: query.chainId,
  });

  const miningList = useMemo(() => {
    if (!miningItem) {
      return [];
    }
    return [miningItem];
  }, [miningItem]);

  const {
    contractDataMap,
    othersChainContractDataMap,
    refetch: refetchContractData,
  } = useMiningListContractDataMap({
    currentChainId,
    account,
    miningList,
  });

  const contractData = useMemo<CompositeMiningContractDataI | undefined>(() => {
    if (!miningItem) {
      return undefined;
    }
    const { id, chainId } = miningItem;
    return chainId === currentChainId
      ? contractDataMap.get(id)
      : othersChainContractDataMap.get(id);
  }, [contractDataMap, currentChainId, miningItem, othersChainContractDataMap]);

  return (
    <WidgetContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            mobile: 'column',
            tablet: 'row',
          },
        }}
      >
        {!miningItem || loading ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                mx: 20,
                [theme.breakpoints.up('tablet')]: {
                  mx: 0,
                },
              }}
            >
              <GoBack
                onClick={() => {
                  handleGotoMiningList();
                }}
              />
              <Skeleton variant="rounded" width="100%" height={97} />
            </Box>

            {/* right side */}

            <HowItWorksWrapper>
              <Skeleton
                variant="rounded"
                width="100%"
                height={500}
                sx={{ mt: 28 + 24, borderRadius: 16 }}
              />
            </HowItWorksWrapper>
          </>
        ) : (
          <InnerMining
            contractData={contractData}
            miningItem={miningItem}
            refetchContractData={refetchContractData}
            handleGotoMiningList={handleGotoMiningList}
          />
        )}
      </Box>
    </WidgetContainer>
  );
}

import { Box } from '@dodoex/components';
import { memo, useContext } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import {
  CompositeMiningContractDataI,
  LiquidityMigrationInfo,
  TabMiningI,
} from '../../types';
import { APRSection, APRWrapper } from '../components/APRSection';
import { MiningCardLayout } from '../components/MiningCardLayout';
import { MiningTitle } from '../components/MiningTitle';
import { MyStakedSection } from '../components/MyStakedSection';
import { OperateButtonList } from '../components/OperateButtonList';
import { RewardsSection } from '../components/RewardsSection';
import { TVLSection } from '../components/TVLSection';
import { MiningContext } from '../contexts';
import { createPortalOrDialog } from '../dom';
import { useMyStakedLoading } from '../hooks/useMyStakedLoading';
import { useOperateHooks } from '../hooks/useOperateHooks';
import { useRewardTokenInfo } from '../hooks/useRewardTokenInfo';
import { useStakedInfo } from '../hooks/useStakedInfo';
import { useStatusAndStartBlockNumber } from '../hooks/useStatusAndStartBlockNumber';
import { OperateArea } from '../operate-area';
import { getDetailWrapperEle, getOperateAreaWrapperEle } from '../utils';

export default memo(function BaseMiningCard({
  contractData,
  miningItem,
  migrationItem,
  contractDataLoading,
  handleGotoDetail,
  handleGotoPoolDetail,
}: {
  contractData: CompositeMiningContractDataI | undefined;
  miningItem: TabMiningI;
  migrationItem: LiquidityMigrationInfo | undefined;
  contractDataLoading: boolean;
  handleGotoDetail: ({
    mining,
    pool,
    chainId,
  }: {
    mining: string;
    pool: string;
    chainId: number;
  }) => void;
  handleGotoPoolDetail: ({
    pool,
    chainId,
  }: {
    pool: string;
    chainId: number;
  }) => void;
}) {
  const {
    stakeTokenAddress,
    chainId,
    name,
    type,
    id,
    miningMinings,
    miningTotalDollar,
    isGSP,
  } = miningItem;
  const { operateId, viewType, refetchContractData } =
    useContext(MiningContext);
  const { isMobile } = useWidgetDevice();
  const { chainId: currentChainId, account } = useWalletInfo();

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

  const {
    shareModalVisible,
    setShareModalVisible,
    operateType,
    setOperateType,
    onClickOperateButton,
    onClickCard,
    onClickOnDetail,
    onCloseOnOperate,
    onCloseOnDetail,
  } = useOperateHooks({
    status,
    id,
    handleGotoDetail: () => {
      const mining = miningMinings[0].miningContractAddress;
      if (!mining) {
        return;
      }
      handleGotoDetail({
        mining,
        pool: stakeTokenAddress,
        chainId,
      });
    },
  });

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

  const operateAreaEle = getOperateAreaWrapperEle();
  const detailEle = getDetailWrapperEle();

  const gspPairRiskWarningVisible = isMobile
    ? false
    : viewType === 'view'
      ? isGSP
      : false;
  return (
    <>
      <MiningCardLayout
        headerLeft={
          <MiningTitle
            chainId={chainId}
            size="small"
            title={name}
            titleTypography="body2"
            tokenPairs={stakedTokenWithAmountList}
            rewardTokenList={rewardTokenWithAprTotalList}
            rewardTokenTrigger={rewardTokenTrigger}
            minRewardPopoverWidth="210px"
            type={type}
            setShareModalVisible={setShareModalVisible}
            stakeTokenAddress={stakeTokenAddress}
            miningContractAddress={miningMinings[0].miningContractAddress}
          />
        }
        headerRight={null}
        center={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RewardsSection
              chainId={chainId}
              isDataLoading={contractDataLoading}
              rewardTokenList={rewardTokenWithAprTotalList}
              totalRewardUSD={totalRewardUSD}
            />
            <MyStakedSection
              chainId={chainId}
              isDataLoading={contractDataLoading}
              stakedTokenList={stakedTokenWithAmountList}
              chainError={false}
              stakedTokenUSD={totalStakedTokenUSD}
              lpTokenAccountStakedBalanceLoading={
                lpTokenAccountStakedBalanceLoading[0] ||
                lpTokenAccountStakedBalanceLoading[1]
              }
              contractData={contractData}
              miningMinings={miningMinings}
            />
          </Box>
        }
        footer={
          <OperateButtonList
            operateType={operateId === id ? operateType : null}
            status={status}
            onClick={onClickOperateButton}
            migrationItem={migrationItem}
          />
        }
        onClick={onClickCard}
      >
        <APRWrapper>
          {totalAprList.map((apr, index) => {
            return (
              <>
                {index > 0 && <>&nbsp;/&nbsp;</>}
                <APRSection apr={apr} size="medium" />
              </>
            );
          })}
        </APRWrapper>

        <TVLSection miningTotalDollar={miningTotalDollar} />
      </MiningCardLayout>

      {createPortalOrDialog(
        <OperateArea
          operateType={operateType}
          setOperateType={setOperateType}
          miningItem={miningItem}
          totalRewardUSD={totalRewardUSD}
          stakedTokenUSD={totalStakedTokenUSD}
          rewardTokenList={rewardTokenWithAprTotalList}
          stakedTokenWithAmountList={stakedTokenWithAmountList}
          onClose={onCloseOnOperate}
          setShareModalVisible={setShareModalVisible}
          refetchBalance={refetchContractData}
          refetchAfterClaim={refetchContractData}
          titleSectionVisible={viewType === null || isMobile}
          associatedMineSectionVisible={viewType === 'view'}
          associatedMineSectionShort
          gspPairRiskWarningVisible={gspPairRiskWarningVisible}
          sx={{
            mt:
              !isMobile && viewType === 'view'
                ? (gspPairRiskWarningVisible ? 0 : 24) + 28
                : 0,
          }}
          addLiquidityEnable={currentChainId === chainId && !!account}
          miningStatusList={miningStatusList}
          rewardTokenWithAprListArray={rewardTokenWithAprListArray}
          balanceDataMap={balanceDataMap}
          addLiquiditySuccessfulPair={addLiquiditySuccessfulPair}
          lpTokenAccountStakedBalanceLoading={
            lpTokenAccountStakedBalanceLoading
          }
          lpTokenAccountBalanceLoading={lpTokenAccountBalanceLoading}
          externalAddLiquidityCallback={() => {
            handleGotoPoolDetail({ pool: stakeTokenAddress, chainId });
          }}
        />,
        operateAreaEle,
        isMobile,
        operateId === id && operateType !== null,
        operateId !== id && operateId !== null,
      )}
    </>
  );
});

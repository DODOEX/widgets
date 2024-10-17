import { MiningStatusE } from '@dodoex/api';
import { Box, Tabs, TabsButtonGroup, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { TokenInfo } from '../../../../hooks/Token/type';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import {
  MiningMiningI,
  MiningRewardTokenWithAprI,
  OperateDataProps,
  OperateType,
} from '../../types';
import { CloseButton } from '../components/CloseButton';
import { ShareModeSelect } from '../components/ShareModeSelect';
import { useDepositOrWithdrawOrClaim } from '../hooks/useDepositOrWithdrawOrClaim';
import { useGetLpLink } from '../hooks/useGetLpLink';
import { useHasUnclaimedReward } from '../hooks/useHasUnclaimedReward';
import { generateMiningDetailUrl } from '../utils';
import { AssociatedMine } from './AssociatedMine';
import { ClaimButton } from './ClaimButton';
import { InputArea } from './InputArea';
import { RewardListCard } from './RewardListCard';
import { StakeButton } from './StakeButton';
import { StakeTokenSelect } from './StakeTokenSelect';
import { UnstakeButton } from './UnstakeButton';
import { getOptToken } from './utils';
import { OperateButtonWrapper } from '../components/widgets';

export function OperateArea(props: OperateDataProps) {
  const {
    operateType,
    setOperateType,
    miningItem: {
      chainId,
      version,
      type,
      stakeTokenAddress,
      lpTokenPlatformID,
      source,
      name,
      id,
      miningMinings,
      isGSP,
    },
    totalRewardUSD,
    stakedTokenUSD,
    rewardTokenList,
    stakedTokenWithAmountList,
    onClose,
    setShareModalVisible,
    refetchBalance,
    refetchAfterClaim,
    titleSectionVisible,
    associatedMineSectionVisible,
    associatedMineSectionShort,
    sx,
    addLiquidityEnable,
    externalAddLiquidityCallback,
    miningStatusList,
    rewardTokenWithAprListArray,
    balanceDataMap,
    addLiquiditySuccessfulPair,
    gspPairRiskWarningVisible,
  } = props;

  const theme = useTheme();

  const { chainId: currentChainId, account } = useWeb3React();

  const isInCurrentChain = currentChainId === chainId;
  const skipApprove =
    type === 'vdodo' || operateType !== 'stake' || !isInCurrentChain;

  const [selectedStakeTokenIndex, setSelectedStakeTokenIndex] =
    useState<0 | 1>(0);
  const [currentStakeTokenAmount, setCurrentStakeTokenAmount] = useState('');
  const [currentUnstakeTokenAmount, setCurrentUnstakeTokenAmount] =
    useState('');

  const miningMining = miningMinings[selectedStakeTokenIndex] as MiningMiningI;
  const { miningContractAddress, lpToken } = miningMining;
  const lpTokenAccountBalanceLoading =
    props.lpTokenAccountBalanceLoading[selectedStakeTokenIndex];
  const lpTokenAccountStakedBalanceLoading =
    props.lpTokenAccountStakedBalanceLoading[selectedStakeTokenIndex];
  const addLiquiditySuccessful =
    addLiquiditySuccessfulPair[selectedStakeTokenIndex];
  const { status: lpTokenStatus, firstStartTime } = miningStatusList[
    selectedStakeTokenIndex
  ] as {
    status: MiningStatusE;
    firstStartTime: BigNumber | undefined;
  };
  const rewardTokenWithAprList = rewardTokenWithAprListArray[
    selectedStakeTokenIndex
  ] as MiningRewardTokenWithAprI[];
  const balanceData = balanceDataMap?.get(miningMining.id);
  const { lpTokenAccountBalance, lpTokenAccountStakedBalance } =
    balanceData ?? {
      lpTokenAccountBalance: undefined,
      lpTokenAccountStakedBalance: undefined,
    };

  const optToken = getOptToken({
    stakedTokenList: stakedTokenWithAmountList,
    type,
    selectedStakeTokenIndex,
    lpToken,
  });

  // 将 lpToken 授权给挖矿合约
  const approveToken =
    optToken.address && optToken.decimals !== undefined && isInCurrentChain
      ? (optToken as TokenInfo)
      : null;

  const approveTokenStatus = useTokenStatus(approveToken, {
    contractAddress: miningContractAddress,
    overrideBalance: lpTokenAccountBalance,
    amount: currentStakeTokenAmount,
  });
  const { submitApprove, isApproving, isGetApproveLoading, needApprove } =
    approveTokenStatus;

  const addLiquidityCallback = useCallback(() => {
    if (externalAddLiquidityCallback) {
      externalAddLiquidityCallback();
      return;
    }

    if (!addLiquidityEnable) {
      return;
    }

    // setAddLiquidityMode(true);
  }, [addLiquidityEnable, externalAddLiquidityCallback]);

  const goLpLink = useGetLpLink({
    chainId,
    lpTokenPlatformID,
    type,
    addLiquidityCallback,
    stakedTokenWithAmountList,
  });

  const { depositOrWithdrawOrClaimMutation } = useDepositOrWithdrawOrClaim({
    version,
    miningContractAddress,
    stakeTokenAddress,
    id,
    source,
    lpTokenAccountStakedBalance,
    selectedStakeTokenIndex,
    operateType,
    lpToken,
    stakeSuccessCallback: () => {
      setCurrentStakeTokenAmount('');
      refetchBalance();
    },
    unstakeSuccessCallback: () => {
      setCurrentUnstakeTokenAmount('');
      refetchBalance();
    },
    claimSuccessCallback: () => {
      refetchAfterClaim();
    },
  });

  const hasUnclaimedReward = useHasUnclaimedReward({
    rewardTokenWithAprList,
  });

  const tabList = useMemo(() => {
    return [
      {
        key: 'stake',
        value: t`Stake`,
      },
      {
        key: 'unstake',
        value: t`Unstake`,
      },
      {
        key: 'claim',
        value: t`Claim`,
      },
    ];
  }, []);

  const hasLp = true;
  const hasNotLp = false;
  const hasLpForNewUser = false;

  return (
    <>
      {titleSectionVisible && (
        <Box
          sx={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: theme.palette.background.paper,
            px: 20,
            py: 20,
            position: 'sticky',
            top: 0,
            zIndex: 3,
            ...sx,
          }}
        >
          <Box
            sx={{
              typography: 'h5',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {name}
            {isGSP && null}
            <CloseButton onClick={onClose} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              gap: 4,
            }}
          >
            <AddressWithLinkAndCopy
              size="small"
              truncate
              address={miningContractAddress ?? ''}
              iconSpace={4}
              sx={{
                color: theme.palette.text.secondary,
              }}
              customChainId={chainId}
            />

            <ShareModeSelect
              shareUrl={generateMiningDetailUrl({
                chainId,
                miningContractAddress: miningContractAddress,
                stakeTokenAddress,
              })}
            />
          </Box>
        </Box>
      )}

      {gspPairRiskWarningVisible && null}

      <Box
        sx={
          titleSectionVisible
            ? {
                backgroundColor: theme.palette.background.paper,
                px: 20,
                paddingBottom: hasNotLp || hasLpForNewUser ? 20 : 0,
                borderBottomLeftRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
                borderBottomRightRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
              }
            : {
                paddingTop: 20,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: theme.palette.background.paper,
                px: 20,
                paddingBottom: hasNotLp || hasLpForNewUser ? 20 : 0,
                borderBottomLeftRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
                borderBottomRightRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
                ...sx,
              }
        }
      >
        {associatedMineSectionVisible && (
          <AssociatedMine
            chainId={chainId}
            miningContractAddress={miningContractAddress}
            miningTitle={name}
            totalRewardUSD={totalRewardUSD}
            stakedTokenUSD={stakedTokenUSD}
            rewardTokenList={rewardTokenList}
            stakedTokenWithAmountList={stakedTokenWithAmountList}
            lpTokenStatus={lpTokenStatus}
            associatedMineSectionShort={associatedMineSectionShort}
          />
        )}

        <Tabs
          value={operateType}
          onChange={(_, value) => {
            setOperateType(value as OperateType);
          }}
        >
          <TabsButtonGroup
            tabs={tabList}
            variant="inPaper"
            tabsListSx={{
              mt: 0,
            }}
          />
        </Tabs>

        <StakeTokenSelect
          type={type}
          operateType={operateType}
          stakedTokenWithAmountList={stakedTokenWithAmountList}
          selectedStakeTokenIndex={selectedStakeTokenIndex}
          setSelectedStakeTokenIndex={setSelectedStakeTokenIndex}
          goLpLink={isInCurrentChain && !!account ? goLpLink : undefined}
          miningMinings={miningMinings}
          customChainId={chainId}
        />
      </Box>

      {operateType === 'stake' && (
        <>
          {(hasLp || hasLpForNewUser) && (
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                pt: 20,
                px: 20,
              }}
            >
              <InputArea
                operateType="stake"
                type={type}
                lpToken={lpToken}
                lpTokenBalance={lpTokenAccountBalance}
                currentTokenAmount={currentStakeTokenAmount}
                setCurrentTokenAmount={setCurrentStakeTokenAmount}
                needApprove={needApprove}
                readOnly={lpTokenStatus === MiningStatusE.ended}
                lpTokenBalanceLoading={
                  lpTokenAccountBalanceLoading ||
                  lpTokenAccountStakedBalanceLoading
                }
              />
            </Box>
          )}
        </>
      )}

      {operateType === 'unstake' && (
        <Box
          sx={{
            pt: 20,
            px: 20,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <InputArea
            operateType="unstake"
            type={type}
            lpToken={lpToken}
            lpTokenBalance={lpTokenAccountStakedBalance}
            currentTokenAmount={
              lpTokenStatus === MiningStatusE.ended
                ? lpTokenAccountStakedBalance?.toString() ?? ''
                : currentUnstakeTokenAmount
            }
            setCurrentTokenAmount={setCurrentUnstakeTokenAmount}
            readOnly={lpTokenStatus === MiningStatusE.ended}
            lpTokenBalanceLoading={lpTokenAccountStakedBalanceLoading}
            needApprove={false}
          />
        </Box>
      )}

      {operateType === 'claim' && (
        <Box
          sx={{
            pt: 20,
            px: 20,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <RewardListCard
            rewardTokenWithAprList={rewardTokenWithAprList}
            customChainId={chainId}
          />
        </Box>
      )}

      {operateType === 'stake' && (hasLp || hasLpForNewUser) && (
        <OperateButtonWrapper>
          <StakeButton
            miningContractAddress={miningContractAddress}
            id={id}
            firstStartTime={firstStartTime}
            depositOrWithdrawOrClaimMutation={depositOrWithdrawOrClaimMutation}
            lpTokenStatus={lpTokenStatus}
            currentTokenAmount={currentStakeTokenAmount}
            submitApprove={submitApprove}
            goLpLink={goLpLink}
            optToken={optToken}
            approveTokenStatus={approveTokenStatus}
            isApproving={isApproving}
            isGetApproveLoading={isGetApproveLoading}
            lpTokenAccountBalance={lpTokenAccountBalance}
            source={source}
            version={version}
            chainId={chainId}
            currentChainId={currentChainId}
            lpTokenBalanceLoading={
              lpTokenAccountBalanceLoading || lpTokenAccountStakedBalanceLoading
            }
          />
        </OperateButtonWrapper>
      )}

      {operateType === 'unstake' && (
        <OperateButtonWrapper sx={undefined}>
          <UnstakeButton
            id={id}
            version={version}
            depositOrWithdrawOrClaimMutation={depositOrWithdrawOrClaimMutation}
            lpTokenStatus={lpTokenStatus}
            lpTokenAccountStakedBalance={lpTokenAccountStakedBalance}
            currentTokenAmount={currentUnstakeTokenAmount}
            chainId={chainId}
            currentChainId={currentChainId}
            lpTokenBalanceLoading={lpTokenAccountStakedBalanceLoading}
          />
        </OperateButtonWrapper>
      )}

      {operateType === 'claim' && (
        <OperateButtonWrapper>
          <ClaimButton
            id={id}
            hasUnclaimedReward={hasUnclaimedReward}
            depositOrWithdrawOrClaimMutation={depositOrWithdrawOrClaimMutation}
            chainId={chainId}
            currentChainId={currentChainId}
          />
        </OperateButtonWrapper>
      )}
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { miningApi } from '../helper';
import { MiningRewardTokenI, ReviewedMiningRewardTokenI } from '../types';
import { getV3MiningSingleRewardAmount } from './helper';
import { useMiningBlockNumber } from './useMiningBlockNumber';
import { getTimeByPreBlock } from './utils';

export function useReviewRewardToken({
  chainId,
  index,
  miningContractAddress,
  rewardToken,
  skip = false,
}: {
  chainId: number;
  index: number;
  miningContractAddress: string | undefined;
  rewardToken: MiningRewardTokenI;
  skip?: Boolean;
}) {
  const { chainId: currentChainId } = useWalletInfo();
  const inCurrentChain = chainId === currentChainId;

  const { blockNumber, blockTime } = useMiningBlockNumber(
    chainId,
    rewardToken.blockNumber,
  );

  const rewardTokenInfoQuery = useQuery(
    miningApi.getRewardTokenInfos(chainId, miningContractAddress, index, skip),
  );

  const reviewedRewardToken = useMemo<ReviewedMiningRewardTokenI>(() => {
    if (!rewardTokenInfoQuery.data) {
      return {
        ...rewardToken,
        workThroughReward: undefined,
        lastFlagBlock: undefined,
        rewardVault: undefined,
      };
    }

    const { rewardVault, rewardPerBlock, workThroughReward, lastFlagBlock } =
      rewardTokenInfoQuery.data;

    const startBlock = rewardTokenInfoQuery.data.startBlock
      ? new BigNumber(rewardTokenInfoQuery.data.startBlock)
      : rewardToken.startBlock;
    const endBlock = rewardTokenInfoQuery.data.endBlock
      ? new BigNumber(rewardTokenInfoQuery.data.endBlock)
      : rewardToken.endBlock;

    let endTime = rewardToken.endTime;
    if (
      endBlock &&
      rewardToken.endBlock &&
      !endBlock.isEqualTo(rewardToken.endBlock)
    ) {
      endTime = new BigNumber(
        getTimeByPreBlock(blockTime, blockNumber, endBlock).unix(),
      );
    }

    return {
      rewardVault,
      rewardPerBlock: rewardPerBlock
        ? new BigNumber(rewardPerBlock).div(`1e${rewardToken.decimals}`)
        : rewardToken.rewardPerBlock,
      startBlock,
      endBlock,
      startTime: rewardToken.startTime,
      endTime,
      workThroughReward: workThroughReward
        ? new BigNumber(workThroughReward).div(`1e${rewardToken.decimals}`)
        : undefined,
      lastFlagBlock: lastFlagBlock ? new BigNumber(lastFlagBlock) : undefined,
    };
  }, [blockNumber, blockTime, rewardToken, rewardTokenInfoQuery.data]);

  const rewardAmount = useMemo(() => {
    return getV3MiningSingleRewardAmount(
      reviewedRewardToken,
      blockNumber,
      blockTime,
      rewardToken.decimals,
    );
  }, [blockNumber, blockTime, reviewedRewardToken, rewardToken.decimals]);

  return {
    inCurrentChain,
    blockNumber,
    blockTime,
    reviewedRewardToken,
    rewardAmount,
  };
}

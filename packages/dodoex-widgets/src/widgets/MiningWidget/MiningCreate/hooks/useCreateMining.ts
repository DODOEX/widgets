import { MiningApi } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import { t } from '@lingui/macro';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useReducer } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { TokenInfo } from '../../../../hooks/Token';
import { useMiningBlockNumber } from '../../hooks/useMiningBlockNumber';
import { getPreBlock } from '../../hooks/utils';
import { LpTokenPlatformID } from '../../types';
import { init, reducer, TokenType, Types } from './reducers';
import { useDefaultStakeToken } from './useDefaultStakeToken';

type RewardTokenT = {
  rewardToken: string;
  rewardPerBlock: string;
  startBlock: number;
  endBlock: number;
};

export const useCreateMining = ({
  submittedBack,
  handleGotoMiningList,
}: {
  submittedBack?: () => void;
  handleGotoMiningList?: () => void;
} = {}) => {
  const { chainId } = useWalletInfo();
  const submission = useSubmission();

  const [state, dispatch] = useReducer(reducer, init());

  useDefaultStakeToken({
    setStakeToken: (token: TokenInfo) => {
      dispatch({
        type: Types.updateSaveAToken,
        payload: token,
      });
    },
  });

  const { blockNumber, blockTime } = useMiningBlockNumber(chainId, undefined);

  const createMutation = useMutation({
    mutationFn: async (platformID?: LpTokenPlatformID) => {
      const { tokenType, pool, saveAToken, rewards } = state;

      const isLpToken = tokenType === TokenType.LP;
      const stateToken = isLpToken ? pool?.id : saveAToken?.address;

      if (!stateToken) {
        return;
      }

      const checkStartTime = dayjs().add(5, 'm');
      const checkStartBlock = getPreBlock(
        blockTime,
        blockNumber,
        checkStartTime.valueOf(),
      );

      const rewardTokens = rewards
        .map((r) => {
          const { token, total, startTime, endTime } = r;

          if (!token || !total || !startTime || !endTime) {
            return null;
          }

          const totalBN = new BigNumber(total);
          const startTimeBN = new BigNumber(startTime);
          const endTimeBN = new BigNumber(endTime);

          let startBlock = getPreBlock(
            blockTime,
            blockNumber,
            startTimeBN.toNumber(),
          );
          let endBlock = getPreBlock(
            blockTime,
            blockNumber,
            endTimeBN.toNumber(),
          );

          if (startBlock.isFinite() && startBlock.lte(checkStartBlock)) {
            const newEndTime = endTimeBN
              .minus(startTimeBN)
              .plus(checkStartTime.valueOf());
            startBlock = checkStartBlock;
            endBlock = getPreBlock(
              blockTime,
              blockNumber,
              newEndTime.toNumber(),
            );
          }

          return {
            rewardToken: token.address,
            rewardPerBlock: parseFixed(
              totalBN
                .div(endBlock.minus(startBlock))
                .dp(token.decimals, BigNumber.ROUND_DOWN)
                .toString(),
              token.decimals,
            ).toString(),
            startBlock: startBlock.toNumber(),
            endBlock: endBlock.toNumber(),
          };
        })
        .filter((r) => r !== null) as Array<RewardTokenT>;

      const params: Parameters<typeof MiningApi.encode.createDODOMineV3> = [
        chainId,
        stateToken,
        isLpToken,
        platformID ?? 0,
        rewardTokens.map((reward) => reward.rewardToken),
        rewardTokens.map((reward) => reward.rewardPerBlock),
        rewardTokens.map((reward) => reward.startBlock),
        rewardTokens.map((reward) => reward.endBlock),
      ];
      const data = await MiningApi.encode.createDODOMineV3(...params);
      if (!data) {
        return;
      }

      await submission.execute(
        t`Create Liquidity Mining`,
        {
          opcode: OpCode.TX,
          value: 0,
          ...data,
        },
        {
          metadata: {
            [MetadataFlag.submissionCreateMetaKey]: true,
          },
          submittedBack,
          successBack() {
            handleGotoMiningList?.();
          },
        },
      );
    },
    onSettled() {
      dispatch({
        type: Types.SetConfirmModalVisible,
        payload: false,
      });
    },
  });

  return {
    state,
    dispatch,
    createMutation,
    blockNumber,
    blockTime,
  };
};

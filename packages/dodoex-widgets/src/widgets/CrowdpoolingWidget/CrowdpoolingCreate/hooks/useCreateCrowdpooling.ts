import { t } from '@lingui/macro';
import {
  encodeDODOCpProxyCreateCrowdPooling,
  encodeDODOCpProxyWithoutGlobalQuotaCreateCrowdPooling,
  getDODOCpProxyContractAddressByChainId,
  getDODOCpProxyWithoutGlobalQuotaContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { StateProps } from '../reducers';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { useMessageState } from '../../../../hooks/useMessageState';
import { getAddress } from '@ethersproject/address';
import { hexStripZeros } from '@ethersproject/bytes';

export function useCreateCrodpooling({
  state,
  successBack,
  submittedBack,
}: {
  state: StateProps;
  successBack?: () => void;
  submittedBack?: () => void;
}) {
  const { chainId, account } = useWeb3React();
  const submission = useSubmission();

  return useMutation({
    mutationFn: async () => {
      const { priceSettings, timeSettings, optionalSettings, introSettings } =
        state;
      const { baseToken, quoteToken } = priceSettings;
      if (!baseToken || !quoteToken) {
        throw new Error('params is not valid.');
      }
      const to = getDODOCpProxyContractAddressByChainId(baseToken.chainId);
      const toWithoutGlobalQuote =
        getDODOCpProxyWithoutGlobalQuotaContractAddressByChainId(
          baseToken.chainId,
        );
      let data = '';
      const baseInAmountBg = new BigNumber(priceSettings.baseTokenAmount)
        .dp(baseToken.decimals, BigNumber.ROUND_DOWN)
        .times(10 ** baseToken.decimals);
      const baseInAmount = baseInAmountBg.toString();
      const bidStartTime = Math.ceil(timeSettings.bidStartTime! / 1000);
      const bidEndTime = Math.ceil(timeSettings.bidEndTime! / 1000);
      const bidDuration = bidEndTime - bidStartTime;
      const freezeDuration = new BigNumber(timeSettings.freezeDuration)
        .multipliedBy(24 * 60 * 60)
        .toNumber();
      const tokenFreezeDuration =
        optionalSettings.delayClaim && optionalSettings.claimStartTime
          ? new BigNumber(optionalSettings.claimStartTime)
              .times(24 * 60 * 60)
              .toNumber()
          : 0;
      const tokenVestingDuration =
        optionalSettings.delayClaim && optionalSettings.freeCycle
          ? new BigNumber(optionalSettings.freeCycle)
              .times(24 * 60 * 60)
              .toNumber()
          : 0;
      // https://github.com/DODOEX/contractV2/blob/main/contracts/Factory/CrowdPoolingFactory.sol#L59
      const calmDuration = 0;
      const vestingDuration = 0;
      const cliffRate = '1000000000000000000';
      const isOpenTWAR = false;
      const isOverCapStop = !optionalSettings.overflowLimit;
      const k = 0;
      const iDecimals = 18 - baseToken.decimals + quoteToken.decimals;
      const i = new BigNumber(priceSettings.price!)
        .dp(iDecimals, BigNumber.ROUND_DOWN)
        .times(10 ** iDecimals)
        .toString();
      const quoteCap = new BigNumber(priceSettings.baseTokenAmount)
        .multipliedBy(priceSettings.price!)
        .multipliedBy(priceSettings.salesRatio!)
        .div(100)
        .dp(quoteToken.decimals, BigNumber.ROUND_DOWN)
        .times(10 ** quoteToken.decimals)
        .toString();
      const tokenCliffRate = optionalSettings.initClaimRate
        ? new BigNumber(optionalSettings.initClaimRate)
            .div(100)
            .times(10 ** 18)
            .dp(0, BigNumber.ROUND_DOWN)
            .toString()
        : '0';
      const lpFeeRate = optionalSettings.poolFeeRate
        ? new BigNumber(optionalSettings.poolFeeRate)
            .div(100)
            .times(10 ** 18)
            .dp(0, BigNumber.ROUND_DOWN)
            .toString()
        : '0';

      try {
        if (toWithoutGlobalQuote) {
          data = encodeDODOCpProxyWithoutGlobalQuotaCreateCrowdPooling(
            baseToken.address,
            quoteToken.address,
            baseInAmount,
            [
              bidStartTime,
              bidDuration,
              calmDuration,
              freezeDuration,
              vestingDuration,
              tokenFreezeDuration,
              tokenVestingDuration,
            ],
            [quoteCap, String(k), i, cliffRate, tokenCliffRate, lpFeeRate],
            [isOverCapStop, isOpenTWAR],
            bidEndTime,
          );
        } else {
          const globalQuota =
            optionalSettings.isHardCap && optionalSettings.hardCapPricePerUser
              ? new BigNumber(optionalSettings.hardCapPricePerUser)
                  .dp(quoteToken.decimals, BigNumber.ROUND_DOWN)
                  .times(10 ** quoteToken.decimals)
                  .toNumber()
              : -1;
          data = encodeDODOCpProxyCreateCrowdPooling(
            baseToken.address,
            quoteToken.address,
            baseInAmount,
            [
              bidStartTime,
              bidDuration,
              calmDuration,
              freezeDuration,
              vestingDuration,
              tokenFreezeDuration,
              tokenVestingDuration,
            ],
            [quoteCap, String(k), i, cliffRate, tokenCliffRate, lpFeeRate],
            [isOverCapStop, isOpenTWAR],
            bidEndTime,
            globalQuota,
          );
        }

        if (!account || !chainId) {
          throw new Error('Wallet is not connected');
        }

        const contractAddress = toWithoutGlobalQuote || to;
        if (!contractAddress) {
          throw new Error('Contract address not found');
        }

        // https://github.com/DODOEX/contractV2/blob/2f1bcdac7ef1beee7599a756e2eed26732c2536d/contracts/CrowdPooling/impl/CPStorage.sol#L24
        // https://github.com/DODOEX/contractV2/blob/2f1bcdac7ef1beee7599a756e2eed26732c2536d/contracts/CrowdPooling/impl/CP.sol#L111
        let settleFund = 0.2;
        if (
          [
            42161, 10, 59144, 8453, 534352, 169, 5000, 53457, 48899, 200901,
            48900, 196, 988,
          ].includes(chainId)
        ) {
          settleFund = 0.02;
        }
        let value = '0';
        const basicToken = basicTokenMap[baseToken.chainId as ChainId];
        if (
          baseToken.symbol.toLowerCase() === basicToken?.address?.toLowerCase()
        ) {
          value = baseInAmountBg
            .plus(new BigNumber(settleFund).times(10 ** baseToken.decimals))
            .toString();
        } else {
          value = new BigNumber(settleFund)
            .times(10 ** basicToken.decimals)
            .toString();
        }

        let cpAddress = '';
        await submission.execute(
          t`Create Crowdpooling`,
          {
            opcode: OpCode.TX,
            to: contractAddress,
            data,
            value,
          },
          {
            metadata: {
              [MetadataFlag.createCrowdpooling]: true,
            },
            submittedBack,
            async successBack(_, __, { receipt }) {
              const logs = receipt.logs;
              const address = logs[0]?.topics?.[2];
              cpAddress = getAddress(hexStripZeros(address));
              successBack?.();
            },
          },
        );

        return cpAddress;
      } catch (error) {
        useMessageState.getState().toast({
          message: `${error}`,
          type: 'error',
        });
      }
    },
  });
}

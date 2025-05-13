import { useMutation } from '@tanstack/react-query';
import { basicTokenMap, ChainId } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  encodeVE33V2RouterAddLiquidity,
  encodeVE33V2RouterAddLiquidityETH,
} from '@dodoex/dodo-contract-request';
import { TokenInfo } from '../../../../hooks/Token';
import { useSubmission } from '../../../../hooks/Submission';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { toWei } from '../../../../utils';
import { NumberToHex } from '../../../../utils/bytes';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useMessageState } from '../../../../hooks/useMessageState';

export function useVe33AddLiquidity({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  slippage,
  stable,
  fee,
  successBack,
  submittedBack,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  slippage: number;
  stable: boolean;
  fee: number | undefined;
  successBack?: () => void;
  submittedBack?: () => void;
}) {
  const submission = useSubmission();
  const { account } = useWalletInfo();
  useLingui();

  const { deadLine: ddl } = useUserOptions();
  return useMutation({
    mutationFn: async () => {
      if (!baseToken || !quoteToken) {
        throw new Error('token is undefined');
      }
      if (!account) {
        throw new Error('account is undefined');
      }
      if (!fee) {
        throw new Error('fee is undefined');
      }
      const chainId = baseToken.chainId as ChainId;
      const basicToken = basicTokenMap[chainId];
      const basicTokenAddressLow = basicToken.address.toLowerCase();
      // const dynamicFeeContractAddress =
      //   getUniswapV2Router02ContractAddressByChainId(chainId);
      // const fixedFeeContractAddress =
      //   getUniswapV2Router02FixedFeeContractAddressByChainId(chainId);
      // const to = dynamicFeeContractAddress || fixedFeeContractAddress;
      const to = '0x468e60B84b11B3B1532D7C41FcBb79DA352aa12d';
      if (!to) {
        throw new Error('Ve33 V2 contract address is not valid.');
      }
      let data = '';
      let value = '0x0';
      const baseIsETH =
        baseToken.address.toLowerCase() === basicTokenAddressLow;
      const quoteIsETH =
        quoteToken.address.toLowerCase() === basicTokenAddressLow;
      const baseInAmountBg = toWei(baseAmount, baseToken.decimals);
      const quoteInAmountBg = toWei(quoteAmount, quoteToken.decimals);
      const baseInAmountMinBg = baseInAmountBg
        .times(1 - slippage)
        .dp(0, BigNumber.ROUND_FLOOR);
      const quoteInAmountMinBg = quoteInAmountBg
        .times(1 - slippage)
        .dp(0, BigNumber.ROUND_FLOOR);
      const feeWei = toWei(fee, 4).toString();
      const deadline = Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60);

      try {
        if (baseIsETH) {
          const tokenAddress = quoteToken.address;
          const tokenInAmount = quoteInAmountBg.toString();
          const tokenInAmountMin = quoteInAmountMinBg.toString();
          const ethAmountMin = baseInAmountMinBg.toString();
          value = NumberToHex(baseInAmountBg) ?? '';
          data = encodeVE33V2RouterAddLiquidityETH(
            tokenAddress,
            stable,
            tokenInAmount,
            tokenInAmountMin,
            ethAmountMin,
            account,
            deadline,
          );
        } else if (quoteIsETH) {
          const tokenAddress = baseToken.address;
          const tokenInAmount = baseInAmountBg.toString();
          const tokenInAmountMin = baseInAmountMinBg.toString();
          const ethAmountMin = quoteInAmountMinBg.toString();
          value = NumberToHex(quoteInAmountBg) ?? '';
          data = encodeVE33V2RouterAddLiquidityETH(
            tokenAddress,
            stable,
            tokenInAmount,
            tokenInAmountMin,
            ethAmountMin,
            account,
            deadline,
          );
        } else {
          data = encodeVE33V2RouterAddLiquidity(
            baseToken.address,
            quoteToken.address,
            stable,
            baseInAmountBg.toString(),
            quoteInAmountBg.toString(),
            baseInAmountMinBg.toString(),
            quoteInAmountMinBg.toString(),
            account,
            deadline,
          );
        }
      } catch (error) {
        console.error('encodeVe33V2RouterAddLiquidity error', error);
        useMessageState.getState().toast({
          message: `${t`Failed to add`}${error ? `: ${error}` : ''}`,
          type: 'error',
        });
        throw error;
      }

      const txResult = await submission.execute(
        t`Add liquidity`,
        {
          opcode: OpCode.TX,
          to,
          data,
          value,
        },
        {
          metadata: {
            [MetadataFlag.addLiquidityVe33V2Position]: true,
          },
          successBack,
          submittedBack,
        },
      );
      return txResult;
    },
  });
}

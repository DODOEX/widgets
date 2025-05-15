import { basicTokenMap, ChainId } from '@dodoex/api';
import {
  encodeVE33V2RouterRemoveLiquidity,
  encodeVE33V2RouterRemoveLiquidityETH,
  getVE33V2RouterContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../../hooks/Token';
import { useSubmission } from '../../../../hooks/Submission';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { toWei } from '../../../../utils';
import { useMessageState } from '../../../../hooks/useMessageState';
import { OpCode } from '../../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../../hooks/Submission/types';

export function useVe33RemoveLiquidity({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  liquidityAmount,
  slippage,
  stable,
  submittedBack,
  successBack,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  liquidityAmount: string;
  slippage: number;
  stable: boolean;
  submittedBack?: () => void;
  successBack?: () => void;
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
      const chainId = baseToken.chainId as ChainId;
      const basicToken = basicTokenMap[chainId];
      const basicTokenAddressLow = basicToken.address.toLowerCase();
      const to = getVE33V2RouterContractAddressByChainId(chainId);
      if (!to) {
        throw new Error('Ve33 V2 contract address is not valid.');
      }
      let data = '';
      const value = '0x0';
      const baseIsETH =
        baseToken.address.toLowerCase() === basicTokenAddressLow;
      const quoteIsETH =
        quoteToken.address.toLowerCase() === basicTokenAddressLow;
      const baseInAmountMinBg = toWei(
        new BigNumber(baseAmount).times(1 - slippage),
        baseToken.decimals,
      );
      const quoteInAmountMinBg = toWei(
        new BigNumber(quoteAmount).times(1 - slippage),
        quoteToken.decimals,
      );
      const deadline = Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60);
      try {
        if (baseIsETH) {
          const tokenAddress = quoteToken.address;
          const tokenInAmountMin = quoteInAmountMinBg.toString();
          const ethAmountMin = baseInAmountMinBg.toString();
          data = encodeVE33V2RouterRemoveLiquidityETH(
            tokenAddress,
            stable,
            liquidityAmount,
            tokenInAmountMin,
            ethAmountMin,
            account,
            deadline,
          );
        } else if (quoteIsETH) {
          const tokenAddress = baseToken.address;
          const tokenInAmountMin = baseInAmountMinBg.toString();
          const ethAmountMin = quoteInAmountMinBg.toString();
          console.log(
            tokenAddress,
            stable,
            liquidityAmount,
            tokenInAmountMin,
            ethAmountMin,
            account,
            deadline,
          );
          data = encodeVE33V2RouterRemoveLiquidityETH(
            tokenAddress,
            stable,
            liquidityAmount,
            tokenInAmountMin,
            ethAmountMin,
            account,
            deadline,
          );
        } else {
          console.log(
            baseToken.address,
            quoteToken.address,
            stable,
            liquidityAmount,
            baseInAmountMinBg.toString(),
            quoteInAmountMinBg.toString(),
            account,
            deadline,
          );
          data = encodeVE33V2RouterRemoveLiquidity(
            baseToken.address,
            quoteToken.address,
            stable,
            liquidityAmount,
            baseInAmountMinBg.toString(),
            quoteInAmountMinBg.toString(),
            account,
            deadline,
          );
        }
      } catch (error) {
        console.error('encodeUniswapV2Router02RemoveLiquidity error', error);
        useMessageState.getState().toast({
          message: `${t`Failed to remove`}${error ? `: ${error}` : ''}`,
          type: 'error',
        });
        throw error;
      }

      const txResult = await submission.execute(
        t`Remove liquidity`,
        {
          opcode: OpCode.TX,
          to,
          data,
          value,
        },
        {
          metadata: {
            [MetadataFlag.removeLiquidityVe33V2Position]: true,
          },
          submittedBack,
          successBack,
        },
      );
      return txResult;
    },
  });
}

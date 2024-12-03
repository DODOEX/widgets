import { useMutation } from '@tanstack/react-query';
import { TokenInfo } from '../../../hooks/Token';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { toWei } from '../../../utils';
import BigNumber from 'bignumber.js';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { NumberToHex } from '../../../utils/bytes';
import { OpCode } from '../../../hooks/Submission/spec';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { useSubmission } from '../../../hooks/Submission';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  encodeUniswapV2Router02AddLiquidity,
  encodeUniswapV2Router02AddLiquidityETH,
  getUniswapV2Router02ContractAddressByChainId,
} from '@dodoex/dodo-contract-request';

export function useAMMV2AddLiquidity({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  slippage,
  fee,
  isExists,
  successBack,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  slippage: number;
  fee: number | undefined;
  isExists?: boolean;
  successBack?: () => void;
}) {
  const submission = useSubmission();
  const { account } = useWalletInfo();
  useLingui();

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
      const to = getUniswapV2Router02ContractAddressByChainId(chainId);
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
        .dp(baseToken.decimals, BigNumber.ROUND_FLOOR);
      const quoteInAmountMinBg = quoteInAmountBg
        .times(1 - slippage)
        .dp(quoteToken.decimals, BigNumber.ROUND_FLOOR);
      const feeWei = toWei(fee, 4).toString();
      const deadline = Math.ceil(Date.now() / 1000) + 10 * 60;
      if (baseIsETH) {
        const tokenAddress = quoteToken.address;
        const tokenInAmount = quoteInAmountBg.toString();
        const tokenInAmountMin = quoteInAmountMinBg.toString();
        const ethAmountMin = baseInAmountMinBg.toString();
        value = NumberToHex(baseInAmountBg) ?? '';
        data = encodeUniswapV2Router02AddLiquidityETH(
          tokenAddress,
          feeWei,
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
        data = encodeUniswapV2Router02AddLiquidityETH(
          tokenAddress,
          feeWei,
          tokenInAmount,
          tokenInAmountMin,
          ethAmountMin,
          account,
          deadline,
        );
      } else {
        data = encodeUniswapV2Router02AddLiquidity(
          baseToken.address,
          quoteToken.address,
          feeWei,
          baseInAmountBg.toString(),
          quoteInAmountBg.toString(),
          baseInAmountMinBg.toString(),
          quoteInAmountMinBg.toString(),
          account,
          deadline,
        );
      }

      const txResult = await submission.execute(
        isExists ? t`Add liquidity` : t`Create AMM V2 Position`,
        {
          opcode: OpCode.TX,
          to,
          data,
          value,
        },
        {
          metadata: {
            [isExists
              ? MetadataFlag.addLiquidityAMMV2Position
              : MetadataFlag.createAMMV2Position]: true,
          },
          successBack,
        },
      );
      return txResult;
    },
  });
}

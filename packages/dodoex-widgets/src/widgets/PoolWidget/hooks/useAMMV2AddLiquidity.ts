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
  encodeUniswapV2Router02FixedFeeAddLiquidity,
  encodeUniswapV2Router02FixedFeeAddLiquidityETH,
  getUniswapV2Router02ContractAddressByChainId,
  getUniswapV2Router02FixedFeeContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useMessageState } from '../../../hooks/useMessageState';

export function useAMMV2AddLiquidity({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  slippage,
  fee,
  isExists,
  successBack,
  submittedBack,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  baseAmount: string;
  quoteAmount: string;
  slippage: number;
  fee: number | undefined;
  isExists?: boolean;
  successBack?: () => void;
  submittedBack?: () => void;
}) {
  const submission = useSubmission();
  const { account } = useWalletInfo();
  useLingui();

  const { deadLine: ddl } = useUserOptions();
  return useMutation({
    mutationFn: async () => {
      try {
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
        const dynamicFeeContractAddress =
          getUniswapV2Router02ContractAddressByChainId(chainId);
        const fixedFeeContractAddress =
          getUniswapV2Router02FixedFeeContractAddressByChainId(chainId);
        console.log('dynamicFeeContractAddress', dynamicFeeContractAddress);
        console.log('fixedFeeContractAddress', fixedFeeContractAddress);
        console.log('chainId', chainId);

        const isFixedFee = !dynamicFeeContractAddress;
        const to = dynamicFeeContractAddress || fixedFeeContractAddress;
        if (!to) {
          throw new Error('AMMV2 contract address is not valid.');
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
            if (isFixedFee) {
              data = encodeUniswapV2Router02FixedFeeAddLiquidityETH(
                tokenAddress,
                tokenInAmount,
                tokenInAmountMin,
                ethAmountMin,
                account,
                deadline,
              );
            } else {
              data = encodeUniswapV2Router02AddLiquidityETH(
                tokenAddress,
                feeWei,
                tokenInAmount,
                tokenInAmountMin,
                ethAmountMin,
                account,
                deadline,
              );
            }
          } else if (quoteIsETH) {
            const tokenAddress = baseToken.address;
            const tokenInAmount = baseInAmountBg.toString();
            const tokenInAmountMin = baseInAmountMinBg.toString();
            const ethAmountMin = quoteInAmountMinBg.toString();
            value = NumberToHex(quoteInAmountBg) ?? '';
            if (isFixedFee) {
              data = encodeUniswapV2Router02FixedFeeAddLiquidityETH(
                tokenAddress,
                tokenInAmount,
                tokenInAmountMin,
                ethAmountMin,
                account,
                deadline,
              );
            } else {
              data = encodeUniswapV2Router02AddLiquidityETH(
                tokenAddress,
                feeWei,
                tokenInAmount,
                tokenInAmountMin,
                ethAmountMin,
                account,
                deadline,
              );
            }
          } else {
            if (isFixedFee) {
              data = encodeUniswapV2Router02FixedFeeAddLiquidity(
                baseToken.address,
                quoteToken.address,
                baseInAmountBg.toString(),
                quoteInAmountBg.toString(),
                baseInAmountMinBg.toString(),
                quoteInAmountMinBg.toString(),
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
          }
        } catch (error) {
          console.error('encodeUniswapV2Router02AddLiquidity error', error);
          throw error;
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
            submittedBack,
          },
        );
        return txResult;
      } catch (error) {
        useMessageState.getState().toast({
          message: `${error}`,
          type: 'error',
        });
      }
    },
  });
}

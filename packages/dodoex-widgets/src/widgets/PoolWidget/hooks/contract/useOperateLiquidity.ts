import { basicTokenMap, ChainId, PoolApi, PoolType } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../hooks/Submission/types';
import { TokenInfo } from '../../../../hooks/Token';
import { getEthersValue } from '../../../../utils/bytes';
import { usePoolBalanceInfo } from '../usePoolBalanceInfo';
import { useModifyDppPool } from './useModifyDppPool';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { useMessageState } from '../../../../hooks/useMessageState';

export interface SubmitLiquidityParams {
  balanceInfo?: ReturnType<typeof usePoolBalanceInfo>;
  baseAmount: string;
  quoteAmount: string;
  slippageProtection: number;
  SLIPPAGE_PROTECTION: number;
  txTitle: string;
  isRemove?: boolean;
  submittedBack?: () => void;
  successBack?: () => void;
  withdrawInfo?: {
    withdrawFee: string;
    receiveBaseAmount: string;
    receiveQuoteAmount: string;
    receiveAmountBg: BigNumber | undefined;
  };
}

export const useOperateLiquidity = (pool?: {
  chainId: number;
  address: string;
  type: PoolType;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseLpToken?: {
    id: string;
  };
  quoteLpToken?: {
    id: string;
  };
}) => {
  const { account, chainId } = useWalletInfo();
  const submission = useSubmission();
  const queryClient = useQueryClient();
  const { deadLine: ddl } = useUserOptions();

  const { modifyDPPMutation } = useModifyDppPool({
    pool,
  });
  const operateLiquidityMutation = useMutation({
    mutationFn: async (params: SubmitLiquidityParams) => {
      if (!pool || !account || !params.balanceInfo) {
        return;
      }
      const {
        isRemove,
        baseAmount,
        quoteAmount,
        slippageProtection,
        balanceInfo,
        SLIPPAGE_PROTECTION,
        submittedBack,
        successBack,
        txTitle,
        withdrawInfo,
      } = params;
      const isAdd = !isRemove;
      const { address: pairId, type, baseToken, quoteToken } = pool;
      const pairAAddress = baseToken.address.toLowerCase();
      const pairBAddress = quoteToken.address.toLowerCase();
      const EtherToken = basicTokenMap[chainId as ChainId];
      const unwrappedTokenAddress = EtherToken.address.toLowerCase();
      // eth points directly to weth, and only weth can be stored in the fund pool.
      const pairAIsUnWrapped = unwrappedTokenAddress === pairAAddress;
      const pairBIsUnWrapped = unwrappedTokenAddress === pairBAddress;
      const isDsp = type === 'DSP' || type === 'GSP';
      const isClassical = type === 'CLASSICAL';

      const address = pairId.toLocaleLowerCase();
      const baseInAmount = new BigNumber(baseAmount);
      const quoteInAmount = new BigNumber(quoteAmount);
      const baseInAmountIsNaN = baseInAmount.isNaN();
      const quoteInAmountIsNaN = quoteInAmount.isNaN();
      const baseTokenDecimals = +baseToken.decimals;
      const quoteTokenDecimals = +quoteToken.decimals;
      const baseTokenSymbol = baseToken.symbol;
      const quoteTokenSymbol = quoteToken.symbol;
      const slippageProtectionVal = slippageProtection;
      let baseMinAmount = !baseInAmountIsNaN
        ? parseFixed(
            baseInAmount
              .multipliedBy(1 - slippageProtectionVal)
              .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
              .toString(),
            baseTokenDecimals,
          ).toString()
        : '0';
      let quoteMinAmount = !quoteInAmountIsNaN
        ? parseFixed(
            quoteInAmount
              .multipliedBy(1 - slippageProtectionVal)
              .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
              .toString(),
            quoteTokenDecimals,
          ).toString()
        : '0';

      let result: {
        data: string;
        to: string;
        value?: string;
      };
      try {
        if (isAdd) {
          if (isClassical) {
            const classicalBaseMinAmount =
              !baseInAmountIsNaN &&
              balanceInfo?.classicalBaseTarget &&
              balanceInfo.classicalBaseTarget.gt(0) &&
              balanceInfo.totalBaseLpBalance
                ? parseFixed(
                    baseInAmount
                      .multipliedBy(balanceInfo.totalBaseLpBalance)
                      .multipliedBy(1 - SLIPPAGE_PROTECTION)
                      .div(balanceInfo.classicalBaseTarget)
                      .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    baseTokenDecimals,
                  ).toString()
                : '0';
            const classicalQuoteMinAmount =
              !quoteInAmountIsNaN &&
              balanceInfo?.classicalBaseTarget &&
              balanceInfo.totalQuoteLpBalance &&
              balanceInfo.classicalQuoteTarget &&
              balanceInfo.classicalQuoteTarget.gt(0)
                ? parseFixed(
                    quoteInAmount
                      .multipliedBy(balanceInfo.totalQuoteLpBalance)
                      .multipliedBy(1 - SLIPPAGE_PROTECTION)
                      .div(balanceInfo.classicalQuoteTarget)
                      .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    quoteTokenDecimals,
                  ).toString()
                : '0';
            const addClassicalParams: Parameters<
              typeof PoolApi.encode.addClassicalLiquidityABI
            > = [
              chainId,
              address,
              !baseInAmountIsNaN
                ? parseFixed(
                    baseInAmount
                      .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    baseTokenDecimals,
                  ).toString()
                : '0',
              !quoteInAmountIsNaN
                ? parseFixed(
                    quoteInAmount
                      .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    quoteTokenDecimals,
                  ).toString()
                : '0',
              classicalBaseMinAmount,
              classicalQuoteMinAmount,
              pairAIsUnWrapped ? 1 : pairBIsUnWrapped ? 2 : 0,
              Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60),
            ];
            result = await PoolApi.encode.addClassicalLiquidityABI(
              ...addClassicalParams,
            );
          } else {
            const addParams: Parameters<
              typeof PoolApi.encode.addDSPLiquidityABI
            > = [
              chainId,
              address,
              !baseInAmountIsNaN
                ? parseFixed(
                    baseInAmount
                      .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    baseTokenDecimals,
                  ).toString()
                : '0',
              !quoteInAmountIsNaN
                ? parseFixed(
                    quoteInAmount
                      .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    quoteTokenDecimals,
                  ).toString()
                : '0',
              baseMinAmount,
              quoteMinAmount,
              pairAIsUnWrapped ? 1 : pairBIsUnWrapped ? 2 : 0,
              Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60),
            ];
            if (isDsp) {
              result = await PoolApi.encode.addDSPLiquidityABI(...addParams);
            } else {
              result = await PoolApi.encode.addDVMLiquidityABI(...addParams);
            }
          }
        } else if (isClassical) {
          const tokenSide = !baseInAmountIsNaN ? 'base' : 'quote';
          if (tokenSide === 'base') {
            // If baseInAmount === userTotalBase means that the maximum value is to be removed, special processing is required
            const b = baseInAmount
              .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
              .toString();

            const receiveBaseMinAmount =
              withdrawInfo && withdrawInfo.receiveAmountBg
                ? parseFixed(
                    withdrawInfo.receiveAmountBg
                      .multipliedBy(1 - slippageProtectionVal)
                      .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    baseTokenDecimals,
                  ).toString()
                : baseMinAmount;

            const removeBaseParams: Parameters<
              typeof PoolApi.encode.removeClassicalBaseABI
            > = [
              chainId,
              address,
              parseFixed(b, baseTokenDecimals).toString(),
              receiveBaseMinAmount,
            ];
            result = await PoolApi.encode.removeClassicalBaseABI(
              ...removeBaseParams,
            );
          } else {
            const q = quoteInAmount
              .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
              .toString();

            const receiveQuoteMinAmount =
              withdrawInfo && withdrawInfo.receiveAmountBg
                ? parseFixed(
                    withdrawInfo.receiveAmountBg
                      .multipliedBy(1 - slippageProtectionVal)
                      .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
                      .toString(),
                    quoteTokenDecimals,
                  ).toString()
                : quoteMinAmount;
            const removeQuoteParams: Parameters<
              typeof PoolApi.encode.removeClassicalQuoteABI
            > = [
              chainId,
              address,
              parseFixed(q, quoteTokenDecimals).toString(),
              receiveQuoteMinAmount,
            ];
            result = await PoolApi.encode.removeClassicalQuoteABI(
              ...removeQuoteParams,
            );
          }
        } else {
          /**
if (totalSupply == 0) {
  // case 1. initial supply
  require(baseBalance >= 10**3, “INSUFFICIENT_LIQUIDITY_MINED”);
  shares = baseBalance;
} else if (baseReserve > 0 && quoteReserve == 0) {
  // case 2. supply when quote reserve is 0
  shares = baseInput.mul(totalSupply).div(baseReserve);
} else if (baseReserve > 0 && quoteReserve > 0) {
  // case 3. normal case
  uint256 baseInputRatio = DecimalMath.divFloor(baseInput, baseReserve);
  uint256 quoteInputRatio = DecimalMath.divFloor(quoteInput, quoteReserve);
  uint256 mintRatio = quoteInputRatio < baseInputRatio ? quoteInputRatio : baseInputRatio;
  shares = DecimalMath.mulFloor(totalSupply, mintRatio);
}
         */

          if (
            !balanceInfo?.baseReserve ||
            !balanceInfo.quoteReserve ||
            !balanceInfo.totalBaseLpBalance ||
            !balanceInfo.userBaseLpBalance ||
            !balanceInfo.userBaseLpToTokenBalance
          )
            return;

          let sharesAmount: BigNumber = new BigNumber(0);
          if (balanceInfo.totalBaseLpBalance?.lte(0)) {
            sharesAmount = balanceInfo.userBaseLpBalance || new BigNumber(0);
          } else if (
            balanceInfo.baseReserve.gt(0) &&
            balanceInfo.quoteReserve.eq(0)
          ) {
            let b = baseInAmount;
            if (baseInAmount.gte(balanceInfo.userBaseLpToTokenBalance)) {
              b = balanceInfo.userBaseLpToTokenBalance;
            }
            sharesAmount = b
              .multipliedBy(balanceInfo.totalBaseLpBalance)
              .div(balanceInfo.baseReserve);
          } else if (
            balanceInfo.baseReserve.gt(0) &&
            balanceInfo.quoteReserve.gt(0)
          ) {
            let b = baseInAmount;
            if (baseInAmount.gte(balanceInfo.userBaseLpToTokenBalance)) {
              b = balanceInfo.userBaseLpToTokenBalance;
            }
            let q = quoteInAmount;
            if (
              balanceInfo.userQuoteLpToTokenBalance &&
              quoteInAmount.gte(balanceInfo.userQuoteLpToTokenBalance)
            ) {
              q = balanceInfo.userQuoteLpToTokenBalance;
            }

            let removeRatio: BigNumber | undefined;
            if (q.gt(0) && balanceInfo.userQuoteLpToTokenBalance?.gt(0)) {
              removeRatio = q.div(balanceInfo.userQuoteLpToTokenBalance);
            }
            if (b.gt(0) && balanceInfo.userBaseLpToTokenBalance.gt(0)) {
              removeRatio = b.div(balanceInfo.userBaseLpToTokenBalance);
            }
            if (removeRatio?.gte(1)) {
              removeRatio = new BigNumber(1);
            }
            if (!removeRatio) {
              return;
            }
            // Directly use the number of lpToken to calculate sharesAmount instead of using the converted original token number to avoid the problem of being unable to be completely removed due to precision truncation
            sharesAmount = removeRatio.multipliedBy(
              balanceInfo.userBaseLpBalance,
            );

            // Correct baseInAmount and quoteInAmount again
            const mintRatio = sharesAmount
              .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
              .div(balanceInfo.totalBaseLpBalance);
            b = mintRatio
              .multipliedBy(balanceInfo.baseReserve)
              .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR);
            q = mintRatio
              .multipliedBy(balanceInfo.quoteReserve)
              .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR);
            baseMinAmount = parseFixed(
              b
                .multipliedBy(1 - slippageProtectionVal)
                .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              baseTokenDecimals,
            ).toString();
            quoteMinAmount = parseFixed(
              q
                .multipliedBy(1 - slippageProtectionVal)
                .dp(quoteTokenDecimals, BigNumber.ROUND_FLOOR)
                .toString(),
              quoteTokenDecimals,
            ).toString();
          }

          const isUnWrap = pairAIsUnWrapped || pairBIsUnWrapped;
          const removeParams: Parameters<
            typeof PoolApi.encode.removeDSPLiquidityABI
          > = [
            chainId,
            address,
            account,
            !sharesAmount.isNaN()
              ? parseFixed(
                  sharesAmount
                    .dp(baseTokenDecimals, BigNumber.ROUND_FLOOR)
                    .toString(),
                  baseTokenDecimals,
                ).toString()
              : '0',
            baseMinAmount,
            quoteMinAmount,
            isUnWrap,
            Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60),
          ];
          if (isDsp) {
            result = await PoolApi.encode.removeDSPLiquidityABI(
              ...removeParams,
            );
          } else {
            result = await PoolApi.encode.removeDVMLiquidityABI(
              ...removeParams,
            );
          }
        }
      } catch (error) {
        useMessageState.getState().toast({
          message: `${error}`,
          type: 'error',
        });
        throw new Error(
          `v2 addDVMLiquidity or removeDVMLiquidity or removeDSPLiquidity error: ${error}`,
        );
      }

      if (result && result.data) {
        const logBalance = {} as {
          [address: string]: string;
        };
        if (baseAmount) {
          const baseTokenBalance = queryClient.getQueryData<{
            balance: BigNumber;
          }>(
            tokenApi.getFetchTokenQuery(chainId, baseToken.address, account)
              .queryKey,
          )?.balance;
          if (baseTokenBalance) {
            logBalance[baseToken.address] = baseTokenBalance.toString();
          }
          if (pool.baseLpToken && balanceInfo?.userBaseLpBalance) {
            logBalance[pool.baseLpToken.id] =
              balanceInfo.userBaseLpBalance.toString();
          }
        }
        if (quoteAmount) {
          const quoteTokenBalance = queryClient.getQueryData<{
            balance: BigNumber;
          }>(
            tokenApi.getFetchTokenQuery(chainId, quoteToken.address, account)
              .queryKey,
          )?.balance;
          if (quoteTokenBalance) {
            logBalance[quoteToken.address] = quoteTokenBalance.toString();
          }
          if (pool.quoteLpToken && balanceInfo?.userQuoteLpBalance) {
            logBalance[pool.quoteLpToken.id] =
              balanceInfo.userQuoteLpBalance.toString();
          }
        }
        try {
          if (isAdd && pairAIsUnWrapped) {
            result.value = getEthersValue(
              baseInAmountIsNaN ? '0' : baseInAmount,
            );
          }
          if (isAdd && pairBIsUnWrapped) {
            result.value = getEthersValue(
              quoteInAmountIsNaN ? '0' : quoteInAmount,
            );
          }
          let subTitle: undefined | string;
          if (!baseInAmountIsNaN) {
            subTitle = `${baseInAmount.toString()}${baseTokenSymbol}`;
          }
          if (!quoteInAmountIsNaN) {
            if (baseInAmountIsNaN) {
              subTitle = `${quoteInAmount.toString()}${quoteTokenSymbol}`;
            } else {
              subTitle = `${subTitle} & ${quoteInAmount.toString()}${quoteTokenSymbol}`;
            }
          }
          const txResult = await submission.execute(
            txTitle,
            {
              opcode: OpCode.TX,
              ...result,
              value: result.value ?? 0,
            },
            {
              subtitle: subTitle,
              metadata: {
                [isAdd
                  ? MetadataFlag.addLiquidity
                  : MetadataFlag.removeLiquidity]: true,
                logBalance,
              },
              submittedBack,
            },
          );

          if (txResult === ExecutionResult.Success) {
            if (successBack) {
              successBack();
            }
          }
        } catch (error) {
          useMessageState.getState().toast({
            message: `${error}`,
            type: 'error',
          });
          throw Error(`v2 sendTransaction error: ${error}`);
        }
      }
    },
  });

  const operateLiquidityMutationResult =
    pool?.type === 'DPP' ? modifyDPPMutation : operateLiquidityMutation;

  React.useEffect(() => {
    operateLiquidityMutationResult.reset();
  }, [pool]);

  return {
    operateLiquidityMutation:
      operateLiquidityMutationResult as typeof operateLiquidityMutation,
  };
};

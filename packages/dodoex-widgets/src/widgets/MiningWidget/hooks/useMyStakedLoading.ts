import { useEffect, useMemo, useState } from 'react';
import { useSubmission } from '../../../hooks/Submission';
import { MetadataFlag, State } from '../../../hooks/Submission/types';
import { isUnexpiredTx } from '../MiningList/utils';
import { CompositeMiningContractDataI, TabMiningI } from '../types';
import { usePrevious } from './usePrevious';

export function useMyStakedLoading({
  id,
  stakeTokenAddress,
  contractData,
  miningMinings,
  refetchContractData,
}: {
  contractData: CompositeMiningContractDataI | undefined;
  refetchContractData: () => void;
} & Pick<TabMiningI, 'id' | 'stakeTokenAddress' | 'miningMinings'>): {
  /** 用户将 lptoken 质押到挖矿合约的份额 loading 中 */
  lpTokenAccountStakedBalanceLoading: [boolean, boolean];
  /** 用户持有的 lpToken 余额 loading 中 */
  lpTokenAccountBalanceLoading: [boolean, boolean];
  addLiquiditySuccessfulPair: [boolean, boolean];
} {
  const { requests } = useSubmission();

  const [addBaseLiquiditySuccessful, setAddBaseLiquiditySuccessful] =
    useState(false);
  const [addQuoteLiquiditySuccessful, setAddQuoteLiquiditySuccessful] =
    useState(false);

  const stakeTokenAddressLowercase = stakeTokenAddress.toLowerCase();

  const [addLiquidityTx, removeLiquidityTx] = useMemo(() => {
    return [
      requests
        ? Array.from(requests.values()).findLast(
            ([k, v]) =>
              v === State.Running &&
              !!k.metadata?.[MetadataFlag.addLiquidity] &&
              k.metadata?.pairId.toLowerCase() === stakeTokenAddressLowercase,
          )?.[0]
        : undefined,
      requests
        ? Array.from(requests.values()).findLast(
            ([k, v]) =>
              v === State.Running &&
              !!k.metadata?.[MetadataFlag.removeLiquidity] &&
              k.metadata?.pairId.toLowerCase() === stakeTokenAddressLowercase,
          )?.[0]
        : undefined,
    ];
  }, [requests, stakeTokenAddressLowercase]);

  const prevAddLiquidityTx = usePrevious(addLiquidityTx);
  useEffect(() => {
    if (prevAddLiquidityTx && !addLiquidityTx) {
      refetchContractData();
    }
  }, [addLiquidityTx, prevAddLiquidityTx, refetchContractData]);
  useEffect(() => {
    if (prevAddLiquidityTx && !addLiquidityTx) {
      const {
        isClassical,
        MyLqBaseLpBalance,
        myLqQuoteLpBalance,
        baseInAmountIsNaN,
        quoteInAmountIsNaN,
      } =
        (prevAddLiquidityTx.metadata as {
          isClassical: boolean;
          MyLqBaseLpBalance: string;
          myLqQuoteLpBalance: string;
          baseInAmountIsNaN: boolean;
          quoteInAmountIsNaN: boolean;
        }) ?? {};
      if (isClassical) {
        if (!baseInAmountIsNaN) {
          setAddBaseLiquiditySuccessful((prev) => {
            if (prev) {
              return prev;
            }
            return MyLqBaseLpBalance === '0';
          });
        }
        if (!quoteInAmountIsNaN) {
          setAddQuoteLiquiditySuccessful((prev) => {
            if (prev) {
              return prev;
            }
            return myLqQuoteLpBalance === '0';
          });
        }
        return;
      }
      setAddBaseLiquiditySuccessful((prev) => {
        if (prev) {
          return prev;
        }
        return MyLqBaseLpBalance === '0';
      });
    }
  }, [addLiquidityTx, prevAddLiquidityTx]);

  const prevRemoveLiquidityTx = usePrevious(removeLiquidityTx);
  useEffect(() => {
    if (prevRemoveLiquidityTx && !removeLiquidityTx) {
      refetchContractData();
    }
  }, [prevRemoveLiquidityTx, refetchContractData, removeLiquidityTx]);

  const latestDepositOrWithdrawTx = useMemo(() => {
    return requests
      ? Array.from(requests.values()).findLast(
          ([r, v]) =>
            r.metadata?.id === id && r.metadata?.depositOrWithdrawMining,
        )?.[0]
      : undefined;
  }, [id, requests]);

  const lpTokenAccountStakedBalanceLoading = useMemo<[boolean, boolean]>(() => {
    if (!contractData) {
      return [false, false];
    }

    if (
      !latestDepositOrWithdrawTx ||
      !latestDepositOrWithdrawTx.metadata ||
      !latestDepositOrWithdrawTx.metadata?.submitTime
    ) {
      return [false, false];
    }

    const balanceDataMap = contractData.balanceDataMap;
    if (miningMinings.length === 1) {
      const [miningMining] = miningMinings;
      const balanceData = balanceDataMap.get(miningMining.id);
      if (balanceData) {
        const { lpTokenAccountStakedBalance } = balanceData;
        const {
          submitTime,
          lpTokenAccountStakedBalance: lastLpTokenAccountStakedBalance,
        } = latestDepositOrWithdrawTx.metadata;
        if (isUnexpiredTx(submitTime)) {
          return [
            lpTokenAccountStakedBalance?.eq(
              lastLpTokenAccountStakedBalance ?? 0,
            ) ?? false,
            false,
          ];
        }
      }
    }

    if (miningMinings.length === 2) {
      const [miningMining0, miningMining1] = miningMinings;
      const balanceData0 = balanceDataMap.get(miningMining0.id);
      const balanceData1 = balanceDataMap.get(miningMining1.id);
      if (balanceData0 && balanceData1) {
        const {
          submitTime,
          lpTokenAccountStakedBalance: lastLpTokenAccountStakedBalance,
          selectedStakeTokenIndex,
        } = latestDepositOrWithdrawTx.metadata;
        if (isUnexpiredTx(submitTime)) {
          return [
            selectedStakeTokenIndex === 0
              ? balanceData0.lpTokenAccountStakedBalance?.eq(
                  lastLpTokenAccountStakedBalance ?? 0,
                ) ?? false
              : false,
            selectedStakeTokenIndex === 1
              ? balanceData1.lpTokenAccountStakedBalance?.eq(
                  lastLpTokenAccountStakedBalance ?? 0,
                ) ?? false
              : false,
          ];
        }
      }
    }

    return [false, false];
  }, [contractData, latestDepositOrWithdrawTx, miningMinings]);

  const latestAddOrRemoveLqTx = useMemo(() => {
    return requests
      ? Array.from(requests.values()).findLast(
          ([r, v]) =>
            r.metadata?.pairId?.toLowerCase() === stakeTokenAddressLowercase &&
            (r.metadata?.[MetadataFlag.addLiquidity] ||
              r.metadata?.[MetadataFlag.removeLiquidity]),
        )?.[0]
      : undefined;
  }, [requests, stakeTokenAddressLowercase]);

  const lpTokenAccountBalanceLoading = useMemo<[boolean, boolean]>(() => {
    if (!contractData) {
      return [false, false];
    }

    if (
      !latestAddOrRemoveLqTx ||
      !latestAddOrRemoveLqTx.metadata ||
      !latestAddOrRemoveLqTx.metadata?.submitTime
    ) {
      return [false, false];
    }

    const balanceDataMap = contractData.balanceDataMap;
    if (miningMinings.length === 1) {
      const [miningMining] = miningMinings;
      const balanceData = balanceDataMap.get(miningMining.id);
      if (balanceData) {
        const { lpTokenAccountBalance } = balanceData;
        const { submitTime, MyLqBaseLpBalance } =
          latestAddOrRemoveLqTx.metadata;
        if (isUnexpiredTx(submitTime)) {
          return [
            lpTokenAccountBalance?.eq(MyLqBaseLpBalance ?? 0) ?? false,
            false,
          ];
        }
      }
    }

    if (miningMinings.length === 2) {
      const [miningMining0, miningMining1] = miningMinings;
      const balanceData0 = balanceDataMap.get(miningMining0.id);
      const balanceData1 = balanceDataMap.get(miningMining1.id);
      if (balanceData0 && balanceData1) {
        const {
          submitTime,
          MyLqBaseLpBalance,
          myLqQuoteLpBalance,
          baseInAmountIsNaN,
          quoteInAmountIsNaN,
        } = latestAddOrRemoveLqTx.metadata;
        if (isUnexpiredTx(submitTime)) {
          return [
            baseInAmountIsNaN
              ? false
              : balanceData0.lpTokenAccountBalance?.eq(
                  MyLqBaseLpBalance ?? 0,
                ) ?? false,
            quoteInAmountIsNaN
              ? false
              : balanceData1.lpTokenAccountBalance?.eq(
                  myLqQuoteLpBalance ?? 0,
                ) ?? false,
          ];
        }
      }
    }

    return [false, false];
  }, [contractData, latestAddOrRemoveLqTx, miningMinings]);

  return {
    lpTokenAccountStakedBalanceLoading,
    lpTokenAccountBalanceLoading,
    addLiquiditySuccessfulPair: [
      addBaseLiquiditySuccessful,
      addQuoteLiquiditySuccessful,
    ],
  };
}

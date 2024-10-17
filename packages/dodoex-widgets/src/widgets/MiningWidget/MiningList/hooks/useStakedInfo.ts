import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import {
  CompositeMiningContractDataI,
  MiningStakeTokenWithAmountI,
  TabMiningI,
} from '../../types';
import {
  getReserveForMining,
  getVaultReserveForMining,
} from '../../hooks/helper';

interface StakedTokenInfo {
  stakedTokenWithAmountList: Array<MiningStakeTokenWithAmountI>;
  totalStakedTokenUSD: BigNumber | undefined;
  totalUnstakedTokenUSD: BigNumber | undefined;
}

export function useStakedInfo({
  miningItem,
  contractData,
}: {
  miningItem: TabMiningI;
  contractData: CompositeMiningContractDataI | undefined;
}): StakedTokenInfo {
  const {
    stakedTokenWithAmountList,
    totalStakedTokenUSD,
    totalUnstakedTokenUSD,
  } = useMemo<StakedTokenInfo>(() => {
    const { type, miningMinings } = miningItem;
    if (type === 'single' || type === 'vdodo') {
      const [
        {
          id,
          sourceToken: [sourceToken],
        },
      ] = miningMinings;
      const stakedTokenWithAmount: MiningStakeTokenWithAmountI = {
        address: sourceToken.address,
        symbol: sourceToken.symbol,
        decimals: sourceToken.decimals,
        usdPrice: sourceToken.usdPrice,
        logoImg: sourceToken.logoImg,
        sourceTokenAmount: undefined,
        sourceTokenAmountUSD: undefined,
        valueLockedAmount: undefined,
        unstakedSourceTokenAmount: undefined,
        unstakedSourceTokenAmountUSD: undefined,
      };
      const defaultResult: StakedTokenInfo = {
        stakedTokenWithAmountList: [stakedTokenWithAmount],
        totalStakedTokenUSD: undefined,
        totalUnstakedTokenUSD: undefined,
      };
      if (!contractData) {
        return defaultResult;
      }
      const balanceData = contractData.balanceDataMap.get(id);
      if (!balanceData) {
        return defaultResult;
      }
      const {
        lpTokenAccountBalance,
        lpTokenAccountStakedBalance,
        lpTokenMiningBalance,
      } = balanceData;
      stakedTokenWithAmount.sourceTokenAmount = lpTokenAccountStakedBalance;
      stakedTokenWithAmount.sourceTokenAmountUSD =
        lpTokenAccountStakedBalance && sourceToken.usdPrice
          ? lpTokenAccountStakedBalance.multipliedBy(sourceToken.usdPrice)
          : undefined;
      stakedTokenWithAmount.unstakedSourceTokenAmount = lpTokenAccountBalance;
      stakedTokenWithAmount.unstakedSourceTokenAmountUSD =
        lpTokenAccountBalance && sourceToken.usdPrice
          ? lpTokenAccountBalance.multipliedBy(sourceToken.usdPrice)
          : undefined;
      stakedTokenWithAmount.valueLockedAmount = lpTokenMiningBalance;
      if (
        lpTokenAccountStakedBalance &&
        lpTokenMiningBalance &&
        lpTokenAccountStakedBalance.gt(lpTokenMiningBalance)
      ) {
        stakedTokenWithAmount.sourceTokenAmount = lpTokenMiningBalance;
        stakedTokenWithAmount.sourceTokenAmountUSD =
          lpTokenMiningBalance && sourceToken.usdPrice
            ? lpTokenMiningBalance.multipliedBy(sourceToken.usdPrice)
            : undefined;
      }

      return {
        stakedTokenWithAmountList: [stakedTokenWithAmount],
        totalStakedTokenUSD: stakedTokenWithAmount.sourceTokenAmountUSD,
        totalUnstakedTokenUSD:
          stakedTokenWithAmount.unstakedSourceTokenAmountUSD,
      };
    } else if (type === 'dvm' || type === 'lptoken' || type === 'classical') {
      const { baseToken, quoteToken } = miningItem;

      const baseTokenWithAmount: MiningStakeTokenWithAmountI = {
        address: baseToken.address,
        symbol: baseToken.symbol,
        decimals: baseToken.decimals,
        usdPrice: baseToken.usdPrice,
        logoImg: baseToken.logoImg,
        sourceTokenAmount: undefined,
        sourceTokenAmountUSD: undefined,
        valueLockedAmount: undefined,
        unstakedSourceTokenAmount: undefined,
        unstakedSourceTokenAmountUSD: undefined,
      };
      const quoteTokenWithAmount: MiningStakeTokenWithAmountI = {
        address: quoteToken.address,
        symbol: quoteToken.symbol,
        decimals: quoteToken.decimals,
        usdPrice: quoteToken.usdPrice,
        logoImg: quoteToken.logoImg,
        sourceTokenAmount: undefined,
        sourceTokenAmountUSD: undefined,
        valueLockedAmount: undefined,
        unstakedSourceTokenAmount: undefined,
        unstakedSourceTokenAmountUSD: undefined,
      };
      const defaultResult: StakedTokenInfo = {
        stakedTokenWithAmountList: [baseTokenWithAmount, quoteTokenWithAmount],
        totalStakedTokenUSD: undefined,
        totalUnstakedTokenUSD: undefined,
      };
      if (!contractData) {
        return defaultResult;
      }
      const { midPrice, baseTokenReserve, quoteTokenReserve, balanceDataMap } =
        contractData;

      let baseStakeTokenBalance: BigNumber | undefined;
      let baseStakeTokenUnstakedBalance: BigNumber | undefined;
      let quoteStakeTokenBalance: BigNumber | undefined;
      let quoteStakeTokenUnstakedBalance: BigNumber | undefined;
      let baseStakeTokenTotalSupply: BigNumber | undefined;
      let quoteStakeTokenTotalSupply: BigNumber | undefined;
      if (type === 'classical') {
        const [baseMining, quoteMining] = miningMinings;
        const baseBalanceData = balanceDataMap.get(baseMining.id);
        if (!quoteMining) {
          return defaultResult;
        }
        const quoteBalanceData = balanceDataMap.get(quoteMining?.id);
        if (!baseBalanceData || !quoteBalanceData) {
          return defaultResult;
        }

        baseStakeTokenBalance = baseBalanceData.lpTokenAccountStakedBalance;
        quoteStakeTokenBalance = quoteBalanceData.lpTokenAccountStakedBalance;
        baseStakeTokenUnstakedBalance = baseBalanceData.lpTokenAccountBalance;
        quoteStakeTokenUnstakedBalance = quoteBalanceData.lpTokenAccountBalance;
        if (
          baseBalanceData.lpTokenAccountStakedBalance &&
          baseBalanceData.lpTokenMiningBalance &&
          baseBalanceData.lpTokenAccountStakedBalance.gt(
            baseBalanceData.lpTokenMiningBalance,
          )
        ) {
          baseStakeTokenBalance = baseBalanceData.lpTokenMiningBalance;
        }
        if (
          quoteBalanceData.lpTokenAccountStakedBalance &&
          quoteBalanceData.lpTokenMiningBalance &&
          quoteBalanceData.lpTokenAccountStakedBalance.gt(
            quoteBalanceData.lpTokenMiningBalance,
          )
        ) {
          quoteStakeTokenBalance = quoteBalanceData.lpTokenMiningBalance;
        }
        baseStakeTokenTotalSupply = baseBalanceData.lpTokenTotalSupply;
        quoteStakeTokenTotalSupply = quoteBalanceData.lpTokenTotalSupply;

        baseTokenWithAmount.valueLockedAmount = getReserveForMining({
          balance: baseBalanceData.lpTokenMiningBalance,
          totalSupply: baseStakeTokenTotalSupply,
          reserve: baseTokenReserve,
        });
        quoteTokenWithAmount.valueLockedAmount = getReserveForMining({
          balance: quoteBalanceData.lpTokenMiningBalance,
          totalSupply: quoteStakeTokenTotalSupply,
          reserve: quoteTokenReserve,
        });
      } else {
        const [{ id }] = miningMinings;
        const balanceData = balanceDataMap.get(id);
        if (!balanceData) {
          return defaultResult;
        }

        const {
          lpTokenAccountStakedBalance,
          lpTokenAccountBalance,
          lpTokenMiningBalance,
          lpTokenTotalSupply,
        } = balanceData;

        baseStakeTokenBalance = lpTokenAccountStakedBalance;
        quoteStakeTokenBalance = lpTokenAccountStakedBalance;
        baseStakeTokenUnstakedBalance = lpTokenAccountBalance;
        quoteStakeTokenUnstakedBalance = lpTokenAccountBalance;
        if (
          lpTokenAccountStakedBalance &&
          lpTokenMiningBalance &&
          lpTokenAccountStakedBalance.gt(lpTokenMiningBalance)
        ) {
          baseStakeTokenBalance = lpTokenMiningBalance;
          quoteStakeTokenBalance = lpTokenMiningBalance;
        }
        baseStakeTokenTotalSupply = lpTokenTotalSupply;
        quoteStakeTokenTotalSupply = lpTokenTotalSupply;

        baseTokenWithAmount.valueLockedAmount = getReserveForMining({
          balance: lpTokenMiningBalance,
          totalSupply: lpTokenTotalSupply,
          reserve: baseTokenReserve,
        });
        quoteTokenWithAmount.valueLockedAmount = getReserveForMining({
          balance: lpTokenMiningBalance,
          totalSupply: lpTokenTotalSupply,
          reserve: quoteTokenReserve,
        });
      }

      const {
        totalStakedTokenUSD,
        totalStakedTokenWithoutMidPriceUSD,
        baseReserveForMining,
        quoteReserveForMining,
        baseReserveForMiningUSD,
        quoteReserveForMiningUSD,
      } = getVaultReserveForMining({
        baseStakeTokenBalance,
        baseStakeTokenTotalSupply,
        quoteStakeTokenBalance,
        quoteStakeTokenTotalSupply,
        baseTokenReserve,
        quoteTokenReserve,
        midPrice,
        baseTokenUSD: baseToken.usdPrice,
        quoteTokenUSD: quoteToken.usdPrice,
      });

      const {
        totalStakedTokenUSD: totalStakedTokenUSDUnstaked,
        totalStakedTokenWithoutMidPriceUSD:
          totalStakedTokenWithoutMidPriceUSDUnstaked,
        baseReserveForMining: baseReserveForMiningUnstaked,
        quoteReserveForMining: quoteReserveForMiningUnstaked,
        baseReserveForMiningUSD: baseReserveForMiningUSDUnstaked,
        quoteReserveForMiningUSD: quoteReserveForMiningUSDUnstaked,
      } = getVaultReserveForMining({
        baseStakeTokenBalance: baseStakeTokenUnstakedBalance,
        baseStakeTokenTotalSupply,
        quoteStakeTokenBalance: quoteStakeTokenUnstakedBalance,
        quoteStakeTokenTotalSupply,
        baseTokenReserve,
        quoteTokenReserve,
        midPrice,
        baseTokenUSD: baseToken.usdPrice,
        quoteTokenUSD: quoteToken.usdPrice,
      });

      baseTokenWithAmount.sourceTokenAmount = baseReserveForMining;
      baseTokenWithAmount.sourceTokenAmountUSD = baseReserveForMiningUSD;
      baseTokenWithAmount.unstakedSourceTokenAmount =
        baseReserveForMiningUnstaked;
      baseTokenWithAmount.unstakedSourceTokenAmountUSD =
        baseReserveForMiningUSDUnstaked;
      quoteTokenWithAmount.sourceTokenAmount = quoteReserveForMining;
      quoteTokenWithAmount.sourceTokenAmountUSD = quoteReserveForMiningUSD;
      quoteTokenWithAmount.unstakedSourceTokenAmount =
        quoteReserveForMiningUnstaked;
      quoteTokenWithAmount.unstakedSourceTokenAmountUSD =
        quoteReserveForMiningUSDUnstaked;
      return {
        stakedTokenWithAmountList: [baseTokenWithAmount, quoteTokenWithAmount],
        totalStakedTokenUSD:
          totalStakedTokenUSD ?? totalStakedTokenWithoutMidPriceUSD,
        totalUnstakedTokenUSD:
          totalStakedTokenUSDUnstaked ??
          totalStakedTokenWithoutMidPriceUSDUnstaked,
      };
    }
    return {
      stakedTokenWithAmountList: [],
      totalStakedTokenUSD: undefined,
      totalUnstakedTokenUSD: undefined,
    };
  }, [contractData, miningItem]);

  return {
    stakedTokenWithAmountList,
    totalStakedTokenUSD,
    totalUnstakedTokenUSD,
  };
}

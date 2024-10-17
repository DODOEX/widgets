import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import {
  getReserveForMining,
  getStakeTokenAPR,
  getVaultReserveForMining,
} from '../../hooks/helper';
import {
  CompositeMiningContractDataI,
  LpTokenPlatformID,
  MiningRewardTokenWithAprI,
  MiningRewardTokenWithTagI,
  TabMiningI,
} from '../../types';
import { useRewardTokenTrigger } from './useRewardTokenTrigger';
import { useTotalRewardUSD } from './useTotalRewardUSD';

export function useRewardTokenInfo({
  miningItem,
  contractData,
}: {
  miningItem: TabMiningI;
  contractData: CompositeMiningContractDataI | undefined;
}): {
  rewardTokenWithAprListArray: Array<Array<MiningRewardTokenWithAprI>>;
  totalAprList: Array<BigNumber | undefined>;
  rewardTokenWithAprTotalList: Array<MiningRewardTokenWithTagI>;
  rewardTokenTrigger: JSX.Element;
  totalRewardUSD: BigNumber | undefined;
} {
  const rewardTokenWithAprListArray = useMemo<
    Array<Array<MiningRewardTokenWithAprI>>
  >(() => {
    const { chainId, type, miningMinings } = miningItem;

    const currentTime = new BigNumber(Math.floor(Date.now() / 1000));

    return miningMinings.map((miningMining, index) => {
      const isClassicalBase = index === 0;
      const { rewardTokenList } = miningMining;

      if (contractData) {
        const {
          midPrice,
          baseTokenReserve,
          quoteTokenReserve,
          balanceDataMap,
        } = contractData;
        const balanceData = balanceDataMap.get(miningMining.id);
        if (balanceData) {
          const {
            rewardTokenWithBalanceMap,
            lpTokenMiningBalance,
            lpTokenTotalSupply,
          } = balanceData;

          return rewardTokenList.map((rewardToken) => {
            const { initialApr, rewardPerBlock, usdPrice, endTime } =
              rewardToken;

            const id = `${miningMining.id}-${rewardToken.address}`;
            const pendingReward = rewardTokenWithBalanceMap.get(id);
            let apr: BigNumber | undefined;

            if (!endTime || currentTime.gt(endTime)) {
              return {
                ...rewardToken,
                apr: new BigNumber(0),
                pendingReward,
              };
            } else if (!endTime || endTime.lte(0)) {
              return {
                ...rewardToken,
                apr: initialApr,
                pendingReward,
              };
            } else {
              if (type === 'single' || type === 'vdodo') {
                const [sourceToken] = miningMining.sourceToken;
                let rewardTokenUSDPrice = usdPrice;
                let totalStakedTokenUSD =
                  lpTokenMiningBalance && sourceToken.usdPrice
                    ? lpTokenMiningBalance.multipliedBy(sourceToken.usdPrice)
                    : undefined;
                if (
                  sourceToken.address?.toLowerCase() ===
                  rewardToken.address?.toLowerCase()
                ) {
                  rewardTokenUSDPrice = new BigNumber(1);
                  totalStakedTokenUSD = lpTokenMiningBalance;
                }
                apr = getStakeTokenAPR({
                  chainId,
                  rewardPerBlock,
                  rewardTokenUSDPrice,
                  totalStakedTokenUSD,
                });
              } else if (type === 'dvm' || type === 'lptoken') {
                const { baseToken, quoteToken, lpTokenPlatformID } = miningItem;
                let {
                  totalStakedTokenUSD,
                  totalStakedTokenWithoutMidPriceUSD,
                  baseReserveForMining,
                  quoteReserveForMining,
                } = getVaultReserveForMining({
                  baseStakeTokenBalance: lpTokenMiningBalance,
                  baseStakeTokenTotalSupply: lpTokenTotalSupply,
                  quoteStakeTokenBalance: lpTokenMiningBalance,
                  quoteStakeTokenTotalSupply: lpTokenTotalSupply,
                  baseTokenReserve,
                  quoteTokenReserve,
                  midPrice,
                  baseTokenUSD: baseToken.usdPrice,
                  quoteTokenUSD: quoteToken.usdPrice,
                });
                let rewardTokenUSDPrice = usdPrice;
                if (lpTokenPlatformID === LpTokenPlatformID.pancakeV2) {
                  totalStakedTokenUSD = totalStakedTokenWithoutMidPriceUSD;
                } else {
                  if (
                    midPrice &&
                    midPrice.gt(0) &&
                    baseReserveForMining &&
                    quoteReserveForMining
                  ) {
                    if (
                      rewardToken.address?.toLowerCase() ===
                      baseToken.address?.toLowerCase()
                    ) {
                      rewardTokenUSDPrice = new BigNumber(1);
                      totalStakedTokenUSD = quoteReserveForMining
                        .div(midPrice)
                        .plus(baseReserveForMining);
                    }
                    if (
                      rewardToken.address?.toLowerCase() ==
                      quoteToken.address?.toLowerCase()
                    ) {
                      rewardTokenUSDPrice = new BigNumber(1);
                      totalStakedTokenUSD = baseReserveForMining
                        .multipliedBy(midPrice)
                        .plus(quoteReserveForMining);
                    }
                  }
                }
                apr = getStakeTokenAPR({
                  chainId,
                  rewardPerBlock,
                  rewardTokenUSDPrice,
                  totalStakedTokenUSD,
                });
              } else if (type === 'classical') {
                const [baseMining, quoteMining] = miningMinings;

                const baseBalanceData = balanceDataMap.get(baseMining.id);
                const quoteBalanceData = balanceDataMap.get(
                  quoteMining?.id as string,
                );

                const { baseToken, quoteToken } = miningItem;
                const baseReserveForMining = getReserveForMining({
                  balance: baseBalanceData?.lpTokenMiningBalance,
                  totalSupply: baseBalanceData?.lpTokenTotalSupply,
                  reserve: baseTokenReserve,
                });
                const quoteReserveForMining = getReserveForMining({
                  balance: quoteBalanceData?.lpTokenMiningBalance,
                  totalSupply: quoteBalanceData?.lpTokenTotalSupply,
                  reserve: quoteTokenReserve,
                });

                const stakeToken = isClassicalBase ? baseToken : quoteToken;
                const reserveForMining = isClassicalBase
                  ? baseReserveForMining
                  : quoteReserveForMining;

                let rewardTokenUSDPrice = usdPrice;
                let totalStakedTokenUSD =
                  reserveForMining && stakeToken.usdPrice
                    ? reserveForMining.multipliedBy(stakeToken.usdPrice)
                    : undefined;

                if (isClassicalBase) {
                  if (
                    rewardToken.address?.toLowerCase() ==
                    baseToken.address?.toLowerCase()
                  ) {
                    rewardTokenUSDPrice = new BigNumber(1);
                    totalStakedTokenUSD = baseReserveForMining?.multipliedBy(1);
                  }
                  if (
                    midPrice &&
                    midPrice.gt(0) &&
                    rewardToken.address?.toLowerCase() ==
                      quoteToken.address?.toLowerCase()
                  ) {
                    rewardTokenUSDPrice = new BigNumber(1);
                    totalStakedTokenUSD = baseReserveForMining
                      ?.multipliedBy(midPrice)
                      .multipliedBy(1);
                  }
                } else {
                  if (
                    midPrice &&
                    midPrice.gt(0) &&
                    rewardToken.address?.toLowerCase() ==
                      baseToken.address?.toLowerCase()
                  ) {
                    rewardTokenUSDPrice = new BigNumber(1);
                    totalStakedTokenUSD = quoteReserveForMining
                      ?.div(midPrice)
                      .multipliedBy(1);
                  }
                  if (
                    rewardToken.address?.toLowerCase() ==
                    quoteToken.address?.toLowerCase()
                  ) {
                    rewardTokenUSDPrice = new BigNumber(1);
                    totalStakedTokenUSD =
                      quoteReserveForMining?.multipliedBy(1);
                  }
                }

                apr = getStakeTokenAPR({
                  chainId,
                  rewardPerBlock,
                  rewardTokenUSDPrice,
                  totalStakedTokenUSD,
                });
              }
            }

            return {
              ...rewardToken,
              apr: apr ?? initialApr,
              pendingReward,
            };
          });
        }
      }

      return rewardTokenList.map((rewardToken) => {
        const { initialApr, endTime } = rewardToken;
        if (!endTime || currentTime.gt(endTime)) {
          return {
            ...rewardToken,
            apr: new BigNumber(0),
            pendingReward: undefined,
          };
        } else if (!endTime || endTime.lte(0)) {
          return {
            ...rewardToken,
            apr: initialApr,
            pendingReward: undefined,
          };
        } else {
          return {
            ...rewardToken,
            apr: initialApr,
            pendingReward: undefined,
          };
        }
      });
    });
  }, [contractData, miningItem]);

  const totalAprList = useMemo<Array<BigNumber | undefined>>(() => {
    return rewardTokenWithAprListArray.map((rewardTokenWithAprList) => {
      const validRewardTokenWithAprList = rewardTokenWithAprList.filter(
        (r) => r.apr !== undefined,
      );
      if (validRewardTokenWithAprList.length === 0) {
        return undefined;
      }

      return validRewardTokenWithAprList.reduce(
        (previousValue, currentValue) =>
          currentValue.apr?.gt(0)
            ? previousValue.plus(currentValue.apr)
            : previousValue,
        new BigNumber(0),
      );
    });
  }, [rewardTokenWithAprListArray]);

  const rewardTokenWithAprTotalList = useMemo<
    Array<MiningRewardTokenWithTagI>
  >(() => {
    const rewardTokenList: Array<MiningRewardTokenWithTagI> = [];
    const { type } = miningItem;
    rewardTokenWithAprListArray.forEach((rewardTokenWithAprList, index) => {
      rewardTokenWithAprList.forEach((rewardToken) => {
        let symbolEle: JSX.Element | string | undefined = rewardToken.symbol;
        if (type === 'classical') {
          const isClassicalBase = index === 0;
          const { baseToken, quoteToken } = miningItem;
          symbolEle = (
            <>
              {rewardToken.symbol ?? '-'}
              <span style={{ fontWeight: 400 }}>
                (
                {(isClassicalBase ? baseToken.symbol : quoteToken.symbol) ?? ''}
                )
              </span>
            </>
          );
        }
        rewardTokenList.push({
          ...rewardToken,
          symbolEle,
        });
      });
    });
    return rewardTokenList;
  }, [miningItem, rewardTokenWithAprListArray]);

  const totalRewardUSD = useTotalRewardUSD({
    rewardTokenWithAprList: rewardTokenWithAprTotalList,
  });

  const rewardTokenTrigger = useRewardTokenTrigger({
    rewardTokenList: rewardTokenWithAprTotalList,
  });

  return {
    rewardTokenWithAprListArray,
    totalAprList,
    rewardTokenWithAprTotalList,
    rewardTokenTrigger,
    totalRewardUSD,
  };
}

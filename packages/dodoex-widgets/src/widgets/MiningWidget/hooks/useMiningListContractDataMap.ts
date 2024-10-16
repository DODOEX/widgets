import { ABIName, Query } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { miningApi } from '../helper';
import {
  CompositeMiningContractDataI,
  LpTokenPlatformID,
  MiningWithContractDataI,
  TabMiningI,
} from '../types';
import { transformStrToBN } from './helper';
import { useRefetch } from './useRefetch';
import { MINING_POOL_REFETCH_INTERVAL } from './utils';

function compositeQueryList({
  miningList,
  account,
  nextContractDataMap,
}: {
  miningList: TabMiningI[];
  account?: string;
  nextContractDataMap: Map<string, CompositeMiningContractDataI>;
}) {
  const queryList: Query[] = [];
  miningList.forEach((miningItem) => {
    const {
      chainId,
      version,
      type,
      lpTokenPlatformID,
      stakeTokenAddress,
      miningMinings,
    } = miningItem;

    const compositeMiningContractData: CompositeMiningContractDataI = {
      midPrice: undefined,
      baseTokenReserve: undefined,
      quoteTokenReserve: undefined,
      balanceDataMap: new Map(),
      chainId,
    };

    if (type === 'dvm' || type === 'lptoken' || type === 'classical') {
      const { baseToken, quoteToken } = miningItem;
      if (lpTokenPlatformID === LpTokenPlatformID.dodo) {
        queryList.push({
          abiName: ABIName.dodoABI,
          contractAddress: stakeTokenAddress,
          method: 'getMidPrice',
          params: [],
          callback: (midPrice) => {
            compositeMiningContractData.midPrice = transformStrToBN(
              midPrice,
              baseToken.decimals != undefined &&
                quoteToken.decimals != undefined
                ? 18 - baseToken.decimals + quoteToken.decimals
                : undefined,
            );
          },
        });
        if (type === 'classical') {
          queryList.push({
            abiName: ABIName.dodoABI,
            contractAddress: stakeTokenAddress,
            method: 'getExpectedTarget',
            params: [],
            callback: ({ baseTarget, quoteTarget }) => {
              compositeMiningContractData.baseTokenReserve = transformStrToBN(
                baseTarget,
                baseToken.decimals,
              );
              compositeMiningContractData.quoteTokenReserve = transformStrToBN(
                quoteTarget,
                quoteToken.decimals,
              );
            },
          });
        } else {
          queryList.push({
            abiName: ABIName.dvmPoolABI,
            contractAddress: stakeTokenAddress,
            method: 'getVaultReserve',
            params: [],
            callback: ({ baseReserve, quoteReserve }) => {
              compositeMiningContractData.baseTokenReserve = transformStrToBN(
                baseReserve,
                baseToken.decimals,
              );
              compositeMiningContractData.quoteTokenReserve = transformStrToBN(
                quoteReserve,
                quoteToken.decimals,
              );
            },
          });
        }
      } else if (lpTokenPlatformID === LpTokenPlatformID.pancakeV2) {
        queryList.push({
          abiName: ABIName.PancakePairABI,
          contractAddress: stakeTokenAddress,
          method: 'getReserves',
          params: [],
          callback: ({ _reserve0, _reserve1 }) => {
            compositeMiningContractData.baseTokenReserve = transformStrToBN(
              _reserve0,
              baseToken.decimals,
            );
            compositeMiningContractData.quoteTokenReserve = transformStrToBN(
              _reserve1,
              quoteToken.decimals,
            );
          },
        });
      }
    }

    miningMinings.forEach((miningMining, index) => {
      const balanceData: MiningWithContractDataI = {
        lpTokenAccountBalance: undefined,
        lpTokenAccountStakedBalance: undefined,
        rewardTokenWithBalanceMap: new Map(),
        lpTokenMiningBalance: undefined,
        lpTokenTotalSupply: undefined,
      };

      const { lpToken, miningContractAddress, rewardTokenList } = miningMining;
      const isBase = index === 0;

      if (account) {
        if (type === 'classical') {
          queryList.push({
            abiName: ABIName.dodoABI,
            contractAddress: stakeTokenAddress,
            method: isBase
              ? 'getBaseCapitalBalanceOf'
              : 'getQuoteCapitalBalanceOf',
            params: [account],
            callback: (balance) => {
              balanceData.lpTokenAccountBalance = transformStrToBN(
                balance,
                lpToken.decimals,
              );
            },
          });
        } else if (type === 'vdodo') {
          queryList.push({
            abiName: ABIName.vdodoTokenABI,
            contractAddress: stakeTokenAddress,
            method: 'availableBalanceOf',
            params: [account],
            callback: (vDODOAmount) => {
              balanceData.lpTokenAccountBalance = transformStrToBN(
                vDODOAmount,
                lpToken.decimals,
              );
            },
          });
        } else {
          queryList.push({
            abiName: ABIName.dvmPoolABI,
            contractAddress: stakeTokenAddress,
            method: 'balanceOf',
            params: [account],
            callback: (balance) => {
              balanceData.lpTokenAccountBalance = transformStrToBN(
                balance,
                lpToken.decimals,
              );
            },
          });
        }
      } else {
        balanceData.lpTokenAccountBalance = new BigNumber(0);
      }

      if (miningContractAddress && lpToken.address) {
        if (account) {
          if (version === '2') {
            queryList.push({
              abiName: ABIName.dodoMiningABI,
              contractAddress: miningContractAddress,
              method: 'getUserLpBalance',
              params: [lpToken.address, account],
              callback: (balance) => {
                balanceData.lpTokenAccountStakedBalance = transformStrToBN(
                  balance,
                  lpToken.decimals,
                );
              },
            });
          } else if (version === '3') {
            queryList.push({
              abiName: ABIName.v3MiningABI,
              contractAddress: miningContractAddress,
              method: 'balanceOf',
              params: [account],
              callback: (balance) => {
                balanceData.lpTokenAccountStakedBalance = transformStrToBN(
                  balance,
                  lpToken.decimals,
                );
              },
            });
          }
        } else {
          balanceData.lpTokenAccountStakedBalance = new BigNumber(0);
        }
      }

      if (miningContractAddress) {
        rewardTokenList.forEach((rewardToken) => {
          if (rewardToken.address) {
            const id = `${miningMining.id}-${rewardToken.address}`;
            if (account) {
              if (version === '2') {
                if (lpToken.address) {
                  queryList.push({
                    abiName: ABIName.dodoMiningABI,
                    contractAddress: miningContractAddress,
                    method: 'getPendingReward',
                    params: [lpToken.address, account],
                    callback: (balance) => {
                      balanceData.rewardTokenWithBalanceMap.set(
                        id,
                        transformStrToBN(balance, rewardToken.decimals),
                      );
                    },
                  });
                }
              } else if (version === '3') {
                if (rewardToken.address) {
                  queryList.push({
                    abiName: ABIName.v3MiningABI,
                    contractAddress: miningContractAddress,
                    method: 'getPendingRewardByToken',
                    params: [account, rewardToken.address],
                    callback: (balance) => {
                      balanceData.rewardTokenWithBalanceMap.set(
                        id,
                        transformStrToBN(balance, rewardToken.decimals),
                      );
                    },
                  });
                }
              }
            } else {
              balanceData.rewardTokenWithBalanceMap.set(id, new BigNumber(0));
            }
          }
        });
      }

      if (miningContractAddress && lpToken.address) {
        if (type === 'classical') {
          queryList.push({
            abiName: ABIName.erc20ABI,
            contractAddress: lpToken.address,
            method: 'balanceOf',
            params: [miningContractAddress],
            callback: (balance) => {
              balanceData.lpTokenMiningBalance = transformStrToBN(
                balance,
                lpToken.decimals,
              );
            },
          });
        } else if (type === 'vdodo' || type === 'single') {
          if (version === '2') {
            queryList.push({
              abiName: ABIName.erc20ABI,
              contractAddress: lpToken.address,
              method: 'balanceOf',
              params: [miningContractAddress],
              callback: (totalSupply) => {
                balanceData.lpTokenMiningBalance = transformStrToBN(
                  totalSupply,
                  lpToken.decimals,
                );
              },
            });
          } else {
            queryList.push({
              abiName: ABIName.erc20ABI,
              contractAddress: miningContractAddress,
              method: 'totalSupply',
              params: [],
              callback: (totalSupply) => {
                balanceData.lpTokenMiningBalance = transformStrToBN(
                  totalSupply,
                  lpToken.decimals,
                );
              },
            });
          }
        } else {
          queryList.push({
            abiName: ABIName.dvmPoolABI,
            contractAddress: lpToken.address,
            method: 'balanceOf',
            params: [miningContractAddress],
            callback: (balance) => {
              balanceData.lpTokenMiningBalance = transformStrToBN(
                balance,
                lpToken.decimals,
              );
            },
          });
        }
      }

      if (lpToken.address) {
        if (type === 'classical') {
          queryList.push({
            abiName: ABIName.dodoABI,
            contractAddress: stakeTokenAddress,
            method: isBase ? 'getTotalBaseCapital' : 'getTotalQuoteCapital',
            params: [],
            callback: (totalSupply) => {
              balanceData.lpTokenTotalSupply = transformStrToBN(
                totalSupply,
                lpToken.decimals,
              );
            },
          });
        } else if (type === 'dvm' || type === 'lptoken') {
          queryList.push({
            abiName: ABIName.dvmPoolABI,
            contractAddress: lpToken.address,
            method: 'totalSupply',
            params: [],
            callback: (totalSupply) => {
              balanceData.lpTokenTotalSupply = transformStrToBN(
                totalSupply,
                lpToken.decimals,
              );
            },
          });
        }
      }

      compositeMiningContractData.balanceDataMap.set(
        miningMining.id,
        balanceData,
      );
    });

    nextContractDataMap.set(miningItem.id, compositeMiningContractData);
  });

  return {
    queryList,
  };
}

export function useMiningListContractDataMap({
  miningList,
  account,
  currentChainId,
}: {
  miningList: TabMiningI[];
  account?: string;
  currentChainId: number | undefined;
}) {
  const [called, setCalled] = useState(false);
  const [othersChainCalled, setOthersChainCalled] = useState(false);
  const [contractDataMap, setContractDataMap] = useState<
    Map<string, CompositeMiningContractDataI>
  >(new Map());
  const [othersChainContractDataMap, setOthersChainContractDataMap] = useState<
    Map<string, CompositeMiningContractDataI>
  >(new Map());

  const { refetch, refetchTimes } = useRefetch();

  const [miningListForCurrentChain, miningListForOthersChain] = useMemo(() => {
    return miningList.reduce<[Array<TabMiningI>, Map<number, TabMiningI[]>]>(
      (prev, curr) => {
        if (curr.chainId === currentChainId) {
          prev[0].push(curr);
        } else {
          let miningListForSameChain = prev[1].get(curr.chainId);
          if (!miningListForSameChain) {
            miningListForSameChain = [curr];
            prev[1].set(curr.chainId, miningListForSameChain);
          }
          miningListForSameChain.push(curr);
        }
        return prev;
      },
      [[], new Map()],
    );
  }, [currentChainId, miningList]);

  const [prevMiningListForCurrentChain, setPrevMiningListForCurrentChain] =
    useState(miningListForCurrentChain);
  if (miningListForCurrentChain !== prevMiningListForCurrentChain) {
    setPrevMiningListForCurrentChain(miningListForCurrentChain);
    setCalled(miningListForCurrentChain.length === 0);
  }

  useEffect(() => {
    let ignore = false;
    async function computeContractData() {
      try {
        const nextContractDataMap = new Map<
          string,
          CompositeMiningContractDataI
        >();

        const { queryList } = compositeQueryList({
          miningList: miningListForCurrentChain,
          account,
          nextContractDataMap,
        });

        await miningApi.contractRequests.callMultiQuery(
          miningListForCurrentChain[0].chainId,
          queryList,
        );

        console.log('v2 nextContractDataMap 01');
        if (ignore) {
          return;
        }

        console.log('v2 nextContractDataMap 02', nextContractDataMap);
        setContractDataMap((prev) => {
          if (isEqual(nextContractDataMap, prev)) {
            return prev;
          }

          for (let [key, value] of prev) {
            if (!nextContractDataMap.has(key)) {
              nextContractDataMap.set(key, value);
            }
          }
          return nextContractDataMap;
        });
      } catch (error) {
        console.error(
          '[compute contract data for current chain failed]:',
          error,
        );
      }
      setCalled(true);
    }

    if (miningListForCurrentChain.length > 0) {
      computeContractData();
    }
    let timer: number | undefined;
    if (miningListForCurrentChain.length > 0) {
      timer = window.setInterval(() => {
        computeContractData();
      }, MINING_POOL_REFETCH_INTERVAL);
    }

    return () => {
      ignore = true;
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [account, miningListForCurrentChain, refetchTimes]);

  const [prevMiningListForOthersChain, setPrevMiningListForOthersChain] =
    useState(miningListForOthersChain);
  if (miningListForOthersChain !== prevMiningListForOthersChain) {
    setPrevMiningListForOthersChain(miningListForOthersChain);
    setOthersChainCalled(miningListForOthersChain.size === 0);
  }

  useEffect(() => {
    let ignore = false;
    async function computeContractData() {
      try {
        const nextContractDataMap = new Map<
          string,
          CompositeMiningContractDataI
        >();
        const miningListForOthersChainPromiseList: Promise<void>[] = [];
        miningListForOthersChain.forEach((miningList, chainId) => {
          miningListForOthersChainPromiseList.push(
            new Promise<void>(async (resolve, reject) => {
              try {
                const { queryList } = compositeQueryList({
                  miningList,
                  account,
                  nextContractDataMap,
                });

                await miningApi.contractRequests.callMultiQuery(
                  chainId,
                  queryList,
                );
                resolve();
              } catch (error) {
                console.error(
                  `[contractQueryList in ${chainId} error]:`,
                  error,
                );
                reject(error);
              }
            }),
          );
        });

        await Promise.all(miningListForOthersChainPromiseList);

        console.log('v2 nextContractDataMap 03');
        if (ignore) {
          return;
        }

        console.log('v2 nextContractDataMap 04', nextContractDataMap);
        setOthersChainContractDataMap((prev) => {
          if (isEqual(nextContractDataMap, prev)) {
            return prev;
          }

          for (let [key, value] of prev) {
            if (!nextContractDataMap.has(key)) {
              nextContractDataMap.set(key, value);
            }
          }
          return nextContractDataMap;
        });
      } catch (error) {
        console.error(
          '[compute contract data for others chain failed]:',
          error,
        );
      }
      setOthersChainCalled(true);
    }

    if (miningListForOthersChain.size > 0) {
      computeContractData();
    }
    let timer: number | undefined;
    if (miningListForOthersChain.size > 0) {
      timer = window.setInterval(() => {
        computeContractData();
      }, MINING_POOL_REFETCH_INTERVAL * 3);
    }

    return () => {
      ignore = true;
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [account, miningListForOthersChain]);

  return {
    contractDataMap,
    othersChainContractDataMap,
    loading: !called,
    otherChinsLoading: !othersChainCalled,
    refetch,
  };
}

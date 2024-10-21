import { getAddress, getCreate2Address } from '@ethersproject/address';
import { keccak256, pack } from '@ethersproject/solidity';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { sortsAddress } from '../../../utils/address';
import { DexConfigI, LpTokenPlatformID } from '../types';
import { ReactComponent as DODOImg } from './dodo.svg';
import { RewardI } from './hooks/reducers';
import { ReactComponent as PancakeImg } from './pancake.svg';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { dexKeysMap } from '../../../constants/chains';

export const dexListObj: Record<string, DexConfigI> = {
  dodo: {
    name: 'DODO Dex',
    Icon: DODOImg,
    createMiningEnable: true,
    platformID: LpTokenPlatformID.dodo,
  },
  pancakeV2: {
    name: 'Pancake V2',
    Icon: PancakeImg,
    createMiningEnable: true,
    platformID: LpTokenPlatformID.pancakeV2,
  },
};

export type DexKey = keyof typeof dexListObj;

export const BSC_SWAPINFO = [
  {
    // price comparison
    name: dexListObj['pancakeV2'].name,
    factoryAddress: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    initHash:
      '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
    fee: 25,
  },
];

export function GetGeneralUniInfo(chainId: number): {
  name: string;
  factoryAddress: string;
  initHash: string;
  fee?: number;
}[] {
  switch (chainId) {
    case 56:
    case 86:
      return BSC_SWAPINFO;

    default:
      return [];
  }
}

export function getOtherDexPool(
  chainId: number,
  dexName: string,
  token0Address: string,
  token1Address: string,
  GetGeneralUniInfo: (chainId: number) => Array<{
    name: string;
    factoryAddress: string;
    initHash: string;
    fee?: number;
  }>,
) {
  const dexInfo = GetGeneralUniInfo(chainId);
  let poolAddress = '';
  // @ts-ignore
  if (dexInfo == [] || dexInfo == null) return poolAddress;

  const address0 = getAddress(token0Address);
  const address1 = getAddress(token1Address);
  const tokens = sortsAddress(address0, address1)
    ? [address0, address1]
    : [address1, address0];
  for (let i = 0; i < dexInfo.length; i++) {
    if (dexName == dexInfo[i].name) {
      poolAddress = getCreate2Address(
        dexInfo[i].factoryAddress,
        keccak256(
          ['bytes'],
          [pack(['address', 'address'], [tokens[0], tokens[1]])],
        ),
        dexInfo[i].initHash,
      );
    }
  }
  return poolAddress;
}

export const getChainDexList = (
  chainId: ChainId,
  filterCreateMiningEnable?: boolean,
) => {
  const dexKeys = dexKeysMap[chainId];
  const defaultDexList = [
    {
      key: 'dodo' as DexKey,
      value: dexListObj.dodo.name,
    },
  ];
  if (!dexKeys) {
    return defaultDexList;
  }
  return [
    ...defaultDexList,
    ...dexKeys
      .filter((key) => {
        if (filterCreateMiningEnable) {
          return dexListObj[key].createMiningEnable;
        }
        return true;
      })
      .map((key) => ({
        key,
        value: dexListObj[key].name,
      })),
  ];
};

export function formatDate(time: number | null) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

export function computeDailyAmount({
  startTime,
  endTime,
  total,
}: {
  startTime: BigNumber | number | null | undefined;
  endTime: BigNumber | number | null | undefined;
  total: string;
}) {
  if (!total || startTime == null || endTime == null) {
    return null;
  }
  const totalBN = new BigNumber(total);
  const startTImeBN = new BigNumber(startTime);
  const endTimeBN = new BigNumber(endTime);
  if (
    totalBN.isFinite() &&
    startTImeBN.isFinite() &&
    endTimeBN.isFinite() &&
    endTimeBN.gt(startTImeBN)
  ) {
    const days = dayjs(endTimeBN.toNumber()).diff(
      startTImeBN.toNumber(),
      'days',
      true,
    );
    return totalBN.dividedBy(days).toString();
  }
  return null;
}

export function isValidRewardInfo({
  reward,
  now,
}: {
  reward: RewardI;
  now: number;
}) {
  const startTimeIsError = reward.startTime ? reward.startTime <= now : true;
  const endTimeIsError = startTimeIsError
    ? false
    : reward.endTime && reward.startTime
    ? reward.endTime <= now || reward.endTime <= reward.startTime
    : true;
  const totalIsError = !reward.total || reward.total === '0';

  return {
    startTimeIsError,
    endTimeIsError,
    totalIsError,
    isInvalid: startTimeIsError || endTimeIsError || totalIsError,
  };
}

export const getWrappedTokenAddress = (
  addressOrigin: string,
  chainId: ChainId,
) => {
  const address = addressOrigin.toLowerCase();
  const nativeToken = basicTokenMap[chainId];
  if (nativeToken && nativeToken.address.toLowerCase() === address) {
    return nativeToken.wrappedTokenAddress;
  }
  return addressOrigin;
};

export const isBrowser = typeof document !== 'undefined';

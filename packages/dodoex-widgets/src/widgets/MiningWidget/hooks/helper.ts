import { MiningApi, MiningMiningInfo } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { sortBy } from 'lodash';
import {
  BaseMiningI,
  CommonMiningI,
  MiningLpTokenI,
  MiningRewardTokenI,
  MyCreatedMiningI,
  TabMiningI,
} from '../types';
import {
  getMiningStatusByTimestamp,
  VALID_MINING_TYPE,
  VALID_MINING_VERSION,
} from './utils';

export type RewardTokenInfosParameters = {
  endBlock: string;
  rewardPerBlock: string;
  rewardToken: string;
  startBlock: string;
};

type MiningListQueryListItem = ElementType<
  NonNullable<
    NonNullable<
      ReturnType<
        Exclude<
          typeof MiningApi.graphql.fetchMiningListV1['__apiType'],
          undefined
        >
      >['mining_list']
    >['list']
  >
>;

export const manualStopMiningList: Record<
  string,
  [blockNumber: string, timestamp: string]
> = {
  // https://arbiscan.io/address/0x72A957D95843cbB3b379E4D43112F88687e99B58#code
  ['0x72A957D95843cbB3b379E4D43112F88687e99B58'.toLowerCase()]: [
    '16891290',
    '1656844767',
  ],
};

function checkChainId(chainId: MiningMiningInfo['chainId']) {
  if (!chainId) {
    return null;
  }

  return chainId;
}

function checkMiningType(
  type?: MiningMiningInfo['type'],
): BaseMiningI['type'] | null {
  if (!type) {
    return null;
  }
  if (type === 'dsp' || type === 'gsp') {
    return 'lptoken';
  }
  if (VALID_MINING_TYPE.includes(type as BaseMiningI['type'])) {
    return type as BaseMiningI['type'];
  }
  return null;
}

function checkMiningVersion(
  version?: MiningMiningInfo['version'],
): BaseMiningI['version'] {
  if (!version) {
    return '2';
  }
  if (VALID_MINING_VERSION.includes(version as BaseMiningI['version'])) {
    return version as BaseMiningI['version'];
  }
  return '2';
}

export function transformRawMiningToBaseMining(
  obj: MiningListQueryListItem,
): BaseMiningI | null {
  if (!obj) {
    return null;
  }

  const chainId = checkChainId(obj.chainId);
  if (!chainId) {
    return null;
  }

  const type = checkMiningType(obj.type);
  if (!type) {
    return null;
  }

  const version = checkMiningVersion(obj.version);

  let stakeTokenAddress = obj.address;
  if (type === 'single' || type === 'vdodo') {
    if (!obj.baseToken?.id) {
      return null;
    }
    stakeTokenAddress = obj.baseToken.id;
  } else if (type === 'lptoken' || type === 'dvm') {
    if (!obj.baseLpToken?.id) {
      return null;
    }
    stakeTokenAddress = obj.baseLpToken.id;
  }
  if (!stakeTokenAddress) {
    return null;
  }

  if (type === 'classical') {
    if (version === '3') {
      if (!obj.baseLpTokenMining || !obj.quoteLpTokenMining) {
        return null;
      }
      return {
        chainId,
        type,
        version,
        stakeTokenAddress,
        miningContractAddress: obj.baseLpTokenMining,
        quoteLpTokenMiningContractAddress: obj.quoteLpTokenMining,
      };
    }
    if (!obj.miningContractAddress) {
      return null;
    }
    return {
      chainId,
      type,
      version,
      stakeTokenAddress,
      miningContractAddress: obj.miningContractAddress,
      quoteLpTokenMiningContractAddress: obj.miningContractAddress,
    };
  }
  if (!obj.miningContractAddress) {
    return null;
  }

  const transformedObj: BaseMiningI = {
    chainId,
    type,
    version,
    stakeTokenAddress,
    miningContractAddress: obj.miningContractAddress,
  };

  return transformedObj;
}

function checkLpToken(
  token: NonNullable<MiningListQueryListItem>['baseLpToken'],
) {
  const lpToken: MiningLpTokenI = {
    address: token?.id ?? undefined,
    decimals: token?.decimals ?? undefined,
    symbol: token?.symbol ?? undefined,
  };
  return lpToken;
}

function checkSourceToken(
  token: NonNullable<MiningListQueryListItem>['baseToken'],
) {
  return {
    ...checkLpToken(token),
    usdPrice: token?.price ? new BigNumber(token.price) : undefined,
    logoImg: token?.logoImg ?? undefined,
  };
}

function checkRewardTokenList({
  rewardTokenInfos,
  startBlock,
  endBlock,
  startTime,
  endTime,
  blockNumber,
}: {
  rewardTokenInfos:
    | Array<{
        apy?: string | null;
        decimals?: number | null;
        endBlock?: string | null;
        endTime?: string | null;
        id?: string | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startTime?: string | null;
        startBlock?: string | null;
        symbol?: string | null;
      } | null>
    | null
    | undefined;
  startBlock: string | null | undefined;
  endBlock: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
  blockNumber?: string | null | undefined;
}): Array<MiningRewardTokenI> {
  if (!rewardTokenInfos) {
    return [];
  }
  return sortBy(rewardTokenInfos, (o) => o?.rewardNumIndex ?? 0).map(
    (token) => {
      const rewardToken = checkSourceToken(token);
      const initialApr = token?.apy ? new BigNumber(token.apy) : undefined;
      return {
        ...rewardToken,
        startBlock: token?.startBlock
          ? new BigNumber(token.startBlock)
          : startBlock
          ? new BigNumber(startBlock)
          : undefined,
        startTime: token?.startTime
          ? new BigNumber(token.startTime)
          : startTime
          ? new BigNumber(startTime)
          : undefined,
        endBlock: token?.endBlock
          ? new BigNumber(token.endBlock)
          : endBlock
          ? new BigNumber(endBlock)
          : undefined,
        endTime: token?.endTime
          ? new BigNumber(token.endTime)
          : endTime
          ? new BigNumber(endTime)
          : undefined,
        rewardPerBlock:
          token?.rewardPerBlock && rewardToken.decimals
            ? new BigNumber(token.rewardPerBlock).div(
                `1e${rewardToken.decimals}`,
              )
            : undefined,
        initialApr: initialApr?.isFinite() ? initialApr : undefined,
        blockNumber: blockNumber ? new BigNumber(blockNumber) : undefined,
      };
    },
  );
}

export function transformRawMiningToTabMining(
  obj: MiningListQueryListItem,
): TabMiningI | null {
  if (!obj) {
    return null;
  }
  const baseMining = transformRawMiningToBaseMining(obj);
  if (!baseMining) {
    return null;
  }

  const {
    chainId,
    type,
    version,
    stakeTokenAddress,
    miningContractAddress,
    quoteLpTokenMiningContractAddress,
  } = baseMining;
  const {
    isGSP,
    isNewERCMineV3,
    platform,
    title,
    rewardTokenInfos,
    rewardQuoteTokenInfos,
    blockNumber,
    startBlock,
    startTime,
  } = obj;

  const source: TabMiningI['source'] = !platform ? 'official' : 'unofficial';
  const lpTokenPlatformID: TabMiningI['lpTokenPlatformID'] =
    platform == null ? 0 : Number(platform);
  const [endBlock, endTime] = manualStopMiningList[
    miningContractAddress.toLowerCase()
  ] ?? [obj.endBlock, obj.endTime];
  const baseToken = checkSourceToken(obj.baseToken);
  const quoteToken = checkSourceToken(obj.quoteToken);
  const baseLpToken = checkLpToken(obj.baseLpToken);
  const quoteLpToken = checkLpToken(obj.quoteLpToken);

  let miningMinings: CommonMiningI['miningMinings'] | undefined;
  if (type === 'single' || type === 'vdodo') {
    const lpToken = checkLpToken(obj.baseToken);
    miningMinings = [
      {
        id: `${lpToken.address}-${miningContractAddress}`,
        sourceToken: [baseToken],
        lpToken,
        miningContractAddress,
        rewardTokenList: checkRewardTokenList({
          rewardTokenInfos,
          startBlock,
          endBlock,
          startTime,
          endTime,
          blockNumber,
        }),
      },
    ];
  } else if (type === 'dvm' || type === 'lptoken') {
    miningMinings = [
      {
        id: `${baseLpToken.address}-${miningContractAddress}`,
        sourceToken: [baseToken, quoteToken],
        lpToken: baseLpToken,
        miningContractAddress,
        rewardTokenList: checkRewardTokenList({
          rewardTokenInfos,
          startBlock,
          endBlock,
          startTime,
          endTime,
          blockNumber,
        }),
      },
    ];
  } else if (type === 'classical') {
    miningMinings = [
      {
        id: `${baseLpToken.address}-${miningContractAddress}`,
        sourceToken: [baseToken],
        lpToken: baseLpToken,
        miningContractAddress,
        rewardTokenList: checkRewardTokenList({
          rewardTokenInfos,
          startBlock,
          endBlock,
          startTime,
          endTime,
          blockNumber,
        }),
      },
      {
        id: `${quoteLpToken.address}-${quoteLpTokenMiningContractAddress}`,
        sourceToken: [quoteToken],
        lpToken: quoteLpToken,
        miningContractAddress: quoteLpTokenMiningContractAddress,
        rewardTokenList: checkRewardTokenList({
          rewardTokenInfos: rewardQuoteTokenInfos,
          startBlock,
          endBlock,
          startTime,
          endTime,
          blockNumber,
        }),
      },
    ];
  }

  if (!miningMinings) {
    return null;
  }

  const commonMining: CommonMiningI = {
    chainId,
    version,
    id: `${chainId}-${stakeTokenAddress}-${miningContractAddress}`.toLowerCase(),
    stakeTokenAddress,
    name: title ?? undefined,
    source,
    lpTokenPlatformID,
    miningMinings,
    miningTotalDollar: obj.miningTotalDollar,
    isGSP: isGSP ?? false,
    isNewERCMineV3: isNewERCMineV3 ?? false,
  };
  if (type === 'single' || type === 'vdodo') {
    return {
      ...commonMining,
      type,
    };
  }

  return {
    ...commonMining,
    type,
    baseToken,
    quoteToken,
  };
}

export function transformStrToBN(raw: any, decimals: number | undefined) {
  const result = new BigNumber(raw);
  // console.log('v2 raw', raw, result.isNaN(), result.toString());
  if (result.isNaN() || decimals == undefined) {
    return undefined;
  }
  return result.div(`1e${decimals}`);
}

export function transformRawMiningToMyCreatedMining(
  obj: ElementType<
    NonNullable<
      NonNullable<
        ReturnType<
          Exclude<
            typeof MiningApi.graphql.fetchMyCreatedMiningList['__apiType'],
            undefined
          >
        >['mining_list']
      >['list']
    >
  >,
): MyCreatedMiningI | null {
  if (!obj) {
    return null;
  }
  const baseMining = transformRawMiningToBaseMining(obj);
  if (!baseMining) {
    return null;
  }
  const { chainId, type, miningContractAddress, stakeTokenAddress } =
    baseMining;
  if (!['single', 'lptoken'].includes(type)) {
    return null;
  }

  const baseToken = checkSourceToken(obj.baseToken);
  const quoteToken = checkSourceToken(obj.quoteToken);
  const participantsNum = Number(obj.participantsNum);
  const apyBN = obj.baseApy ? new BigNumber(obj.baseApy) : undefined;
  const { rewardTokenInfos } = obj;
  const rewardTokenList = checkRewardTokenList({
    rewardTokenInfos,
    startBlock: obj.startBlock,
    endBlock: obj.endBlock,
    startTime: obj.startTime,
    endTime: obj.endTime,
    blockNumber: obj.blockNumber,
  });
  const { status } = getMiningStatusByTimestamp({
    rewardTokenInfoList: rewardTokenList,
  });

  return {
    id: `${chainId}-${stakeTokenAddress}-${miningContractAddress}`.toLowerCase(),
    chainId,
    name: obj.title ?? undefined,
    participantsNum: Number.isInteger(participantsNum)
      ? participantsNum
      : undefined,
    apy: apyBN && !apyBN.isNaN() ? apyBN : undefined,
    type: type as MyCreatedMiningI['type'],
    miningContractAddress,
    token: baseToken,
    lpToken: {
      id: stakeTokenAddress,
      baseToken,
      quoteToken,
    },
    rewardTokenList,
    status,
    isGSP: obj.isGSP ?? false,
    isNewERCMineV3: obj.isNewERCMineV3 ?? false,
  };
}

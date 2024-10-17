import { ExcludeNone, MiningApi, MiningStatusE } from '@dodoex/api';
import { BoxProps } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction } from 'react';
import { TokenInfo } from '../../hooks/Token';

export type FetchMiningList = ExcludeNone<
  ReturnType<
    Exclude<typeof MiningApi.graphql.fetchMiningList['__apiType'], undefined>
  >['mining_list']
>['list'];
export type FetchMiningListItem = ExcludeNone<FetchMiningList>[0] | undefined;

export type MiningTopTabType = null | 'all' | 'staked' | 'created';
export type MiningTabType = 'active' | 'ended';
export type OperateType = null | 'stake' | 'unstake' | 'claim';

export interface MiningTokenI {
  address: string | undefined;
  decimals: number | undefined;
  symbol: string | undefined;
}

/** The original token corresponding to lptoken has a price */
export interface MiningERC20TokenI extends MiningTokenI {
  usdPrice: BigNumber | undefined;
  logoImg: string | undefined;
}

/** lptoken, a token obtained by pledging the original token, has no price */
export interface MiningLpTokenI extends MiningTokenI {}

/** Reward tokens */
export interface MiningRewardTokenI extends MiningERC20TokenI {
  /**
   * Block height when rewards start to be released: If not configured, it defaults to undefined and is considered to have ended.
   */
  startBlock: BigNumber | undefined;
  /**
   * The timestamp corresponding to the block height when rewards start to be released; unit: seconds
   */
  startTime: BigNumber | undefined;
  /**
   * Block height released after reward ends: If not configured, it defaults to undefined and is considered to have ended.
   */
  endBlock: BigNumber | undefined;
  /**
   * The timestamp corresponding to the block height released after the reward ends; unit: seconds
   */
  endTime: BigNumber | undefined;
  /** The number of rewards released per block */
  rewardPerBlock: BigNumber | undefined;

  /** The apy returned by the interface is inaccurate and not timely. It is only used for initial rendering and subsequent front-end calculations */
  initialApr: BigNumber | undefined;

  blockNumber: BigNumber | undefined;
}

export interface ReviewedMiningRewardTokenI
  extends Pick<
    MiningRewardTokenI,
    'rewardPerBlock' | 'startBlock' | 'endBlock' | 'startTime' | 'endTime'
  > {
  workThroughReward: BigNumber | undefined;
  lastFlagBlock: BigNumber | undefined;

  rewardVault: string | undefined;
}

/**
 * One mining project may correspond to multiple mining contracts. For example, classic mining bilateral pledge can obtain respective lpToken and then pledge them into different mining contracts. This mining project is equivalent to two mining projects, 1 to 2 , but the front end needs to be displayed on a card
 *
 * Avoid using identifiers such as base or quote in the data structure, and use array records to record this kind of 1-to-2 mining.
 */
export interface MiningMiningI {
  /** lpToken.address-miningContractAddress */
  id: string;
  // pair-stake There are two original tokens
  sourceToken: Array<MiningERC20TokenI>;

  lpToken: MiningLpTokenI;
  // lpTokenStatus: MiningStatusE;

  /** Mining contract: one mining contract corresponds to one lptoken */
  miningContractAddress: string | undefined;
  // /**
  // * The starting block height of the mining activity (the starting block height of the earliest reward token released among multiple reward tokens)
  // */
  // startBlockHeight: BigNumber | undefined;
  /**
   * The v2 version has only one reward token; v3 may have multiple;
   */
  rewardTokenList: MiningRewardTokenI[];
}

export interface BaseMiningI {
  chainId: number;
  type: 'dvm' | 'single' | 'classical' | 'vdodo' | 'lptoken';
  version: '2' | '3';
  stakeTokenAddress: string;
  miningContractAddress: string;
  quoteLpTokenMiningContractAddress?: string;
}

export enum LpTokenPlatformID {
  dodo,
  pancakeV2,
}

export interface CommonMiningI
  extends Pick<BaseMiningI, 'chainId' | 'version' | 'stakeTokenAddress'> {
  /** `${chainId}-${BaseMiningI.stakeTokenAddress}-${BaseMiningI.miningContractAddress}`.toLowerCase() */
  id: string;

  name: string | undefined;

  source: 'official' | 'unofficial';

  lpTokenPlatformID: LpTokenPlatformID;

  miningMinings: [MiningMiningI] | [MiningMiningI, MiningMiningI];

  miningTotalDollar?: string | number | null;

  isGSP: boolean;
  isNewERCMineV3: boolean;
}

interface SingleMiningI extends CommonMiningI {
  type: 'single' | 'vdodo';
}

interface PairMiningI extends CommonMiningI {
  type: 'dvm' | 'classical' | 'lptoken';
  baseToken: MiningERC20TokenI;
  quoteToken: MiningERC20TokenI;
}

export type TabMiningI = SingleMiningI | PairMiningI;

export interface MiningWithBalanceI {
  lpTokenAccountBalance: BigNumber | undefined;
  lpTokenAccountStakedBalance: BigNumber | undefined;
  rewardTokenWithBalanceMap: Map<string, BigNumber | undefined>;
}

export interface MiningPoolContractDataI {
  midPrice: BigNumber | undefined;
  baseTokenReserve: BigNumber | undefined;
  quoteTokenReserve: BigNumber | undefined;
}

export interface MiningWithContractDataI extends MiningWithBalanceI {
  lpTokenMiningBalance: BigNumber | undefined;
  lpTokenTotalSupply: BigNumber | undefined;
}

export interface CompositeMiningContractDataI extends MiningPoolContractDataI {
  balanceDataMap: Map<MiningMiningI['id'], MiningWithContractDataI>;
  chainId: number;
}

export interface MyCreatedMiningRewardTokenI extends MiningRewardTokenI {}

export interface MyCreatedMiningI {
  id: string;
  chainId: number;
  type: 'single' | 'lptoken';
  miningContractAddress: string;
  participantsNum: number | undefined;
  apy: BigNumber | undefined;
  name: string | undefined;
  token: MiningERC20TokenI;

  lpToken: {
    /** pair address */
    id: string;
    baseToken: MiningERC20TokenI;
    quoteToken: MiningERC20TokenI;
  };
  status: MiningStatusE;
  rewardTokenList: MyCreatedMiningRewardTokenI[];

  isGSP: boolean;
  isNewERCMineV3: boolean;
}

export interface RewardUpdateHistoryItemI {
  rewardToken: TokenInfo;
  updateTime: number;
  endBlockBN: BigNumber;
  dailyReward: BigNumber | null;
  totalReward: BigNumber | null;
  rewardPerBlockBN: BigNumber;
}

export interface LiquidityMigrationInfo {
  chainId: number;
  miningContractAddress: string;
  stakeTokenAddress: string;
  newMiningContractAddress: string;
  newStakeTokenAddress: string;
}

export interface MiningRewardTokenWithAprI extends MiningRewardTokenI {
  apr: BigNumber | undefined;
  pendingReward: BigNumber | undefined;
}

export interface MiningRewardTokenWithTagI extends MiningRewardTokenWithAprI {
  symbolEle: JSX.Element | string | undefined;
}

export interface MiningStakeTokenWithAmountI extends MiningERC20TokenI {
  unstakedSourceTokenAmount: BigNumber | undefined;
  unstakedSourceTokenAmountUSD: BigNumber | undefined;
  sourceTokenAmount: BigNumber | undefined;
  sourceTokenAmountUSD: BigNumber | undefined;
  valueLockedAmount: BigNumber | undefined;
}

export interface OperateDataProps {
  operateType: OperateType;
  setOperateType: Dispatch<SetStateAction<OperateType>>;
  miningItem: TabMiningI;
  balanceDataMap: CompositeMiningContractDataI['balanceDataMap'] | undefined;

  totalRewardUSD: BigNumber | undefined;
  stakedTokenUSD: BigNumber | undefined;
  rewardTokenList: MiningRewardTokenWithTagI[];
  stakedTokenWithAmountList: MiningStakeTokenWithAmountI[];

  onClose?: () => void;
  setShareModalVisible?: Dispatch<SetStateAction<boolean>>;

  refetchBalance: () => void;
  refetchAfterClaim: () => void;

  titleSectionVisible: boolean;
  associatedMineSectionVisible: boolean;
  associatedMineSectionShort?: boolean;
  sx?: BoxProps['sx'];

  addLiquidityEnable: boolean;

  externalAddLiquidityCallback?: () => void;

  miningStatusList: {
    status: MiningStatusE;
    firstStartTime: BigNumber | undefined;
    lastEndTime: BigNumber | undefined;
    currentTime: BigNumber;
  }[];

  rewardTokenWithAprListArray: MiningRewardTokenWithAprI[][];

  addLiquiditySuccessfulPair: [boolean, boolean];
  lpTokenAccountStakedBalanceLoading: [boolean, boolean];
  lpTokenAccountBalanceLoading: [boolean, boolean];

  gspPairRiskWarningVisible?: boolean;
}

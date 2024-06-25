import { ExcludeNone, MiningApi } from '@dodoex/api';
import BigNumber from 'bignumber.js';

export type FetchMiningList = ExcludeNone<
  ReturnType<
    Exclude<typeof MiningApi.graphql.fetchMiningList['__apiType'], undefined>
  >['mining_list']
>['list'];
export type FetchMiningListItem = ExcludeNone<FetchMiningList>[0] | undefined;

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

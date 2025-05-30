/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** BigDecimal custom scalar type */
  BigDecimal: { input: any; output: any };
  /** BigInt custom scalar type */
  BigInt: { input: any; output: any };
  BigNumber: { input: any; output: any };
  /** Bytes custom scalar type */
  Bytes: { input: any; output: any };
  Dodochain_earnBytes: { input: any; output: any };
  JSON: { input: any; output: any };
  LiquidityBytes: { input: any; output: any };
};

export type Account = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Account_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Account_OrderBy = 'chain' | 'id';

export type AchievementAchievementDetail = {
  completed_count?: Maybe<Scalars['Int']['output']>;
  finish_rate?: Maybe<Scalars['String']['output']>;
  user_count?: Maybe<Scalars['Int']['output']>;
};

/** Achievement info & process info  */
export type AchievementAchievementPrcocess = {
  /** achievement id */
  achievement_id?: Maybe<Scalars['Int']['output']>;
  /** achivement group name */
  achivement_group?: Maybe<Scalars['String']['output']>;
  /** achivement active logo */
  activelogo?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<AchievementChain>;
  /** achievement condition */
  condition?: Maybe<AchievementCondition>;
  /** achivement default logo */
  defaultlogo?: Maybe<Scalars['String']['output']>;
  /** achievement description */
  description?: Maybe<Scalars['String']['output']>;
  /** achievement name */
  name?: Maybe<Scalars['String']['output']>;
  /** achievement process */
  process?: Maybe<AchievementProcess>;
  /** achievement reward */
  reward?: Maybe<Scalars['String']['output']>;
};

export type AchievementChain = {
  alias?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** Achievement config  */
export type AchievementCondition = {
  /** amount limit */
  amount?: Maybe<Scalars['Float']['output']>;
  /** num limit  */
  num?: Maybe<Scalars['Int']['output']>;
  /** Achievement template name  */
  template?: Maybe<Scalars['String']['output']>;
  /** time limit  */
  timeZoneRules?: Maybe<AchievementTimeZoneRules>;
  /** Achievements type: num | amount */
  type?: Maybe<Scalars['String']['output']>;
};

export type AchievementDetail_Filter = {
  achievement_id: Scalars['String']['input'];
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AchievementMe_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user: Scalars['String']['input'];
};

/** process info  */
export type AchievementProcess = {
  /** amount process */
  amount?: Maybe<Scalars['Float']['output']>;
  /** completed time ,if value is null ,means incomplete */
  completed_at?: Maybe<Scalars['String']['output']>;
  /** num process */
  num?: Maybe<Scalars['Int']['output']>;
  /** amount  limit,same as condition.amount */
  target_amount?: Maybe<Scalars['Float']['output']>;
  /** num limit,same as condition.num */
  target_num?: Maybe<Scalars['Int']['output']>;
  /** Achievement template name  */
  template?: Maybe<Scalars['String']['output']>;
  /** time limit,same as condition.timeZoneRules */
  timeZoneRules?: Maybe<AchievementTimeZoneRules>;
  /** Achievements type: num | amount */
  type?: Maybe<Scalars['String']['output']>;
};

/** time limit rules */
export type AchievementTimeZoneRules = {
  /** end time */
  end?: Maybe<Scalars['String']['output']>;
  /** time format  examples: YYYY-MM-DD HH:mm:ss,MM-DD HH:mm:ss,DD HH:mm:ss */
  format?: Maybe<Scalars['String']['output']>;
  /** start time */
  start?: Maybe<Scalars['String']['output']>;
};

/** user's AchievementPrcocess info  */
export type AchievementUserAchievementPrcocess = {
  constellation_series?: Maybe<Array<AchievementAchievementPrcocess>>;
  total_number_of_transactions?: Maybe<Array<AchievementAchievementPrcocess>>;
  total_volume?: Maybe<Array<AchievementAchievementPrcocess>>;
  user_invite?: Maybe<Array<AchievementAchievementPrcocess>>;
};

export type Activity_BannerActivityBanner = {
  bannerImg?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  describe?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Activity_Bannerqueryilter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AggregateFragment = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type AggregateFragment_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type AggregateFragment_OrderBy = 'chain' | 'id';

export type All = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type All_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type All_OrderBy = 'chain' | 'id';

export type AnnouncementAnnouncement = {
  endAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastPublishTime?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<AnnouncementMetadata>;
  sort?: Maybe<Scalars['Int']['output']>;
  startAt?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type AnnouncementAnnouncementList = {
  lastPublishId?: Maybe<Scalars['Int']['output']>;
  lastPublishTime?: Maybe<Scalars['String']['output']>;
  list?: Maybe<Array<Maybe<AnnouncementAnnouncement>>>;
};

export type AnnouncementMetadata = {
  background?: Maybe<Scalars['String']['output']>;
  buttonType?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  landingPageDisplay?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
};

export type Approval = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Approval_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Approval_OrderBy = 'chain' | 'id';

export type AuctionAuctionActive = {
  baseTokenSoldTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenTotalAmount?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  idoContractAddress?: Maybe<Scalars['String']['output']>;
  participantCount?: Maybe<Scalars['String']['output']>;
  quoteTokenCurrentPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenMaxPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenMinPrice?: Maybe<Scalars['String']['output']>;
};

export type AuctionAuctionDetail = {
  abbreviationImg?: Maybe<Scalars['String']['output']>;
  auctionDuration?: Maybe<Scalars['String']['output']>;
  auctionStartTime?: Maybe<Scalars['String']['output']>;
  auctionType?: Maybe<AuctionAuctionType>;
  baseToken?: Maybe<Scalars['String']['output']>;
  baseTokenDecimals?: Maybe<Scalars['Int']['output']>;
  baseTokenSoldTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenSymbol?: Maybe<Scalars['String']['output']>;
  baseTokenTotalAmount?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  claimDuration?: Maybe<Scalars['String']['output']>;
  claimStartTime?: Maybe<Scalars['String']['output']>;
  coverImg?: Maybe<Scalars['String']['output']>;
  describe?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  idoContractAddress?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  participantCount?: Maybe<Scalars['Int']['output']>;
  quoteToken?: Maybe<Scalars['String']['output']>;
  quoteTokenCurrentPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenDecimals?: Maybe<Scalars['Int']['output']>;
  quoteTokenMaxPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenMinPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenSymbol?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  whitelistApplyEndTime?: Maybe<Scalars['String']['output']>;
  whitelistApplyStartTime?: Maybe<Scalars['String']['output']>;
  whitelistPublicityUrl?: Maybe<Scalars['String']['output']>;
  whitelistUrl?: Maybe<Scalars['String']['output']>;
};

export type AuctionAuctionList = {
  abbreviationImg?: Maybe<Scalars['String']['output']>;
  auctionDuration?: Maybe<Scalars['String']['output']>;
  auctionStartTime?: Maybe<Scalars['String']['output']>;
  auctionType?: Maybe<AuctionAuctionType>;
  baseToken?: Maybe<Scalars['String']['output']>;
  baseTokenClaimableTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenClaimedTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenDecimals?: Maybe<Scalars['Int']['output']>;
  baseTokenSoldTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenSymbol?: Maybe<Scalars['String']['output']>;
  baseTokenTotalAmount?: Maybe<Scalars['String']['output']>;
  baseTokenTotalClaimAmount?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  claimDuration?: Maybe<Scalars['String']['output']>;
  claimStartTime?: Maybe<Scalars['String']['output']>;
  coverImg?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  idoContractAddress?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  participantCount?: Maybe<Scalars['Int']['output']>;
  quoteToken?: Maybe<Scalars['String']['output']>;
  quoteTokenCurrentPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenDecimals?: Maybe<Scalars['Int']['output']>;
  quoteTokenMaxPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenMinPrice?: Maybe<Scalars['String']['output']>;
  quoteTokenRaiseFundAmount?: Maybe<Scalars['String']['output']>;
  quoteTokenSymbol?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  whitelistApplyEndTime?: Maybe<Scalars['String']['output']>;
  whitelistApplyStartTime?: Maybe<Scalars['String']['output']>;
};

export type AuctionAuctionOperationRecord = {
  count?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<AuctionAuctionOperationRecordList>>>;
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
};

export type AuctionAuctionOperationRecordList = {
  amount?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  starter?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AuctionAuctionType = {
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AuctionactiveFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuctiondetailFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type AuctionlistFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type AuctionoperationRecordFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type AuthAccessTokenResponse = {
  access_token: Scalars['String']['output'];
};

export type AuthLoginInput = {
  /** the encrypted password */
  password: Scalars['String']['input'];
  /** user name */
  username: Scalars['String']['input'];
};

/** Avatar */
export type Avatar = {
  /** balance */
  balance: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** compnent ID */
  componentsID: Scalars['BigInt']['output'];
  /** id: TokenID */
  id: Scalars['ID']['output'];
};

/** User Component Balance */
export type AvatarBalance = {
  /** amount */
  amount: Scalars['BigInt']['output'];
  /** tokenid */
  avatar: Avatar;
  chain: Scalars['String']['output'];
  /** id:user-tokenid */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type AvatarBalance_Filter = {
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  avatar_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_gt?: InputMaybe<Scalars['String']['input']>;
  avatar_gte?: InputMaybe<Scalars['String']['input']>;
  avatar_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_lt?: InputMaybe<Scalars['String']['input']>;
  avatar_lte?: InputMaybe<Scalars['String']['input']>;
  avatar_not?: InputMaybe<Scalars['String']['input']>;
  avatar_not_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  avatar_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type AvatarBalance_OrderBy =
  | 'amount'
  | 'avatar'
  | 'chain'
  | 'id'
  | 'user';

export type AvatarDecomposeHistory = {
  /** avatar */
  avatar: Avatar;
  chain: Scalars['String']['output'];
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type AvatarDecomposeHistory_Filter = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  avatar_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_gt?: InputMaybe<Scalars['String']['input']>;
  avatar_gte?: InputMaybe<Scalars['String']['input']>;
  avatar_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_lt?: InputMaybe<Scalars['String']['input']>;
  avatar_lte?: InputMaybe<Scalars['String']['input']>;
  avatar_not?: InputMaybe<Scalars['String']['input']>;
  avatar_not_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  avatar_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type AvatarDecomposeHistory_OrderBy =
  | 'avatar'
  | 'chain'
  | 'hash'
  | 'id'
  | 'user';

export type AvatarMintHistory = {
  /** avatar */
  avatar: Avatar;
  chain: Scalars['String']['output'];
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type AvatarMintHistory_Filter = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  avatar_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_gt?: InputMaybe<Scalars['String']['input']>;
  avatar_gte?: InputMaybe<Scalars['String']['input']>;
  avatar_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_lt?: InputMaybe<Scalars['String']['input']>;
  avatar_lte?: InputMaybe<Scalars['String']['input']>;
  avatar_not?: InputMaybe<Scalars['String']['input']>;
  avatar_not_contains?: InputMaybe<Scalars['String']['input']>;
  avatar_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  avatar_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  avatar_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type AvatarMintHistory_OrderBy =
  | 'avatar'
  | 'chain'
  | 'hash'
  | 'id'
  | 'user';

export type AvatarTransferHistory = {
  chain: Scalars['String']['output'];
  /** from */
  from: Scalars['Bytes']['output'];
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** to */
  to: Scalars['Bytes']['output'];
  /** token id */
  tokenID: Scalars['BigInt']['output'];
};

export type AvatarTransferHistory_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenID?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenID_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type AvatarTransferHistory_OrderBy =
  | 'chain'
  | 'from'
  | 'hash'
  | 'id'
  | 'to'
  | 'tokenID';

export type Avatar_Filter = {
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  componentsID?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_gt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_gte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  componentsID_lt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_lte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_not?: InputMaybe<Scalars['BigInt']['input']>;
  componentsID_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Avatar_OrderBy = 'balance' | 'chain' | 'componentsID' | 'id';

export type Balance = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Balance_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Balance_OrderBy = 'chain' | 'id';

export type BidHistory = {
  /** action ：bid、cancle */
  action: Scalars['String']['output'];
  /** block */
  block: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** cp address */
  cp: CrowdPooling;
  /** fee */
  fee: Scalars['BigDecimal']['output'];
  /** hash */
  hash: Scalars['String']['output'];
  /** txid - logindex */
  id: Scalars['ID']['output'];
  /** quote */
  quote: Scalars['BigDecimal']['output'];
  /** share */
  share: Scalars['BigDecimal']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** user */
  user: User;
};

export type BidHistory_Filter = {
  action?: InputMaybe<Scalars['String']['input']>;
  action_contains?: InputMaybe<Scalars['String']['input']>;
  action_ends_with?: InputMaybe<Scalars['String']['input']>;
  action_gt?: InputMaybe<Scalars['String']['input']>;
  action_gte?: InputMaybe<Scalars['String']['input']>;
  action_in?: InputMaybe<Array<Scalars['String']['input']>>;
  action_lt?: InputMaybe<Scalars['String']['input']>;
  action_lte?: InputMaybe<Scalars['String']['input']>;
  action_not?: InputMaybe<Scalars['String']['input']>;
  action_not_contains?: InputMaybe<Scalars['String']['input']>;
  action_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  action_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  action_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  action_starts_with?: InputMaybe<Scalars['String']['input']>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  cp?: InputMaybe<Scalars['String']['input']>;
  cp_contains?: InputMaybe<Scalars['String']['input']>;
  cp_ends_with?: InputMaybe<Scalars['String']['input']>;
  cp_gt?: InputMaybe<Scalars['String']['input']>;
  cp_gte?: InputMaybe<Scalars['String']['input']>;
  cp_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cp_lt?: InputMaybe<Scalars['String']['input']>;
  cp_lte?: InputMaybe<Scalars['String']['input']>;
  cp_not?: InputMaybe<Scalars['String']['input']>;
  cp_not_contains?: InputMaybe<Scalars['String']['input']>;
  cp_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  cp_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cp_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  cp_starts_with?: InputMaybe<Scalars['String']['input']>;
  fee?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  quote?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  share?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  share_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  share_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type BidHistory_OrderBy =
  | 'action'
  | 'block'
  | 'chain'
  | 'cp'
  | 'fee'
  | 'hash'
  | 'id'
  | 'quote'
  | 'share'
  | 'timestamp'
  | 'updatedAt'
  | 'user';

export type BidPosition = {
  chain: Scalars['String']['output'];
  /** claimed */
  claimed: Scalars['Boolean']['output'];
  /** cp address */
  cp: CrowdPooling;
  /** user address - pair address */
  id: Scalars['ID']['output'];
  /** total quote invested */
  investedQuote: Scalars['BigDecimal']['output'];
  /** last bid time */
  lastTxTime: Scalars['BigInt']['output'];
  /** shares */
  shares: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** user */
  user: User;
};

export type BidPosition_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  claimed?: InputMaybe<Scalars['Boolean']['input']>;
  claimed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  claimed_not?: InputMaybe<Scalars['Boolean']['input']>;
  claimed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  cp?: InputMaybe<Scalars['String']['input']>;
  cp_contains?: InputMaybe<Scalars['String']['input']>;
  cp_ends_with?: InputMaybe<Scalars['String']['input']>;
  cp_gt?: InputMaybe<Scalars['String']['input']>;
  cp_gte?: InputMaybe<Scalars['String']['input']>;
  cp_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cp_lt?: InputMaybe<Scalars['String']['input']>;
  cp_lte?: InputMaybe<Scalars['String']['input']>;
  cp_not?: InputMaybe<Scalars['String']['input']>;
  cp_not_contains?: InputMaybe<Scalars['String']['input']>;
  cp_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  cp_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cp_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  cp_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  investedQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  investedQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastTxTime?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastTxTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  shares?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  shares_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  shares_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type BidPosition_OrderBy =
  | 'chain'
  | 'claimed'
  | 'cp'
  | 'id'
  | 'investedQuote'
  | 'lastTxTime'
  | 'shares'
  | 'updatedAt'
  | 'user';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number: Scalars['Int']['input'];
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Brand_Site_AnnouncementBrandSiteAnnouncement = {
  brand?: Maybe<Scalars['String']['output']>;
  endAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastPublishTime?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Brand_Site_AnnouncementMetadata>;
  sort?: Maybe<Scalars['Int']['output']>;
  startAt?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Brand_Site_AnnouncementBrandSiteAnnouncementList = {
  lastPublishId?: Maybe<Scalars['Int']['output']>;
  lastPublishTime?: Maybe<Scalars['String']['output']>;
  list?: Maybe<Array<Maybe<Brand_Site_AnnouncementBrandSiteAnnouncement>>>;
};

export type Brand_Site_AnnouncementMetadata = {
  background?: Maybe<Scalars['String']['output']>;
  buttonType?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  landingPageDisplay?: Maybe<Scalars['Boolean']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
};

export type Brand_Site_Announcementqueryilter = {
  brand?: InputMaybe<Scalars['String']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Brand_Site_BannerBrandSiteBanner = {
  bannerImg?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  describe?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Brand_Site_Bannerqueryilter = {
  brand?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BrowserChainInput = {
  chains: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type ChartKLineChartScope = 'ALL' | 'DODO';

export type ChartOhlcv2Input = {
  aChainId: Scalars['Int']['input'];
  aToken: Scalars['String']['input'];
  bChainId: Scalars['Int']['input'];
  bToken: Scalars['String']['input'];
  scale: Scalars['String']['input'];
  scope?: InputMaybe<ChartKLineChartScope>;
};

export type ChartOhlcvInput = {
  a: Scalars['String']['input'];
  b: Scalars['String']['input'];
  network: Scalars['Int']['input'];
  scale: Scalars['String']['input'];
  scope?: InputMaybe<ChartKLineChartScope>;
};

export type ClaimHistory = {
  chain: Scalars['String']['output'];
  /** id hash-logindex */
  id: Scalars['ID']['output'];
};

export type ClaimHistory_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type ClaimHistory_OrderBy = 'chain' | 'id';

export type Coinmarketcap_TokenCoinmarketcapTokenListFilter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Coinmarketcap_TokenCoinmarketcapTokenlist = {
  address?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  logoURI?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

/** Component */
export type Component = {
  /** balance */
  balance: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** token id */
  id: Scalars['ID']['output'];
};

/** User Component Balance */
export type ComponentBalance = {
  /** amount */
  amount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** tokenid */
  component: Component;
  /** id:user-tokenid */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type ComponentBalance_Filter = {
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  component?: InputMaybe<Scalars['String']['input']>;
  component_contains?: InputMaybe<Scalars['String']['input']>;
  component_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_gt?: InputMaybe<Scalars['String']['input']>;
  component_gte?: InputMaybe<Scalars['String']['input']>;
  component_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_lt?: InputMaybe<Scalars['String']['input']>;
  component_lte?: InputMaybe<Scalars['String']['input']>;
  component_not?: InputMaybe<Scalars['String']['input']>;
  component_not_contains?: InputMaybe<Scalars['String']['input']>;
  component_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  component_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type ComponentBalance_OrderBy =
  | 'amount'
  | 'chain'
  | 'component'
  | 'id'
  | 'user';

export type ComponentBurnHistory = {
  /** amount */
  amount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** token id */
  component: Component;
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type ComponentBurnHistory_Filter = {
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  component?: InputMaybe<Scalars['String']['input']>;
  component_contains?: InputMaybe<Scalars['String']['input']>;
  component_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_gt?: InputMaybe<Scalars['String']['input']>;
  component_gte?: InputMaybe<Scalars['String']['input']>;
  component_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_lt?: InputMaybe<Scalars['String']['input']>;
  component_lte?: InputMaybe<Scalars['String']['input']>;
  component_not?: InputMaybe<Scalars['String']['input']>;
  component_not_contains?: InputMaybe<Scalars['String']['input']>;
  component_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  component_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type ComponentBurnHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'component'
  | 'hash'
  | 'id'
  | 'user';

export type ComponentMintHistory = {
  /** amount */
  amount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** token id */
  component: Component;
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** user */
  user: Scalars['Bytes']['output'];
};

export type ComponentMintHistory_Filter = {
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  component?: InputMaybe<Scalars['String']['input']>;
  component_contains?: InputMaybe<Scalars['String']['input']>;
  component_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_gt?: InputMaybe<Scalars['String']['input']>;
  component_gte?: InputMaybe<Scalars['String']['input']>;
  component_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_lt?: InputMaybe<Scalars['String']['input']>;
  component_lte?: InputMaybe<Scalars['String']['input']>;
  component_not?: InputMaybe<Scalars['String']['input']>;
  component_not_contains?: InputMaybe<Scalars['String']['input']>;
  component_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  component_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  component_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  component_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type ComponentMintHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'component'
  | 'hash'
  | 'id'
  | 'user';

export type ComponentTransferHistory = {
  /** amount */
  amount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** from */
  from: Scalars['Bytes']['output'];
  /** tx hash */
  hash: Scalars['Bytes']['output'];
  /** id:transactionhash - log index */
  id: Scalars['ID']['output'];
  /** to */
  to: Scalars['Bytes']['output'];
  /** token id */
  tokenID: Scalars['BigInt']['output'];
};

export type ComponentTransferHistory_Filter = {
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenID?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenID_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenID_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type ComponentTransferHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'from'
  | 'hash'
  | 'id'
  | 'to'
  | 'tokenID';

export type Component_Filter = {
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Component_OrderBy = 'balance' | 'chain' | 'id';

export type Controller = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Controller_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Controller_OrderBy = 'chain' | 'id';

export type Cross_Chain_SwapCrossChainOrderCreate = {
  createdAt?: Maybe<Scalars['String']['output']>;
  extend?: Maybe<Cross_Chain_SwapExtend>;
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromChainId?: Maybe<Scalars['Int']['output']>;
  fromHash?: Maybe<Scalars['String']['output']>;
  fromTokenAddress?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  massage?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  slippage?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subStatus?: Maybe<Scalars['String']['output']>;
  toAddress?: Maybe<Scalars['String']['output']>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toChainId?: Maybe<Scalars['Int']['output']>;
  toHash?: Maybe<Scalars['String']['output']>;
  toTokenAddress?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainOrderDetail = {
  createdAt?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  extend?: Maybe<Cross_Chain_SwapExtend>;
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromChainId?: Maybe<Scalars['Int']['output']>;
  fromHash?: Maybe<Scalars['String']['output']>;
  fromTokenAddress?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  massage?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  slippage?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subStatus?: Maybe<Scalars['String']['output']>;
  toAddress?: Maybe<Scalars['String']['output']>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toChainId?: Maybe<Scalars['Int']['output']>;
  toHash?: Maybe<Scalars['String']['output']>;
  toTokenAddress?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainOrderList = {
  currentPage?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<Cross_Chain_SwapCrossChainOrderListList>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Cross_Chain_SwapCrossChainOrderListList = {
  createdAt?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  extend?: Maybe<Cross_Chain_SwapExtend>;
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromChainId?: Maybe<Scalars['Int']['output']>;
  fromHash?: Maybe<Scalars['String']['output']>;
  fromTokenAddress?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  massage?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  slippage?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subStatus?: Maybe<Scalars['String']['output']>;
  toAddress?: Maybe<Scalars['String']['output']>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toChainId?: Maybe<Scalars['Int']['output']>;
  toHash?: Maybe<Scalars['String']['output']>;
  toTokenAddress?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainOrderNewStatusList = {
  createdAt?: Maybe<Scalars['String']['output']>;
  crossChainOrderStatus?: Maybe<
    Array<Maybe<Cross_Chain_SwapCrossChainOrderStatus>>
  >;
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromChainId?: Maybe<Scalars['Int']['output']>;
  fromHash?: Maybe<Scalars['String']['output']>;
  fromTokenAddress?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  massage?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subStatus?: Maybe<Scalars['String']['output']>;
  toAddress?: Maybe<Scalars['String']['output']>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toChainId?: Maybe<Scalars['Int']['output']>;
  toHash?: Maybe<Scalars['String']['output']>;
  toTokenAddress?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainOrderStatus = {
  beforeStatus?: Maybe<Scalars['String']['output']>;
  beforeSubStatus?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isNew?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subStatus?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainRoute = {
  encodeParams?: Maybe<Scalars['JSON']['output']>;
  executionDuration?: Maybe<Scalars['Float']['output']>;
  fee?: Maybe<Scalars['JSON']['output']>;
  feeUSD?: Maybe<Scalars['String']['output']>;
  fromAmountUSD?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  productParams?: Maybe<Scalars['JSON']['output']>;
  step?: Maybe<Cross_Chain_SwapStep>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toAmountMin?: Maybe<Scalars['String']['output']>;
  toAmountMinUSD?: Maybe<Scalars['String']['output']>;
  toAmountUSD?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainRouteV2 = {
  amountLimit?: Maybe<Cross_Chain_SwapCrossChainRouteV2AmountLimit>;
  routes?: Maybe<Array<Maybe<Cross_Chain_SwapCrossChainRoute>>>;
  ruoteErrorCodes?: Maybe<
    Array<Maybe<Cross_Chain_SwapCrossChainRouteV2ErrorCode>>
  >;
};

export type Cross_Chain_SwapCrossChainRouteV2AmountLimit = {
  maxAmount?: Maybe<Scalars['String']['output']>;
  minAmount?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainRouteV2ErrorCode = {
  errCode?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapCrossChainTransactionEncode = {
  chainId?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  encodeId?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  gasLimit?: Maybe<Scalars['String']['output']>;
  gasPrice?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapEstimate = {
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromToken?: Maybe<Cross_Chain_SwapEstimateToken>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toToken?: Maybe<Cross_Chain_SwapEstimateToken>;
};

export type Cross_Chain_SwapEstimateToken = {
  address?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapExtend = {
  encodeId?: Maybe<Scalars['String']['output']>;
  fromToken?: Maybe<Scalars['JSON']['output']>;
  lifiBridge?: Maybe<Scalars['String']['output']>;
  refunded?: Maybe<Scalars['JSON']['output']>;
  route?: Maybe<Scalars['JSON']['output']>;
  toToken?: Maybe<Scalars['JSON']['output']>;
};

export type Cross_Chain_SwapIncludedStep = {
  estimate?: Maybe<Cross_Chain_SwapEstimate>;
  id?: Maybe<Scalars['String']['output']>;
  tool?: Maybe<Scalars['String']['output']>;
  toolDetails?: Maybe<Cross_Chain_SwapToolDetail>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapOrderRefundCountResult = {
  refundCount?: Maybe<Scalars['Int']['output']>;
};

export type Cross_Chain_SwapStep = {
  activityData?: Maybe<Scalars['JSON']['output']>;
  approvalAddress?: Maybe<Scalars['String']['output']>;
  includedSteps?: Maybe<Array<Maybe<Cross_Chain_SwapIncludedStep>>>;
  isNeedApproval?: Maybe<Scalars['Boolean']['output']>;
  tool?: Maybe<Scalars['String']['output']>;
  toolDetails?: Maybe<Cross_Chain_SwapToolDetail>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapToolDetail = {
  key?: Maybe<Scalars['String']['output']>;
  logoURI?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_SwapdodoOrderListData = {
  from?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderCreateData = {
  extend?: InputMaybe<Cross_Chain_SwaporderCreateDataExtend>;
  fromAddress?: InputMaybe<Scalars['String']['input']>;
  fromAmount?: InputMaybe<Scalars['String']['input']>;
  fromChainId?: InputMaybe<Scalars['Int']['input']>;
  fromTokenAddress?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  slippage?: InputMaybe<Scalars['Float']['input']>;
  toAddress?: InputMaybe<Scalars['String']['input']>;
  toAmount?: InputMaybe<Scalars['String']['input']>;
  toChainId?: InputMaybe<Scalars['Int']['input']>;
  toTokenAddress?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderCreateDataExtend = {
  encodeId?: InputMaybe<Scalars['String']['input']>;
  lifiBridge?: InputMaybe<Scalars['String']['input']>;
  productParams?: InputMaybe<Scalars['JSON']['input']>;
  route?: InputMaybe<Cross_Chain_SwaporderCreateDataExtendRoute>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderCreateDataExtendRoute = {
  executionDuration?: InputMaybe<Scalars['Float']['input']>;
  fee?: InputMaybe<Scalars['JSON']['input']>;
  feeUSD?: InputMaybe<Scalars['String']['input']>;
  step?: InputMaybe<Scalars['JSON']['input']>;
  toAmount?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderDetailData = {
  orderId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderListData = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderNewStatusData = {
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaporderRefundCountData = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaprouteData = {
  feePercent?: InputMaybe<Scalars['Float']['input']>;
  fromAddress?: InputMaybe<Scalars['String']['input']>;
  fromAmount?: InputMaybe<Scalars['String']['input']>;
  fromChainId?: InputMaybe<Scalars['Int']['input']>;
  fromTokenAddress?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Cross_Chain_SwaprouteDataOptions>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  toAddress?: InputMaybe<Scalars['String']['input']>;
  toChainId?: InputMaybe<Scalars['Int']['input']>;
  toTokenAddress?: InputMaybe<Scalars['String']['input']>;
};

export type Cross_Chain_SwaprouteDataOptions = {
  slippage?: InputMaybe<Scalars['Float']['input']>;
};

export type Cross_Chain_SwaptransactionEncodeData = {
  encodeParams?: InputMaybe<Scalars['JSON']['input']>;
  product?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Cross_Chain_TokenCrossChainPair = {
  fromChainId?: Maybe<Scalars['Int']['output']>;
  fromChainToken?: Maybe<Scalars['String']['output']>;
  fromChainTokenAttributeLabels?: Maybe<
    Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>
  >;
  fromChainTokenDecimals?: Maybe<Scalars['Int']['output']>;
  fromChainTokenFuncLabels?: Maybe<
    Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>
  >;
  fromChainTokenName?: Maybe<Scalars['String']['output']>;
  fromChainTokenSymbol?: Maybe<Scalars['String']['output']>;
  toChainId?: Maybe<Scalars['Int']['output']>;
  toChainToken?: Maybe<Scalars['String']['output']>;
  toChainTokenAttributeLabels?: Maybe<
    Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>
  >;
  toChainTokenDecimals?: Maybe<Scalars['Int']['output']>;
  toChainTokenFuncLabels?: Maybe<
    Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>
  >;
  toChainTokenName?: Maybe<Scalars['String']['output']>;
  toChainTokenSymbol?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_TokenCrossChainProduct = {
  extend?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isProduction?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_TokenCrossChainToken = {
  address?: Maybe<Scalars['String']['output']>;
  attributeLabels?: Maybe<Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>>;
  chain?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  funcLabels?: Maybe<Array<Maybe<Cross_Chain_TokenCrossChainTokenLabel>>>;
  id?: Maybe<Scalars['Int']['output']>;
  logoImg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_TokenCrossChainTokenLabel = {
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Cross_Chain_TokenCrossChainTokenPair = {
  chains?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  tokenPairs?: Maybe<Array<Maybe<Cross_Chain_TokenCrossChainPair>>>;
};

export type Cross_Chain_TokenCrossChainTokenlist = {
  chains?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  maxTransactionAmount?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<Maybe<Cross_Chain_TokenCrossChainProduct>>>;
  tokens?: Maybe<Array<Maybe<Cross_Chain_TokenCrossChainToken>>>;
};

export type Cross_Chain_TokentokenPairFilter = {
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Cross_Chain_TokentokenlistFilter = {
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CrowdPooling = {
  /** base token */
  baseToken: Token;
  /** bid end time */
  bidEndTime: Scalars['BigInt']['output'];
  /** bid start time */
  bidStartTime: Scalars['BigInt']['output'];
  /** clam end time */
  calmEndTime: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** create time */
  createTime: Scalars['BigInt']['output'];
  /** creator */
  creator: Scalars['Bytes']['output'];
  /** created dvm address */
  dvm?: Maybe<Pair>;
  /** pool feerate */
  feeRate?: Maybe<Scalars['BigInt']['output']>;
  /** freeze duration */
  freezeDuration: Scalars['BigInt']['output'];
  /** i */
  i: Scalars['BigInt']['output'];
  /** cp address */
  id: Scalars['ID']['output'];
  /** investors count = creators */
  investorsCount: Scalars['BigInt']['output'];
  /** is overcap stop */
  isOvercapStop?: Maybe<Scalars['Boolean']['output']>;
  /** k */
  k: Scalars['BigInt']['output'];
  /** liquidator */
  liquidator: Scalars['Bytes']['output'];
  /** mt fee rate model */
  mtFeeRateModel: Scalars['Bytes']['output'];
  /** total quote in pool */
  poolQuote: Scalars['BigDecimal']['output'];
  /** pool quote cap */
  poolQuoteCap: Scalars['BigDecimal']['output'];
  /** quote token */
  quoteToken: Token;
  /** serial number */
  serialNumber: Scalars['BigInt']['output'];
  /** settle state */
  settled: Scalars['Boolean']['output'];
  /** token claim duration */
  tokenClaimDuration?: Maybe<Scalars['BigInt']['output']>;
  /** token cliff rate */
  tokenCliffRate?: Maybe<Scalars['BigInt']['output']>;
  /** token vesting duration */
  tokenVestingDuration?: Maybe<Scalars['BigInt']['output']>;
  /** total base */
  totalBase: Scalars['BigDecimal']['output'];
  /** total shares */
  totalShares: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** version */
  version?: Maybe<Scalars['BigInt']['output']>;
  /** vesting duration */
  vestingDuration: Scalars['BigInt']['output'];
};

export type CrowdPoolingDayData = {
  /** total quote canceled in durnation */
  canceledQuote: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** CrowdPooling */
  crowdPooling: CrowdPooling;
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** cp address - day id */
  id: Scalars['ID']['output'];
  /** invest count */
  investCount: Scalars['BigInt']['output'];
  /** total quote invest in durnation = taker tokens */
  investedQuote: Scalars['BigDecimal']['output'];
  /** investors count */
  investors: Scalars['BigInt']['output'];
  /** creator: newly investor */
  newcome: Scalars['BigInt']['output'];
  /** total quote in pool */
  poolQuote: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type CrowdPoolingDayData_Filter = {
  canceledQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  canceledQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_contains?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_ends_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_gt?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_gte?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_in?: InputMaybe<Array<Scalars['String']['input']>>;
  crowdPooling_lt?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_lte?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_contains?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  crowdPooling_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_starts_with?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  investCount?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investedQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  investedQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  investors?: InputMaybe<Scalars['BigInt']['input']>;
  investors_gt?: InputMaybe<Scalars['BigInt']['input']>;
  investors_gte?: InputMaybe<Scalars['BigInt']['input']>;
  investors_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investors_lt?: InputMaybe<Scalars['BigInt']['input']>;
  investors_lte?: InputMaybe<Scalars['BigInt']['input']>;
  investors_not?: InputMaybe<Scalars['BigInt']['input']>;
  investors_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newcome?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_gt?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_gte?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newcome_lt?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_lte?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_not?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type CrowdPoolingDayData_OrderBy =
  | 'canceledQuote'
  | 'chain'
  | 'crowdPooling'
  | 'date'
  | 'id'
  | 'investCount'
  | 'investedQuote'
  | 'investors'
  | 'newcome'
  | 'poolQuote'
  | 'updatedAt';

export type CrowdPoolingHourData = {
  /** total quote canceled in durnation */
  canceledQuote: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** CrowdPooling */
  crowdPooling: CrowdPooling;
  /** uinx timestamp(start of hour) */
  hour: Scalars['Int']['output'];
  /** cp address - hour id */
  id: Scalars['ID']['output'];
  /** invest count */
  investCount: Scalars['BigInt']['output'];
  /** total quote invest in durnation = taker tokens */
  investedQuote: Scalars['BigDecimal']['output'];
  /** investors count */
  investors: Scalars['BigInt']['output'];
  /** creator: newly investor */
  newcome: Scalars['BigInt']['output'];
  /** total quote in pool */
  poolQuote: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type CrowdPoolingHourData_Filter = {
  canceledQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  canceledQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  canceledQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_contains?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_ends_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_gt?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_gte?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_in?: InputMaybe<Array<Scalars['String']['input']>>;
  crowdPooling_lt?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_lte?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_contains?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  crowdPooling_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  crowdPooling_starts_with?: InputMaybe<Scalars['String']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  investCount?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  investCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investedQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  investedQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  investedQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  investors?: InputMaybe<Scalars['BigInt']['input']>;
  investors_gt?: InputMaybe<Scalars['BigInt']['input']>;
  investors_gte?: InputMaybe<Scalars['BigInt']['input']>;
  investors_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investors_lt?: InputMaybe<Scalars['BigInt']['input']>;
  investors_lte?: InputMaybe<Scalars['BigInt']['input']>;
  investors_not?: InputMaybe<Scalars['BigInt']['input']>;
  investors_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newcome?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_gt?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_gte?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newcome_lt?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_lte?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_not?: InputMaybe<Scalars['BigInt']['input']>;
  newcome_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type CrowdPoolingHourData_OrderBy =
  | 'canceledQuote'
  | 'chain'
  | 'crowdPooling'
  | 'hour'
  | 'id'
  | 'investCount'
  | 'investedQuote'
  | 'investors'
  | 'newcome'
  | 'poolQuote'
  | 'updatedAt';

export type CrowdPooling_Filter = {
  baseToken?: InputMaybe<Scalars['String']['input']>;
  baseToken_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_gt?: InputMaybe<Scalars['String']['input']>;
  baseToken_gte?: InputMaybe<Scalars['String']['input']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_lt?: InputMaybe<Scalars['String']['input']>;
  baseToken_lte?: InputMaybe<Scalars['String']['input']>;
  baseToken_not?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  bidEndTime?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidEndTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  bidEndTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidStartTime?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidStartTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  bidStartTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calmEndTime?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calmEndTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  calmEndTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  createTime?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  createTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creator?: InputMaybe<Scalars['Bytes']['input']>;
  creator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creator_not?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dvm?: InputMaybe<Scalars['String']['input']>;
  dvm_contains?: InputMaybe<Scalars['String']['input']>;
  dvm_ends_with?: InputMaybe<Scalars['String']['input']>;
  dvm_gt?: InputMaybe<Scalars['String']['input']>;
  dvm_gte?: InputMaybe<Scalars['String']['input']>;
  dvm_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dvm_lt?: InputMaybe<Scalars['String']['input']>;
  dvm_lte?: InputMaybe<Scalars['String']['input']>;
  dvm_not?: InputMaybe<Scalars['String']['input']>;
  dvm_not_contains?: InputMaybe<Scalars['String']['input']>;
  dvm_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dvm_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dvm_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dvm_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeRate?: InputMaybe<Scalars['String']['input']>;
  feeRate_contains?: InputMaybe<Scalars['String']['input']>;
  feeRate_ends_with?: InputMaybe<Scalars['String']['input']>;
  feeRate_gt?: InputMaybe<Scalars['String']['input']>;
  feeRate_gte?: InputMaybe<Scalars['String']['input']>;
  feeRate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feeRate_lt?: InputMaybe<Scalars['String']['input']>;
  feeRate_lte?: InputMaybe<Scalars['String']['input']>;
  feeRate_not?: InputMaybe<Scalars['String']['input']>;
  feeRate_not_contains?: InputMaybe<Scalars['String']['input']>;
  feeRate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  feeRate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feeRate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeRate_starts_with?: InputMaybe<Scalars['String']['input']>;
  freezeDuration?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freezeDuration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_not?: InputMaybe<Scalars['BigInt']['input']>;
  freezeDuration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  i?: InputMaybe<Scalars['BigInt']['input']>;
  i_gt?: InputMaybe<Scalars['BigInt']['input']>;
  i_gte?: InputMaybe<Scalars['BigInt']['input']>;
  i_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  i_lt?: InputMaybe<Scalars['BigInt']['input']>;
  i_lte?: InputMaybe<Scalars['BigInt']['input']>;
  i_not?: InputMaybe<Scalars['BigInt']['input']>;
  i_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  investorsCount?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  investorsCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  investorsCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  isOvercapStop?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_contains?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_ends_with?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_gt?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_gte?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_in?: InputMaybe<Array<Scalars['String']['input']>>;
  isOvercapStop_lt?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_lte?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_not?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_not_contains?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  isOvercapStop_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  isOvercapStop_starts_with?: InputMaybe<Scalars['String']['input']>;
  k?: InputMaybe<Scalars['BigInt']['input']>;
  k_gt?: InputMaybe<Scalars['BigInt']['input']>;
  k_gte?: InputMaybe<Scalars['BigInt']['input']>;
  k_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  k_lt?: InputMaybe<Scalars['BigInt']['input']>;
  k_lte?: InputMaybe<Scalars['BigInt']['input']>;
  k_not?: InputMaybe<Scalars['BigInt']['input']>;
  k_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidator?: InputMaybe<Scalars['Bytes']['input']>;
  liquidator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  liquidator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  liquidator_not?: InputMaybe<Scalars['Bytes']['input']>;
  liquidator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  liquidator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mtFeeRateModel?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_contains?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mtFeeRateModel_not?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolQuoteCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuoteCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteToken?: InputMaybe<Scalars['String']['input']>;
  quoteToken_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_lte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  serialNumber?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  serialNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  serialNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  settled?: InputMaybe<Scalars['Boolean']['input']>;
  settled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  settled_not?: InputMaybe<Scalars['Boolean']['input']>;
  settled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  tokenClaimDuration?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_contains?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_gt?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_gte?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenClaimDuration_lt?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_lte?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_not?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenClaimDuration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenClaimDuration_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_contains?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_gt?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_gte?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenCliffRate_lt?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_lte?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_not?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenCliffRate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenCliffRate_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_contains?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_gt?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_gte?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenVestingDuration_lt?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_lte?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_not?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenVestingDuration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenVestingDuration_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalShares?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalShares_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_contains?: InputMaybe<Scalars['String']['input']>;
  version_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_gt?: InputMaybe<Scalars['String']['input']>;
  version_gte?: InputMaybe<Scalars['String']['input']>;
  version_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_lt?: InputMaybe<Scalars['String']['input']>;
  version_lte?: InputMaybe<Scalars['String']['input']>;
  version_not?: InputMaybe<Scalars['String']['input']>;
  version_not_contains?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_starts_with?: InputMaybe<Scalars['String']['input']>;
  vestingDuration?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vestingDuration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_not?: InputMaybe<Scalars['BigInt']['input']>;
  vestingDuration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type CrowdPooling_OrderBy =
  | 'baseToken'
  | 'bidEndTime'
  | 'bidStartTime'
  | 'calmEndTime'
  | 'chain'
  | 'createTime'
  | 'creator'
  | 'dvm'
  | 'feeRate'
  | 'freezeDuration'
  | 'i'
  | 'id'
  | 'investorsCount'
  | 'isOvercapStop'
  | 'k'
  | 'liquidator'
  | 'mtFeeRateModel'
  | 'poolQuote'
  | 'poolQuoteCap'
  | 'quoteToken'
  | 'serialNumber'
  | 'settled'
  | 'tokenClaimDuration'
  | 'tokenCliffRate'
  | 'tokenVestingDuration'
  | 'totalBase'
  | 'totalShares'
  | 'updatedAt'
  | 'version'
  | 'vestingDuration';

export type Crowd_PoolingAccountItem = {
  address?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_PoolingChain = {
  alias?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Crowd_PoolingCountData = {
  fund_rise?: Maybe<Scalars['String']['output']>;
  pools?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Scalars['String']['output']>;
};

export type Crowd_PoolingCrowdPooling = {
  address?: Maybe<Scalars['String']['output']>;
  /** base token price on bid_end_time */
  base_price?: Maybe<Scalars['String']['output']>;
  base_symbol?: Maybe<Scalars['String']['output']>;
  base_token?: Maybe<Scalars['String']['output']>;
  bid_end_time?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  fund_rise?: Maybe<Scalars['String']['output']>;
  investors_count?: Maybe<Scalars['String']['output']>;
  /** quote token num */
  pool_quote?: Maybe<Scalars['String']['output']>;
  /** quote token  upper limit */
  pool_quote_cap?: Maybe<Scalars['String']['output']>;
  quote_base_rate?: Maybe<Scalars['String']['output']>;
  /** quote token price on bid_end_time */
  quote_price?: Maybe<Scalars['String']['output']>;
  quote_symbol?: Maybe<Scalars['String']['output']>;
  quote_token?: Maybe<Scalars['String']['output']>;
  /** total base token num */
  total_base?: Maybe<Scalars['String']['output']>;
};

export type Crowd_PoolingCrowdpoolingItem = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Crowd_PoolingChain>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_PoolingCrowdpoolingList = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Crowd_PoolingChain>;
  id?: Maybe<Scalars['Int']['output']>;
  votes?: Maybe<Array<Maybe<Crowd_PoolingVote>>>;
};

export type Crowd_PoolingCrowdpoolingVoteList = {
  account?: Maybe<Crowd_PoolingAccountItem>;
  address?: Maybe<Scalars['String']['output']>;
  crowdpooling?: Maybe<Crowd_PoolingCrowdpoolingItem>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_PoolingJwt = {
  jwt?: Maybe<Scalars['String']['output']>;
};

export type Crowd_PoolingVote = {
  accountId?: Maybe<Scalars['Int']['output']>;
  crowdpoolingId?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_Pooling_Read_ServerAccountItem = {
  address?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_Pooling_Read_ServerChain = {
  alias?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Crowd_Pooling_Read_ServerCrowdpoolingItem = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Crowd_Pooling_Read_ServerChain>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_Pooling_Read_ServerCrowdpoolingList = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Crowd_Pooling_Read_ServerChain>;
  id?: Maybe<Scalars['Int']['output']>;
  votes?: Maybe<Array<Maybe<Crowd_Pooling_Read_ServerVote>>>;
};

export type Crowd_Pooling_Read_ServerCrowdpoolingVoteList = {
  account?: Maybe<Crowd_Pooling_Read_ServerAccountItem>;
  address?: Maybe<Scalars['String']['output']>;
  crowdpooling?: Maybe<Crowd_Pooling_Read_ServerCrowdpoolingItem>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_Pooling_Read_ServerJwt = {
  jwt?: Maybe<Scalars['String']['output']>;
};

export type Crowd_Pooling_Read_ServerVote = {
  accountId?: Maybe<Scalars['Int']['output']>;
  crowdpoolingId?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Crowd_Pooling_Read_ServercrowdpoolingListFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Crowd_Pooling_Read_ServercrowdpoolingUnvoteData = {
  account?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  jwt?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type Crowd_Pooling_Read_ServercrowdpoolingVoteData = {
  account?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  crowdpoolingAddress?: InputMaybe<Scalars['String']['input']>;
  crowdpoolingCreator?: InputMaybe<Scalars['String']['input']>;
  jwt?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type Crowd_Pooling_Read_ServercrowdpoolingVoteListFilter = {
  accountAddress?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Crowd_PoolingcrowdpoolingListFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Crowd_PoolingcrowdpoolingUnvoteData = {
  account?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  jwt?: InputMaybe<Scalars['String']['input']>;
  signType: Scalars['String']['input'];
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type Crowd_PoolingcrowdpoolingVoteData = {
  account?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  crowdpoolingAddress?: InputMaybe<Scalars['String']['input']>;
  crowdpoolingCreator?: InputMaybe<Scalars['String']['input']>;
  jwt?: InputMaybe<Scalars['String']['input']>;
  signType: Scalars['String']['input'];
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type Crowd_PoolingcrowdpoolingVoteListFilter = {
  accountAddress?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Crowd_Poolinglist_Filter = {
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  top?: InputMaybe<Scalars['Int']['input']>;
};

export type D3mmAsset = {
  lpToken: D3mmToken;
  token: D3mmToken;
};

export type D3mmAssetDailyInterest = {
  /** 存款 */
  balanceUsd: Scalars['BigDecimal']['output'];
  date: Scalars['Int']['output'];
  /** 挖矿收益，未完成暂时是假数据 */
  interestUsd: Scalars['BigDecimal']['output'];
  /** 利息 */
  profitUsd: Scalars['BigDecimal']['output'];
};

export type D3mmAssetInfo = {
  address: Scalars['String']['output'];
  /** 余款 */
  balanceUsd: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  /** 总挖矿收益 */
  depositInterestUsd: Scalars['BigDecimal']['output'];
  /** Total Liquidity - Can Deposit Funds - Amount */
  depositable: Scalars['BigDecimal']['output'];
  /** Total Liquidity - Can Deposit Funds - Ratio */
  depositableRatio: Scalars['BigDecimal']['output'];
  /** Total Liquidity - Deposited Funds - Amount */
  deposited: Scalars['BigDecimal']['output'];
  /** Total Liquidity - Deposited Funds - Ratio */
  depositedRatio: Scalars['BigDecimal']['output'];
  /** apy的组成部分， 挖矿利率 */
  miningApy: Scalars['BigDecimal']['output'];
  /** Serve Fee APY */
  mtFeeApy: Scalars['BigDecimal']['output'];
  name: Scalars['String']['output'];
  /** @deprecated  */
  staked: Scalars['BigDecimal']['output'];
  /** apy的组成部分， 策略保底利率 */
  strategyApy: Scalars['BigDecimal']['output'];
  /**
   * 总策略保底收益
   * @deprecated
   */
  strategyProfitUsd: Scalars['BigDecimal']['output'];
  /** Fee APY */
  swapFeeApy: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  /** @deprecated  */
  unstaked: Scalars['BigDecimal']['output'];
};

export type D3mmAssetOperation = {
  amount: Scalars['BigDecimal']['output'];
  from?: Maybe<Scalars['String']['output']>;
  hash: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  to?: Maybe<Scalars['String']['output']>;
  /** dtoken代币 */
  token: D3mmToken;
  /** 操作类型 */
  type: D3mmAssetOperationType;
};

export type D3mmAssetOperationPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mmAssetOperation>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mmAssetOperationType =
  /** =Add */
  | 'Deposit'
  | 'TransferIn'
  | 'TransferOut'
  /** =Remove */
  | 'Withdraw';

export type D3mmAssetSimplifyStrategy = {
  address: Scalars['String']['output'];
  assets: Array<Maybe<D3mmTokenInfo>>;
  chainId: Scalars['Int']['output'];
  /** debt USD, 借款金额 */
  debtUsd: Scalars['BigDecimal']['output'];
  /** @deprecated Use feeUsd */
  feeChangesUsd: Scalars['BigDecimal']['output'];
  feeUsd: Scalars['BigDecimal']['output'];
  /**
   * @deprecated use marginUsd
   * @deprecated Use marginUsd
   */
  margin: Scalars['BigDecimal']['output'];
  /** 做市商的抵押金额/保证金 */
  marginUsd: Scalars['BigDecimal']['output'];
  /**
   * @deprecated use tvlUsd
   * @deprecated Use tvlUsd
   */
  tvl: Scalars['BigDecimal']['output'];
  tvlUsd: Scalars['BigDecimal']['output'];
  /**
   * @deprecated use debtUsd
   * @deprecated Use debtUsd
   */
  vault: Scalars['BigDecimal']['output'];
  /**
   * @deprecated use volumeUsd
   * @deprecated Use volumeUsd
   */
  volume: Scalars['BigDecimal']['output'];
  volumeUsd: Scalars['BigDecimal']['output'];
};

export type D3mmAssetSimplifyStrategyPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mmAssetSimplifyStrategy>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mmChainIdInput = {
  chainId: Scalars['Int']['input'];
};

export type D3mmChainPoolPaginationInput = {
  chainId: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pool: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type D3mmChainTokenPaginationInput = {
  chainId: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  token: Scalars['String']['input'];
};

export type D3mmChainUserPaginationInput = {
  chainId: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type D3mmChainUserTokenPaginationInput = {
  chainId: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  token: Scalars['String']['input'];
  user: Scalars['String']['input'];
};

export type D3mmLiquidityProviderDailyProfit = {
  apy: Scalars['BigDecimal']['output'];
  date: Scalars['Int']['output'];
  profit: Scalars['BigDecimal']['output'];
};

/**
 * Strategy Provider Funds in management = totalCollateralUsd + totalDebtUsd
 * Liquidity Provider Total Deposit = totalBalanceUsd + totalDebtUsd
 * V3 Pool Total Funds = totalBalanceUsd + totalCollateralUsd + totalDebtUsd"
 */
export type D3mmOverview = {
  lp7dTotalEarningUsd: Scalars['BigDecimal']['output'];
  /** 未完成暂时是假数据 */
  maxLpApy: Scalars['BigDecimal']['output'];
  maxSpApy: Scalars['BigDecimal']['output'];
  sp7dTotalEarningUsd: Scalars['BigDecimal']['output'];
  /** Liquidity Provider Total asset balances */
  totalBalanceUsd: Scalars['BigDecimal']['output'];
  /** Strategy Provider Total collaterals */
  totalCollateralUsd: Scalars['BigDecimal']['output'];
  /** Strategy Provider Total borrows */
  totalDebtUsd: Scalars['BigDecimal']['output'];
  /**
   * Liquidity Provider Total Deposit
   * @deprecated Use totalBalanceUsd + totalDebtUsd
   */
  totalDepositUsd: Scalars['BigDecimal']['output'];
  /**
   * Total Funds
   * @deprecated Use totalBalanceUsd + totalCollateralUsd
   */
  totalVaultUsd: Scalars['BigDecimal']['output'];
};

export type D3mmPoolDailySwap = {
  date: Scalars['Int']['output'];
  feeUsd: Scalars['BigDecimal']['output'];
  volumeUsd: Scalars['BigDecimal']['output'];
};

export type D3mmPoolInput = {
  chainId: Scalars['Int']['input'];
  pool: Scalars['String']['input'];
};

export type D3mmPoolSwap = {
  fee: Scalars['BigDecimal']['output'];
  fromAmount: Scalars['BigDecimal']['output'];
  fromToken: D3mmToken;
  hash: Scalars['String']['output'];
  time: Scalars['Int']['output'];
  toAmount: Scalars['BigDecimal']['output'];
  toToken: D3mmToken;
  trader: Scalars['String']['output'];
};

export type D3mmPoolSwapPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mmPoolSwap>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mmSimplifyAsset = {
  address: Scalars['String']['output'];
  balanceUsd: Scalars['BigDecimal']['output'];
  borrowApr: Scalars['BigDecimal']['output'];
  borrowed: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  interestUsd: Scalars['BigDecimal']['output'];
  limit: Scalars['BigDecimal']['output'];
  miningApy: Scalars['BigDecimal']['output'];
  name: Scalars['String']['output'];
  strategyApy: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
};

export type D3mmSimplifyAssetPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mmSimplifyAsset>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mmStrategyPool = {
  address: Scalars['String']['output'];
  assets: Array<Maybe<D3mmTokenInfo>>;
  chainId: Scalars['Int']['output'];
  /** LP Fund */
  debtUsd: Scalars['BigDecimal']['output'];
  /** Collateral Ratio */
  marginRate: Scalars['BigDecimal']['output'];
  /** SP Collateral */
  marginUsd: Scalars['BigDecimal']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** user address */
  owner: Scalars['String']['output'];
  /** 7d APR */
  recent7DAvgApr: Scalars['BigDecimal']['output'];
  /** Recent 7d Trading Volume */
  recentSwaps: Array<Maybe<D3mmPoolDailySwap>>;
  /** TVL */
  tvlUsd: Scalars['BigDecimal']['output'];
  /**
   * @deprecated use debtUsd
   * @deprecated Use debtUsd
   */
  vaultUsd: Scalars['BigDecimal']['output'];
  volumeUsd: Scalars['BigDecimal']['output'];
};

export type D3mmStrategyPoolAsset = {
  balance: Scalars['BigDecimal']['output'];
  changes: Scalars['BigDecimal']['output'];
  strategyChanges: Scalars['BigDecimal']['output'];
  token?: Maybe<D3mmToken>;
};

export type D3mmStrategyPoolInfo = {
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** Collateral Ratio */
  marginRate: Scalars['BigDecimal']['output'];
  /** SP Collateral */
  marginUsd: Scalars['BigDecimal']['output'];
  minimumMarginRate: Scalars['BigDecimal']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** 7d APR */
  recent7DAvgApr: Scalars['BigDecimal']['output'];
  totalFeeUsd: Scalars['BigDecimal']['output'];
  totalTvlUsd: Scalars['BigDecimal']['output'];
  totalVolumeUsd: Scalars['BigDecimal']['output'];
};

export type D3mmStrategyPoolPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mmStrategyPool>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mmStrategyProviderDailyInterest = {
  apy: Scalars['BigDecimal']['output'];
  date: Scalars['Int']['output'];
  interest: Scalars['BigDecimal']['output'];
};

export type D3mmStrategyProviderInfo = {
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  tvlUsd: Scalars['BigDecimal']['output'];
  vaultUsd: Scalars['BigDecimal']['output'];
  volumeUsd: Scalars['BigDecimal']['output'];
};

export type D3mmTimeScaleOptions = 'All' | 'Month' | 'Quarter' | 'Year';

export type D3mmToken = {
  address: Scalars['String']['output'];
  decimals: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type D3mmTokenInfo = {
  address: Scalars['String']['output'];
  amount: Scalars['BigDecimal']['output'];
  decimals: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type D3mmTokenInput = {
  chainId: Scalars['Int']['input'];
  token: Scalars['String']['input'];
};

export type D3mmTokenOptionalUserInput = {
  chainId: Scalars['Int']['input'];
  token: Scalars['String']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type D3mmUserCapitalsInfo = {
  apy: Scalars['BigDecimal']['output'];
  /** Deposit */
  balanceUsd: Scalars['BigDecimal']['output'];
  /** Mining Reward, 挖矿收益 */
  depositInterestUsd: Scalars['BigDecimal']['output'];
  /** Guaranteed Income, 策略保底收益 */
  strategyProfitUsd: Scalars['BigDecimal']['output'];
};

export type D3mmUserInput = {
  chainId: Scalars['Int']['input'];
  user: Scalars['String']['input'];
};

export type D3mtAssetPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mtAssetResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mtAssetResult = {
  /** 当前价格, 带小数 */
  currentPriceUsd: Scalars['BigDecimal']['output'];
  logo: Scalars['String']['output'];
  /** 近期价格 */
  recentPrices: Array<Maybe<Scalars['BigDecimal']['output']>>;
  /** 24H 变化率, 带小数 */
  relative24HChangeRate: Scalars['BigDecimal']['output'];
  supportedChainTokens: Array<Maybe<D3mtSupportedChainToken>>;
  symbol: Scalars['String']['output'];
};

export type D3mtListOrderInput = {
  direction: D3mtOrderDirection;
  field: D3mtOrderFields;
};

export type D3mtOptionalChainUserPositionStatusrPaginationInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<D3mtListOrderInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status: D3mtPositionStatus;
  user: Scalars['String']['input'];
};

export type D3mtOrderDirection = 'Asc' | 'Desc';

export type D3mtOrderFields =
  | 'APR'
  | 'ClosedTimestamp'
  | 'HeathFactor'
  | 'OpenedTimestamp'
  | 'PositionValueUsd'
  | 'ReturnValueUsd';

export type D3mtPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type D3mtPlatform = 'AAVE';

export type D3mtPositionPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<D3mtPositionResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type D3mtPositionResult = {
  /** 贷款利率+，带小数 */
  apr: Scalars['BigDecimal']['output'];
  /** 主币 */
  baseToken: D3mtToken;
  baseTokenLiquidationThreshold?: Maybe<Scalars['BigDecimal']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  closedBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  closedHash?: Maybe<Scalars['String']['output']>;
  closedLogIndex?: Maybe<Scalars['Int']['output']>;
  /** 关仓价格 */
  closedPrice?: Maybe<Scalars['BigDecimal']['output']>;
  /** close position Timestamp of this event  */
  closedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** 交易方向，当借币等于主币，则是做空主币，反之做多主币 */
  direction: D3mtTradeDirection;
  /** 手续费 */
  fee: Scalars['BigDecimal']['output'];
  /** 健康因子，带小数 */
  heathFactor: Scalars['BigDecimal']['output'];
  /** marginTrading-count */
  id: Scalars['String']['output'];
  /** 开仓时选的利率模式 */
  interestRateModel: Scalars['BigInt']['output'];
  /** 杠杆倍数，带小数 */
  leverage: Scalars['BigDecimal']['output'];
  /** 清算差值的增长率 */
  liquidationDifferenceAmountChangeRate: Scalars['BigDecimal']['output'];
  /** 清算价格 */
  liquidationPrice: Scalars['BigDecimal']['output'];
  /** margin trading */
  marginTrading: Scalars['String']['output'];
  /**  Block number of this event  */
  openedBlockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  openedHash: Scalars['String']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  openedLogIndex: Scalars['Int']['output'];
  /** open position Timestamp of this event  */
  openedTimestamp: Scalars['BigInt']['output'];
  /** platform */
  platfrom: D3mtPlatform;
  /** 仓位，带小数 */
  position?: Maybe<Scalars['BigDecimal']['output']>;
  /** 开仓后的增长率，带小数 */
  positionChangeRate?: Maybe<Scalars['BigDecimal']['output']>;
  /** 持仓金额 */
  positionUsd?: Maybe<Scalars['BigDecimal']['output']>;
  /** 仓位，带小数 */
  positionValue: Scalars['BigDecimal']['output'];
  /** 开仓后的增长率，带小数 */
  positionValueChangeRate: Scalars['BigDecimal']['output'];
  /** 持仓金额 */
  positionValueUsd?: Maybe<Scalars['BigDecimal']['output']>;
  /** 保证金数量 */
  principalValue: Scalars['BigDecimal']['output'];
  /** 保证金金额，带小数 */
  principalValueUsd?: Maybe<Scalars['BigDecimal']['output']>;
  /** 计价币 */
  quoteToken: D3mtToken;
  quoteTokenLiquidationThreshold?: Maybe<Scalars['BigDecimal']['output']>;
  /** 收益数量 */
  returnValue: Scalars['BigDecimal']['output'];
  /** 收益增长率 */
  returnValueChangeRate: Scalars['BigDecimal']['output'];
  /** 收益金额 */
  returnValueUsd: Scalars['BigDecimal']['output'];
  /** swap滑点 */
  slippageRate: Scalars['BigDecimal']['output'];
  /** 状态 */
  status: D3mtPositionStatus;
  /** 类型 */
  type: D3mtPositionType;
  /** user Bytes */
  user: Scalars['String']['output'];
};

/** 状态 */
export type D3mtPositionStatus =
  /** 平仓 */
  | 'Done'
  /** 持仓中 */
  | 'Ongoing';

/** 类型 */
export type D3mtPositionType =
  /** 全仓 */
  | 'CROSS_MARGIN_TRADING'
  /** 逐仓 */
  | 'ISOLATED_MARGIN_TRADING';

export type D3mtSupportedChainToken = {
  address: Scalars['String']['output'];
  borrowingEnabled: Scalars['Boolean']['output'];
  chainId: Scalars['Int']['output'];
  decimals: Scalars['BigInt']['output'];
  isActive: Scalars['Boolean']['output'];
  isFrozen: Scalars['Boolean']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  stableBorrowRateEnabled: Scalars['Boolean']['output'];
  symbol: Scalars['String']['output'];
  usageAsCollateralEnabled: Scalars['Boolean']['output'];
};

export type D3mtToken = {
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
};

/** 交易方向 */
export type D3mtTradeDirection =
  /** 做多 */
  | 'Long'
  /** 做空 */
  | 'Short';

export type D3mtUserInput = {
  user: Scalars['String']['input'];
};

export type D3mtUserOverviewResult = {
  /** 总资产金额, 带小数 */
  capitalUsd: Scalars['BigDecimal']['output'];
  /** 总收益金额, 带小数 */
  returnUsd: Scalars['BigDecimal']['output'];
  /** 总收益增长率, 带小数 */
  returnUsdChangeRate: Scalars['BigDecimal']['output'];
  /** 今日收益金额增长率, 带小数 */
  todayReturnChangeRate: Scalars['BigDecimal']['output'];
  /** 今日收益金额, 带小数 */
  todayReturnUsd: Scalars['BigDecimal']['output'];
};

export type D3mtUserPositionInput = {
  position: Scalars['String']['input'];
  user: Scalars['String']['input'];
};

export type Dodo = {
  chain: Scalars['String']['output'];
  /** decimals */
  decimals: Scalars['BigInt']['output'];
  /** address */
  id: Scalars['ID']['output'];
  /** name */
  name: Scalars['String']['output'];
  /** symbol */
  symbol: Scalars['String']['output'];
  /** totalsuppy */
  totalSupply: Scalars['BigInt']['output'];
};

export type Dodo_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Dodo_OrderBy =
  | 'chain'
  | 'decimals'
  | 'id'
  | 'name'
  | 'symbol'
  | 'totalSupply';

export type DailyScheduledTask = {
  accrualTimestamp: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  count: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type DailyScheduledTask_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accrualTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accrualTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  count?: InputMaybe<Scalars['BigInt']['input']>;
  count_gt?: InputMaybe<Scalars['BigInt']['input']>;
  count_gte?: InputMaybe<Scalars['BigInt']['input']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  count_lt?: InputMaybe<Scalars['BigInt']['input']>;
  count_lte?: InputMaybe<Scalars['BigInt']['input']>;
  count_not?: InputMaybe<Scalars['BigInt']['input']>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type DailyScheduledTask_OrderBy =
  | 'accrualTimestamp'
  | 'blockNumber'
  | 'count'
  | 'id'
  | 'updatedAt';

export type DashboardChainDailyData = {
  /** @deprecated Use 'd3mm_chain_daily_datas' query */
  list: Array<Maybe<DashboardDailyData>>;
  /**
   * pairs count every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  pairs: DashboardChainData;
  /**
   * pool count every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  pools: DashboardChainData;
  /**
   * transaction user count near 24 h every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  traders_near24h: DashboardChainData;
  /**
   * tvl every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  tvl: DashboardChainData;
  /**
   * transaction count near 24 h every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  txCount_near24h: DashboardChainData;
  /**
   * volume every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  volume: DashboardChainData;
  /**
   * volume near 24 h every chain
   * @deprecated Use 'd3mm_chain_summary_data' query
   */
  volume_near24h: DashboardChainData;
};

export type DashboardChainData = {
  /** data of all */
  all?: Maybe<Scalars['String']['output']>;
  /** data of arbitrum */
  arbitrum?: Maybe<Scalars['String']['output']>;
  /** data of aurora */
  aurora?: Maybe<Scalars['String']['output']>;
  /** data of avalanche */
  avalanche?: Maybe<Scalars['String']['output']>;
  /** data of base */
  base?: Maybe<Scalars['String']['output']>;
  /** data of boba */
  boba?: Maybe<Scalars['String']['output']>;
  /** data of bsc */
  bsc?: Maybe<Scalars['String']['output']>;
  /** data of ethereum */
  ethereum?: Maybe<Scalars['String']['output']>;
  /** data of heco */
  heco?: Maybe<Scalars['String']['output']>;
  /** data of linea */
  linea?: Maybe<Scalars['String']['output']>;
  /** data of okchain */
  okchain?: Maybe<Scalars['String']['output']>;
  /** data of optimism */
  optimism?: Maybe<Scalars['String']['output']>;
  /** data of polygon */
  polygon?: Maybe<Scalars['String']['output']>;
  /** data of croll */
  scr?: Maybe<Scalars['String']['output']>;
};

export type DashboardChainSummaryAndDailyData = {
  list: Array<Maybe<DashboardDailyChainData>>;
  /** pairs count every chain  */
  pairs: Scalars['JSON']['output'];
  /** pool count every chain */
  pools: Scalars['JSON']['output'];
  /** transaction user count near 24 h every chain */
  traders_near24h: Scalars['JSON']['output'];
  /** tvl every chain */
  tvl: Scalars['JSON']['output'];
  /** transaction count near 24 h every chain */
  txCount_near24h: Scalars['JSON']['output'];
  /** volume every chain */
  volume: Scalars['JSON']['output'];
  /** volume near 24 h every chain */
  volume_near24h: Scalars['JSON']['output'];
};

export type DashboardChangItem = {
  /** traction address count */
  addresses?: Maybe<Dashboardchange>;
  pairs?: Maybe<Dashboardchange>;
  pools?: Maybe<Dashboardchange>;
  tvl?: Maybe<Dashboardchange>;
  /** traction count */
  txes?: Maybe<Dashboardchange>;
  volume?: Maybe<Dashboardchange>;
};

export type DashboardDailyChainData = {
  /** date string like 2021-12-11 */
  date_str?: Maybe<Scalars['String']['output']>;
  /** timestamp */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** transaction user count every chain */
  traders: Scalars['JSON']['output'];
  /** tvl count every chain */
  tvl: Scalars['JSON']['output'];
  /** transaction count every chain */
  txCount: Scalars['JSON']['output'];
  /** volume  every chain */
  volume: Scalars['JSON']['output'];
};

export type DashboardDailyData = {
  /** date string like 2021-12-11 */
  date_str?: Maybe<Scalars['String']['output']>;
  /** timestamp */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** transaction user count every chain */
  traders?: Maybe<DashboardChainData>;
  /** tvl count every chain */
  tvl?: Maybe<DashboardChainData>;
  /** transaction count every chain */
  txCount?: Maybe<DashboardChainData>;
  /** volume  every chain */
  volume?: Maybe<DashboardChainData>;
};

export type DashboardDataCount = {
  chain?: Maybe<Scalars['String']['output']>;
  totalFee?: Maybe<Scalars['String']['output']>;
  totalTvl?: Maybe<Scalars['String']['output']>;
  totalVolume?: Maybe<Scalars['String']['output']>;
  turnoverRate7D?: Maybe<Scalars['String']['output']>;
  tvl7DAvg?: Maybe<Scalars['String']['output']>;
  txes?: Maybe<Scalars['String']['output']>;
  txesUsers?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Int']['output']>;
  volume7DAvg?: Maybe<Scalars['String']['output']>;
};

export type DashboardDataGroupByDate = {
  addresses?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use feeUsd */
  fee?: Maybe<Scalars['String']['output']>;
  feeUsd?: Maybe<Scalars['String']['output']>;
  mtFeeUsd?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use tvlUsd */
  tvl?: Maybe<Scalars['String']['output']>;
  tvlUsd?: Maybe<Scalars['String']['output']>;
  txes?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use volumeUsd */
  volume?: Maybe<Scalars['String']['output']>;
  volumeUsd?: Maybe<Scalars['String']['output']>;
};

export type DashboardPairData = {
  /** transaction count  */
  txes?: Maybe<Scalars['String']['output']>;
  /** transaction user count */
  txesUsers?: Maybe<Scalars['String']['output']>;
  volume?: Maybe<Scalars['String']['output']>;
};

export type DashboardPairGroup = {
  /** base token address */
  baseAddress?: Maybe<Scalars['String']['output']>;
  /** base token fee(base token num) */
  baseFee?: Maybe<Scalars['String']['output']>;
  baseMtFee?: Maybe<Scalars['String']['output']>;
  /** base token price now */
  basePrice?: Maybe<Scalars['String']['output']>;
  /** base token Reserve */
  baseReserve?: Maybe<Scalars['String']['output']>;
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base token total value locked usd */
  baseTvl?: Maybe<Scalars['String']['output']>;
  /** base tvl rate: base_tvl/tvl */
  baseTvlRate?: Maybe<Scalars['String']['output']>;
  /** base token volum near 24h */
  baseVolume?: Maybe<Scalars['String']['output']>;
  /** base token volum of all */
  baseVolumeCumulative?: Maybe<Scalars['String']['output']>;
  /** chain id */
  chainId?: Maybe<Scalars['Int']['output']>;
  /** pair creator */
  creator?: Maybe<Scalars['String']['output']>;
  /** updated at */
  date?: Maybe<Scalars['Int']['output']>;
  /**
   * fee near 24h, unit:usd
   * @deprecated Use 'feeNear24h'
   */
  fee?: Maybe<Scalars['String']['output']>;
  /** fee near 24h, unit:usd */
  feeNear24h?: Maybe<Scalars['String']['output']>;
  /** tvl unit:usd */
  liquidity?: Maybe<Scalars['String']['output']>;
  /** mt fee near 24h, unit:usd */
  mtFeeNear24h?: Maybe<Scalars['String']['output']>;
  /** network */
  network?: Maybe<Scalars['String']['output']>;
  /** pair owner */
  owner?: Maybe<Scalars['String']['output']>;
  /** baseAddress-quoteReserve */
  pair?: Maybe<Scalars['String']['output']>;
  /** Pair Address */
  pairAddress?: Maybe<Scalars['String']['output']>;
  /** pool type in:DPPVIRTUALDSPCLASSICALDVM */
  poolType?: Maybe<Scalars['String']['output']>;
  /** base price & quote price rate(basePrice/quotePrice) */
  price?: Maybe<Scalars['String']['output']>;
  /** quote token address */
  quoteAddress?: Maybe<Scalars['String']['output']>;
  /** quoteFee token fee(quoteFee token num) */
  quoteFee?: Maybe<Scalars['String']['output']>;
  quoteMtFee?: Maybe<Scalars['String']['output']>;
  /** quote token price now */
  quotePrice?: Maybe<Scalars['String']['output']>;
  /** quote token Reserve */
  quoteReserve?: Maybe<Scalars['String']['output']>;
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token total value locked usd */
  quoteTvl?: Maybe<Scalars['String']['output']>;
  /** quote tvl rate: quote_tvl/tvl */
  quoteTvlRate?: Maybe<Scalars['String']['output']>;
  /** quote token volum near 24h */
  quoteVolume?: Maybe<Scalars['String']['output']>;
  /** quote token volum of all */
  quoteVolumeCumulative?: Maybe<Scalars['String']['output']>;
  /** total fee */
  totalFee?: Maybe<Scalars['String']['output']>;
  /** total mt fee */
  totalMtFee?: Maybe<Scalars['String']['output']>;
  /** total volume */
  totalVolume?: Maybe<Scalars['String']['output']>;
  /** turnover near 24h */
  turnover?: Maybe<Scalars['String']['output']>;
  /** tvl unit:usd */
  tvl?: Maybe<Scalars['String']['output']>;
  /** traction address count 24 hours */
  txUserNear24h?: Maybe<Scalars['Int']['output']>;
  /** traction address count */
  txUsers?: Maybe<Scalars['Int']['output']>;
  /** traction count */
  txes?: Maybe<Scalars['Int']['output']>;
  /** traction count near 24 hours */
  txesNear24h?: Maybe<Scalars['Int']['output']>;
  /** volume near 24h unit:usd */
  volume?: Maybe<Scalars['String']['output']>;
};

export type DashboardPairList = {
  /** pair count */
  count?: Maybe<Scalars['Int']['output']>;
  /** pair data list */
  list?: Maybe<Array<Maybe<DashboardPairGroup>>>;
};

export type DashboardRate24Data = {
  changeIn24H?: Maybe<DashboardChangItem>;
  pages?: Maybe<Scalars['Int']['output']>;
  pairs?: Maybe<Scalars['JSON']['output']>;
  pairsCount?: Maybe<Scalars['Int']['output']>;
  poolsCount?: Maybe<Scalars['Int']['output']>;
  rateOfChange?: Maybe<DashboardrateOfChange>;
  totalFee?: Maybe<Scalars['String']['output']>;
  totalLiquidity?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  volume24H?: Maybe<Scalars['String']['output']>;
};

export type Dashboardchain_Daily_Data_Filter = {
  /** near ${day} days dat，default:30 */
  day?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dashboardchange = {
  /** now data */
  after?: Maybe<Scalars['String']['output']>;
  /** before 24h data */
  before?: Maybe<Scalars['String']['output']>;
};

export type Dashboardday_Filter = {
  chain: Scalars['String']['input'];
  day?: InputMaybe<Scalars['Int']['input']>;
  pair_address: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dashboardhour_Filter = {
  chain: Scalars['String']['input'];
  hour?: InputMaybe<Scalars['Int']['input']>;
  pair_address: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dashboardpair_Data_Filter = {
  /** pair address */
  address: Scalars['String']['input'];
  /** network */
  chain: Scalars['String']['input'];
  /** end timestamp */
  end?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** start timestamp */
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type Dashboardpair_Detail_Filter = {
  /** in:ethereum-mainnet,bsc,arbitrum,heco,polygon,kovan,rinkeby,okchain,aurora */
  chain: Scalars['String']['input'];
  pair_address: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dashboardrate24h_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** sort field in in:tvl,volume,fee,turnover */
  order_by?: InputMaybe<Scalars['String']['input']>;
  /** sort type filed  in:asc,desc,ASC,DESC' */
  order_direction?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type DashboardrateOfChange = {
  addresses?: Maybe<Scalars['String']['output']>;
  pairs?: Maybe<Scalars['String']['output']>;
  pools?: Maybe<Scalars['String']['output']>;
  tvl?: Maybe<Scalars['String']['output']>;
  txes?: Maybe<Scalars['String']['output']>;
  volume?: Maybe<Scalars['String']['output']>;
};

export type Dashboardsymbol_Detail_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  keys: Array<InputMaybe<Scalars['String']['input']>>;
  /** in:desc,asc,DESC,ASC,default: DESC */
  order?: InputMaybe<Scalars['String']['input']>;
  /** `in:tvl,volume,default:volume */
  order_by?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dashboardtype_Filter = {
  addresses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Dashboardtype_List_Filter = {
  addresses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  creator?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** pool type in:DPP,VIRTUAL,DSP,CLASSICAL,DVM */
  type?: InputMaybe<Scalars['String']['input']>;
};

export type DecimalValue = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type DecimalValue_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type DecimalValue_OrderBy = 'chain' | 'id';

export type DepositHistory = {
  chain: Scalars['String']['output'];
  /** id hash-logindex */
  id: Scalars['ID']['output'];
};

export type DepositHistory_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type DepositHistory_OrderBy = 'chain' | 'id';

export type Dip_WhitelistDipWhitelist = {
  deadlineVotes?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  sn?: Maybe<Scalars['String']['output']>;
  snapshotId?: Maybe<Scalars['String']['output']>;
};

export type Dip_WhitelistlistFilter = {
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DiscoverApy = {
  /** apy unit:% */
  apy?: Maybe<Scalars['Float']['output']>;
  /** token name */
  token?: Maybe<Scalars['String']['output']>;
};

/** base info  */
export type DiscoverBaseInfo = {
  /** base token name */
  baseToken?: Maybe<Scalars['String']['output']>;
  /** network name */
  network?: Maybe<Scalars['String']['output']>;
  /** quote token name */
  quotetoken?: Maybe<Scalars['String']['output']>;
};

export type DiscoverCrowdPooling = {
  /** ballot num */
  ballot?: Maybe<Scalars['Int']['output']>;
  /** base info  */
  base?: Maybe<DiscoverBaseInfo>;
  /** price  1 base.baseToken = ${price} base.quotetoken */
  price?: Maybe<Scalars['Float']['output']>;
  /** CrowdPooling target */
  target?: Maybe<Scalars['Int']['output']>;
};

export type DiscoverFragment = {
  /** last 7day annualized yield ，unit：% */
  change7d?: Maybe<Scalars['Float']['output']>;
  /** last 24hours annualized yield ，unit：% */
  change24h?: Maybe<Scalars['Float']['output']>;
  /** mainnet name  */
  mainnet?: Maybe<Scalars['String']['output']>;
  /** token name */
  name?: Maybe<Scalars['String']['output']>;
  /** price(usd) */
  price?: Maybe<Scalars['Float']['output']>;
  /** total Value Locked */
  totalValueLocked?: Maybe<Scalars['String']['output']>;
  /** last 24hours total yield  */
  tradingVolume24H?: Maybe<Scalars['String']['output']>;
};

export type DiscoverHot = {
  /** crowdPoolings info */
  crowdPoolings?: Maybe<Array<Maybe<DiscoverCrowdPooling>>>;
  /** Liquiditys info */
  liquiditys?: Maybe<Array<Maybe<DiscoverLiquidity>>>;
  /** minings info */
  minings?: Maybe<Array<Maybe<DiscoverMining>>>;
};

export type DiscoverLiquidity = {
  /** apy infos  */
  apys?: Maybe<Array<Maybe<DiscoverApy>>>;
  /** baseinfo */
  base?: Maybe<DiscoverBaseInfo>;
  /** total Value Locked */
  totalValueLocked?: Maybe<Scalars['String']['output']>;
};

export type DiscoverMining = {
  /** apy infos  */
  apys?: Maybe<Array<Maybe<DiscoverApy>>>;
  /** baseinfo */
  base?: Maybe<DiscoverBaseInfo>;
  /** reward token name  */
  rewardToken?: Maybe<Scalars['String']['output']>;
};

export type DiscoverToken = {
  /** last 7day annualized yield ，unit：% */
  change7d?: Maybe<Scalars['Float']['output']>;
  /** last 24hours annualized yield ，unit：% */
  change24h?: Maybe<Scalars['Float']['output']>;
  /** mainnet name */
  mainnet?: Maybe<Scalars['String']['output']>;
  /** token name */
  name?: Maybe<Scalars['String']['output']>;
  /** price(usd) */
  price?: Maybe<Scalars['Float']['output']>;
  /** total Value Locked */
  totalValueLocked?: Maybe<Scalars['String']['output']>;
  /** last 24hours total yield  */
  tradingVolume24H?: Maybe<Scalars['String']['output']>;
};

export type DodoAvatar = {
  /** Avatars count */
  avatarsCount: Scalars['BigInt']['output'];
  /** Avatars holders count */
  avatarsHoldersCount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** components count */
  componentsCount: Scalars['BigInt']['output'];
  /** components holders count */
  componentsHoldersCount: Scalars['BigInt']['output'];
  /** id:DodoAvatar */
  id: Scalars['ID']['output'];
};

export type DodoAvatar_Filter = {
  avatarsCount?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avatarsCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avatarsHoldersCount?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avatarsHoldersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  avatarsHoldersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  componentsCount?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  componentsCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  componentsCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  componentsHoldersCount?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  componentsHoldersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  componentsHoldersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type DodoAvatar_OrderBy =
  | 'avatarsCount'
  | 'avatarsHoldersCount'
  | 'chain'
  | 'componentsCount'
  | 'componentsHoldersCount'
  | 'id';

export type DodoDayData = {
  chain: Scalars['String']['output'];
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** fee usd */
  feeUSD: Scalars['BigDecimal']['output'];
  /** day id */
  id: Scalars['ID']['output'];
  /** maintainer fee usd */
  maintainerFeeUSD: Scalars['BigDecimal']['output'];
  /** transactions count */
  txCount: Scalars['BigInt']['output'];
  /** unique users */
  uniqueUsersCount: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** volume usd */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type DodoDayData_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  feeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maintainerFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainerFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uniqueUsersCount?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uniqueUsersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type DodoDayData_OrderBy =
  | 'chain'
  | 'date'
  | 'feeUSD'
  | 'id'
  | 'maintainerFeeUSD'
  | 'txCount'
  | 'uniqueUsersCount'
  | 'updatedAt'
  | 'volumeUSD';

export type DodoStarter = {
  chain: Scalars['String']['output'];
  /** id */
  id: Scalars['ID']['output'];
};

export type DodoStarter_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type DodoStarter_OrderBy = 'chain' | 'id';

export type DodoToken = {
  chain: Scalars['String']['output'];
  /** DODO Token */
  id: Scalars['ID']['output'];
  /** tokens count */
  tokens: Scalars['BigInt']['output'];
};

export type DodoToken_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  tokens?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokens_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type DodoToken_OrderBy = 'chain' | 'id' | 'tokens';

export type DodoZoo = {
  /** DIP3 maintainer fee usd  */
  DIP3MaintainerFeeUSD: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** crowdpooling count */
  crowdpoolingCount: Scalars['BigInt']['output'];
  /** fee usd */
  feeUSD: Scalars['BigDecimal']['output'];
  /** id */
  id: Scalars['ID']['output'];
  /** maintainer fee usd */
  maintainerFeeUSD: Scalars['BigDecimal']['output'];
  /** pairs count */
  pairCount: Scalars['BigInt']['output'];
  /** tokens count */
  tokenCount: Scalars['BigInt']['output'];
  /** transactions count */
  txCount: Scalars['BigInt']['output'];
  /** unique users */
  uniqueUsersCount: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** volume usd */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type DodoZoo_Filter = {
  DIP3MaintainerFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  DIP3MaintainerFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  DIP3MaintainerFeeUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  crowdpoolingCount?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crowdpoolingCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  crowdpoolingCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maintainerFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainerFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pairCount?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  tokenCount?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uniqueUsersCount?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uniqueUsersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  uniqueUsersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type DodoZoo_OrderBy =
  | 'DIP3MaintainerFeeUSD'
  | 'chain'
  | 'crowdpoolingCount'
  | 'feeUSD'
  | 'id'
  | 'maintainerFeeUSD'
  | 'pairCount'
  | 'tokenCount'
  | 'txCount'
  | 'uniqueUsersCount'
  | 'updatedAt'
  | 'volumeUSD';

export type Dodo_App_VersionDodoAppVersion = {
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  refreshType?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  urls?: Maybe<Array<Maybe<Dodo_App_VersionUrl>>>;
  version?: Maybe<Scalars['String']['output']>;
};

export type Dodo_App_VersionUrl = {
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Dodo_App_VersionnewFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dodo_Two_Anniversary_ActivityDodoTwoAnniversaryActivityList = {
  articleUrl?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isTop?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  logoImg?: Maybe<Scalars['String']['output']>;
  mediumPublishTime?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Dodo_Two_Anniversary_ActivitylistFilter = {
  language?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dodo_Two_Anniversary_H5_Qa_ActivitySaveDodoTwoAnniversaryH5QaActivity =
  {
    code?: Maybe<Scalars['Int']['output']>;
    message?: Maybe<Scalars['String']['output']>;
    success?: Maybe<Scalars['Boolean']['output']>;
  };

export type Dodo_Two_Anniversary_H5_Qa_ActivitysaveData = {
  address?: InputMaybe<Scalars['String']['input']>;
};

export type DodochainEarnedToken = {
  amount: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  token: DodochainToken;
};

/** 邀请状态 */
export type DodochainInviteStatus =
  /** 已被邀请 */
  | 'Invited'
  /** 已经质押后不能添加邀请者 */
  | 'Staked'
  /** 未被邀请 */
  | 'Uninvited';

export type DodochainInviteStatusResult = {
  acceptedAt?: Maybe<Scalars['String']['output']>;
  inviterAddress?: Maybe<Scalars['String']['output']>;
  inviterCode?: Maybe<Scalars['String']['output']>;
  status: DodochainInviteStatus;
};

export type DodochainInviteeResult = {
  acceptedAt: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  user: Scalars['String']['output'];
};

export type DodochainInviteesPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodochainInviteeResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DodochainMinePool = {
  id: Scalars['String']['output'];
  minePoolType: Scalars['String']['output'];
};

export type DodochainOrder = {
  /**  tvl, totalTwigs, totalTokenBonus */
  orderBy?: InputMaybe<Scalars['String']['input']>;
  /** desc asc' */
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};

export type DodochainOverview = {
  tvl: Scalars['BigDecimal']['output'];
  tvlDetails: Array<Maybe<DodochainTvlDetail>>;
};

export type DodochainPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type DodochainStakeDashboardDataAsset = {
  amount: Scalars['BigDecimal']['output'];
  chainId?: Maybe<Scalars['Int']['output']>;
  info?: Maybe<Scalars['String']['output']>;
  token?: Maybe<DodochainToken>;
  tvl: Scalars['BigDecimal']['output'];
  /** Eigenlayer AVS 区分是Restaked Assets还是Liquid Staking Tokens(lst) */
  type?: Maybe<Scalars['String']['output']>;
};

export type DodochainStakeDashboardDataResult = {
  assets: Array<Maybe<DodochainStakeDashboardDataAsset>>;
  /** Eigenlayer AVS Liquid Staking Tokens 所有token数量 */
  liquidStakingTokensTotalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  name: Scalars['String']['output'];
  totalTvl: Scalars['BigDecimal']['output'];
  /** 数据更新时间 */
  updatedAt: Scalars['BigInt']['output'];
};

export type DodochainToken = {
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DodochainTvlDetail = {
  chainId: Scalars['Int']['output'];
  token: DodochainToken;
  tvl: Scalars['BigDecimal']['output'];
};

export type DodochainTwigsMineOverview = {
  /** BTC 质押资产TVL */
  btcTvl: Scalars['BigDecimal']['output'];
  totalTokenBonus: Array<Maybe<DodochainEarnedToken>>;
  /** 总共分配的Twigs */
  totalTwigs: Scalars['BigDecimal']['output'];
};

export type DodochainTwigsMinePaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodochainTwigsMineResult>>;
  orderBy?: Maybe<Scalars['String']['output']>;
  orderDirection?: Maybe<Scalars['String']['output']>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DodochainTwigsMineResult = {
  baseToken: DodochainToken;
  chainId: Scalars['Int']['output'];
  isEnd: Scalars['Boolean']['output'];
  isStarted: Scalars['Boolean']['output'];
  lpToken: DodochainToken;
  minePool: DodochainMinePool;
  quoteToken: DodochainToken;
  totalTokenBonus: Array<Maybe<DodochainEarnedToken>>;
  totalTwigs: Scalars['BigDecimal']['output'];
  tvl: Scalars['BigDecimal']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type DodochainUserAcceptInvitationInput = {
  /** referrer user invite code */
  inviteCode: Scalars['String']['input'];
  /** sign message */
  message: Scalars['String']['input'];
  /** wallet signature */
  signature: Scalars['String']['input'];
  /** sign timestamp */
  timestamp: Scalars['String']['input'];
  /** user address */
  user: Scalars['String']['input'];
};

export type DodochainUserInput = {
  user: Scalars['String']['input'];
};

export type DodochainUserPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type DodochainUserPointsDetailPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodochainUserPointsDetailResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DodochainUserPointsDetailResult = {
  points: Scalars['BigDecimal']['output'];
  /** 积分来源类型：质押积分、邀请积分、活动积分 */
  sourceType: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type DodochainUserPointsResult = {
  /** 邀请用户得到的积分 */
  invitePoints: Scalars['BigDecimal']['output'];
  /** 积分排行榜的位置 */
  leaderboardPosition: Scalars['Int']['output'];
  /** 质押挖矿得到的积分 */
  stakedPoints: Scalars['BigDecimal']['output'];
  totalPoints: Scalars['BigDecimal']['output'];
  /** 积分更新时间 */
  updatedAt: Scalars['BigInt']['output'];
};

export type DodochainUserStakedHistoryPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodochainUserStakedHistoryResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DodochainUserStakedHistoryResult = {
  amount: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  hash: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  token: DodochainToken;
  updatedAt: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type DodochainUserStakedPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodochainUserStakedResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  stakedTotalUsd: Scalars['BigDecimal']['output'];
};

export type DodochainUserStakedResult = {
  amount: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  token: DodochainToken;
  updatedAt: Scalars['BigInt']['output'];
  user: Scalars['String']['output'];
};

export type DodochainUserTwigsMinePaginationResult = {
  count: Scalars['Int']['output'];
  earnedTotalTokenList: Array<Maybe<DodochainEarnedToken>>;
  earnedTotalTwigs: Scalars['BigDecimal']['output'];
  joined: Scalars['Int']['output'];
  list: Array<Maybe<DodochainUserTwigsMineResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  stakedTotalUsd: Scalars['BigDecimal']['output'];
};

export type DodochainUserTwigsMineResult = {
  baseToken: DodochainToken;
  baseTokenBalance: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  earnedTokenList: Array<Maybe<DodochainEarnedToken>>;
  earnedTwigs: Scalars['BigDecimal']['output'];
  isEnd: Scalars['Boolean']['output'];
  isStarted: Scalars['Boolean']['output'];
  lpToken: DodochainToken;
  minePool: DodochainMinePool;
  quoteToken: DodochainToken;
  quoteTokenBalance: Scalars['BigDecimal']['output'];
  stakedUsd: Scalars['BigDecimal']['output'];
  totalTokenBonus: Array<Maybe<DodochainEarnedToken>>;
  totalTwigs: Scalars['BigDecimal']['output'];
  tvl: Scalars['BigDecimal']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type Dodochain_ActivityActivityCategorizey =
  | 'Claim'
  | 'Liquidity'
  | 'Stake';

export type Dodochain_ActivityActivityPaginationResult = {
  categorizey: Dodochain_ActivityActivityCategorizey;
  count: Scalars['Int']['output'];
  list: Array<Maybe<Dodochain_ActivityActivityResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type Dodochain_ActivityActivityResult = {
  hash: Scalars['String']['output'];
  /** 是一个数组，如果是LP Remove那就是Lp Toekn, 如果是Lp Add那就是一个或多个token */
  pay: Array<Maybe<Dodochain_ActivityAssetInfo>>;
  receive: Array<Maybe<Dodochain_ActivityAssetInfo>>;
  status: Dodochain_ActivityActivityStatus;
  timestamp: Scalars['Int']['output'];
  type: Dodochain_ActivityActivityType;
};

export type Dodochain_ActivityActivityStatus =
  | 'Failed'
  | 'Loading'
  | 'Reset'
  | 'Succeed';

export type Dodochain_ActivityActivityType =
  | 'Add'
  | 'Claim'
  | 'Remove'
  | 'Stake'
  | 'Unstake';

export type Dodochain_ActivityAssetInfo = {
  amount: Scalars['BigDecimal']['output'];
  liquidity?: Maybe<Dodochain_ActivityLiquidity>;
  title: Scalars['String']['output'];
  token?: Maybe<Dodochain_ActivityToken>;
  type: Dodochain_ActivityAssetInfoType;
};

export type Dodochain_ActivityAssetInfoType = 'Lp' | 'Token';

export type Dodochain_ActivityLiquidity = {
  /** base Token */
  baseToken?: Maybe<Dodochain_ActivityToken>;
  /** pool address */
  pool?: Maybe<Scalars['String']['output']>;
  /** pool type */
  poolType?: Maybe<Scalars['String']['output']>;
  /** quote token */
  quoteToken?: Maybe<Dodochain_ActivityToken>;
};

export type Dodochain_ActivityToken = {
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_ActivityUserInput = {
  user: Scalars['String']['input'];
};

export type Dodochain_ActivityUserPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type Dodochain_AssetsApyData = {
  miningBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  miningQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_AssetsAssetsData = {
  claimableRewardsData?: Maybe<Dodochain_AssetsClaimableRewardsData>;
  lpDepositedData?: Maybe<Dodochain_AssetsLpDepositedData>;
  stakedData?: Maybe<Dodochain_AssetsStakedData>;
  walletBalanceData?: Maybe<Dodochain_AssetsWalletBalanceData>;
};

export type Dodochain_AssetsClaimableRewardsData = {
  list: Array<Maybe<Dodochain_AssetsClaimableRewardsInfo>>;
  totalUsd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsClaimableRewardsInfo = {
  liquidity?: Maybe<Dodochain_AssetsLiquidity>;
  miningPoolInfo?: Maybe<Dodochain_AssetsMiningPoolInfo>;
  rewards: Array<Maybe<Dodochain_AssetsRewardInfo>>;
  token?: Maybe<Dodochain_AssetsToken>;
  usd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsLp = {
  id?: Maybe<Scalars['String']['output']>;
  liquidityTokenBalance?: Maybe<Scalars['String']['output']>;
  liquidityTokenInMining?: Maybe<Scalars['String']['output']>;
};

export type Dodochain_AssetsLiquidity = {
  apy?: Maybe<Dodochain_AssetsApyData>;
  /** balance of base token */
  baseBalance?: Maybe<Scalars['BigDecimal']['output']>;
  /** balance of base token in mining */
  baseInMine?: Maybe<Scalars['BigDecimal']['output']>;
  /** base Token */
  baseToken?: Maybe<Dodochain_AssetsToken>;
  baseTokenPrice?: Maybe<Scalars['BigDecimal']['output']>;
  /** pool address */
  pool?: Maybe<Scalars['String']['output']>;
  /** pool type */
  poolType?: Maybe<Scalars['String']['output']>;
  /** balance of quote token */
  quoteBalance?: Maybe<Scalars['BigDecimal']['output']>;
  /** balance of quote token in mining */
  quoteInMine?: Maybe<Scalars['BigDecimal']['output']>;
  /** quote token */
  quoteToken?: Maybe<Dodochain_AssetsToken>;
  quoteTokenPrice?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_AssetsLiquidityAssetInfo = {
  liquidity?: Maybe<Dodochain_AssetsLiquidity>;
  liquidityIsStaked?: Maybe<Scalars['Boolean']['output']>;
  liquidityPositions?: Maybe<Array<Maybe<Dodochain_AssetsLp>>>;
  usd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsLpDepositedData = {
  list: Array<Maybe<Dodochain_AssetsLiquidityAssetInfo>>;
  totalUsd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsMiningPoolInfo = {
  miningPoolAddress?: Maybe<Scalars['String']['output']>;
  stakeTokenAddress?: Maybe<Scalars['String']['output']>;
  /**  miningPool version */
  version?: Maybe<Scalars['String']['output']>;
};

export type Dodochain_AssetsRewardInfo = {
  amount: Scalars['BigDecimal']['output'];
  token?: Maybe<Dodochain_AssetsToken>;
  usd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsStakedAssetInfo = {
  liquidity?: Maybe<Dodochain_AssetsLiquidity>;
  liquidityIsStaked?: Maybe<Scalars['Boolean']['output']>;
  liquidityPositions?: Maybe<Array<Maybe<Dodochain_AssetsLp>>>;
  /** 单币挖矿池 */
  token?: Maybe<Dodochain_AssetsToken>;
  tokenBalance?: Maybe<Scalars['String']['output']>;
  usd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsStakedData = {
  list: Array<Maybe<Dodochain_AssetsStakedAssetInfo>>;
  totalUsd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsToken = {
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_AssetsTokenAssetInfo = {
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  token?: Maybe<Dodochain_AssetsToken>;
  usd: Scalars['BigDecimal']['output'];
};

export type Dodochain_AssetsUserInput = {
  user: Scalars['String']['input'];
};

export type Dodochain_AssetsWalletBalanceData = {
  list: Array<Maybe<Dodochain_AssetsTokenAssetInfo>>;
  totalUsd: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardBridgeDataChart = {
  list: Array<Maybe<Dodochain_DashboardBridgeDataInfo>>;
  totalBridgeInUsd: Scalars['BigDecimal']['output'];
  totalBridgeOutUsd: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardBridgeDataChartInput = {
  /** near ${day} days dat，default:30 */
  day?: InputMaybe<Scalars['Int']['input']>;
  tokenSymbolFilter?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Dodochain_DashboardBridgeDataInfo = {
  bridgeInUsd: Scalars['BigDecimal']['output'];
  bridgeOutUsd: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
};

export type Dodochain_DashboardChatInput = {
  /** near ${day} days dat，default:30 */
  day?: InputMaybe<Scalars['Int']['input']>;
};

export type Dodochain_DashboardLiquidityStakeChart = {
  liquidityTvlList: Array<Maybe<Dodochain_DashboardLiquidityTvlInfo>>;
  mutichainTokenTvlList: Array<Maybe<Dodochain_DashboardMutichainTokenTvlInfo>>;
  mutichainTvlList: Array<Maybe<Dodochain_DashboardMutichainTvlInfo>>;
  tradingVolumeList: Array<Maybe<Dodochain_DashboardTradingVolumeInfo>>;
};

export type Dodochain_DashboardLiquidityStakeOverview = {
  liquidityTvl: Scalars['BigDecimal']['output'];
  mutichainTvl: Scalars['BigDecimal']['output'];
  tradingVolume: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardLiquidityTvlInfo = {
  baseAddress: Scalars['String']['output'];
  baseSymbol: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  pair: Scalars['String']['output'];
  quoteAddress: Scalars['String']['output'];
  quoteSymbol: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardMutichainTokenTvlInfo = {
  symbol: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  /** 获取最大TVL链上的token */
  token: Dodochain_DashboardToken;
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardMutichainTvlInfo = {
  chainId: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
  totalTvl: Scalars['BigDecimal']['output'];
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardOnlyEvmOrBtcInput = {
  onlyBTC?: InputMaybe<Scalars['Boolean']['input']>;
  onlyEVM?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dodochain_DashboardSupportChain = {
  chainId: Scalars['Int']['output'];
  tokenList: Array<Maybe<Dodochain_DashboardSupportTokenInfo>>;
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardSupportChains = {
  list: Array<Maybe<Dodochain_DashboardSupportChain>>;
  /** 总TVL */
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardSupportToken = {
  chainList: Array<Maybe<Dodochain_DashboardSupportTokenInfo>>;
  symbol: Scalars['String']['output'];
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardSupportTokenInfo = {
  amount: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  ratio: Scalars['BigDecimal']['output'];
  /** 取不同链上的token信息 */
  token: Dodochain_DashboardToken;
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardSupportTokens = {
  list: Array<Maybe<Dodochain_DashboardSupportToken>>;
  /** 总TVL */
  tvl: Scalars['BigDecimal']['output'];
};

export type Dodochain_DashboardToken = {
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_DashboardTradingVolumeInfo = {
  baseAddress: Scalars['String']['output'];
  baseSymbol: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  pair: Scalars['String']['output'];
  quoteAddress: Scalars['String']['output'];
  quoteSymbol: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  volume: Scalars['BigDecimal']['output'];
};

export type Dodochain_EarnApyData = {
  miningBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  miningQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Dodochain_EarnFilterState = {
  address?: InputMaybe<Scalars['String']['input']>;
  filterASymbol?: InputMaybe<Scalars['String']['input']>;
  filterBSymbol?: InputMaybe<Scalars['String']['input']>;
  filterOutOwn?: InputMaybe<Scalars['Boolean']['input']>;
  /** CLASSICAL DVM DPP DSP */
  filterTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hideSmallPrice?: InputMaybe<Scalars['Boolean']['input']>;
  viewOnlyOwn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Dodochain_EarnLp = {
  id?: Maybe<Scalars['String']['output']>;
  liquidityTokenBalance?: Maybe<Scalars['String']['output']>;
  liquidityTokenInMining?: Maybe<Scalars['String']['output']>;
};

export type Dodochain_EarnListInfo = {
  chainIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  chains?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  lqList?: Maybe<Array<Maybe<Dodochain_EarnLqList>>>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Dodochain_EarnLpToken = {
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  /** token name */
  name: Scalars['String']['output'];
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
};

export type Dodochain_EarnLqList = {
  id?: Maybe<Scalars['String']['output']>;
  isMyLiquidity?: Maybe<Scalars['Boolean']['output']>;
  isPrivatePool?: Maybe<Scalars['Boolean']['output']>;
  /** 和liquidity_list不同的就是是否支持Twigs挖矿 */
  isTwigsMine?: Maybe<Scalars['Boolean']['output']>;
  liquidityPositions?: Maybe<Array<Maybe<Dodochain_EarnLp>>>;
  pair?: Maybe<Dodochain_EarnPair>;
};

export type Dodochain_EarnOrder = {
  /** updatedAt tvl apy liquidity */
  orderBy?: InputMaybe<Scalars['String']['input']>;
  /** desc asc' */
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};

export type Dodochain_EarnPair = {
  apy?: Maybe<Dodochain_EarnApyData>;
  /** base LP token, for DPP is null, for dodo v1 lpToken is different */
  baseLpToken?: Maybe<Dodochain_EarnLpToken>;
  /** base token reserve */
  baseReserve: Scalars['BigDecimal']['output'];
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base token */
  baseToken: Dodochain_EarnToken;
  chain: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** createAtBlock */
  createdAtBlockNumber: Scalars['BigInt']['output'];
  /** createAtTimestamp */
  createdAtTimestamp: Scalars['BigInt']['output'];
  /** creator */
  creator: Scalars['Dodochain_earnBytes']['output'];
  /** lp fee base */
  feeBase: Scalars['BigDecimal']['output'];
  /** lp fee quote */
  feeQuote: Scalars['BigDecimal']['output'];
  /** lp fee of USD */
  feeUSD: Scalars['BigDecimal']['output'];
  /** i */
  i?: Maybe<Scalars['BigInt']['output']>;
  /** pool address */
  id: Scalars['ID']['output'];
  /** deposit base allowed */
  isDepositBaseAllowed: Scalars['Boolean']['output'];
  /** deposit quote allowed */
  isDepositQuoteAllowed: Scalars['Boolean']['output'];
  isMining?: Maybe<Scalars['Boolean']['output']>;
  /** trade allowed */
  isTradeAllowed: Scalars['Boolean']['output'];
  /** k */
  k?: Maybe<Scalars['BigInt']['output']>;
  /** last trade price (quote/base) */
  lastTradePrice: Scalars['BigDecimal']['output'];
  /** liquidity provider count */
  liquidityProviderCount: Scalars['BigInt']['output'];
  /** lp Fee Rate */
  lpFeeRate: Scalars['BigDecimal']['output'];
  /** maintainer */
  maintainer: Scalars['Dodochain_earnBytes']['output'];
  miningAddress?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** maintainer fee base token */
  mtFeeBase: Scalars['BigDecimal']['output'];
  /** maintainer fee quote token */
  mtFeeQuote: Scalars['BigDecimal']['output'];
  /** maintainer fee rate */
  mtFeeRate: Scalars['BigInt']['output'];
  /** mtFee Rate Model */
  mtFeeRateModel: Scalars['Dodochain_earnBytes']['output'];
  /** maintainer fee in USD */
  mtFeeUSD: Scalars['BigDecimal']['output'];
  /** owner */
  owner?: Maybe<Scalars['Dodochain_earnBytes']['output']>;
  /** quote LP token,for DPP is null, for dodo v1 lpToken is different */
  quoteLpToken?: Maybe<Dodochain_EarnLpToken>;
  /** quote token reserve */
  quoteReserve: Scalars['BigDecimal']['output'];
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token */
  quoteToken: Dodochain_EarnToken;
  /** pool source(default:null) */
  source?: Maybe<Scalars['String']['output']>;
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  tvl?: Maybe<Scalars['BigDecimal']['output']>;
  /** transactions count */
  txCount: Scalars['BigInt']['output'];
  /** pool type（CLASSICAL、DVM、DPP、DSP） */
  type: Scalars['String']['output'];
  /** untracked base volume */
  untrackedBaseVolume: Scalars['BigDecimal']['output'];
  /** untracked quote volume */
  untrackedQuoteVolume: Scalars['BigDecimal']['output'];
  /** trade volume of basetoken */
  volumeBaseToken: Scalars['BigDecimal']['output'];
  /** trade volume of quotetoken */
  volumeQuoteToken: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type Dodochain_EarnToken = {
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  /** token logo img */
  logoImg?: Maybe<Scalars['String']['output']>;
  /** token name */
  name: Scalars['String']['output'];
  /** price update time */
  priceUpdateTimestamp: Scalars['BigInt']['output'];
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** liquidity across all pairs */
  totalLiquidityOnDODO: Scalars['BigDecimal']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
  /** total trade volume */
  tradeVolume: Scalars['BigDecimal']['output'];
  /** total trade volume for bridge */
  tradeVolumeBridge: Scalars['BigDecimal']['output'];
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  /** transactions across all pairs */
  txCount: Scalars['BigInt']['output'];
  /** untracked volume */
  untrackedVolume: Scalars['BigDecimal']['output'];
  /** usd price(only stable coin and classical pool has usd price) */
  usdPrice: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
  /** traded volume of USD for bridge */
  volumeUSDBridge: Scalars['BigDecimal']['output'];
};

export type Dodochain_Earnlist_Filter = {
  /** This field has been discarded for compatibility with the previous interface */
  chain?: InputMaybe<Scalars['String']['input']>;
  /** The default is all chains, including test chains */
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  filterState?: InputMaybe<Dodochain_EarnFilterState>;
  order?: InputMaybe<Dodochain_EarnOrder>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type DodochaintwigsMineInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<DodochainOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type DodochainuserStakedInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type DodochainuserTwigsMineInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type DodopointsChainOptionalUserInput = {
  chainId: Scalars['BigDecimal']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type DodopointsChainUserInput = {
  chainId: Scalars['BigDecimal']['input'];
  user: Scalars['String']['input'];
};

export type DodopointsChainUserPaginationInput = {
  chainId: Scalars['BigDecimal']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type DodopointsClaimedRecord = {
  amount: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  timestamp: Scalars['BigDecimal']['output'];
  token: Scalars['String']['output'];
};

export type DodopointsClaimedRecordPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodopointsClaimedRecord>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DodopointsDodoPointsActivityInfo = {
  describe: Scalars['String']['output'];
  fulfilledPeriodsCoefficient: Scalars['BigDecimal']['output'];
  fulfilledPeriodsNumber: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  periods: Array<Maybe<DodopointsPeriodInfo>>;
  totalPoints: Scalars['BigDecimal']['output'];
  url: Scalars['String']['output'];
};

export type DodopointsDodoPointsActivityRewardInfo = {
  endAt: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  periods: Array<Maybe<DodopointsDodoPointsPeriodRewardInfo>>;
  startAt: Scalars['Int']['output'];
  totalPoints: Scalars['BigDecimal']['output'];
};

export type DodopointsDodoPointsPeriodRewardInfo = {
  contractAddress: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  shareAmount: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type DodopointsPairPoints = {
  baseSymbol: Scalars['String']['output'];
  baseToken: Scalars['String']['output'];
  points: Scalars['BigDecimal']['output'];
  quoteSymbol: Scalars['String']['output'];
  quoteToken: Scalars['String']['output'];
};

export type DodopointsPeriodInfo = {
  decimals: Scalars['Int']['output'];
  endAt: Scalars['Int']['output'];
  fulfilled: Scalars['Boolean']['output'];
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  rules: Array<Maybe<DodopointsRuleInfo>>;
  shareAmount: Scalars['BigDecimal']['output'];
  startAt: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tradePairs: Array<Maybe<DodopointsTradePairInfo>>;
};

export type DodopointsPointRecord = {
  points: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigDecimal']['output'];
};

export type DodopointsPointRecordPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DodopointsPointRecord>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalPoints: Scalars['BigDecimal']['output'];
};

export type DodopointsRuleInfo = {
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  swapUsd: Scalars['BigDecimal']['output'];
};

export type DodopointsToken = {
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  logoImg: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type DodopointsTradePairInfo = {
  coefficient?: Maybe<Scalars['BigDecimal']['output']>;
  fromToken: DodopointsToken;
  toToken: DodopointsToken;
};

export type DonateHistory = {
  /** block */
  blockNumber: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** dodoAmount */
  dodoAmount: Scalars['BigDecimal']['output'];
  /** donors */
  donor: Scalars['Bytes']['output'];
  /** transaction hash - log index */
  id: Scalars['ID']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
};

export type DonateHistory_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  dodoAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dodoAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  donor?: InputMaybe<Scalars['Bytes']['input']>;
  donor_contains?: InputMaybe<Scalars['Bytes']['input']>;
  donor_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  donor_not?: InputMaybe<Scalars['Bytes']['input']>;
  donor_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  donor_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type DonateHistory_OrderBy =
  | 'blockNumber'
  | 'chain'
  | 'dodoAmount'
  | 'donor'
  | 'id'
  | 'timestamp';

export type DpointChainOptionalUserInput = {
  chainId: Scalars['BigDecimal']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type DpointChainUserInput = {
  chainId: Scalars['BigDecimal']['input'];
  user: Scalars['String']['input'];
};

export type DpointChainUserPaginationInput = {
  chainId: Scalars['BigDecimal']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type DpointClaimedRecord = {
  amount: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  timestamp: Scalars['BigDecimal']['output'];
  token: Scalars['String']['output'];
};

export type DpointClaimedRecordPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DpointClaimedRecord>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type DpointDpointActivityInfo = {
  describe: Scalars['String']['output'];
  fulfilledPeriodsCoefficient?: Maybe<Scalars['BigDecimal']['output']>;
  fulfilledPeriodsNumber?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  periods: Array<Maybe<DpointPeriodInfo>>;
  totalPoints: Scalars['BigDecimal']['output'];
  url: Scalars['String']['output'];
};

export type DpointDpointActivityRewardInfo = {
  endAt: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  periods: Array<Maybe<DpointDpointPeriodRewardInfo>>;
  startAt: Scalars['Int']['output'];
  totalPoints: Scalars['BigDecimal']['output'];
};

export type DpointDpointPeriodRewardInfo = {
  contractAddress: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  shareAmount: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type DpointPeriodInfo = {
  decimals: Scalars['Int']['output'];
  endAt: Scalars['Int']['output'];
  fulfilled: Scalars['Boolean']['output'];
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  rules: Array<Maybe<DpointRuleInfo>>;
  shareAmount: Scalars['BigDecimal']['output'];
  startAt: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tradePairs: Array<Maybe<DpointTradePairInfo>>;
};

export type DpointPointRecord = {
  points: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigDecimal']['output'];
};

export type DpointPointRecordPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<DpointPointRecord>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalPoints: Scalars['BigDecimal']['output'];
};

export type DpointRuleInfo = {
  num: Scalars['Int']['output'];
  points: Scalars['BigDecimal']['output'];
  swapUsd: Scalars['BigDecimal']['output'];
};

export type DpointToken = {
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  logoImg: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type DpointTradePairInfo = {
  coefficient?: Maybe<Scalars['BigDecimal']['output']>;
  fromToken: DpointToken;
  toToken: DpointToken;
};

export type Erc20AttributeLabelV2 = {
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Erc20Chain = {
  alias?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Erc20Domain = {
  env?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Erc20Erc20List = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Erc20Chain>;
  decimals?: Maybe<Scalars['Int']['output']>;
  domains?: Maybe<Array<Maybe<Erc20Domain>>>;
  isPopular?: Maybe<Scalars['Boolean']['output']>;
  isStableCurrency?: Maybe<Scalars['Boolean']['output']>;
  logo?: Maybe<Erc20Logo>;
  name?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  slippage?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  tokenlists?: Maybe<Array<Maybe<Erc20TokenList>>>;
};

export type Erc20Erc20V2List = {
  address?: Maybe<Scalars['String']['output']>;
  attributeLabels?: Maybe<Array<Maybe<Erc20AttributeLabelV2>>>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  domains?: Maybe<Array<Maybe<Erc20Domain>>>;
  erc20Extend?: Maybe<Scalars['JSON']['output']>;
  funcLabels?: Maybe<Array<Maybe<Erc20FuncLabelV2>>>;
  logoImg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  slippage?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  tokenlists?: Maybe<Array<Maybe<Erc20TokenListV2>>>;
};

export type Erc20FuncLabelV2 = {
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Erc20Logo = {
  url?: Maybe<Scalars['String']['output']>;
};

export type Erc20RelationList = {
  address?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  logoImg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  slippage?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Erc20TokenList = {
  chain?: Maybe<Erc20Chain>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Erc20TokenListV2 = {
  chainId?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Erc20_ExtendErc20Extend = {
  address?: Maybe<Scalars['String']['output']>;
  /** 购买交易税费 */
  buyTax?: Maybe<Scalars['BigNumber']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  /** 预测的滑点 */
  forecastSlippage?: Maybe<Scalars['BigNumber']['output']>;
  /** 卖出交易税费 */
  sellTax?: Maybe<Scalars['BigNumber']['output']>;
};

export type Erc20_ExtendErc20ExtendV2 = {
  aToken?: Maybe<Erc20_ExtendErc20ExtendV2TokenInfo>;
  bToken?: Maybe<Erc20_ExtendErc20ExtendV2TokenInfo>;
  /** 预测的滑点数组 */
  forecastSlippageList?: Maybe<Array<Maybe<Erc20_ExtendForecastSlippageInfo>>>;
};

export type Erc20_ExtendErc20ExtendV2TokenInfo = {
  address?: Maybe<Scalars['String']['output']>;
  /** 购买交易税费 */
  buyTax?: Maybe<Scalars['BigNumber']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  /** 管理后台默认配置的滑点值，或根据kind算的默认滑点值 */
  defaultSlippage?: Maybe<Scalars['BigNumber']['output']>;
  /** 分类 稳定币stable 主流币mainstream 长尾币long-tail */
  kind?: Maybe<Scalars['String']['output']>;
  /** 卖出交易税费 */
  sellTax?: Maybe<Scalars['BigNumber']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Erc20_ExtendForecastSlippageInfo = {
  /** 置信区间下界值 */
  confidenceIntervalLower?: Maybe<Scalars['BigNumber']['output']>;
  /** 置信区间上界值 */
  confidenceIntervalUpper?: Maybe<Scalars['BigNumber']['output']>;
  /** 置信值 0.78, 0.88, 0.98 */
  confidenceRatio?: Maybe<Scalars['BigNumber']['output']>;
  /** 预测的滑点 */
  forecastSlippage?: Maybe<Scalars['BigNumber']['output']>;
  /** 预测的价格点 */
  forecastValue?: Maybe<Scalars['BigNumber']['output']>;
};

export type Erc20_ExtendInputTokenInfo = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
};

export type Erc20_Extenderc20ExtendFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Erc20_Extenderc20ExtendV2Filter = {
  aToken?: InputMaybe<Erc20_ExtendInputTokenInfo>;
  bToken?: InputMaybe<Erc20_ExtendInputTokenInfo>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Erc20listFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Erc20listV2Filter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainIds?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Erc20relationListFilter = {
  attributeLabelKey?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  funcLabelKey?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Filter = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type FilterAdmin = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type FilterAdmin_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type FilterAdmin_OrderBy = 'chain' | 'id';

export type FilterNft = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type FilterNft_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type FilterNft_OrderBy = 'chain' | 'id';

export type FilterSpreadId = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type FilterSpreadId_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type FilterSpreadId_OrderBy = 'chain' | 'id';

export type Filter_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Filter_OrderBy = 'chain' | 'id';

export type FlashLoan = {
  /** base amount */
  baseAmount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** tx from address */
  from: Scalars['Bytes']['output'];
  /** transaction hash */
  hash: Scalars['String']['output'];
  /** transaction hash + "-" + index in swaps Transaction array */
  id: Scalars['ID']['output'];
  /** trading pair */
  pair?: Maybe<Pair>;
  /** quote amount */
  quoteAmount: Scalars['BigDecimal']['output'];
  /** msg.sender */
  sender: Scalars['Bytes']['output'];
  /** transaction timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type FlashLoan_Filter = {
  baseAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type FlashLoan_OrderBy =
  | 'baseAmount'
  | 'chain'
  | 'from'
  | 'hash'
  | 'id'
  | 'pair'
  | 'quoteAmount'
  | 'sender'
  | 'timestamp'
  | 'updatedAt'
  | 'volumeUSD';

export type Fragment = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Fragment_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Fragment_OrderBy = 'chain' | 'id';

export type Gas_FeederGasPrice = {
  /** transaction above percent */
  confidence: Scalars['Int']['output'];
  gasPrice: Scalars['Float']['output'];
  maxFeePerGas?: Maybe<Scalars['Float']['output']>;
  maxPriorityFeePerGas?: Maybe<Scalars['Float']['output']>;
};

export type Gas_FeedergasPrices = {
  /** chain id */
  chainId: Scalars['Int']['input'];
};

export type IncentiveRewardHistory = {
  /** reward amount */
  amount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** id (transaction - log index) */
  id: Scalars['ID']['output'];
  /** reward times in this transaction */
  times: Scalars['BigInt']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** total amount released */
  totalAmount: Scalars['BigDecimal']['output'];
  /** total user */
  totalUser: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** user */
  user: User;
};

export type IncentiveRewardHistory_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  times?: InputMaybe<Scalars['BigInt']['input']>;
  times_gt?: InputMaybe<Scalars['BigInt']['input']>;
  times_gte?: InputMaybe<Scalars['BigInt']['input']>;
  times_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  times_lt?: InputMaybe<Scalars['BigInt']['input']>;
  times_lte?: InputMaybe<Scalars['BigInt']['input']>;
  times_not?: InputMaybe<Scalars['BigInt']['input']>;
  times_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalUser?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUser_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type IncentiveRewardHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'id'
  | 'times'
  | 'timestamp'
  | 'totalAmount'
  | 'totalUser'
  | 'updatedAt'
  | 'user';

export type Limit_And_RfqCancelLimitOrderResponse = {
  authorization?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqLimitOrder = {
  createdAt?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['String']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  filledAmount?: Maybe<Scalars['String']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  makerToken?: Maybe<Scalars['String']['output']>;
  makerTokenDecimal?: Maybe<Scalars['Int']['output']>;
  makerTokenLogoImg?: Maybe<Scalars['String']['output']>;
  makerTokenSymbol?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Limit_And_RfqLimitOrderInfo>;
  progress?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['String']['output']>;
  taker?: Maybe<Scalars['String']['output']>;
  takerAmount?: Maybe<Scalars['String']['output']>;
  takerToken?: Maybe<Scalars['String']['output']>;
  takerTokenDecimal?: Maybe<Scalars['Int']['output']>;
  takerTokenLogoImg?: Maybe<Scalars['String']['output']>;
  takerTokenSymbol?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqLimitOrderFeeInfo = {
  baseFeeAmount?: Maybe<Scalars['String']['output']>;
  baseFeeValue?: Maybe<Scalars['String']['output']>;
  feeAmount?: Maybe<Scalars['String']['output']>;
  feeId?: Maybe<Scalars['String']['output']>;
  feeValue?: Maybe<Scalars['String']['output']>;
  percentFeeAmount?: Maybe<Scalars['String']['output']>;
  percentFeeValue?: Maybe<Scalars['String']['output']>;
  priceImpactFactor?: Maybe<Scalars['Float']['output']>;
};

export type Limit_And_RfqLimitOrderInfo = {
  expiration?: Maybe<Scalars['String']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  makerToken?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  taker?: Maybe<Scalars['String']['output']>;
  takerAmount?: Maybe<Scalars['String']['output']>;
  takerToken?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqLimitOrderStatusBroadcastInfo = {
  chainId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  makerToken?: Maybe<Scalars['String']['output']>;
  makerTokenSymbol?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['Int']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  takerToken?: Maybe<Scalars['String']['output']>;
  takerTokenSymbol?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqLimitOrderV2 = {
  createdAt?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['String']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  feeAmount?: Maybe<Scalars['String']['output']>;
  filledAmount?: Maybe<Scalars['String']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  makerToken?: Maybe<Scalars['String']['output']>;
  makerTokenDecimal?: Maybe<Scalars['Int']['output']>;
  makerTokenLogoImg?: Maybe<Scalars['String']['output']>;
  makerTokenSymbol?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Limit_And_RfqLimitOrderInfo>;
  progress?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  taker?: Maybe<Scalars['String']['output']>;
  takerAmount?: Maybe<Scalars['String']['output']>;
  takerToken?: Maybe<Scalars['String']['output']>;
  takerTokenDecimal?: Maybe<Scalars['Int']['output']>;
  takerTokenLogoImg?: Maybe<Scalars['String']['output']>;
  takerTokenSymbol?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqPaginateLimitOrderList = {
  currentPage?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<Limit_And_RfqLimitOrder>>>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPage?: Maybe<Scalars['Int']['output']>;
};

export type Limit_And_RfqPaginateLimitOrderListV2 = {
  currentPage?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<Limit_And_RfqLimitOrderV2>>>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPage?: Maybe<Scalars['Int']['output']>;
};

export type Limit_And_RfqPrivateOrderInfo = {
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<Scalars['String']['output']>;
  txid?: Maybe<Scalars['String']['output']>;
};

export type Limit_And_RfqcreateLimitOrderInfo = {
  expiration?: InputMaybe<Scalars['String']['input']>;
  maker?: InputMaybe<Scalars['String']['input']>;
  makerAmount?: InputMaybe<Scalars['String']['input']>;
  makerToken?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  taker?: InputMaybe<Scalars['String']['input']>;
  takerAmount?: InputMaybe<Scalars['String']['input']>;
  takerToken?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfqcreatePrivateOrderInfo = {
  address?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  timeout?: InputMaybe<Scalars['Int']['input']>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  useSource?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfqgetPendingLimitOrderParam = {
  address?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfqgetPrivateOrderParam = {
  hash?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfqlimitCancelSignType = 'eip191' | 'eip712' | 'eip1271';

export type Limit_And_RfqlimitCreateOrderWalletType = 'common' | 'unipass';

export type Limit_And_RfqlimitOrderAmountLimitParam = {
  network?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfqlimitOrderQueryEnum = 'ALL' | 'FRESH' | 'NOT_FRESH';

export type Limit_And_RfquserCancelLimitOrder = {
  address?: InputMaybe<Scalars['String']['input']>;
  /** limit order id */
  id?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['String']['input']>;
  signkey?: InputMaybe<Scalars['String']['input']>;
  signtime?: InputMaybe<Scalars['Int']['input']>;
  signtype?: InputMaybe<Limit_And_RfqlimitCancelSignType>;
};

export type Limit_And_RfquserCreateLimitOrder = {
  network?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Limit_And_RfqcreateLimitOrderInfo>;
  signature?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfquserCreateLimitOrderV2 = {
  feeId?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Limit_And_RfqcreateLimitOrderInfo>;
  signature?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wallet?: InputMaybe<Limit_And_RfqlimitCreateOrderWalletType>;
};

export type Limit_And_RfquserQueryLimitOrderFee = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  stableAmount?: InputMaybe<Scalars['Int']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
  toTokenAmount?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfquserQueryLimitOrderList = {
  address?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
};

export type Limit_And_RfquserQueryLimitOrderListWithPage = {
  address?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  orderType?: InputMaybe<Limit_And_RfqlimitOrderQueryEnum>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Liquidator = {
  /** addTimestamp */
  addTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** id:liquidator:address */
  id: Scalars['ID']['output'];
  isRemove: Scalars['Boolean']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type Liquidator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  addTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRemove?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRemove_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Liquidator_OrderBy =
  | 'addTimestamp'
  | 'id'
  | 'isRemove'
  | 'updatedAt';

export type LiquidityApyData = {
  metromMiningApy?: Maybe<Scalars['BigDecimal']['output']>;
  miningBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  miningQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionBaseApy?: Maybe<Scalars['BigDecimal']['output']>;
  transactionQuoteApy?: Maybe<Scalars['BigDecimal']['output']>;
};

export type LiquidityCountData = {
  pools?: Maybe<Scalars['Int']['output']>;
  tvl?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Scalars['String']['output']>;
};

export type LiquidityFilterState = {
  address?: InputMaybe<Scalars['String']['input']>;
  filterAAddress?: InputMaybe<Scalars['String']['input']>;
  filterASymbol?: InputMaybe<Scalars['String']['input']>;
  filterBAddress?: InputMaybe<Scalars['String']['input']>;
  filterBSymbol?: InputMaybe<Scalars['String']['input']>;
  filterOutOwn?: InputMaybe<Scalars['Boolean']['input']>;
  /** CLASSICAL DVM DPP DSP */
  filterTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hideSmallPrice?: InputMaybe<Scalars['Boolean']['input']>;
  viewOnlyOwn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LiquidityHistory = {
  /** amount */
  amount: Scalars['BigDecimal']['output'];
  /** balance in wallet */
  balance: Scalars['BigDecimal']['output'];
  /** baseToken amount change */
  baseAmountChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** base reserve */
  baseReserve?: Maybe<Scalars['BigDecimal']['output']>;
  /** base token price */
  baseTokenPrice?: Maybe<Scalars['BigDecimal']['output']>;
  /** block number */
  block: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** from */
  from: Scalars['Bytes']['output'];
  /** hash */
  hash: Scalars['String']['output'];
  /** txid - logindex */
  id: Scalars['ID']['output'];
  /** lp token */
  lpToken: LpToken;
  /** lp token total supply */
  lpTokenTotalSupply?: Maybe<Scalars['BigDecimal']['output']>;
  /** pair */
  pair?: Maybe<Pair>;
  /** quoteToken amount change */
  quoteAmountChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** quote reserve */
  quoteReserve?: Maybe<Scalars['BigDecimal']['output']>;
  /** quote token Price */
  quoteTokenPrice?: Maybe<Scalars['BigDecimal']['output']>;
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** type (DEPOSIT、WITHDRAW) */
  type: Scalars['String']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** user */
  user: User;
};

export type LiquidityHistory_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseAmountChange?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_contains?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_gt?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_gte?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseAmountChange_lt?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_lte?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_not?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseAmountChange_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseAmountChange_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseReserve?: InputMaybe<Scalars['String']['input']>;
  baseReserve_contains?: InputMaybe<Scalars['String']['input']>;
  baseReserve_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseReserve_gt?: InputMaybe<Scalars['String']['input']>;
  baseReserve_gte?: InputMaybe<Scalars['String']['input']>;
  baseReserve_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseReserve_lt?: InputMaybe<Scalars['String']['input']>;
  baseReserve_lte?: InputMaybe<Scalars['String']['input']>;
  baseReserve_not?: InputMaybe<Scalars['String']['input']>;
  baseReserve_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseReserve_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseReserve_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseReserve_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseReserve_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_contains?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_gt?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_gte?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseTokenPrice_lt?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_lte?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_not?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseTokenPrice_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseTokenPrice_starts_with?: InputMaybe<Scalars['String']['input']>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_contains?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_gt?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_gte?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpTokenTotalSupply_lt?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_lte?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_not?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpTokenTotalSupply_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpTokenTotalSupply_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_contains?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_gt?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_gte?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteAmountChange_lt?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_lte?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_not?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteAmountChange_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteAmountChange_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteReserve?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_contains?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_gt?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_gte?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteReserve_lt?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_lte?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_not?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteReserve_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteReserve_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_contains?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_gt?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_gte?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteTokenPrice_lt?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_lte?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_not?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteTokenPrice_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteTokenPrice_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type LiquidityHistory_OrderBy =
  | 'amount'
  | 'balance'
  | 'baseAmountChange'
  | 'baseReserve'
  | 'baseTokenPrice'
  | 'block'
  | 'chain'
  | 'from'
  | 'hash'
  | 'id'
  | 'lpToken'
  | 'lpTokenTotalSupply'
  | 'pair'
  | 'quoteAmountChange'
  | 'quoteReserve'
  | 'quoteTokenPrice'
  | 'timestamp'
  | 'type'
  | 'updatedAt'
  | 'user';

export type LiquidityLp = {
  baseTokenAmount?: Maybe<Scalars['String']['output']>;
  baseTokenAmountInMining?: Maybe<Scalars['String']['output']>;
  baseTokenPrice?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  liquidityTokenBalance?: Maybe<Scalars['String']['output']>;
  liquidityTokenInMining?: Maybe<Scalars['String']['output']>;
  /** my liquidity usd */
  liquidityUSD?: Maybe<Scalars['String']['output']>;
  outOfRange?: Maybe<Scalars['Boolean']['output']>;
  /** Share in the pool */
  poolShare?: Maybe<Scalars['String']['output']>;
  priceRange?: Maybe<LiquidityLpPriceRange>;
  quoteTokenAmount?: Maybe<Scalars['String']['output']>;
  quoteTokenAmountInMining?: Maybe<Scalars['String']['output']>;
  quoteTokenPrice?: Maybe<Scalars['String']['output']>;
  tickLower?: Maybe<LiquidityTick>;
  tickUpper?: Maybe<LiquidityTick>;
  /** AMM V3 info */
  tokenId?: Maybe<Scalars['String']['output']>;
};

export type LiquidityListInfo = {
  chainIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  chains?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  lqList?: Maybe<Array<Maybe<LiquidityLqList>>>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type LiquidityLpPartnerRewards = {
  chainId?: Maybe<Scalars['Int']['output']>;
  /** 跳转链接 */
  link?: Maybe<Scalars['String']['output']>;
  partner?: Maybe<Scalars['String']['output']>;
  pool?: Maybe<Scalars['String']['output']>;
  /** 显示的奖励标题, 如 10XP */
  reward?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LiquidityLpPartnerRewardsInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  partner?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
};

export type LiquidityLpPartnerRewardsResult = {
  partnerInfos?: Maybe<Array<Maybe<LiquidityPartnerInfo>>>;
  partnerRewards?: Maybe<Array<Maybe<LiquidityLpPartnerRewards>>>;
};

export type LiquidityLpPriceRange = {
  /** token0 lower  price */
  token0LowerPrice: Scalars['String']['output'];
  /** token0 upper  price */
  token0UpperPrice: Scalars['String']['output'];
  /** token1 lower  price */
  token1LowerPrice: Scalars['String']['output'];
  /** token1 upper  price */
  token1UpperPrice: Scalars['String']['output'];
};

export type LiquidityLpToken = {
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  /** token name */
  name: Scalars['String']['output'];
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
};

export type LiquidityLqList = {
  id?: Maybe<Scalars['String']['output']>;
  isMyLiquidity?: Maybe<Scalars['Boolean']['output']>;
  isPrivatePool?: Maybe<Scalars['Boolean']['output']>;
  liquidityPositions?: Maybe<Array<Maybe<LiquidityLp>>>;
  pair?: Maybe<LiquidityPair>;
};

export type LiquidityOrder = {
  /** updatedAt tvl apy liquidity */
  orderBy?: InputMaybe<Scalars['String']['input']>;
  /** desc asc' */
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};

export type LiquidityPair = {
  apy?: Maybe<LiquidityApyData>;
  /** base LP token, for DPP is null, for dodo v1 lpToken is different */
  baseLpToken?: Maybe<LiquidityLpToken>;
  /** base token reserve */
  baseReserve: Scalars['BigDecimal']['output'];
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base token */
  baseToken: LiquidityToken;
  chain: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  /** createAtBlock */
  createdAtBlockNumber: Scalars['BigInt']['output'];
  /** createAtTimestamp */
  createdAtTimestamp: Scalars['BigInt']['output'];
  /** creator */
  creator: Scalars['LiquidityBytes']['output'];
  /** lp fee base */
  feeBase: Scalars['BigDecimal']['output'];
  /** lp fee quote */
  feeQuote: Scalars['BigDecimal']['output'];
  /** lp fee of USD */
  feeUSD: Scalars['BigDecimal']['output'];
  /** i */
  i?: Maybe<Scalars['BigInt']['output']>;
  /** pool address */
  id: Scalars['ID']['output'];
  /** deposit base allowed */
  isDepositBaseAllowed: Scalars['Boolean']['output'];
  /** deposit quote allowed */
  isDepositQuoteAllowed: Scalars['Boolean']['output'];
  isMining?: Maybe<Scalars['Boolean']['output']>;
  /** trade allowed */
  isTradeAllowed: Scalars['Boolean']['output'];
  /** k */
  k?: Maybe<Scalars['BigInt']['output']>;
  /** last trade price (quote/base) */
  lastTradePrice: Scalars['BigDecimal']['output'];
  /** liquidity provider count */
  liquidityProviderCount: Scalars['BigInt']['output'];
  /** lp Fee Rate */
  lpFeeRate: Scalars['BigDecimal']['output'];
  /** maintainer */
  maintainer: Scalars['LiquidityBytes']['output'];
  miningAddress?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** maintainer fee base token */
  mtFeeBase: Scalars['BigDecimal']['output'];
  /** maintainer fee quote token */
  mtFeeQuote: Scalars['BigDecimal']['output'];
  /** maintainer fee rate */
  mtFeeRate: Scalars['BigInt']['output'];
  /** mtFee Rate Model */
  mtFeeRateModel: Scalars['LiquidityBytes']['output'];
  /** maintainer fee in USD */
  mtFeeUSD: Scalars['BigDecimal']['output'];
  /** owner */
  owner?: Maybe<Scalars['LiquidityBytes']['output']>;
  /** quote LP token,for DPP is null, for dodo v1 lpToken is different */
  quoteLpToken?: Maybe<LiquidityLpToken>;
  /** quote token reserve */
  quoteReserve: Scalars['BigDecimal']['output'];
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token */
  quoteToken: LiquidityToken;
  /** pool source(default:null) */
  source?: Maybe<Scalars['String']['output']>;
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  tvl?: Maybe<Scalars['BigDecimal']['output']>;
  /** transactions count */
  txCount: Scalars['BigInt']['output'];
  /** pool type（CLASSICAL、DVM、DPP、DSP） */
  type: Scalars['String']['output'];
  /** untracked base volume */
  untrackedBaseVolume: Scalars['BigDecimal']['output'];
  /** untracked quote volume */
  untrackedQuoteVolume: Scalars['BigDecimal']['output'];
  /** Trading volume in the last 24 hours */
  volume24H?: Maybe<Scalars['BigDecimal']['output']>;
  /** trade volume of basetoken */
  volumeBaseToken: Scalars['BigDecimal']['output'];
  /** trade volume of quotetoken */
  volumeQuoteToken: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type LiquidityPartnerInfo = {
  /** 扩展信息等 */
  extra?: Maybe<Scalars['JSON']['output']>;
  /** 协议介绍 */
  introduction?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  partner?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['Int']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  theme?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type LiquidityPoolApy = {
  apy?: Maybe<Scalars['String']['output']>;
  pool?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Scalars['String']['output']>;
};

export type LiquidityPosition = {
  /** Accumulated interest token amount */
  accInterestTokenAmount: Scalars['BigInt']['output'];
  /** Accumulated interest token USD */
  accInterestTokenUSD: Scalars['BigDecimal']['output'];
  /** Accumulated token deposit */
  accTokenDeposit: Scalars['BigInt']['output'];
  /** Accumulated token BigInt */
  accTokenWithdraw: Scalars['BigInt']['output'];
  /** Accumulated interest of yesterday */
  accYesterdayInterest: Scalars['BigInt']['output'];
  /** d3token assetInfo token accruedInterest */
  accruedInterest: Scalars['BigInt']['output'];
  /** Recharged balance */
  balance: Scalars['BigInt']['output'];
  /** Recharged balance usd */
  balanceUSD: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** user address - lp Token address */
  id: Scalars['ID']['output'];
  inMining: Scalars['BigInt']['output'];
  /** Recharged inMining usd */
  inMiningUSD: Scalars['BigDecimal']['output'];
  /** last add time */
  lastTxTime: Scalars['BigInt']['output'];
  /** lp token balance */
  liquidityTokenBalance: Scalars['BigDecimal']['output'];
  /** lp token balance in mining contract */
  liquidityTokenInMining: Scalars['BigDecimal']['output'];
  /** lp token */
  lpToken: LpToken;
  /** pair */
  pair?: Maybe<Pair>;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /** token */
  token: Token;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** user */
  user: User;
  /** vault */
  vault: Vault;
  /** Yesterday interest */
  yesterdayInterest: Scalars['BigInt']['output'];
};

export type LiquidityPosition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accInterestTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accInterestTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  accInterestTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accInterestTokenUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accInterestTokenUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestTokenUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  accTokenDeposit?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accTokenDeposit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_not?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenDeposit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accTokenWithdraw?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accTokenWithdraw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_not?: InputMaybe<Scalars['BigInt']['input']>;
  accTokenWithdraw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accYesterdayInterest?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accYesterdayInterest_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_not?: InputMaybe<Scalars['BigInt']['input']>;
  accYesterdayInterest_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accruedInterest?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accruedInterest_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_not?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balanceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balanceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inMining?: InputMaybe<Scalars['BigInt']['input']>;
  inMiningUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inMiningUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inMiningUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inMining_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inMining_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inMining_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inMining_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inMining_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inMining_not?: InputMaybe<Scalars['BigInt']['input']>;
  inMining_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastTxTime?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastTxTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  liquidityTokenInMining?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenInMining_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenInMining_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_?: InputMaybe<Token_Filter>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  yesterdayInterest?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_gt?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_gte?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  yesterdayInterest_lt?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_lte?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_not?: InputMaybe<Scalars['BigInt']['input']>;
  yesterdayInterest_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type LiquidityPosition_OrderBy =
  | 'accInterestTokenAmount'
  | 'accInterestTokenUSD'
  | 'accTokenDeposit'
  | 'accTokenWithdraw'
  | 'accYesterdayInterest'
  | 'accruedInterest'
  | 'balance'
  | 'balanceUSD'
  | 'chain'
  | 'id'
  | 'inMining'
  | 'inMiningUSD'
  | 'lastTxTime'
  | 'liquidityTokenBalance'
  | 'liquidityTokenInMining'
  | 'lpToken'
  | 'pair'
  | 'timestamp'
  | 'token'
  | 'updatedAt'
  | 'user'
  | 'vault'
  | 'yesterdayInterest';

export type LiquidityTick = {
  id: Scalars['ID']['output'];
  liquidityGross: Scalars['BigInt']['output'];
  liquidityNet: Scalars['BigInt']['output'];
  price0: Scalars['BigDecimal']['output'];
  price1: Scalars['BigDecimal']['output'];
  tickIdx: Scalars['BigInt']['output'];
};

export type LiquidityToken = {
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  /** token logo img */
  logoImg?: Maybe<Scalars['String']['output']>;
  /** token name */
  name: Scalars['String']['output'];
  /** price update time */
  priceUpdateTimestamp: Scalars['BigInt']['output'];
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** liquidity across all pairs */
  totalLiquidityOnDODO: Scalars['BigDecimal']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
  /** total trade volume */
  tradeVolume: Scalars['BigDecimal']['output'];
  /** total trade volume for bridge */
  tradeVolumeBridge: Scalars['BigDecimal']['output'];
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  /** transactions across all pairs */
  txCount: Scalars['BigInt']['output'];
  /** untracked volume */
  untrackedVolume: Scalars['BigDecimal']['output'];
  /** usd price(only stable coin and classical pool has usd price) */
  usdPrice: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
  /** traded volume of USD for bridge */
  volumeUSDBridge: Scalars['BigDecimal']['output'];
};

export type Liquiditycount_Data_Query = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Liquiditylist_Filter = {
  /** This field has been discarded for compatibility with the previous interface */
  chain?: InputMaybe<Scalars['String']['input']>;
  /** The default is all chains, including test chains */
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  filterState?: InputMaybe<LiquidityFilterState>;
  order?: InputMaybe<LiquidityOrder>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Liquiditypool_Apy_Query = {
  chain?: InputMaybe<Scalars['String']['input']>;
  pools?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LpToken = {
  chain: Scalars['String']['output'];
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  /** token name */
  name: Scalars['String']['output'];
  /** belong pair */
  pair?: Maybe<Pair>;
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type LpToken_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type LpToken_OrderBy =
  | 'chain'
  | 'decimals'
  | 'id'
  | 'name'
  | 'pair'
  | 'symbol'
  | 'totalSupply'
  | 'updatedAt';

export type Lp_PointsOrder = {
  /**  tvl, totalTwigs, totalTokenBonus */
  orderBy?: InputMaybe<Scalars['String']['input']>;
  /** desc asc' */
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};

export type Lp_PointsPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type Lp_PointsUserInput = {
  activity: Scalars['String']['input'];
  user: Scalars['String']['input'];
};

export type Lp_PointsUserPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type Lp_PointsUserPointsDetailPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<Lp_PointsUserPointsDetailResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type Lp_PointsUserPointsDetailResult = {
  points: Scalars['BigDecimal']['output'];
  /** 积分来源类型：质押积分 */
  sourceType: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type Lp_PointsUserPointsResult = {
  totalPoints: Scalars['BigDecimal']['output'];
  /** 积分更新时间 */
  updatedAt: Scalars['BigInt']['output'];
};

export type MaintainerEarnings = {
  /** amount */
  amount: Scalars['BigDecimal']['output'];
  /** amount of usd */
  amountUSD: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** maintainer address - token address */
  id: Scalars['ID']['output'];
  /** maintainer address */
  maintainer: Scalars['Bytes']['output'];
  /** token address */
  token: Token;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type MaintainerEarnings_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maintainer?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maintainer_not?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type MaintainerEarnings_OrderBy =
  | 'amount'
  | 'amountUSD'
  | 'chain'
  | 'id'
  | 'maintainer'
  | 'token'
  | 'updatedAt';

export type MaintainerFeeTx = {
  /** amount */
  amount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** transaction hash */
  hash: Scalars['String']['output'];
  /** ID:transaction hash - event index */
  id: Scalars['ID']['output'];
  /** earning token */
  token: Token;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** volume in usd */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type MaintainerFeeTx_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type MaintainerFeeTx_OrderBy =
  | 'amount'
  | 'chain'
  | 'hash'
  | 'id'
  | 'token'
  | 'updatedAt'
  | 'volumeUSD';

export type Maker = {
  id: Scalars['ID']['output'];
  pool: Pool;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type Maker_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Maker_OrderBy = 'id' | 'pool' | 'updatedAt';

export type ManageBanner = {
  /** chain */
  chain?: Maybe<Scalars['String']['output']>;
  /** background image url */
  img_url?: Maybe<Scalars['String']['output']>;
  /** banner data source */
  pool_list?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** sort */
  sort?: Maybe<Scalars['Int']['output']>;
  /** text */
  text?: Maybe<Scalars['String']['output']>;
  /** title */
  title?: Maybe<Scalars['String']['output']>;
};

export type ManageDoc = {
  /** chain */
  chain?: Maybe<Scalars['String']['output']>;
  /** sort */
  sort?: Maybe<Scalars['Int']['output']>;
  /** text */
  text?: Maybe<Scalars['String']['output']>;
  /** title */
  title?: Maybe<Scalars['String']['output']>;
  /** doc type in: document,internal,external */
  type?: Maybe<Scalars['String']['output']>;
  /** link url */
  url?: Maybe<Scalars['String']['output']>;
};

export type ManageDppConfig = {
  /** max show item of banners */
  banner_max?: Maybe<Scalars['Int']['output']>;
  banners?: Maybe<Array<Maybe<ManageBanner>>>;
  /** max show item of docs */
  doc_max?: Maybe<Scalars['Int']['output']>;
  docs?: Maybe<Array<Maybe<ManageDoc>>>;
  /** max show item of pools */
  pool_max?: Maybe<Scalars['Int']['output']>;
  pools?: Maybe<Array<Maybe<ManagePool>>>;
};

export type ManagePool = {
  /** address */
  address?: Maybe<Scalars['String']['output']>;
  /** chain */
  chain?: Maybe<Scalars['String']['output']>;
  /** sort */
  sort?: Maybe<Scalars['Int']['output']>;
  /** type */
  type?: Maybe<Scalars['String']['output']>;
};

export type ManageSlippageTolerance = {
  chain?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  slippage_tolerance?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Array<Maybe<ManageToken>>>;
};

export type ManageToken = {
  symbol?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type Manage_ServiceCautionTokenResult = {
  /** it's true when token is abnormal */
  alert: Scalars['Boolean']['output'];
  /** alert reason, it'll includes reason string when alert is true, otherwise it's empty array */
  reason: Array<Maybe<Scalars['String']['output']>>;
  /** token address */
  token: Scalars['String']['output'];
};

export type Manage_ServiceCautionTokensInput = {
  network: Scalars['Int']['input'];
  /** addresses of token */
  tokens: Array<Scalars['String']['input']>;
};

export type ManagechainFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Market_Maker_Pool_ApplyData = {
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Market_Maker_Pool_ApplypoolApplyData = {
  information?: InputMaybe<Scalars['String']['input']>;
  liaison?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MetromChainInput = {
  chainId: Scalars['BigDecimal']['input'];
};

export type MetromPool = {
  apr: Scalars['BigDecimal']['output'];
  apy: Scalars['BigDecimal']['output'];
  chainId: Scalars['BigDecimal']['output'];
  pool: Scalars['String']['output'];
};

export type MinePool = {
  chain: Scalars['String']['output'];
  /** creator */
  creator?: Maybe<Scalars['Bytes']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** isLptoken */
  isLpToken?: Maybe<Scalars['Boolean']['output']>;
  /** mineType */
  platform?: Maybe<Scalars['BigInt']['output']>;
  /** mine pool address */
  pool: Scalars['Bytes']['output'];
  /** reward details */
  rewardDetail: Array<RewardDetail>;
  /** stake token */
  stakeToken?: Maybe<Scalars['Bytes']['output']>;
  /** timestamp */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type MinePool_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isLpToken?: InputMaybe<Scalars['String']['input']>;
  isLpToken_contains?: InputMaybe<Scalars['String']['input']>;
  isLpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  isLpToken_gt?: InputMaybe<Scalars['String']['input']>;
  isLpToken_gte?: InputMaybe<Scalars['String']['input']>;
  isLpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  isLpToken_lt?: InputMaybe<Scalars['String']['input']>;
  isLpToken_lte?: InputMaybe<Scalars['String']['input']>;
  isLpToken_not?: InputMaybe<Scalars['String']['input']>;
  isLpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  isLpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  isLpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  isLpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  isLpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  platform_contains?: InputMaybe<Scalars['String']['input']>;
  platform_ends_with?: InputMaybe<Scalars['String']['input']>;
  platform_gt?: InputMaybe<Scalars['String']['input']>;
  platform_gte?: InputMaybe<Scalars['String']['input']>;
  platform_in?: InputMaybe<Array<Scalars['String']['input']>>;
  platform_lt?: InputMaybe<Scalars['String']['input']>;
  platform_lte?: InputMaybe<Scalars['String']['input']>;
  platform_not?: InputMaybe<Scalars['String']['input']>;
  platform_not_contains?: InputMaybe<Scalars['String']['input']>;
  platform_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  platform_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  platform_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  platform_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['Bytes']['input']>;
  pool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_not?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  rewardDetail?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_contains?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_gt?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_gte?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardDetail_lt?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_lte?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_not?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardDetail_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardDetail_starts_with?: InputMaybe<Scalars['String']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  stakeToken?: InputMaybe<Scalars['String']['input']>;
  stakeToken_contains?: InputMaybe<Scalars['String']['input']>;
  stakeToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  stakeToken_gt?: InputMaybe<Scalars['String']['input']>;
  stakeToken_gte?: InputMaybe<Scalars['String']['input']>;
  stakeToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stakeToken_lt?: InputMaybe<Scalars['String']['input']>;
  stakeToken_lte?: InputMaybe<Scalars['String']['input']>;
  stakeToken_not?: InputMaybe<Scalars['String']['input']>;
  stakeToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  stakeToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stakeToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stakeToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stakeToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
  timestamp_contains?: InputMaybe<Scalars['String']['input']>;
  timestamp_ends_with?: InputMaybe<Scalars['String']['input']>;
  timestamp_gt?: InputMaybe<Scalars['String']['input']>;
  timestamp_gte?: InputMaybe<Scalars['String']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['String']['input']>;
  timestamp_lte?: InputMaybe<Scalars['String']['input']>;
  timestamp_not?: InputMaybe<Scalars['String']['input']>;
  timestamp_not_contains?: InputMaybe<Scalars['String']['input']>;
  timestamp_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timestamp_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type MinePool_OrderBy =
  | 'chain'
  | 'creator'
  | 'id'
  | 'isLpToken'
  | 'platform'
  | 'pool'
  | 'rewardDetail'
  | 'stakeToken'
  | 'timestamp'
  | 'updatedAt';

export type MiningDodoData = {
  active_mining_count?: Maybe<Scalars['String']['output']>;
  capital_count?: Maybe<Scalars['String']['output']>;
  more_chain_mining_count?: Maybe<Scalars['String']['output']>;
  user_count?: Maybe<Scalars['String']['output']>;
};

export type MiningDppData = {
  all_tvl?: Maybe<Scalars['String']['output']>;
  trading_volume?: Maybe<Scalars['String']['output']>;
  turnover_rate_7d?: Maybe<Scalars['String']['output']>;
  user_count?: Maybe<Scalars['String']['output']>;
};

export type MiningFilterState = {
  /** 根据地址搜索 */
  address?: InputMaybe<Scalars['String']['input']>;
  /** 筛选是自己创建或参与的，默认是参与的池子 false是参与的，true为创建的 */
  isCreateOrParticipate?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否结束了 */
  isEnded?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否开始了 */
  isStarted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 挖矿池类型 */
  type?: InputMaybe<Scalars['String']['input']>;
};

export type MiningMiningInfo = {
  /** // v2 */
  address?: Maybe<Scalars['String']['output']>;
  /** 年化收益率 */
  baseApy?: Maybe<Scalars['String']['output']>;
  /** classical baseLpToken */
  baseLpToken?: Maybe<MiningToken>;
  /** configs/matic.json polygon上是两个挖矿池 */
  baseLpTokenMining?: Maybe<Scalars['String']['output']>;
  baseLpTokenRewardNum?: Maybe<Scalars['Int']['output']>;
  baseReserve?: Maybe<Scalars['String']['output']>;
  baseToken?: Maybe<MiningToken>;
  /** current block number */
  blockNumber?: Maybe<Scalars['String']['output']>;
  chain: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  d3Vault?: Maybe<Scalars['String']['output']>;
  dataUpdateTime?: Maybe<Scalars['Int']['output']>;
  /** 挖矿结束区块 */
  endBlock?: Maybe<Scalars['String']['output']>;
  /** Mining end time */
  endTime?: Maybe<Scalars['String']['output']>;
  /** 第一次开始区块 */
  firstToStartBlocknumber?: Maybe<Scalars['String']['output']>;
  isClassical?: Maybe<Scalars['Boolean']['output']>;
  isD3?: Maybe<Scalars['Boolean']['output']>;
  isDVM?: Maybe<Scalars['Boolean']['output']>;
  /** 是否结束了 */
  isEnded?: Maybe<Scalars['Boolean']['output']>;
  isGSP?: Maybe<Scalars['Boolean']['output']>;
  isMiningAllowed?: Maybe<Scalars['Boolean']['output']>;
  /** 是否是新的v3，支持fundAndSet方法 */
  isNewERCMineV3?: Maybe<Scalars['Boolean']['output']>;
  isPoolAllowed?: Maybe<Scalars['Boolean']['output']>;
  isSingle?: Maybe<Scalars['Boolean']['output']>;
  /** 挖矿是否开始了 */
  isStarted?: Maybe<Scalars['Boolean']['output']>;
  isV3?: Maybe<Scalars['Boolean']['output']>;
  isVdodo?: Maybe<Scalars['Boolean']['output']>;
  /** classical 池子使用自己的挖矿合约而不是公共的挖矿合约 */
  miningContractAddress?: Maybe<Scalars['String']['output']>;
  /** 总的挖矿资金的法币价值 */
  miningTotalDollar?: Maybe<Scalars['String']['output']>;
  /** 挖矿合约中抵押的 dlp 的总数量 */
  miningTotalLp?: Maybe<Scalars['String']['output']>;
  /** classical 池子有两个 lp */
  miningTotalQuoteLp?: Maybe<Scalars['String']['output']>;
  /** 池子名 */
  pair?: Maybe<Scalars['String']['output']>;
  /** Number of participants */
  participantsNum?: Maybe<Scalars['Int']['output']>;
  /** ERC20MineV3 platform */
  platform?: Maybe<Scalars['String']['output']>;
  /** quote 年化收益率 */
  quoteApy?: Maybe<Scalars['String']['output']>;
  quoteLpToken?: Maybe<MiningToken>;
  quoteLpTokenMining?: Maybe<Scalars['String']['output']>;
  quoteLpTokenRewardNum?: Maybe<Scalars['Int']['output']>;
  quoteReserve?: Maybe<Scalars['String']['output']>;
  quoteToken?: Maybe<MiningToken>;
  /** classical 2个奖励的token信息 */
  rewardQuoteTokenInfos?: Maybe<Array<Maybe<MiningRewardToken>>>;
  /** 奖励的token信息 */
  rewardTokenInfos?: Maybe<Array<Maybe<MiningRewardToken>>>;
  /** 配置中开始区块 */
  startBlock?: Maybe<Scalars['String']['output']>;
  /** Mining start time */
  startTime?: Maybe<Scalars['String']['output']>;
  /** 展示的标题 */
  title?: Maybe<Scalars['String']['output']>;
  /** 原始baseToken数量 */
  totalBaseTokenAmount?: Maybe<Scalars['String']['output']>;
  /** 原始quoteToken数量 */
  totalQuoteTokenAmount?: Maybe<Scalars['String']['output']>;
  /** 'dvm' | 'single' | 'classical' | 'vdodo' | 'lptoken' |startTime 'dsp' | 'd3token' | 'gsp' */
  type?: Maybe<Scalars['String']['output']>;
  /** 2,3 */
  version?: Maybe<Scalars['String']['output']>;
};

export type MiningMiningInfos = {
  list?: Maybe<Array<Maybe<MiningMiningInfo>>>;
};

export type MiningMiningListInfo = {
  chainIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  chains?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** 当前页 */
  currentPage?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<MiningMiningInfo>>>;
  /** 一页多少条 */
  pageSize?: Maybe<Scalars['Int']['output']>;
  /** 总条数 */
  totalCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type MiningOrder = {
  /**  apy | startBlock | endBlock  */
  orderBy?: InputMaybe<Scalars['String']['input']>;
  /** desc asc' */
  orderDirection?: InputMaybe<Scalars['String']['input']>;
};

export type MiningPool = {
  chain: Scalars['String']['output'];
  /** pool id */
  id: Scalars['ID']['output'];
  /** lp token */
  lpToken: LpToken;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type MiningPool_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type MiningPool_OrderBy = 'chain' | 'id' | 'lpToken' | 'updatedAt';

export type MiningRewardDetailHistory = {
  accRewardPerShare: Scalars['String']['output'];
  blockNumber: Scalars['String']['output'];
  endBlock: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  i: Scalars['Int']['output'];
  lastRewardBlock: Scalars['String']['output'];
  rewardPerBlock: Scalars['String']['output'];
  startBlock: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  token: MiningToken;
  type: Scalars['String']['output'];
};

export type MiningRewardDetailHistoryListInfo = {
  /** 当前页 */
  currentPage?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<MiningRewardDetailHistory>>>;
  /** 一页多少条 */
  pageSize?: Maybe<Scalars['Int']['output']>;
  /** 总条数 */
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** reward info */
export type MiningRewardToken = {
  /** 奖励的APY */
  apy?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  endBlock?: Maybe<Scalars['String']['output']>;
  /** endBlock time */
  endTime?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  /** token logo img */
  logoImg?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rewardNumIndex?: Maybe<Scalars['Int']['output']>;
  /** 每个块奖励多少数量token */
  rewardPerBlock?: Maybe<Scalars['String']['output']>;
  /** 一年的奖励数量 */
  rewardPerYear?: Maybe<Scalars['String']['output']>;
  /** 一年的奖励美元价值 */
  rewardPerYearDollar?: Maybe<Scalars['String']['output']>;
  startBlock?: Maybe<Scalars['String']['output']>;
  /** startBlock time */
  startTime?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

/** token info */
export type MiningToken = {
  balanceOf?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  /** token logo img */
  logoImg?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Mininginfo_Filter = {
  address: Scalars['String']['input'];
  chain: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Mininginfos_Filter = {
  chain: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Miningmining_List_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  filterState?: InputMaybe<MiningFilterState>;
  order?: InputMaybe<MiningOrder>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** 如果不是查用户相关的挖矿池，不建议传，传了会每次都查一次数据库 */
  user?: InputMaybe<Scalars['String']['input']>;
};

export type MiningrewardDetailHistory_Filter = {
  address: Scalars['String']['input'];
  chainId: Scalars['Int']['input'];
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  /** NewRewardToken | UpdateEndBlock | UpdateReward | RemoveRewardToken | FundAndSet */
  types?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type MintHistory = {
  /** dodo amount */
  amount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** transaction hash */
  id: Scalars['ID']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** user */
  user: User;
};

export type MintHistory_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type MintHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'id'
  | 'timestamp'
  | 'user';

export type Nft = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type NftCollateralVault = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type NftCollateralVault_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type NftCollateralVault_OrderBy = 'chain' | 'id';

export type NftPool = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type NftPool_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type NftPool_OrderBy = 'chain' | 'id';

export type Nft_ContractChain = {
  alias?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Nft_ContractNftContractList = {
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Nft_ContractChain>;
  collectionName?: Maybe<Scalars['String']['output']>;
  cover?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isRecommend?: Maybe<Scalars['Boolean']['output']>;
};

export type Nft_Contractlist_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Nft_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Nft_OrderBy = 'chain' | 'id';

export type Notice_CenterNoticeCenterRead = {
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Notice_CenterNoticeCenterSystemItem = {
  content?: Maybe<Scalars['String']['output']>;
  createTime?: Maybe<Scalars['String']['output']>;
  extend?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isNoticeAll?: Maybe<Scalars['Boolean']['output']>;
  isRead?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  timingNoticeTime?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Notice_CenterNoticeCenterSystemList = {
  count?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<Notice_CenterNoticeCenterSystemItem>>>;
  page?: Maybe<Scalars['Int']['output']>;
};

export type Notice_CenterNoticeCenterTransactionItem = {
  chainId?: Maybe<Scalars['Int']['output']>;
  createTime?: Maybe<Scalars['String']['output']>;
  extend?: Maybe<Scalars['JSON']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Notice_CenterNoticeCenterTransactionList = {
  count?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<Notice_CenterNoticeCenterTransactionItem>>>;
  page?: Maybe<Scalars['Int']['output']>;
};

export type Notice_CenterNoticeCenterUnRead = {
  systemCount?: Maybe<Scalars['Int']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
};

export type Notice_CenternoticeCenterReadData = {
  noticeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  readAll?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Notice_CenternoticeCenterUnreadFilter = {
  language?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Notice_CentersystemListFilter = {
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Notice_CentertransactionListFilter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type OrderDirection = 'asc' | 'desc';

export type OrderHistory = {
  /** from token amount */
  amountIn: Scalars['BigDecimal']['output'];
  /** to token amount */
  amountOut: Scalars['BigDecimal']['output'];
  /** block */
  block: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** tx from address */
  from: Scalars['Bytes']['output'];
  /** from token */
  fromToken: Token;
  /** transaction hash */
  hash: Scalars['String']['output'];
  /** order id */
  id: Scalars['ID']['output'];
  /** log index */
  logIndex?: Maybe<Scalars['BigInt']['output']>;
  /** msg sender */
  sender: Scalars['Bytes']['output'];
  /** source (from : smartroute event、pool swap event) */
  source: Scalars['String']['output'];
  /** timestamp of this transaction */
  timestamp: Scalars['BigInt']['output'];
  /** to address */
  to: Scalars['Bytes']['output'];
  /** to token */
  toToken: Token;
  /** trading incentive reward */
  tradingReward: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type OrderHistory_Filter = {
  amountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  fromToken?: InputMaybe<Scalars['String']['input']>;
  fromToken_contains?: InputMaybe<Scalars['String']['input']>;
  fromToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_gt?: InputMaybe<Scalars['String']['input']>;
  fromToken_gte?: InputMaybe<Scalars['String']['input']>;
  fromToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromToken_lt?: InputMaybe<Scalars['String']['input']>;
  fromToken_lte?: InputMaybe<Scalars['String']['input']>;
  fromToken_not?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['String']['input']>;
  logIndex_contains?: InputMaybe<Scalars['String']['input']>;
  logIndex_ends_with?: InputMaybe<Scalars['String']['input']>;
  logIndex_gt?: InputMaybe<Scalars['String']['input']>;
  logIndex_gte?: InputMaybe<Scalars['String']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['String']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['String']['input']>;
  logIndex_lte?: InputMaybe<Scalars['String']['input']>;
  logIndex_not?: InputMaybe<Scalars['String']['input']>;
  logIndex_not_contains?: InputMaybe<Scalars['String']['input']>;
  logIndex_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  logIndex_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  logIndex_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  source?: InputMaybe<Scalars['String']['input']>;
  source_contains?: InputMaybe<Scalars['String']['input']>;
  source_ends_with?: InputMaybe<Scalars['String']['input']>;
  source_gt?: InputMaybe<Scalars['String']['input']>;
  source_gte?: InputMaybe<Scalars['String']['input']>;
  source_in?: InputMaybe<Array<Scalars['String']['input']>>;
  source_lt?: InputMaybe<Scalars['String']['input']>;
  source_lte?: InputMaybe<Scalars['String']['input']>;
  source_not?: InputMaybe<Scalars['String']['input']>;
  source_not_contains?: InputMaybe<Scalars['String']['input']>;
  source_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  source_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  source_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  source_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
  toToken_contains?: InputMaybe<Scalars['String']['input']>;
  toToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  toToken_gt?: InputMaybe<Scalars['String']['input']>;
  toToken_gte?: InputMaybe<Scalars['String']['input']>;
  toToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toToken_lt?: InputMaybe<Scalars['String']['input']>;
  toToken_lte?: InputMaybe<Scalars['String']['input']>;
  toToken_not?: InputMaybe<Scalars['String']['input']>;
  toToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  toToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tradingReward?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradingReward_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingReward_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type OrderHistory_OrderBy =
  | 'amountIn'
  | 'amountOut'
  | 'block'
  | 'chain'
  | 'from'
  | 'fromToken'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'sender'
  | 'source'
  | 'timestamp'
  | 'to'
  | 'toToken'
  | 'tradingReward'
  | 'updatedAt'
  | 'volumeUSD';

export type Owner = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type OwnerPerTokenContract = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type OwnerPerTokenContract_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type OwnerPerTokenContract_OrderBy = 'chain' | 'id';

export type Owner_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Owner_OrderBy = 'chain' | 'id';

export type Pair = {
  /** base LP token, for DPP is null, for dodo v1 lpToken is different */
  baseLpToken?: Maybe<LpToken>;
  /** base token reserve */
  baseReserve: Scalars['BigDecimal']['output'];
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base token */
  baseToken: Token;
  chain: Scalars['String']['output'];
  /** createAtBlock */
  createdAtBlockNumber: Scalars['BigInt']['output'];
  /** createAtTimestamp */
  createdAtTimestamp: Scalars['BigInt']['output'];
  /** creator */
  creator: Scalars['Bytes']['output'];
  /** lp fee base */
  feeBase: Scalars['BigDecimal']['output'];
  /** lp fee quote */
  feeQuote: Scalars['BigDecimal']['output'];
  /** lp fee of USD */
  feeUSD: Scalars['BigDecimal']['output'];
  /** i */
  i?: Maybe<Scalars['BigInt']['output']>;
  /** pool address */
  id: Scalars['ID']['output'];
  /** deposit base allowed */
  isDepositBaseAllowed: Scalars['Boolean']['output'];
  /** deposit quote allowed */
  isDepositQuoteAllowed: Scalars['Boolean']['output'];
  /** trade allowed */
  isTradeAllowed: Scalars['Boolean']['output'];
  /** k */
  k?: Maybe<Scalars['BigInt']['output']>;
  /** last trade price (quote/base) */
  lastTradePrice: Scalars['BigDecimal']['output'];
  /** liquidity provider count */
  liquidityProviderCount: Scalars['BigInt']['output'];
  /** lp Fee Rate */
  lpFeeRate: Scalars['BigDecimal']['output'];
  /** maintainer */
  maintainer: Scalars['Bytes']['output'];
  /** maintainer fee base token */
  mtFeeBase: Scalars['BigDecimal']['output'];
  /** maintainer fee quote token */
  mtFeeQuote: Scalars['BigDecimal']['output'];
  /** maintainer fee rate */
  mtFeeRate: Scalars['BigInt']['output'];
  /** mtFee Rate Model */
  mtFeeRateModel: Scalars['Bytes']['output'];
  /** maintainer fee in USD */
  mtFeeUSD: Scalars['BigDecimal']['output'];
  /** owner */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** quote LP token,for DPP is null, for dodo v1 lpToken is different */
  quoteLpToken?: Maybe<LpToken>;
  /** quote token reserve */
  quoteReserve: Scalars['BigDecimal']['output'];
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token */
  quoteToken: Token;
  /** pool source(default:null) */
  source?: Maybe<Scalars['String']['output']>;
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  /** transactions count */
  txCount: Scalars['BigInt']['output'];
  /** pool type（CLASSICAL、DVM、DPP） */
  type: Scalars['String']['output'];
  /** untracked base volume */
  untrackedBaseVolume: Scalars['BigDecimal']['output'];
  /** untracked quote volume */
  untrackedQuoteVolume: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** trade volume of basetoken */
  volumeBaseToken: Scalars['BigDecimal']['output'];
  /** trade volume of quotetoken */
  volumeQuoteToken: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PairDayData = {
  /** total supply of base lp token */
  baseLpTokenTotalSupply: Scalars['BigDecimal']['output'];
  /** base token */
  baseToken: Token;
  /** base token reserve */
  baseTokenReserve: Scalars['BigDecimal']['output'];
  /** base token price */
  baseUsdPrice: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** base token trading fee get */
  feeBase: Scalars['BigDecimal']['output'];
  /** quote token trading fee */
  feeQuote: Scalars['BigDecimal']['output'];
  /** pair address - day id */
  id: Scalars['ID']['output'];
  /** lp Fee Rate */
  lpFeeRate: Scalars['BigDecimal']['output'];
  /** pair */
  pair?: Maybe<Pair>;
  /** pair address */
  pairAddress: Scalars['Bytes']['output'];
  /** total supply of quote lp token */
  quoteLpTokenTotalSupply: Scalars['BigDecimal']['output'];
  /** quote token */
  quoteToken: Token;
  /** quote token reserve */
  quoteTokenReserve: Scalars['BigDecimal']['output'];
  /** quote token price */
  quoteUsdPrice: Scalars['BigDecimal']['output'];
  /** daily traders */
  traders: Scalars['BigInt']['output'];
  /** daily txns */
  txns: Scalars['BigInt']['output'];
  /** untracked base volume */
  untrackedBaseVolume: Scalars['BigDecimal']['output'];
  /** untracked quote volume */
  untrackedQuoteVolume: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** base token volume */
  volumeBase: Scalars['BigDecimal']['output'];
  /** quote token volume */
  volumeQuote: Scalars['BigDecimal']['output'];
  /** USD volume */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PairDayData_Filter = {
  baseLpTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseLpTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  baseToken?: InputMaybe<Scalars['String']['input']>;
  baseTokenReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseTokenReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseToken_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_gt?: InputMaybe<Scalars['String']['input']>;
  baseToken_gte?: InputMaybe<Scalars['String']['input']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_lt?: InputMaybe<Scalars['String']['input']>;
  baseToken_lte?: InputMaybe<Scalars['String']['input']>;
  baseToken_not?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseUsdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  feeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lpFeeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lpFeeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pairAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pairAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  quoteLpTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  quoteToken?: InputMaybe<Scalars['String']['input']>;
  quoteTokenReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteTokenReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteToken_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_lte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteUsdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  traders?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedBaseVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedBaseVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  untrackedQuoteVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedQuoteVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PairDayData_OrderBy =
  | 'baseLpTokenTotalSupply'
  | 'baseToken'
  | 'baseTokenReserve'
  | 'baseUsdPrice'
  | 'chain'
  | 'date'
  | 'feeBase'
  | 'feeQuote'
  | 'id'
  | 'lpFeeRate'
  | 'pair'
  | 'pairAddress'
  | 'quoteLpTokenTotalSupply'
  | 'quoteToken'
  | 'quoteTokenReserve'
  | 'quoteUsdPrice'
  | 'traders'
  | 'txns'
  | 'untrackedBaseVolume'
  | 'untrackedQuoteVolume'
  | 'updatedAt'
  | 'volumeBase'
  | 'volumeQuote'
  | 'volumeUSD';

export type PairHotPair = {
  baseToken: PairToken;
  chainId: Scalars['Int']['output'];
  createdAtBlockNumber: Scalars['BigInt']['output'];
  createdAtTimestamp: Scalars['BigInt']['output'];
  dataSource: Scalars['String']['output'];
  dataUpdateTime?: Maybe<Scalars['Int']['output']>;
  info: PairPairInfo;
  price24H: Scalars['BigDecimal']['output'];
  priceUsd: Scalars['BigDecimal']['output'];
  quoteToken: PairToken;
};

export type PairHotsListInfo = {
  chainIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<PairHotPair>>>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PairHourData = {
  /** total supply of base lp token */
  baseLpTokenTotalSupply: Scalars['BigDecimal']['output'];
  /** base token */
  baseToken: Token;
  /** base token reserve */
  baseTokenReserve: Scalars['BigDecimal']['output'];
  /** base token price */
  baseUsdPrice: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** base token trading fee get */
  feeBase: Scalars['BigDecimal']['output'];
  /** quote token trading fee */
  feeQuote: Scalars['BigDecimal']['output'];
  /** uinx timestamp(start of hour) */
  hour: Scalars['Int']['output'];
  /** pair address - hour id */
  id: Scalars['ID']['output'];
  /** lp Fee Rate */
  lpFeeRate: Scalars['BigDecimal']['output'];
  /** pair */
  pair?: Maybe<Pair>;
  /** pair address */
  pairAddress: Scalars['Bytes']['output'];
  /** total supply of quote lp token */
  quoteLpTokenTotalSupply: Scalars['BigDecimal']['output'];
  /** quote token */
  quoteToken: Token;
  /** quote token reserve */
  quoteTokenReserve: Scalars['BigDecimal']['output'];
  /** quote token price */
  quoteUsdPrice: Scalars['BigDecimal']['output'];
  /** daily traders */
  traders: Scalars['BigInt']['output'];
  /** daily txns */
  txns: Scalars['BigInt']['output'];
  /** untracked base volume */
  untrackedBaseVolume: Scalars['BigDecimal']['output'];
  /** untracked quote volume */
  untrackedQuoteVolume: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** base token volume */
  volumeBase: Scalars['BigDecimal']['output'];
  /** quote token volume */
  volumeQuote: Scalars['BigDecimal']['output'];
  /** USD volume */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PairHourData_Filter = {
  baseLpTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseLpTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseLpTokenTotalSupply_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  baseToken?: InputMaybe<Scalars['String']['input']>;
  baseTokenReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseTokenReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseTokenReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseToken_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_gt?: InputMaybe<Scalars['String']['input']>;
  baseToken_gte?: InputMaybe<Scalars['String']['input']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_lt?: InputMaybe<Scalars['String']['input']>;
  baseToken_lte?: InputMaybe<Scalars['String']['input']>;
  baseToken_not?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseUsdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lpFeeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lpFeeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pairAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pairAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pairAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  quoteLpTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteLpTokenTotalSupply_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  quoteToken?: InputMaybe<Scalars['String']['input']>;
  quoteTokenReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteTokenReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteTokenReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteToken_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_lte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteUsdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  traders?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedBaseVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedBaseVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  untrackedQuoteVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedQuoteVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PairHourData_OrderBy =
  | 'baseLpTokenTotalSupply'
  | 'baseToken'
  | 'baseTokenReserve'
  | 'baseUsdPrice'
  | 'chain'
  | 'feeBase'
  | 'feeQuote'
  | 'hour'
  | 'id'
  | 'lpFeeRate'
  | 'pair'
  | 'pairAddress'
  | 'quoteLpTokenTotalSupply'
  | 'quoteToken'
  | 'quoteTokenReserve'
  | 'quoteUsdPrice'
  | 'traders'
  | 'txns'
  | 'untrackedBaseVolume'
  | 'untrackedQuoteVolume'
  | 'updatedAt'
  | 'volumeBase'
  | 'volumeQuote'
  | 'volumeUSD';

export type PairLinks = {
  telegram?: Maybe<Scalars['String']['output']>;
  tiktok?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  youtube?: Maybe<Scalars['String']['output']>;
};

export type PairMetrics = {
  circulatingSupply?: Maybe<Scalars['BigInt']['output']>;
  holders?: Maybe<Scalars['BigInt']['output']>;
  holdersUpdatedAt?: Maybe<Scalars['String']['output']>;
  maxSupply?: Maybe<Scalars['BigDecimal']['output']>;
  totalSupply?: Maybe<Scalars['BigInt']['output']>;
  totalSupplyUpdatedAt?: Maybe<Scalars['String']['output']>;
  txCount?: Maybe<Scalars['BigInt']['output']>;
};

export type PairPairInfo = {
  description?: Maybe<Scalars['String']['output']>;
  exchange?: Maybe<Scalars['String']['output']>;
  links?: Maybe<PairLinks>;
  metrics?: Maybe<PairMetrics>;
  pair?: Maybe<Scalars['String']['output']>;
};

export type PairToken = {
  chainId: Scalars['Int']['output'];
  cmc?: Maybe<Scalars['String']['output']>;
  coingecko?: Maybe<Scalars['String']['output']>;
  decimals: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** token logo img */
  logoImg?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigInt']['output'];
};

export type PairTrader = {
  chain: Scalars['String']['output'];
  /** pair address - user address */
  id: Scalars['ID']['output'];
  /** last trade time */
  lastTxTime: Scalars['BigInt']['output'];
  /** pair */
  pair?: Maybe<Pair>;
  /** user */
  trader: User;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type PairTrader_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastTxTime?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastTxTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  trader?: InputMaybe<Scalars['String']['input']>;
  trader_contains?: InputMaybe<Scalars['String']['input']>;
  trader_ends_with?: InputMaybe<Scalars['String']['input']>;
  trader_gt?: InputMaybe<Scalars['String']['input']>;
  trader_gte?: InputMaybe<Scalars['String']['input']>;
  trader_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trader_lt?: InputMaybe<Scalars['String']['input']>;
  trader_lte?: InputMaybe<Scalars['String']['input']>;
  trader_not?: InputMaybe<Scalars['String']['input']>;
  trader_not_contains?: InputMaybe<Scalars['String']['input']>;
  trader_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  trader_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trader_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  trader_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type PairTrader_OrderBy =
  | 'chain'
  | 'id'
  | 'lastTxTime'
  | 'pair'
  | 'trader'
  | 'updatedAt';

export type Pair_Filter = {
  baseLpToken?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_contains?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_gt?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_gte?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseLpToken_lt?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_lte?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_not?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseLpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseLpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseSymbol?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_contains?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_gt?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_gte?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseSymbol_lt?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_lte?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_not?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseSymbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseSymbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseToken?: InputMaybe<Scalars['String']['input']>;
  baseToken_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_gt?: InputMaybe<Scalars['String']['input']>;
  baseToken_gte?: InputMaybe<Scalars['String']['input']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_lt?: InputMaybe<Scalars['String']['input']>;
  baseToken_lte?: InputMaybe<Scalars['String']['input']>;
  baseToken_not?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creator?: InputMaybe<Scalars['Bytes']['input']>;
  creator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creator_not?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  i?: InputMaybe<Scalars['String']['input']>;
  i_contains?: InputMaybe<Scalars['String']['input']>;
  i_ends_with?: InputMaybe<Scalars['String']['input']>;
  i_gt?: InputMaybe<Scalars['String']['input']>;
  i_gte?: InputMaybe<Scalars['String']['input']>;
  i_in?: InputMaybe<Array<Scalars['String']['input']>>;
  i_lt?: InputMaybe<Scalars['String']['input']>;
  i_lte?: InputMaybe<Scalars['String']['input']>;
  i_not?: InputMaybe<Scalars['String']['input']>;
  i_not_contains?: InputMaybe<Scalars['String']['input']>;
  i_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  i_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  i_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  i_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isDepositBaseAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isDepositBaseAllowed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDepositBaseAllowed_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDepositBaseAllowed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDepositQuoteAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isDepositQuoteAllowed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDepositQuoteAllowed_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDepositQuoteAllowed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isTradeAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  isTradeAllowed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isTradeAllowed_not?: InputMaybe<Scalars['Boolean']['input']>;
  isTradeAllowed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  k?: InputMaybe<Scalars['String']['input']>;
  k_contains?: InputMaybe<Scalars['String']['input']>;
  k_ends_with?: InputMaybe<Scalars['String']['input']>;
  k_gt?: InputMaybe<Scalars['String']['input']>;
  k_gte?: InputMaybe<Scalars['String']['input']>;
  k_in?: InputMaybe<Array<Scalars['String']['input']>>;
  k_lt?: InputMaybe<Scalars['String']['input']>;
  k_lte?: InputMaybe<Scalars['String']['input']>;
  k_not?: InputMaybe<Scalars['String']['input']>;
  k_not_contains?: InputMaybe<Scalars['String']['input']>;
  k_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  k_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  k_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  k_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastTradePrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastTradePrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastTradePrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpFeeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lpFeeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lpFeeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainer?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maintainer_not?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mtFeeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeRate?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRateModel?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_contains?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mtFeeRateModel_not?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  mtFeeRateModel_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mtFeeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mtFeeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  mtFeeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mtFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_contains?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_gt?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_gte?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteLpToken_lt?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_lte?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_not?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteLpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteLpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteReserve?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteReserve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteReserve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteSymbol?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_contains?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_gt?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_gte?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteSymbol_lt?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_lte?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_not?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteSymbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteSymbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken?: InputMaybe<Scalars['String']['input']>;
  quoteToken_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_gte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']['input']>;
  quoteToken_lte?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  source_contains?: InputMaybe<Scalars['String']['input']>;
  source_ends_with?: InputMaybe<Scalars['String']['input']>;
  source_gt?: InputMaybe<Scalars['String']['input']>;
  source_gte?: InputMaybe<Scalars['String']['input']>;
  source_in?: InputMaybe<Array<Scalars['String']['input']>>;
  source_lt?: InputMaybe<Scalars['String']['input']>;
  source_lte?: InputMaybe<Scalars['String']['input']>;
  source_not?: InputMaybe<Scalars['String']['input']>;
  source_not_contains?: InputMaybe<Scalars['String']['input']>;
  source_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  source_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  source_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  source_starts_with?: InputMaybe<Scalars['String']['input']>;
  traderCount?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  untrackedBaseVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedBaseVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedBaseVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  untrackedQuoteVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedQuoteVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedQuoteVolume_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeBaseToken?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeBaseToken_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBaseToken_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuoteToken?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeQuoteToken_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeQuoteToken_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Pair_OrderBy =
  | 'baseLpToken'
  | 'baseReserve'
  | 'baseSymbol'
  | 'baseToken'
  | 'chain'
  | 'createdAtBlockNumber'
  | 'createdAtTimestamp'
  | 'creator'
  | 'feeBase'
  | 'feeQuote'
  | 'feeUSD'
  | 'i'
  | 'id'
  | 'isDepositBaseAllowed'
  | 'isDepositQuoteAllowed'
  | 'isTradeAllowed'
  | 'k'
  | 'lastTradePrice'
  | 'liquidityProviderCount'
  | 'lpFeeRate'
  | 'maintainer'
  | 'mtFeeBase'
  | 'mtFeeQuote'
  | 'mtFeeRate'
  | 'mtFeeRateModel'
  | 'mtFeeUSD'
  | 'owner'
  | 'quoteLpToken'
  | 'quoteReserve'
  | 'quoteSymbol'
  | 'quoteToken'
  | 'source'
  | 'traderCount'
  | 'txCount'
  | 'type'
  | 'untrackedBaseVolume'
  | 'untrackedQuoteVolume'
  | 'updatedAt'
  | 'volumeBaseToken'
  | 'volumeQuoteToken'
  | 'volumeUSD';

export type Pairhots_List_Info_Filter = {
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PersistentString = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type PersistentStringArray = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type PersistentStringArray_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type PersistentStringArray_OrderBy = 'chain' | 'id';

export type PersistentString_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type PersistentString_OrderBy = 'chain' | 'id';

export type Pool = {
  allFlag: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  borrowSafe: Scalars['Boolean']['output'];
  canBeLiquidated: Scalars['Boolean']['output'];
  chain: Scalars['String']['output'];
  collateralRatio: Scalars['BigInt']['output'];
  collectedFeesToken0: Scalars['BigDecimal']['output'];
  collectedFeesToken1: Scalars['BigDecimal']['output'];
  collectedFeesUSD: Scalars['BigDecimal']['output'];
  createdAtBlockNumber: Scalars['BigInt']['output'];
  createdAtTimestamp: Scalars['BigInt']['output'];
  /** creator */
  creator: Scalars['Bytes']['output'];
  feeRate: Scalars['BigInt']['output'];
  /** MMInfo feeRateModel */
  feeRateModel: Scalars['Bytes']['output'];
  feeTier: Scalars['BigInt']['output'];
  feesUSD: Scalars['BigDecimal']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** D3Vault isRemove */
  isRemove: Scalars['Boolean']['output'];
  liquidateStatus: PoolLiquidateStatus;
  liquidity: Scalars['BigInt']['output'];
  liquidityProviderCount: Scalars['BigInt']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /** lp token */
  lpToken: Scalars['String']['output'];
  /** MMInfo maintainer */
  maintainer: Scalars['Bytes']['output'];
  /** MMInfo maker */
  maker: Scalars['Bytes']['output'];
  observationIndex: Scalars['BigInt']['output'];
  /** MMInfo oracle */
  oracle: Scalars['Bytes']['output'];
  /** owner */
  owner: Scalars['Bytes']['output'];
  poolDayDatas?: Maybe<Array<PoolDayData>>;
  safe: Scalars['Boolean']['output'];
  sqrtPrice: Scalars['BigInt']['output'];
  /** staked balance */
  staked: Scalars['BigDecimal']['output'];
  tick?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  token0: Token;
  token0Price: Scalars['BigDecimal']['output'];
  token1: Token;
  token1Price: Scalars['BigDecimal']['output'];
  tokenList: Array<PoolToken>;
  totalAssetsUSD: Scalars['BigDecimal']['output'];
  totalAssetsValue: Scalars['BigInt']['output'];
  totalDebtUSD: Scalars['BigDecimal']['output'];
  totalDebtValue: Scalars['BigInt']['output'];
  totalValueLockedETH: Scalars['BigDecimal']['output'];
  totalValueLockedToken0: Scalars['BigDecimal']['output'];
  totalValueLockedToken1: Scalars['BigDecimal']['output'];
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  untrackedVolumeUSD: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** MMInfo vault */
  vault: Vault;
  /** version */
  version?: Maybe<Scalars['String']['output']>;
  volumeToken0: Scalars['BigDecimal']['output'];
  volumeToken1: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PoolPoolDayDatasArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDayData_Filter>;
};

export type PoolTokenListArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolToken_Filter>;
};

export type PoolDayData = {
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** pool address - day id */
  id: Scalars['ID']['output'];
  /** Daily trading mtFee usd */
  mtFeeUSD: Scalars['BigDecimal']['output'];
  /** pool */
  pool?: Maybe<Pool>;
  /** Daily trading swapFee usd */
  swapFeeUSD: Scalars['BigDecimal']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** getTotalAssetsValue the total asset value in USD */
  totalAssetsUSD: Scalars['BigDecimal']['output'];
  totalAssetsValue: Scalars['BigInt']['output'];
  /** getTotalDebtValue the total debt value in USD */
  totalDebtUSD: Scalars['BigDecimal']['output'];
  totalDebtValue: Scalars['BigInt']['output'];
  /** Number of daily trading users */
  traders: Scalars['BigInt']['output'];
  /** Daily trading volume usd */
  tradingVolumeUSD: Scalars['BigDecimal']['output'];
  /** Number of daily transactions */
  txns: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type PoolDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  mtFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAssetsUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAssetsUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAssetsValue?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAssetsValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebtUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDebtUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDebtValue?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebtValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traders?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradingVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradingVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  txns?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type PoolDayData_OrderBy =
  | 'date'
  | 'id'
  | 'mtFeeUSD'
  | 'pool'
  | 'swapFeeUSD'
  | 'timestamp'
  | 'totalAssetsUSD'
  | 'totalAssetsValue'
  | 'totalDebtUSD'
  | 'totalDebtValue'
  | 'traders'
  | 'tradingVolumeUSD'
  | 'txns'
  | 'updatedAt';

export type PoolFunding = {
  amount: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  interests: Scalars['BigInt']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  lpToken?: Maybe<Token>;
  pool: Pool;
  poolFundingType: PoolFundingType;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  token: Token;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** belong vault */
  vault: Vault;
};

export type PoolFundingType = 'Borrow' | 'Repay';

export type PoolFunding_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  interests?: InputMaybe<Scalars['BigInt']['input']>;
  interests_gt?: InputMaybe<Scalars['BigInt']['input']>;
  interests_gte?: InputMaybe<Scalars['BigInt']['input']>;
  interests_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  interests_lt?: InputMaybe<Scalars['BigInt']['input']>;
  interests_lte?: InputMaybe<Scalars['BigInt']['input']>;
  interests_not?: InputMaybe<Scalars['BigInt']['input']>;
  interests_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_?: InputMaybe<Token_Filter>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolFundingType?: InputMaybe<PoolFundingType>;
  poolFundingType_in?: InputMaybe<Array<PoolFundingType>>;
  poolFundingType_not?: InputMaybe<PoolFundingType>;
  poolFundingType_not_in?: InputMaybe<Array<PoolFundingType>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type PoolFunding_OrderBy =
  | 'amount'
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'interests'
  | 'logIndex'
  | 'lpToken'
  | 'pool'
  | 'poolFundingType'
  | 'timestamp'
  | 'token'
  | 'updatedAt'
  | 'vault';

export type PoolLiquidateStatus =
  | 'FinishLiquidation'
  | 'Liquidate'
  | 'Normal'
  | 'StartLiquidation';

export type PoolRealVolumeUsd = {
  chain?: Maybe<Scalars['String']['output']>;
  pairId?: Maybe<Scalars['String']['output']>;
  volumeUsd?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PoolToken = {
  borrowAmount: Scalars['BigInt']['output'];
  /** D3Vault getExchangeRate */
  exchangeRate?: Maybe<Scalars['BigInt']['output']>;
  /** pool address - token id */
  id: Scalars['ID']['output'];
  /** D3Vault getLatestBorrowIndex */
  latestBorrowIndex?: Maybe<Scalars['BigInt']['output']>;
  latestOraclePrice: Scalars['BigInt']['output'];
  latestOraclePriceUSD: Scalars['BigDecimal']['output'];
  makerDepositAmount: Scalars['BigInt']['output'];
  makerWithdrawAmount: Scalars['BigInt']['output'];
  /** pool */
  pool: Pool;
  /** D3Vault getPoolLeftQuota */
  poolLeftQuota?: Maybe<Scalars['BigInt']['output']>;
  repayAmount: Scalars['BigInt']['output'];
  reserve: Scalars['BigInt']['output'];
  token: Token;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type PoolTokenHistory = {
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  borrowAmount: Scalars['BigInt']['output'];
  eventType: Scalars['String']['output'];
  /** D3Vault getExchangeRate */
  exchangeRate?: Maybe<Scalars['BigInt']['output']>;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }-{ pool id }-{ token id }  */
  id: Scalars['ID']['output'];
  /** D3Vault getLatestBorrowIndex */
  latestBorrowIndex?: Maybe<Scalars['BigInt']['output']>;
  latestOraclePrice: Scalars['BigInt']['output'];
  latestOraclePriceUSD: Scalars['BigDecimal']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  makerDepositAmount: Scalars['BigInt']['output'];
  makerWithdrawAmount: Scalars['BigInt']['output'];
  /** pool */
  pool: Pool;
  /** D3Vault getPoolLeftQuota */
  poolLeftQuota?: Maybe<Scalars['BigInt']['output']>;
  repayAmount: Scalars['BigInt']['output'];
  reserve: Scalars['BigInt']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  token: Token;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type PoolTokenHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowAmount?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  eventType_contains?: InputMaybe<Scalars['String']['input']>;
  eventType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_ends_with?: InputMaybe<Scalars['String']['input']>;
  eventType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_gt?: InputMaybe<Scalars['String']['input']>;
  eventType_gte?: InputMaybe<Scalars['String']['input']>;
  eventType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  eventType_lt?: InputMaybe<Scalars['String']['input']>;
  eventType_lte?: InputMaybe<Scalars['String']['input']>;
  eventType_not?: InputMaybe<Scalars['String']['input']>;
  eventType_not_contains?: InputMaybe<Scalars['String']['input']>;
  eventType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  eventType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  eventType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  eventType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_starts_with?: InputMaybe<Scalars['String']['input']>;
  eventType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  latestBorrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestBorrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  latestOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  makerDepositAmount?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerDepositAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerWithdrawAmount?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerWithdrawAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolLeftQuota?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolLeftQuota_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  repayAmount?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserve?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserve_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type PoolTokenHistory_OrderBy =
  | 'blockNumber'
  | 'borrowAmount'
  | 'eventType'
  | 'exchangeRate'
  | 'hash'
  | 'id'
  | 'latestBorrowIndex'
  | 'latestOraclePrice'
  | 'latestOraclePriceUSD'
  | 'logIndex'
  | 'makerDepositAmount'
  | 'makerWithdrawAmount'
  | 'pool'
  | 'poolLeftQuota'
  | 'repayAmount'
  | 'reserve'
  | 'timestamp'
  | 'token'
  | 'updatedAt';

export type PoolToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  borrowAmount?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  latestBorrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestBorrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestBorrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  latestOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerDepositAmount?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerDepositAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  makerDepositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerWithdrawAmount?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  makerWithdrawAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  makerWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolLeftQuota?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolLeftQuota_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolLeftQuota_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  repayAmount?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserve?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserve_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserve_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type PoolToken_OrderBy =
  | 'borrowAmount'
  | 'exchangeRate'
  | 'id'
  | 'latestBorrowIndex'
  | 'latestOraclePrice'
  | 'latestOraclePriceUSD'
  | 'makerDepositAmount'
  | 'makerWithdrawAmount'
  | 'pool'
  | 'poolLeftQuota'
  | 'repayAmount'
  | 'reserve'
  | 'token'
  | 'updatedAt';

export type PoolTradeHistory = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type PoolTradeHistory_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type PoolTradeHistory_OrderBy = 'chain' | 'id';

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allFlag?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_gt?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_gte?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allFlag_lt?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_lte?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_not?: InputMaybe<Scalars['BigInt']['input']>;
  allFlag_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowSafe?: InputMaybe<Scalars['Boolean']['input']>;
  borrowSafe_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  borrowSafe_not?: InputMaybe<Scalars['Boolean']['input']>;
  borrowSafe_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBeLiquidated?: InputMaybe<Scalars['Boolean']['input']>;
  canBeLiquidated_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBeLiquidated_not?: InputMaybe<Scalars['Boolean']['input']>;
  canBeLiquidated_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralRatio?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collectedFeesToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  collectedFeesToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken0_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  collectedFeesToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  collectedFeesToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesToken1_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  collectedFeesUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  collectedFeesUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  collectedFeesUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creator?: InputMaybe<Scalars['Bytes']['input']>;
  creator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creator_not?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeRate?: InputMaybe<Scalars['BigInt']['input']>;
  feeRateModel?: InputMaybe<Scalars['Bytes']['input']>;
  feeRateModel_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeRateModel_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeRateModel_not?: InputMaybe<Scalars['Bytes']['input']>;
  feeRateModel_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeRateModel_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  feeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  feeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  feeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  feeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  feeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feeTier?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_gt?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_gte?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feeTier_lt?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_lte?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_not?: InputMaybe<Scalars['BigInt']['input']>;
  feeTier_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feesUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feesUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feesUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRemove?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRemove_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  liquidateStatus?: InputMaybe<PoolLiquidateStatus>;
  liquidateStatus_in?: InputMaybe<Array<PoolLiquidateStatus>>;
  liquidateStatus_not?: InputMaybe<PoolLiquidateStatus>;
  liquidateStatus_not_in?: InputMaybe<Array<PoolLiquidateStatus>>;
  liquidity?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  maintainer?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maintainer_not?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maker?: InputMaybe<Scalars['Bytes']['input']>;
  maker_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maker_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maker_not?: InputMaybe<Scalars['Bytes']['input']>;
  maker_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maker_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  observationIndex?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  observationIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  observationIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  oracle?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_contains?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  oracle_not?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolDayDatas_?: InputMaybe<PoolDayData_Filter>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  safe?: InputMaybe<Scalars['Boolean']['input']>;
  safe_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  safe_not?: InputMaybe<Scalars['Boolean']['input']>;
  safe_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  sqrtPrice?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sqrtPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  sqrtPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  staked?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  staked_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  staked_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tick?: InputMaybe<Scalars['String']['input']>;
  tick_contains?: InputMaybe<Scalars['String']['input']>;
  tick_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_gt?: InputMaybe<Scalars['String']['input']>;
  tick_gte?: InputMaybe<Scalars['String']['input']>;
  tick_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_lt?: InputMaybe<Scalars['String']['input']>;
  tick_lte?: InputMaybe<Scalars['String']['input']>;
  tick_not?: InputMaybe<Scalars['String']['input']>;
  tick_not_contains?: InputMaybe<Scalars['String']['input']>;
  tick_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tick_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tick_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tick_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token0?: InputMaybe<Scalars['String']['input']>;
  token0Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0_contains?: InputMaybe<Scalars['String']['input']>;
  token0_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_gt?: InputMaybe<Scalars['String']['input']>;
  token0_gte?: InputMaybe<Scalars['String']['input']>;
  token0_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_lt?: InputMaybe<Scalars['String']['input']>;
  token0_lte?: InputMaybe<Scalars['String']['input']>;
  token0_not?: InputMaybe<Scalars['String']['input']>;
  token0_not_contains?: InputMaybe<Scalars['String']['input']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1?: InputMaybe<Scalars['String']['input']>;
  token1Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1_contains?: InputMaybe<Scalars['String']['input']>;
  token1_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_gt?: InputMaybe<Scalars['String']['input']>;
  token1_gte?: InputMaybe<Scalars['String']['input']>;
  token1_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_lt?: InputMaybe<Scalars['String']['input']>;
  token1_lte?: InputMaybe<Scalars['String']['input']>;
  token1_not?: InputMaybe<Scalars['String']['input']>;
  token1_not_contains?: InputMaybe<Scalars['String']['input']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenList_?: InputMaybe<PoolToken_Filter>;
  totalAssetsUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAssetsUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAssetsValue?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAssetsValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAssetsValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebtUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDebtUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDebtUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDebtValue?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebtValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebtValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedETH_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalValueLockedToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken0_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalValueLockedToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedToken1_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalValueLockedUSDUntracked_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSDUntracked_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_contains?: InputMaybe<Scalars['String']['input']>;
  version_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_gt?: InputMaybe<Scalars['String']['input']>;
  version_gte?: InputMaybe<Scalars['String']['input']>;
  version_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_lt?: InputMaybe<Scalars['String']['input']>;
  version_lte?: InputMaybe<Scalars['String']['input']>;
  version_not?: InputMaybe<Scalars['String']['input']>;
  version_not_contains?: InputMaybe<Scalars['String']['input']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  volumeToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Pool_OrderBy =
  | 'allFlag'
  | 'blockNumber'
  | 'borrowSafe'
  | 'canBeLiquidated'
  | 'chain'
  | 'collateralRatio'
  | 'collectedFeesToken0'
  | 'collectedFeesToken1'
  | 'collectedFeesUSD'
  | 'createdAtBlockNumber'
  | 'createdAtTimestamp'
  | 'creator'
  | 'feeRate'
  | 'feeRateModel'
  | 'feeTier'
  | 'feesUSD'
  | 'hash'
  | 'id'
  | 'isRemove'
  | 'liquidateStatus'
  | 'liquidity'
  | 'liquidityProviderCount'
  | 'logIndex'
  | 'lpToken'
  | 'maintainer'
  | 'maker'
  | 'observationIndex'
  | 'oracle'
  | 'owner'
  | 'poolDayDatas'
  | 'safe'
  | 'sqrtPrice'
  | 'staked'
  | 'tick'
  | 'timestamp'
  | 'token0'
  | 'token0Price'
  | 'token1'
  | 'token1Price'
  | 'tokenList'
  | 'totalAssetsUSD'
  | 'totalAssetsValue'
  | 'totalDebtUSD'
  | 'totalDebtValue'
  | 'totalValueLockedETH'
  | 'totalValueLockedToken0'
  | 'totalValueLockedToken1'
  | 'totalValueLockedUSD'
  | 'totalValueLockedUSDUntracked'
  | 'txCount'
  | 'untrackedVolumeUSD'
  | 'updatedAt'
  | 'vault'
  | 'version'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD';

export type Poolreal_Volume_Usd_Filter = {
  chain: Scalars['String']['input'];
  pairId: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  achievement_detail?: Maybe<AchievementAchievementDetail>;
  /** data url:post(https://host:port/achievements/me).data */
  achievement_me?: Maybe<AchievementUserAchievementPrcocess>;
  activity_banner_query?: Maybe<Activity_BannerActivityBanner>;
  aggregateFragment?: Maybe<AggregateFragment>;
  aggregateFragments: Array<AggregateFragment>;
  all?: Maybe<All>;
  alls: Array<All>;
  announcement_getAnnouncement?: Maybe<AnnouncementAnnouncementList>;
  approval?: Maybe<Approval>;
  approvals: Array<Approval>;
  auction_auctionActive?: Maybe<Array<Maybe<AuctionAuctionActive>>>;
  auction_auctionDetail?: Maybe<AuctionAuctionDetail>;
  auction_auctionList?: Maybe<Array<Maybe<AuctionAuctionList>>>;
  auction_auctionOperationRecord?: Maybe<AuctionAuctionOperationRecord>;
  auth_login: AuthAccessTokenResponse;
  avatar?: Maybe<Avatar>;
  avatarBalance?: Maybe<AvatarBalance>;
  avatarBalances: Array<AvatarBalance>;
  avatarDecomposeHistories: Array<AvatarDecomposeHistory>;
  avatarDecomposeHistory?: Maybe<AvatarDecomposeHistory>;
  avatarMintHistories: Array<AvatarMintHistory>;
  avatarMintHistory?: Maybe<AvatarMintHistory>;
  avatarTransferHistories: Array<AvatarTransferHistory>;
  avatarTransferHistory?: Maybe<AvatarTransferHistory>;
  avatars: Array<Avatar>;
  balance?: Maybe<Balance>;
  balances: Array<Balance>;
  bidHistories: Array<BidHistory>;
  bidHistory?: Maybe<BidHistory>;
  bidPosition?: Maybe<BidPosition>;
  bidPositions: Array<BidPosition>;
  brand_site_announcement_list?: Maybe<Brand_Site_AnnouncementBrandSiteAnnouncementList>;
  brand_site_banner_list?: Maybe<
    Array<Maybe<Brand_Site_BannerBrandSiteBanner>>
  >;
  /** 获取 RPC 节点，缓存1分钟，每分钟重新排序；排序规则：可访问 > 响应速度 > 区块高度 */
  browser_getRpc: Scalars['JSON']['output'];
  chart_getOhlcv2Chart: Array<Maybe<Array<Maybe<Scalars['String']['output']>>>>;
  chart_getOhlcvData: Array<Maybe<Array<Maybe<Scalars['String']['output']>>>>;
  claimHistories: Array<ClaimHistory>;
  claimHistory?: Maybe<ClaimHistory>;
  coinmarketcap_token_list?: Maybe<
    Array<Maybe<Coinmarketcap_TokenCoinmarketcapTokenlist>>
  >;
  component?: Maybe<Component>;
  componentBalance?: Maybe<ComponentBalance>;
  componentBalances: Array<ComponentBalance>;
  componentBurnHistories: Array<ComponentBurnHistory>;
  componentBurnHistory?: Maybe<ComponentBurnHistory>;
  componentMintHistories: Array<ComponentMintHistory>;
  componentMintHistory?: Maybe<ComponentMintHistory>;
  componentTransferHistories: Array<ComponentTransferHistory>;
  componentTransferHistory?: Maybe<ComponentTransferHistory>;
  components: Array<Component>;
  controller?: Maybe<Controller>;
  controllers: Array<Controller>;
  cross_chain_swap_dodoOrderList?: Maybe<Cross_Chain_SwapCrossChainOrderList>;
  cross_chain_swap_orderCreate?: Maybe<Cross_Chain_SwapCrossChainOrderCreate>;
  cross_chain_swap_orderDetail?: Maybe<Cross_Chain_SwapCrossChainOrderDetail>;
  cross_chain_swap_orderList?: Maybe<Cross_Chain_SwapCrossChainOrderList>;
  cross_chain_swap_orderNewStatus?: Maybe<
    Array<Maybe<Cross_Chain_SwapCrossChainOrderNewStatusList>>
  >;
  cross_chain_swap_orderRefundCount?: Maybe<Cross_Chain_SwapOrderRefundCountResult>;
  cross_chain_swap_routesV2?: Maybe<Cross_Chain_SwapCrossChainRouteV2>;
  cross_chain_swap_transactionEncode?: Maybe<Cross_Chain_SwapCrossChainTransactionEncode>;
  cross_chain_token_list?: Maybe<Cross_Chain_TokenCrossChainTokenlist>;
  cross_chain_token_tokenPair?: Maybe<Cross_Chain_TokenCrossChainTokenPair>;
  crowdPooling?: Maybe<CrowdPooling>;
  crowdPoolingDayData?: Maybe<CrowdPoolingDayData>;
  crowdPoolingDayDatas: Array<CrowdPoolingDayData>;
  crowdPoolingHourData?: Maybe<CrowdPoolingHourData>;
  crowdPoolingHourDatas: Array<CrowdPoolingHourData>;
  crowdPoolings: Array<CrowdPooling>;
  crowd_pooling_count_data?: Maybe<Crowd_PoolingCountData>;
  crowd_pooling_list?: Maybe<Array<Maybe<Crowd_PoolingCrowdpoolingList>>>;
  crowd_pooling_read_server_list?: Maybe<
    Array<Maybe<Crowd_Pooling_Read_ServerCrowdpoolingList>>
  >;
  crowd_pooling_read_server_unvote?: Maybe<Crowd_Pooling_Read_ServerJwt>;
  crowd_pooling_read_server_vote?: Maybe<Crowd_Pooling_Read_ServerJwt>;
  crowd_pooling_read_server_voteList?: Maybe<
    Array<Maybe<Crowd_Pooling_Read_ServerCrowdpoolingVoteList>>
  >;
  crowd_pooling_top_list?: Maybe<Array<Maybe<Crowd_PoolingCrowdPooling>>>;
  crowd_pooling_unvote?: Maybe<Crowd_PoolingJwt>;
  crowd_pooling_vote?: Maybe<Crowd_PoolingJwt>;
  crowd_pooling_voteList?: Maybe<
    Array<Maybe<Crowd_PoolingCrowdpoolingVoteList>>
  >;
  /** 资产每日收益折线图 */
  d3mm_getAssetDailyInterests: Array<Maybe<D3mmAssetDailyInterest>>;
  /** 资产详情信息, 如果资产不存在则返回null */
  d3mm_getAssetInfo?: Maybe<D3mmAssetInfo>;
  /** 资产操作历史 */
  d3mm_getAssetOperationPagination: D3mmAssetOperationPaginationResult;
  /** 资产的策略信息列表，Strategy Pool Details */
  d3mm_getAssetStrategiesList: D3mmAssetSimplifyStrategyPaginationResult;
  /** 资产列表 */
  d3mm_getAssetsList: D3mmSimplifyAssetPaginationResult;
  /** 总LP APY收益折线图 */
  d3mm_getLiquidityProviderDailyProfits: Array<
    Maybe<D3mmLiquidityProviderDailyProfit>
  >;
  /** V3 概览, 如果链不支持则返回null */
  d3mm_getOverview?: Maybe<D3mmOverview>;
  /** SP Strategy 列表 */
  d3mm_getStrategiesList: D3mmStrategyPoolPaginationResult;
  /** 策略的资产信息列表 */
  d3mm_getStrategyAssets: Array<Maybe<D3mmStrategyPoolAsset>>;
  /** 策略的每日交易量折线图 */
  d3mm_getStrategyDailySwaps: Array<Maybe<D3mmPoolDailySwap>>;
  /** 策略信息, 如果池子不存在则返回null */
  d3mm_getStrategyInfo?: Maybe<D3mmStrategyPoolInfo>;
  /** 总SP APY收益折线图 */
  d3mm_getStrategyProviderDailyInterests: Array<
    Maybe<D3mmStrategyProviderDailyInterest>
  >;
  /** 策略的交易记录列表 */
  d3mm_getStrategySwapsList: D3mmPoolSwapPaginationResult;
  /** 用户的资产收益信息, 如果用户不存在则返回null */
  d3mm_getUserCapitalsInfo?: Maybe<D3mmUserCapitalsInfo>;
  /** 资产列表 */
  d3mt_getAssetList: D3mtAssetPaginationResult;
  /** 用户的资产概览 */
  d3mt_getUserOverview: D3mtUserOverviewResult;
  /** 用户的持仓信息 */
  d3mt_getUserPositionInfo: D3mtPositionResult;
  /** 用户的持仓列表, 排序是风险率，最后一次操作时间 */
  d3mt_getUserPositionList: D3mtPositionPaginationResult;
  dODO?: Maybe<Dodo>;
  dODOs: Array<Dodo>;
  dailyScheduledTask?: Maybe<DailyScheduledTask>;
  dailyScheduledTasks: Array<DailyScheduledTask>;
  dashboard_chain_day_data?: Maybe<DashboardChainDailyData>;
  dashboard_chain_summary_and_daily_data: DashboardChainSummaryAndDailyData;
  dashboard_pair_count_data_range_time?: Maybe<DashboardPairData>;
  dashboard_pairs_count_data?: Maybe<DashboardDataCount>;
  /** url: {{host}}/dashboard/ */
  dashboard_pairs_day_data?: Maybe<Array<Maybe<DashboardDataGroupByDate>>>;
  dashboard_pairs_detail?: Maybe<DashboardPairGroup>;
  dashboard_pairs_hour_data?: Maybe<Array<Maybe<DashboardDataGroupByDate>>>;
  dashboard_pairs_list?: Maybe<DashboardPairList>;
  dashboard_pairs_pair_symbol_list?: Maybe<Array<Maybe<DashboardPairGroup>>>;
  dashboard_pairs_rate_24?: Maybe<DashboardRate24Data>;
  decimalValue?: Maybe<DecimalValue>;
  decimalValues: Array<DecimalValue>;
  depositHistories: Array<DepositHistory>;
  depositHistory?: Maybe<DepositHistory>;
  dip_whitelist_list?: Maybe<Array<Maybe<Dip_WhitelistDipWhitelist>>>;
  discover_fragments?: Maybe<Array<Maybe<DiscoverFragment>>>;
  discover_hots?: Maybe<Array<Maybe<DiscoverHot>>>;
  discover_tokens?: Maybe<Array<Maybe<DiscoverToken>>>;
  dodoAvatar?: Maybe<DodoAvatar>;
  dodoAvatars: Array<DodoAvatar>;
  dodoDayData?: Maybe<DodoDayData>;
  dodoDayDatas: Array<DodoDayData>;
  dodoStarter?: Maybe<DodoStarter>;
  dodoStarters: Array<DodoStarter>;
  dodoToken?: Maybe<DodoToken>;
  dodoTokens: Array<DodoToken>;
  dodoZoo?: Maybe<DodoZoo>;
  dodoZoos: Array<DodoZoo>;
  dodo_app_version_new?: Maybe<Dodo_App_VersionDodoAppVersion>;
  dodo_two_anniversary_activity_list?: Maybe<
    Array<Maybe<Dodo_Two_Anniversary_ActivityDodoTwoAnniversaryActivityList>>
  >;
  dodo_two_anniversary_h5_qa_activity_save?: Maybe<Dodo_Two_Anniversary_H5_Qa_ActivitySaveDodoTwoAnniversaryH5QaActivity>;
  /** 接受邀请 */
  dodochain_acceptInvite: Scalars['Boolean']['output'];
  dodochain_activity_getClaimActivity: Dodochain_ActivityActivityPaginationResult;
  dodochain_activity_getLiquidityActivity: Dodochain_ActivityActivityPaginationResult;
  dodochain_activity_getStakeActivity: Dodochain_ActivityActivityPaginationResult;
  dodochain_assets_getAssetsData: Dodochain_AssetsAssetsData;
  dodochain_assets_getClaimableRewardsData: Dodochain_AssetsClaimableRewardsData;
  dodochain_assets_getLpDepositedData: Dodochain_AssetsLpDepositedData;
  dodochain_assets_getStakedData: Dodochain_AssetsStakedData;
  dodochain_assets_getWalletBalanceData: Dodochain_AssetsWalletBalanceData;
  dodochain_dashboard_getBridgeDataChart: Dodochain_DashboardBridgeDataChart;
  dodochain_dashboard_getLiquidityStakeChart: Dodochain_DashboardLiquidityStakeChart;
  dodochain_dashboard_getLiquidityStakeOverview: Dodochain_DashboardLiquidityStakeOverview;
  /** dashboard SupportChains */
  dodochain_dashboard_getSupportChains: Dodochain_DashboardSupportChains;
  /** dashboard SupportTokens */
  dodochain_dashboard_getSupportTokens: Dodochain_DashboardSupportTokens;
  dodochain_earn_list?: Maybe<Dodochain_EarnListInfo>;
  /** 获取邀请码 */
  dodochain_getInviteCode: Scalars['String']['output'];
  /** 查看被邀请状态 */
  dodochain_getInviteStatus: DodochainInviteStatusResult;
  /** 获取被邀请者的列表 */
  dodochain_getInviteesList: DodochainInviteesPaginationResult;
  /** 汇总数据概览 */
  dodochain_getOverviewJourneyOne: DodochainOverview;
  /** 获取twigs挖矿数据概览 */
  dodochain_getOverviewTwigsMine: DodochainTwigsMineOverview;
  /** 获取stake dashboard数据 */
  dodochain_getStakeDashboardDatas: Array<
    Maybe<DodochainStakeDashboardDataResult>
  >;
  /** 获取twigs挖矿列表 */
  dodochain_getTwigsMineList: DodochainTwigsMinePaginationResult;
  /** 获取积分详情 阶段一 */
  dodochain_getUserPointsDetailJourneyOne: DodochainUserPointsDetailPaginationResult;
  /** 获取用户积分 阶段一 按日更新 */
  dodochain_getUserPointsJourneyOne: DodochainUserPointsResult;
  /** 质押挖矿历史 */
  dodochain_getUserStakedHistoryListJourneyOne: DodochainUserStakedHistoryPaginationResult;
  /** 质押挖矿列表 */
  dodochain_getUserStakedListJourneyOne: DodochainUserStakedPaginationResult;
  /** 获取用户参与的twigs挖矿列表 */
  dodochain_getUserTwigsMineList: DodochainUserTwigsMinePaginationResult;
  /** 活动相关信息 */
  dodopoints_getActivityInfo?: Maybe<DodopointsDodoPointsActivityInfo>;
  /** Lp交易对积分记录 */
  dodopoints_getUserLpPairsPoints: Array<Maybe<DodopointsPairPoints>>;
  /** 交易积分发放记录 */
  dodopoints_getUserSwapPointsList: DodopointsPointRecordPaginationResult;
  donateHistories: Array<DonateHistory>;
  donateHistory?: Maybe<DonateHistory>;
  /** 活动相关信息 */
  dpoint_getActivityInfo?: Maybe<DpointDpointActivityInfo>;
  /** 奖励发放记录 */
  dpoint_getUserClaimedList: DpointClaimedRecordPaginationResult;
  /** 积分发放记录 */
  dpoint_getUserPointsList: DpointPointRecordPaginationResult;
  /** 活动奖励信息 */
  dpoint_getUserRewardInfos: Array<Maybe<DpointDpointActivityRewardInfo>>;
  erc20_extend_erc20Extend?: Maybe<Erc20_ExtendErc20Extend>;
  erc20_extend_erc20ExtendV2?: Maybe<Erc20_ExtendErc20ExtendV2>;
  erc20_list?: Maybe<Array<Maybe<Erc20Erc20List>>>;
  erc20_listV2?: Maybe<Array<Maybe<Erc20Erc20V2List>>>;
  erc20_relationList?: Maybe<Array<Maybe<Erc20RelationList>>>;
  erc20_swapCrossChainList?: Maybe<Array<Maybe<Erc20Erc20V2List>>>;
  filter?: Maybe<Filter>;
  filterAdmin?: Maybe<FilterAdmin>;
  filterAdmins: Array<FilterAdmin>;
  filterNft?: Maybe<FilterNft>;
  filterNfts: Array<FilterNft>;
  filterSpreadId?: Maybe<FilterSpreadId>;
  filterSpreadIds: Array<FilterSpreadId>;
  filters: Array<Filter>;
  flashLoan?: Maybe<FlashLoan>;
  flashLoans: Array<FlashLoan>;
  fragment?: Maybe<Fragment>;
  fragments: Array<Fragment>;
  gas_feeder_getGasPrices?: Maybe<Array<Maybe<Gas_FeederGasPrice>>>;
  incentiveRewardHistories: Array<IncentiveRewardHistory>;
  incentiveRewardHistory?: Maybe<IncentiveRewardHistory>;
  limit_and_rfq_createPrivateOrder?: Maybe<Scalars['String']['output']>;
  limit_and_rfq_getOrderStatusBroadcasts?: Maybe<
    Array<Maybe<Limit_And_RfqLimitOrderStatusBroadcastInfo>>
  >;
  limit_and_rfq_getPendingOrderChainList?: Maybe<
    Array<Maybe<Scalars['Int']['output']>>
  >;
  limit_and_rfq_getPrivateOrder?: Maybe<Limit_And_RfqPrivateOrderInfo>;
  limit_and_rfq_limitOrderAmountLimit?: Maybe<Scalars['Float']['output']>;
  limit_and_rfq_limitOrderCancel?: Maybe<Limit_And_RfqCancelLimitOrderResponse>;
  limit_and_rfq_limitOrderCreate?: Maybe<Limit_And_RfqLimitOrder>;
  limit_and_rfq_limitOrderCreateV2?: Maybe<Limit_And_RfqLimitOrderV2>;
  /** data url:post(https://host:port/api/v1/order/graphql/rfqTakerInquiry).data */
  limit_and_rfq_limitOrderFee?: Maybe<Limit_And_RfqLimitOrderFeeInfo>;
  limit_and_rfq_limitOrderList?: Maybe<Array<Maybe<Limit_And_RfqLimitOrder>>>;
  limit_and_rfq_limitOrderListWithPage?: Maybe<Limit_And_RfqPaginateLimitOrderList>;
  limit_and_rfq_limitOrderListWithPageV2?: Maybe<Limit_And_RfqPaginateLimitOrderListV2>;
  liquidator?: Maybe<Liquidator>;
  liquidators: Array<Liquidator>;
  liquidityHistories: Array<LiquidityHistory>;
  liquidityHistory?: Maybe<LiquidityHistory>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositions: Array<LiquidityPosition>;
  liquidity_count_data?: Maybe<LiquidityCountData>;
  liquidity_getLpPartnerRewards?: Maybe<LiquidityLpPartnerRewardsResult>;
  liquidity_list?: Maybe<LiquidityListInfo>;
  liquidity_pool_apy_user?: Maybe<Array<Maybe<LiquidityPoolApy>>>;
  lpToken?: Maybe<LpToken>;
  lpTokens: Array<LpToken>;
  /** 获取用户积分 */
  lp_points_getUserPoints: Lp_PointsUserPointsResult;
  /** 获取用户详情 */
  lp_points_getUserPointsDetail: Lp_PointsUserPointsDetailPaginationResult;
  maintainerEarnings: Array<MaintainerEarnings>;
  maintainerFeeTx?: Maybe<MaintainerFeeTx>;
  maintainerFeeTxes: Array<MaintainerFeeTx>;
  maker?: Maybe<Maker>;
  makers: Array<Maker>;
  manage_dpp_config?: Maybe<ManageDppConfig>;
  /** from manage */
  manage_service_getCautionsV2: Array<Manage_ServiceCautionTokenResult>;
  /** data url:post(https://host:port/manage/slippage_tolerance_list).data */
  manage_slippage_tolerance_list?: Maybe<Array<Maybe<ManageSlippageTolerance>>>;
  market_maker_pool_apply_create?: Maybe<Market_Maker_Pool_ApplyData>;
  /** 获取Metrom的池子列表 */
  metrom_getPools: Array<Maybe<MetromPool>>;
  minePool?: Maybe<MinePool>;
  minePools: Array<MinePool>;
  miningPool?: Maybe<MiningPool>;
  miningPools: Array<MiningPool>;
  mining_dodo?: Maybe<MiningDodoData>;
  mining_dpp?: Maybe<MiningDppData>;
  mining_getRewardDetailHistory?: Maybe<MiningRewardDetailHistoryListInfo>;
  /** data url:post(https://host:port/mining/info).data */
  mining_info?: Maybe<MiningMiningInfo>;
  mining_infos?: Maybe<MiningMiningInfos>;
  mining_list?: Maybe<MiningMiningListInfo>;
  mintHistories: Array<MintHistory>;
  mintHistory?: Maybe<MintHistory>;
  nft?: Maybe<Nft>;
  nftCollateralVault?: Maybe<NftCollateralVault>;
  nftCollateralVaults: Array<NftCollateralVault>;
  nftPool?: Maybe<NftPool>;
  nftPools: Array<NftPool>;
  nft_contract_list?: Maybe<Array<Maybe<Nft_ContractNftContractList>>>;
  nfts: Array<Nft>;
  notice_center_systemList?: Maybe<Notice_CenterNoticeCenterSystemList>;
  notice_center_systemRead?: Maybe<Notice_CenterNoticeCenterRead>;
  notice_center_transactionList?: Maybe<Notice_CenterNoticeCenterTransactionList>;
  notice_center_unread?: Maybe<Notice_CenterNoticeCenterUnRead>;
  orderHistories: Array<OrderHistory>;
  orderHistory?: Maybe<OrderHistory>;
  owner?: Maybe<Owner>;
  ownerPerTokenContract?: Maybe<OwnerPerTokenContract>;
  ownerPerTokenContracts: Array<OwnerPerTokenContract>;
  owners: Array<Owner>;
  pair?: Maybe<Pair>;
  pairDayData?: Maybe<PairDayData>;
  pairDayDatas: Array<PairDayData>;
  pairHourData?: Maybe<PairHourData>;
  pairHourDatas: Array<PairHourData>;
  pairTrader?: Maybe<PairTrader>;
  pairTraders: Array<PairTrader>;
  pair_hots?: Maybe<PairHotsListInfo>;
  pairs: Array<Pair>;
  persistentString?: Maybe<PersistentString>;
  persistentStringArray?: Maybe<PersistentStringArray>;
  persistentStringArrays: Array<PersistentStringArray>;
  persistentStrings: Array<PersistentString>;
  pool?: Maybe<Pool>;
  poolDayData?: Maybe<PoolDayData>;
  poolDayDatas: Array<PoolDayData>;
  poolFunding?: Maybe<PoolFunding>;
  poolFundings: Array<PoolFunding>;
  poolToken?: Maybe<PoolToken>;
  poolTokenHistories: Array<PoolTokenHistory>;
  poolTokenHistory?: Maybe<PoolTokenHistory>;
  poolTokens: Array<PoolToken>;
  poolTradeHistories: Array<PoolTradeHistory>;
  poolTradeHistory?: Maybe<PoolTradeHistory>;
  pool_real_volume_usd?: Maybe<PoolRealVolumeUsd>;
  pools: Array<Pool>;
  /** 获取用户免Gas单的交易量（USD） */
  quest3_getGaslessVolume: Scalars['BigDecimal']['output'];
  /** 获取用户限价单的交易量（USD） */
  quest3_getLimitpriceVolume: Scalars['BigDecimal']['output'];
  /** 用户LP是否满足活动要求 */
  quest3_getLpQualified: Scalars['Boolean']['output'];
  /** 用户LP挖矿是否满足活动要求 */
  quest3_getMiningQualified: Scalars['Boolean']['output'];
  /** 获取用户闪兑的交易量（USD） */
  quest3_getSwapVolume: Scalars['BigDecimal']['output'];
  /** 获取用户vDODO的数量 */
  quest3_getVdodoAmount: Scalars['BigDecimal']['output'];
  redeemHistories: Array<RedeemHistory>;
  redeemHistory?: Maybe<RedeemHistory>;
  /** 接受邀请 */
  referral_accept: Scalars['Boolean']['output'];
  /** 获取返利的发放记录 */
  referral_getCommissionReleasesList: ReferralCommissionReleasesPaginationResult;
  /** 查看邀请状态 */
  referral_getInviteStatus: ReferralInviteStatus;
  /** 获取邀请者统计信息 */
  referral_getInviterStats: ReferralInviterStats;
  /** 获取被邀请者的列表 */
  referral_getReferrerList: ReferralReferrerPaginationResult;
  /** 获取被邀请者统计信息 */
  referral_getReferrerStats: ReferralReferrerStats;
  /** 获取被邀请者的交易列表的链ids */
  referral_getReferrerTradesChainIds: Array<Maybe<Scalars['Int']['output']>>;
  /** 获取被邀请者的交易列表 */
  referral_getReferrerTradesList: ReferralReferrerTradesPaginationResult;
  /** 获取未发放的返利记录 */
  referral_getUnreleasedCommissionChainIds: Array<
    Maybe<Scalars['Int']['output']>
  >;
  /** 获取未发放的返利记录 */
  referral_getUnreleasedCommissionList: ReferralUnreleasedCommissionPaginationResult;
  registries: Array<Registry>;
  registry?: Maybe<Registry>;
  /** get request split config */
  request_split_config_getRequestSplitConfig?: Maybe<
    Array<Maybe<Request_Split_ConfigRequestSplitConfigItem>>
  >;
  rewardDetail?: Maybe<RewardDetail>;
  rewardDetails: Array<RewardDetail>;
  rfq_order_confirm?: Maybe<Rfq_OrderRfqConfimrOrderResult>;
  rfq_order_inquiry?: Maybe<Rfq_OrderRfqInquiryResult>;
  rfq_order_tokenPairs?: Maybe<Array<Maybe<Rfq_OrderRfqTokenPairsInfo>>>;
  router?: Maybe<Router>;
  routers: Array<Router>;
  setPoolInfo?: Maybe<SetPoolInfo>;
  setPoolInfos: Array<SetPoolInfo>;
  setVaultInfo?: Maybe<SetVaultInfo>;
  setVaultInfos: Array<SetVaultInfo>;
  starter?: Maybe<Starter>;
  starters: Array<Starter>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  third_party_token_list?: Maybe<Array<Maybe<Third_Party_TokenList>>>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
  token?: Maybe<Token>;
  tokenContract?: Maybe<TokenContract>;
  tokenContracts: Array<TokenContract>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokenRegistries: Array<TokenRegistry>;
  tokenRegistry?: Maybe<TokenRegistry>;
  tokenTrader?: Maybe<TokenTrader>;
  tokenTraders: Array<TokenTrader>;
  token_info_balances?: Maybe<Token_InfoTokenBalanceList>;
  token_info_balancesV2?: Maybe<Token_InfoTokenBalanceList>;
  tokens: Array<Token>;
  /** get caution for the tokens */
  tokens_getCautions: Array<TokensCautionTokenResult>;
  tradeHistoryTransferDetail?: Maybe<TradeHistoryTransferDetail>;
  tradeHistoryTransferDetails: Array<TradeHistoryTransferDetail>;
  tradingIncentive?: Maybe<TradingIncentive>;
  tradingIncentives: Array<TradingIncentive>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transfer?: Maybe<Transfer>;
  transferHistories: Array<TransferHistory>;
  transferHistory?: Maybe<TransferHistory>;
  transfers: Array<Transfer>;
  user?: Maybe<User>;
  userDayData?: Maybe<UserDayData>;
  userDayDatas: Array<UserDayData>;
  userFunding?: Maybe<UserFunding>;
  userFundings: Array<UserFunding>;
  userNft?: Maybe<UserNft>;
  userNfts: Array<UserNft>;
  userOperationHistories: Array<UserOperationHistory>;
  userOperationHistory?: Maybe<UserOperationHistory>;
  userStake?: Maybe<UserStake>;
  userStakes: Array<UserStake>;
  userTokenBlance?: Maybe<UserTokenBlance>;
  userTokenBlances: Array<UserTokenBlance>;
  user_swap_orderHistories?: Maybe<User_SwapUserSwapOrder>;
  user_swap_pair_slippage_delete?: Maybe<User_Swap_Pair_SlippageJwt>;
  user_swap_pair_slippage_list?: Maybe<
    Array<Maybe<User_Swap_Pair_SlippageUserSwapPairSlippageList>>
  >;
  user_swap_pair_slippage_upsert?: Maybe<User_Swap_Pair_SlippageJwtAndList>;
  userprofile_asset?: Maybe<UserprofileUserProfile>;
  userprofile_inviteUser?: Maybe<UserprofileUserInvite>;
  userprofile_nftAssets?: Maybe<UserprofileNftAssets>;
  userprofile_privatePools?: Maybe<UserprofileUserPrivatePoolListInfo>;
  /** data url:post(https://host:prot//user/reward).data */
  userprofile_reward?: Maybe<Array<UserprofileReward>>;
  users: Array<User>;
  vDODO?: Maybe<VDodo>;
  vDODOs: Array<VDodo>;
  vault?: Maybe<Vault>;
  vaultAssetInfo?: Maybe<VaultAssetInfo>;
  vaultAssetInfoDayData?: Maybe<VaultAssetInfoDayData>;
  vaultAssetInfoDayDatas: Array<VaultAssetInfoDayData>;
  vaultAssetInfoHistories: Array<VaultAssetInfoHistory>;
  vaultAssetInfoHistory?: Maybe<VaultAssetInfoHistory>;
  vaultAssetInfos: Array<VaultAssetInfo>;
  vaultDayData?: Maybe<VaultDayData>;
  vaultDayDatas: Array<VaultDayData>;
  vaultNft?: Maybe<VaultNft>;
  vaultNfts: Array<VaultNft>;
  vaults: Array<Vault>;
  /** get service charges for vdodo */
  vdodo_getServiceCharges: VdodoVdodoServiceChargesResult;
  vdodo_getStats: VdodoStatsResult;
  withdrawFundHistories: Array<WithdrawFundHistory>;
  withdrawFundHistory?: Maybe<WithdrawFundHistory>;
  withdrawReserve?: Maybe<WithdrawReserve>;
  withdrawReserves: Array<WithdrawReserve>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Account_Filter>;
};

export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Account_Filter>;
};

export type QueryAchievement_DetailArgs = {
  where?: InputMaybe<AchievementDetail_Filter>;
};

export type QueryAchievement_MeArgs = {
  where?: InputMaybe<AchievementMe_Filter>;
};

export type QueryActivity_Banner_QueryArgs = {
  where?: InputMaybe<Activity_Bannerqueryilter>;
};

export type QueryAggregateFragmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<AggregateFragment_Filter>;
};

export type QueryAggregateFragmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AggregateFragment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AggregateFragment_Filter>;
};

export type QueryAllArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<All_Filter>;
};

export type QueryAllsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<All_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<All_Filter>;
};

export type QueryAnnouncement_GetAnnouncementArgs = {
  lang?: InputMaybe<Scalars['String']['input']>;
};

export type QueryApprovalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Approval_Filter>;
};

export type QueryApprovalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Approval_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Approval_Filter>;
};

export type QueryAuction_AuctionActiveArgs = {
  where?: InputMaybe<AuctionactiveFilter>;
};

export type QueryAuction_AuctionDetailArgs = {
  where?: InputMaybe<AuctiondetailFilter>;
};

export type QueryAuction_AuctionListArgs = {
  where?: InputMaybe<AuctionlistFilter>;
};

export type QueryAuction_AuctionOperationRecordArgs = {
  where?: InputMaybe<AuctionoperationRecordFilter>;
};

export type QueryAuth_LoginArgs = {
  where?: InputMaybe<AuthLoginInput>;
};

export type QueryAvatarArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Avatar_Filter>;
};

export type QueryAvatarBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<AvatarBalance_Filter>;
};

export type QueryAvatarBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvatarBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AvatarBalance_Filter>;
};

export type QueryAvatarDecomposeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvatarDecomposeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AvatarDecomposeHistory_Filter>;
};

export type QueryAvatarDecomposeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<AvatarDecomposeHistory_Filter>;
};

export type QueryAvatarMintHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvatarMintHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AvatarMintHistory_Filter>;
};

export type QueryAvatarMintHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<AvatarMintHistory_Filter>;
};

export type QueryAvatarTransferHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvatarTransferHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AvatarTransferHistory_Filter>;
};

export type QueryAvatarTransferHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<AvatarTransferHistory_Filter>;
};

export type QueryAvatarsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Avatar_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Avatar_Filter>;
};

export type QueryBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Balance_Filter>;
};

export type QueryBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Balance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Balance_Filter>;
};

export type QueryBidHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BidHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BidHistory_Filter>;
};

export type QueryBidHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<BidHistory_Filter>;
};

export type QueryBidPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<BidPosition_Filter>;
};

export type QueryBidPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BidPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BidPosition_Filter>;
};

export type QueryBrand_Site_Announcement_ListArgs = {
  where?: InputMaybe<Brand_Site_Announcementqueryilter>;
};

export type QueryBrand_Site_Banner_ListArgs = {
  where?: InputMaybe<Brand_Site_Bannerqueryilter>;
};

export type QueryBrowser_GetRpcArgs = {
  where: BrowserChainInput;
};

export type QueryChart_GetOhlcv2ChartArgs = {
  where?: InputMaybe<ChartOhlcv2Input>;
};

export type QueryChart_GetOhlcvDataArgs = {
  where?: InputMaybe<ChartOhlcvInput>;
};

export type QueryClaimHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ClaimHistory_Filter>;
};

export type QueryClaimHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<ClaimHistory_Filter>;
};

export type QueryCoinmarketcap_Token_ListArgs = {
  where?: InputMaybe<Coinmarketcap_TokenCoinmarketcapTokenListFilter>;
};

export type QueryComponentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Component_Filter>;
};

export type QueryComponentBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<ComponentBalance_Filter>;
};

export type QueryComponentBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComponentBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComponentBalance_Filter>;
};

export type QueryComponentBurnHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComponentBurnHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComponentBurnHistory_Filter>;
};

export type QueryComponentBurnHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<ComponentBurnHistory_Filter>;
};

export type QueryComponentMintHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComponentMintHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComponentMintHistory_Filter>;
};

export type QueryComponentMintHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<ComponentMintHistory_Filter>;
};

export type QueryComponentTransferHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComponentTransferHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComponentTransferHistory_Filter>;
};

export type QueryComponentTransferHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<ComponentTransferHistory_Filter>;
};

export type QueryComponentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Component_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Component_Filter>;
};

export type QueryControllerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Controller_Filter>;
};

export type QueryControllersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Controller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Controller_Filter>;
};

export type QueryCross_Chain_Swap_DodoOrderListArgs = {
  where?: InputMaybe<Cross_Chain_SwapdodoOrderListData>;
};

export type QueryCross_Chain_Swap_OrderCreateArgs = {
  data?: InputMaybe<Cross_Chain_SwaporderCreateData>;
};

export type QueryCross_Chain_Swap_OrderDetailArgs = {
  where?: InputMaybe<Cross_Chain_SwaporderDetailData>;
};

export type QueryCross_Chain_Swap_OrderListArgs = {
  where?: InputMaybe<Cross_Chain_SwaporderListData>;
};

export type QueryCross_Chain_Swap_OrderNewStatusArgs = {
  where?: InputMaybe<Cross_Chain_SwaporderNewStatusData>;
};

export type QueryCross_Chain_Swap_OrderRefundCountArgs = {
  where?: InputMaybe<Cross_Chain_SwaporderRefundCountData>;
};

export type QueryCross_Chain_Swap_RoutesV2Args = {
  data?: InputMaybe<Cross_Chain_SwaprouteData>;
};

export type QueryCross_Chain_Swap_TransactionEncodeArgs = {
  data?: InputMaybe<Cross_Chain_SwaptransactionEncodeData>;
};

export type QueryCross_Chain_Token_ListArgs = {
  where?: InputMaybe<Cross_Chain_TokentokenlistFilter>;
};

export type QueryCross_Chain_Token_TokenPairArgs = {
  where?: InputMaybe<Cross_Chain_TokentokenPairFilter>;
};

export type QueryCrowdPoolingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<CrowdPooling_Filter>;
};

export type QueryCrowdPoolingDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<CrowdPoolingDayData_Filter>;
};

export type QueryCrowdPoolingDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CrowdPoolingDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CrowdPoolingDayData_Filter>;
};

export type QueryCrowdPoolingHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<CrowdPoolingHourData_Filter>;
};

export type QueryCrowdPoolingHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CrowdPoolingHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CrowdPoolingHourData_Filter>;
};

export type QueryCrowdPoolingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CrowdPooling_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CrowdPooling_Filter>;
};

export type QueryCrowd_Pooling_ListArgs = {
  where?: InputMaybe<Crowd_PoolingcrowdpoolingListFilter>;
};

export type QueryCrowd_Pooling_Read_Server_ListArgs = {
  where?: InputMaybe<Crowd_Pooling_Read_ServercrowdpoolingListFilter>;
};

export type QueryCrowd_Pooling_Read_Server_UnvoteArgs = {
  data?: InputMaybe<Crowd_Pooling_Read_ServercrowdpoolingUnvoteData>;
};

export type QueryCrowd_Pooling_Read_Server_VoteArgs = {
  data?: InputMaybe<Crowd_Pooling_Read_ServercrowdpoolingVoteData>;
};

export type QueryCrowd_Pooling_Read_Server_VoteListArgs = {
  where?: InputMaybe<Crowd_Pooling_Read_ServercrowdpoolingVoteListFilter>;
};

export type QueryCrowd_Pooling_Top_ListArgs = {
  where?: InputMaybe<Crowd_Poolinglist_Filter>;
};

export type QueryCrowd_Pooling_UnvoteArgs = {
  data?: InputMaybe<Crowd_PoolingcrowdpoolingUnvoteData>;
};

export type QueryCrowd_Pooling_VoteArgs = {
  data?: InputMaybe<Crowd_PoolingcrowdpoolingVoteData>;
};

export type QueryCrowd_Pooling_VoteListArgs = {
  where?: InputMaybe<Crowd_PoolingcrowdpoolingVoteListFilter>;
};

export type QueryD3mm_GetAssetDailyInterestsArgs = {
  where?: InputMaybe<D3mmTokenInput>;
};

export type QueryD3mm_GetAssetInfoArgs = {
  where?: InputMaybe<D3mmTokenOptionalUserInput>;
};

export type QueryD3mm_GetAssetOperationPaginationArgs = {
  where?: InputMaybe<D3mmChainUserTokenPaginationInput>;
};

export type QueryD3mm_GetAssetStrategiesListArgs = {
  where?: InputMaybe<D3mmChainTokenPaginationInput>;
};

export type QueryD3mm_GetAssetsListArgs = {
  where?: InputMaybe<D3mmChainUserPaginationInput>;
};

export type QueryD3mm_GetLiquidityProviderDailyProfitsArgs = {
  where?: InputMaybe<D3mmChainIdInput>;
};

export type QueryD3mm_GetOverviewArgs = {
  where?: InputMaybe<D3mmChainIdInput>;
};

export type QueryD3mm_GetStrategiesListArgs = {
  where?: InputMaybe<D3mmChainIdInput>;
};

export type QueryD3mm_GetStrategyAssetsArgs = {
  where?: InputMaybe<D3mmPoolInput>;
};

export type QueryD3mm_GetStrategyDailySwapsArgs = {
  where?: InputMaybe<D3mmPoolInput>;
};

export type QueryD3mm_GetStrategyInfoArgs = {
  where?: InputMaybe<D3mmPoolInput>;
};

export type QueryD3mm_GetStrategyProviderDailyInterestsArgs = {
  where?: InputMaybe<D3mmChainIdInput>;
};

export type QueryD3mm_GetStrategySwapsListArgs = {
  where?: InputMaybe<D3mmChainPoolPaginationInput>;
};

export type QueryD3mm_GetUserCapitalsInfoArgs = {
  where?: InputMaybe<D3mmUserInput>;
};

export type QueryD3mt_GetAssetListArgs = {
  where?: InputMaybe<D3mtPaginationInput>;
};

export type QueryD3mt_GetUserOverviewArgs = {
  where: D3mtUserInput;
};

export type QueryD3mt_GetUserPositionInfoArgs = {
  where: D3mtUserPositionInput;
};

export type QueryD3mt_GetUserPositionListArgs = {
  where: D3mtOptionalChainUserPositionStatusrPaginationInput;
};

export type QueryDOdoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Dodo_Filter>;
};

export type QueryDOdOsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Dodo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Dodo_Filter>;
};

export type QueryDailyScheduledTaskArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDailyScheduledTasksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyScheduledTask_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyScheduledTask_Filter>;
};

export type QueryDashboard_Chain_Day_DataArgs = {
  where?: InputMaybe<Dashboardchain_Daily_Data_Filter>;
};

export type QueryDashboard_Chain_Summary_And_Daily_DataArgs = {
  where?: InputMaybe<Dashboardchain_Daily_Data_Filter>;
};

export type QueryDashboard_Pair_Count_Data_Range_TimeArgs = {
  where?: InputMaybe<Dashboardpair_Data_Filter>;
};

export type QueryDashboard_Pairs_Count_DataArgs = {
  where?: InputMaybe<Dashboardtype_Filter>;
};

export type QueryDashboard_Pairs_Day_DataArgs = {
  where?: InputMaybe<Dashboardday_Filter>;
};

export type QueryDashboard_Pairs_DetailArgs = {
  where?: InputMaybe<Dashboardpair_Detail_Filter>;
};

export type QueryDashboard_Pairs_Hour_DataArgs = {
  where?: InputMaybe<Dashboardhour_Filter>;
};

export type QueryDashboard_Pairs_ListArgs = {
  where?: InputMaybe<Dashboardtype_List_Filter>;
};

export type QueryDashboard_Pairs_Pair_Symbol_ListArgs = {
  where?: InputMaybe<Dashboardsymbol_Detail_Filter>;
};

export type QueryDashboard_Pairs_Rate_24Args = {
  where?: InputMaybe<Dashboardrate24h_Filter>;
};

export type QueryDecimalValueArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DecimalValue_Filter>;
};

export type QueryDecimalValuesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DecimalValue_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DecimalValue_Filter>;
};

export type QueryDepositHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DepositHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DepositHistory_Filter>;
};

export type QueryDepositHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DepositHistory_Filter>;
};

export type QueryDip_Whitelist_ListArgs = {
  where?: InputMaybe<Dip_WhitelistlistFilter>;
};

export type QueryDodoAvatarArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DodoAvatar_Filter>;
};

export type QueryDodoAvatarsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DodoAvatar_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DodoAvatar_Filter>;
};

export type QueryDodoDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DodoDayData_Filter>;
};

export type QueryDodoDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DodoDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DodoDayData_Filter>;
};

export type QueryDodoStarterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DodoStarter_Filter>;
};

export type QueryDodoStartersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DodoStarter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DodoStarter_Filter>;
};

export type QueryDodoTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DodoToken_Filter>;
};

export type QueryDodoTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DodoToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DodoToken_Filter>;
};

export type QueryDodoZooArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DodoZoo_Filter>;
};

export type QueryDodoZoosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DodoZoo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DodoZoo_Filter>;
};

export type QueryDodo_App_Version_NewArgs = {
  where?: InputMaybe<Dodo_App_VersionnewFilter>;
};

export type QueryDodo_Two_Anniversary_Activity_ListArgs = {
  where?: InputMaybe<Dodo_Two_Anniversary_ActivitylistFilter>;
};

export type QueryDodo_Two_Anniversary_H5_Qa_Activity_SaveArgs = {
  data?: InputMaybe<Dodo_Two_Anniversary_H5_Qa_ActivitysaveData>;
};

export type QueryDodochain_AcceptInviteArgs = {
  where: DodochainUserAcceptInvitationInput;
};

export type QueryDodochain_Activity_GetClaimActivityArgs = {
  where: Dodochain_ActivityUserPaginationInput;
};

export type QueryDodochain_Activity_GetLiquidityActivityArgs = {
  where: Dodochain_ActivityUserPaginationInput;
};

export type QueryDodochain_Activity_GetStakeActivityArgs = {
  where: Dodochain_ActivityUserPaginationInput;
};

export type QueryDodochain_Assets_GetAssetsDataArgs = {
  where: Dodochain_AssetsUserInput;
};

export type QueryDodochain_Assets_GetClaimableRewardsDataArgs = {
  where: Dodochain_AssetsUserInput;
};

export type QueryDodochain_Assets_GetLpDepositedDataArgs = {
  where: Dodochain_AssetsUserInput;
};

export type QueryDodochain_Assets_GetStakedDataArgs = {
  where: Dodochain_AssetsUserInput;
};

export type QueryDodochain_Assets_GetWalletBalanceDataArgs = {
  where: Dodochain_AssetsUserInput;
};

export type QueryDodochain_Dashboard_GetBridgeDataChartArgs = {
  where?: InputMaybe<Dodochain_DashboardBridgeDataChartInput>;
};

export type QueryDodochain_Dashboard_GetLiquidityStakeChartArgs = {
  where?: InputMaybe<Dodochain_DashboardChatInput>;
};

export type QueryDodochain_Dashboard_GetSupportTokensArgs = {
  where: Dodochain_DashboardOnlyEvmOrBtcInput;
};

export type QueryDodochain_Earn_ListArgs = {
  where?: InputMaybe<Dodochain_Earnlist_Filter>;
};

export type QueryDodochain_GetInviteCodeArgs = {
  where: DodochainUserInput;
};

export type QueryDodochain_GetInviteStatusArgs = {
  where: DodochainUserInput;
};

export type QueryDodochain_GetInviteesListArgs = {
  where: DodochainUserPaginationInput;
};

export type QueryDodochain_GetTwigsMineListArgs = {
  where?: InputMaybe<DodochaintwigsMineInput>;
};

export type QueryDodochain_GetUserPointsDetailJourneyOneArgs = {
  where: DodochainUserInput;
};

export type QueryDodochain_GetUserPointsJourneyOneArgs = {
  where?: InputMaybe<DodochainUserInput>;
};

export type QueryDodochain_GetUserStakedHistoryListJourneyOneArgs = {
  where?: InputMaybe<DodochainuserStakedInput>;
};

export type QueryDodochain_GetUserStakedListJourneyOneArgs = {
  where?: InputMaybe<DodochainuserStakedInput>;
};

export type QueryDodochain_GetUserTwigsMineListArgs = {
  where?: InputMaybe<DodochainuserTwigsMineInput>;
};

export type QueryDodopoints_GetActivityInfoArgs = {
  where?: InputMaybe<DodopointsChainOptionalUserInput>;
};

export type QueryDodopoints_GetUserLpPairsPointsArgs = {
  where?: InputMaybe<DodopointsChainOptionalUserInput>;
};

export type QueryDodopoints_GetUserSwapPointsListArgs = {
  where?: InputMaybe<DodopointsChainUserPaginationInput>;
};

export type QueryDonateHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DonateHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DonateHistory_Filter>;
};

export type QueryDonateHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<DonateHistory_Filter>;
};

export type QueryDpoint_GetActivityInfoArgs = {
  where?: InputMaybe<DpointChainOptionalUserInput>;
};

export type QueryDpoint_GetUserClaimedListArgs = {
  where?: InputMaybe<DpointChainUserPaginationInput>;
};

export type QueryDpoint_GetUserPointsListArgs = {
  where?: InputMaybe<DpointChainUserPaginationInput>;
};

export type QueryDpoint_GetUserRewardInfosArgs = {
  where?: InputMaybe<DpointChainUserInput>;
};

export type QueryErc20_Extend_Erc20ExtendArgs = {
  where?: InputMaybe<Erc20_Extenderc20ExtendFilter>;
};

export type QueryErc20_Extend_Erc20ExtendV2Args = {
  where?: InputMaybe<Erc20_Extenderc20ExtendV2Filter>;
};

export type QueryErc20_ListArgs = {
  where?: InputMaybe<Erc20listFilter>;
};

export type QueryErc20_ListV2Args = {
  where?: InputMaybe<Erc20listV2Filter>;
};

export type QueryErc20_RelationListArgs = {
  where?: InputMaybe<Erc20relationListFilter>;
};

export type QueryErc20_SwapCrossChainListArgs = {
  where?: InputMaybe<Erc20listV2Filter>;
};

export type QueryFilterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Filter_Filter>;
};

export type QueryFilterAdminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<FilterAdmin_Filter>;
};

export type QueryFilterAdminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FilterAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FilterAdmin_Filter>;
};

export type QueryFilterNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<FilterNft_Filter>;
};

export type QueryFilterNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FilterNft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FilterNft_Filter>;
};

export type QueryFilterSpreadIdArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<FilterSpreadId_Filter>;
};

export type QueryFilterSpreadIdsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FilterSpreadId_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FilterSpreadId_Filter>;
};

export type QueryFiltersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Filter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Filter_Filter>;
};

export type QueryFlashLoanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<FlashLoan_Filter>;
};

export type QueryFlashLoansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FlashLoan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FlashLoan_Filter>;
};

export type QueryFragmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Fragment_Filter>;
};

export type QueryFragmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Fragment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Fragment_Filter>;
};

export type QueryGas_Feeder_GetGasPricesArgs = {
  where?: InputMaybe<Gas_FeedergasPrices>;
};

export type QueryIncentiveRewardHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<IncentiveRewardHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<IncentiveRewardHistory_Filter>;
};

export type QueryIncentiveRewardHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<IncentiveRewardHistory_Filter>;
};

export type QueryLimit_And_Rfq_CreatePrivateOrderArgs = {
  where?: InputMaybe<Limit_And_RfqcreatePrivateOrderInfo>;
};

export type QueryLimit_And_Rfq_GetOrderStatusBroadcastsArgs = {
  where?: InputMaybe<Limit_And_RfqgetPendingLimitOrderParam>;
};

export type QueryLimit_And_Rfq_GetPendingOrderChainListArgs = {
  where?: InputMaybe<Limit_And_RfqgetPendingLimitOrderParam>;
};

export type QueryLimit_And_Rfq_GetPrivateOrderArgs = {
  where?: InputMaybe<Limit_And_RfqgetPrivateOrderParam>;
};

export type QueryLimit_And_Rfq_LimitOrderAmountLimitArgs = {
  where?: InputMaybe<Limit_And_RfqlimitOrderAmountLimitParam>;
};

export type QueryLimit_And_Rfq_LimitOrderCancelArgs = {
  where?: InputMaybe<Limit_And_RfquserCancelLimitOrder>;
};

export type QueryLimit_And_Rfq_LimitOrderCreateArgs = {
  where?: InputMaybe<Limit_And_RfquserCreateLimitOrder>;
};

export type QueryLimit_And_Rfq_LimitOrderCreateV2Args = {
  where?: InputMaybe<Limit_And_RfquserCreateLimitOrderV2>;
};

export type QueryLimit_And_Rfq_LimitOrderFeeArgs = {
  where?: InputMaybe<Limit_And_RfquserQueryLimitOrderFee>;
};

export type QueryLimit_And_Rfq_LimitOrderListArgs = {
  where?: InputMaybe<Limit_And_RfquserQueryLimitOrderList>;
};

export type QueryLimit_And_Rfq_LimitOrderListWithPageArgs = {
  where?: InputMaybe<Limit_And_RfquserQueryLimitOrderListWithPage>;
};

export type QueryLimit_And_Rfq_LimitOrderListWithPageV2Args = {
  where?: InputMaybe<Limit_And_RfquserQueryLimitOrderListWithPage>;
};

export type QueryLiquidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Liquidator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidator_Filter>;
};

export type QueryLiquidityHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityHistory_Filter>;
};

export type QueryLiquidityHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<LiquidityHistory_Filter>;
};

export type QueryLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<LiquidityPosition_Filter>;
};

export type QueryLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

export type QueryLiquidity_Count_DataArgs = {
  where?: InputMaybe<Liquiditycount_Data_Query>;
};

export type QueryLiquidity_GetLpPartnerRewardsArgs = {
  where?: InputMaybe<LiquidityLpPartnerRewardsInput>;
};

export type QueryLiquidity_ListArgs = {
  where?: InputMaybe<Liquiditylist_Filter>;
};

export type QueryLiquidity_Pool_Apy_UserArgs = {
  where?: InputMaybe<Liquiditypool_Apy_Query>;
};

export type QueryLpTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<LpToken_Filter>;
};

export type QueryLpTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LpToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LpToken_Filter>;
};

export type QueryLp_Points_GetUserPointsArgs = {
  where?: InputMaybe<Lp_PointsUserInput>;
};

export type QueryLp_Points_GetUserPointsDetailArgs = {
  where?: InputMaybe<Lp_PointsUserInput>;
};

export type QueryMaintainerEarningsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MaintainerEarnings_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MaintainerEarnings_Filter>;
};

export type QueryMaintainerFeeTxArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<MaintainerFeeTx_Filter>;
};

export type QueryMaintainerFeeTxesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MaintainerFeeTx_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MaintainerFeeTx_Filter>;
};

export type QueryMakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Maker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Maker_Filter>;
};

export type QueryManage_Dpp_ConfigArgs = {
  where?: InputMaybe<ManagechainFilter>;
};

export type QueryManage_Service_GetCautionsV2Args = {
  where?: InputMaybe<Manage_ServiceCautionTokensInput>;
};

export type QueryManage_Slippage_Tolerance_ListArgs = {
  where?: InputMaybe<ManagechainFilter>;
};

export type QueryMarket_Maker_Pool_Apply_CreateArgs = {
  data?: InputMaybe<Market_Maker_Pool_ApplypoolApplyData>;
};

export type QueryMetrom_GetPoolsArgs = {
  where?: InputMaybe<MetromChainInput>;
};

export type QueryMinePoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<MinePool_Filter>;
};

export type QueryMinePoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MinePool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MinePool_Filter>;
};

export type QueryMiningPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<MiningPool_Filter>;
};

export type QueryMiningPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MiningPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MiningPool_Filter>;
};

export type QueryMining_GetRewardDetailHistoryArgs = {
  where?: InputMaybe<MiningrewardDetailHistory_Filter>;
};

export type QueryMining_InfoArgs = {
  where?: InputMaybe<Mininginfo_Filter>;
};

export type QueryMining_InfosArgs = {
  where?: InputMaybe<Mininginfo_Filter>;
};

export type QueryMining_ListArgs = {
  where?: InputMaybe<Miningmining_List_Filter>;
};

export type QueryMintHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MintHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MintHistory_Filter>;
};

export type QueryMintHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<MintHistory_Filter>;
};

export type QueryNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Nft_Filter>;
};

export type QueryNftCollateralVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<NftCollateralVault_Filter>;
};

export type QueryNftCollateralVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NftCollateralVault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NftCollateralVault_Filter>;
};

export type QueryNftPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<NftPool_Filter>;
};

export type QueryNftPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NftPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NftPool_Filter>;
};

export type QueryNft_Contract_ListArgs = {
  where?: InputMaybe<Nft_Contractlist_Filter>;
};

export type QueryNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Nft_Filter>;
};

export type QueryNotice_Center_SystemListArgs = {
  where?: InputMaybe<Notice_CentersystemListFilter>;
};

export type QueryNotice_Center_SystemReadArgs = {
  data?: InputMaybe<Notice_CenternoticeCenterReadData>;
};

export type QueryNotice_Center_TransactionListArgs = {
  where?: InputMaybe<Notice_CentertransactionListFilter>;
};

export type QueryNotice_Center_UnreadArgs = {
  where?: InputMaybe<Notice_CenternoticeCenterUnreadFilter>;
};

export type QueryOrderHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OrderHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderHistory_Filter>;
};

export type QueryOrderHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<OrderHistory_Filter>;
};

export type QueryOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Owner_Filter>;
};

export type QueryOwnerPerTokenContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<OwnerPerTokenContract_Filter>;
};

export type QueryOwnerPerTokenContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerPerTokenContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OwnerPerTokenContract_Filter>;
};

export type QueryOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Owner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Owner_Filter>;
};

export type QueryPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Pair_Filter>;
};

export type QueryPairDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PairDayData_Filter>;
};

export type QueryPairDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairDayData_Filter>;
};

export type QueryPairHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PairHourData_Filter>;
};

export type QueryPairHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairHourData_Filter>;
};

export type QueryPairTraderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PairTrader_Filter>;
};

export type QueryPairTradersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairTrader_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairTrader_Filter>;
};

export type QueryPair_HotsArgs = {
  where?: InputMaybe<Pairhots_List_Info_Filter>;
};

export type QueryPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pair_Filter>;
};

export type QueryPersistentStringArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PersistentString_Filter>;
};

export type QueryPersistentStringArrayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PersistentStringArray_Filter>;
};

export type QueryPersistentStringArraysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PersistentStringArray_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PersistentStringArray_Filter>;
};

export type QueryPersistentStringsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PersistentString_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PersistentString_Filter>;
};

export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Pool_Filter>;
};

export type QueryPoolDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolDayData_Filter>;
};

export type QueryPoolFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolFunding_Filter>;
};

export type QueryPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTokenHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolTokenHistory_Filter>;
};

export type QueryPoolTokenHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type QueryPoolTradeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTradeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolTradeHistory_Filter>;
};

export type QueryPoolTradeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<PoolTradeHistory_Filter>;
};

export type QueryPool_Real_Volume_UsdArgs = {
  where?: InputMaybe<Poolreal_Volume_Usd_Filter>;
};

export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};

export type QueryQuest3_GetGaslessVolumeArgs = {
  where?: InputMaybe<Quest3UserFilterInput>;
};

export type QueryQuest3_GetLimitpriceVolumeArgs = {
  where?: InputMaybe<Quest3UserFilterInput>;
};

export type QueryQuest3_GetLpQualifiedArgs = {
  where?: InputMaybe<Quest3UserLpQualifiedFilterInput>;
};

export type QueryQuest3_GetMiningQualifiedArgs = {
  where?: InputMaybe<Quest3UserMiningQualifiedFilterInput>;
};

export type QueryQuest3_GetSwapVolumeArgs = {
  where?: InputMaybe<Quest3UserFilterInput>;
};

export type QueryQuest3_GetVdodoAmountArgs = {
  where?: InputMaybe<Quest3UserFilterInput>;
};

export type QueryRedeemHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RedeemHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RedeemHistory_Filter>;
};

export type QueryRedeemHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<RedeemHistory_Filter>;
};

export type QueryReferral_AcceptArgs = {
  where: ReferralUserAcceptInvitationInput;
};

export type QueryReferral_GetCommissionReleasesListArgs = {
  where: ReferralUserPaginationInput;
};

export type QueryReferral_GetInviteStatusArgs = {
  where: ReferralUserInput;
};

export type QueryReferral_GetInviterStatsArgs = {
  where: ReferralUserInput;
};

export type QueryReferral_GetReferrerListArgs = {
  where: ReferralUserPaginationInput;
};

export type QueryReferral_GetReferrerStatsArgs = {
  where: ReferralUserInput;
};

export type QueryReferral_GetReferrerTradesChainIdsArgs = {
  where: ReferralUserInput;
};

export type QueryReferral_GetReferrerTradesListArgs = {
  where: ReferralChainUserPaginationInput;
};

export type QueryReferral_GetUnreleasedCommissionChainIdsArgs = {
  where: ReferralUserTypeInput;
};

export type QueryReferral_GetUnreleasedCommissionListArgs = {
  where: ReferralChainUserTypePaginationInput;
};

export type QueryRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registry_Filter>;
};

export type QueryRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardDetailArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<RewardDetail_Filter>;
};

export type QueryRewardDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardDetail_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewardDetail_Filter>;
};

export type QueryRfq_Order_ConfirmArgs = {
  where?: InputMaybe<Rfq_OrderRfqConfimrOrder>;
};

export type QueryRfq_Order_InquiryArgs = {
  where?: InputMaybe<Rfq_OrderRfqInquiry>;
};

export type QueryRfq_Order_TokenPairsArgs = {
  where?: InputMaybe<Rfq_OrderRfqTokenPairs>;
};

export type QueryRouterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRoutersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Router_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Router_Filter>;
};

export type QuerySetPoolInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetPoolInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SetPoolInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPoolInfo_Filter>;
};

export type QuerySetVaultInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetVaultInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SetVaultInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetVaultInfo_Filter>;
};

export type QueryStarterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Starter_Filter>;
};

export type QueryStartersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Starter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Starter_Filter>;
};

export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Swap_Filter>;
};

export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
};

export type QueryThird_Party_Token_ListArgs = {
  data?: InputMaybe<Third_Party_TokenlistData>;
};

export type QueryTickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Tick_Filter>;
};

export type QueryTicksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Tick_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Token_Filter>;
};

export type QueryTokenContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TokenContract_Filter>;
};

export type QueryTokenContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenContract_Filter>;
};

export type QueryTokenDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TokenDayData_Filter>;
};

export type QueryTokenDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenDayData_Filter>;
};

export type QueryTokenRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenRegistry_Filter>;
};

export type QueryTokenRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TokenRegistry_Filter>;
};

export type QueryTokenTraderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TokenTrader_Filter>;
};

export type QueryTokenTradersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenTrader_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenTrader_Filter>;
};

export type QueryToken_Info_BalancesArgs = {
  data?: InputMaybe<Token_InfoTokenBalanceListData>;
};

export type QueryToken_Info_BalancesV2Args = {
  data?: InputMaybe<Token_InfoTokenBalanceListDataV2>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export type QueryTokens_GetCautionsArgs = {
  where?: InputMaybe<TokensCautionTokensInput>;
};

export type QueryTradeHistoryTransferDetailArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TradeHistoryTransferDetail_Filter>;
};

export type QueryTradeHistoryTransferDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradeHistoryTransferDetail_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TradeHistoryTransferDetail_Filter>;
};

export type QueryTradingIncentiveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TradingIncentive_Filter>;
};

export type QueryTradingIncentivesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradingIncentive_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TradingIncentive_Filter>;
};

export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Transaction_Filter>;
};

export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Transaction_Filter>;
};

export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<Transfer_Filter>;
};

export type QueryTransferHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransferHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TransferHistory_Filter>;
};

export type QueryTransferHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<TransferHistory_Filter>;
};

export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Transfer_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<User_Filter>;
};

export type QueryUserDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<UserDayData_Filter>;
};

export type QueryUserDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserDayData_Filter>;
};

export type QueryUserFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserFunding_Filter>;
};

export type QueryUserNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<UserNft_Filter>;
};

export type QueryUserNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserNft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserNft_Filter>;
};

export type QueryUserOperationHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserOperationHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserOperationHistory_Filter>;
};

export type QueryUserOperationHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<UserOperationHistory_Filter>;
};

export type QueryUserStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<UserStake_Filter>;
};

export type QueryUserStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserStake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserStake_Filter>;
};

export type QueryUserTokenBlanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<UserTokenBlance_Filter>;
};

export type QueryUserTokenBlancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserTokenBlance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserTokenBlance_Filter>;
};

export type QueryUser_Swap_OrderHistoriesArgs = {
  where?: InputMaybe<User_SwapswapFilter>;
};

export type QueryUser_Swap_Pair_Slippage_DeleteArgs = {
  data?: InputMaybe<User_Swap_Pair_SlippagedeleteData>;
};

export type QueryUser_Swap_Pair_Slippage_ListArgs = {
  where?: InputMaybe<User_Swap_Pair_SlippagelistFilter>;
};

export type QueryUser_Swap_Pair_Slippage_UpsertArgs = {
  data?: InputMaybe<User_Swap_Pair_SlippageupsertData>;
};

export type QueryUserprofile_AssetArgs = {
  where?: InputMaybe<UserprofileAsset_Filter>;
};

export type QueryUserprofile_InviteUserArgs = {
  where?: InputMaybe<UserprofileUserInviteFilter>;
};

export type QueryUserprofile_NftAssetsArgs = {
  where?: InputMaybe<UserprofileNftAssetsFilter>;
};

export type QueryUserprofile_PrivatePoolsArgs = {
  where?: InputMaybe<Userprofileprivate_Pools_List_Filter>;
};

export type QueryUserprofile_RewardArgs = {
  where?: InputMaybe<UserprofileReward_Filter>;
};

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<User_Filter>;
};

export type QueryVDodoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<VDodo_Filter>;
};

export type QueryVDodOsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VDodo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VDodo_Filter>;
};

export type QueryVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVaultAssetInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVaultAssetInfoDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVaultAssetInfoDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfoDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfoDayData_Filter>;
};

export type QueryVaultAssetInfoHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfoHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfoHistory_Filter>;
};

export type QueryVaultAssetInfoHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVaultAssetInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfo_Filter>;
};

export type QueryVaultDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVaultDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultDayData_Filter>;
};

export type QueryVaultNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<VaultNft_Filter>;
};

export type QueryVaultNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultNft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultNft_Filter>;
};

export type QueryVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};

export type QueryVdodo_GetServiceChargesArgs = {
  where?: InputMaybe<VdodoChainsInput>;
};

export type QueryVdodo_GetStatsArgs = {
  where?: InputMaybe<VdodoChainsInput>;
};

export type QueryWithdrawFundHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawFundHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawFundHistory_Filter>;
};

export type QueryWithdrawFundHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  where?: InputMaybe<WithdrawFundHistory_Filter>;
};

export type QueryWithdrawReserveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawReservesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawReserve_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawReserve_Filter>;
};

export type Quest3UserFilterInput = {
  /** user address */
  address: Scalars['String']['input'];
  /** 结束时间 */
  end_time: Scalars['Int']['input'];
  /** seconds of unix timestamp，开始时间 */
  start_time: Scalars['Int']['input'];
};

export type Quest3UserLpQualifiedFilterInput = {
  /** user address */
  address: Scalars['String']['input'];
  /** 结束时间 */
  end_time: Scalars['Int']['input'];
  /** seconds of unix timestamp，开始时间 */
  start_time: Scalars['Int']['input'];
  /** 指定需要大于等于的交易量，例如：>=50USD */
  volume: Scalars['BigDecimal']['input'];
};

export type Quest3UserMiningQualifiedFilterInput = {
  /** user address */
  address: Scalars['String']['input'];
  /** 结束时间 */
  end_time: Scalars['Int']['input'];
  /** 指定需要大于等于的挖矿持续时间：持续24小时 */
  hours: Scalars['BigDecimal']['input'];
  /** seconds of unix timestamp，开始时间 */
  start_time: Scalars['Int']['input'];
};

export type RedeemHistory = {
  /** burn dodo amount */
  burn: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** fee dodo amount */
  fee: Scalars['BigDecimal']['output'];
  /** transaction hash */
  id: Scalars['ID']['output'];
  /** recieve dodo amount */
  recieve: Scalars['BigDecimal']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** superior address */
  user: User;
};

export type RedeemHistory_Filter = {
  burn?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  burn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  burn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  fee?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  recieve?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  recieve_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  recieve_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type RedeemHistory_OrderBy =
  | 'burn'
  | 'chain'
  | 'fee'
  | 'id'
  | 'recieve'
  | 'timestamp'
  | 'user';

export type ReferralChainUserPaginationInput = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type ReferralChainUserTypePaginationInput = {
  chainId: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type: ReferralCommissionTypes;
  user: Scalars['String']['input'];
};

export type ReferralCommissionReleasesPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<ReferralCommissionReleasesResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type ReferralCommissionReleasesResult = {
  chainId: Scalars['Int']['output'];
  releasedAt: Scalars['Int']['output'];
  transaction: Scalars['String']['output'];
};

export type ReferralCommissionTypes =
  /** Inviter 下面的 Referrers 的统计 */
  | 'Referral'
  /** Inviter 自己的统计 */
  | 'Self';

/** 邀请状态 */
export type ReferralInviteStatus =
  /** 已被邀请 */
  | 'Invited'
  /** 未被邀请 */
  | 'Uninvited';

export type ReferralInviterStats = {
  totalCommissionsEarnedUsd: Scalars['BigDecimal']['output'];
  totalReferrers: Scalars['Int']['output'];
  totalTradeVolumeUsd: Scalars['BigDecimal']['output'];
};

export type ReferralReferrerPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<ReferralReferrerResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type ReferralReferrerResult = {
  acceptedAt: Scalars['Int']['output'];
  number: Scalars['Int']['output'];
  user: Scalars['String']['output'];
};

export type ReferralReferrerStats = {
  /** 邀请时间 */
  invitedAt?: Maybe<Scalars['Int']['output']>;
  /** 邀请人地址 */
  inviter?: Maybe<Scalars['String']['output']>;
  /** 减少了多少手续费 */
  totalReducedSwapFeeUsd: Scalars['BigDecimal']['output'];
};

export type ReferralReferrerTradesPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<ReferralReferrerTradesResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type ReferralReferrerTradesResult = {
  chainId: Scalars['Int']['output'];
  fromAmount: Scalars['BigDecimal']['output'];
  fromSymbol: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  toAmount: Scalars['BigDecimal']['output'];
  toSymbol: Scalars['String']['output'];
  transaction: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type ReferralUnreleasedCommissionPaginationResult = {
  count: Scalars['Int']['output'];
  list: Array<Maybe<ReferralUnreleasedCommissionResult>>;
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
};

export type ReferralUnreleasedCommissionResult = {
  address: Scalars['String']['output'];
  amount: Scalars['BigDecimal']['output'];
  chainId: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
};

export type ReferralUserAcceptInvitationInput = {
  /** referrer user address */
  address: Scalars['String']['input'];
  /** invite user address */
  inviter: Scalars['String']['input'];
  /** sign message */
  message: Scalars['String']['input'];
  /** wallet signature */
  signature: Scalars['String']['input'];
  /** sign timestamp */
  timestamp: Scalars['String']['input'];
};

export type ReferralUserInput = {
  user: Scalars['String']['input'];
};

export type ReferralUserPaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  user: Scalars['String']['input'];
};

export type ReferralUserTypeInput = {
  type: ReferralCommissionTypes;
  user: Scalars['String']['input'];
};

export type Registry = {
  id: Scalars['ID']['output'];
  pools: Array<Pool>;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  vaults: Array<Vault>;
};

export type RegistryPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};

export type RegistryVaultsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vault_Filter>;
};

export type Registry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  pools?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_?: InputMaybe<Pool_Filter>;
  pools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vaults?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_?: InputMaybe<Vault_Filter>;
  vaults_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_not?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Registry_OrderBy = 'id' | 'pools' | 'updatedAt' | 'vaults';

export type Request_Split_ConfigRequestSplitConfigItem = {
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type RewardDetail = {
  chain: Scalars['String']['output'];
  /** end block */
  endBlock: Scalars['BigInt']['output'];
  /** id */
  id: Scalars['ID']['output'];
  /** minepool */
  minePool: MinePool;
  /** reward per block */
  rewardPerBlock: Scalars['BigInt']['output'];
  /** start block */
  startBlock: Scalars['BigInt']['output'];
  /** rewardTokens */
  token: Scalars['Bytes']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type RewardDetail_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  endBlock?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  minePool?: InputMaybe<Scalars['String']['input']>;
  minePool_contains?: InputMaybe<Scalars['String']['input']>;
  minePool_ends_with?: InputMaybe<Scalars['String']['input']>;
  minePool_gt?: InputMaybe<Scalars['String']['input']>;
  minePool_gte?: InputMaybe<Scalars['String']['input']>;
  minePool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  minePool_lt?: InputMaybe<Scalars['String']['input']>;
  minePool_lte?: InputMaybe<Scalars['String']['input']>;
  minePool_not?: InputMaybe<Scalars['String']['input']>;
  minePool_not_contains?: InputMaybe<Scalars['String']['input']>;
  minePool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  minePool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  minePool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  minePool_starts_with?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  rewardPerBlock?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardPerBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardPerBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  startBlock?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type RewardDetail_OrderBy =
  | 'chain'
  | 'endBlock'
  | 'id'
  | 'minePool'
  | 'rewardPerBlock'
  | 'startBlock'
  | 'token'
  | 'updatedAt';

export type Rfq_OrderRfqConfimrOrder = {
  inquiryId?: InputMaybe<Scalars['String']['input']>;
  taker?: InputMaybe<Scalars['String']['input']>;
  takerSignature?: InputMaybe<Scalars['String']['input']>;
};

export type Rfq_OrderRfqConfimrOrderResult = {
  callContract?: Maybe<Scalars['String']['output']>;
  calldata?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['String']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  inquiryId?: Maybe<Scalars['String']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  makerToken?: Maybe<Scalars['String']['output']>;
  marketer?: Maybe<Scalars['String']['output']>;
  safeTxHash?: Maybe<Scalars['String']['output']>;
  slot?: Maybe<Scalars['String']['output']>;
  taker?: Maybe<Scalars['String']['output']>;
  takerAmount?: Maybe<Scalars['String']['output']>;
  takerSignature?: Maybe<Scalars['String']['output']>;
  takerToken?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Rfq_OrderRfqInquiry = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  makerToken?: InputMaybe<Scalars['String']['input']>;
  taker?: InputMaybe<Scalars['String']['input']>;
  takerAmount?: InputMaybe<Scalars['String']['input']>;
  takerToken?: InputMaybe<Scalars['String']['input']>;
};

export type Rfq_OrderRfqInquiryResult = {
  expiration?: Maybe<Scalars['Int']['output']>;
  inquiryId?: Maybe<Scalars['String']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  marketer?: Maybe<Scalars['String']['output']>;
  offers?: Maybe<Array<Maybe<Rfq_OrderRfqOffer>>>;
  slot?: Maybe<Scalars['String']['output']>;
};

export type Rfq_OrderRfqOffer = {
  data?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['Int']['output']>;
  maker?: Maybe<Scalars['String']['output']>;
  makerAmount?: Maybe<Scalars['String']['output']>;
  marketer?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
};

export type Rfq_OrderRfqTokenPairs = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
};

export type Rfq_OrderRfqTokenPairsInfo = {
  chainId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  fromToken?: Maybe<Scalars['String']['output']>;
  fromTokenDecimal?: Maybe<Scalars['Int']['output']>;
  fromTokenSymbol?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maxAmount?: Maybe<Scalars['String']['output']>;
  minAmount?: Maybe<Scalars['String']['output']>;
  toToken?: Maybe<Scalars['String']['output']>;
  toTokenDecimal?: Maybe<Scalars['Int']['output']>;
  toTokenSymbol?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Router = {
  /** addTimestamp */
  addTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** id:router:address */
  id: Scalars['ID']['output'];
  isRemove: Scalars['Boolean']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type Router_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  addTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  addTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRemove?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRemove_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRemove_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Router_OrderBy = 'addTimestamp' | 'id' | 'isRemove' | 'updatedAt';

export type SetPoolInfo = {
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  operatorIndex: Scalars['BigInt']['output'];
  pool: Pool;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
};

export type SetPoolInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorIndex?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type SetPoolInfo_OrderBy =
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'operatorIndex'
  | 'pool'
  | 'timestamp'
  | 'updatedAt';

export type SetVaultInfo = {
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  operatorType: Scalars['String']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  vault: Vault;
};

export type SetVaultInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorType?: InputMaybe<Scalars['String']['input']>;
  operatorType_contains?: InputMaybe<Scalars['String']['input']>;
  operatorType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorType_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorType_gt?: InputMaybe<Scalars['String']['input']>;
  operatorType_gte?: InputMaybe<Scalars['String']['input']>;
  operatorType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorType_lt?: InputMaybe<Scalars['String']['input']>;
  operatorType_lte?: InputMaybe<Scalars['String']['input']>;
  operatorType_not?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_contains?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operatorType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorType_starts_with?: InputMaybe<Scalars['String']['input']>;
  operatorType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type SetVaultInfo_OrderBy =
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'operatorType'
  | 'timestamp'
  | 'updatedAt'
  | 'vault';

export type Starter = {
  chain: Scalars['String']['output'];
  /** id address */
  id: Scalars['ID']['output'];
};

export type Starter_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Starter_OrderBy = 'chain' | 'id';

export type Subscription = {
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  dailyScheduledTask?: Maybe<DailyScheduledTask>;
  dailyScheduledTasks: Array<DailyScheduledTask>;
  liquidator?: Maybe<Liquidator>;
  liquidators: Array<Liquidator>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositions: Array<LiquidityPosition>;
  maker?: Maybe<Maker>;
  makers: Array<Maker>;
  pool?: Maybe<Pool>;
  poolDayData?: Maybe<PoolDayData>;
  poolDayDatas: Array<PoolDayData>;
  poolFunding?: Maybe<PoolFunding>;
  poolFundings: Array<PoolFunding>;
  poolToken?: Maybe<PoolToken>;
  poolTokenHistories: Array<PoolTokenHistory>;
  poolTokenHistory?: Maybe<PoolTokenHistory>;
  poolTokens: Array<PoolToken>;
  pools: Array<Pool>;
  registries: Array<Registry>;
  registry?: Maybe<Registry>;
  router?: Maybe<Router>;
  routers: Array<Router>;
  setPoolInfo?: Maybe<SetPoolInfo>;
  setPoolInfos: Array<SetPoolInfo>;
  setVaultInfo?: Maybe<SetVaultInfo>;
  setVaultInfos: Array<SetVaultInfo>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  user?: Maybe<User>;
  userFunding?: Maybe<UserFunding>;
  userFundings: Array<UserFunding>;
  users: Array<User>;
  vault?: Maybe<Vault>;
  vaultAssetInfo?: Maybe<VaultAssetInfo>;
  vaultAssetInfoDayData?: Maybe<VaultAssetInfoDayData>;
  vaultAssetInfoDayDatas: Array<VaultAssetInfoDayData>;
  vaultAssetInfoHistories: Array<VaultAssetInfoHistory>;
  vaultAssetInfoHistory?: Maybe<VaultAssetInfoHistory>;
  vaultAssetInfos: Array<VaultAssetInfo>;
  vaultDayData?: Maybe<VaultDayData>;
  vaultDayDatas: Array<VaultDayData>;
  vaults: Array<Vault>;
  withdrawReserve?: Maybe<WithdrawReserve>;
  withdrawReserves: Array<WithdrawReserve>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionDailyScheduledTaskArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDailyScheduledTasksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyScheduledTask_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyScheduledTask_Filter>;
};

export type SubscriptionLiquidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Liquidator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidator_Filter>;
};

export type SubscriptionLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

export type SubscriptionMakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Maker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Maker_Filter>;
};

export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolDayData_Filter>;
};

export type SubscriptionPoolFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolFunding_Filter>;
};

export type SubscriptionPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTokenHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolTokenHistory_Filter>;
};

export type SubscriptionPoolTokenHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type SubscriptionRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registry_Filter>;
};

export type SubscriptionRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRouterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRoutersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Router_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Router_Filter>;
};

export type SubscriptionSetPoolInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetPoolInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SetPoolInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPoolInfo_Filter>;
};

export type SubscriptionSetVaultInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetVaultInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SetVaultInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetVaultInfo_Filter>;
};

export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserFunding_Filter>;
};

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type SubscriptionVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVaultAssetInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVaultAssetInfoDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVaultAssetInfoDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfoDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfoDayData_Filter>;
};

export type SubscriptionVaultAssetInfoHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfoHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfoHistory_Filter>;
};

export type SubscriptionVaultAssetInfoHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVaultAssetInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultAssetInfo_Filter>;
};

export type SubscriptionVaultDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVaultDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultDayData_Filter>;
};

export type SubscriptionVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};

export type SubscriptionWithdrawReserveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawReservesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawReserve_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawReserve_Filter>;
};

export type Swap = {
  /** from token amount */
  amountIn: Scalars['BigDecimal']['output'];
  /** to token amount */
  amountOut: Scalars['BigDecimal']['output'];
  /** base volume */
  baseVolume: Scalars['BigDecimal']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** lp fee base */
  feeBase: Scalars['BigDecimal']['output'];
  /** lp fee quote */
  feeQuote: Scalars['BigDecimal']['output'];
  /** tx from address */
  from: Scalars['Bytes']['output'];
  /** from token */
  fromToken: Token;
  /** from token OraclePrice */
  fromTokenOraclePrice: Scalars['BigInt']['output'];
  fromTokenOraclePriceUSD: Scalars['BigDecimal']['output'];
  /** transaction hash */
  hash: Scalars['String']['output'];
  /** transaction hash + "-" + index in swaps Transaction array */
  id: Scalars['ID']['output'];
  /** log index */
  logIndex: Scalars['BigInt']['output'];
  mtFee?: Maybe<Scalars['BigDecimal']['output']>;
  mtFeeToken?: Maybe<Scalars['String']['output']>;
  mtFeeUSD: Scalars['BigDecimal']['output'];
  mtFeeUsd?: Maybe<Scalars['BigDecimal']['output']>;
  /** trading pair */
  pair?: Maybe<Pair>;
  payFromAmount: Scalars['BigInt']['output'];
  pool: Pool;
  /** quote volume */
  quoteVolume: Scalars['BigDecimal']['output'];
  receiveToAmount: Scalars['BigInt']['output'];
  /**  sellOrNot = 0 means sell, 1 means buy. */
  sellOrNot: Scalars['BigInt']['output'];
  /** msg.sender */
  sender: Scalars['Bytes']['output'];
  swapFee: Scalars['BigInt']['output'];
  swapFeeUSD: Scalars['BigDecimal']['output'];
  /** transaction timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** to address */
  to: Scalars['Bytes']['output'];
  /** to token */
  toToken: Token;
  /** to token OraclePrice */
  toTokenOraclePrice: Scalars['BigInt']['output'];
  toTokenOraclePriceUSD: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  baseVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  baseVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeBase?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeBase_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeBase_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeQuote_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeQuote_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  fromToken?: InputMaybe<Scalars['String']['input']>;
  fromTokenOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  fromTokenOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  fromTokenOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  fromTokenOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromTokenOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  fromTokenOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromToken_?: InputMaybe<Token_Filter>;
  fromToken_contains?: InputMaybe<Scalars['String']['input']>;
  fromToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromToken_gt?: InputMaybe<Scalars['String']['input']>;
  fromToken_gte?: InputMaybe<Scalars['String']['input']>;
  fromToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromToken_lt?: InputMaybe<Scalars['String']['input']>;
  fromToken_lte?: InputMaybe<Scalars['String']['input']>;
  fromToken_not?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mtFee?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_contains?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_gt?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_gte?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFeeToken_lt?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_lte?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_not?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFeeToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mtFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mtFeeUsd?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_contains?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_gt?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_gte?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFeeUsd_lt?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_lte?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_not?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_not_contains?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFeeUsd_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mtFeeUsd_starts_with?: InputMaybe<Scalars['String']['input']>;
  mtFee_contains?: InputMaybe<Scalars['String']['input']>;
  mtFee_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFee_gt?: InputMaybe<Scalars['String']['input']>;
  mtFee_gte?: InputMaybe<Scalars['String']['input']>;
  mtFee_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFee_lt?: InputMaybe<Scalars['String']['input']>;
  mtFee_lte?: InputMaybe<Scalars['String']['input']>;
  mtFee_not?: InputMaybe<Scalars['String']['input']>;
  mtFee_not_contains?: InputMaybe<Scalars['String']['input']>;
  mtFee_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mtFee_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mtFee_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mtFee_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  payFromAmount?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  payFromAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  payFromAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  quoteVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  quoteVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiveToAmount?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  receiveToAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  receiveToAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  sellOrNot?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellOrNot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellOrNot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  swapFee?: InputMaybe<Scalars['BigInt']['input']>;
  swapFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  swapFee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapFee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  swapFee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  swapFee_not?: InputMaybe<Scalars['BigInt']['input']>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
  toTokenOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  toTokenOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  toTokenOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  toTokenOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  toTokenOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  toTokenOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  toToken_?: InputMaybe<Token_Filter>;
  toToken_contains?: InputMaybe<Scalars['String']['input']>;
  toToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  toToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toToken_gt?: InputMaybe<Scalars['String']['input']>;
  toToken_gte?: InputMaybe<Scalars['String']['input']>;
  toToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toToken_lt?: InputMaybe<Scalars['String']['input']>;
  toToken_lte?: InputMaybe<Scalars['String']['input']>;
  toToken_not?: InputMaybe<Scalars['String']['input']>;
  toToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  toToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  toToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Swap_OrderBy =
  | 'amountIn'
  | 'amountOut'
  | 'baseVolume'
  | 'blockNumber'
  | 'chain'
  | 'feeBase'
  | 'feeQuote'
  | 'from'
  | 'fromToken'
  | 'fromTokenOraclePrice'
  | 'fromTokenOraclePriceUSD'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'mtFee'
  | 'mtFeeToken'
  | 'mtFeeUSD'
  | 'mtFeeUsd'
  | 'pair'
  | 'payFromAmount'
  | 'pool'
  | 'quoteVolume'
  | 'receiveToAmount'
  | 'sellOrNot'
  | 'sender'
  | 'swapFee'
  | 'swapFeeUSD'
  | 'timestamp'
  | 'to'
  | 'toToken'
  | 'toTokenOraclePrice'
  | 'toTokenOraclePriceUSD'
  | 'updatedAt'
  | 'volumeUSD';

export type Third_Party_TokenList = {
  address?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  logoURI?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type Third_Party_TokenlistData = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  fromNames?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Tick = {
  chain: Scalars['String']['output'];
  createdAtBlockNumber: Scalars['BigInt']['output'];
  createdAtTimestamp: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  liquidityGross: Scalars['BigInt']['output'];
  liquidityNet: Scalars['BigInt']['output'];
  pool: Pool;
  poolAddress?: Maybe<Scalars['String']['output']>;
  price0: Scalars['BigDecimal']['output'];
  price1: Scalars['BigDecimal']['output'];
  tickIdx: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type Tick_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityGross?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityGross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityGross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNet?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityNet_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityNet_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  poolAddress_contains?: InputMaybe<Scalars['String']['input']>;
  poolAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolAddress_gt?: InputMaybe<Scalars['String']['input']>;
  poolAddress_gte?: InputMaybe<Scalars['String']['input']>;
  poolAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolAddress_lt?: InputMaybe<Scalars['String']['input']>;
  poolAddress_lte?: InputMaybe<Scalars['String']['input']>;
  poolAddress_not?: InputMaybe<Scalars['String']['input']>;
  poolAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  price0?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price1?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  tickIdx?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tickIdx_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_not?: InputMaybe<Scalars['BigInt']['input']>;
  tickIdx_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type Tick_OrderBy =
  | 'chain'
  | 'createdAtBlockNumber'
  | 'createdAtTimestamp'
  | 'id'
  | 'liquidityGross'
  | 'liquidityNet'
  | 'pool'
  | 'poolAddress'
  | 'price0'
  | 'price1'
  | 'tickIdx'
  | 'updatedAt';

export type Token = {
  chain: Scalars['String']['output'];
  /** creator */
  creator: Scalars['String']['output'];
  /** token decimals */
  decimals: Scalars['BigInt']['output'];
  /** holder count */
  holderCount: Scalars['BigInt']['output'];
  /** token address */
  id: Scalars['ID']['output'];
  isLpToken: Scalars['Boolean']['output'];
  /** token name */
  name: Scalars['String']['output'];
  /** lpToken originToken */
  originToken?: Maybe<Scalars['Bytes']['output']>;
  /** price update time */
  priceUpdateTimestamp: Scalars['BigInt']['output'];
  /** token symbol */
  symbol: Scalars['String']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** liquidity across all pairs */
  totalLiquidityOnDODO: Scalars['BigDecimal']['output'];
  /** total supply */
  totalSupply: Scalars['BigInt']['output'];
  /** total trade volume */
  tradeVolume: Scalars['BigDecimal']['output'];
  /** total trade volume for bridge */
  tradeVolumeBridge: Scalars['BigDecimal']['output'];
  /** trader count */
  traderCount: Scalars['BigInt']['output'];
  /** transactions across all pairs */
  txCount: Scalars['BigInt']['output'];
  /** erc20Type */
  type: Scalars['BigInt']['output'];
  /** untracked volume */
  untrackedVolume: Scalars['BigDecimal']['output'];
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** usd price(only stable coin and classical pool has usd price) */
  usdPrice: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
  /** traded volume of USD for bridge */
  volumeUSDBridge: Scalars['BigDecimal']['output'];
};

export type TokenContract = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type TokenContract_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type TokenContract_OrderBy = 'chain' | 'id';

export type TokenDayData = {
  chain: Scalars['String']['output'];
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** trading fee lp get */
  fee: Scalars['BigDecimal']['output'];
  /** token address - day id */
  id: Scalars['ID']['output'];
  /** maintainer fee */
  maintainerFee: Scalars['BigDecimal']['output'];
  /** maintainer fee in usd */
  maintainerFeeUSD: Scalars['BigDecimal']['output'];
  /** token address */
  token: Token;
  /** liquidity stats */
  totalLiquidityToken: Scalars['BigDecimal']['output'];
  /** daily traders */
  traders: Scalars['BigInt']['output'];
  /** tx occured */
  txns: Scalars['BigInt']['output'];
  /** untracked base volume */
  untrackedVolume: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** usdPrice */
  usdPrice: Scalars['BigDecimal']['output'];
  /** volume */
  volume: Scalars['BigDecimal']['output'];
  /** bridge volume */
  volumeBridge: Scalars['BigDecimal']['output'];
  /** traded volume of USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type TokenDayData_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fee?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maintainerFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainerFeeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFeeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainerFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  maintainerFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  maintainerFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalLiquidityToken?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityToken_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityToken_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  traders?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not?: InputMaybe<Scalars['BigInt']['input']>;
  traders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txns_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txns_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not?: InputMaybe<Scalars['BigInt']['input']>;
  txns_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeBridge_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeBridge_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TokenDayData_OrderBy =
  | 'chain'
  | 'date'
  | 'fee'
  | 'id'
  | 'maintainerFee'
  | 'maintainerFeeUSD'
  | 'token'
  | 'totalLiquidityToken'
  | 'traders'
  | 'txns'
  | 'untrackedVolume'
  | 'updatedAt'
  | 'usdPrice'
  | 'volume'
  | 'volumeBridge'
  | 'volumeUSD';

export type TokenRegistry = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type TokenRegistry_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type TokenRegistry_OrderBy = 'chain' | 'id';

export type TokenTrader = {
  chain: Scalars['String']['output'];
  /** token address - user address */
  id: Scalars['ID']['output'];
  /** last trade time */
  lastTxTime: Scalars['BigInt']['output'];
  /** pair */
  token: Token;
  /** user */
  trader: User;
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type TokenTrader_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastTxTime?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastTxTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastTxTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  trader?: InputMaybe<Scalars['String']['input']>;
  trader_contains?: InputMaybe<Scalars['String']['input']>;
  trader_ends_with?: InputMaybe<Scalars['String']['input']>;
  trader_gt?: InputMaybe<Scalars['String']['input']>;
  trader_gte?: InputMaybe<Scalars['String']['input']>;
  trader_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trader_lt?: InputMaybe<Scalars['String']['input']>;
  trader_lte?: InputMaybe<Scalars['String']['input']>;
  trader_not?: InputMaybe<Scalars['String']['input']>;
  trader_not_contains?: InputMaybe<Scalars['String']['input']>;
  trader_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  trader_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  trader_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  trader_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TokenTrader_OrderBy =
  | 'chain'
  | 'id'
  | 'lastTxTime'
  | 'token'
  | 'trader'
  | 'updatedAt';

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holderCount?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isLpToken?: InputMaybe<Scalars['Boolean']['input']>;
  isLpToken_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isLpToken_not?: InputMaybe<Scalars['Boolean']['input']>;
  isLpToken_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  originToken?: InputMaybe<Scalars['Bytes']['input']>;
  originToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  originToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  originToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  originToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  originToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  priceUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  priceUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalLiquidityOnDODO?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityOnDODO_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityOnDODO_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeBridge_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeBridge_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  traderCount?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  traderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  traderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type?: InputMaybe<Scalars['BigInt']['input']>;
  type_gt?: InputMaybe<Scalars['BigInt']['input']>;
  type_gte?: InputMaybe<Scalars['BigInt']['input']>;
  type_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type_lt?: InputMaybe<Scalars['BigInt']['input']>;
  type_lte?: InputMaybe<Scalars['BigInt']['input']>;
  type_not?: InputMaybe<Scalars['BigInt']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  usdPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  usdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSDBridge_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSDBridge_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Token_InfoTokenBalanceList = {
  tokens?: Maybe<Scalars['JSON']['output']>;
};

export type Token_InfoTokenBalanceListData = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  tokenAddresss?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type Token_InfoTokenBalanceListDataV2 = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type Token_OrderBy =
  | 'chain'
  | 'creator'
  | 'decimals'
  | 'holderCount'
  | 'id'
  | 'isLpToken'
  | 'name'
  | 'originToken'
  | 'priceUpdateTimestamp'
  | 'symbol'
  | 'timestamp'
  | 'totalLiquidityOnDODO'
  | 'totalSupply'
  | 'tradeVolume'
  | 'tradeVolumeBridge'
  | 'traderCount'
  | 'txCount'
  | 'type'
  | 'untrackedVolume'
  | 'updatedAt'
  | 'usdPrice'
  | 'volumeUSD'
  | 'volumeUSDBridge';

export type TokensCautionTokenResult = {
  /** it's true when token is abnormal */
  alert: Scalars['Boolean']['output'];
  /** alert reason, it'll includes reason string when alert is true, otherwise it's empty array */
  reason: Array<Maybe<Scalars['String']['output']>>;
  /** token address */
  token: Scalars['String']['output'];
};

export type TokensCautionTokensInput = {
  network: Scalars['Int']['input'];
  /** addresses of token */
  tokens: Array<Scalars['String']['input']>;
};

export type TradeHistoryTransferDetail = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type TradeHistoryTransferDetail_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type TradeHistoryTransferDetail_OrderBy = 'chain' | 'id';

export type TradingIncentive = {
  chain: Scalars['String']['output'];
  /** id (contract address) */
  id: Scalars['ID']['output'];
  /** total amount released */
  totalAmount: Scalars['BigDecimal']['output'];
  /** total user */
  totalUser: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type TradingIncentive_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalUser?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUser_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUser_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TradingIncentive_OrderBy =
  | 'chain'
  | 'id'
  | 'totalAmount'
  | 'totalUser'
  | 'updatedAt';

export type Transaction = {
  chain: Scalars['String']['output'];
  /** from */
  from: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** sender */
  sender: Scalars['String']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** to */
  to: Scalars['String']['output'];
  /** tokens */
  tokens?: Maybe<Array<Token>>;
  /** type(TRADE、LP、CP) */
  type: Scalars['String']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** volumeUSD */
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type Transaction_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokens?: InputMaybe<Scalars['String']['input']>;
  tokens_contains?: InputMaybe<Scalars['String']['input']>;
  tokens_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokens_gt?: InputMaybe<Scalars['String']['input']>;
  tokens_gte?: InputMaybe<Scalars['String']['input']>;
  tokens_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_lt?: InputMaybe<Scalars['String']['input']>;
  tokens_lte?: InputMaybe<Scalars['String']['input']>;
  tokens_not?: InputMaybe<Scalars['String']['input']>;
  tokens_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokens_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokens_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokens_starts_with?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Transaction_OrderBy =
  | 'chain'
  | 'from'
  | 'id'
  | 'sender'
  | 'timestamp'
  | 'to'
  | 'tokens'
  | 'type'
  | 'updatedAt'
  | 'volumeUSD';

export type Transfer = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type TransferHistory = {
  /** amount */
  amount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** from */
  from: User;
  /** token - hash */
  id: Scalars['ID']['output'];
  /** to */
  to: User;
};

export type TransferHistory_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type TransferHistory_OrderBy = 'amount' | 'chain' | 'from' | 'id' | 'to';

export type Transfer_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type Transfer_OrderBy = 'chain' | 'id';

export type User = {
  /** user accumulated interest */
  accInterestUSD: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** credit */
  credit: Scalars['BigDecimal']['output'];
  /** credit get from invited */
  creditFromInvited: Scalars['BigDecimal']['output'];
  /** credit of superior */
  creditOfSuperior: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  /** liquidity Positions */
  liquidityPositions?: Maybe<Array<LiquidityPosition>>;
  /** mint dodo amount */
  mintAmount: Scalars['BigDecimal']['output'];
  /** redeem burn amount */
  redeemBurnAmount: Scalars['BigDecimal']['output'];
  /** redeem fee amount */
  redeemFeeAmount: Scalars['BigDecimal']['output'];
  /** redeem recieve dodo amount */
  redeemRecieveAmount: Scalars['BigDecimal']['output'];
  /** sp get from invited */
  spFromInvited: Scalars['BigInt']['output'];
  /** stakingPower amount */
  stakingPower: Scalars['BigInt']['output'];
  /** superior address */
  superior: Scalars['Bytes']['output'];
  /** superior stakingPower */
  superiorSP: Scalars['BigInt']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** tokens */
  tokens?: Maybe<Array<Token>>;
  totalAssetsUSD: Scalars['BigDecimal']['output'];
  /** trading reward recieved */
  tradingRewardRecieved: Scalars['BigDecimal']['output'];
  /** swapped times */
  txCount: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** liquidity Positions */
  userFundings?: Maybe<Array<UserFunding>>;
};

export type UserUserFundingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFunding_Filter>;
};

export type UserDayData = {
  /** add liquidity count */
  addLPCount: Scalars['BigInt']['output'];
  /** cp bid count */
  bidCount: Scalars['BigInt']['output'];
  /** cp cancel count */
  cancelCount: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** cp claim count */
  claimCount: Scalars['BigInt']['output'];
  /** date */
  date: Scalars['Int']['output'];
  /** user address - date */
  id: Scalars['ID']['output'];
  /** remove liquidity count */
  removeLPCount: Scalars['BigInt']['output'];
  /** trade count */
  tradeCount: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

export type UserDayData_Filter = {
  addLPCount?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  addLPCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  addLPCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidCount?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  bidCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelCount?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  claimCount?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  removeLPCount?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  removeLPCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  removeLPCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  tradeCount?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  tradeCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type UserDayData_OrderBy =
  | 'addLPCount'
  | 'bidCount'
  | 'cancelCount'
  | 'chain'
  | 'claimCount'
  | 'date'
  | 'id'
  | 'removeLPCount'
  | 'tradeCount'
  | 'updatedAt';

export type UserFunding = {
  amount: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  lpToken?: Maybe<Token>;
  /** total dTokenAmount */
  lpTokenAmount: Scalars['BigInt']['output'];
  /** UserWithdraw msgSender */
  msgSender?: Maybe<Scalars['Bytes']['output']>;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  token: Token;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  user: User;
  userFundingType: UserFundingType;
  /** belong vault */
  vault: Vault;
};

export type UserFundingType = 'Deposit' | 'Withdraw';

export type UserFunding_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpToken_?: InputMaybe<Token_Filter>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  msgSender?: InputMaybe<Scalars['Bytes']['input']>;
  msgSender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  msgSender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  msgSender_not?: InputMaybe<Scalars['Bytes']['input']>;
  msgSender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  msgSender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  userFundingType?: InputMaybe<UserFundingType>;
  userFundingType_in?: InputMaybe<Array<UserFundingType>>;
  userFundingType_not?: InputMaybe<UserFundingType>;
  userFundingType_not_in?: InputMaybe<Array<UserFundingType>>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type UserFunding_OrderBy =
  | 'amount'
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'lpToken'
  | 'lpTokenAmount'
  | 'msgSender'
  | 'timestamp'
  | 'token'
  | 'updatedAt'
  | 'user'
  | 'userFundingType'
  | 'vault';

export type UserNft = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type UserNft_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type UserNft_OrderBy = 'chain' | 'id';

export type UserOperationHistory = {
  /** amount */
  amount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** hash */
  id: Scalars['ID']['output'];
  /** superior credit change */
  superiorCreditChange: Scalars['BigDecimal']['output'];
  /** superior sp change */
  superiorSpChange: Scalars['BigInt']['output'];
  /** timestamp */
  timestamp: Scalars['BigInt']['output'];
  /** operation type (MINT、REDEEM) */
  type: Scalars['String']['output'];
  /** user */
  user: User;
};

export type UserOperationHistory_Filter = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  superiorCreditChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  superiorCreditChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  superiorCreditChange_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  superiorSpChange?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_gt?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_gte?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  superiorSpChange_lt?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_lte?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_not?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSpChange_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type UserOperationHistory_OrderBy =
  | 'amount'
  | 'chain'
  | 'id'
  | 'superiorCreditChange'
  | 'superiorSpChange'
  | 'timestamp'
  | 'type'
  | 'user';

export type UserStake = {
  /** balance */
  balance: Scalars['BigInt']['output'];
  chain: Scalars['String']['output'];
  /** user - pool */
  id: Scalars['ID']['output'];
  /** pool */
  pool: Scalars['Bytes']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** user address */
  user: Scalars['Bytes']['output'];
};

export type UserStake_Filter = {
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  pool?: InputMaybe<Scalars['Bytes']['input']>;
  pool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_not?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type UserStake_OrderBy =
  | 'balance'
  | 'chain'
  | 'id'
  | 'pool'
  | 'updatedAt'
  | 'user';

export type UserTokenBlance = {
  /** balance */
  balance: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** user address - token address */
  id: Scalars['ID']['output'];
};

export type UserTokenBlance_Filter = {
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type UserTokenBlance_OrderBy = 'balance' | 'chain' | 'id';

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accInterestUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accInterestUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  credit?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  creditFromInvited_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditFromInvited_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  creditOfSuperior?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  creditOfSuperior_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditOfSuperior_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  credit_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  credit_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  credit_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  credit_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  credit_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  credit_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  credit_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityPositions?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_gt?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_gte?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityPositions_lt?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_lte?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_not?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityPositions_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPositions_starts_with?: InputMaybe<Scalars['String']['input']>;
  mintAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mintAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemBurnAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemBurnAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemBurnAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemFeeAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemFeeAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemFeeAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemRecieveAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemRecieveAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemRecieveAmount_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  spFromInvited?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spFromInvited_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_not?: InputMaybe<Scalars['BigInt']['input']>;
  spFromInvited_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingPower?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingPower_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakingPower_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  superior?: InputMaybe<Scalars['Bytes']['input']>;
  superiorSP?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_gt?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_gte?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  superiorSP_lt?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_lte?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_not?: InputMaybe<Scalars['BigInt']['input']>;
  superiorSP_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  superior_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superior_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  superior_not?: InputMaybe<Scalars['Bytes']['input']>;
  superior_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superior_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens?: InputMaybe<Scalars['String']['input']>;
  tokens_contains?: InputMaybe<Scalars['String']['input']>;
  tokens_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokens_gt?: InputMaybe<Scalars['String']['input']>;
  tokens_gte?: InputMaybe<Scalars['String']['input']>;
  tokens_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_lt?: InputMaybe<Scalars['String']['input']>;
  tokens_lte?: InputMaybe<Scalars['String']['input']>;
  tokens_not?: InputMaybe<Scalars['String']['input']>;
  tokens_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokens_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokens_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokens_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalAssetsUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAssetsUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAssetsUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradingRewardRecieved?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradingRewardRecieved_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradingRewardRecieved_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  userFundings_?: InputMaybe<UserFunding_Filter>;
};

export type User_OrderBy =
  | 'accInterestUSD'
  | 'chain'
  | 'credit'
  | 'creditFromInvited'
  | 'creditOfSuperior'
  | 'id'
  | 'liquidityPositions'
  | 'mintAmount'
  | 'redeemBurnAmount'
  | 'redeemFeeAmount'
  | 'redeemRecieveAmount'
  | 'spFromInvited'
  | 'stakingPower'
  | 'superior'
  | 'superiorSP'
  | 'timestamp'
  | 'tokens'
  | 'totalAssetsUSD'
  | 'tradingRewardRecieved'
  | 'txCount'
  | 'updatedAt'
  | 'userFundings';

export type User_SwapSwapOrderList = {
  chainId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  extra?: Maybe<Scalars['JSON']['output']>;
  fromAmount?: Maybe<Scalars['String']['output']>;
  fromTokenAddress?: Maybe<Scalars['String']['output']>;
  fromTokenDecimals?: Maybe<Scalars['Int']['output']>;
  fromTokenLogoImg?: Maybe<Scalars['String']['output']>;
  fromTokenPrice?: Maybe<Scalars['String']['output']>;
  fromTokenSymbol?: Maybe<Scalars['String']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  maxAmount?: Maybe<Scalars['String']['output']>;
  minAmount?: Maybe<Scalars['String']['output']>;
  nonce?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  toAmount?: Maybe<Scalars['String']['output']>;
  toTokenAddress?: Maybe<Scalars['String']['output']>;
  toTokenDecimals?: Maybe<Scalars['Int']['output']>;
  toTokenLogoImg?: Maybe<Scalars['String']['output']>;
  toTokenPrice?: Maybe<Scalars['String']['output']>;
  toTokenSymbol?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type User_SwapUserSwapOrder = {
  count?: Maybe<Scalars['Int']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<User_SwapSwapOrderList>>>;
  page?: Maybe<Scalars['Int']['output']>;
};

export type User_Swap_Pair_SlippageJwt = {
  jwt?: Maybe<Scalars['String']['output']>;
};

export type User_Swap_Pair_SlippageJwtAndList = {
  jwt?: Maybe<Scalars['String']['output']>;
  list?: Maybe<Array<Maybe<User_Swap_Pair_SlippageUserSwapPairSlippageList>>>;
};

export type User_Swap_Pair_SlippageTokenInfo = {
  address?: Maybe<Scalars['String']['output']>;
  chainId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  logoImg?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type User_Swap_Pair_SlippageUserSwapPairSlippageList = {
  chainId?: Maybe<Scalars['Int']['output']>;
  fromToken?: Maybe<Scalars['String']['output']>;
  fromTokenInfo?: Maybe<User_Swap_Pair_SlippageTokenInfo>;
  recommend?: Maybe<Scalars['String']['output']>;
  slippage?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  toToken?: Maybe<Scalars['String']['output']>;
  toTokenInfo?: Maybe<User_Swap_Pair_SlippageTokenInfo>;
  user?: Maybe<Scalars['String']['output']>;
};

export type User_Swap_Pair_SlippagedeleteData = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  fromToken?: InputMaybe<Scalars['String']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type User_Swap_Pair_SlippagelistFilter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  fromToken?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type User_Swap_Pair_SlippageupsertData = {
  pairs?: InputMaybe<Array<InputMaybe<User_Swap_Pair_SlippageupsertDataPair>>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
};

export type User_Swap_Pair_SlippageupsertDataPair = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  fromToken?: InputMaybe<Scalars['String']['input']>;
  recommend?: InputMaybe<Scalars['String']['input']>;
  slippage?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  toToken?: InputMaybe<Scalars['String']['input']>;
};

export type User_SwapswapFilter = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UserprofileAsset_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user: Scalars['String']['input'];
};

export type UserprofileCrowdPooling = {
  /** base token */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base Token id */
  baseToken?: Maybe<Scalars['String']['output']>;
  /** user quote balance */
  investedQuoteBalance?: Maybe<Scalars['BigNumber']['output']>;
  /** cp address */
  pool?: Maybe<Scalars['String']['output']>;
  /** quote token */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token id */
  quoteToken?: Maybe<Scalars['String']['output']>;
  /** value */
  valueUSD?: Maybe<Scalars['BigNumber']['output']>;
};

export type UserprofileLiquidity = {
  /** base token apy */
  baseApy?: Maybe<Scalars['BigNumber']['output']>;
  /** balance of base token */
  baseBalance?: Maybe<Scalars['BigNumber']['output']>;
  /** balance of base token in mining */
  baseInMine?: Maybe<Scalars['BigNumber']['output']>;
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base Token id */
  baseToken?: Maybe<Scalars['String']['output']>;
  /** pool address */
  pool?: Maybe<Scalars['String']['output']>;
  /** pool type */
  poolType?: Maybe<Scalars['String']['output']>;
  /** quote token apy */
  quoteApy?: Maybe<Scalars['BigNumber']['output']>;
  /** balance of quote token */
  quoteBalance?: Maybe<Scalars['BigNumber']['output']>;
  /** balance of quote token in mining */
  quoteInMine?: Maybe<Scalars['BigNumber']['output']>;
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token id */
  quoteToken?: Maybe<Scalars['String']['output']>;
  /** value */
  valueUSD?: Maybe<Scalars['BigNumber']['output']>;
};

export type UserprofileMerkle = {
  amout?: Maybe<Scalars['String']['output']>;
  index?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  user?: Maybe<Scalars['String']['output']>;
};

export type UserprofileMining = {
  /** apy */
  baseApy?: Maybe<Scalars['String']['output']>;
  /** base balance */
  baseBalance?: Maybe<Scalars['BigNumber']['output']>;
  /** base symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** base Token id */
  baseToken?: Maybe<Scalars['String']['output']>;
  /** LpToken */
  lpToken?: Maybe<Scalars['String']['output']>;
  /** mining Pool */
  miningPool?: Maybe<Scalars['String']['output']>;
  /** pair */
  pair?: Maybe<Scalars['String']['output']>;
  /** apy */
  quoteApy?: Maybe<Scalars['String']['output']>;
  /** quote balance */
  quoteBalance?: Maybe<Scalars['BigNumber']['output']>;
  /** quoteSymbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** quote token id */
  quoteToken?: Maybe<Scalars['String']['output']>;
  /** value */
  valueUSD?: Maybe<Scalars['BigNumber']['output']>;
  /** version */
  version?: Maybe<Scalars['String']['output']>;
};

export type UserprofileNftAssets = {
  nft_assets?: Maybe<Scalars['String']['output']>;
};

export type UserprofileNftAssetsFilter = {
  chain: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user: Scalars['String']['input'];
};

export type UserprofileReward = {
  bsc_trade_mining_period?: Maybe<Scalars['String']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  locking?: Maybe<Scalars['String']['output']>;
  main_color?: Maybe<Scalars['String']['output']>;
  merkle?: Maybe<UserprofileMerkle>;
  name_key?: Maybe<Scalars['String']['output']>;
  rule_key?: Maybe<Scalars['String']['output']>;
  token_address?: Maybe<Scalars['String']['output']>;
  token_symbol?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type UserprofileReward_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  user: Scalars['String']['input'];
};

export type UserprofileUserInvite = {
  timestamp?: Maybe<Scalars['Int']['output']>;
};

export type UserprofileUserInviteFilter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  /** invite user */
  invited_by: Scalars['String']['input'];
  /** sign message */
  message: Scalars['String']['input'];
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** wallet signature */
  sign: Scalars['String']['input'];
  /** sign timestamp */
  timestamp: Scalars['String']['input'];
  /** user address */
  user: Scalars['String']['input'];
};

export type UserprofileUserPrivatePool = {
  /** base token address */
  baseAddress?: Maybe<Scalars['String']['output']>;
  /** base reserve */
  baseReserve?: Maybe<Scalars['String']['output']>;
  /** base token symbol */
  baseSymbol?: Maybe<Scalars['String']['output']>;
  /** created timestamp */
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  /** pair creator */
  creator?: Maybe<Scalars['String']['output']>;
  /** total fee */
  fee?: Maybe<Scalars['String']['output']>;
  /** network */
  network?: Maybe<Scalars['String']['output']>;
  /** Pair Address */
  pairAddress?: Maybe<Scalars['String']['output']>;
  /** md5(chain+pairf address) */
  pk?: Maybe<Scalars['String']['output']>;
  /** pool type in:DPPVIRTUALDSPCLASSICALDVM */
  poolType?: Maybe<Scalars['String']['output']>;
  /** quote token address */
  quoteAddress?: Maybe<Scalars['String']['output']>;
  /** quote reserve */
  quoteReserve?: Maybe<Scalars['String']['output']>;
  /** quote token symbol */
  quoteSymbol?: Maybe<Scalars['String']['output']>;
  /** fee near 24h unit:usd */
  totalFee?: Maybe<Scalars['String']['output']>;
  /** total volume */
  totalVolume?: Maybe<Scalars['String']['output']>;
  /** turnover near 24h */
  turnover?: Maybe<Scalars['String']['output']>;
  /** tvl unit:usd */
  tvl?: Maybe<Scalars['String']['output']>;
  /** volume near 24h unit:usd */
  volume?: Maybe<Scalars['String']['output']>;
};

export type UserprofileUserPrivatePoolListInfo = {
  chain?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<UserprofileUserPrivatePool>>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

/** Total balances in dodoex */
export type UserprofileUserProfile = {
  /** vdodo details */
  VDODO?: Maybe<UserprofileVdodo>;
  /** crowdpooling position */
  crowdPools?: Maybe<Array<Maybe<UserprofileCrowdPooling>>>;
  /** user address */
  id?: Maybe<Scalars['String']['output']>;
  /** liquidity position */
  liquidityPools?: Maybe<Array<Maybe<UserprofileLiquidity>>>;
  /** mining position */
  miningPools?: Maybe<Array<Maybe<UserprofileMining>>>;
  /** total value in dodoex in USD */
  totalValue?: Maybe<Scalars['BigNumber']['output']>;
  /** value in crowdpooling */
  valueInCrowdPooling?: Maybe<Scalars['BigNumber']['output']>;
  /** value in liquidity */
  valueInLiquidity?: Maybe<Scalars['BigNumber']['output']>;
  /** value in mining */
  valueInMining?: Maybe<Scalars['BigNumber']['output']>;
  /** value in VDODO */
  valueInVDODO?: Maybe<Scalars['BigNumber']['output']>;
};

export type UserprofileVdodo = {
  /** apy */
  apy?: Maybe<Scalars['BigNumber']['output']>;
  /** balance of vDODO */
  balance?: Maybe<Scalars['BigNumber']['output']>;
  /** value */
  valueUSD?: Maybe<Scalars['BigNumber']['output']>;
};

export type Userprofileprivate_Pools_List_Filter = {
  /** network */
  chain: Scalars['String']['input'];
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  /** user address */
  user: Scalars['String']['input'];
};

export type Vault = {
  /** _D3_FACTORY_ */
  d3Factory: Scalars['Bytes']['output'];
  /** _D3TOKEN_LOGIC_ */
  d3TokenLogic: Scalars['Bytes']['output'];
  /** D3Vault */
  id: Scalars['ID']['output'];
  /** IM */
  im: Scalars['BigInt']['output'];
  /** _MAINTAINER_ */
  maintainer: Scalars['Bytes']['output'];
  /** MM */
  mm: Scalars['BigInt']['output'];
  /** _ORACLE_ */
  oracle: Scalars['Bytes']['output'];
  /** _PENDING_REMOVE_POOL_ */
  pendingRemovePool: Scalars['Bytes']['output'];
  /** _POOL_QUOTA_ */
  poolQuota: Scalars['Bytes']['output'];
  /** _RATE_MANAGER_ */
  rateManager: Scalars['Bytes']['output'];
  tokenList: Array<Token>;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** _USER_QUOTA_ */
  userQuota: Scalars['Bytes']['output'];
  vaultAssetInfos: Array<VaultAssetInfo>;
};

export type VaultTokenListArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export type VaultVaultAssetInfosArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultAssetInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultAssetInfo_Filter>;
};

export type VaultAssetInfo = {
  accrualTime: Scalars['BigInt']['output'];
  balance: Scalars['BigInt']['output'];
  borrowIndex: Scalars['BigInt']['output'];
  borrowRate: Scalars['BigInt']['output'];
  collateralWeight: Scalars['BigInt']['output'];
  debtWeight: Scalars['BigInt']['output'];
  /** D3Vault getExchangeRate */
  exchangeRate?: Maybe<Scalars['BigInt']['output']>;
  /**  vault id-token id  */
  id: Scalars['ID']['output'];
  /** dToken */
  lpToken?: Maybe<Token>;
  maxCollateralAmount: Scalars['BigInt']['output'];
  maxDepositAmount: Scalars['BigInt']['output'];
  reserveFactor: Scalars['BigInt']['output'];
  /** originToken */
  token: Token;
  tokenOraclePrice: Scalars['BigInt']['output'];
  tokenOraclePriceUSD: Scalars['BigDecimal']['output'];
  totalBorrows: Scalars['BigInt']['output'];
  totalInterest: Scalars['BigInt']['output'];
  totalInterestUSD: Scalars['BigDecimal']['output'];
  totalReserves: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** belong vault */
  vault: Vault;
  withdrawnReserves: Scalars['BigInt']['output'];
};

export type VaultAssetInfoDayData = {
  accruedInterest: Scalars['BigInt']['output'];
  accruedInterestUSD: Scalars['BigDecimal']['output'];
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /**  vault id-token id- day id */
  id: Scalars['ID']['output'];
  poolBorrowAmount: Scalars['BigInt']['output'];
  poolRepayAmount: Scalars['BigInt']['output'];
  tokenOraclePrice: Scalars['BigInt']['output'];
  tokenOraclePriceUSD: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  userDepositAmount: Scalars['BigInt']['output'];
  userWithdrawAmount: Scalars['BigInt']['output'];
  /** belong vault */
  vault: Vault;
  /** belong VaultAssetInfo */
  vaultAssetInfo: VaultAssetInfo;
};

export type VaultAssetInfoDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accruedInterest?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterestUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accruedInterestUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  accruedInterestUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accruedInterest_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accruedInterest_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_not?: InputMaybe<Scalars['BigInt']['input']>;
  accruedInterest_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  poolBorrowAmount?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolBorrowAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolBorrowAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolRepayAmount?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolRepayAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolRepayAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  tokenOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userDepositAmount?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userDepositAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  userDepositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userWithdrawAmount?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userWithdrawAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  userWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_?: InputMaybe<VaultAssetInfo_Filter>;
  vaultAssetInfo_contains?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_gt?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_gte?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfo_lt?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_lte?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_contains?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  vaultAssetInfo_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultAssetInfo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type VaultAssetInfoDayData_OrderBy =
  | 'accruedInterest'
  | 'accruedInterestUSD'
  | 'date'
  | 'id'
  | 'poolBorrowAmount'
  | 'poolRepayAmount'
  | 'tokenOraclePrice'
  | 'tokenOraclePriceUSD'
  | 'updatedAt'
  | 'userDepositAmount'
  | 'userWithdrawAmount'
  | 'vault'
  | 'vaultAssetInfo';

export type VaultAssetInfoHistory = {
  accrualTime: Scalars['BigInt']['output'];
  balance: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  borrowIndex: Scalars['BigInt']['output'];
  borrowRate: Scalars['BigInt']['output'];
  collateralWeight: Scalars['BigInt']['output'];
  debtWeight: Scalars['BigInt']['output'];
  eventType: Scalars['String']['output'];
  /** D3Vault getExchangeRate */
  exchangeRate?: Maybe<Scalars['BigInt']['output']>;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }-{ VaultAssetInfo id } */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /** dToken */
  lpToken?: Maybe<Token>;
  maxCollateralAmount: Scalars['BigInt']['output'];
  maxDepositAmount: Scalars['BigInt']['output'];
  reserveFactor: Scalars['BigInt']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /** originToken */
  token: Token;
  tokenOraclePrice: Scalars['BigInt']['output'];
  tokenOraclePriceUSD: Scalars['BigDecimal']['output'];
  totalBorrows: Scalars['BigInt']['output'];
  totalReserves: Scalars['BigInt']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** belong vault */
  vault: Vault;
  withdrawnReserves: Scalars['BigInt']['output'];
};

export type VaultAssetInfoHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accrualTime?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accrualTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRate?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralWeight?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralWeight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debtWeight?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debtWeight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_not?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  eventType_contains?: InputMaybe<Scalars['String']['input']>;
  eventType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_ends_with?: InputMaybe<Scalars['String']['input']>;
  eventType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_gt?: InputMaybe<Scalars['String']['input']>;
  eventType_gte?: InputMaybe<Scalars['String']['input']>;
  eventType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  eventType_lt?: InputMaybe<Scalars['String']['input']>;
  eventType_lte?: InputMaybe<Scalars['String']['input']>;
  eventType_not?: InputMaybe<Scalars['String']['input']>;
  eventType_not_contains?: InputMaybe<Scalars['String']['input']>;
  eventType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  eventType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  eventType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  eventType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  eventType_starts_with?: InputMaybe<Scalars['String']['input']>;
  eventType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_?: InputMaybe<Token_Filter>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  maxCollateralAmount?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxCollateralAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositAmount?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveFactor?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  tokenOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalReserves?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalReserves_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawnReserves?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnReserves_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type VaultAssetInfoHistory_OrderBy =
  | 'accrualTime'
  | 'balance'
  | 'blockNumber'
  | 'borrowIndex'
  | 'borrowRate'
  | 'collateralWeight'
  | 'debtWeight'
  | 'eventType'
  | 'exchangeRate'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'lpToken'
  | 'maxCollateralAmount'
  | 'maxDepositAmount'
  | 'reserveFactor'
  | 'timestamp'
  | 'token'
  | 'tokenOraclePrice'
  | 'tokenOraclePriceUSD'
  | 'totalBorrows'
  | 'totalReserves'
  | 'updatedAt'
  | 'vault'
  | 'withdrawnReserves';

export type VaultAssetInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accrualTime?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accrualTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  accrualTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRate?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  borrowRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  borrowRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralWeight?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralWeight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralWeight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debtWeight?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debtWeight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_not?: InputMaybe<Scalars['BigInt']['input']>;
  debtWeight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lpToken?: InputMaybe<Scalars['String']['input']>;
  lpToken_?: InputMaybe<Token_Filter>;
  lpToken_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_gt?: InputMaybe<Scalars['String']['input']>;
  lpToken_gte?: InputMaybe<Scalars['String']['input']>;
  lpToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_lt?: InputMaybe<Scalars['String']['input']>;
  lpToken_lte?: InputMaybe<Scalars['String']['input']>;
  lpToken_not?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lpToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  lpToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  maxCollateralAmount?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxCollateralAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxCollateralAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositAmount?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveFactor?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserveFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  reserveFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenOraclePrice?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenOraclePriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenOraclePriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  tokenOraclePrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenOraclePrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenOraclePrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBorrows?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBorrows_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBorrows_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalInterest?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterestUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalInterestUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalInterestUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalInterest_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterest_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterest_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalInterest_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterest_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterest_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalInterest_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalReserves?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalReserves_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalReserves_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawnReserves?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnReserves_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnReserves_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type VaultAssetInfo_OrderBy =
  | 'accrualTime'
  | 'balance'
  | 'borrowIndex'
  | 'borrowRate'
  | 'collateralWeight'
  | 'debtWeight'
  | 'exchangeRate'
  | 'id'
  | 'lpToken'
  | 'maxCollateralAmount'
  | 'maxDepositAmount'
  | 'reserveFactor'
  | 'token'
  | 'tokenOraclePrice'
  | 'tokenOraclePriceUSD'
  | 'totalBorrows'
  | 'totalInterest'
  | 'totalInterestUSD'
  | 'totalReserves'
  | 'updatedAt'
  | 'vault'
  | 'withdrawnReserves';

export type VaultDayData = {
  /** Accumulated interest USD */
  accInterestUSD: Scalars['BigDecimal']['output'];
  /** uinx timestamp(start of day) */
  date: Scalars['Int']['output'];
  /** D3Vault - day id */
  id: Scalars['ID']['output'];
  totalBalanceUSD: Scalars['BigDecimal']['output'];
  totalBorrowsUSD: Scalars['BigDecimal']['output'];
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** Vault */
  vault?: Maybe<Vault>;
};

export type VaultDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accInterestUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  accInterestUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  accInterestUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  totalBalanceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBorrowsUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBorrowsUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBorrowsUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type VaultDayData_OrderBy =
  | 'accInterestUSD'
  | 'date'
  | 'id'
  | 'totalBalanceUSD'
  | 'totalBorrowsUSD'
  | 'updatedAt'
  | 'vault';

export type VaultNft = {
  chain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type VaultNft_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type VaultNft_OrderBy = 'chain' | 'id';

export type Vault_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  d3Factory?: InputMaybe<Scalars['Bytes']['input']>;
  d3Factory_contains?: InputMaybe<Scalars['Bytes']['input']>;
  d3Factory_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  d3Factory_not?: InputMaybe<Scalars['Bytes']['input']>;
  d3Factory_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  d3Factory_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  d3TokenLogic?: InputMaybe<Scalars['Bytes']['input']>;
  d3TokenLogic_contains?: InputMaybe<Scalars['Bytes']['input']>;
  d3TokenLogic_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  d3TokenLogic_not?: InputMaybe<Scalars['Bytes']['input']>;
  d3TokenLogic_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  d3TokenLogic_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  im?: InputMaybe<Scalars['BigInt']['input']>;
  im_gt?: InputMaybe<Scalars['BigInt']['input']>;
  im_gte?: InputMaybe<Scalars['BigInt']['input']>;
  im_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  im_lt?: InputMaybe<Scalars['BigInt']['input']>;
  im_lte?: InputMaybe<Scalars['BigInt']['input']>;
  im_not?: InputMaybe<Scalars['BigInt']['input']>;
  im_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maintainer?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maintainer_not?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maintainer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  mm?: InputMaybe<Scalars['BigInt']['input']>;
  mm_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mm_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mm_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mm_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mm_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mm_not?: InputMaybe<Scalars['BigInt']['input']>;
  mm_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  oracle?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_contains?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  oracle_not?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  oracle_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pendingRemovePool?: InputMaybe<Scalars['Bytes']['input']>;
  pendingRemovePool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pendingRemovePool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pendingRemovePool_not?: InputMaybe<Scalars['Bytes']['input']>;
  pendingRemovePool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pendingRemovePool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolQuota?: InputMaybe<Scalars['Bytes']['input']>;
  poolQuota_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolQuota_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolQuota_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolQuota_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolQuota_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rateManager?: InputMaybe<Scalars['Bytes']['input']>;
  rateManager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rateManager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rateManager_not?: InputMaybe<Scalars['Bytes']['input']>;
  rateManager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rateManager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenList?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenList_?: InputMaybe<Token_Filter>;
  tokenList_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenList_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenList_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenList_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenList_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userQuota?: InputMaybe<Scalars['Bytes']['input']>;
  userQuota_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userQuota_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userQuota_not?: InputMaybe<Scalars['Bytes']['input']>;
  userQuota_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userQuota_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  vaultAssetInfos?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfos_?: InputMaybe<VaultAssetInfo_Filter>;
  vaultAssetInfos_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfos_contains_nocase?: InputMaybe<
    Array<Scalars['String']['input']>
  >;
  vaultAssetInfos_not?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfos_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultAssetInfos_not_contains_nocase?: InputMaybe<
    Array<Scalars['String']['input']>
  >;
};

export type Vault_OrderBy =
  | 'd3Factory'
  | 'd3TokenLogic'
  | 'id'
  | 'im'
  | 'maintainer'
  | 'mm'
  | 'oracle'
  | 'pendingRemovePool'
  | 'poolQuota'
  | 'rateManager'
  | 'tokenList'
  | 'updatedAt'
  | 'userQuota'
  | 'vaultAssetInfos';

export type VdodoChainsInput = {
  chains: Array<Scalars['Int']['input']>;
};

export type VdodoStatsResult = {
  /** 最近24小时平台手续费收入 */
  mtNear24hFees: Scalars['String']['output'];
  /** 平台总手续费收入 */
  mtTotalFees: Scalars['String']['output'];
};

/** DIP-3 提议重新分配交易手续费，将此前 100% 交易手续费给 LP，更改为 80% 手续费给 LP，剩余 20% 手续费将用于两部分，一部分用于回购DODO并分发给vDODO持有者（分红），另一部分建立社区金库。 */
export type VdodoVdodoServiceChargesResult = {
  dip3_fees_24h: Scalars['String']['output'];
  /** 20%用做分红和金库的部分 */
  dip3_fees_total: Scalars['String']['output'];
  pool_fees_24h: Scalars['String']['output'];
  /** 80%分给LP的部分 */
  pool_fees_total: Scalars['String']['output'];
};

export type WithdrawFundHistory = {
  chain: Scalars['String']['output'];
  /** id hash-logindex */
  id: Scalars['ID']['output'];
};

export type WithdrawFundHistory_Filter = {
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
};

export type WithdrawFundHistory_OrderBy = 'chain' | 'id';

export type WithdrawReserve = {
  amount: Scalars['BigInt']['output'];
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  token: Token;
  /** updatedAt */
  updatedAt: Scalars['BigInt']['output'];
  /** belong vault */
  vault: Vault;
};

export type WithdrawReserve_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type WithdrawReserve_OrderBy =
  | 'amount'
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'timestamp'
  | 'token'
  | 'updatedAt'
  | 'vault';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type VDodo = {
  /** burn dodo amount */
  burnAmount: Scalars['BigDecimal']['output'];
  chain: Scalars['String']['output'];
  /** decimals */
  decimals: Scalars['BigInt']['output'];
  /** dodo address */
  dodo: Scalars['Bytes']['output'];
  /** dodo balance of vdodo contract */
  dodoBalance: Scalars['BigDecimal']['output'];
  /** dodo per block */
  dodoPerBlock: Scalars['BigDecimal']['output'];
  /** fee dodo amount */
  feeAmount: Scalars['BigDecimal']['output'];
  /** address */
  id: Scalars['ID']['output'];
  /** mint dodo amount */
  mintAmount: Scalars['BigDecimal']['output'];
  /** name */
  name: Scalars['String']['output'];
  /** redeem dodo amount */
  redeemAmount: Scalars['BigDecimal']['output'];
  /** symbol */
  symbol: Scalars['String']['output'];
  /** total block distribution */
  totalBlockDistribution: Scalars['BigDecimal']['output'];
  /** total block reward */
  totalBlockReward: Scalars['BigDecimal']['output'];
  /** donate */
  totalDonate: Scalars['BigDecimal']['output'];
  /** total staking power */
  totalStakingPower: Scalars['BigInt']['output'];
  /** participated user count */
  totalUsers: Scalars['BigInt']['output'];
};

export type VDodo_Filter = {
  burnAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  burnAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  burnAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dodo?: InputMaybe<Scalars['Bytes']['input']>;
  dodoBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dodoBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dodoPerBlock?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dodoPerBlock_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dodoPerBlock_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dodo_contains?: InputMaybe<Scalars['Bytes']['input']>;
  dodo_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dodo_not?: InputMaybe<Scalars['Bytes']['input']>;
  dodo_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  dodo_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  mintAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mintAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  mintAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  redeemAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  redeemAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  redeemAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  refreshNow?: InputMaybe<Scalars['Boolean']['input']>;
  /** dodoex,vdodo,mine,token,nft,eip721,eip1155 */
  schemaName?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  totalBlockDistribution?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBlockDistribution_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockDistribution_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  totalBlockReward?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBlockReward_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBlockReward_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDonate?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDonate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDonate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalStakingPower?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakingPower_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakingPower_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUsers?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUsers_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUsers_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type VDodo_OrderBy =
  | 'burnAmount'
  | 'chain'
  | 'decimals'
  | 'dodo'
  | 'dodoBalance'
  | 'dodoPerBlock'
  | 'feeAmount'
  | 'id'
  | 'mintAmount'
  | 'name'
  | 'redeemAmount'
  | 'symbol'
  | 'totalBlockDistribution'
  | 'totalBlockReward'
  | 'totalDonate'
  | 'totalStakingPower'
  | 'totalUsers';

export type FetchErc20SwapCrossChainListQueryVariables = Exact<{
  where?: InputMaybe<Erc20listV2Filter>;
}>;

export type FetchErc20SwapCrossChainListQuery = {
  erc20_swapCrossChainList?: Array<{
    name?: string | null;
    address?: string | null;
    symbol?: string | null;
    decimals?: number | null;
    slippage?: string | null;
    chainId?: number | null;
    logoImg?: string | null;
    tokenlists?: Array<{
      name?: string | null;
      status?: string | null;
    } | null> | null;
    domains?: Array<{ name?: string | null } | null> | null;
    funcLabels?: Array<{ key?: string | null } | null> | null;
    attributeLabels?: Array<{ key?: string | null } | null> | null;
  } | null> | null;
};

export type FetchErc20ForecastSlippageQueryVariables = Exact<{
  where?: InputMaybe<Erc20_Extenderc20ExtendV2Filter>;
}>;

export type FetchErc20ForecastSlippageQuery = {
  erc20_extend_erc20ExtendV2?: {
    forecastSlippageList?: Array<{
      forecastSlippage?: any | null;
      forecastValue?: any | null;
      confidenceRatio?: any | null;
      confidenceIntervalUpper?: any | null;
      confidenceIntervalLower?: any | null;
    } | null> | null;
  } | null;
};

export type TicksQueryVariables = Exact<{
  where?: InputMaybe<Tick_Filter>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;

export type TicksQuery = {
  ticks: Array<{
    id: string;
    poolAddress?: string | null;
    tickIdx: any;
    liquidityNet: any;
    price0: any;
    price1: any;
  }>;
};

export type FetchMiningListQueryVariables = Exact<{
  where?: InputMaybe<Miningmining_List_Filter>;
}>;

export type FetchMiningListQuery = {
  mining_list?: {
    totalCount?: number | null;
    chains?: Array<string | null> | null;
    list?: Array<{
      chainId: number;
      type?: string | null;
      version?: string | null;
      address?: string | null;
      baseApy?: string | null;
      endBlock?: string | null;
      miningContractAddress?: string | null;
      miningTotalDollar?: string | null;
      baseLpTokenMining?: string | null;
      quoteLpTokenMining?: string | null;
      quoteApy?: string | null;
      startBlock?: string | null;
      title?: string | null;
      platform?: string | null;
      startTime?: string | null;
      endTime?: string | null;
      baseLpToken?: {
        decimals?: number | null;
        symbol?: string | null;
        address?: string | null;
      } | null;
      baseToken?: {
        decimals?: number | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
        address?: string | null;
      } | null;
      quoteLpToken?: {
        decimals?: number | null;
        symbol?: string | null;
        address?: string | null;
      } | null;
      quoteToken?: {
        decimals?: number | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
        address?: string | null;
      } | null;
      rewardTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
        address?: string | null;
      } | null> | null;
      rewardQuoteTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
        address?: string | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type MiningListQueryVariables = Exact<{
  where?: InputMaybe<Miningmining_List_Filter>;
}>;

export type MiningListQuery = {
  mining_list?: {
    totalCount?: number | null;
    chains?: Array<string | null> | null;
    list?: Array<{
      chainId: number;
      type?: string | null;
      version?: string | null;
      address?: string | null;
      isGSP?: boolean | null;
      isNewERCMineV3?: boolean | null;
      baseApy?: string | null;
      endBlock?: string | null;
      miningContractAddress?: string | null;
      miningTotalDollar?: string | null;
      baseLpTokenMining?: string | null;
      quoteLpTokenMining?: string | null;
      quoteApy?: string | null;
      startBlock?: string | null;
      title?: string | null;
      platform?: string | null;
      blockNumber?: string | null;
      startTime?: string | null;
      endTime?: string | null;
      baseLpToken?: {
        decimals?: number | null;
        id?: string | null;
        symbol?: string | null;
      } | null;
      baseToken?: {
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
      } | null;
      quoteLpToken?: {
        decimals?: number | null;
        id?: string | null;
        symbol?: string | null;
      } | null;
      quoteToken?: {
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
      } | null;
      rewardTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
      } | null> | null;
      rewardQuoteTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type MyCreatedMiningListQueryVariables = Exact<{
  where?: InputMaybe<Miningmining_List_Filter>;
}>;

export type MyCreatedMiningListQuery = {
  mining_list?: {
    totalCount?: number | null;
    chains?: Array<string | null> | null;
    list?: Array<{
      chainId: number;
      type?: string | null;
      version?: string | null;
      address?: string | null;
      isGSP?: boolean | null;
      isNewERCMineV3?: boolean | null;
      baseApy?: string | null;
      endBlock?: string | null;
      miningContractAddress?: string | null;
      baseLpTokenMining?: string | null;
      quoteLpTokenMining?: string | null;
      quoteApy?: string | null;
      startBlock?: string | null;
      title?: string | null;
      platform?: string | null;
      blockNumber?: string | null;
      participantsNum?: number | null;
      startTime?: string | null;
      endTime?: string | null;
      baseLpToken?: {
        decimals?: number | null;
        id?: string | null;
        symbol?: string | null;
      } | null;
      baseToken?: {
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
      } | null;
      quoteLpToken?: {
        decimals?: number | null;
        id?: string | null;
        symbol?: string | null;
      } | null;
      quoteToken?: {
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        symbol?: string | null;
        logoImg?: string | null;
      } | null;
      rewardTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
      } | null> | null;
      rewardQuoteTokenInfos?: Array<{
        apy?: string | null;
        decimals?: number | null;
        id?: string | null;
        price?: string | null;
        logoImg?: string | null;
        rewardNumIndex?: number | null;
        rewardPerBlock?: string | null;
        startBlock?: string | null;
        endBlock?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        symbol?: string | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type FetchPoolListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pair_Filter>;
  orderBy?: InputMaybe<Pair_OrderBy>;
}>;

export type FetchPoolListQuery = {
  pairs: Array<{
    id: string;
    type: string;
    creator: any;
    owner?: any | null;
    lpFeeRate: any;
    i?: any | null;
    k?: any | null;
    baseReserve: any;
    quoteReserve: any;
    lastTradePrice: any;
    feeBase: any;
    feeQuote: any;
    baseToken: { id: string; symbol: string; name: string; decimals: any };
    quoteToken: { id: string; symbol: string; name: string; decimals: any };
    baseLpToken?: { id: string; decimals: any } | null;
    quoteLpToken?: { id: string; decimals: any } | null;
  }>;
};

export type FetchLiquidityListQueryVariables = Exact<{
  where?: InputMaybe<Liquiditylist_Filter>;
}>;

export type FetchLiquidityListQuery = {
  liquidity_list?: {
    currentPage?: number | null;
    pageSize?: number | null;
    totalCount?: number | null;
    lqList?: Array<{
      id?: string | null;
      pair?: {
        id: string;
        chainId: number;
        type: string;
        lpFeeRate: any;
        mtFeeRate: any;
        creator: any;
        tvl?: any | null;
        miningAddress?: Array<string | null> | null;
        volume24H?: any | null;
        baseLpToken?: { id: string; decimals: any } | null;
        quoteLpToken?: { id: string; decimals: any } | null;
        baseToken: {
          id: string;
          symbol: string;
          name: string;
          decimals: any;
          logoImg?: string | null;
        };
        quoteToken: {
          id: string;
          symbol: string;
          name: string;
          decimals: any;
          logoImg?: string | null;
        };
        apy?: {
          miningBaseApy?: any | null;
          miningQuoteApy?: any | null;
          transactionBaseApy?: any | null;
          transactionQuoteApy?: any | null;
          metromMiningApy?: any | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};

export type FetchMyLiquidityListQueryVariables = Exact<{
  where?: InputMaybe<Liquiditylist_Filter>;
}>;

export type FetchMyLiquidityListQuery = {
  liquidity_list?: {
    lqList?: Array<{
      id?: string | null;
      liquidityPositions?: Array<{
        id?: string | null;
        liquidityTokenBalance?: string | null;
        liquidityTokenInMining?: string | null;
        poolShare?: string | null;
        liquidityUSD?: string | null;
        tokenId?: string | null;
        outOfRange?: boolean | null;
        priceRange?: {
          token0LowerPrice: string;
          token0UpperPrice: string;
          token1LowerPrice: string;
          token1UpperPrice: string;
        } | null;
        tickLower?: {
          id: string;
          tickIdx: any;
          liquidityGross: any;
          liquidityNet: any;
          price0: any;
          price1: any;
        } | null;
        tickUpper?: {
          id: string;
          tickIdx: any;
          liquidityGross: any;
          liquidityNet: any;
          price0: any;
          price1: any;
        } | null;
      } | null> | null;
      pair?: {
        id: string;
        chainId: number;
        type: string;
        lpFeeRate: any;
        mtFeeRate: any;
        creator: any;
        tvl?: any | null;
        miningAddress?: Array<string | null> | null;
        volume24H?: any | null;
        baseLpToken?: { id: string; decimals: any } | null;
        quoteLpToken?: { id: string; decimals: any } | null;
        baseToken: {
          id: string;
          symbol: string;
          name: string;
          decimals: any;
          logoImg?: string | null;
        };
        quoteToken: {
          id: string;
          symbol: string;
          name: string;
          decimals: any;
          logoImg?: string | null;
        };
        apy?: {
          miningBaseApy?: any | null;
          miningQuoteApy?: any | null;
          transactionBaseApy?: any | null;
          transactionQuoteApy?: any | null;
          metromMiningApy?: any | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};

export type FetchDashboardPairListQueryVariables = Exact<{
  where?: InputMaybe<Dashboardtype_List_Filter>;
}>;

export type FetchDashboardPairListQuery = {
  dashboard_pairs_list?: {
    list?: Array<{
      chainId?: number | null;
      pairAddress?: string | null;
      poolType?: string | null;
      baseReserve?: string | null;
      quoteReserve?: string | null;
      totalFee?: string | null;
      baseAddress?: string | null;
      quoteAddress?: string | null;
      baseSymbol?: string | null;
      quoteSymbol?: string | null;
      tvl?: string | null;
      baseTvl?: string | null;
      quoteTvl?: string | null;
      baseTvlRate?: string | null;
      quoteTvlRate?: string | null;
    } | null> | null;
  } | null;
};

export type FetchPoolQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  where?: InputMaybe<Pair_Filter>;
  liquidityWhere?: InputMaybe<Liquiditylist_Filter>;
}>;

export type FetchPoolQuery = {
  pair?: {
    id: string;
    type: string;
    creator: any;
    owner?: any | null;
    traderCount: any;
    volumeBaseToken: any;
    volumeQuoteToken: any;
    volumeUSD: any;
    feeBase: any;
    feeQuote: any;
    mtFeeRate: any;
    lpFeeRate: any;
    i?: any | null;
    k?: any | null;
    baseReserve: any;
    quoteReserve: any;
    createdAtTimestamp: any;
    lastTradePrice: any;
    baseToken: { id: string; symbol: string; name: string; decimals: any };
    quoteToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
      usdPrice: any;
    };
    baseLpToken?: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
    } | null;
    quoteLpToken?: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
    } | null;
  } | null;
  liquidity_list?: {
    lqList?: Array<{
      pair?: {
        miningAddress?: Array<string | null> | null;
        apy?: {
          miningBaseApy?: any | null;
          miningQuoteApy?: any | null;
          transactionBaseApy?: any | null;
          transactionQuoteApy?: any | null;
          metromMiningApy?: any | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};

export type FetchPoolDayDataQueryVariables = Exact<{
  where?: InputMaybe<Dashboardday_Filter>;
}>;

export type FetchPoolDayDataQuery = {
  dashboard_pairs_day_data?: Array<{
    timestamp?: number | null;
    date?: string | null;
    volumeUsd?: string | null;
    feeUsd?: string | null;
    mtFeeUsd?: string | null;
    tvlUsd?: string | null;
    addresses?: string | null;
  } | null> | null;
};

export type FetchPoolDashboardQueryVariables = Exact<{
  where?: InputMaybe<Dashboardpair_Detail_Filter>;
}>;

export type FetchPoolDashboardQuery = {
  dashboard_pairs_detail?: {
    fee?: string | null;
    volume?: string | null;
    totalFee?: string | null;
    totalMtFee?: string | null;
    totalVolume?: string | null;
    tvl?: string | null;
    turnover?: string | null;
    liquidity?: string | null;
    baseReserve?: string | null;
    quoteReserve?: string | null;
    baseVolume?: string | null;
    quoteVolume?: string | null;
    basePrice?: string | null;
    quotePrice?: string | null;
    price?: string | null;
    baseFee?: string | null;
    quoteFee?: string | null;
    baseMtFee?: string | null;
    quoteMtFee?: string | null;
    pair?: string | null;
    poolType?: string | null;
    baseVolumeCumulative?: string | null;
    quoteVolumeCumulative?: string | null;
    baseAddress?: string | null;
    baseSymbol?: string | null;
    quoteAddress?: string | null;
    quoteSymbol?: string | null;
    network?: string | null;
    pairAddress?: string | null;
    txes?: number | null;
    txesNear24h?: number | null;
    txUsers?: number | null;
    txUserNear24h?: number | null;
    mtFeeNear24h?: string | null;
    feeNear24h?: string | null;
  } | null;
};

export type FetchPoolSwapListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type FetchPoolSwapListQuery = {
  swaps: Array<{
    id: string;
    timestamp: any;
    from: any;
    baseVolume: any;
    quoteVolume: any;
    feeBase: any;
    feeQuote: any;
    amountIn: any;
    amountOut: any;
    fromToken: { id: string; symbol: string; name: string; decimals: any };
    toToken: { id: string; symbol: string; name: string; decimals: any };
  }>;
};

export type FetchLiquidityPositionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPosition_Filter>;
  miningWhere?: InputMaybe<LiquidityPosition_Filter>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type FetchLiquidityPositionsQuery = {
  balance: Array<{ id: string; liquidityTokenBalance: any }>;
  mining: Array<{ id: string; liquidityTokenInMining: any }>;
  pair?: {
    lastTradePrice: any;
    baseLpToken?: { id: string; decimals: any } | null;
    quoteLpToken?: { id: string; decimals: any } | null;
    baseToken: { id: string; symbol: string; name: string; decimals: any };
    quoteToken: { id: string; symbol: string; name: string; decimals: any };
  } | null;
};

export type FetchPoolPairListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  baseWhere?: InputMaybe<Pair_Filter>;
  quoteWhere?: InputMaybe<Pair_Filter>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type FetchPoolPairListQuery = {
  basePairs: Array<{
    id: string;
    type: string;
    creator: any;
    lpFeeRate: any;
    i?: any | null;
    k?: any | null;
    baseReserve: any;
    quoteReserve: any;
    createdAtTimestamp: any;
    lastTradePrice: any;
    volumeUSD: any;
    baseToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
      usdPrice: any;
    };
    quoteToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
      usdPrice: any;
    };
  }>;
  quotePairs: Array<{
    id: string;
    type: string;
    creator: any;
    lpFeeRate: any;
    i?: any | null;
    k?: any | null;
    baseReserve: any;
    quoteReserve: any;
    createdAtTimestamp: any;
    lastTradePrice: any;
    volumeUSD: any;
    baseToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
      usdPrice: any;
    };
    quoteToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: any;
      usdPrice: any;
    };
  }>;
};

export type FetchUserSwapOrderHistoriesQueryVariables = Exact<{
  where?: InputMaybe<User_SwapswapFilter>;
}>;

export type FetchUserSwapOrderHistoriesQuery = {
  user_swap_orderHistories?: {
    count?: number | null;
    page?: number | null;
    list?: Array<{
      chainId?: number | null;
      createdAt?: string | null;
      fromAmount?: string | null;
      fromTokenDecimals?: number | null;
      fromTokenPrice?: string | null;
      fromTokenSymbol?: string | null;
      fromTokenAddress?: string | null;
      fromTokenLogoImg?: string | null;
      hash?: string | null;
      status?: string | null;
      toAmount?: string | null;
      toTokenDecimals?: number | null;
      toTokenPrice?: string | null;
      toTokenSymbol?: string | null;
      toTokenAddress?: string | null;
      toTokenLogoImg?: string | null;
      minAmount?: string | null;
      nonce?: number | null;
      extra?: any | null;
      user?: string | null;
    } | null> | null;
  } | null;
};

export type FetchNoticeCenterTransactionListQueryVariables = Exact<{
  where?: InputMaybe<Notice_CentertransactionListFilter>;
}>;

export type FetchNoticeCenterTransactionListQuery = {
  notice_center_transactionList?: {
    count?: number | null;
    limit?: number | null;
    page?: number | null;
    list?: Array<{
      chainId?: number | null;
      createTime?: string | null;
      extend?: any | null;
      from?: string | null;
      id?: number | null;
      key?: string | null;
      type?: string | null;
    } | null> | null;
  } | null;
};

export type FetchLiquidityLpPartnerRewardsQueryVariables = Exact<{
  where?: InputMaybe<LiquidityLpPartnerRewardsInput>;
}>;

export type FetchLiquidityLpPartnerRewardsQuery = {
  liquidity_getLpPartnerRewards?: {
    partnerInfos?: Array<{
      partner?: string | null;
      logo?: string | null;
      introduction?: string | null;
      link?: string | null;
      theme?: Array<string | null> | null;
      sort?: number | null;
      platform?: number | null;
      extra?: any | null;
    } | null> | null;
    partnerRewards?: Array<{
      chainId?: number | null;
      pool?: string | null;
      partner?: string | null;
      reward?: string | null;
      type?: string | null;
    } | null> | null;
  } | null;
};

export type FetchUserprofileRewardQueryVariables = Exact<{
  where?: InputMaybe<UserprofileReward_Filter>;
}>;

export type FetchUserprofileRewardQuery = {
  userprofile_reward?: Array<{
    name_key?: string | null;
    token_address?: string | null;
    contract_address?: string | null;
    token_symbol?: string | null;
    locking?: string | null;
    version?: string | null;
    merkle?: {
      index?: string | null;
      amout?: string | null;
      proof?: Array<string | null> | null;
    } | null;
  }> | null;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(
    private value: string,
    public __meta__?: Record<string, any>,
  ) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const FetchErc20SwapCrossChainListDocument = new TypedDocumentString(`
    query FetchErc20SwapCrossChainList($where: Erc20listV2Filter) {
  erc20_swapCrossChainList(where: $where) {
    name
    address
    symbol
    decimals
    slippage
    chainId
    logoImg
    tokenlists {
      name
      status
    }
    domains {
      name
    }
    funcLabels {
      key
    }
    attributeLabels {
      key
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchErc20SwapCrossChainListQuery,
  FetchErc20SwapCrossChainListQueryVariables
>;
export const FetchErc20ForecastSlippageDocument = new TypedDocumentString(`
    query FetchErc20ForecastSlippage($where: Erc20_extenderc20ExtendV2Filter) {
  erc20_extend_erc20ExtendV2(where: $where) {
    forecastSlippageList {
      forecastSlippage
      forecastValue
      confidenceRatio
      confidenceIntervalUpper
      confidenceIntervalLower
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchErc20ForecastSlippageQuery,
  FetchErc20ForecastSlippageQueryVariables
>;
export const TicksDocument = new TypedDocumentString(`
    query Ticks($where: Tick_filter, $skip: Int, $first: Int) {
  ticks(where: $where, skip: $skip, first: $first) {
    id
    poolAddress
    tickIdx
    liquidityNet
    price0
    price1
  }
}
    `) as unknown as TypedDocumentString<TicksQuery, TicksQueryVariables>;
export const FetchMiningListDocument = new TypedDocumentString(`
    query FetchMiningList($where: Miningmining_list_filter) {
  mining_list(where: $where) {
    list {
      chainId
      type
      version
      address
      baseApy
      baseLpToken {
        decimals
        address: id
        symbol
      }
      baseToken {
        decimals
        address: id
        price
        symbol
        logoImg
      }
      endBlock
      miningContractAddress
      miningTotalDollar
      baseLpTokenMining
      quoteLpTokenMining
      quoteApy
      quoteLpToken {
        decimals
        address: id
        symbol
      }
      quoteToken {
        decimals
        address: id
        price
        symbol
        logoImg
      }
      rewardTokenInfos {
        apy
        decimals
        address: id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      rewardQuoteTokenInfos {
        apy
        decimals
        address: id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      startBlock
      title
      platform
      startTime
      endTime
    }
    totalCount
    chains
  }
}
    `) as unknown as TypedDocumentString<
  FetchMiningListQuery,
  FetchMiningListQueryVariables
>;
export const MiningListDocument = new TypedDocumentString(`
    query MiningList($where: Miningmining_list_filter) {
  mining_list(where: $where) {
    list {
      chainId
      type
      version
      address
      isGSP
      isNewERCMineV3
      baseApy
      baseLpToken {
        decimals
        id
        symbol
      }
      baseToken {
        decimals
        id
        price
        symbol
        logoImg
      }
      endBlock
      miningContractAddress
      miningTotalDollar
      baseLpTokenMining
      quoteLpTokenMining
      quoteApy
      quoteLpToken {
        decimals
        id
        symbol
      }
      quoteToken {
        decimals
        id
        price
        symbol
        logoImg
      }
      rewardTokenInfos {
        apy
        decimals
        id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      rewardQuoteTokenInfos {
        apy
        decimals
        id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      startBlock
      title
      platform
      blockNumber
      startTime
      endTime
    }
    totalCount
    chains
  }
}
    `) as unknown as TypedDocumentString<
  MiningListQuery,
  MiningListQueryVariables
>;
export const MyCreatedMiningListDocument = new TypedDocumentString(`
    query MyCreatedMiningList($where: Miningmining_list_filter) {
  mining_list(where: $where) {
    list {
      chainId
      type
      version
      address
      isGSP
      isNewERCMineV3
      baseApy
      baseLpToken {
        decimals
        id
        symbol
      }
      baseToken {
        decimals
        id
        price
        symbol
        logoImg
      }
      endBlock
      miningContractAddress
      baseLpTokenMining
      quoteLpTokenMining
      quoteApy
      quoteLpToken {
        decimals
        id
        symbol
      }
      quoteToken {
        decimals
        id
        price
        symbol
        logoImg
      }
      rewardTokenInfos {
        apy
        decimals
        id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      rewardQuoteTokenInfos {
        apy
        decimals
        id
        price
        logoImg
        rewardNumIndex
        rewardPerBlock
        startBlock
        endBlock
        startTime
        endTime
        symbol
      }
      startBlock
      title
      platform
      blockNumber
      participantsNum
      startTime
      endTime
    }
    totalCount
    chains
  }
}
    `) as unknown as TypedDocumentString<
  MyCreatedMiningListQuery,
  MyCreatedMiningListQueryVariables
>;
export const FetchPoolListDocument = new TypedDocumentString(`
    query FetchPoolList($first: Int, $where: Pair_filter, $orderBy: Pair_orderBy) {
  pairs(first: $first, where: $where, orderBy: $orderBy, orderDirection: desc) {
    id
    type
    creator
    owner
    lpFeeRate
    i
    k
    baseReserve
    quoteReserve
    lastTradePrice
    feeBase
    feeQuote
    baseToken {
      id
      symbol
      name
      decimals
    }
    quoteToken {
      id
      symbol
      name
      decimals
    }
    baseLpToken {
      id
      decimals
    }
    quoteLpToken {
      id
      decimals
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolListQuery,
  FetchPoolListQueryVariables
>;
export const FetchLiquidityListDocument = new TypedDocumentString(`
    query FetchLiquidityList($where: Liquiditylist_filter) {
  liquidity_list(where: $where) {
    currentPage
    pageSize
    totalCount
    lqList {
      id
      pair {
        id
        chainId
        type
        lpFeeRate
        mtFeeRate
        creator
        baseLpToken {
          id
          decimals
        }
        quoteLpToken {
          id
          decimals
        }
        baseToken {
          id
          symbol
          name
          decimals
          logoImg
        }
        quoteToken {
          id
          symbol
          name
          decimals
          logoImg
        }
        tvl
        apy {
          miningBaseApy
          miningQuoteApy
          transactionBaseApy
          transactionQuoteApy
          metromMiningApy
        }
        miningAddress
        volume24H
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchLiquidityListQuery,
  FetchLiquidityListQueryVariables
>;
export const FetchMyLiquidityListDocument = new TypedDocumentString(`
    query FetchMyLiquidityList($where: Liquiditylist_filter) {
  liquidity_list(where: $where) {
    lqList {
      id
      liquidityPositions {
        id
        liquidityTokenBalance
        liquidityTokenInMining
        poolShare
        liquidityUSD
        tokenId
        outOfRange
        priceRange {
          token0LowerPrice
          token0UpperPrice
          token1LowerPrice
          token1UpperPrice
        }
        tickLower {
          id
          tickIdx
          liquidityGross
          liquidityNet
          price0
          price1
        }
        tickUpper {
          id
          tickIdx
          liquidityGross
          liquidityNet
          price0
          price1
        }
      }
      pair {
        id
        chainId
        type
        lpFeeRate
        mtFeeRate
        creator
        baseLpToken {
          id
          decimals
        }
        quoteLpToken {
          id
          decimals
        }
        baseToken {
          id
          symbol
          name
          decimals
          logoImg
        }
        quoteToken {
          id
          symbol
          name
          decimals
          logoImg
        }
        tvl
        apy {
          miningBaseApy
          miningQuoteApy
          transactionBaseApy
          transactionQuoteApy
          metromMiningApy
        }
        miningAddress
        volume24H
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchMyLiquidityListQuery,
  FetchMyLiquidityListQueryVariables
>;
export const FetchDashboardPairListDocument = new TypedDocumentString(`
    query FetchDashboardPairList($where: Dashboardtype_list_filter) {
  dashboard_pairs_list(where: $where) {
    list {
      chainId
      pairAddress
      poolType
      baseReserve
      quoteReserve
      totalFee
      baseAddress
      quoteAddress
      baseSymbol
      quoteSymbol
      tvl
      baseTvl
      quoteTvl
      baseTvlRate
      quoteTvlRate
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchDashboardPairListQuery,
  FetchDashboardPairListQueryVariables
>;
export const FetchPoolDocument = new TypedDocumentString(`
    query FetchPool($id: ID!, $where: Pair_filter, $liquidityWhere: Liquiditylist_filter) {
  pair(id: $id, where: $where) {
    id
    type
    creator
    owner
    traderCount
    volumeBaseToken
    volumeQuoteToken
    volumeUSD
    feeBase
    feeQuote
    mtFeeRate
    lpFeeRate
    i
    k
    baseReserve
    quoteReserve
    createdAtTimestamp
    lastTradePrice
    baseToken {
      id
      symbol
      name
      decimals
    }
    quoteToken {
      id
      symbol
      name
      decimals
      usdPrice
    }
    baseLpToken {
      id
      symbol
      name
      decimals
    }
    quoteLpToken {
      id
      symbol
      name
      decimals
    }
  }
  liquidity_list(where: $liquidityWhere) {
    lqList {
      pair {
        apy {
          miningBaseApy
          miningQuoteApy
          transactionBaseApy
          transactionQuoteApy
          metromMiningApy
        }
        miningAddress
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolQuery,
  FetchPoolQueryVariables
>;
export const FetchPoolDayDataDocument = new TypedDocumentString(`
    query FetchPoolDayData($where: Dashboardday_filter) {
  dashboard_pairs_day_data(where: $where) {
    timestamp
    date
    volumeUsd
    feeUsd
    mtFeeUsd
    tvlUsd
    addresses
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolDayDataQuery,
  FetchPoolDayDataQueryVariables
>;
export const FetchPoolDashboardDocument = new TypedDocumentString(`
    query FetchPoolDashboard($where: Dashboardpair_detail_filter) {
  dashboard_pairs_detail(where: $where) {
    fee
    volume
    totalFee
    totalMtFee
    totalVolume
    tvl
    turnover
    liquidity
    baseReserve
    quoteReserve
    baseVolume
    quoteVolume
    basePrice
    quotePrice
    price
    baseFee
    quoteFee
    baseMtFee
    quoteMtFee
    pair
    poolType
    baseVolumeCumulative
    quoteVolumeCumulative
    baseAddress
    baseSymbol
    quoteAddress
    quoteSymbol
    network
    pairAddress
    txes
    txesNear24h
    txUsers
    txUserNear24h
    mtFeeNear24h
    feeNear24h
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolDashboardQuery,
  FetchPoolDashboardQueryVariables
>;
export const FetchPoolSwapListDocument = new TypedDocumentString(`
    query FetchPoolSwapList($first: Int, $skip: Int, $where: Swap_filter, $orderBy: Swap_orderBy, $orderDirection: OrderDirection) {
  swaps(
    first: $first
    skip: $skip
    where: $where
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    timestamp
    from
    baseVolume
    quoteVolume
    feeBase
    feeQuote
    fromToken {
      id
      symbol
      name
      decimals
    }
    toToken {
      id
      symbol
      name
      decimals
    }
    amountIn
    amountOut
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolSwapListQuery,
  FetchPoolSwapListQueryVariables
>;
export const FetchLiquidityPositionsDocument = new TypedDocumentString(`
    query FetchLiquidityPositions($id: ID!, $first: Int, $skip: Int, $where: LiquidityPosition_filter, $miningWhere: LiquidityPosition_filter, $orderBy: LiquidityPosition_orderBy, $orderDirection: OrderDirection) {
  balance: liquidityPositions(
    first: $first
    skip: $skip
    where: $where
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    liquidityTokenBalance
  }
  mining: liquidityPositions(
    first: $first
    skip: $skip
    where: $miningWhere
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    liquidityTokenInMining
  }
  pair(id: $id) {
    lastTradePrice
    baseLpToken {
      id
      decimals
    }
    quoteLpToken {
      id
      decimals
    }
    baseToken {
      id
      symbol
      name
      decimals
    }
    quoteToken {
      id
      symbol
      name
      decimals
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchLiquidityPositionsQuery,
  FetchLiquidityPositionsQueryVariables
>;
export const FetchPoolPairListDocument = new TypedDocumentString(`
    query FetchPoolPairList($first: Int, $baseWhere: Pair_filter, $quoteWhere: Pair_filter, $orderBy: Pair_orderBy, $orderDirection: OrderDirection) {
  basePairs: pairs(
    first: $first
    where: $baseWhere
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    type
    creator
    lpFeeRate
    i
    k
    baseReserve
    quoteReserve
    createdAtTimestamp
    lastTradePrice
    volumeUSD
    baseToken {
      id
      symbol
      name
      decimals
      usdPrice
    }
    quoteToken {
      id
      symbol
      name
      decimals
      usdPrice
    }
  }
  quotePairs: pairs(
    first: $first
    where: $quoteWhere
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    id
    type
    creator
    lpFeeRate
    i
    k
    baseReserve
    quoteReserve
    createdAtTimestamp
    lastTradePrice
    volumeUSD
    baseToken {
      id
      symbol
      name
      decimals
      usdPrice
    }
    quoteToken {
      id
      symbol
      name
      decimals
      usdPrice
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchPoolPairListQuery,
  FetchPoolPairListQueryVariables
>;
export const FetchUserSwapOrderHistoriesDocument = new TypedDocumentString(`
    query FetchUserSwapOrderHistories($where: User_swapswapFilter) {
  user_swap_orderHistories(where: $where) {
    count
    page
    list {
      chainId
      createdAt
      fromAmount
      fromTokenDecimals
      fromTokenPrice
      fromTokenSymbol
      fromTokenAddress
      fromTokenLogoImg
      hash
      status
      toAmount
      toTokenDecimals
      toTokenPrice
      toTokenSymbol
      toTokenAddress
      toTokenLogoImg
      minAmount
      nonce
      extra
      user
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchUserSwapOrderHistoriesQuery,
  FetchUserSwapOrderHistoriesQueryVariables
>;
export const FetchNoticeCenterTransactionListDocument =
  new TypedDocumentString(`
    query FetchNoticeCenterTransactionList($where: Notice_centertransactionListFilter) {
  notice_center_transactionList(where: $where) {
    list {
      chainId
      createTime
      extend
      from
      id
      key
      type
    }
    count
    limit
    page
  }
}
    `) as unknown as TypedDocumentString<
    FetchNoticeCenterTransactionListQuery,
    FetchNoticeCenterTransactionListQueryVariables
  >;
export const FetchLiquidityLpPartnerRewardsDocument = new TypedDocumentString(`
    query FetchLiquidityLpPartnerRewards($where: LiquidityLpPartnerRewardsInput) {
  liquidity_getLpPartnerRewards(where: $where) {
    partnerInfos {
      partner
      logo
      introduction
      link
      theme
      sort
      platform
      extra
    }
    partnerRewards {
      chainId
      pool
      partner
      reward
      type
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchLiquidityLpPartnerRewardsQuery,
  FetchLiquidityLpPartnerRewardsQueryVariables
>;
export const FetchUserprofileRewardDocument = new TypedDocumentString(`
    query FetchUserprofileReward($where: UserprofileReward_filter) {
  userprofile_reward(where: $where) {
    name_key
    token_address
    contract_address
    token_symbol
    locking
    version
    merkle {
      index
      amout
      proof
    }
  }
}
    `) as unknown as TypedDocumentString<
  FetchUserprofileRewardQuery,
  FetchUserprofileRewardQueryVariables
>;

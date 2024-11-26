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
  /**
   * The `AWSJSON` scalar type provided by AWS AppSync, represents a JSON string that
   * complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like
   * "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like
   * "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as
   * valid JSON and will automatically be parsed and loaded in the resolver mapping
   * templates as Maps, Lists, or Scalar values rather than as the literal input
   * strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted
   * string**" will throw GraphQL validation errors.
   */
  AWSJSON: { input: any; output: any };
};

/**
 *  Types, unions, and inputs (alphabetized):
 * These are colocated to highlight the relationship between some types and their inputs.
 */
export type ActivityDetails =
  | OnRampTransactionDetails
  | SwapOrderDetails
  | TransactionDetails;

export type ActivityDetailsInput = {
  onRampTransactionDetails?: InputMaybe<OnRampTransactionDetailsInput>;
  swapOrderDetails?: InputMaybe<SwapOrderDetailsInput>;
  transactionDetails?: InputMaybe<TransactionDetailsInput>;
};

/**
 *  Enums (alphabetized):
 * deprecated and replaced with TransactionType, please do not use this
 */
export type ActivityType =
  | 'APPROVE'
  | 'BORROW'
  | 'BURN'
  | 'CANCEL'
  | 'CLAIM'
  | 'DEPLOYMENT'
  | 'LEND'
  | 'MINT'
  | 'NFT'
  | 'ON_RAMP'
  | 'RECEIVE'
  | 'REPAY'
  | 'SEND'
  | 'STAKE'
  | 'SWAP'
  | 'SWAP_ORDER'
  | 'Staking'
  | 'UNKNOWN'
  | 'UNSTAKE'
  | 'WITHDRAW'
  | 'market'
  | 'money';

export type Amount = IAmount & {
  currency?: Maybe<Currency>;
  id: Scalars['ID']['output'];
  value: Scalars['Float']['output'];
};

export type AmountChange = {
  absolute?: Maybe<Amount>;
  id: Scalars['ID']['output'];
  percentage?: Maybe<Amount>;
};

export type AmountInput = {
  currency?: InputMaybe<Currency>;
  value: Scalars['Float']['input'];
};

export type ApplicationContract = IContract & {
  address: Scalars['String']['output'];
  chain: Chain;
  icon?: Maybe<Image>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type ApplicationContractInput = {
  address: Scalars['String']['input'];
  chain: Chain;
  icon?: InputMaybe<ImageInput>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AssetActivity = {
  addresses?: Maybe<Array<Scalars['String']['output']>>;
  /** @deprecated use assetChanges field in details */
  assetChanges: Array<Maybe<AssetChange>>;
  chain: Chain;
  details: ActivityDetails;
  /** @deprecated not required, remove usage */
  gasUsed?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  timestamp: Scalars['Int']['output'];
  /** @deprecated use fields from details */
  transaction: Transaction;
  /** @deprecated use type field in details */
  type: ActivityType;
};

export type AssetActivityInput = {
  chain: Chain;
  details: ActivityDetailsInput;
  timestamp: Scalars['Int']['input'];
};

export type AssetActivitySwitch = 'ALTERNATE' | 'LEGACY';

export type AssetChange =
  | NftApproval
  | NftApproveForAll
  | NftTransfer
  | OnRampTransfer
  | TokenApproval
  | TokenTransfer;

export type AssetChangeInput = {
  nftApproval?: InputMaybe<NftApprovalInput>;
  nftApproveForAll?: InputMaybe<NftApproveForAllInput>;
  nftTransfer?: InputMaybe<NftTransferInput>;
  onRampTransfer?: InputMaybe<OnRampTransferInput>;
  tokenApproval?: InputMaybe<TokenApprovalInput>;
  tokenTransfer?: InputMaybe<TokenTransferInput>;
};

export type Chain =
  | 'ARBITRUM'
  | 'ASTROCHAIN_SEPOLIA'
  | 'AVALANCHE'
  | 'BASE'
  | 'BLAST'
  | 'BNB'
  | 'CELO'
  | 'ETHEREUM'
  | 'ETHEREUM_GOERLI'
  | 'ETHEREUM_SEPOLIA'
  | 'OPTIMISM'
  | 'POLYGON'
  | 'UNKNOWN_CHAIN'
  | 'WORLDCHAIN'
  | 'ZKSYNC'
  | 'ZORA';

export type CollectionSortableField = 'VOLUME';

export type ContractInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain: Chain;
};

export type Currency =
  | 'AUD'
  | 'BRL'
  | 'CAD'
  | 'CNY'
  | 'ETH'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'IDR'
  | 'INR'
  | 'JPY'
  | 'KRW'
  | 'MATIC'
  | 'NGN'
  | 'PKR'
  | 'RUB'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'UAH'
  | 'USD'
  | 'VND';

export type CurrencyAmountInput = {
  currency: Currency;
  value: Scalars['Float']['input'];
};

export type DescriptionTranslations = {
  descriptionEnUs?: Maybe<Scalars['String']['output']>;
  descriptionEs419?: Maybe<Scalars['String']['output']>;
  descriptionEsEs?: Maybe<Scalars['String']['output']>;
  descriptionEsUs?: Maybe<Scalars['String']['output']>;
  descriptionFrFr?: Maybe<Scalars['String']['output']>;
  descriptionHiIn?: Maybe<Scalars['String']['output']>;
  descriptionIdId?: Maybe<Scalars['String']['output']>;
  descriptionJaJp?: Maybe<Scalars['String']['output']>;
  descriptionMsMy?: Maybe<Scalars['String']['output']>;
  descriptionNlNl?: Maybe<Scalars['String']['output']>;
  descriptionPtPt?: Maybe<Scalars['String']['output']>;
  descriptionRuRu?: Maybe<Scalars['String']['output']>;
  descriptionThTh?: Maybe<Scalars['String']['output']>;
  descriptionTrTr?: Maybe<Scalars['String']['output']>;
  descriptionUkUa?: Maybe<Scalars['String']['output']>;
  descriptionUrPk?: Maybe<Scalars['String']['output']>;
  descriptionViVn?: Maybe<Scalars['String']['output']>;
  descriptionZhHans?: Maybe<Scalars['String']['output']>;
  descriptionZhHant?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type Dimensions = {
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  width?: Maybe<Scalars['Float']['output']>;
};

export type DimensionsInput = {
  height?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type FeeData = {
  buyFeeBps?: Maybe<Scalars['String']['output']>;
  externalTransferFailed?: Maybe<Scalars['Boolean']['output']>;
  feeTakenOnTransfer?: Maybe<Scalars['Boolean']['output']>;
  sellFeeBps?: Maybe<Scalars['String']['output']>;
  sellReverted?: Maybe<Scalars['Boolean']['output']>;
};

export type HighLow = 'HIGH' | 'LOW';

/**   FIVE_MINUTE is only supported for TokenMarket.pricePercentChange */
export type HistoryDuration =
  | 'DAY'
  | 'FIVE_MINUTE'
  | 'HOUR'
  | 'MAX'
  | 'MONTH'
  | 'WEEK'
  | 'YEAR';

/**   Interfaces (alphabetized): */
export type IAmount = {
  currency?: Maybe<Currency>;
  value: Scalars['Float']['output'];
};

export type IContract = {
  address?: Maybe<Scalars['String']['output']>;
  chain: Chain;
};

export type IPool = {
  address: Scalars['String']['output'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID']['output'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']['output']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']['output']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']['output']>;
};

export type IPoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};

export type IPoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};

export type IPoolPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type IPoolTransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type Image = {
  dimensions?: Maybe<Dimensions>;
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

export type ImageInput = {
  dimensions?: InputMaybe<DimensionsInput>;
  url: Scalars['String']['input'];
};

export type MediaType = 'AUDIO' | 'IMAGE' | 'RAW' | 'VIDEO';

export type Mutation = {
  assetActivity: AssetActivity;
  heartbeat: Status;
  unsubscribe: Status;
};

export type MutationAssetActivityArgs = {
  input: AssetActivityInput;
};

export type MutationHeartbeatArgs = {
  subscriptionId: Scalars['ID']['input'];
  type: SubscriptionType;
};

export type MutationUnsubscribeArgs = {
  subscriptionId: Scalars['ID']['input'];
  type: SubscriptionType;
};

export type NetworkFee = {
  quantity?: Maybe<Scalars['String']['output']>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  tokenChain?: Maybe<Scalars['String']['output']>;
  tokenSymbol?: Maybe<Scalars['String']['output']>;
};

export type NftActivity = {
  address: Scalars['String']['output'];
  asset?: Maybe<NftAsset>;
  fromAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  marketplace?: Maybe<Scalars['String']['output']>;
  orderStatus?: Maybe<OrderStatus>;
  price?: Maybe<Amount>;
  quantity?: Maybe<Scalars['Int']['output']>;
  timestamp: Scalars['Int']['output'];
  toAddress?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
  type: NftActivityType;
  url?: Maybe<Scalars['String']['output']>;
};

export type NftActivityConnection = {
  edges: Array<NftActivityEdge>;
  pageInfo: PageInfo;
};

export type NftActivityEdge = {
  cursor: Scalars['String']['output'];
  node: NftActivity;
};

export type NftActivityFilterInput = {
  activityTypes?: InputMaybe<Array<NftActivityType>>;
  address?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
};

export type NftActivityType =
  | 'CANCEL_LISTING'
  | 'LISTING'
  | 'SALE'
  | 'TRANSFER';

export type NftApproval = {
  approvedAddress: Scalars['String']['output'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID']['output'];
  nftStandard: NftStandard;
};

export type NftApprovalInput = {
  approvedAddress: Scalars['String']['input'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
};

export type NftApproveForAll = {
  approved: Scalars['Boolean']['output'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID']['output'];
  nftStandard: NftStandard;
  operatorAddress: Scalars['String']['output'];
};

export type NftApproveForAllInput = {
  approved: Scalars['Boolean']['input'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
  operatorAddress: Scalars['String']['input'];
};

export type NftAsset = {
  animationUrl?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Chain>;
  collection?: Maybe<NftCollection>;
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']['output']>;
  flaggedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']['output']>;
  isSpam?: Maybe<Scalars['Boolean']['output']>;
  listings?: Maybe<NftOrderConnection>;
  mediaType?: Maybe<MediaType>;
  metadataUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nftContract?: Maybe<NftContract>;
  originalImage?: Maybe<Image>;
  /**   TODO: may need to be array to support erc1155 cases. not needed at the moment so will revisit. */
  ownerAddress?: Maybe<Scalars['String']['output']>;
  rarities?: Maybe<Array<NftAssetRarity>>;
  smallImage?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  smallImageUrl?: Maybe<Scalars['String']['output']>;
  suspiciousFlag?: Maybe<Scalars['Boolean']['output']>;
  thumbnail?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
  traits?: Maybe<Array<NftAssetTrait>>;
};

export type NftAssetListingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NftAssetConnection = {
  edges: Array<NftAssetEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type NftAssetEdge = {
  cursor: Scalars['String']['output'];
  node: NftAsset;
};

export type NftAssetInput = {
  animationUrl?: InputMaybe<Scalars['String']['input']>;
  collection?: InputMaybe<NftCollectionInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<ImageInput>;
  isSpam?: InputMaybe<Scalars['Boolean']['input']>;
  mediaType?: InputMaybe<MediaType>;
  name?: InputMaybe<Scalars['String']['input']>;
  nftContract?: InputMaybe<NftContractInput>;
  smallImage?: InputMaybe<ImageInput>;
  thumbnail?: InputMaybe<ImageInput>;
  tokenId: Scalars['String']['input'];
};

export type NftAssetRarity = {
  id: Scalars['ID']['output'];
  provider?: Maybe<NftRarityProvider>;
  rank?: Maybe<Scalars['Int']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type NftAssetSortableField = 'PRICE' | 'RARITY';

export type NftAssetTrait = {
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  rarity?: Maybe<Scalars['Float']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type NftAssetTraitInput = {
  name: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type NftAssetsFilterInput = {
  listed?: InputMaybe<Scalars['Boolean']['input']>;
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
  maxPrice?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['String']['input']>;
  tokenIds?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenSearchQuery?: InputMaybe<Scalars['String']['input']>;
  traits?: InputMaybe<Array<NftAssetTraitInput>>;
};

export type NftBalance = {
  id: Scalars['ID']['output'];
  lastPrice?: Maybe<TimestampedAmount>;
  listedMarketplaces?: Maybe<Array<NftMarketplace>>;
  listingFees?: Maybe<Array<Maybe<NftFee>>>;
  ownedAsset?: Maybe<NftAsset>;
  quantity?: Maybe<Scalars['Int']['output']>;
};

export type NftBalanceAssetInput = {
  address: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};

export type NftBalanceConnection = {
  edges: Array<NftBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftBalanceEdge = {
  cursor: Scalars['String']['output'];
  node: NftBalance;
};

export type NftBalancesFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  assets?: InputMaybe<Array<NftBalanceAssetInput>>;
  filterSpam?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NftCollection = {
  bannerImage?: Maybe<Image>;
  /**
   *  TODO: support querying for collection assets here
   * assets(page: Int, pageSize: Int, orderBy: NftAssetSortableField): [NftAsset]
   * @deprecated Field no longer supported
   */
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  collectionId: Scalars['String']['output'];
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']['output']>;
  discordUrl?: Maybe<Scalars['String']['output']>;
  homepageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']['output']>;
  instagramName?: Maybe<Scalars['String']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  markets?: Maybe<Array<NftCollectionMarket>>;
  name?: Maybe<Scalars['String']['output']>;
  nftContracts?: Maybe<Array<NftContract>>;
  numAssets?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Field no longer supported */
  openseaUrl?: Maybe<Scalars['String']['output']>;
  traits?: Maybe<Array<NftCollectionTrait>>;
  twitterName?: Maybe<Scalars['String']['output']>;
};

export type NftCollectionMarketsArgs = {
  currencies: Array<Currency>;
};

export type NftCollectionBalance = {
  address: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  logoImage?: Maybe<Image>;
  name: Scalars['String']['output'];
};

export type NftCollectionBalanceConnection = {
  edges: Array<NftCollectionBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionBalanceEdge = {
  cursor: Scalars['String']['output'];
  node: NftCollectionBalance;
};

export type NftCollectionConnection = {
  edges: Array<NftCollectionEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionEdge = {
  cursor: Scalars['String']['output'];
  node: NftCollection;
};

export type NftCollectionInput = {
  collectionId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nftContracts?: InputMaybe<Array<NftContractInput>>;
};

export type NftCollectionMarket = {
  floorPrice?: Maybe<TimestampedAmount>;
  floorPricePercentChange?: Maybe<TimestampedAmount>;
  id: Scalars['ID']['output'];
  listings?: Maybe<TimestampedAmount>;
  marketplaces?: Maybe<Array<NftCollectionMarketplace>>;
  nftContracts?: Maybe<Array<NftContract>>;
  owners?: Maybe<Scalars['Int']['output']>;
  percentListed?: Maybe<TimestampedAmount>;
  percentUniqueOwners?: Maybe<TimestampedAmount>;
  sales?: Maybe<TimestampedAmount>;
  totalVolume?: Maybe<TimestampedAmount>;
  volume?: Maybe<TimestampedAmount>;
  /** @deprecated Field no longer supported */
  volume24h?: Maybe<Amount>;
  volumePercentChange?: Maybe<TimestampedAmount>;
};

export type NftCollectionMarketFloorPricePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketMarketplacesArgs = {
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
};

export type NftCollectionMarketSalesArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketVolumeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketVolumePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketplace = {
  floorPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  listings?: Maybe<Scalars['Int']['output']>;
  marketplace?: Maybe<NftMarketplace>;
};

export type NftCollectionTrait = {
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  stats?: Maybe<Array<NftCollectionTraitStats>>;
  values?: Maybe<Array<Scalars['String']['output']>>;
};

export type NftCollectionTraitStats = {
  assets?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  listings?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type NftCollectionsFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  nameQuery?: InputMaybe<Scalars['String']['input']>;
};

export type NftContract = IContract & {
  address: Scalars['String']['output'];
  chain: Chain;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  standard?: Maybe<NftStandard>;
  symbol?: Maybe<Scalars['String']['output']>;
  totalSupply?: Maybe<Scalars['Int']['output']>;
};

export type NftContractInput = {
  address: Scalars['String']['input'];
  chain: Chain;
  name?: InputMaybe<Scalars['String']['input']>;
  standard?: InputMaybe<NftStandard>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['Int']['input']>;
};

export type NftFee = {
  basisPoints: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  payoutAddress: Scalars['String']['output'];
};

export type NftMarketplace =
  | 'CRYPTOPUNKS'
  | 'FOUNDATION'
  | 'LOOKSRARE'
  | 'NFT20'
  | 'NFTX'
  | 'OPENSEA'
  | 'SUDOSWAP'
  | 'X2Y2';

export type NftOrder = {
  address: Scalars['String']['output'];
  auctionType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Float']['output'];
  endAt?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  maker: Scalars['String']['output'];
  marketplace: NftMarketplace;
  marketplaceUrl: Scalars['String']['output'];
  orderHash?: Maybe<Scalars['String']['output']>;
  poolPrices?: Maybe<Array<Scalars['String']['output']>>;
  price: Amount;
  protocolParameters?: Maybe<Scalars['AWSJSON']['output']>;
  quantity: Scalars['Int']['output'];
  startAt: Scalars['Float']['output'];
  status: OrderStatus;
  taker?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['String']['output']>;
  type: OrderType;
};

export type NftOrderConnection = {
  edges: Array<NftOrderEdge>;
  pageInfo: PageInfo;
};

export type NftOrderEdge = {
  cursor: Scalars['String']['output'];
  node: NftOrder;
};

export type NftProfile = {
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  profileImage?: Maybe<Image>;
  username?: Maybe<Scalars['String']['output']>;
};

export type NftRarityProvider = 'RARITY_SNIPER';

export type NftRouteResponse = {
  calldata: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  route?: Maybe<Array<NftTrade>>;
  sendAmount: TokenAmount;
  toAddress: Scalars['String']['output'];
};

export type NftStandard = 'ERC721' | 'ERC1155' | 'NONCOMPLIANT';

export type NftTrade = {
  amount: Scalars['Int']['output'];
  contractAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  marketplace: NftMarketplace;
  /**   price represents the current price of the NFT, which can be different from quotePrice */
  price: TokenAmount;
  /**   quotePrice represents the last quoted price of the NFT */
  quotePrice?: Maybe<TokenAmount>;
  tokenId: Scalars['String']['output'];
  tokenType?: Maybe<NftStandard>;
};

export type NftTradeInput = {
  amount: Scalars['Int']['input'];
  contractAddress: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  marketplace: NftMarketplace;
  quotePrice?: InputMaybe<TokenAmountInput>;
  tokenId: Scalars['String']['input'];
  tokenType?: InputMaybe<NftStandard>;
};

export type NftTransfer = {
  asset: NftAsset;
  direction: TransactionDirection;
  id: Scalars['ID']['output'];
  nftStandard: NftStandard;
  recipient: Scalars['String']['output'];
  sender: Scalars['String']['output'];
};

export type NftTransferInput = {
  asset: NftAssetInput;
  direction: TransactionDirection;
  nftStandard: NftStandard;
  recipient: Scalars['String']['input'];
  sender: Scalars['String']['input'];
};

export type OnRampServiceProvider = {
  id: Scalars['ID']['output'];
  logoDarkUrl: Scalars['String']['output'];
  logoLightUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  serviceProvider: Scalars['String']['output'];
  supportUrl?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type OnRampServiceProviderInput = {
  logoDarkUrl: Scalars['String']['input'];
  logoLightUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
  serviceProvider: Scalars['String']['input'];
  supportUrl?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type OnRampTransactionDetails = {
  id: Scalars['ID']['output'];
  onRampTransfer: OnRampTransfer;
  receiverAddress: Scalars['String']['output'];
  status: TransactionStatus;
};

export type OnRampTransactionDetailsInput = {
  onRampTransfer: OnRampTransferInput;
  receiverAddress: Scalars['String']['input'];
  status: TransactionStatus;
};

export type OnRampTransactionsAuth = {
  queryParams: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type OnRampTransfer = {
  amount: Scalars['Float']['output'];
  externalSessionId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  networkFee?: Maybe<Scalars['Float']['output']>;
  serviceProvider: OnRampServiceProvider;
  sourceAmount: Scalars['Float']['output'];
  sourceCurrency?: Maybe<Scalars['String']['output']>;
  token: Token;
  tokenStandard: TokenStandard;
  totalFee?: Maybe<Scalars['Float']['output']>;
  transactionFee?: Maybe<Scalars['Float']['output']>;
  transactionReferenceId: Scalars['String']['output'];
};

export type OnRampTransferInput = {
  amount: Scalars['Float']['input'];
  networkFee?: InputMaybe<Scalars['Float']['input']>;
  serviceProvider: OnRampServiceProviderInput;
  sourceAmount: Scalars['Float']['input'];
  sourceCurrency?: InputMaybe<Scalars['String']['input']>;
  token: TokenAssetInput;
  tokenStandard: TokenStandard;
  totalFee?: InputMaybe<Scalars['Float']['input']>;
  transactionFee?: InputMaybe<Scalars['Float']['input']>;
  transactionReferenceId: Scalars['String']['input'];
};

export type OrderStatus = 'CANCELLED' | 'EXECUTED' | 'EXPIRED' | 'VALID';

export type OrderType = 'LISTING' | 'OFFER';

export type PageInfo = {
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['String']['output']>;
};

/**   v2 pool parameters as defined by https://github.com/Uniswap/v2-sdk/blob/main/src/entities/pair.ts */
export type PairInput = {
  tokenAmountA: TokenAmountInput;
  tokenAmountB: TokenAmountInput;
};

export type PermitDetailsInput = {
  amount: Scalars['String']['input'];
  expiration: Scalars['String']['input'];
  nonce: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type PermitInput = {
  details: PermitDetailsInput;
  sigDeadline: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  spender: Scalars['String']['input'];
};

/**   v3 pool parameters as defined by https://github.com/Uniswap/v3-sdk/blob/main/src/entities/pool.ts */
export type PoolInput = {
  fee: Scalars['Int']['input'];
  liquidity: Scalars['String']['input'];
  sqrtRatioX96: Scalars['String']['input'];
  tickCurrent: Scalars['String']['input'];
  tokenA: TokenInput;
  tokenB: TokenInput;
};

export type PoolTransaction = {
  account: Scalars['String']['output'];
  chain: Chain;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  protocolVersion: ProtocolVersion;
  timestamp: Scalars['Int']['output'];
  token0: Token;
  token0Quantity: Scalars['String']['output'];
  token1: Token;
  token1Quantity: Scalars['String']['output'];
  type: PoolTransactionType;
  usdValue: Amount;
};

export type PoolTransactionType = 'ADD' | 'REMOVE' | 'SWAP';

export type Portfolio = {
  assetActivities?: Maybe<Array<Maybe<AssetActivity>>>;
  id: Scalars['ID']['output'];
  /**   TODO: (michael.zhang) replace with paginated query */
  nftBalances?: Maybe<Array<Maybe<NftBalance>>>;
  ownerAddress: Scalars['String']['output'];
  tokenBalances?: Maybe<Array<Maybe<TokenBalance>>>;
  tokensTotalDenominatedValue?: Maybe<Amount>;
  tokensTotalDenominatedValueChange?: Maybe<AmountChange>;
};

export type PortfolioAssetActivitiesArgs = {
  _fs?: InputMaybe<AssetActivitySwitch>;
  chains?: InputMaybe<Array<Chain>>;
  includeBridging?: InputMaybe<Scalars['Boolean']['input']>;
  includeOffChain?: InputMaybe<Scalars['Boolean']['input']>;
  onRampTransactionIDs?: InputMaybe<Array<Scalars['String']['input']>>;
  onRampTransactionsAuth?: InputMaybe<OnRampTransactionsAuth>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type PortfolioTokensTotalDenominatedValueChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

/**   Specify how the portfolio value should be calculated for each `ownerAddress`. */
export type PortfolioValueModifier = {
  includeSmallBalances?: InputMaybe<Scalars['Boolean']['input']>;
  includeSpamTokens?: InputMaybe<Scalars['Boolean']['input']>;
  ownerAddress: Scalars['String']['input'];
  tokenBalancesLimit?: InputMaybe<Scalars['Int']['input']>;
  tokenExcludeOverrides?: InputMaybe<Array<ContractInput>>;
  tokenIncludeOverrides?: InputMaybe<Array<ContractInput>>;
};

export type PriceSource = 'SUBGRAPH_V2' | 'SUBGRAPH_V3' | 'SUBGRAPH_V4';

export type ProtectionAttackType =
  | 'AIRDROP_PATTERN'
  | 'DYNAMIC_ANALYSIS'
  | 'HIGH_FEES'
  | 'IMPERSONATOR'
  | 'INORGANIC_VOLUME'
  | 'KNOWN_MALICIOUS'
  | 'METADATA'
  | 'RUGPULL'
  | 'STATIC_CODE_SIGNATURE'
  | 'UNKNOWN'
  | 'UNSTABLE_TOKEN_PRICE';

export type ProtectionInfo = {
  attackTypes?: Maybe<Array<Maybe<ProtectionAttackType>>>;
  result?: Maybe<ProtectionResult>;
};

export type ProtectionResult =
  | 'BENIGN'
  | 'MALICIOUS'
  | 'SPAM'
  | 'UNKNOWN'
  | 'WARNING';

export type ProtocolVersion = 'V2' | 'V3' | 'V4';

export type PushNotification = {
  contents: Scalars['AWSJSON']['output'];
  id: Scalars['ID']['output'];
  notifyAddress: Scalars['String']['output'];
  signerHeader: Scalars['AWSJSON']['output'];
  viewerHeader: Scalars['AWSJSON']['output'];
};

export type Query = {
  convert?: Maybe<Amount>;
  dailyProtocolTvl?: Maybe<Array<TimestampedAmount>>;
  historicalProtocolVolume?: Maybe<Array<TimestampedAmount>>;
  isV3SubgraphStale?: Maybe<Scalars['Boolean']['output']>;
  nftActivity?: Maybe<NftActivityConnection>;
  nftAssets?: Maybe<NftAssetConnection>;
  nftBalances?: Maybe<NftBalanceConnection>;
  nftCollectionBalances?: Maybe<NftCollectionBalanceConnection>;
  nftCollections?: Maybe<NftCollectionConnection>;
  nftRoute?: Maybe<NftRouteResponse>;
  portfolios?: Maybe<Array<Maybe<Portfolio>>>;
  searchTokens?: Maybe<Array<Maybe<Token>>>;
  /**
   *  token consumes chain and address instead of contract because the apollo client request cache can only use
   * keys from the response, and the token response does not contain a contract, but does contain an unwrapped
   * contract: chain and address.
   */
  token?: Maybe<Token>;
  tokenProjects?: Maybe<Array<Maybe<TokenProject>>>;
  tokens?: Maybe<Array<Maybe<Token>>>;
  topCollections?: Maybe<NftCollectionConnection>;
  topTokens?: Maybe<Array<Maybe<Token>>>;
  /**   returns top v2 pairs sorted by total value locked in desc order */
  topV2Pairs?: Maybe<Array<V2Pair>>;
  /**   returns top v3 pools sorted by total value locked in desc order */
  topV3Pools?: Maybe<Array<V3Pool>>;
  topV4Pools?: Maybe<Array<V4Pool>>;
  transactionNotification?: Maybe<TransactionNotification>;
  v2Pair?: Maybe<V2Pair>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Pool?: Maybe<V3Pool>;
  v3PoolsForTokenPair?: Maybe<Array<V3Pool>>;
  v3Transactions?: Maybe<Array<PoolTransaction>>;
  v4Pool?: Maybe<V4Pool>;
  v4PoolsForTokenPair?: Maybe<Array<V4Pool>>;
  v4Transactions?: Maybe<Array<PoolTransaction>>;
};

export type QueryConvertArgs = {
  fromAmount: CurrencyAmountInput;
  toCurrency: Currency;
};

export type QueryDailyProtocolTvlArgs = {
  chain: Chain;
  version: ProtocolVersion;
};

export type QueryHistoricalProtocolVolumeArgs = {
  chain: Chain;
  duration: HistoryDuration;
  version: ProtocolVersion;
};

export type QueryIsV3SubgraphStaleArgs = {
  chain: Chain;
};

export type QueryNftActivityArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftActivityFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryNftAssetsArgs = {
  address: Scalars['String']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NftAssetSortableField>;
};

export type QueryNftBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  chains?: InputMaybe<Array<Chain>>;
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ownerAddress: Scalars['String']['input'];
};

export type QueryNftCollectionBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ownerAddress: Scalars['String']['input'];
};

export type QueryNftCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftCollectionsFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryNftRouteArgs = {
  chain?: InputMaybe<Chain>;
  nftTrades: Array<NftTradeInput>;
  senderAddress: Scalars['String']['input'];
  tokenTrades?: InputMaybe<Array<TokenTradeInput>>;
};

export type QueryPortfoliosArgs = {
  chains?: InputMaybe<Array<Chain>>;
  fungibleIds?: InputMaybe<Array<Scalars['String']['input']>>;
  lookupTokens?: InputMaybe<Array<ContractInput>>;
  ownerAddresses: Array<Scalars['String']['input']>;
  valueModifiers?: InputMaybe<Array<PortfolioValueModifier>>;
};

export type QuerySearchTokensArgs = {
  chains?: InputMaybe<Array<Chain>>;
  searchQuery: Scalars['String']['input'];
};

export type QueryTokenArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain: Chain;
};

export type QueryTokenProjectsArgs = {
  contracts: Array<ContractInput>;
};

export type QueryTokensArgs = {
  contracts: Array<ContractInput>;
};

export type QueryTopCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  chains?: InputMaybe<Array<Chain>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<HistoryDuration>;
  first?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CollectionSortableField>;
};

export type QueryTopTokensArgs = {
  chain?: InputMaybe<Chain>;
  orderBy?: InputMaybe<TokenSortableField>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTopV2PairsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  tokenFilter?: InputMaybe<Scalars['String']['input']>;
  tvlCursor?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryTopV3PoolsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  tokenFilter?: InputMaybe<Scalars['String']['input']>;
  tvlCursor?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryTopV4PoolsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  tokenFilter?: InputMaybe<Scalars['String']['input']>;
  tvlCursor?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryTransactionNotificationArgs = {
  address: Scalars['String']['input'];
  chain: Chain;
  isBridging?: InputMaybe<Scalars['Boolean']['input']>;
  transactionHash: Scalars['String']['input'];
};

export type QueryV2PairArgs = {
  address: Scalars['String']['input'];
  chain: Chain;
};

export type QueryV2TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryV3PoolArgs = {
  address: Scalars['String']['input'];
  chain: Chain;
};

export type QueryV3PoolsForTokenPairArgs = {
  chain: Chain;
  token0: Scalars['String']['input'];
  token1: Scalars['String']['input'];
};

export type QueryV3TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryV4PoolArgs = {
  chain: Chain;
  poolId: Scalars['String']['input'];
};

export type QueryV4PoolsForTokenPairArgs = {
  chain: Chain;
  token0: Scalars['String']['input'];
  token1: Scalars['String']['input'];
};

export type QueryV4TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type SafetyLevel =
  | 'BLOCKED'
  | 'MEDIUM_WARNING'
  | 'STRONG_WARNING'
  | 'VERIFIED';

export type Status = {
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  onAssetActivity?: Maybe<AssetActivity>;
};

export type SubscriptionOnAssetActivityArgs = {
  addresses: Array<Scalars['String']['input']>;
  subscriptionId: Scalars['ID']['input'];
};

export type SubscriptionType = 'ASSET_ACTIVITY';

export type SwapOrderDetails = {
  encodedOrder: Scalars['String']['output'];
  expiry: Scalars['Int']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inputToken: Token;
  inputTokenQuantity: Scalars['String']['output'];
  offerer: Scalars['String']['output'];
  outputToken: Token;
  outputTokenQuantity: Scalars['String']['output'];
  /** @deprecated use swapOrderStatus to disambiguate from transactionStatus */
  status: SwapOrderStatus;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export type SwapOrderDetailsInput = {
  encodedOrder: Scalars['String']['input'];
  expiry: Scalars['Int']['input'];
  hash: Scalars['String']['input'];
  inputAmount: Scalars['String']['input'];
  inputToken: TokenAssetInput;
  offerer: Scalars['String']['input'];
  outputAmount: Scalars['String']['input'];
  outputToken: TokenAssetInput;
  status?: InputMaybe<SwapOrderStatus>;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export type SwapOrderStatus =
  | 'CANCELLED'
  | 'ERROR'
  | 'EXPIRED'
  | 'FILLED'
  | 'INSUFFICIENT_FUNDS'
  | 'OPEN';

export type SwapOrderType = 'DUTCH' | 'DUTCH_V2' | 'LIMIT' | 'PRIORITY';

export type TimestampedAmount = IAmount & {
  currency?: Maybe<Currency>;
  id: Scalars['ID']['output'];
  timestamp: Scalars['Int']['output'];
  value: Scalars['Float']['output'];
};

export type TimestampedOhlc = {
  close: Amount;
  high: Amount;
  id: Scalars['ID']['output'];
  low: Amount;
  open: Amount;
  timestamp: Scalars['Int']['output'];
};

export type TimestampedPoolPrice = {
  id: Scalars['ID']['output'];
  timestamp: Scalars['Int']['output'];
  token0Price: Scalars['Float']['output'];
  token1Price: Scalars['Float']['output'];
};

export type Token = IContract & {
  address?: Maybe<Scalars['String']['output']>;
  chain: Chain;
  decimals?: Maybe<Scalars['Int']['output']>;
  feeData?: Maybe<FeeData>;
  id: Scalars['ID']['output'];
  market?: Maybe<TokenMarket>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<TokenProject>;
  protectionInfo?: Maybe<ProtectionInfo>;
  standard?: Maybe<TokenStandard>;
  symbol?: Maybe<Scalars['String']['output']>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v4Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
};

export type TokenMarketArgs = {
  currency?: InputMaybe<Currency>;
};

export type TokenV2TransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type TokenV3TransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type TokenV4TransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type TokenAmount = {
  currency: Currency;
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type TokenAmountInput = {
  amount: Scalars['String']['input'];
  token: TokenInput;
};

export type TokenApproval = {
  approvedAddress: Scalars['String']['output'];
  /**   can be erc20 or native */
  asset: Token;
  id: Scalars['ID']['output'];
  quantity: Scalars['String']['output'];
  tokenStandard: TokenStandard;
};

export type TokenApprovalInput = {
  approvedAddress: Scalars['String']['input'];
  asset: TokenAssetInput;
  quantity: Scalars['String']['input'];
  tokenStandard: TokenStandard;
};

export type TokenAssetInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain: Chain;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  standard: TokenStandard;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

export type TokenBalance = {
  blockNumber?: Maybe<Scalars['Int']['output']>;
  blockTimestamp?: Maybe<Scalars['Int']['output']>;
  denominatedValue?: Maybe<Amount>;
  id: Scalars['ID']['output'];
  isHidden?: Maybe<Scalars['Boolean']['output']>;
  ownerAddress: Scalars['String']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  token?: Maybe<Token>;
  tokenProjectMarket?: Maybe<TokenProjectMarket>;
};

export type TokenInput = {
  address: Scalars['String']['input'];
  chainId: Scalars['Int']['input'];
  decimals: Scalars['Int']['input'];
  isNative: Scalars['Boolean']['input'];
};

export type TokenMarket = {
  fullyDilutedValuation?: Maybe<Amount>;
  historicalTvl?: Maybe<Array<Maybe<TimestampedAmount>>>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID']['output'];
  ohlc?: Maybe<Array<Maybe<TimestampedOhlc>>>;
  price?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  pricePercentChange?: Maybe<Amount>;
  priceSource: PriceSource;
  token: Token;
  totalValueLocked?: Maybe<Amount>;
  /**   this volume is cumulative volume over the specified duration */
  volume?: Maybe<Amount>;
};

export type TokenMarketHistoricalTvlArgs = {
  duration: HistoryDuration;
};

export type TokenMarketHistoricalVolumeArgs = {
  duration: HistoryDuration;
};

export type TokenMarketOhlcArgs = {
  duration: HistoryDuration;
};

export type TokenMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};

export type TokenMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type TokenMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};

export type TokenMarketVolumeArgs = {
  duration: HistoryDuration;
};

export type TokenProject = {
  description?: Maybe<Scalars['String']['output']>;
  descriptionTranslations?: Maybe<DescriptionTranslations>;
  homepageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSpam?: Maybe<Scalars['Boolean']['output']>;
  logo?: Maybe<Image>;
  /** @deprecated use logo */
  logoUrl?: Maybe<Scalars['String']['output']>;
  markets?: Maybe<Array<Maybe<TokenProjectMarket>>>;
  name?: Maybe<Scalars['String']['output']>;
  safetyLevel?: Maybe<SafetyLevel>;
  /** @deprecated use logo */
  smallLogo?: Maybe<Image>;
  spamCode?: Maybe<Scalars['Int']['output']>;
  tokens: Array<Token>;
  twitterName?: Maybe<Scalars['String']['output']>;
};

export type TokenProjectMarketsArgs = {
  currencies: Array<Currency>;
};

export type TokenProjectMarket = {
  currency: Currency;
  fullyDilutedValuation?: Maybe<Amount>;
  id: Scalars['ID']['output'];
  marketCap?: Maybe<Amount>;
  price?: Maybe<Amount>;
  priceHigh52w?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  priceLow52w?: Maybe<Amount>;
  pricePercentChange?: Maybe<Amount>;
  pricePercentChange24h?: Maybe<Amount>;
  tokenProject: TokenProject;
};

export type TokenProjectMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};

export type TokenProjectMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type TokenProjectMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};

export type TokenSortableField =
  | 'MARKET_CAP'
  | 'POPULARITY'
  | 'TOTAL_VALUE_LOCKED'
  | 'VOLUME';

export type TokenStandard = 'ERC20' | 'NATIVE';

export type TokenTradeInput = {
  permit?: InputMaybe<PermitInput>;
  routes?: InputMaybe<TokenTradeRoutesInput>;
  slippageToleranceBasisPoints?: InputMaybe<Scalars['Int']['input']>;
  tokenAmount: TokenAmountInput;
};

export type TokenTradeRouteInput = {
  inputAmount: TokenAmountInput;
  outputAmount: TokenAmountInput;
  pools: Array<TradePoolInput>;
};

export type TokenTradeRoutesInput = {
  mixedRoutes?: InputMaybe<Array<TokenTradeRouteInput>>;
  tradeType: TokenTradeType;
  v2Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
  v3Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
};

export type TokenTradeType = 'EXACT_INPUT' | 'EXACT_OUTPUT';

export type TokenTransfer = {
  asset: Token;
  direction: TransactionDirection;
  id: Scalars['ID']['output'];
  quantity: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  tokenStandard: TokenStandard;
  transactedValue?: Maybe<Amount>;
};

export type TokenTransferInput = {
  asset: TokenAssetInput;
  direction: TransactionDirection;
  quantity: Scalars['String']['input'];
  recipient: Scalars['String']['input'];
  sender: Scalars['String']['input'];
  tokenStandard: TokenStandard;
  transactedValue?: InputMaybe<AmountInput>;
};

export type TradePoolInput = {
  pair?: InputMaybe<PairInput>;
  pool?: InputMaybe<PoolInput>;
};

export type Transaction = {
  blockNumber: Scalars['Int']['output'];
  from: Scalars['String']['output'];
  gasLimit?: Maybe<Scalars['Float']['output']>;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxFeePerGas?: Maybe<Scalars['Float']['output']>;
  nonce: Scalars['Int']['output'];
  status: TransactionStatus;
  to: Scalars['String']['output'];
};

export type TransactionDetails = {
  application?: Maybe<ApplicationContract>;
  assetChanges: Array<Maybe<AssetChange>>;
  from: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  networkFee?: Maybe<NetworkFee>;
  nonce: Scalars['Int']['output'];
  /** @deprecated use transactionStatus to disambiguate from swapOrderStatus */
  status: TransactionStatus;
  to: Scalars['String']['output'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export type TransactionDetailsInput = {
  application?: InputMaybe<ApplicationContractInput>;
  assetChanges: Array<InputMaybe<AssetChangeInput>>;
  from: Scalars['String']['input'];
  hash: Scalars['String']['input'];
  nonce: Scalars['Int']['input'];
  status?: InputMaybe<TransactionStatus>;
  to: Scalars['String']['input'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export type TransactionDirection = 'IN' | 'OUT' | 'SELF';

export type TransactionNotification = {
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  push: Array<PushNotification>;
};

export type TransactionStatus = 'CONFIRMED' | 'FAILED' | 'PENDING';

export type TransactionType =
  | 'APPROVE'
  | 'BORROW'
  | 'BRIDGING'
  | 'CANCEL'
  | 'CLAIM'
  | 'DEPLOYMENT'
  | 'EXECUTE'
  | 'LEND'
  | 'MINT'
  | 'ON_RAMP'
  | 'RECEIVE'
  | 'REPAY'
  | 'SEND'
  | 'STAKE'
  | 'SWAP'
  | 'SWAP_ORDER'
  | 'UNKNOWN'
  | 'UNSTAKE'
  | 'WITHDRAW';

export type V2Pair = IPool & {
  address: Scalars['String']['output'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID']['output'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']['output']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']['output']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']['output']>;
};

export type V2PairCumulativeVolumeArgs = {
  duration: HistoryDuration;
};

export type V2PairHistoricalVolumeArgs = {
  duration: HistoryDuration;
};

export type V2PairPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type V2PairTransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type V3Pool = IPool & {
  address: Scalars['String']['output'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  cumulativeVolume?: Maybe<Amount>;
  feeTier?: Maybe<Scalars['Float']['output']>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID']['output'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  ticks?: Maybe<Array<Maybe<V3PoolTick>>>;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']['output']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']['output']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']['output']>;
};

export type V3PoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};

export type V3PoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};

export type V3PoolPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type V3PoolTicksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type V3PoolTransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type V3PoolTick = {
  id: Scalars['ID']['output'];
  liquidityGross?: Maybe<Scalars['String']['output']>;
  liquidityNet?: Maybe<Scalars['String']['output']>;
  price0?: Maybe<Scalars['String']['output']>;
  price1?: Maybe<Scalars['String']['output']>;
  tickIdx?: Maybe<Scalars['Int']['output']>;
};

export type V4Pool = {
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  cumulativeVolume?: Maybe<Amount>;
  feeTier?: Maybe<Scalars['Float']['output']>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  hook?: Maybe<V4PoolHook>;
  id: Scalars['ID']['output'];
  poolId: Scalars['String']['output'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  ticks?: Maybe<Array<Maybe<V4PoolTick>>>;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']['output']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']['output']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']['output']>;
};

export type V4PoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};

export type V4PoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};

export type V4PoolPriceHistoryArgs = {
  duration: HistoryDuration;
};

export type V4PoolTicksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type V4PoolTransactionsArgs = {
  first: Scalars['Int']['input'];
  timestampCursor?: InputMaybe<Scalars['Int']['input']>;
};

export type V4PoolHook = {
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type V4PoolTick = {
  id: Scalars['ID']['output'];
  liquidityGross?: Maybe<Scalars['String']['output']>;
  liquidityNet?: Maybe<Scalars['String']['output']>;
  price0?: Maybe<Scalars['String']['output']>;
  price1?: Maybe<Scalars['String']['output']>;
  tickIdx?: Maybe<Scalars['Int']['output']>;
};

export type AllV3TicksQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;

export type AllV3TicksQuery = {
  v3Pool?: {
    ticks?: Array<{
      liquidityNet?: string | null;
      price0?: string | null;
      price1?: string | null;
      tick?: number | null;
    } | null> | null;
  } | null;
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

export const AllV3TicksDocument = new TypedDocumentString(`
    query AllV3Ticks($chain: Chain!, $address: String!, $skip: Int, $first: Int) {
  v3Pool(chain: $chain, address: $address) {
    ticks(skip: $skip, first: $first) {
      tick: tickIdx
      liquidityNet
      price0
      price1
    }
  }
}
    `) as unknown as TypedDocumentString<
  AllV3TicksQuery,
  AllV3TicksQueryVariables
>;

import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../hooks/Token';
import { ChainId, cpGraphqlQuery } from '@dodoex/api';

export type FetchCPItem = ReturnType<
  NonNullable<typeof cpGraphqlQuery.fetchCPList.__apiType>
>['crowdPoolings']['0'];

export type CrowdpoolingDetail = any;

export const CP_STATUS = {
  WAITING: 'waiting',
  PROCESSING: 'processing',
  ENDED: 'ended',
  SETTLING: 'settling',
  CALMING: 'calming',
};

export const CP_OP_RANK = {
  Verified: 'Verified',
  Star: 'Star',
  Wild: 'Wild',
};

type valueof<T> = T[keyof T];
export type CPStatusType = valueof<typeof CP_STATUS>;

export interface FetchBidPosition_bidPositions {
  /**
   * user
   */
  user: {
    id: string;
  };
  /**
   * cp address
   */
  cp: {
    id: string;
  };
  /**
   * shares
   */
  shares: any;
  /**
   * total quote invested
   */
  investedQuote: any;
}
export interface Crowdpooling
  extends Omit<FetchCPItem, 'baseToken' | 'quoteToken' | 'settled'> {
  id: string;
  chainId: ChainId;
  status: CPStatusType;
  progress: number;
  bidPosition?: FetchBidPosition_bidPositions;
  bidStartTime: number;
  bidEndTime: number;
  calmEndTime: number;
  freezeDuration: number;
  personalPercentage: number;
  price: BigNumber;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  opRank?: string;
  isEscalation: boolean;
  initPrice: BigNumber;
  salesBase: BigNumber;
  weight?: number;
  hardcapPrice?: BigNumber;
  settled?: boolean;
  i: BigNumber;
  k: BigNumber;
}

export interface CPDetail extends Omit<Crowdpooling, 'personalPercentage'> {
  utilProtectionTime?: number;
  protectionDays?: string | number;
  salesRatio: BigNumber;
  sessionSupplyAmount: BigNumber;
  targetTakerTokenAmount: BigNumber;
}

export interface CPTokenDisplay {
  id: string;
  symbol: string;
  decimals?: number;
  showDecimals?: number;
  address?: string;
}

export interface CPDayData {
  date: number;
  investors: string;
  investedQuote: string;
  poolQuote: string;
  newcome: string;
  canceledQuote: string;
}

export interface CrowdpoolingOverviewItem {
  description: React.ReactNode;
  value: string | number;
  icon: React.ComponentType;
}

export interface LaunchItem {
  title: string;
  description: string;
}

export interface DashboardCard {
  totalBase: string;
  address: string;
  baseSymbol: string;
  quoteSymbol: string;
  quoteBaseRate: string;
  poolQuote: string;
  poolQuoteCap: string;
  chain: string;
}

export interface CrowdpoolingListItem {
  cp: CPDetail;
  progress: number;
}

export type CrowdpoolingTabType = 'all' | 'my';

export interface CrowdpoolingListProps {
  params?: {
    tab?: CrowdpoolingTabType;
  };
}

export interface SumCardProps {
  title: React.ReactNode;
  sum: string;
  icon: React.ComponentType;
}

export interface ListItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

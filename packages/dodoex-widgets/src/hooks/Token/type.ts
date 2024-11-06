export interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: any;
  readonly side?: 'from' | 'to';
}
export interface DefaultTokenInfo extends TokenInfo {
  amount?: number;
}

export type TokenList = TokenInfo[];

export enum TokenListType {
  All = 'all',
}

export enum ApprovalState {
  Loading = 'Loading',
  Insufficient = 'ApprovalInsufficient',
  Approving = 'Approving',
  Sufficient = 'Sufficient',
  Unchecked = 'Unchecked',
}

export enum BalanceState {
  Loading = 'Loading',
  Insufficient = 'BalanceInsufficient',
  Sufficient = 'Sufficient',
  Unchecked = 'Unchecked',
}

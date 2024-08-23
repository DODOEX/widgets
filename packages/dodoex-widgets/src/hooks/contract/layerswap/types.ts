export enum NetworkType {
  EVM = 'evm',
  Starknet = 'starknet',
  Solana = 'solana',
  Cosmos = 'cosmos',
  StarkEx = 'starkex', //TODO check this
  ZkSyncLite = 'zksynclite',
  TON = 'ton',
}

export interface Token {
  symbol: string;
  logo: string;
  //TODO may be plain string
  contract: string | null | undefined;
  decimals: number;
  price_in_usd: number;
  precision: number;
  listing_date: string;
  status?: 'active' | 'inactive' | 'not_found';
}

export interface Metadata {
  evm_oracle_contract?: `0x${string}` | null;
  evm_multicall_contract?: string | null;
  listing_date: string;
}

export interface Network {
  name: string;
  display_name: string;
  logo: string;
  chain_id: string | null;
  node_url: string;
  type: NetworkType;
  transaction_explorer_template: string;
  account_explorer_template: string;
  metadata: Metadata;
  deposit_methods: string[];
  token?: Token;
}

export interface Exchange {
  display_name: string;
  name: string;
  logo: string;
  token_groups: ExchangeToken[];
  metadata: {
    o_auth: {
      connect_url: string;
      authorize_url: string;
    } | null;
  };
}

export interface ExchangeNetwork {
  token: Token;
  network: Network;
  fee: {
    total_fee: number;
    total_fee_in_usd: number;
  };
}

export interface ExchangeToken {
  symbol: string;
  logo: string;
  status: 'active' | 'inactive' | 'not_found';
}

export enum SwapStatus {
  Created = 'created',

  UserTransferPending = 'user_transfer_pending',
  UserTransferDelayed = 'user_transfer_delayed',
  LsTransferPending = 'ls_transfer_pending',

  Completed = 'completed',
  Failed = 'failed',
  Expired = 'expired',
  Cancelled = 'cancelled',
}

export enum TransactionType {
  Input = 'input',
  Output = 'output',
  Refuel = 'refuel',
}

export enum BackendTransactionStatus {
  Completed = 'completed',
  Failed = 'failed',
  Initiated = 'initiated',
  Pending = 'pending',
}
export type Transaction = {
  type: TransactionType;
  from: string;
  to: string;
  created_date: string;
  amount: number;
  transaction_hash: string;
  confirmations: number;
  max_confirmations: number;
  usd_value: number;
  usd_price: number;
  status: BackendTransactionStatus;
  timestamp?: string;
};
export type SwapItem = {
  id: string;
  created_date: string;
  source_network: Network;
  source_token: Token;
  source_exchange?: Exchange;
  destination_network: Network;
  destination_token: Token;
  destination_exchange?: Exchange;
  status: SwapStatus;
  source_address: `0x${string}`;
  destination_address: `0x${string}`;
  requested_amount: number;
  use_deposit_address: boolean;
  transactions: Transaction[];
  exchange_account_connected: boolean;
  exchange_account_name?: string;
  fail_reason?: string;
  metadata: {
    reference_id: string | null;
    app: string | null;
    sequence_number: number;
  };
};

export type SwapQuote = {
  source_network?: Network;
  source_token?: Token;
  destination_network?: Network;
  destination_token?: Token;
  receive_amount: number;
  min_receive_amount: number;
  total_fee: number;
  total_fee_in_usd: number;
  blockchain_fee: number;
  service_fee: number;
  avg_completion_time: string;
  refuel_in_source?: number;
  slippage?: number;
};
export type Refuel = {
  network: Network;
  token: Token;
  amount: number;
  amount_in_usd: number;
};
export type SwapResponse = {
  swap: SwapItem;
  quote: SwapQuote;
  refuel?: Refuel;
};

export type DepositAction = {
  amount: number;
  amount_in_base_units: string;
  call_data: `0x${string}` | string;
  fee: any | null; //TODO: clarify this field type
  network: Network;
  order: number;
  to_address?: `0x${string}`;
  token: Token;
  fee_token: Token;
  type: 'transfer' | 'manual_transfer';
};

export type QuoteReward = {
  amount: number;
  amount_in_usd: number;
  token: Token;
  network: Network;
};
export type Quote = {
  quote: SwapQuote;
  refuel: Refuel;
  reward: QuoteReward;
};

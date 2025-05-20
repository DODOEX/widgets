import type { CaipNetwork } from '@reown/appkit-common';
import { btcSignet } from '../../../chainConfig/defineChain';

export type Interface = {
  getUTXOs: (params: GetUTXOsParams) => Promise<UTXO[]>;
};

export type GetUTXOsParams = {
  network: CaipNetwork;
  address: string;
};

export type UTXO = {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
};

export const BitcoinApi: Interface = {
  getUTXOs: async ({ network, address }: GetUTXOsParams): Promise<UTXO[]> => {
    const isSignet = network.caipNetworkId === btcSignet.caipNetworkId;
    // Make chain dynamic

    const response = await fetch(
      `https://mempool.space${isSignet ? '/signet' : ''}/api/address/${address}/utxo`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch UTXOs: ${await response.text()}`);
    }

    return (await response.json()) as UTXO[];
  },
};

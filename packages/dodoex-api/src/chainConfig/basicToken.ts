import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { ChainId } from './chain';

export const SOL_MINT_ADDRESS = PublicKey.default.toBase58();
export const WSOL_MINT_ADDRESS = NATIVE_MINT.toBase58();

export const basicTokenMap: {
  [key in ChainId]: {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    wrappedTokenSymbol: string;
    wrappedTokenAddress: string;
  };
} = {
  // solana
  [ChainId.SOON_TESTNET]: {
    address: SOL_MINT_ADDRESS,
    name: 'SOL',
    decimals: 9,
    symbol: 'SOL',
    wrappedTokenSymbol: 'WSOL',
    wrappedTokenAddress: WSOL_MINT_ADDRESS,
  },
  [ChainId.SOON]: {
    address: SOL_MINT_ADDRESS,
    name: 'Wrapped SOL',
    decimals: 9,
    symbol: 'SOL',
    wrappedTokenSymbol: 'WSOL',
    wrappedTokenAddress: WSOL_MINT_ADDRESS,
  },
};

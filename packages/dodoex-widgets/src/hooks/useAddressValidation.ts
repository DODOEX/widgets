import { ChainId } from '@dodoex/api';
import { getAddress } from '@ethersproject/address';
import { PublicKey } from '@solana/web3.js';
import * as bitcoin from 'bitcoinjs-lib';
import { useMemo } from 'react';
import { chainListMap } from '../constants/chainList';
import { SIGNET } from '../utils/btc';

// Stacks address validation regex
const STACKS_ADDRESS_REGEX = /^ST[0-9A-HJ-NP-Z]{39}$/;

// SUI address validation regex - 0x followed by 64 hex characters
const SUI_ADDRESS_REGEX = /^0x[a-fA-F0-9]{64}$/;

// TON address validation regex - base64-like format
const TON_ADDRESS_REGEX = /^[A-Za-z0-9_-]{48}$/;

export function useAddressValidation(address: string, chainId: ChainId) {
  return useMemo(() => {
    if (!address) return false;

    const chain = chainListMap.get(chainId);
    if (!chain) return false;

    try {
      if (chain.isEVMChain) {
        // EVM address validation
        return !!getAddress(address);
      } else if (chain.isSolanaChain) {
        // Solana address validation
        new PublicKey(address);
        return true;
      } else if (chain.isBTCChain) {
        // Check if it's a Stacks address first
        if (STACKS_ADDRESS_REGEX.test(address)) {
          return true;
        }

        // BTC address validation with checksum
        try {
          // Try to decode the address using bitcoinjs-lib
          // This will validate both the format and checksum
          if (chainId === ChainId.BTC_SIGNET) {
            bitcoin.address.toOutputScript(address, SIGNET);
          } else {
            bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
          }
          return true;
        } catch (error) {
          return false;
        }
      } else if (chain.isSUIChain) {
        // SUI address validation - must be 0x followed by 64 hex characters
        return SUI_ADDRESS_REGEX.test(address);
      } else if (chain.isTONChain) {
        // TON address validation - base64-like format
        return TON_ADDRESS_REGEX.test(address);
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [address, chainId]);
}

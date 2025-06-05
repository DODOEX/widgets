import { ChainId } from '@dodoex/api';
import { getAddress } from '@ethersproject/address';
import { PublicKey } from '@solana/web3.js';
import * as bitcoin from 'bitcoinjs-lib';
import { useMemo } from 'react';
import { chainListMap } from '../constants/chainList';
import { SIGNET } from '../utils/btc';

// Stacks address validation regex
const STACKS_ADDRESS_REGEX = /^ST[0-9A-HJ-NP-Z]{39}$/;

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
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [address, chainId]);
}

import { basicTokenMap } from '@dodoex/api';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { byWei } from '../../utils';
import { useSolanaWallet } from './useSolanaWallet';
import React from 'react';
import BigNumber from 'bignumber.js';

export function useSolanaConnection() {
  const wallet = useSolanaWallet();
  const { connection } = useConnection();

  const fetchETHBalance = async () => {
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const result = await connection.getBalance(wallet.publicKey);
    const amountBg = byWei(result, 9);
    return {
      amount: amountBg,
      decimals: 9,
      uiAmount: amountBg.toNumber(),
      uiAmountString: amountBg.toString(),
    };
  };

  const fetchTokenBalance = async (address: string) => {
    if (
      address.toLocaleLowerCase() ===
      basicTokenMap[1]?.address?.toLocaleLowerCase()
    ) {
      return fetchETHBalance();
    }
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const mintAccount = new PublicKey(address);
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      {
        mint: mintAccount,
      },
    );
    if (tokenAccounts.value.length === 0) {
      return {
        amount: new BigNumber(0),
      };
    }
    const tokenAccount = tokenAccounts.value?.[0]?.pubkey;
    const result = await connection.getTokenAccountBalance(tokenAccount);
    return {
      amount: byWei(result.value.amount, result.value.decimals),
      ...result,
    };
  };

  const fetchBlockNumber = React.useCallback(async () => {
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const result = await connection.getBlockHeight();
    return result;
  }, [connection, wallet]);

  return {
    fetchETHBalance,
    fetchTokenBalance,
    fetchBlockNumber,
  };
}

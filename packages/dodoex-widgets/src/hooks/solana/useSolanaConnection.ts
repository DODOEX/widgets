import { basicTokenMap, ChainId } from '@dodoex/api';
import { MintLayout } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import React from 'react';
import { byWei } from '../../utils/formatter';
import { TOKEN_METADATA_PROGRAM_ID } from '../raydium-sdk-V2/common/programId';
import { TokenInfo } from '../Token/type';
import { useSolanaWallet } from './useSolanaWallet';

export function useSolanaConnection() {
  const wallet = useSolanaWallet();
  const { connection } = useConnection();

  const fetchSOLBalance = async () => {
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
      basicTokenMap[ChainId.SOON_TESTNET]?.address?.toLocaleLowerCase()
    ) {
      return fetchSOLBalance();
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

  const fetchTokenInfo = async ({
    mint,
    chainId,
    symbol,
  }: {
    mint: string | PublicKey | undefined;
    chainId: ChainId;
    symbol?: string;
  }): Promise<TokenInfo> => {
    if (!mint) {
      throw new Error('please input mint');
    }
    const mintStr = mint.toString();

    if (
      mintStr.toLocaleUpperCase() === 'SOL' ||
      mintStr.toLowerCase() === basicTokenMap[chainId].address.toLowerCase()
    ) {
      return {
        ...basicTokenMap[chainId],
        chainId,
        symbol: symbol ?? basicTokenMap[chainId].symbol,
      };
    }

    const onlineInfo = await connection.getAccountInfo(new PublicKey(mintStr));
    if (!onlineInfo) {
      throw new Error(`mint address not found: ${mintStr}`);
    }
    const data = MintLayout.decode(onlineInfo.data);

    let mintSymbol = symbol ?? mintStr.toString().substring(0, 6);
    if (!symbol) {
      const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
      // 计算 metadata PDA
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          new PublicKey(TOKEN_METADATA_PROGRAM_ID).toBuffer(),
          mintPubkey.toBuffer(),
        ],
        new PublicKey(TOKEN_METADATA_PROGRAM_ID),
      );

      try {
        // 获取账户数据
        const accountInfo = await connection.getAccountInfo(metadataPDA);
        if (!accountInfo) {
          throw new Error('Metadata account not found');
        }

        // 跳过 key(1) + updateAuthority(32) + mint(32)
        let offset = 1 + 32 + 32;

        // 读取名称长度（4字节）
        const nameLength = accountInfo.data.readUInt32LE(offset);
        offset += 4;

        // 跳过名称
        offset += nameLength;

        // 读取 symbol 长度（4字节）
        const symbolLength = accountInfo.data.readUInt32LE(offset);
        offset += 4;

        // 读取 symbol
        const metaSymbol = accountInfo.data
          .slice(offset, offset + symbolLength)
          .toString('utf8')
          .trim();
        mintSymbol = metaSymbol;
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    }

    const fullInfo = {
      chainId,
      address: mintStr,
      programId: onlineInfo.owner.toBase58(),
      logoURI: '',
      symbol: mintSymbol,
      name: mintSymbol,
      decimals: data.decimals,
      tags: [],
      extensions: {},
      priority: 0,
      type: 'unknown',
    };
    return fullInfo;
  };

  return {
    fetchSOLBalance,
    fetchTokenBalance,
    fetchBlockNumber,
    fetchTokenInfo,
  };
}

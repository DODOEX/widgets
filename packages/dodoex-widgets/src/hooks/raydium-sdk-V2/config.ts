import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { rpcServerMap } from '../../constants/chains';
import { ChainId } from '../../widgets/PoolWidget/AMMV3/sdks/sdk-core';

// export const defaultConnection = new Connection(
//   rpcServerMap[ChainId.SOON_TESTNET][0],
// ); //<YOUR_RPC_URL>
// export const connection = new Connection(clusterApiUrl('mainnet-beta')) //<YOUR_RPC_URL>
export const txVersion = TxVersion.LEGACY;
// export const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = 'mainnet'; // 'mainnet' | 'devnet'
// const cluster = 'devnet' // 'mainnet' | 'devnet'

export const initSdk = async ({
  chainId,
  walletConnection,
  wallet,
}: {
  chainId: ChainId;
  walletConnection?: Connection;
  wallet?: ReturnType<typeof useWallet>;
}) => {
  const connection =
    walletConnection ?? new Connection(rpcServerMap[chainId][0]);

  if (connection.rpcEndpoint === clusterApiUrl('mainnet-beta')) {
    console.warn(
      'using free rpc node might cause unexpected error, strongly suggest uses paid rpc node',
    );
  }

  try {
    console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
    const raydium = await Raydium.load({
      owner: wallet?.publicKey ?? undefined,
      connection,
      cluster,
      disableFeatureCheck: true,
      disableLoadToken: true,
      blockhashCommitment: 'confirmed',
      // urlConfigs: {
      //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
      // },
      signAllTransactions: wallet?.signAllTransactions,
    });

    /**
     * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
     * if you want to handle token account by yourself, set token account data after init sdk
     * code below shows how to do it.
     * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
     */

    /*  
    raydium.account.updateTokenAccount(await fetchTokenAccountData())
    connection.onAccountChange(owner.publicKey, async () => {
      raydium!.account.updateTokenAccount(await fetchTokenAccountData())
    })
    */

    return raydium;
  } catch (error) {
    console.error('Failed to initialize Raydium SDK:', error);
    throw error;
  }
};

import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { rpcServerMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { useWallet } from '@solana/wallet-adapter-react';

export const connection = new Connection(rpcServerMap[ChainId.SOON_TESTNET][0]); //<YOUR_RPC_URL>
// export const connection = new Connection(clusterApiUrl('mainnet-beta')) //<YOUR_RPC_URL>
export const txVersion = TxVersion.LEGACY;
// export const txVersion = TxVersion.V0 // or TxVersion.LEGACY
const cluster = 'mainnet'; // 'mainnet' | 'devnet'
// const cluster = 'devnet' // 'mainnet' | 'devnet'

let raydium: Raydium | undefined;
export const initSdk = async ({
  connection,
  wallet,
}: {
  connection: Connection;
  wallet?: ReturnType<typeof useWallet>;
}) => {
  if (raydium) {
    return raydium;
  }
  if (connection.rpcEndpoint === clusterApiUrl('mainnet-beta'))
    console.warn(
      'using free rpc node might cause unexpected error, strongly suggest uses paid rpc node',
    );
  console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
  raydium = await Raydium.load({
    owner: wallet?.publicKey ?? undefined,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: true,
    blockhashCommitment: 'finalized',
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
};

import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

async function requestWallet(address: string, body: string, amount: string) {
  console.log('body:', body);
  const tx = Transaction.from(body);
  const seedPhrase = '钱包 seed';
  // console.log(address, body, amount)
  // const seed = await tonMnemonic.mnemonicToSeed(seedPhrase.split(' '));
  const keyPair = Ed25519Keypair.deriveKeypairFromSeed(
    Buffer.from(seedPhrase).toString('hex'),
  );
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const MY_ADDRESS = keyPair.getPublicKey().toSuiAddress();
  console.log('MY_ADDRESS:', MY_ADDRESS);
  // store the JSON representation for the SUI the address owns before using faucet
  const suiBefore = await suiClient.getBalance({
    owner: MY_ADDRESS,
  });
  console.log('余额：', suiBefore);
  const result = await suiClient.signAndExecuteTransaction({
    signer: keyPair,
    transaction: tx,
  });
  console.log('result:', result);
  return result.digest;
}

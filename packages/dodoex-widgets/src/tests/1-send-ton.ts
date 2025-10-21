import { mnemonicToWalletKey } from '@ton/crypto';
import {
  comment,
  internal,
  toNano,
  TonClient,
  WalletContractV3R2,
  WalletContractV4,
  WalletContractV5R1,
} from '@ton/ton';
import { SendMode } from '@ton/core';

async function main() {
  // Initializing tonClient for sending messages to blockchain
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY', //acquire it from: https://t.me/toncenter
  });

  // Using mnemonic to derive public and private keys
  // Replace with your own 24-word mnemonic from your wallet app
  const mnemonic =
    'swarm trumpet innocent empty faculty banner picnic unique major taste cigar slogan health neither diary monster jar scale multiply result biology champion genuine outside'.split(
      ' ',
    );
  const { publicKey, secretKey } = await mnemonicToWalletKey(mnemonic);

  // Creating wallet depending on version (v5r1 or v4 or V3R2), uncomment which version do you have
  const walletContract = WalletContractV5R1.create({
    walletId: { networkGlobalId: -3 },
    publicKey,
  }); // networkGlobalId: -3 for Testnet, -239 for Mainnet
  //const walletContract = WalletContractV4.create({ workchain: 0, publicKey });
  //const walletContract = WalletContractV3R2.create({ workchain: 0, publicKey });

  // Opening wallet with tonClient, which allows to send messages to blockchain
  const wallet = tonClient.open(walletContract);

  // Retrieving seqno used for replay protection
  const seqno = await wallet.getSeqno();

  // Sending transfer
  await wallet.sendTransfer({
    seqno,
    secretKey,
    messages: [
      internal({
        to: wallet.address, // Transfer will be made to the same wallet address
        body: comment('Hello from wallet!'), // Transfer will contain comment
        value: toNano(0.05), // Amount of TON, attached to transfer
      }),
    ],
    sendMode: SendMode.PAY_GAS_SEPARATELY | SendMode.IGNORE_ERRORS,
  });
}

main();

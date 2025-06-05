import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import type { WalletState } from '@dodoex/btc-connect-react';

bitcoin.initEccLib(ecc);

export const SIGNET = {
  bech32: 'tb',
  bip32: { private: 0x04358394, public: 0x043587cf },
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

export async function getMempoolUTXO(address: string) {
  const url = `https://mempool.space/testnet/api/address/${address}/utxo`;
  const res = await fetch(url);
  return await res.json();
}

export async function getMempoolTxDetail(txHash: string) {
  const url = `https://mempool.space/testnet/api/tx/${txHash}`;
  const res = await fetch(url);
  return await res.json();
}

export async function getSignetMempoolUTXO(address: string) {
  const url = `https://mempool.space/signet/api/address/${address}/utxo`;
  const res = await fetch(url);
  return await res.json();
}

export async function getSignetMempoolTxDetail(txHash: string) {
  const url = `https://mempool.space/signet/api/tx/${txHash}`;
  const res = await fetch(url);
  return await res.json();
}

const MAX_CHUNK_SIZE = 520; // 最大块大小

function splitIntoChunks(data: Buffer): Buffer[] {
  const chunks: Buffer[] = [];
  let offset = 0;

  while (offset < data.length) {
    const chunkSize = Math.min(MAX_CHUNK_SIZE, data.length - offset);
    const chunk = data.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
}

function compactSize(n: number) {
  if (n < 0xfd) return Buffer.from([n]);
  const buf = Buffer.alloc(3);
  buf.writeUInt8(0xfd, 0);
  buf.writeUInt16LE(n, 1);
  return buf;
}

function buildRevealWitness(leafScript: Buffer, controlBlock: Buffer) {
  const sig = Buffer.alloc(64);

  const stack = [sig, leafScript, controlBlock];
  const parts = [compactSize(stack.length)];
  for (const item of stack) {
    parts.push(compactSize(item.length));
    parts.push(item);
  }
  return Buffer.concat(parts);
}

// Signet 转账
export async function transferSignet({
  toAddress,
  amount,
  calldata,
  btcWallet,
  btcDepositFee,
}: {
  toAddress: string;
  amount: number;
  calldata: string;
  btcWallet: WalletState['btcWallet'];
  btcDepositFee: number;
}) {
  if (!btcWallet) {
    throw new Error('btcWallet is undefined');
  }

  const balance = btcWallet.balance.confirmed;
  console.log('btcWallet balance:', btcWallet.balance);

  console.log('btcWallet address:', btcWallet.address);

  console.log('btcWallet publicKey:', btcWallet.publicKey);
  const internalPubkey = Buffer.from(btcWallet.publicKey!.substr(2), 'hex');

  const inscriptionData = Buffer.from(calldata, 'hex');
  // 将数据分块
  const chunks = splitIntoChunks(inscriptionData);
  console.log('chunks:', chunks.length);

  /* leaf script */
  const leafScript = bitcoin.script.compile([
    internalPubkey,
    bitcoin.opcodes.OP_CHECKSIG,
    bitcoin.opcodes.OP_FALSE,
    bitcoin.opcodes.OP_IF,
    ...chunks.map((chunk) => chunk), // 将每个块作为单独的 push 操作
    bitcoin.opcodes.OP_ENDIF,
  ]);

  const scriptTree = {
    output: leafScript,
    redeemVersion: 192,
  };

  const scriptTaproot = bitcoin.payments.p2tr({
    internalPubkey,
    scriptTree,
    redeem: scriptTree,
    network: SIGNET,
  });
  console.log('scriptTaproot', scriptTaproot);
  const controlblock =
    scriptTaproot.witness?.[scriptTaproot.witness.length - 1].toString('hex');

  // 动态查询 UTXO
  let utxos = await getSignetMempoolUTXO(btcWallet.address!);
  console.log('utxos:', utxos.length);
  // 如果没有 UTXO，则无法进行转账，返回错误信息
  if (!utxos.length) return 'No UTXO';

  utxos = utxos.sort(
    (a: any, b: any) => a.status.block_time - b.status.block_time,
  );
  console.log(utxos);
  // 选择最后一个 UTXO 作为输入

  const psbt = new bitcoin.Psbt({ network: SIGNET });

  psbt.addOutput({
    script: scriptTaproot.output!,
    value: amount, // generally 1000 for nfts, 549 for brc20
  });
  let amountAll = 0;

  for (let i = 0; i < utxos.length; i++) {
    const u = utxos[i];
    const txDetail = await getSignetMempoolTxDetail(u.txid);
    console.log(i, txDetail);
    amountAll += u.value;
    psbt.addInput({
      hash: u.txid,
      index: u.vout,
      witnessUtxo: {
        script: Buffer.from(txDetail.vout[u.vout].scriptpubkey, 'hex'),
        value: u.value,
      },
    });
  }

  const fee = btcDepositFee;
  const change = amountAll - amount - fee;

  if (change < 0) {
    throw new Error('Insufficient funds');
  }

  console.log('change:', amountAll, change);
  // 添加找零
  psbt.addOutput({
    address: btcWallet.address!, // 找零地址
    value: change, // 金额
  });

  console.log('psbt.data.inputs:', psbt.data.inputs);

  const psbtHex = psbt.toHex();
  console.log('psbtHex:', psbtHex);

  const signPsbtResult = await btcWallet.signPsbt(psbtHex);
  console.log('signPsbtResult:', signPsbtResult);
  const tx = await btcWallet.pushPsbt(signPsbtResult);
  console.log('tx:', tx);

  const psbt2 = new bitcoin.Psbt({ network: SIGNET });

  const { output: commitScript } = bitcoin.payments.p2tr({
    internalPubkey,
    network: SIGNET,
    scriptTree: { output: leafScript },
  });

  psbt2.addInput({
    hash: tx,
    index: 0,
    tapLeafScript: [
      {
        controlBlock: Buffer.from(controlblock!, 'hex'),
        leafVersion: scriptTaproot.redeemVersion!,
        script: leafScript,
      },
    ],
    witnessUtxo: { script: commitScript!, value: amount },
  });

  const witness = buildRevealWitness(
    leafScript,
    Buffer.from(controlblock!, 'hex'),
  );
  const txOverhead = 10; // version+locktime
  const inputVbytes = 36 + 1 + 43 + Math.ceil(witness.length / 4); // txin + marker+flag + varint scriptSig len (0) + sequence + witness weight/4
  const outputVbytes = 31; // p2wpkh output (approx)
  const vsize = txOverhead + inputVbytes + outputVbytes;
  const feeRate = 10;
  const feeSat = Math.ceil(vsize * feeRate);
  const DUST_THRESHOLD_P2WPKH = 294;
  if (amount - feeSat < DUST_THRESHOLD_P2WPKH)
    throw new Error('reveal would be dust');

  psbt2.addOutput({ address: toAddress, value: amount - feeSat });

  const signPsbtResult2 = await btcWallet.signPsbt(psbt2.toHex(), {});
  console.log('signPsbtResult2:', signPsbtResult2);
  const tx2 = await btcWallet.pushPsbt(signPsbtResult2);
  console.log('tx2:', tx2);

  return tx;
}

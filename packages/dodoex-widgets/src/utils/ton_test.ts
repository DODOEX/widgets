import { mnemonicToPrivateKey } from '@ton/crypto';
import TonWeb from 'tonweb';

async function requestWallet(address: string, body: string, amount: string) {
  const seedPhrase = '钱包 seed';
  const keyPair1 = await mnemonicToPrivateKey(seedPhrase.split(' '));
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(
    new Uint8Array(keyPair1.secretKey),
  );

  const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'),
  );
  const wallet = new tonweb.wallet.all.v4R2(tonweb.provider, {
    publicKey: keyPair.publicKey,
  });
  const walltAddr = await wallet.getAddress();
  const walltAddress = walltAddr
    .toString(true, true, true)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  console.log('walltAddress:', walltAddress);

  const time = Date.now();
  const seqno = (await wallet.methods.seqno().call()) || 0;
  console.log('amount:', amount);
  const transfer = await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: address,
    amount: amount, // TonWeb.utils.toNano('0.1'), // 发送的 TON 数量
    seqno: seqno, // seqno
    // payload: TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(body)),
    payload: TonWeb.boc.Cell.oneFromBoc(body),
    sendMode: 1,
    expireAt: Math.floor(Date.now() / 1000) + 60,
  });

  const query = await transfer.getQuery();
  const hash = Buffer.from(await query.hash()).toString('hex');
  const boc = TonWeb.utils.bytesToBase64(await query.toBoc(false)); // serialized query
  const rr = await tonweb.provider.sendBoc(boc); // send query to network
  console.log('rr:', rr);
  return hash;
}

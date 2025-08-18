import BtcWalletConnect from 'btc-connect';
import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
// import { ecc } from './noble_ecc';
import ecc from '@bitcoinerlab/secp256k1';
import { sleep } from '@axelar-network/axelarjs-sdk';
import { bitcoinDecode } from './bitcoin_encode';

bitcoin.initEccLib(ecc);

const host = 'https://cross-chain-zetachain-server.gcp.dxd.ink';
// const host = 'http://127.0.0.1:8200';

// https://docs.unisat.io/dev/open-api-documentation/unisat-wallet#pushpsbt
export const executeRouteZetachainBtc = async () => {
  const btcWallet = new BtcWalletConnect({
    network: 'testnet', // or 'testnet'
    defaultConnectorId: 'unisat', // or 'okx'
  });

  // Connect to the wallet
  await btcWallet.connect();

  const fromChainId = 18333;
  const toChainId = 7001;
  const fromTokenAddress = 'Btc1111111111111111111111111111111111111111'; // btc
  const toTokenAddress = '0xdbfF6471a79E5374d771922F2194eccc42210B9F'; // zeta btc
  const fromAmount = '30000';
  const fromAddress = btcWallet.address;
  const toAddress = '0xF859Fb7F8811a5016e9A5380b497957343f40476';

  // const fromChainId = 18333;
  // const toChainId = 11155111;
  // const fromTokenAddress = 'Btc1111111111111111111111111111111111111111' // btc
  // const toTokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // sep usdc
  // const fromAmount = '200000'
  // const fromAddress = btcWallet.address;
  // const toAddress = '0xF859Fb7F8811a5016e9A5380b497957343f40476';

  const res = await axios.get(`${host}/api/cross_chain/routes`, {
    params: {
      fromChainId,
      fromAmount,
      fromTokenAddress,
      toChainId,
      toTokenAddress,
      fromAddress,
      toAddress,
      slippage: 0.5,
    },
  });
  console.log(res.data);
  if (res.data.code !== 0) {
    console.error('routes error', res.data);
    return;
  }

  const route = res.data.data;
  if (!route) {
    console.warn('无路由');
    return;
  }

  const encodeRes = await axios.post(
    `${host}/api/cross_chain/transaction/encode`,
    {
      data: route.encodeParams,
    },
  );
  console.log('encodeRes', encodeRes.data);

  const decodeRes = bitcoinDecode(encodeRes.data.data.data);
  console.log('decodeRes', decodeRes);
  const tx = await transferBitcoin(
    encodeRes.data.data.to,
    Number(fromAmount),
    encodeRes.data.data.data,
  );
  if (!tx) return;

  do {
    const createResult = await axios.post(
      `${host}/api/cross_chain/order/create`,
      {
        data: {
          ...route,
          fromHash: tx,
          calldata: encodeRes.data.data.data,
        },
      },
    );

    console.log('createResult:', createResult);
    if (createResult.data.code === 0) break;
    await sleep(1);
  } while (1);
};

const SIGNET = {
  bech32: 'tb',
  bip32: { private: 0x04358394, public: 0x043587cf },
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

// Bitcoin transfer (supports both mainnet and signet)
async function transferBitcoin(
  toAddress: string,
  amount: number,
  calldata: string,
) {
  console.log(toAddress, amount, calldata);
  const btcWallet = new BtcWalletConnect({
    network: 'testnet', // or 'testnet'
    defaultConnectorId: 'unisat', // or 'okx'
  });

  // Connect to the wallet
  await btcWallet.connect();

  const balance = btcWallet.balance.confirmed;
  console.log('btcWallet balance:', btcWallet.balance);

  console.log('btcWallet address:', btcWallet.address);

  console.log('btcWallet publicKey:', btcWallet.publicKey);
  const internalPubkey = Buffer.from(btcWallet.publicKey!.substr(2), 'hex');
  try {
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

    const fee = 450;
    const change = amountAll - amount - fee;
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
    // await psbt.signInput(0, keypair)

    // const signature = psbt.data.inputs![0].tapScriptSig![0].signature.toString('hex')

    // We have to construct our witness script in a custom finalizer

    // const customFinalizer = (_inputIndex, input) => {
    //   const witness = [input.tapScriptSig[0].signature]
    //     .concat(commitTxData.outputScript)
    //     .concat(tapLeafScript.controlBlock)

    //   return {
    //     finalScriptWitness: witnessStackToScriptWitness(witness),
    //   }
    // }

    // psbt.finalizeInput(0, customFinalizer)

    // const tx = psbt.extractTransaction()

    // const rawTx = tx.toBuffer().toString('hex')
    // const txId = tx.getId()

    // const virtualSize = tx.virtualSize()

    // const revelRawTx = {
    //   txId,
    //   rawTx,
    //   inscriptionId: `${txId}i0`,
    //   virtualSize,
    //   signature,
    // }
  } catch (error) {
    console.error(error);
  }
  // ---

  // const rawTxWithoutSignature = revelRawTx.rawTx.replace(revelRawTx.signature, '<SIGNATURE>')
  // expect(rawTxWithoutSignature).toEqual(
  //   '02000000000101b25fd6d5e135e5459ab7d5a5a71829701b95854ebeeac56fed57628f8a35e8d20100000000ffffffff012502000000000000225120c24e41b8ec4d091f9bfbb481fde7ce0808ed820db8e93409cc404da8b9de7e920340<SIGNATURE>4d20d734e09fc6ed105225ff316c6fa74f89096f90a437b1c7001af6d0b244d6f151ac0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38000748656c6c6f21216821c1d734e09fc6ed105225ff316c6fa74f89096f90a437b1c7001af6d0b244d6f15100000000'
  // )

  // try {
  //   const aliacAddress = btcWallet.address;
  //   const internalPubkey = Buffer.from(btcWallet.publicKey!.substr(2), 'hex');
  //   console.log("internalPubkey:", internalPubkey, internalPubkey.toString())
  //   const inscriptionData = Buffer.from(calldata, 'hex');
  //   // 将数据分块
  //   const chunks = splitIntoChunks(inscriptionData);
  //   console.log("chunks:", chunks.length)
  //   /* leaf script */
  //   const leafScript = bitcoin.script.compile([
  //     internalPubkey,
  //     bitcoin.opcodes.OP_CHECKSIG,
  //     bitcoin.opcodes.OP_FALSE,
  //     bitcoin.opcodes.OP_IF,
  //     ...chunks.map(chunk => chunk), // 将每个块作为单独的 push 操作
  //     bitcoin.opcodes.OP_ENDIF,
  //   ]);
  //   console.log("leafScript:", leafScript.length)
  //   /* p2tr */
  //   const LEAF_VERSION_TAPSCRIPT = 0xc0;
  //   const { output: commitScript, witness } = bitcoin.payments.p2tr({
  //     internalPubkey: internalPubkey,
  //     network: SIGNET,
  //     redeem: { output: leafScript, redeemVersion: LEAF_VERSION_TAPSCRIPT },
  //     scriptTree: { output: leafScript },
  //   });
  //   console.log("commitScript:", commitScript?.length)
  //   if (!commitScript || !witness) throw new Error('taproot build failed');

  //   // 动态查询 UTXO
  //   let utxos = await getSignetMempoolUTXO(aliacAddress!);
  //   console.log("utxos:", utxos.length)
  //   // 如果没有 UTXO，则无法进行转账，返回错误信息
  //   if (!utxos.length) {
  //     return 'No UTXO';
  //   }

  //   utxos = utxos.sort((a: any, b: any) => a.status.block_time - b.status.block_time);
  //   console.log(utxos)
  //   // 选择最后一个 UTXO 作为输入
  //   const utxoTarget = utxos[utxos.length - 1];
  //   console.log("utxoTarget:", utxoTarget)
  //   // UTXO 的交易哈希
  //   const utxoHash = utxoTarget.txid;
  //   // 查询 UTXO 对应的交易详情
  //   const txDetail = await getSignetMempoolTxDetail(utxoHash);
  //   console.log("txDetail:", txDetail)
  //   // 获取输出脚本的十六进制表示
  //   const scriptPubKeyHex = txDetail.vout[utxoTarget.vout].scriptpubkey;
  //   console.log("scriptPubKeyHex:", scriptPubKeyHex)
  //   // 创建一个新的 Psbt 实例 (Partially Signed Bitcoin Transaction)
  //   // 一个部分签名的比特币交易，被创建出来但还没有被完全签名的交易
  //   const psbt = new bitcoin.Psbt({
  //     network: bitcoin.networks.testnet,
  //   });

  //   psbt.addOutput({ address: toAddress, script: commitScript, value: amount });

  //   // 设置 gas
  //   const fee = 200;
  //   // 添加输入
  //   psbt.addInput({
  //     // UTXO 的交易哈希
  //     hash: utxoHash,
  //     // UTXO 的输出索引
  //     index: utxoTarget.vout,
  //     witnessUtxo: {
  //       // UTXO 的输出脚本
  //       script: Buffer.from(scriptPubKeyHex, 'hex'),
  //       // UTXO 的金额
  //       value: utxoTarget.value,
  //     }
  //   });

  //   // // 添加输出
  //   // psbt.addOutput({
  //   //   // 接收方地址
  //   //   address: toAddress,
  //   //   // 金额
  //   //   value: amount,
  //   // });
  //   // 计算找零
  //   const change = utxoTarget.value - amount - fee;
  //   console.log("change:", change)
  //   // 添加找零
  //   psbt.addOutput({
  //     // 找零地址
  //     address: aliacAddress!,
  //     // 金额
  //     value: change,
  //   });
  //   const psbtHex = psbt.toHex();
  //   console.log("psbtHex:", psbtHex)

  //   const signPsbtResult = await btcWallet.signPsbt(psbtHex, {});
  //   console.log("ares:", signPsbtResult)
  //   const tx = await btcWallet.pushPsbt(signPsbtResult);
  //   console.log("tx:", tx)
  //   // const tx2 = await btcWallet.pushPsbt(signPsbtResult[1]);
  //   // console.log("tx2:", tx2)
  // }
  // catch (e) {
  //   console.error('transfer error: ', e);
  // }
}

// // Signet 转账
// async function transferSignet(toAddress: string, amount: number, calldata: string) {
//   console.log(toAddress, amount, calldata)
//   const btcWallet = new BtcWalletConnect({
//     network: 'testnet', // or 'testnet'
//     defaultConnectorId: 'unisat', // or 'okx'
//   });

//   // Connect to the wallet
//   await btcWallet.connect()

//   const balance = btcWallet.balance.confirmed;
//   console.log("btcWallet balance:", btcWallet.balance);

//   console.log("btcWallet address:", btcWallet.address);

//   console.log("btcWallet publicKey:", btcWallet.publicKey);

//   try {
//     const aliacAddress = btcWallet.address;
//     const internalPubkey = Buffer.from(btcWallet.publicKey!.substr(2), 'hex');
//     console.log("internalPubkey:", internalPubkey, internalPubkey.toString())
//     const inscriptionData = Buffer.from(calldata, 'hex');
//     // 将数据分块
//     const chunks = splitIntoChunks(inscriptionData);
//     console.log("chunks:", chunks.length)
//     /* leaf script */
//     const leafScript = bitcoin.script.compile([
//       internalPubkey,
//       bitcoin.opcodes.OP_CHECKSIG,
//       bitcoin.opcodes.OP_FALSE,
//       bitcoin.opcodes.OP_IF,
//       ...chunks.map(chunk => chunk), // 将每个块作为单独的 push 操作
//       bitcoin.opcodes.OP_ENDIF,
//     ]);
//     console.log("leafScript:", leafScript.length)
//     /* p2tr */
//     const LEAF_VERSION_TAPSCRIPT = 0xc0;
//     const { output: commitScript, witness } = bitcoin.payments.p2tr({
//       internalPubkey: internalPubkey,
//       network: SIGNET,
//       redeem: { output: leafScript, redeemVersion: LEAF_VERSION_TAPSCRIPT },
//       scriptTree: { output: leafScript },
//     });
//     console.log("commitScript:", commitScript?.length)
//     if (!commitScript || !witness) throw new Error('taproot build failed');

//     // 动态查询 UTXO
//     let utxos = await getSignetMempoolUTXO(aliacAddress!);
//     console.log("utxos:", utxos.length)
//     // 如果没有 UTXO，则无法进行转账，返回错误信息
//     if (!utxos.length) {
//       return 'No UTXO';
//     }

//     utxos = utxos.sort((a: any, b: any) => a.status.block_time - b.status.block_time);
//     console.log(utxos)
//     // 选择最后一个 UTXO 作为输入
//     const utxoTarget = utxos[utxos.length - 1];
//     console.log("utxoTarget:", utxoTarget)
//     // UTXO 的交易哈希
//     const utxoHash = utxoTarget.txid;
//     // 查询 UTXO 对应的交易详情
//     const txDetail = await getSignetMempoolTxDetail(utxoHash);
//     console.log("txDetail:", txDetail)
//     // 获取输出脚本的十六进制表示
//     const scriptPubKeyHex = txDetail.vout[utxoTarget.vout].scriptpubkey;
//     console.log("scriptPubKeyHex:", scriptPubKeyHex)
//     // 创建一个新的 Psbt 实例 (Partially Signed Bitcoin Transaction)
//     // 一个部分签名的比特币交易，被创建出来但还没有被完全签名的交易
//     const psbt = new bitcoin.Psbt({
//       network: bitcoin.networks.testnet,
//     });

//     psbt.addOutput({ address: toAddress, script: commitScript, value: amount });

//     // 设置 gas
//     const fee = 200;
//     // 添加输入
//     psbt.addInput({
//       // UTXO 的交易哈希
//       hash: utxoHash,
//       // UTXO 的输出索引
//       index: utxoTarget.vout,
//       witnessUtxo: {
//         // UTXO 的输出脚本
//         script: Buffer.from(scriptPubKeyHex, 'hex'),
//         // UTXO 的金额
//         value: utxoTarget.value,
//       }
//     });

//     // // 添加输出
//     // psbt.addOutput({
//     //   // 接收方地址
//     //   address: toAddress,
//     //   // 金额
//     //   value: amount,
//     // });
//     // 计算找零
//     const change = utxoTarget.value - amount - fee;
//     console.log("change:", change)
//     // 添加找零
//     psbt.addOutput({
//       // 找零地址
//       address: aliacAddress!,
//       // 金额
//       value: change,
//     });
//     const psbtHex = psbt.toHex();
//     console.log("psbtHex:", psbtHex)

//     // const psbt2 = new bitcoin.Psbt({
//     //   network: bitcoin.networks.testnet,
//     // });
//     // console.log("11111:")

//     // const { output: commitScript2 } = bitcoin.payments.p2tr({
//     //   internalPubkey: internalPubkey,
//     //   network: SIGNET,
//     //   scriptTree: { output: leafScript },
//     // });
//     // console.log("22222:")
//     // psbt2.addInput({
//     //   hash: utxoHash,
//     //   index: utxoTarget.vout,
//     //   tapLeafScript: [
//     //     {
//     //       controlBlock: witness[witness.length - 1],
//     //       leafVersion: LEAF_VERSION_TAPSCRIPT,
//     //       script: leafScript,
//     //     },
//     //   ],
//     //   witnessUtxo: { script: commitScript2!, value: amount },
//     // });
//     // console.log("33333:")
//     // const feeRate = 10;
//     // const revealWitness = buildRevealWitness(leafScript, witness[witness.length - 1]);
//     // const txOverhead = 10; // version+locktime
//     // const inputVbytes = 36 + 1 + 43 + Math.ceil(revealWitness.length / 4); // txin + marker+flag + varint scriptSig len (0) + sequence + witness weight/4
//     // const outputVbytes = 31; // p2wpkh output (approx)
//     // const vsize = txOverhead + inputVbytes + outputVbytes;
//     // const feeSat = Math.ceil(vsize * feeRate);
//     // const DUST_THRESHOLD_P2WPKH = 294;
//     // console.log("amount:", amount, feeSat, DUST_THRESHOLD_P2WPKH)
//     // if (amount - feeSat < DUST_THRESHOLD_P2WPKH) throw new Error('reveal would be dust');

//     // psbt2.addOutput({ address: toAddress, value: amount - feeSat });
//     // const psbt2Hex = psbt2.toHex();
//     // console.log("psbt2Hex:", psbt2Hex)

//     const signPsbtResult = await btcWallet.signPsbt(psbtHex, {});
//     console.log("ares:", signPsbtResult)
//     const tx = await btcWallet.pushPsbt(signPsbtResult);
//     console.log("tx:", tx)
//     // const tx2 = await btcWallet.pushPsbt(signPsbtResult[1]);
//     // console.log("tx2:", tx2)
//   }
//   catch (e) {
//     console.error('transfer error: ', e);
//   }
// }

// testnet 转账
async function transferTestnet(toAddress: string, amount: number) {
  const btcWallet = new BtcWalletConnect({
    network: 'testnet', // or 'testnet'
    defaultConnectorId: 'unisat', // or 'okx'
  });

  // Connect to the wallet
  await btcWallet.connect();

  const balance = btcWallet.balance.confirmed;
  console.log('btcWallet balance:', btcWallet.balance);

  console.log('btcWallet address:', btcWallet.address);

  console.log('btcWallet publicKey:', btcWallet.publicKey);

  try {
    const aliacAddress = btcWallet.address;
    console.log('aliacAddress:', aliacAddress);

    // 动态查询 UTXO
    const utxo = await getMempoolUTXO(aliacAddress!);
    console.log('utxo:', utxo.length);
    // 如果没有 UTXO，则无法进行转账，返回错误信息
    if (!utxo.length) {
      return 'No UTXO';
    }
    // 选择最后一个 UTXO 作为输入
    const utxoTarget = utxo[utxo.length - 1];
    console.log('utxoTarget:', utxoTarget);
    // UTXO 的交易哈希
    const utxoHash = utxoTarget.txid;
    // 查询 UTXO 对应的交易详情
    const txDetail = await getMempoolTxDetail(utxoHash);
    console.log('txDetail:', txDetail);
    // 获取输出脚本的十六进制表示
    const scriptPubKeyHex = txDetail.vout[utxoTarget.vout].scriptpubkey;
    console.log('scriptPubKeyHex:', scriptPubKeyHex);
    // 创建一个新的 Psbt 实例 (Partially Signed Bitcoin Transaction)
    // 一个部分签名的比特币交易，被创建出来但还没有被完全签名的交易
    const psbt = new bitcoin.Psbt({
      network: bitcoin.networks.testnet,
    });
    // 设置 gas
    const fee = 150;
    // 添加输入
    psbt.addInput({
      // UTXO 的交易哈希
      hash: utxoHash,
      // UTXO 的输出索引
      index: utxoTarget.vout,
      witnessUtxo: {
        // UTXO 的输出脚本
        script: Buffer.from(scriptPubKeyHex, 'hex'),
        // UTXO 的金额
        value: utxoTarget.value,
      },
    });
    // 添加输出
    psbt.addOutput({
      // 接收方地址
      address: toAddress,
      // 金额
      value: amount,
    });
    // 计算找零
    const change = utxoTarget.value - amount - fee;
    console.log('change:', change);
    // 添加找零
    psbt.addOutput({
      // 找零地址
      address: aliacAddress!,
      // 金额
      value: change,
    });
    console.log('psbt:', JSON.stringify(psbt));
    const tx11 = psbt.toHex();
    console.log('tx11:', tx11);

    const signPsbtResult = await btcWallet.signPsbt(tx11, {
      // autoFinalized: true,
      // toSignInputs: [{
      //   index: 0,
      //   publicKey: btcWallet.publicKey
      // }]
    });
    console.log('ares:', signPsbtResult);
    const tx = await btcWallet.pushPsbt(signPsbtResult);
    console.log('tx:', tx);
  } catch (e) {
    console.error('transfer error: ', e);
  }
}

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

import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import type { WalletState } from '@dodoex/btc-connect-react';

bitcoin.initEccLib(ecc);

/**
 * 比特币费率配置
 * 默认使用 3 聪/虚拟字节作为最快费率
 * 这是一个平衡速度和成本的设置
 */
const DEFAULT_FASTEST_FEE_RATE = 3; // 默认最快费率
const DEFAULT_HALF_HOUR_FEE_RATE = 2; // 默认中等费率
const DEFAULT_ECONOMY_FEE_RATE = 1; // 默认经济费率

// 获取实时费率估算
async function getFeeRateEstimate(isSignet: boolean = true) {
  try {
    const baseUrl = isSignet
      ? 'https://mempool.space/signet'
      : 'https://mempool.space';
    const response = await fetch(`${baseUrl}/api/v1/fees/recommended`);
    const data = await response.json();

    // 返回最快费率（fastest fee rate），确保快速确认
    return data.fastestFee || DEFAULT_FASTEST_FEE_RATE; // 如果没有最快费率，使用默认值
  } catch (error) {
    console.warn('Failed to fetch fee rate, using fallback:', error);
    return DEFAULT_FASTEST_FEE_RATE; // 降级到默认费率
  }
}

// 获取更详细的费率信息
async function getDetailedFeeRates(isSignet: boolean = true) {
  try {
    const baseUrl = isSignet
      ? 'https://mempool.space/signet'
      : 'https://mempool.space';
    const response = await fetch(`${baseUrl}/api/v1/fees/recommended`);
    const data = await response.json();

    return {
      fastestFee: data.fastestFee || DEFAULT_FASTEST_FEE_RATE, // 最快确认
      halfHourFee: data.halfHourFee || DEFAULT_HALF_HOUR_FEE_RATE, // 30分钟内确认
      economyFee: data.economyFee || DEFAULT_ECONOMY_FEE_RATE, // 经济费率
      minimumFee: data.minimumFee || DEFAULT_ECONOMY_FEE_RATE, // 最低费率
    };
  } catch (error) {
    console.warn('Failed to fetch detailed fee rates, using fallback:', error);
    return {
      fastestFee: DEFAULT_FASTEST_FEE_RATE,
      halfHourFee: DEFAULT_HALF_HOUR_FEE_RATE,
      economyFee: DEFAULT_ECONOMY_FEE_RATE,
      minimumFee: DEFAULT_ECONOMY_FEE_RATE,
    };
  }
}

// 计算最优费率（考虑网络拥堵情况）
async function calculateOptimalFeeRate(
  amount: number,
  isSignet: boolean = true,
) {
  const feeRates = await getDetailedFeeRates(isSignet);

  // 优先使用最快费率，确保交易快速确认
  return feeRates.fastestFee;
}

// 获取最快费率，确保交易快速确认
async function getFastestFeeRate(isSignet: boolean = true) {
  try {
    const baseUrl = isSignet
      ? 'https://mempool.space/signet'
      : 'https://mempool.space';
    const response = await fetch(`${baseUrl}/api/v1/fees/recommended`);
    const data = await response.json();

    return data.fastestFee || DEFAULT_FASTEST_FEE_RATE;
  } catch (error) {
    console.warn('Failed to fetch fastest fee rate, using fallback:', error);
    return DEFAULT_FASTEST_FEE_RATE;
  }
}

// 获取经济费率（用于对比）
async function getEconomyFeeRate(isSignet: boolean = true) {
  try {
    const baseUrl = isSignet
      ? 'https://mempool.space/signet'
      : 'https://mempool.space';
    const response = await fetch(`${baseUrl}/api/v1/fees/recommended`);
    const data = await response.json();

    return data.economyFee || DEFAULT_ECONOMY_FEE_RATE;
  } catch (error) {
    console.warn('Failed to fetch economy fee rate, using fallback:', error);
    return DEFAULT_ECONOMY_FEE_RATE;
  }
}

export const SIGNET = {
  bech32: 'tb',
  bip32: { private: 0x04358394, public: 0x043587cf },
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

async function getSignetMempoolUTXO(address: string, isSignet: boolean) {
  const url = `https://mempool.space${isSignet ? '/signet' : ''}/api/address/${address}/utxo`;
  const res = await fetch(url);
  return await res.json();
}

async function getSignetMempoolTxDetail(txHash: string, isSignet: boolean) {
  const url = `https://mempool.space${isSignet ? '/signet' : ''}/api/tx/${txHash}`;
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

// 计算第一笔交易的虚拟大小
function calculateFirstTxVsize(
  utxoCount: number,
  inscriptionDataSize: number,
  hasChangeOutput: boolean = true,
) {
  // 交易开销
  const txOverhead = 10; // version(4) + locktime(4) + marker(1) + flag(1)

  // 输入部分
  const inputOverhead = 1; // varint for input count
  const inputSize = 36 + 1 + 4; // txid(32) + vout(4) + sequence(4) + varint(1)
  const witnessOverhead = 1; // varint for witness count
  const witnessSize = 64 + 1; // signature(64) + varint(1)
  const totalInputSize =
    inputOverhead + (inputSize + witnessOverhead + witnessSize) * utxoCount;

  // 输出部分
  const outputOverhead = 1; // varint for output count
  const outputCount = hasChangeOutput ? 2 : 1; // 铭文输出 + 找零输出

  // 铭文输出（Taproot）
  const inscriptionOutputSize = 8 + 1 + 34; // value(8) + varint(1) + p2tr script(34)

  // 找零输出（P2WPKH）
  const changeOutputSize = 8 + 1 + 22; // value(8) + varint(1) + p2wpkh script(22)

  const totalOutputSize =
    outputOverhead +
    inscriptionOutputSize +
    (hasChangeOutput ? changeOutputSize : 0);

  // 铭文数据大小（按4:1比例计算虚拟字节）
  const inscriptionVsize = Math.ceil(inscriptionDataSize / 4);

  const totalVsize =
    txOverhead + totalInputSize + totalOutputSize + inscriptionVsize;

  console.log('First transaction vsize calculation:', {
    txOverhead,
    totalInputSize,
    totalOutputSize,
    inscriptionVsize,
    totalVsize,
    utxoCount,
    inscriptionDataSize,
  });

  return totalVsize;
}

// 更精确的第一笔交易费用计算
async function calculateFirstTxFee(
  utxoCount: number,
  inscriptionDataSize: number,
  isSignetNetwork: boolean,
  hasChangeOutput: boolean = true,
) {
  const vsize = calculateFirstTxVsize(
    utxoCount,
    inscriptionDataSize,
    hasChangeOutput,
  );
  const feeRate = await getFastestFeeRate(isSignetNetwork);
  const fee = Math.ceil(vsize * feeRate);

  console.log('First transaction fee calculation (using fastest fee):', {
    vsize,
    feeRate,
    fee,
  });

  return { vsize, feeRate, fee };
}

// Bitcoin transfer (supports both mainnet and signet)
export async function transferBitcoin({
  toAddress,
  amount,
  calldata,
  btcWallet,
  btcDepositFee,
  isTestNet,
}: {
  toAddress: string;
  amount: number;
  calldata: string;
  btcWallet: WalletState['btcWallet'];
  btcDepositFee: number;
  isTestNet: boolean;
}) {
  if (!btcWallet) {
    throw new Error('btcWallet is undefined');
  }

  const balance = btcWallet.balance.confirmed;
  console.log('btcWallet balance:', btcWallet.balance);

  console.log('btcWallet address:', btcWallet.address);

  console.log('btcWallet publicKey:', btcWallet.publicKey);
  const internalPubkey = Buffer.from(btcWallet.publicKey!.substr(2), 'hex');

  // Detect network from address prefix
  const isMainnet = btcWallet.address!.startsWith('bc1');
  const network = isMainnet ? bitcoin.networks.bitcoin : SIGNET;
  const isSignetNetwork = !isMainnet;

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
    network: network,
  });
  console.log('scriptTaproot', scriptTaproot);
  const controlblock =
    scriptTaproot.witness?.[scriptTaproot.witness.length - 1].toString('hex');

  // 动态查询 UTXO
  let utxos = await getSignetMempoolUTXO(btcWallet.address!, isSignetNetwork);
  console.log('utxos:', utxos.length);
  // 如果没有 UTXO，则无法进行转账，返回错误信息
  if (!utxos.length) {
    console.error('No UTXO', utxos, btcWallet.address, isSignetNetwork);
    throw new Error('No UTXO');
  }

  utxos = utxos.sort(
    (a: any, b: any) => a.status.block_time - b.status.block_time,
  );
  console.log(utxos);
  // 选择最后一个 UTXO 作为输入

  const psbt = new bitcoin.Psbt({ network: network });

  psbt.addOutput({
    script: scriptTaproot.output!,
    value: amount, // generally 1000 for nfts, 549 for brc20
  });
  let amountAll = 0;

  for (let i = 0; i < utxos.length; i++) {
    const u = utxos[i];
    const txDetail = await getSignetMempoolTxDetail(u.txid, isSignetNetwork);
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

  // 为第一笔交易计算动态费用
  const inscriptionDataSize = inscriptionData.length;
  const hasChangeOutput = amountAll - amount > 546; // 如果找零大于粉尘阈值，则添加找零输出

  const {
    vsize: firstTxVsize,
    feeRate: firstTxFeeRate,
    fee,
  } = await calculateFirstTxFee(
    utxos.length,
    inscriptionDataSize,
    isSignetNetwork,
    hasChangeOutput,
  );

  console.log(
    'First transaction fee:',
    fee,
    'sat (rate:',
    firstTxFeeRate,
    'sat/vB, vsize:',
    firstTxVsize,
    'vB)',
  );

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
  // const tx = 'd717d331cf091910791f658c72789a0d08b88148a32c86592e49563d54365124';
  console.log('tx:', tx);

  const psbt2 = new bitcoin.Psbt({ network: network });

  const { output: commitScript } = bitcoin.payments.p2tr({
    internalPubkey,
    network: network,
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

  // 获取实时费率估算 - 使用智能费率选择
  const feeRate = await calculateOptimalFeeRate(amount, isSignetNetwork);
  console.log('Optimal fee rate:', feeRate, 'sat/vB');

  const feeSat = Math.ceil(vsize * feeRate);
  console.log('Transaction vsize:', vsize, 'vB, Fee:', feeSat, 'sat');

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

// 导出费率估算功能供外部使用
export async function getBitcoinFeeEstimate(
  amount: number,
  isSignet: boolean = true,
) {
  const feeRates = await getDetailedFeeRates(isSignet);
  const optimalRate = await calculateOptimalFeeRate(amount, isSignet);

  return {
    feeRates,
    optimalRate,
    estimatedFee: (vsize: number) => Math.ceil(vsize * optimalRate),
  };
}

// 使用示例：展示不同的费率选择策略
export async function demonstrateFeeRateOptions(isSignet: boolean = true) {
  console.log('=== 费率估算示例 ===');

  // 1. 获取所有可用的费率
  const allRates = await getDetailedFeeRates(isSignet);
  console.log('所有可用费率:', allRates);

  // 2. 智能费率选择示例
  const smallAmount = 50000; // 0.0005 BTC
  const mediumAmount = 500000; // 0.005 BTC
  const largeAmount = 5000000; // 0.05 BTC

  const smallRate = await calculateOptimalFeeRate(smallAmount, isSignet);
  const mediumRateOptimal = await calculateOptimalFeeRate(
    mediumAmount,
    isSignet,
  );
  const largeRate = await calculateOptimalFeeRate(largeAmount, isSignet);

  console.log('小额交易(0.0005 BTC)最快费率:', smallRate, 'sat/vB');
  console.log('中额交易(0.005 BTC)最快费率:', mediumRateOptimal, 'sat/vB');
  console.log('大额交易(0.05 BTC)最快费率:', largeRate, 'sat/vB');

  // 3. 费用计算示例
  const vsize = 150; // 示例交易大小
  console.log('交易大小:', vsize, 'vB');
  console.log('小额交易费用:', Math.ceil(vsize * smallRate), 'sat');
  console.log('中额交易费用:', Math.ceil(vsize * mediumRateOptimal), 'sat');
  console.log('大额交易费用:', Math.ceil(vsize * largeRate), 'sat');
}

// 展示不同场景下的虚拟大小计算
export function demonstrateVsizeCalculation() {
  console.log('=== 虚拟大小计算示例 ===');

  const scenarios = [
    {
      name: '小额铭文 (1KB)',
      utxoCount: 1,
      inscriptionDataSize: 1024,
      hasChangeOutput: true,
    },
    {
      name: '中额铭文 (10KB)',
      utxoCount: 2,
      inscriptionDataSize: 10240,
      hasChangeOutput: true,
    },
    {
      name: '大额铭文 (50KB)',
      utxoCount: 3,
      inscriptionDataSize: 51200,
      hasChangeOutput: true,
    },
    {
      name: '无找零输出',
      utxoCount: 1,
      inscriptionDataSize: 1024,
      hasChangeOutput: false,
    },
  ];

  scenarios.forEach((scenario) => {
    const vsize = calculateFirstTxVsize(
      scenario.utxoCount,
      scenario.inscriptionDataSize,
      scenario.hasChangeOutput,
    );

    console.log(`${scenario.name}:`, {
      utxoCount: scenario.utxoCount,
      inscriptionDataSize: scenario.inscriptionDataSize,
      hasChangeOutput: scenario.hasChangeOutput,
      vsize,
      estimatedFee: {
        'economyFee (1 sat/vB)': Math.ceil(vsize * 1),
        'halfHourFee (2 sat/vB)': Math.ceil(vsize * 2),
        'fastestFee (3+ sat/vB)': Math.ceil(vsize * 3),
        'highPriority (10 sat/vB)': Math.ceil(vsize * 10),
      },
    });
  });
}

// 虚拟大小计算详解
export function explainVsizeCalculation() {
  console.log('=== 虚拟大小计算详解 ===');

  // 示例：1个UTXO，1KB铭文数据，有找零输出
  const utxoCount = 1;
  const inscriptionDataSize = 1024;
  const hasChangeOutput = true;

  console.log('计算参数:', {
    utxoCount,
    inscriptionDataSize,
    hasChangeOutput,
  });

  // 详细计算过程
  const txOverhead = 10; // version(4) + locktime(4) + marker(1) + flag(1)
  console.log('1. 交易开销:', txOverhead, '字节');

  const inputOverhead = 1; // varint for input count
  const inputSize = 36 + 1 + 4; // txid(32) + vout(4) + sequence(4) + varint(1)
  const witnessOverhead = 1; // varint for witness count
  const witnessSize = 64 + 1; // signature(64) + varint(1)
  const totalInputSize =
    inputOverhead + (inputSize + witnessOverhead + witnessSize) * utxoCount;
  console.log('2. 输入部分:', totalInputSize, '字节');
  console.log('   - 输入开销:', inputOverhead, '字节');
  console.log(
    '   - 每个输入:',
    inputSize + witnessOverhead + witnessSize,
    '字节',
  );
  console.log('   - 总输入大小:', totalInputSize, '字节');

  const outputOverhead = 1; // varint for output count
  const inscriptionOutputSize = 8 + 1 + 34; // value(8) + varint(1) + p2tr script(34)
  const changeOutputSize = 8 + 1 + 22; // value(8) + varint(1) + p2wpkh script(22)
  const totalOutputSize =
    outputOverhead +
    inscriptionOutputSize +
    (hasChangeOutput ? changeOutputSize : 0);
  console.log('3. 输出部分:', totalOutputSize, '字节');
  console.log('   - 输出开销:', outputOverhead, '字节');
  console.log('   - 铭文输出:', inscriptionOutputSize, '字节');
  console.log('   - 找零输出:', hasChangeOutput ? changeOutputSize : 0, '字节');

  const inscriptionVsize = Math.ceil(inscriptionDataSize / 4);
  console.log(
    '4. 铭文数据虚拟字节:',
    inscriptionVsize,
    '字节 (原始数据:',
    inscriptionDataSize,
    '字节)',
  );

  const totalVsize =
    txOverhead + totalInputSize + totalOutputSize + inscriptionVsize;
  console.log('5. 总虚拟大小:', totalVsize, '字节');

  return totalVsize;
}

// 对比最快费率和经济费率的差异
export async function compareFeeRates(vsize: number, isSignet: boolean = true) {
  console.log('=== 费率对比 ===');

  const fastestFee = await getFastestFeeRate(isSignet);
  const economyFee = await getEconomyFeeRate(isSignet);

  const fastestFeeTotal = Math.ceil(vsize * fastestFee);
  const economyFeeTotal = Math.ceil(vsize * economyFee);
  const difference = fastestFeeTotal - economyFeeTotal;
  const percentageIncrease = (
    ((fastestFee - economyFee) / economyFee) *
    100
  ).toFixed(1);

  console.log('费率对比结果:', {
    vsize,
    fastestFee,
    economyFee,
    fastestFeeTotal,
    economyFeeTotal,
    difference,
    percentageIncrease: `${percentageIncrease}%`,
  });

  console.log(`使用最快费率将多支付 ${difference} 聪 (${percentageIncrease}%)`);
  console.log(`但交易确认速度会显著提升`);

  return {
    fastestFee,
    economyFee,
    fastestFeeTotal,
    economyFeeTotal,
    difference,
    percentageIncrease,
  };
}

// 获取当前网络费率状态
export async function getNetworkFeeStatus(isSignet: boolean = true) {
  console.log('=== 网络费率状态 ===');

  try {
    const baseUrl = isSignet
      ? 'https://mempool.space/signet'
      : 'https://mempool.space';
    const response = await fetch(`${baseUrl}/api/v1/fees/recommended`);
    const data = await response.json();

    console.log('当前网络费率:', {
      fastestFee: data.fastestFee || 'N/A',
      halfHourFee: data.halfHourFee || 'N/A',
      economyFee: data.economyFee || 'N/A',
      minimumFee: data.minimumFee || 'N/A',
    });

    // 判断网络拥堵程度
    const congestionLevel =
      data.fastestFee > 20
        ? '高拥堵'
        : data.fastestFee > 10
          ? '中等拥堵'
          : data.fastestFee > 3
            ? '轻度拥堵'
            : '正常';

    console.log(`网络拥堵程度: ${congestionLevel}`);

    return {
      ...data,
      congestionLevel,
    };
  } catch (error) {
    console.error('获取网络费率状态失败:', error);
    return null;
  }
}

import { Message, Transaction, VersionedTransaction } from '@solana/web3.js';

function deserializeTransaction(serializedTransaction: Uint8Array) {
  try {
    // First try to deserialize as VersionedTransaction
    console.log('try to deserialize as VersionedTransaction');
    const versionedTransaction = VersionedTransaction.deserialize(
      serializedTransaction,
    );
    return versionedTransaction;
  } catch (versionedError) {
    console.error('versionedError', versionedError);
    try {
      // If VersionedTransaction fails, try as regular Transaction
      console.log('try to deserialize as regular Transaction');
      const transaction = Transaction.from(serializedTransaction);
      return transaction;
    } catch (regularError) {
      console.error('regularError', regularError);
      throw new Error(
        'Failed to deserialize transaction. Please check if the base64 string is a valid Solana transaction.',
      );
    }
  }
}

export function constructSolanaRouteTransaction({ data }: { data: string }) {
  // 解码 base64 数据

  // Ensure rawBrief.data is a valid string
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid transaction data');
  }

  // Create buffer from base64 string
  // 兼容 Node.js 和浏览器
  let serializedTransaction: Uint8Array;
  if (typeof Buffer !== 'undefined') {
    serializedTransaction = new Uint8Array(Buffer.from(data, 'base64'));
  } else {
    const binaryString = atob(data);
    serializedTransaction = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      serializedTransaction[i] = binaryString.charCodeAt(i);
    }
  }

  if (serializedTransaction.length === 0) {
    throw new Error('Empty transaction buffer');
  }
  if (serializedTransaction.length < 3) {
    throw new Error('Transaction buffer too small');
  }

  console.log(
    'First 10 bytes:',
    Array.from(serializedTransaction.slice(0, 10)),
  );
  console.log('Total length:', serializedTransaction.length);

  const signatureCount = serializedTransaction[0];
  const expectedSignatureSectionLength = 1 + signatureCount * 64;
  console.log('Signature count:', signatureCount);
  console.log(
    'Expected signature section length:',
    expectedSignatureSectionLength,
  );
  console.log('Actual buffer length:', serializedTransaction.length);

  // 判断类型
  // let transaction;
  // try {
  //   // versioned
  //   // const message = VersionedMessage.deserialize(
  //   //   serializedTransaction.slice(1),
  //   // );
  //   transaction = VersionedTransaction.deserialize(serializedTransaction);
  // } catch (e) {
  //   throw new Error(
  //     `Failed to deserialize transaction: ${(e as Error).message}
  //     Buffer head: ${Array.from(serializedTransaction.slice(0, 10))}
  //     Buffer length: ${serializedTransaction.length}`,
  //   );
  // }

  // if (!transaction) {
  //   throw new Error('Failed to create transaction');
  // }

  // 结构校验
  // if (transaction instanceof VersionedTransaction) {
  //   if (!transaction.message || !transaction.message.header) {
  //     throw new Error('Invalid versioned transaction structure');
  //   }
  // } else if (transaction instanceof Transaction) {
  //   if (!transaction.recentBlockhash) {
  //     throw new Error('Invalid legacy transaction structure');
  //   }
  // }

  return deserializeTransaction(serializedTransaction);
}

export function constructSolanaBridgeRouteTransaction({
  data,
}: {
  data: string;
}) {
  // Ensure rawBrief.data is a valid string
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid transaction data');
  }

  // Create buffer from base64 string
  // 兼容 Node.js 和浏览器
  let serializedTransaction: Uint8Array;
  if (typeof Buffer !== 'undefined') {
    serializedTransaction = new Uint8Array(Buffer.from(data, 'base64'));
  } else {
    const binaryString = atob(data);
    serializedTransaction = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      serializedTransaction[i] = binaryString.charCodeAt(i);
    }
  }

  const message = Message.from(serializedTransaction);
  const transaction = Transaction.populate(message);

  return transaction;
}

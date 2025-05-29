import {
  Transaction,
  VersionedMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export function constructSolanaTransaction({ data }: { data: string }) {
  // 解码 base64 数据

  // Ensure rawBrief.data is a valid string
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid transaction data');
  }

  // Create buffer from base64 string
  const binaryString = atob(data);
  const serializedTransaction = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    serializedTransaction[i] = binaryString.charCodeAt(i);
  }

  // Debug logging
  console.log('Transaction data length:', serializedTransaction.length);
  console.log('First few bytes:', serializedTransaction.slice(0, 10));

  // Validate buffer length
  if (serializedTransaction.length === 0) {
    throw new Error('Empty transaction buffer');
  }

  // Validate minimum transaction size
  if (serializedTransaction.length < 3) {
    throw new Error('Transaction buffer too small');
  }

  // Try to detect if this is a versioned transaction by checking the second byte
  const firstByte = serializedTransaction[0];
  const secondByte = serializedTransaction[1];

  let transaction;
  if (secondByte === 128) {
    // Versioned transaction starts with 0x80 as second byte
    // Skip the first byte (0) and deserialize the rest as a versioned transaction
    const message = VersionedMessage.deserialize(
      serializedTransaction.slice(1),
    );
    transaction = new VersionedTransaction(message);
  } else {
    // This is a legacy transaction
    transaction = Transaction.from(serializedTransaction);
  }

  // Validate the transaction
  if (!transaction) {
    throw new Error('Failed to create transaction');
  }

  // Additional validation based on transaction type
  if (transaction instanceof VersionedTransaction) {
    if (!transaction.message || !transaction.message.header) {
      throw new Error('Invalid versioned transaction structure');
    }
  } else {
    if (!transaction.recentBlockhash) {
      throw new Error('Invalid legacy transaction structure');
    }
  }

  return transaction;
}

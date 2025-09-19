import {
  beginCell,
  Cell,
  loadMessage,
  Message,
  storeMessage,
  TonClient,
  Transaction,
} from '@ton/ton';

export function getNormalizedExtMessageHash(message: Message) {
  if (message.info.type !== 'external-in') {
    throw new Error(`Message must be "external-in", got ${message.info.type}`);
  }
  const info = {
    ...message.info,
    src: undefined,
    importFee: 0n,
  };
  const normalizedMessage = {
    ...message,
    init: null,
    info: info,
  };
  return beginCell()
    .store(storeMessage(normalizedMessage, { forceRef: true }))
    .endCell()
    .hash();
}

// The helper function to get a normalized hash from BoC
export function normalizedExtHashFromBoc(bocBase64: string): string {
  const msg = loadMessage(Cell.fromBase64(bocBase64).beginParse());
  return getNormalizedExtMessageHash(msg).toString('hex');
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number },
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
  }
  throw lastError ?? new Error('Retry attempts exhausted');
}

export async function getTransactionByInMessage(
  inMessageBoc: string,
  client: TonClient,
): Promise<Transaction | undefined> {
  const inMessage = loadMessage(Cell.fromBase64(inMessageBoc).beginParse());
  if (inMessage.info.type !== 'external-in') {
    throw new Error(
      `Message must be "external-in", got ${inMessage.info.type}`,
    );
  }
  const account = inMessage.info.dest;
  const targetInMessageHash = getNormalizedExtMessageHash(inMessage);
  let lt: string | undefined = undefined;
  let hash: string | undefined = undefined;
  while (true) {
    const transactions = await retry(
      () =>
        client.getTransactions(account, {
          hash,
          lt,
          limit: 10,
          archival: true,
        }),
      { delay: 1000, retries: 3 },
    );
    if (transactions.length === 0) {
      return undefined;
    }
    for (const transaction of transactions) {
      if (transaction.inMessage?.info.type !== 'external-in') {
        continue;
      }
      const inMessageHash = getNormalizedExtMessageHash(transaction.inMessage);
      if (inMessageHash.equals(targetInMessageHash)) {
        return transaction;
      }
    }
    const last = transactions.at(-1)!;
    lt = last.lt.toString();
    hash = last.hash().toString('base64');
  }
}

export async function waitForTransaction(
  inMessageBoc: string,
  client: TonClient,
  retries: number = 10,
  timeout: number = 1000,
): Promise<Transaction | undefined> {
  const inMessage = loadMessage(Cell.fromBase64(inMessageBoc).beginParse());
  if (inMessage.info.type !== 'external-in') {
    throw new Error(
      `Message must be "external-in", got ${inMessage.info.type}`,
    );
  }
  const account = inMessage.info.dest;
  const targetInMessageHash = getNormalizedExtMessageHash(inMessage);
  let attempt = 0;
  while (attempt < retries) {
    const transactions = await retry(
      () =>
        client.getTransactions(account, {
          limit: 10,
          archival: true,
        }),
      { delay: 1000, retries: 3 },
    );
    for (const transaction of transactions) {
      if (transaction.inMessage?.info.type !== 'external-in') {
        continue;
      }
      const inMessageHash = getNormalizedExtMessageHash(transaction.inMessage);
      if (inMessageHash.equals(targetInMessageHash)) {
        return transaction;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, timeout));
    attempt++;
  }
  return undefined;
}

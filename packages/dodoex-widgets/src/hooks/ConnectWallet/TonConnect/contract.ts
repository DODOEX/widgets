import {
  Address,
  beginCell,
  Cell,
  storeMessage,
  TonClient,
  Transaction,
} from 'ton';

export function getHashByBoc(boc: string) {
  const cell = Cell.fromBase64(boc);
  const hash = cell.hash().toString('base64');
  return hash;
}

export const waitForTransaction = async (
  options: {
    boc: string;
    refetchInterval?: number;
    refetchLimit?: number;
    address: string;
  },
  client: TonClient,
): Promise<Transaction | null> => {
  const { boc, refetchInterval = 2000, refetchLimit, address } = options;

  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    const cell = Cell.fromBase64(boc);
    const hash = cell.hash().toString('base64');
    const interval = setInterval(async () => {
      refetches += 1;
      const state = await client.getContractState(walletAddress);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
      const lastTx = await client.getTransaction(
        walletAddress,
        lastLt,
        lastHash,
      );

      if (lastTx && lastTx.inMessage) {
        const msgCell = beginCell()
          .store(storeMessage(lastTx.inMessage))
          .endCell();

        const inMsgHash = msgCell.hash().toString('base64');
        if (inMsgHash === hash) {
          clearInterval(interval);
          resolve(lastTx);
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
};

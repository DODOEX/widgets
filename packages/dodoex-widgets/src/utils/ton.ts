import { beginCell, Cell, loadMessage, Message, storeMessage } from '@ton/ton';

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

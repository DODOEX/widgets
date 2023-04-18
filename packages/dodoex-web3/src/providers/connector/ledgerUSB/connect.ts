import TransportWebUSB from '@ledgerhq/hw-transport-webhid';

export type { default as Transport } from '@ledgerhq/hw-transport-webhid';

export const getTransport = async () => {
  const transport = (await TransportWebUSB.create()) as TransportWebUSB;
  return transport;
};

import { EventEmitter } from 'events';
import { initializeConnector } from '@web3-react/core';
import OathWalletConnector, {
  getOathWalletUri,
  OathConnectionCancelled,
} from './OathWalletConnector';

const mockInit = jest.fn();
jest.mock('@walletconnect/ethereum-provider', () => ({
  __esModule: true,
  default: { init: (...args: unknown[]) => mockInit(...args) },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function fakeProvider() {
  const approval = deferred<void>();
  const provider = Object.assign(new EventEmitter(), {
    enable: jest.fn(() => approval.promise),
    disconnect: jest.fn(async () => undefined),
    request: jest.fn(async () => undefined),
    signer: { cleanupPendingPairings: jest.fn(async () => undefined) },
    chainId: 1,
    accounts: ['0x0000000000000000000000000000000000000001'],
  });
  return { provider, approval };
}
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
function setup() {
  return initializeConnector(
    (actions) =>
      new OathWalletConnector(actions, {
        1: ['https://rpc.example.test'],
        56: ['https://bsc.example.test'],
      }),
  );
}
beforeEach(() => {
  mockInit.mockReset();
});

test('initializes the WalletConnect provider on the selected chain with isolated Oath storage', async () => {
  const { provider, approval } = fakeProvider();
  mockInit.mockResolvedValue(provider);
  const [connector, , store] = setup();
  const onUri = jest.fn();
  connector.subscribeUri(onUri);
  const pending = connector.activate(56);
  await flush();
  expect(mockInit).toHaveBeenCalledWith(
    expect.objectContaining({
      chains: [56],
      rpcMap: { 56: 'https://bsc.example.test' },
      showQrModal: false,
      customStoragePrefix: expect.stringMatching(/^dodo-oath-wallet-/),
    }),
  );
  const uri = 'wc:test-topic@2?relay-protocol=irn&symKey=test-only';
  provider.emit('display_uri', uri);
  expect(onUri).toHaveBeenLastCalledWith(uri);
  expect(store.getState().accounts).toBeUndefined();
  provider.chainId = 56;
  approval.resolve();
  await pending;
  expect(connector.provider).toBe(provider);
  expect(store.getState()).toMatchObject({
    chainId: 56,
    accounts: provider.accounts,
    activating: false,
  });
  provider.emit('chainChanged', '0x1');
  expect(store.getState().chainId).toBe(1);
  await connector.deactivate();
  expect(provider.listenerCount('display_uri')).toBe(0);
  expect(store.getState().accounts).toBeUndefined();
});

test('closing the QR aborts pairing and ignores a late approval and late events', async () => {
  const { provider, approval } = fakeProvider();
  mockInit.mockResolvedValue(provider);
  const [connector, , store] = setup();
  const pending = connector.activate();
  const rejection = expect(pending).rejects.toBeInstanceOf(
    OathConnectionCancelled,
  );
  await flush();
  await connector.deactivate();
  await rejection;
  expect(provider.signer.cleanupPendingPairings).toHaveBeenCalledWith({
    deletePairings: true,
  });
  approval.resolve();
  provider.emit('accountsChanged', provider.accounts);
  await flush();
  expect(store.getState().accounts).toBeUndefined();
  expect(connector.provider).toBeUndefined();
  expect(provider.disconnect).toHaveBeenCalled();
});

test('cancel during initialization followed by retry cannot overwrite the new session', async () => {
  const initializing = deferred<ReturnType<typeof fakeProvider>['provider']>();
  const old = fakeProvider();
  const next = fakeProvider();
  mockInit
    .mockReturnValueOnce(initializing.promise)
    .mockResolvedValueOnce(next.provider);
  const [connector, , store] = setup();
  const first = connector.activate();
  const rejection = expect(first).rejects.toBeInstanceOf(
    OathConnectionCancelled,
  );
  await flush();
  await connector.deactivate();
  await rejection;
  const second = connector.activate(56);
  await flush();
  next.provider.chainId = 56;
  next.approval.resolve();
  await second;
  initializing.resolve(old.provider);
  await flush();
  expect(old.provider.enable).not.toHaveBeenCalled();
  expect(old.provider.disconnect).toHaveBeenCalled();
  expect(connector.provider).toBe(next.provider);
  expect(store.getState().chainId).toBe(56);
  await connector.deactivate();
});

test('a rejected request resets state and permits another connection', async () => {
  const first = fakeProvider();
  const second = fakeProvider();
  mockInit
    .mockResolvedValueOnce(first.provider)
    .mockResolvedValueOnce(second.provider);
  const [connector, , store] = setup();
  const attempt = connector.activate();
  const rejection = expect(attempt).rejects.toThrow('Rejected');
  await flush();
  first.approval.reject(new Error('Rejected'));
  await rejection;
  expect(store.getState().activating).toBe(false);
  const retry = connector.activate();
  await flush();
  second.approval.resolve();
  await retry;
  expect(connector.provider).toBe(second.provider);
  await connector.deactivate();
});

test('does not start a second concurrent pairing or initialize an unconfigured chain', async () => {
  const { provider } = fakeProvider();
  mockInit.mockResolvedValue(provider);
  const [connector] = setup();
  await expect(connector.activate(999)).rejects.toThrow('No RPC');
  expect(mockInit).not.toHaveBeenCalled();
  const first = connector.activate();
  const rejection = expect(first).rejects.toBeInstanceOf(
    OathConnectionCancelled,
  );
  await expect(connector.activate()).rejects.toThrow(
    'already active or pending',
  );
  await flush();
  await connector.deactivate();
  await rejection;
});

test('preserves the complete pairing URI in the native iOS handoff', () => {
  const uri =
    'wc:test-topic@2?relay-protocol=irn&symKey=test-only&expiryTimestamp=123';
  const link = new URL(getOathWalletUri(uri));
  expect(link.protocol).toBe('oathwallet:');
  expect(link.hostname).toBe('wc');
  expect(link.searchParams.get('uri')).toBe(uri);
});

test('a stale approval cannot reset the retry and each pairing has isolated SDK storage', async () => {
  const old = fakeProvider();
  const next = fakeProvider();
  mockInit
    .mockResolvedValueOnce(old.provider)
    .mockResolvedValueOnce(next.provider);
  const [connector, , store] = setup();
  const first = connector.activate();
  const rejected = expect(first).rejects.toBeInstanceOf(
    OathConnectionCancelled,
  );
  await flush();
  await connector.deactivate();
  await rejected;
  const second = connector.activate(56);
  await flush();
  const oldOptions = mockInit.mock.calls[0][0];
  const newOptions = mockInit.mock.calls[1][0];
  expect(oldOptions.customStoragePrefix).not.toBe(
    newOptions.customStoragePrefix,
  );
  await oldOptions.storage.setItem('test', { value: 1 });
  expect(await newOptions.storage.getItem('test')).toBeUndefined();
  next.provider.chainId = 56;
  next.approval.resolve();
  await second;
  old.approval.resolve();
  await flush();
  expect(old.provider.disconnect).toHaveBeenCalled();
  expect(connector.provider).toBe(next.provider);
  expect(store.getState().chainId).toBe(56);
  await connector.deactivate();
});

test('reselecting an approved wallet requests a network switch without another pairing', async () => {
  const { provider, approval } = fakeProvider();
  mockInit.mockResolvedValue(provider);
  const [connector] = setup();
  const first = connector.activate();
  await flush();
  approval.resolve();
  await first;
  await connector.activate(56);
  expect(mockInit).toHaveBeenCalledTimes(1);
  expect(provider.request).toHaveBeenCalledWith({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x38' }],
  });
  await connector.deactivate();
});

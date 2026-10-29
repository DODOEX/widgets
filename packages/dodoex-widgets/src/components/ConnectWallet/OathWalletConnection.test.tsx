import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import OathWalletConnection from './OathWalletConnection';
import { OathConnectorContext } from '../../hooks/ConnectWallet/OathConnectorContext';
import OathWalletConnector from '../../hooks/ConnectWallet/Connectors/OathWalletConnector';
import QRCode from 'qrcode';

jest.mock('@dodoex/components', () => ({
  Box: ({ component: Component = 'div', sx, ...props }: any) => (
    <Component {...props} />
  ),
  Button: ({ component: Component = 'button', ...props }: any) => (
    <Component {...props} />
  ),
  RotatingIcon: () => <span>Loading</span>,
}));
jest.mock('../../assets/logo/oathWallet.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('qrcode', () => ({
  __esModule: true,
  default: { toDataURL: jest.fn() },
}));
const uri = 'wc:test-topic@2?relay-protocol=irn&symKey=test-only';
function setup() {
  let emit!: (uri?: string) => void;
  let approve!: () => void;
  const connector = {
    subscribeUri: jest.fn((callback) => {
      emit = callback;
      return jest.fn();
    }),
    activate: jest.fn(
      () =>
        new Promise<void>((resolve) => {
          approve = resolve;
        }),
    ),
    deactivate: jest.fn(async () => undefined),
  };
  const onConnected = jest.fn();
  const onBack = jest.fn();
  const result = render(
    <OathConnectorContext.Provider
      value={connector as unknown as OathWalletConnector}
    >
      <OathWalletConnection
        chainId={56}
        onConnected={onConnected}
        onBack={onBack}
      />
    </OathConnectorContext.Provider>,
  );
  return {
    ...result,
    connector,
    onConnected,
    onBack,
    emit: (value?: string) => emit(value),
    approve: () => approve(),
  };
}

beforeEach(() => {
  (QRCode.toDataURL as jest.Mock).mockReset();
  (QRCode.toDataURL as jest.Mock).mockResolvedValue(
    'data:image/png;base64,test',
  );
});

test('shows a QR with the unmodified URI and iPhone instructions without another wallet-selection step', async () => {
  const test = setup();
  expect(test.connector.activate).toHaveBeenCalledWith(56);
  act(() => test.emit(uri));
  await screen.findByRole('img', {
    name: 'WalletConnect QR code for Oath Wallet',
  });
  expect(QRCode.toDataURL).toHaveBeenCalledWith(
    uri,
    expect.objectContaining({ margin: 4 }),
  );
  expect(screen.getByText(/Open Oath on your iPhone and scan/)).toBeTruthy();
  expect(
    screen
      .getByRole('link', { name: 'Get Oath for iPhone' })
      .getAttribute('href'),
  ).toBe('https://apps.apple.com/app/id6780187283');
  expect(test.onConnected).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Back to wallets' }));
  expect(test.onBack).toHaveBeenCalledTimes(1);
  test.unmount();
  expect(test.connector.deactivate).toHaveBeenCalledTimes(1);
});

test('preserves an approved connection when its screen unmounts', async () => {
  const test = setup();
  await act(async () => test.approve());
  expect(test.onConnected).toHaveBeenCalledTimes(1);
  test.unmount();
  expect(test.connector.deactivate).not.toHaveBeenCalled();
});

test('a late approval cannot close a different screen after cancellation', async () => {
  const test = setup();
  test.unmount();
  await act(async () => test.approve());
  expect(test.onConnected).not.toHaveBeenCalled();
});

test('QR rendering failure cancels the pending request and exposes retry', async () => {
  (QRCode.toDataURL as jest.Mock).mockRejectedValue(
    new Error('Rendering failed'),
  );
  const test = setup();
  act(() => test.emit(uri));
  await screen.findByRole('alert');
  expect(test.connector.deactivate).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(test.connector.activate).toHaveBeenCalledTimes(2));
});

test('iPhone gets a native link containing the complete WalletConnect URI', async () => {
  const userAgent = jest
    .spyOn(navigator, 'userAgent', 'get')
    .mockReturnValue('iPhone');
  const test = setup();
  act(() => test.emit(uri));
  const link = await screen.findByRole('link', {
    name: 'Open Oath on this iPhone',
  });
  expect(new URL(link.getAttribute('href')!).searchParams.get('uri')).toBe(uri);
  test.unmount();
  userAgent.mockRestore();
});

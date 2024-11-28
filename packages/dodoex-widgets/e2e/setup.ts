const error = console.error;

global.console = {
  ...console,
  error: (message: string, ...options: any[]) => {
    if (typeof message === 'string') {
      if (
        message.indexOf('Warning:') === 0 ||
        [
          'Using kebab-case for css properties in objects is not supported. Did you mean WebkitAppearance?',
        ].some((snippet) => message.indexOf(snippet) !== -1)
      )
        return;
    }
    error(message, options);
  },
};

jest.mock('@lingui/core', () => ({
  i18n: {
    loadLocaleData: jest.fn(),
    load: jest.fn(),
    activate: jest.fn(),
  },
}));
jest.mock('@lingui/react', () => ({
  I18nProvider: ({ children }: { children: any }) => children,
  useLingui: () => ({
    i18n: {
      _: null,
    },
  }),
}));
jest.mock('@lingui/macro', () => ({
  t: (str: string) => str,
  Trans: ({ children }: { children: any }) => children,
}));

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: () => void) => fn,
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (fn: () => any) => {
    if (typeof fn === 'function') {
      return fn();
    }
    return [];
  },
}));
jest.mock('@solana/wallet-adapter-react', () => ({
  useConnection: jest.fn(() => ({
    connection: {
      getBalance: jest.fn(),
      getTokenAccountsByOwner: jest.fn(),
      getTokenAccountBalance: jest.fn(),
      getBlockHeight: jest.fn(),
    },
  })),
  useWallet: jest.fn(),
  useAnchorWallet: jest.fn(),
}));
jest.mock('@coral-xyz/anchor', () => ({
  utils: {
    bytes: {
      utf8: {
        encode: jest.fn(() => '0x'),
      },
    },
  },
}));
jest.mock('@solana/web3.js', () => ({
  PublicKey: jest.fn(),
}));

export {};

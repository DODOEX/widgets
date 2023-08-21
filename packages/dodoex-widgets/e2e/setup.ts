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
  useLingui: jest.fn(),
}));
jest.mock('@lingui/macro', () => ({
  t: (str: string) => str,
  Trans: ({ children }: { children: any }) => children,
}));

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: () => void) => fn,
}));

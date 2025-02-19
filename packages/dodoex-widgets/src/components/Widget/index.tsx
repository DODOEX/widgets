import { ChainId, GraphQLRequests } from '@dodoex/api';
import {
  Box,
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeOptions,
  ThemeProvider,
  WIDGET_MODAL_CLASS,
  WIDGET_MODAL_FIXED_CLASS,
} from '@dodoex/components';
import { useWallet } from '@solana/wallet-adapter-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useRef } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { APIServices } from '../../constants/api';
import { defaultLang, SupportedLang } from '../../constants/locales';
import { useFetchBlockNumber } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { DefaultTokenInfo, TokenInfo } from '../../hooks/Token/type';
import useInitTokenList, {
  InitTokenListProps,
} from '../../hooks/Token/useInitTokenList';
import { LangProvider as LangProviderBase } from '../../providers/i18n';
import { queryClient } from '../../providers/queryClient';
import { SolanaReactProvider } from '../../providers/SolanaReactProvider';
import { Page } from '../../router';
import { store } from '../../store';
import { ConfirmProps } from '../Confirm';
import Message from '../Message';
import { DialogProps } from '../Swap/components/Dialog';
import { UserOptionsProvider, useUserOptions } from '../UserOptionsProvider';
import WithExecutionDialog from '../WithExecutionDialog';

export const WIDGET_CLASS_NAME = 'dodo-widget-container';

export interface WidgetProps extends InitTokenListProps, ExecutionProps {
  apikey?: string;
  theme?: PartialDeep<ThemeOptions>;
  colorMode?: PaletteMode;
  defaultChainId?: ChainId;
  width?: string | number;
  height?: string | number;
  feeRate?: number; // Unit: 1e18
  rebateTo?: string; // Receive Address
  defaultFromToken?: DefaultTokenInfo;
  defaultToToken?: DefaultTokenInfo;
  locale?: SupportedLang;
  swapSlippage?: number | null; // Unit: %
  bridgeSlippage?: number | null; // Unit: %
  apiServices?: Partial<APIServices>;
  crossChain?: boolean;
  noPowerBy?: boolean;
  noDocumentLink?: boolean;
  onlyChainId?: ChainId;
  noUI?: boolean;
  noLangProvider?: boolean;
  noAutoConnect?: boolean;
  routerPage?: Page;
  dappMetadata?: {
    name: string;
    logoUrl?: string;
  };
  notSupportPMM?: boolean;
  supportAMMV2?: boolean;
  supportAMMV3?: boolean;

  /** When the winding status changes, no pop-up window will be displayed. */
  noSubmissionDialog?: boolean;
  onlySolana?: boolean;
  noSolanaProvider?: boolean;
  solanaWallet?: ReturnType<typeof useWallet>;

  widgetRef?: React.RefObject<HTMLDivElement>;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
  onSwitchChain?: (chainId?: ChainId) => Promise<boolean>;
  /** When the token balance is insufficient, users can purchase or swap callbacks */
  gotoBuyToken?: (params: { token: TokenInfo; account: string }) => void;
  getTokenLogoUrl?: (params: {
    address?: string;
    width?: number;
    height?: number;
    url?: string;
    chainId?: number;
  }) => string;
  graphQLRequests?: GraphQLRequests;
  ConfirmComponent?: React.FunctionComponent<ConfirmProps>;
  DialogComponent?: React.FunctionComponent<DialogProps>;
}

function LangProvider(props: PropsWithChildren<WidgetProps>) {
  if (props.noLangProvider) {
    return <>{props.children}</>;
  }
  return (
    <LangProviderBase locale={props.locale}>
      <WithExecutionDialog {...props}>{props.children}</WithExecutionDialog>
    </LangProviderBase>
  );
}

function InitStatus(props: PropsWithChildren<WidgetProps>) {
  useInitTokenList(props);

  useFetchBlockNumber();

  const width = props.width || 375;
  const height = props.height || 494;

  const { widgetRef } = useUserOptions();

  if (props.noUI) {
    return <LangProvider {...props}>{props.children}</LangProvider>;
  }

  return (
    <LangProvider {...props}>
      <Box
        sx={{
          width,
          height,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 335,
          minHeight: 494,
          borderRadius: 16,
          backgroundColor: 'background.paper',
        }}
        className={WIDGET_CLASS_NAME}
        ref={widgetRef}
      >
        {props.children}
      </Box>
    </LangProvider>
  );
}

export { LangProvider } from '../../providers/i18n';
export { default as Message } from '../Message';

/** Widgets that do not directly import themes and queryClient libraries */
export function UnstyleWidget(props: PropsWithChildren<WidgetProps>) {
  const widgetRef = useRef<HTMLDivElement>(null);

  return (
    <ReduxProvider store={store}>
      <UserOptionsProvider
        {...{
          ...props,
          widgetRef: props.widgetRef ?? widgetRef,
        }}
      >
        <SolanaReactProvider>
          <InitStatus {...props} />
        </SolanaReactProvider>
      </UserOptionsProvider>
    </ReduxProvider>
  );
}

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const theme = createTheme({
    mode: props.colorMode,
    theme: props.theme,
    lang: props.locale || defaultLang,
  });

  if (!props.apikey && !props.apiServices) {
    console.error('apikey and apiServices must have a.');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline
        container={`.${WIDGET_CLASS_NAME}, .${WIDGET_MODAL_CLASS}, .${WIDGET_MODAL_FIXED_CLASS}`}
      />
      <QueryClientProvider client={queryClient}>
        <UnstyleWidget {...props}>
          {props.children}
          <Message />
        </UnstyleWidget>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

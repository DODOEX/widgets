import { ChainId, GraphQLRequests } from '@dodoex/api';
import type { WalletStore } from '@dodoex/btc-connect-react';
import {
  createTheme,
  CssBaseline,
  EmptyDataIcon,
  PaletteMode,
  ThemeOptions,
  ThemeProvider,
  WIDGET_MODAL_CLASS,
  WIDGET_MODAL_FIXED_CLASS,
} from '@dodoex/components';
import { Connection } from '@solana/web3.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useRef } from 'react';
import { APIServices } from '../../constants/api';
import { defaultLang, SupportedLang } from '../../constants/locales';
import { useFetchBlockNumber } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { ExecutionCtx } from '../../hooks/Submission/types';
import { DefaultTokenInfo, TokenInfo } from '../../hooks/Token/type';
import useInitTokenList, {
  InitTokenListProps,
} from '../../hooks/Token/useInitTokenList';
import { LangProvider as LangProviderBase } from '../../providers/i18n';
import { queryClient } from '../../providers/queryClient';
import { useInitContractRequest } from '../../providers/useInitContractRequest';
import { Page } from '../../router';
import { ConfirmProps } from '../Confirm';
import Message from '../Message';
import { DialogProps } from '../Swap/components/Dialog';
import { TokenPickerDialogProps } from '../Swap/components/TokenCard/TokenPickerDialog';
import { UserOptionsProvider } from '../UserOptionsProvider';
import WithExecutionDialog from '../WithExecutionDialog';

export const WIDGET_CLASS_NAME = 'dodo-widget-container';

export interface WidgetProps extends InitTokenListProps, ExecutionProps {
  apikey?: string;
  GRAPHQL_URL: string;
  IS_TEST_ENV: boolean;
  theme?: PartialDeep<ThemeOptions>;
  colorMode?: PaletteMode;
  defaultChainId: ChainId;
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
  supportCurve?: boolean;

  /** When the winding status changes, no pop-up window will be displayed. */
  noSubmissionDialog?: boolean;
  submissionDialogModal?: boolean;

  widgetRef?: React.RefObject<HTMLDivElement>;
  /** When the token balance is insufficient, users can purchase or swap callbacks */
  gotoBuyToken?: (params: { token: TokenInfo; account: string }) => void;
  getTokenLogoUrl?: (params: {
    address?: string;
    width?: number;
    height?: number;
    url?: string;
    chainId?: number;
  }) => string;
  onSharePool?: (share: {
    chainId: number;
    baseToken?: {
      address: string;
      symbol: string;
    };
    quoteToken?: {
      address: string;
      symbol: string;
    };
    poolId: string;
    apy?: {
      miningBaseApy?: any;
      miningQuoteApy?: any;
      transactionBaseApy?: any;
      transactionQuoteApy?: any;
    } | null;
    isSingle?: boolean;
  }) => void;
  graphQLRequests?: GraphQLRequests;
  ConfirmComponent?: React.FunctionComponent<ConfirmProps>;
  DialogComponent?: React.FunctionComponent<DialogProps>;
  EmptyDataIcon?: React.FunctionComponent<Parameters<typeof EmptyDataIcon>[0]>;
  TokenPickerDialog?: React.FunctionComponent<TokenPickerDialogProps>;
  /** Default deadLine when it cannot be set. Unit: seconds */
  deadLine?: number;
  submission?: ExecutionCtx;

  solanaConnection?: Connection;
  btcWalletStore?: WalletStore;
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
  useInitContractRequest();

  if (props.noUI) {
    return <LangProvider {...props}>{props.children}</LangProvider>;
  }

  return null;
}

export { LangProvider } from '../../providers/i18n';
export { default as Message } from '../Message';

/** Widgets that do not directly import themes and queryClient libraries */
export function UnstyleWidget(props: PropsWithChildren<WidgetProps>) {
  const widgetRef = useRef<HTMLDivElement>(null);

  return (
    <UserOptionsProvider
      {...{
        ...props,
        widgetRef: props.widgetRef ?? widgetRef,
      }}
    >
      <InitStatus {...props} />
    </UserOptionsProvider>
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

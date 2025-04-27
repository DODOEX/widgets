import { ChainId, ContractRequests, GraphQLRequests } from '@dodoex/api';
import {
  Box,
  createTheme,
  CssBaseline,
  EmptyDataIcon,
  PaletteMode,
  ThemeOptions,
  ThemeProvider,
  WIDGET_MODAL_CLASS,
  WIDGET_MODAL_FIXED_CLASS,
} from '@dodoex/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { APIServices, contractRequests } from '../../constants/api';
import { getRpcSingleUrlMap } from '../../constants/chains';
import { defaultLang, SupportedLang } from '../../constants/locales';
import {
  useWeb3Connectors,
  Web3ConnectorsProps,
} from '../../hooks/ConnectWallet';
import { useFetchBlockNumber } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { DefaultTokenInfo, TokenInfo } from '../../hooks/Token/type';
import useInitTokenList, {
  InitTokenListProps,
} from '../../hooks/Token/useInitTokenList';
import { LangProvider as LangProviderBase } from '../../providers/i18n';
import { queryClient } from '../../providers/queryClient';
import { ConfirmProps } from '../Confirm';
import OpenConnectWalletInfo from '../ConnectWallet/OpenConnectWalletInfo';
import Message from '../Message';
import { DialogProps } from '../Swap/components/Dialog';
import { UserOptionsProvider, useUserOptions } from '../UserOptionsProvider';
import WithExecutionDialog from '../WithExecutionDialog';
import { Page } from '../../router';
import { useInitContractRequest } from '../../providers/useInitContractRequest';
import {
  setAutoConnectLoading,
  useGlobalState,
} from '../../hooks/useGlobalState';
import { ExecutionCtx } from '../../hooks/Submission/types';
import { TokenPickerDialogProps } from '../Swap/components/TokenCard/TokenPickerDialog';

export const WIDGET_CLASS_NAME = 'dodo-widget-container';

export interface WidgetProps
  extends Web3ConnectorsProps,
    InitTokenListProps,
    ExecutionProps {
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

  onProviderChanged?: (provider?: any) => void;
  getStaticJsonRpcProviderByChainId?: Exclude<
    ConstructorParameters<typeof ContractRequests>[0],
    undefined
  >['getProvider'];

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
  const { provider, connector, chainId } = useWeb3React();
  const { autoConnectLoading } = useGlobalState();
  useEffect(() => {
    if (autoConnectLoading === undefined) {
      if (props.noAutoConnect) {
        setAutoConnectLoading(false);
      } else {
        setAutoConnectLoading(true);
        const connectWallet = async () => {
          const defaultChainId = props.defaultChainId;
          try {
            if (connector?.connectEagerly) {
              await connector.connectEagerly(defaultChainId);
            } else {
              await connector.activate(defaultChainId);
            }
          } finally {
            setAutoConnectLoading(false);
          }
        };
        connectWallet();
      }
    }
  }, [connector, props.noAutoConnect]);

  useEffect(() => {
    contractRequests.setGetConfigProvider((getProviderChainId) => {
      const connectedProvider =
        chainId === getProviderChainId ? provider : null;
      if (connectedProvider) return connectedProvider;
      if (props.getStaticJsonRpcProviderByChainId) {
        const propsGetProvider =
          props.getStaticJsonRpcProviderByChainId(getProviderChainId);
        if (propsGetProvider) {
          return propsGetProvider;
        }
      }
      return null;
    });
  }, [provider, props.getStaticJsonRpcProviderByChainId]);

  useEffect(() => {
    if (props.onProviderChanged) {
      props.onProviderChanged(provider);
    }
    const _provider = provider?.provider as any;
    const handleChainChanged = async () => {
      setAutoConnectLoading(true);
      try {
        if (connector?.connectEagerly) {
          await connector.connectEagerly();
        } else {
          await connector.activate();
        }
      } finally {
        setAutoConnectLoading(false);
      }
    };
    if (_provider?.on) {
      _provider.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (_provider?.removeListener) {
        _provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [provider]);

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
          backgroundColor: 'background.default',
        }}
        className={WIDGET_CLASS_NAME}
        ref={widgetRef}
      >
        <OpenConnectWalletInfo />
        {props.children}
      </Box>
    </LangProvider>
  );
}

function Web3Provider(props: PropsWithChildren<WidgetProps>) {
  const { fromTokenChainId } = useGlobalState();
  const defaultChainId = useMemo(
    () => fromTokenChainId ?? props.defaultChainId ?? 1,
    [props.defaultChainId, fromTokenChainId],
  );
  const { connectors, key } = useWeb3Connectors({
    provider: props.provider,
    jsonRpcUrlMap: props.jsonRpcUrlMap,
    defaultChainId,
  });

  return (
    <Web3ReactProvider connectors={connectors} key={key} lookupENS={false}>
      <InitStatus {...props} />
    </Web3ReactProvider>
  );
}

export { LangProvider } from '../../providers/i18n';
export { default as Message } from '../Message';

/** Widgets that do not directly import themes and queryClient libraries */
export function UnstyleWidget(props: PropsWithChildren<WidgetProps>) {
  const widgetRef = useRef<HTMLDivElement>(null);

  if (props.jsonRpcUrlMap) {
    contractRequests.setRpc(getRpcSingleUrlMap(props.jsonRpcUrlMap));
  }

  return (
    <UserOptionsProvider
      {...{
        ...props,
        widgetRef: props.widgetRef ?? widgetRef,
      }}
    >
      <Web3Provider {...props} />
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

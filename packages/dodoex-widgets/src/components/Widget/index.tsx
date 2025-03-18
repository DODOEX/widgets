import { ChainId, ContractRequests, GraphQLRequests } from '@dodoex/api';
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
import { QueryClientProvider } from '@tanstack/react-query';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from 'react-redux';
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
import { store } from '../../store';
import { AppThunkDispatch } from '../../store/actions';
import { setAutoConnectLoading } from '../../store/actions/globals';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { getFromTokenChainId } from '../../store/selectors/wallet';
import { ConfirmProps } from '../Confirm';
import OpenConnectWalletInfo from '../ConnectWallet/OpenConnectWalletInfo';
import { setOpenConnectWalletInfo } from '../../store/actions/wallet';
import Message from '../Message';
import { DialogProps } from '../Swap/components/Dialog';
import { UserOptionsProvider, useUserOptions } from '../UserOptionsProvider';
import WithExecutionDialog from '../WithExecutionDialog';
import { Page } from '../../router';
import { useInitContractRequest } from '../../providers/useInitContractRequest';

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
  onAccountChanged?: (account?: string) => void;
  getStaticJsonRpcProviderByChainId?: Exclude<
    ConstructorParameters<typeof ContractRequests>[0],
    undefined
  >['getProvider'];
  setOpenConnectWalletFC?: (fc: () => void) => void;
  setDisconnectConnectFC?: (fc: () => void) => void;

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
  /** Default deadLine when it cannot be set. Unit: seconds */
  deadLine?: number;
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
  useInitContractRequest(true);
  const { provider, connector, chainId, account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  useEffect(() => {
    if (autoConnectLoading === undefined) {
      if (props.noAutoConnect) {
        dispatch(setAutoConnectLoading(false));
      } else {
        dispatch(setAutoConnectLoading(true));
        const connectWallet = async () => {
          const defaultChainId = props.defaultChainId;
          try {
            if (connector?.connectEagerly) {
              await connector.connectEagerly(defaultChainId);
            } else {
              await connector.activate(defaultChainId);
            }
          } finally {
            dispatch(setAutoConnectLoading(false));
          }
        };
        connectWallet();
      }
    }
  }, [connector, props.noAutoConnect]);

  useEffect(() => {
    if (props.setOpenConnectWalletFC) {
      props.setOpenConnectWalletFC(() => {
        dispatch(setOpenConnectWalletInfo(true));
      });
    }
  }, [props.setOpenConnectWalletFC]);

  useEffect(() => {
    if (props.setDisconnectConnectFC) {
      props.setDisconnectConnectFC(() => {
        connector.deactivate ? connector.deactivate() : connector.resetState();
      });
    }
  }, [props.setDisconnectConnectFC]);

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
    if (props.onAccountChanged) {
      props.onAccountChanged(account);
    }
  }, [account]);

  useEffect(() => {
    if (props.onProviderChanged) {
      props.onProviderChanged(provider);
    }
    const _provider = provider?.provider as any;
    const handleChainChanged = async () => {
      dispatch(setAutoConnectLoading(true));
      try {
        if (connector?.connectEagerly) {
          await connector.connectEagerly();
        } else {
          await connector.activate();
        }
      } finally {
        dispatch(setAutoConnectLoading(false));
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
          backgroundColor: 'background.paper',
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
  const fromTokenChainId = useSelector(getFromTokenChainId);
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
    <ReduxProvider store={store}>
      <UserOptionsProvider
        {...{
          ...props,
          widgetRef: props.widgetRef ?? widgetRef,
        }}
      >
        <Web3Provider {...props} />
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

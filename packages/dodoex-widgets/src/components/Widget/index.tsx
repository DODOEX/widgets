import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  WIDGET_MODAL_CLASS,
  WIDGET_MODAL_FIXED_CLASS,
  Box,
  BoxProps,
} from '@dodoex/components';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from 'react-redux';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { ContractRequests, GraphQLRequests } from '@dodoex/api';
import { LangProvider } from '../../providers/i18n';
import { store } from '../../store';
import { PaletteMode, ThemeOptions } from '@dodoex/components';
import { defaultLang, SupportedLang } from '../../constants/locales';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import {
  useWeb3Connectors,
  Web3ConnectorsProps,
} from '../../hooks/ConnectWallet';
import useInitTokenList, {
  InitTokenListProps,
} from '../../hooks/Token/useInitTokenList';
import WithExecutionDialog from '../WithExecutionDialog';
import { useFetchBlockNumber } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { getRpcSingleUrlMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { DefaultTokenInfo, TokenInfo } from '../../hooks/Token/type';
import { AppThunkDispatch } from '../../store/actions';
import { setAutoConnectLoading } from '../../store/actions/globals';
import { APIServices, contractRequests } from '../../constants/api';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { getFromTokenChainId } from '../../store/selectors/wallet';
import OpenConnectWalletInfo from '../ConnectWallet/OpenConnectWalletInfo';
import { queryClient } from '../../providers/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserOptionsProvider, useUserOptions } from '../UserOptionsProvider';
import { ConfirmProps } from '../Confirm';
import { DialogProps } from '../Swap/components/Dialog';
import Message from '../Message';
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

function InitStatus(props: PropsWithChildren<WidgetProps>) {
  useInitTokenList(props);
  useFetchBlockNumber();
  const { provider, connector, chainId } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  useEffect(() => {
    if (autoConnectLoading === undefined) {
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
  }, [connector]);

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

  if (props.noUI) return <>{props.children}</>;

  return (
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
      <WithExecutionDialog {...props}>{props.children}</WithExecutionDialog>
    </Box>
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

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const theme = createTheme({
    mode: props.colorMode,
    theme: props.theme,
    lang: props.locale || defaultLang,
  });

  if (!props.apikey && !props.apiServices) {
    console.error('apikey and apiServices must have a.');
  }

  if (props.jsonRpcUrlMap) {
    contractRequests.setRpc(getRpcSingleUrlMap(props.jsonRpcUrlMap));
  }

  const widgetRef = useRef<HTMLDivElement>(null);

  return (
    <ReduxProvider store={store}>
      <LangProvider locale={props.locale}>
        <ThemeProvider theme={theme}>
          <CssBaseline
            container={`.${WIDGET_CLASS_NAME}, .${WIDGET_MODAL_CLASS}, .${WIDGET_MODAL_FIXED_CLASS}`}
          />
          <UserOptionsProvider
            {...{
              ...props,
              widgetRef: props.widgetRef ?? widgetRef,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <Web3Provider {...props} />
              <Message />
            </QueryClientProvider>
          </UserOptionsProvider>
        </ThemeProvider>
      </LangProvider>
    </ReduxProvider>
  );
}

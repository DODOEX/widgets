import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Theme,
  Box,
} from '@dodoex/components';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from 'react-redux';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { LangProvider } from './i18n';
import { store } from '../../store';
import { PaletteMode, ThemeOptions } from '@dodoex/components';
import { defaultLang, SupportedLang } from '../../constants/locales';
import { Web3ReactProvider } from '@web3-react/core';
import {
  useWeb3Connectors,
  Web3ConnectorsProps,
} from '../../hooks/ConnectWallet';
import useInitTokenList, {
  InitTokenListProps,
} from '../../hooks/Token/useInitTokenList';
import WithExecutionDialog from '../WithExecutionDialog';
import { useFetchBlockNumber, useFetchETHBalance } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { ChainId } from '../../constants/chains';
import { useInitPropsToRedux } from '../../hooks/Swap';
import { DefaultTokenInfo } from '../../hooks/Token/type';
import { AppThunkDispatch } from '../../store/actions';
import { setAutoConnectLoading } from '../../store/actions/globals';
import { APIServices } from '../../constants/api';
import { getAutoConnectLoading } from '../../store/selectors/globals';
import { SwapProps } from '../Swap';
import {
  getFromTokenChainId,
  getToTokenChainId,
} from '../../store/selectors/wallet';
import { useWalletState } from '../../hooks/ConnectWallet/useWalletState';
import WebApp from '@twa-dev/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export const WIDGET_CLASS_NAME = 'dodo-widget-container';

export const queryClient = new QueryClient();

export interface WidgetProps
  extends Web3ConnectorsProps,
    InitTokenListProps,
    ExecutionProps,
    SwapProps {
  apikey?: string;
  theme?: ThemeOptions;
  colorMode?: PaletteMode;
  defaultChainId?: ChainId;
  width?: string | number;
  height?: string | number;
  feeRate?: number; // Unit: 1e18
  rebateTo?: string; // Receive Address
  defaultFromToken?: DefaultTokenInfo;
  defaultToToken?: DefaultTokenInfo;
  locale?: SupportedLang;
  swapSlippage?: number; // Unit: %
  bridgeSlippage?: number; // Unit: %
  apiServices?: Partial<APIServices>;
  crossChain?: boolean;
  noPowerBy?: boolean;
  tonConnect?: boolean;

  onProviderChanged?: (provider?: any) => void;
}

function InitStatus(props: PropsWithChildren<WidgetProps>) {
  useInitTokenList({
    ...props,
    isTon: !!props.tonConnect,
  });
  useFetchETHBalance();
  useFetchBlockNumber();
  const { provider, autoConnect } = useWalletState({
    isTon: !!props.tonConnect,
  });
  const dispatch = useDispatch<AppThunkDispatch>();
  const autoConnectLoading = useSelector(getAutoConnectLoading);
  useEffect(() => {
    if (autoConnectLoading === undefined) {
      dispatch(setAutoConnectLoading(true));
      const connectWallet = async () => {
        const defaultChainId = props.defaultChainId;
        try {
          await autoConnect(defaultChainId);
        } finally {
          dispatch(setAutoConnectLoading(false));
        }
      };
      connectWallet();
    }
  }, [autoConnect]);
  useEffect(() => {
    if (props.onProviderChanged) {
      props.onProviderChanged(provider);
    }
    const _provider = provider?.provider as any;
    const handleChainChanged = async () => {
      dispatch(setAutoConnectLoading(true));
      try {
        await autoConnect();
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

  useEffect(() => {
    if (props.tonConnect) {
      WebApp.ready();
    }
  }, [props.tonConnect]);

  // Init props to redux!
  const width = props.width || 375;
  const height = props.height || 494;
  useInitPropsToRedux({ ...props, width, height });

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
    >
      <WithExecutionDialog {...props}>{props.children}</WithExecutionDialog>
    </Box>
  );
}

function Web3Provider(props: PropsWithChildren<WidgetProps>) {
  const fromTokenChainId = useSelector(getFromTokenChainId);
  const toTokenChainId = useSelector(getToTokenChainId);
  const defaultChainId = useMemo(() => {
    if (fromTokenChainId) {
      if (fromTokenChainId !== ChainId.TON) return fromTokenChainId;
      if (toTokenChainId && toTokenChainId !== ChainId.TON)
        return toTokenChainId;
    }
    return props.defaultChainId ?? 1;
  }, [props.defaultChainId, fromTokenChainId]);
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

  return (
    <ReduxProvider store={store}>
      <LangProvider locale={props.locale}>
        <ThemeProvider theme={theme}>
          <CssBaseline container={`.${WIDGET_CLASS_NAME}`} />
          <QueryClientProvider client={queryClient}>
            <Web3Provider {...props} />
          </QueryClientProvider>
        </ThemeProvider>
      </LangProvider>
    </ReduxProvider>
  );
}

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Theme,
  Box,
} from '@dodoex/components';
import { Provider as ReduxProvider } from 'react-redux';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { LangProvider } from './i18n';
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
import { useFetchBlockNumber, useFetchETHBalance } from '../../hooks/contract';
import { ExecutionProps } from '../../hooks/Submission';
import { ChainId } from '../../constants/chains';
import { reloadWindow } from '../../utils';
import { useInitPropsToRedux } from '../../hooks/Swap';
import { TokenInfo } from '../../hooks/Token/type';

export const WIDGET_CLASS_NAME = 'dodo-widget-container';

export interface WidgetProps
  extends Web3ConnectorsProps,
    InitTokenListProps,
    ExecutionProps {
  theme?: ThemeOptions;
  colorMode?: PaletteMode;
  accessToken?: string;
  defaultChainId?: ChainId;
  width?: string | number;
  height?: string | number;
  feeRate?: number; // unit: 1e18
  rebateTo?: string; // Receive Address
  defaultFromToken?: TokenInfo;
  defaultToToken?: TokenInfo;
  locale?: SupportedLang;
}

function InitStatus(props: PropsWithChildren<WidgetProps>) {
  useInitTokenList(props);
  useFetchETHBalance();
  useFetchBlockNumber();
  const { provider, connector } = useWeb3React();
  useEffect(() => {
    const defaultChainId = props.defaultChainId || 1;
    if (connector?.connectEagerly) {
      connector.connectEagerly(defaultChainId);
    } else {
      connector.activate(defaultChainId);
    }
  }, [connector]);

  useEffect(() => {
    const _provider = provider?.provider;
    if (_provider && (_provider as any).once) {
      (_provider as any).once('chainChanged', () => reloadWindow(200));
      // (_provider as any).once('accountsChanged', () => reloadWindow(200));
    }
  }, [provider]);

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
        minWidth: 292,
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

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const theme = createTheme({
    mode: props.colorMode,
    theme: props.theme,
    lang: props.locale || defaultLang,
  });
  const defaultChainId = useMemo(
    () => props.defaultChainId || 1,
    [props.defaultChainId],
  );

  const connectors = useWeb3Connectors({
    provider: props.provider,
    jsonRpcUrlMap: props.jsonRpcUrlMap,
    defaultChainId,
  });
  const key = `${connectors.length}+${
    props.jsonRpcUrlMap ? Object.entries(props.jsonRpcUrlMap) : ''
  }+${props.defaultChainId}+${defaultChainId}`;

  return (
    <ReduxProvider store={store}>
      <LangProvider locale={props.locale}>
        <ThemeProvider theme={theme}>
          <Web3ReactProvider connectors={connectors} key={key}>
            <CssBaseline container={`.${WIDGET_CLASS_NAME}`} />
            <InitStatus {...props} />
          </Web3ReactProvider>
        </ThemeProvider>
      </LangProvider>
    </ReduxProvider>
  );
}

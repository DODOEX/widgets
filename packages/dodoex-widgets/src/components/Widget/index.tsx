import { ChainId, ContractRequests, GraphQLRequests } from '@dodoex/api';
import { JsonRpcProvider } from '@ethersproject/providers';
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
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
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

/**
 * Liquidity mining (LP fee reward) activity config. When provided, a reward banner
 * is shown on the pool list page, and pools carrying an `apy.lpFeeRewardApy` value
 * get a 🔥 badge and can be filtered via "Mining Only".
 *
 * The reward amount and claim state are read from the `lp_fee_reward_getUserReward`
 * GraphQL query; the per-pool bonus APY comes from the liquidity list's
 * `apy.lpFeeRewardApy` field.
 */
export interface LpFeeRewardActivity {
  /** Activity id passed to `lp_fee_reward_getUserReward`. Required. */
  activity: string;
  /** Banner title. Defaults to a generic "Liquidity Mining" title when omitted. */
  title?: string;
  /** Banner description line. */
  description?: string;
  /** "View more" external link shown in the banner description. */
  viewMoreLink?: string;
  /** Reward token symbol, e.g. "PROS". */
  rewardTokenSymbol?: string;
  /** Reward token logo url shown next to the reward amount. */
  rewardTokenLogo?: string;
  /** Tooltip text shown in the question mark next to the "My rewards" label. When omitted, the tooltip is hidden. */
  myRewardsTooltip?: string;
  /** Optional reward period id. When omitted, the backend picks the current/most-recent period. */
  periodId?: string;
}

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
  supportChainIds?: number[];
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
  /** Liquidity mining (LP fee reward) activity config shown on the pool list page. */
  lpFeeRewardActivity?: LpFeeRewardActivity;
  executionDialogExtra?: any;

  /** When the winding status changes, no pop-up window will be displayed. */
  noSubmissionDialog?: boolean;
  showSubmissionSubmittedDialog?: boolean;

  /**
   * External wallet state. When provided, the widget reads account/chainId/provider
   * directly from this object instead of managing its own wallet connection.
   * The integrator is responsible for keeping this up-to-date.
   */
  walletState?: {
    account?: string;
    chainId?: number;
    provider?: JsonRpcProvider;
  };
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
  disableConnectedProviderRead?: boolean;
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
  const { connector } = useWeb3React();
  const { provider, chainId } = useWalletInfo();
  const { autoConnectLoading } = useGlobalState();
  useEffect(() => {
    if (autoConnectLoading === undefined) {
      if (props.noAutoConnect || props.walletState) {
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
      if (!props.disableConnectedProviderRead && connectedProvider)
        return connectedProvider;
      if (props.getStaticJsonRpcProviderByChainId) {
        const propsGetProvider =
          props.getStaticJsonRpcProviderByChainId(getProviderChainId);
        if (propsGetProvider) {
          return propsGetProvider;
        }
      }
      return null;
    });
  }, [
    provider,
    props.getStaticJsonRpcProviderByChainId,
    props.disableConnectedProviderRead,
  ]);

  useEffect(() => {
    if (props.onProviderChanged) {
      props.onProviderChanged(provider);
    }
    const _provider = (provider as any)?.provider ?? provider;
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
  const { fromTokenChainId } = useGlobalState();
  const defaultChainId = useMemo(
    () => fromTokenChainId ?? props.defaultChainId ?? 1,
    [props.defaultChainId, fromTokenChainId],
  );
  const { connectors, key } = useWeb3Connectors({
    provider: props.provider,
    jsonRpcUrlMap: props.jsonRpcUrlMap,
    defaultChainId,
    walletState: props.walletState,
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

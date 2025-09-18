import { ChainId } from '@dodoex/api';
import {
  Box,
  Button,
  ButtonBase,
  RotatingIcon,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Dodo, DoubleRight, Setting, Warn } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { CaipNetworksUtil } from '@reown/appkit-utils';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { AppUrl } from '../../constants/api';
import { chainListMap } from '../../constants/chainList';
import { setLastToken } from '../../constants/localstorage';
import { PRICE_IMPACT_THRESHOLD } from '../../constants/swap';
import {
  swapAlertEnterAmountBtn,
  swapAlertFetchPriceBtn,
  swapAlertInsufficientBalanceBtn,
  swapAlertSelectTokenBtn,
  swapReviewBtn,
} from '../../constants/testId';
import { useFetchRoutePriceBridge } from '../../hooks/Bridge/useFetchRoutePriceBridge';
import { useSendRoute } from '../../hooks/Bridge/useSendRoute';
import { useSwitchBridgeOrSwapSlippage } from '../../hooks/Bridge/useSwitchBridgeOrSwapSlippage';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
import { useFetchETHBalance } from '../../hooks/contract';
import {
  GetAutoSlippage,
  useSetAutoSlippage,
} from '../../hooks/setting/useSetAutoSlippage';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import useInflights from '../../hooks/Submission/useInflights';
import {
  RoutePriceStatus,
  useFetchFiatPrice,
  useFetchRoutePrice,
  useMarginAmount,
} from '../../hooks/Swap';
import { useBridgeSlippage } from '../../hooks/Swap/useBridgeSlippage';
import { useInitDefaultToken } from '../../hooks/Swap/useInitDefaultToken';
import { usePrivacySwapStatus } from '../../hooks/Swap/usePrivacySwapStatus';
import {
  maxSlippageWarning,
  useSlippageLimit,
} from '../../hooks/Swap/useSlippageLimit';
import { useSwapSlippage } from '../../hooks/Swap/useSwapSlippage';
import { TokenInfo } from '../../hooks/Token/type';
import { useDisabledTokenSwitch } from '../../hooks/Token/useDisabledTokenSwitch';
import { useTokenStatus } from '../../hooks/Token/useTokenStatus';
import { useGlobalState } from '../../hooks/useGlobalState';
import { formatTokenAmountNumber, namespaceToTitle } from '../../utils';
import BridgeRouteShortCard from '../Bridge/BridgeRouteShortCard';
import BridgeSummaryDialog from '../Bridge/BridgeSummaryDialog';
import ErrorMessageDialog from '../ErrorMessageDialog';
import TokenLogo from '../TokenLogo';
import { QuestionTooltip } from '../Tooltip';
import { useUserOptions } from '../UserOptionsProvider';
import FiatEntryAndGasRefuel from './components/FiatEntryAndGasRefuel';
import { ReviewDialog } from './components/ReviewDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { SwapSettingsDialog } from './components/SwapSettingsDialog';
import { SwitchBox } from './components/SwitchBox';
import { TokenCardSwap } from './components/TokenCard/TokenCardSwap';
import { TokenPairPriceWithToggle } from './components/TokenPairPriceWithToggle';

const debounceTime = 300;

export interface SwapProps {
  /** Higher priority setting slippage */
  getAutoSlippage?: GetAutoSlippage;
  onPayTokenChange?: (token: TokenInfo) => void;
  onReceiveTokenChange?: (token: TokenInfo) => void;
}

export function Swap({
  getAutoSlippage,
  onPayTokenChange,
  onReceiveTokenChange,
}: SwapProps = {}) {
  const theme = useTheme();
  const { isInflight } = useInflights();
  const { noPowerBy, onlyChainId } = useUserOptions();
  const { isMobile } = useWidgetDevice();

  const {
    open,
    disconnect,
    getAppKitAccountByChainId,
    chainId: currentChainId,
    appKitActiveNetwork,
  } = useWalletInfo();

  const [isReverseRouting, setIsReverseRouting] = useState(false);
  const [displayingFromAmt, setDisplayingFromAmt] = useState<string>('');
  const [displayingToAmt, setDisplayingToAmt] = useState<string>('');
  const [fromAmt, setFromAmt] = useState<string>('');
  const [toAmt, setToAmt] = useState<string>('');

  const [fromToken, setFromTokenOrigin] = useState<TokenInfo | null>(null);
  const [toToken, setToTokenOrigin] = useState<TokenInfo | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState<boolean>(false);
  const [bridgeSummaryShow, setBridgeSummaryShow] = useState(false);
  const [inputToAddress, setInputToAddress] = useState<string | null>(null);

  const fromAccount = useMemo(() => {
    return getAppKitAccountByChainId(fromToken?.chainId);
  }, [fromToken?.chainId, getAppKitAccountByChainId]);

  const toAccount = useMemo(() => {
    const account = getAppKitAccountByChainId(toToken?.chainId);

    if (!account) {
      return undefined;
    }

    if (inputToAddress) {
      return {
        ...account,
        appKitAccount: {
          ...account.appKitAccount,
          isConnected: true,
          address: inputToAddress,
        },
      };
    }

    return account;
  }, [getAppKitAccountByChainId, toToken?.chainId, inputToAddress]);

  const debouncedSetFromAmt = useMemo(
    () => debounce((amt) => setFromAmt(amt), debounceTime),
    [],
  );
  const debouncedSetToAmt = useMemo(
    () => debounce((amt) => setToAmt(amt), debounceTime),
    [],
  );

  const isBridge = useMemo(() => {
    if (!fromToken || !toToken) return undefined;
    return !!(
      fromToken?.chainId &&
      toToken?.chainId &&
      fromToken.chainId !== toToken.chainId
    );
  }, [fromToken, toToken]);
  const { toFiatPrice, fromFiatPrice } = useFetchFiatPrice({
    toToken,
    fromToken,
  });

  const { marginAmount } = useMarginAmount({
    token: isReverseRouting ? toToken : fromToken,
    fiatPrice: isReverseRouting ? toFiatPrice : fromFiatPrice,
  });

  useSetAutoSlippage({
    fromToken,
    toToken,
    getAutoSlippage,
  });
  const { slippage: slippageSwap, slippageLoading: slippageLoadingSwap } =
    useSwapSlippage({
      fromToken,
      toToken,
    });

  const { slippage: slippageBridge } = useBridgeSlippage();

  const {
    privacySwapSupplierEndpoints,
    privacySwapEnable,
    privacySwapEnableAble,
    endpointStatusMap,
    refetchEndpointStatus,
  } = usePrivacySwapStatus({
    chainId: fromToken?.chainId,
    account: fromAccount?.appKitAccount.address,
  });

  const fromEtherTokenQuery = useFetchETHBalance(fromToken?.chainId);

  const {
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend: handleSendBridgeRoute,
  } = useSendRoute();

  const {
    bridgeRouteList,
    status: bridgeRouteStatus,
    failedReason,
  } = useFetchRoutePriceBridge({
    toToken,
    fromToken,
    fromAmount: fromAmt,
    fromAccount,
    toAccount,
    enabled: !bridgeSummaryShow && !sendRouteLoading,
    slippage: slippageBridge,
  });

  const selectedRoute = useMemo(() => {
    if (bridgeRouteList && bridgeRouteList.length > 0) {
      return bridgeRouteList[0];
    }

    return undefined;
  }, [bridgeRouteList]);

  const {
    isApproving,
    isGetApproveLoading,
    needApprove,
    insufficientBalance,
    submitApprove,
    getMaxBalance,
    tokenQuery: fromTokenQuery,
  } = useTokenStatus(fromToken, {
    amount: fromAmt,
    contractAddress: selectedRoute?.spenderContractAddress ?? undefined,
    account: fromAccount?.appKitAccount.address,
  });

  const { tokenQuery: toTokenQuery } = useTokenStatus(toToken, {
    account: toAccount?.appKitAccount.address,
  });

  const handleMaxClick = useCallback(() => {
    updateFromAmt(getMaxBalance());
  }, [getMaxBalance]);

  const estimateGas = useMemo(() => {
    if (
      !fromAccount?.appKitAccount.address ||
      insufficientBalance ||
      isApproving ||
      isGetApproveLoading ||
      needApprove
    ) {
      return false;
    }
    return true;
  }, [
    fromAccount?.appKitAccount.address,
    insufficientBalance,
    isApproving,
    isGetApproveLoading,
    needApprove,
  ]);

  const {
    status: resPriceStatus,
    rawBrief,
    executeSwap,
  } = useFetchRoutePrice({
    toToken,
    fromToken,
    marginAmount,
    fromAmount: fromAmt,
    toAmount: toAmt,
    estimateGas,
    isReverseRouting,
    slippage: slippageSwap,
    slippageLoading: slippageLoadingSwap,
  });
  const {
    resAmount,
    priceImpact,
    baseFeeAmount,
    additionalFeeAmount,
    resPricePerToToken,
    resPricePerFromToken,
    routeInfo,
  } = useMemo(() => {
    if (!rawBrief)
      return {
        resAmount: null,
        priceImpact: null,
        baseFeeAmount: null,
        additionalFeeAmount: null,
        resPricePerToToken: null,
        resPricePerFromToken: null,
        routeInfo: null,
      };
    return rawBrief;
  }, [rawBrief]);

  const showSwitchSlippageTooltip = useSwitchBridgeOrSwapSlippage(isBridge);

  const updateFromAmt = useCallback(
    (v: string | number) => {
      const val = v.toString();
      setDisplayingFromAmt(val);
      debouncedSetFromAmt(val);
    },
    [setDisplayingFromAmt, debouncedSetFromAmt],
  );

  const updateToAmt = useCallback(
    (v: string | number) => {
      const val = v.toString();
      setDisplayingToAmt(val);
      debouncedSetToAmt(val);
    },
    [setDisplayingToAmt, debouncedSetToAmt],
  );

  const setFromToken: (value: React.SetStateAction<TokenInfo | null>) => void =
    useCallback(
      (value) => {
        return setFromTokenOrigin((prev) => {
          const newValue = typeof value === 'function' ? value(prev) : value;
          // sync redux
          if (!currentChainId) {
            // The chainId is only modified when the wallet is not connected, and the chain is specified when the wallet is connected.
            useGlobalState.setState({
              fromTokenChainId: (newValue?.chainId ?? undefined) as
                | ChainId
                | undefined,
            });
          }
          // callback
          if (onPayTokenChange && newValue && newValue !== prev) {
            onPayTokenChange(newValue);
          }

          return newValue;
        });
      },
      [onPayTokenChange, currentChainId],
    );

  const setToToken: (value: React.SetStateAction<TokenInfo | null>) => void =
    useCallback(
      (value) => {
        return setToTokenOrigin((prev) => {
          const newValue = typeof value === 'function' ? value(prev) : value;
          if (onReceiveTokenChange && newValue && newValue !== prev) {
            onReceiveTokenChange(newValue);
          }
          return newValue;
        });
      },
      [onReceiveTokenChange],
    );

  useInitDefaultToken({
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    updateFromAmt,
    updateToAmt,
    setIsReverseRouting,
  });

  const switchTokens = useCallback(() => {
    updateFromAmt('');
    updateToAmt('');
    setFromToken(toToken);
    setToToken(fromToken);
    setLastToken('from', toToken);
    setLastToken('to', fromToken);
  }, [
    setFromToken,
    toToken,
    setToToken,
    fromToken,
    updateFromAmt,
    updateToAmt,
  ]);

  const onFromTokenChange = useCallback(
    (token: TokenInfo, isOccupied: boolean) => {
      if (isOccupied) return switchTokens();
      updateFromAmt('');
      updateToAmt('');
      setFromToken(token);
      setLastToken('from', token);
    },
    [switchTokens, updateFromAmt, updateToAmt, setFromToken, setLastToken],
  );
  const onToTokenChange = useCallback(
    (token: TokenInfo, isOccupied: boolean) => {
      if (isOccupied) return switchTokens();
      updateFromAmt('');
      updateToAmt('');
      setToToken(token);
      setLastToken('to', token);
    },
    [switchTokens, updateFromAmt, updateToAmt, setFromToken, setLastToken],
  );
  const onFromTokenInputFocus = useCallback(() => {
    if (isReverseRouting) {
      updateFromAmt('');
    }
    setIsReverseRouting(false);
  }, [isReverseRouting, updateFromAmt]);
  const onToTokenInputFocus = useCallback(() => {
    if (!isReverseRouting) {
      updateToAmt('');
    }
    setIsReverseRouting(true);
  }, [isReverseRouting, updateToAmt]);

  const isSlippageExceedLimit = useSlippageLimit(
    isBridge ? undefined : slippageSwap,
  );

  const displayPriceImpact = useMemo(
    () => (Number(priceImpact) * 100).toFixed(2),
    [priceImpact],
  );

  const displayFromFiatPrice = useMemo(() => {
    const fromAmount = isReverseRouting ? resAmount : fromAmt;
    return fromAmount && fromFiatPrice
      ? new BigNumber(fromFiatPrice).multipliedBy(fromAmount)
      : null;
  }, [fromFiatPrice, fromAmt, isReverseRouting, resAmount]);

  const displayToFiatPrice = useMemo(() => {
    if (!toFiatPrice || isBridge === undefined) return null;
    if (isBridge) {
      return selectedRoute?.toTokenAmount?.gt(0)
        ? selectedRoute.toTokenAmount.multipliedBy(toFiatPrice)
        : null;
    }
    const toAmount = isReverseRouting ? toAmt : resAmount;
    return toAmount ? new BigNumber(toFiatPrice).multipliedBy(toAmount) : null;
  }, [
    toFiatPrice,
    toAmt,
    isReverseRouting,
    resAmount,
    selectedRoute,
    isBridge,
  ]);

  const priceImpactWarning = useMemo(() => {
    return (
      <Box
        sx={{
          display: 'flex',
          fontWeight: 600,
          typography: 'body2',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QuestionTooltip
          title={
            <Trans>
              Due to the market condition, market price and estimated price may
              have a slight difference
            </Trans>
          }
          mr={8}
        />
        <Box sx={{ display: 'flex' }}>
          <Trans>Current price impact</Trans>
          <Box sx={{ color: theme.palette.error.main, ml: 4 }}>
            {displayPriceImpact}%
          </Box>
        </Box>
      </Box>
    );
  }, [displayPriceImpact, theme.palette.error.main]);

  const tokenPairPrice = useMemo(() => {
    return (
      <TokenPairPriceWithToggle
        toToken={toToken}
        fromToken={fromToken}
        priceStatus={resPriceStatus}
        pricePerToToken={resPricePerToToken}
        pricePerFromToken={resPricePerFromToken}
        routeInfo={routeInfo}
      />
    );
  }, [
    toToken,
    fromToken,
    resPriceStatus,
    resPricePerToToken,
    resPricePerFromToken,
    routeInfo,
  ]);

  const isUnSupportChain = useMemo(
    () => !ChainId[fromToken?.chainId || 1],
    [fromToken?.chainId],
  );

  const isNotCurrentChain = useMemo(() => {
    if (!fromToken) {
      return false;
    }
    const appKitAccount = getAppKitAccountByChainId(fromToken.chainId);
    if (!appKitAccount) {
      return false;
    }

    if (!appKitAccount.chain.isEVMChain) {
      return false;
    }

    return (
      !!currentChainId &&
      !!fromToken?.chainId &&
      fromToken?.chainId !== currentChainId
    );
  }, [currentChainId, fromToken, getAppKitAccountByChainId]);

  const disabledSwitch = useDisabledTokenSwitch({
    fromToken,
    toToken,
  });

  const switchSlippageTooltip = useMemo(() => {
    return (
      <Tooltip
        open={showSwitchSlippageTooltip.showSwitchSlippage}
        title={
          isBridge ? (
            <Trans>The setting has been switched to cross chain mode</Trans>
          ) : (
            <Trans>The setting has been switched to swap mode</Trans>
          )
        }
        placement="bottom-end"
        onClose={() => showSwitchSlippageTooltip.setShowSwitchSlippage(false)}
        onlyClick
      >
        <Box
          component={ButtonBase}
          onClick={() => setIsSettingsDialogOpen(true)}
          sx={{
            p: 4,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            height: 28,
            width: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component={Setting}
            sx={{
              width: 20,
              height: 20,
              color: 'text.primary',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Tooltip>
    );
  }, [isBridge, showSwitchSlippageTooltip, theme.palette.background.paper]);

  const slippageExceedLimit = useMemo(() => {
    if (
      !isSlippageExceedLimit ||
      !new BigNumber(isReverseRouting ? toAmt : fromAmt).gt(0) ||
      insufficientBalance ||
      (isBridge
        ? bridgeRouteStatus !== RoutePriceStatus.Success
        : resPriceStatus !== RoutePriceStatus.Success)
    ) {
      return null;
    }
    return (
      <Box
        sx={{
          textAlign: 'center',
          mb: 8,
        }}
      >
        <Box
          component={Warn}
          sx={{
            position: 'relative',
            top: 2,
            mr: 6,
            width: 16,
            height: 16,
            color: 'warning.main',
          }}
        />
        {t`The current slippage protection coefficient set exceeds ${maxSlippageWarning}%, which may result in losses.`}
      </Box>
    );
  }, [
    isSlippageExceedLimit,
    isReverseRouting,
    toAmt,
    fromAmt,
    insufficientBalance,
    isBridge,
    bridgeRouteStatus,
    resPriceStatus,
  ]);

  const priceInfo = useMemo(() => {
    if (isNotCurrentChain) {
      return (
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Box
            component={Warn}
            sx={{
              position: 'relative',
              top: 2,
              mr: 6,
              width: 16,
              height: 16,
              color: 'warning.main',
            }}
          />
          <Trans>
            The current network is inconsistent with the wallet - please switch
            in wallet
          </Trans>
        </Box>
      );
    }

    if (isBridge && bridgeRouteStatus === RoutePriceStatus.Initial) {
      return '-';
    }

    if (
      resPriceStatus === RoutePriceStatus.Loading ||
      (isBridge && bridgeRouteStatus === RoutePriceStatus.Loading)
    ) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <RotatingIcon sx={{ mr: 5 }} />
            <Trans>Fetching best price...</Trans>
          </>
        </Box>
      );
    }

    if (isUnSupportChain) {
      return (
        <>
          <Box
            component={Warn}
            sx={{
              mr: 6,
              width: 16,
              color: 'warning.main',
            }}
          />
          <Trans>Unsupported network - switch to trade</Trans>
        </>
      );
    }

    if (isBridge && bridgeRouteList.length) {
      {
        /* Bridge select route */
      }
      return (
        <>
          {slippageExceedLimit}
          <BridgeRouteShortCard route={selectedRoute} />
        </>
      );
    }

    if (
      isBridge &&
      ((bridgeRouteStatus === RoutePriceStatus.Success &&
        !bridgeRouteList.length) ||
        bridgeRouteStatus === RoutePriceStatus.Failed) &&
      displayingFromAmt
    ) {
      return (
        <>
          <Box
            component={Warn}
            sx={{ width: 15, mr: 5, color: 'warning.main' }}
          />
          <Trans>Quote not available</Trans>
        </>
      );
    }

    return (
      <>
        {!isBridge &&
          displayingFromAmt &&
          new BigNumber(displayPriceImpact).gt(PRICE_IMPACT_THRESHOLD) &&
          priceImpactWarning}
        {slippageExceedLimit}
        {tokenPairPrice}
      </>
    );
  }, [
    resPriceStatus,
    tokenPairPrice,
    displayingFromAmt,
    priceImpactWarning,
    displayPriceImpact,
    isUnSupportChain,
    isBridge,
    bridgeRouteStatus,
    bridgeRouteList,
    selectedRoute,
    isNotCurrentChain,
    slippageExceedLimit,
  ]);

  const fromFinalAmt = useMemo(() => {
    if (isReverseRouting) {
      return new BigNumber(displayingToAmt).gt(0)
        ? formatTokenAmountNumber({
            input: resAmount as number,
            decimals: fromToken?.decimals,
          })
        : '-';
    }
    return displayingFromAmt;
  }, [
    displayingFromAmt,
    displayingToAmt,
    resAmount,
    fromToken,
    isReverseRouting,
  ]);

  const toFinalAmt = useMemo(() => {
    if (isReverseRouting) {
      return displayingToAmt;
    }
    if (isBridge) {
      return selectedRoute?.toTokenAmount?.gt(0) &&
        bridgeRouteStatus !== RoutePriceStatus.Loading
        ? formatTokenAmountNumber({
            input: selectedRoute.toTokenAmount,
            decimals: toToken?.decimals,
          })
        : '-';
    }
    return new BigNumber(displayingFromAmt).gt(0)
      ? formatTokenAmountNumber({
          input: resAmount as number,
          decimals: toToken?.decimals,
        })
      : '-';
  }, [
    displayingFromAmt,
    displayingToAmt,
    resAmount,
    toToken,
    isReverseRouting,
    selectedRoute,
    isBridge,
    bridgeRouteStatus,
  ]);

  const swapButton = useMemo(() => {
    if (!fromAccount?.appKitAccount?.isConnected) {
      return (
        <Button
          fullWidth
          onClick={() => {
            if (!fromToken?.chainId) {
              return;
            }
            const caipNetwork = chainListMap.get(
              fromToken.chainId,
            )?.caipNetwork;
            if (!caipNetwork) {
              return;
            }
            const namespace = CaipNetworksUtil.getChainNamespace(caipNetwork);
            open({
              namespace,
            });
          }}
        >
          <Trans>
            Connect to {namespaceToTitle(fromToken?.chainId)} wallet
          </Trans>
        </Button>
      );
    }

    if (
      fromAccount.chain.isEVMChain &&
      fromAccount.chain.chainId !== currentChainId
    ) {
      return (
        <Button
          fullWidth
          onClick={() => {
            appKitActiveNetwork.switchNetwork(fromAccount.chain.caipNetwork);
          }}
        >
          <Trans>Switch to {fromAccount.chain.name}</Trans>
        </Button>
      );
    }

    if (
      fromAccount.chain.isSolanaChain &&
      fromAccount.chain.chainId !== currentChainId
    ) {
      return (
        <Button
          fullWidth
          onClick={() => {
            appKitActiveNetwork.switchNetwork(fromAccount.chain.caipNetwork);
          }}
        >
          <Trans>Switch to {fromAccount.chain.name}</Trans>
        </Button>
      );
    }

    if (!toAccount?.appKitAccount?.isConnected) {
      return (
        <Button
          fullWidth
          onClick={() => {
            if (!toToken?.chainId) {
              return;
            }
            const caipNetwork = chainListMap.get(toToken.chainId)?.caipNetwork;
            if (!caipNetwork) {
              return;
            }
            const namespace = CaipNetworksUtil.getChainNamespace(caipNetwork);
            open({
              namespace,
            });
          }}
        >
          <Trans>Connect to {namespaceToTitle(toToken?.chainId)} wallet</Trans>
        </Button>
      );
    }

    if (isInflight) {
      return (
        <Button fullWidth isLoading disabled>
          <Trans>Transaction Pending</Trans>
        </Button>
      );
    }

    if (!fromToken || !toToken) {
      return (
        <Button fullWidth disabled data-testid={swapAlertSelectTokenBtn}>
          <Trans>Select Tokens</Trans>
        </Button>
      );
    }

    if (!new BigNumber(isReverseRouting ? toAmt : fromAmt).gt(0)) {
      return (
        <Button fullWidth disabled data-testid={swapAlertEnterAmountBtn}>
          <Trans>Enter an amount</Trans>
        </Button>
      );
    }

    if (
      isBridge
        ? bridgeRouteStatus === RoutePriceStatus.Loading || isGetApproveLoading
        : resPriceStatus === RoutePriceStatus.Loading
    ) {
      return (
        <Button fullWidth disabled data-testid={swapAlertFetchPriceBtn}>
          <Trans>Fetching Price...</Trans>
        </Button>
      );
    }

    let routeFailed = false;
    if (isBridge) {
      routeFailed =
        !bridgeRouteList.length ||
        bridgeRouteStatus === RoutePriceStatus.Failed;
    } else {
      routeFailed = !resAmount || resPriceStatus === RoutePriceStatus.Failed;
    }
    if (routeFailed) {
      return (
        <Button fullWidth disabled>
          <Trans>Quote not available</Trans>
        </Button>
      );
    }

    if (insufficientBalance) {
      // balance need to greater than reserved gas!
      return (
        <Button
          fullWidth
          disabled
          data-testid={swapAlertInsufficientBalanceBtn}
        >
          <Trans>Insufficient balance</Trans>
        </Button>
      );
    }

    if (needApprove) {
      return (
        <Button
          fullWidth
          disabled={isApproving}
          onClick={() => submitApprove()}
        >
          {isApproving ? <Trans>Approving</Trans> : <Trans>Approve</Trans>}
        </Button>
      );
    }

    if (isBridge) {
      return (
        <Button
          fullWidth
          onClick={() =>
            handleSendBridgeRoute({
              selectedRoute,
              fromEtherTokenBalance: fromEtherTokenQuery.data?.balance ?? null,
              goNext: () => setBridgeSummaryShow(true),
            })
          }
          data-testid={swapReviewBtn}
          disabled={!selectedRoute}
          isLoading={sendRouteLoading}
        >
          <Trans>Review Cross Chain</Trans>
        </Button>
      );
    }

    if (privacySwapEnable) {
      return (
        <Button
          fullWidth
          onClick={() => setIsReviewDialogOpen(true)}
          data-testid={swapReviewBtn}
        >
          <Tooltip
            placement="top"
            onlyHover
            maxWidth={240}
            title={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  Privacy Swap is Enabled
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  Your transactions on the Ethereum network will be protected
                  from sandwich attacks.
                </Box>
              </Box>
            }
          >
            <Box
              sx={{
                mr: 8,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="30"
                viewBox="0 0 25 30"
                fill="none"
              >
                <path
                  d="M12.5 4L3.5 8V14C3.5 19.55 7.34 24.74 12.5 26C17.66 24.74 21.5 19.55 21.5 14V8L12.5 4Z"
                  fill="white"
                />
                <path
                  d="M23 14C23 20.1791 18.7457 26.0187 12.8555 27.457L12.5 27.5439L12.1445 27.457C6.25427 26.0187 2 20.1791 2 14V7.02539L2.89062 6.62891L11.8906 2.62891L12.5 2.3584L13.1094 2.62891L22.1094 6.62891L23 7.02539V14Z"
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="3"
                />
                <path
                  d="M16.3937 11.3638L10.8021 16.9553L8.60457 14.7662L7.4082 15.9626L10.8021 19.3565L17.59 12.5686L16.3937 11.3638Z"
                  fill="#154618"
                />
              </svg>
            </Box>
          </Tooltip>

          <Trans>Review Swap</Trans>
        </Button>
      );
    }

    return (
      <Button
        fullWidth
        onClick={() => setIsReviewDialogOpen(true)}
        data-testid={swapReviewBtn}
      >
        <Trans>Review Swap</Trans>
      </Button>
    );
  }, [
    fromAccount?.appKitAccount?.isConnected,
    fromAccount?.chain.isEVMChain,
    fromAccount?.chain.chainId,
    fromAccount?.chain.isSolanaChain,
    fromAccount?.chain.name,
    fromAccount?.chain.caipNetwork,
    currentChainId,
    toAccount?.appKitAccount?.isConnected,
    isInflight,
    fromToken,
    toToken,
    isReverseRouting,
    toAmt,
    fromAmt,
    isBridge,
    bridgeRouteStatus,
    isGetApproveLoading,
    resPriceStatus,
    insufficientBalance,
    needApprove,
    open,
    appKitActiveNetwork,
    bridgeRouteList.length,
    resAmount,
    isApproving,
    submitApprove,
    selectedRoute,
    sendRouteLoading,
    handleSendBridgeRoute,
    fromEtherTokenQuery.data?.balance,
    privacySwapEnable,
  ]);

  const subtitle = useMemo(() => {
    if (!fromToken || !toToken) return <Box />;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenLogo
          token={fromToken}
          width={16}
          height={16}
          marginRight={6}
          chainId={fromToken.chainId}
          noShowChain={!!onlyChainId}
        />
        {`${formatTokenAmountNumber({
          input: isReverseRouting ? resAmount : fromAmt,
          decimals: fromToken?.decimals,
        })} ${fromToken?.symbol}`}
        <Box
          component={DoubleRight}
          sx={{
            width: 12,
            height: 12,
            mx: 16,
          }}
        />
        <TokenLogo
          token={toToken}
          width={16}
          height={16}
          marginRight={6}
          chainId={toToken.chainId}
          noShowChain={!!onlyChainId}
        />
        {`${formatTokenAmountNumber({
          input: isReverseRouting ? toAmt : resAmount,
          decimals: toToken?.decimals,
        })} ${toToken?.symbol}`}
      </Box>
    );
  }, [
    fromToken,
    toToken,
    fromAmt,
    toAmt,
    resAmount,
    isReverseRouting,
    onlyChainId,
  ]);

  return (
    <Box
      sx={{
        width: '100%',
        // height: 571,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        backgroundColor: theme.palette.background.skeleton,
        [theme.breakpoints.up('laptop')]: {
          width: 450,
          backgroundColor: theme.palette.background.skeleton,
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 16,
          py: 20,
        }}
      >
        <Box
          sx={{
            typography: 'caption',
            color: theme.palette.text.primary,
          }}
        >
          Universal Swap
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
            p: 1,
            backgroundColor: theme.palette.background.tag,
          }}
        >
          <Box
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
              px: 6,
              py: 4,
            }}
          >
            {isBridge
              ? selectedRoute?.slippage
                ? selectedRoute.slippage * 100
                : (slippageBridge ?? '-')
              : slippageSwap}
            %
          </Box>
          {switchSlippageTooltip}
        </Box>
      </Box>

      {/* Scroll Container */}
      <Box
        sx={{
          flex: 1,
          px: 16,
          pb: 20,
          overflowY: 'auto',
        }}
      >
        {/* Swap Module */}
        <Box>
          {/* First Token Card  */}
          <TokenCardSwap
            sx={{ mb: 4 }}
            token={fromToken}
            side="from"
            amt={fromFinalAmt}
            defaultLoadBalance
            onMaxClick={handleMaxClick}
            onInputChange={updateFromAmt}
            onInputFocus={isBridge ? undefined : onFromTokenInputFocus}
            showMaxBtn={!isReverseRouting && !displayingFromAmt}
            occupiedAddrs={[toToken?.address ?? '']}
            occupiedChainId={toToken?.chainId}
            fiatPriceTxt={
              displayFromFiatPrice
                ? `$${formatTokenAmountNumber({
                    input: displayFromFiatPrice,
                    decimals: 2,
                  })}`
                : '$-'
            }
            onTokenChange={onFromTokenChange}
            readOnly={isReverseRouting}
            showChainLogo={!onlyChainId}
            showChainName={!onlyChainId}
            notTokenPickerModal={!isMobile}
            enterAddressEnabled={false}
            inputToAddress={inputToAddress}
            setInputToAddress={setInputToAddress}
            account={fromAccount}
            failedReason={failedReason}
            tokenQuery={fromTokenQuery}
          />

          {/* Switch Icon */}
          <SwitchBox onClick={switchTokens} disabled={disabledSwitch} />

          {/* Second Token Card  */}
          <TokenCardSwap
            token={toToken}
            side="to"
            amt={toFinalAmt}
            onInputChange={updateToAmt}
            onInputFocus={isBridge ? undefined : onToTokenInputFocus}
            occupiedAddrs={[fromToken?.address ?? '']}
            occupiedChainId={fromToken?.chainId}
            fiatPriceTxt={
              displayToFiatPrice ? (
                <>
                  $
                  {formatTokenAmountNumber({
                    input: displayToFiatPrice,
                    decimals: 2,
                  })}
                  {/* {isBridge ? null : `(${displayPriceImpact}%)`} */}
                </>
              ) : (
                '$-'
              )
            }
            onTokenChange={onToTokenChange}
            readOnly={isBridge || !isReverseRouting}
            showChainLogo={!onlyChainId}
            showChainName={!onlyChainId}
            notTokenPickerModal={!isMobile}
            enterAddressEnabled={isBridge}
            inputToAddress={inputToAddress}
            setInputToAddress={setInputToAddress}
            account={toAccount}
            sx={{
              padding: theme.spacing(24, 20, 20),
            }}
            tokenQuery={toTokenQuery}
            // https://www.notion.so/dodotopia/V5-zetachain-B-swap-solana-23a080d974e780bab2c2f8b736ec7fe2?source=copy_link
            filterBySupportTargetChain={false}
          />

          {/* Price Disp or Warnings  */}
          <Box
            sx={{
              py: 16,
              display: 'flex',
              typography: 'body2',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {priceInfo}
          </Box>
        </Box>

        {/* Swap Button  */}
        {swapButton}

        <FiatEntryAndGasRefuel />

        {/*Footer*/}
        {noPowerBy ? (
          ''
        ) : (
          <Box
            sx={{
              mt: 13,
              display: 'flex',
              typography: 'h6',
              cursor: 'pointer',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.disabled,
            }}
            onClick={() => window.open(AppUrl)}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                transform: 'translate(1px, 2px)',
                '& path': {
                  fill: theme.palette.text.disabled,
                },
              }}
              component={Dodo}
            />
            <Trans>Powered by ZUNO protocol</Trans>
          </Box>
        )}
      </Box>

      {/* Dialogs */}
      <ReviewDialog
        toToken={toToken}
        fromToken={fromToken}
        fromAmount={isReverseRouting ? resAmount : fromAmt}
        toAmount={isReverseRouting ? toAmt : resAmount}
        open={isReviewDialogOpen}
        baseFeeAmount={baseFeeAmount}
        priceImpact={displayPriceImpact}
        additionalFeeAmount={additionalFeeAmount}
        curToFiatPrice={displayToFiatPrice}
        execute={() => executeSwap(subtitle)}
        clearFromAmt={() => updateFromAmt('')}
        clearToAmt={() => updateToAmt('')}
        curFromFiatPrice={displayFromFiatPrice}
        pricePerFromToken={resPricePerFromToken}
        onClose={() => setIsReviewDialogOpen(false)}
        loading={resPriceStatus === RoutePriceStatus.Loading}
        slippage={slippageSwap}
        isDialogModal={isMobile}
      />
      {isBridge ? (
        <SettingsDialog
          open={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          isBridge
          isDialogModal={isMobile}
        />
      ) : (
        <SwapSettingsDialog
          open={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          fromToken={fromToken}
          toToken={toToken}
          privacySwapEnableAble={privacySwapEnableAble}
          privacySwapEnable={privacySwapEnable}
          privacySwapSupplierEndpoints={privacySwapSupplierEndpoints}
          endpointStatusMap={endpointStatusMap}
          refetchEndpointStatus={refetchEndpointStatus}
          isDialogModal={isMobile}
        />
      )}
      <BridgeSummaryDialog
        open={bridgeSummaryShow}
        onClose={() => setBridgeSummaryShow(false)}
        route={selectedRoute}
        bridgeOrderTxRequest={bridgeOrderTxRequest}
        clearFromAmt={() => updateFromAmt('')}
        clearToAmt={() => updateToAmt('')}
        isDialogModal={isMobile}
      />
      <ErrorMessageDialog
        message={sendRouteError}
        onClose={() => setSendRouteError('')}
        isDialogModal={isMobile}
      />
    </Box>
  );
}

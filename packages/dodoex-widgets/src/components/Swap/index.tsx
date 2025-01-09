import { ChainId } from '@dodoex/api';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  RotatingIcon,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import {
  Dodo,
  DoubleRight,
  Setting,
  SettingCrossChain,
  Warn,
} from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppUrl } from '../../constants/api';
import { basicTokenMap } from '../../constants/chains';
import { setLastToken } from '../../constants/localstorage';
import { PRICE_IMPACT_THRESHOLD } from '../../constants/swap';
import {
  connectWalletBtn,
  swapAlertEnterAmountBtn,
  swapAlertFetchPriceBtn,
  swapAlertInsufficientBalanceBtn,
  swapAlertSelectTokenBtn,
  swapReviewBtn,
} from '../../constants/testId';
import { useFetchRoutePriceBridge } from '../../hooks/Bridge/useFetchRoutePriceBridge';
import { useSendRoute } from '../../hooks/Bridge/useSendRoute';
import { useSwitchBridgeOrSwapSlippage } from '../../hooks/Bridge/useSwitchBridgeOrSwapSlippage';
import useInflights from '../../hooks/Submission/useInflights';
import {
  RoutePriceStatus,
  useFetchFiatPrice,
  useFetchRoutePrice,
  useMarginAmount,
} from '../../hooks/Swap';
import { useInitDefaultToken } from '../../hooks/Swap/useInitDefaultToken';
import {
  maxSlippageWarning,
  useSlippageLimit,
} from '../../hooks/Swap/useSlippageLimit';
import { useSwapSlippage } from '../../hooks/Swap/useSwapSlippage';
import { TokenInfo } from '../../hooks/Token/type';
import { useDisabledTokenSwitch } from '../../hooks/Token/useDisabledTokenSwitch';
import { useTokenStatus } from '../../hooks/Token/useTokenStatus';
import { useFetchETHBalance } from '../../hooks/contract';
import {
  GetAutoSlippage,
  useSetAutoSlippage,
} from '../../hooks/setting/useSetAutoSlippage';
import { AppThunkDispatch } from '../../store/actions';
import { setFromTokenChainId } from '../../store/actions/wallet';
import { formatTokenAmountNumber } from '../../utils';
import { formatReadableNumber } from '../../utils/formatter';
import BridgeRouteShortCard from '../Bridge/BridgeRouteShortCard';
import BridgeSummaryDialog from '../Bridge/BridgeSummaryDialog';
import SelectBridgeDialog from '../Bridge/SelectBridgeDialog';
import NeedConnectButton from '../ConnectWallet/NeedConnectButton';
import ErrorMessageDialog from '../ErrorMessageDialog';
import TokenLogo from '../TokenLogo';
import { QuestionTooltip } from '../Tooltip';
import { useUserOptions } from '../UserOptionsProvider';
import { ReactComponent as ArrowRight } from './assets/arrow-right.svg';
import backgroundSvg from './assets/background.svg';
import subtractSvg from './assets/subtract.svg';
import { ReactComponent as SwapIcon } from './assets/swap-icon.svg';
import { ReviewDialog } from './components/ReviewDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { SwapSettingsDialog } from './components/SwapSettingsDialog';
import { SwitchBox } from './components/SwitchBox';
import { TokenCard } from './components/TokenCard';
import {
  TokenPairPriceWithToggle,
  useTokenPairPriceWithToggle,
} from './components/TokenPairPriceWithToggle';
import SwapInfoCard from './components/SwapInfoCard';

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
  const { chainId, account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { defaultChainId, noPowerBy, onlyChainId } = useUserOptions();

  const [isReverseRouting, setIsReverseRouting] = useState(false);
  const basicTokenAddress = useMemo(
    () => basicTokenMap[(chainId ?? defaultChainId) as ChainId]?.address,
    [chainId, defaultChainId],
  );

  const [displayingFromAmt, setDisplayingFromAmt] = useState<string>('');
  const [displayingToAmt, setDisplayingToAmt] = useState<string>('');
  const [fromAmt, setFromAmt] = useState<string>('');
  const [toAmt, setToAmt] = useState<string>('');
  const debounceTime = 1000;
  const debouncedSetFromAmt = useMemo(
    () => debounce((amt) => setFromAmt(amt), debounceTime),
    [],
  );
  const debouncedSetToAmt = useMemo(
    () => debounce((amt) => setToAmt(amt), debounceTime),
    [],
  );

  const [fromToken, setFromTokenOrigin] = useState<TokenInfo | null>(null);
  const [toToken, setToTokenOrigin] = useState<TokenInfo | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState<boolean>(false);
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

  const fromEtherTokenQuery = useFetchETHBalance(fromToken?.chainId);

  const { bridgeRouteList, status: bridgeRouteStatus } =
    useFetchRoutePriceBridge({
      toToken,
      fromToken,
      fromAmount: fromAmt,
    });
  const [switchBridgeRouteShow, setSwitchBridgeRouteShow] = useState(false);
  const [selectedRouteIdOrigin, setSelectRouteId] = useState('');
  const selectedRouteId = useMemo(() => {
    if (!selectedRouteIdOrigin && bridgeRouteList.length) {
      return bridgeRouteList[0].id;
    }
    return selectedRouteIdOrigin;
  }, [selectedRouteIdOrigin, bridgeRouteList]);
  const selectedRoute = useMemo(
    () =>
      bridgeRouteList.find(
        (route) =>
          route.id === selectedRouteId && route.fromAddress === account,
      ),
    [bridgeRouteList, selectedRouteId, account],
  );
  useEffect(() => {
    if (!selectedRoute && selectedRouteIdOrigin) {
      setSelectRouteId('');
    }
  }, [selectedRoute]);

  const {
    isApproving,
    isGetApproveLoading,
    needApprove,
    insufficientBalance,
    submitApprove,
    getMaxBalance,
  } = useTokenStatus(fromToken, {
    amount: fromAmt,
    contractAddress: selectedRoute?.spenderContractAddress,
  });
  const handleMaxClick = useCallback(() => {
    updateFromAmt(getMaxBalance());
  }, [getMaxBalance]);

  const estimateGas = useMemo(() => {
    if (
      !account ||
      insufficientBalance ||
      isApproving ||
      isGetApproveLoading ||
      needApprove
    ) {
      return false;
    }
    return true;
  }, [
    account,
    insufficientBalance,
    isApproving,
    isGetApproveLoading,
    needApprove,
  ]);

  const {
    status: resPriceStatus,
    rawBrief,
    executeSwap,
    reset: resetSwapRoute,
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
  } = useMemo(() => {
    if (!rawBrief)
      return {
        resAmount: null,
        priceImpact: null,
        baseFeeAmount: null,
        additionalFeeAmount: null,
        resPricePerToToken: null,
        resPricePerFromToken: null,
      };
    return rawBrief;
  }, [rawBrief]);

  const {
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend: handleSendBridgeRoute,
  } = useSendRoute();
  const [bridgeSummaryShow, setBridgeSummaryShow] = useState(false);

  const showSwitchSlippageTooltip = useSwitchBridgeOrSwapSlippage(isBridge);

  const updateFromAmt = useCallback(
    (v: string | number) => {
      const val = v.toString();
      setDisplayingFromAmt(val);
      debouncedSetFromAmt(val);
      resetSwapRoute();
    },
    [setDisplayingFromAmt, debouncedSetFromAmt, resetSwapRoute],
  );

  const updateToAmt = useCallback(
    (v: string | number) => {
      const val = v.toString();
      setDisplayingToAmt(val);
      debouncedSetToAmt(val);
      resetSwapRoute();
    },
    [setDisplayingToAmt, debouncedSetToAmt, resetSwapRoute],
  );

  const setFromToken: (value: React.SetStateAction<TokenInfo | null>) => void =
    useCallback(
      (value) => {
        return setFromTokenOrigin((prev) => {
          const newValue = typeof value === 'function' ? value(prev) : value;
          // sync redux
          if (!chainId) {
            // The chainId is only modified when the wallet is not connected, and the chain is specified when the wallet is connected.
            dispatch(
              setFromTokenChainId(
                (newValue?.chainId ?? undefined) as ChainId | undefined,
              ),
            );
          }
          // callback
          if (onPayTokenChange && newValue && newValue !== prev) {
            onPayTokenChange(newValue);
          }

          return newValue;
        });
      },
      [dispatch, setFromTokenChainId, onPayTokenChange, chainId],
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
    setSelectRouteId('');
  }, [
    setFromToken,
    toToken,
    setToToken,
    fromToken,
    updateFromAmt,
    updateToAmt,
    setSelectRouteId,
  ]);

  const onFromTokenChange = useCallback(
    (token: TokenInfo, isOccupied: boolean) => {
      if (isOccupied) return switchTokens();
      updateFromAmt('');
      updateToAmt('');
      setFromToken(token);
      setSelectRouteId('');
      setLastToken('from', token);
    },
    [
      switchTokens,
      updateFromAmt,
      updateToAmt,
      setFromToken,
      setSelectRouteId,
      setLastToken,
    ],
  );
  const onToTokenChange = useCallback(
    (token: TokenInfo, isOccupied: boolean) => {
      if (isOccupied) return switchTokens();
      updateFromAmt('');
      updateToAmt('');
      setToToken(token);
      setSelectRouteId('');
      setLastToken('to', token);
    },
    [
      switchTokens,
      updateFromAmt,
      updateToAmt,
      setFromToken,
      setSelectRouteId,
      setLastToken,
    ],
  );
  const onFromTokenInputFocus = useCallback(() => {
    if (isReverseRouting) {
      updateFromAmt('');
    }
    setIsReverseRouting(false);
  }, [isReverseRouting, updateFromAmt, dispatch]);
  const onToTokenInputFocus = useCallback(() => {
    if (!isReverseRouting) {
      updateToAmt('');
    }
    setIsReverseRouting(true);
  }, [isReverseRouting, updateToAmt, dispatch]);

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

  const priceToggle = useTokenPairPriceWithToggle({
    toToken,
    fromToken,
    pricePerToToken: resPricePerToToken,
    pricePerFromToken: resPricePerFromToken,
  });

  const tokenPairPrice = useMemo(() => {
    return (
      <TokenPairPriceWithToggle
        priceStatus={resPriceStatus}
        leftSymbol={priceToggle.leftSymbol}
        rightSymbol={priceToggle.rightSymbol}
        rightAmount={priceToggle.rightAmount}
        handleSwitch={priceToggle.handleSwitch}
      />
    );
  }, [
    priceToggle.handleSwitch,
    priceToggle.leftSymbol,
    priceToggle.rightAmount,
    priceToggle.rightSymbol,
    resPriceStatus,
  ]);

  const isUnSupportChain = useMemo(() => !ChainId[chainId || 1], [chainId]);
  const isNotCurrentChain = useMemo(
    () => !!chainId && !!fromToken?.chainId && fromToken?.chainId !== chainId,
    [chainId, fromToken?.chainId],
  );

  const disabledSwitch = useDisabledTokenSwitch({
    fromToken,
    toToken,
  });

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
    fromAmt,
    toAmt,
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
            <RotatingIcon sx={{ mr: 5, width: 19, height: 19 }} />
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
    if (
      !isBridge &&
      displayingFromAmt &&
      new BigNumber(displayPriceImpact).gt(PRICE_IMPACT_THRESHOLD)
    ) {
      return priceImpactWarning;
    }
    if (isBridge && bridgeRouteList.length) {
      {
        /* Bridge select route */
      }
      return (
        <>
          {slippageExceedLimit}
          <BridgeRouteShortCard
            route={selectedRoute}
            onClick={() => setSwitchBridgeRouteShow(true)}
          />
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
    if (!account || (fromToken?.chainId && chainId !== fromToken.chainId))
      return (
        <NeedConnectButton
          size={Button.Size.big}
          variant={Button.Variant.darken}
          fullWidth
          data-testid={connectWalletBtn}
          chainId={fromToken?.chainId}
        />
      );
    if (isInflight) {
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          isLoading
          disabled
        >
          <Trans>Transaction Pending</Trans>
        </Button>
      );
    }
    if (!fromToken || !toToken)
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled
          data-testid={swapAlertSelectTokenBtn}
        >
          <Trans>Select Tokens</Trans>
        </Button>
      );
    if (needApprove)
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled={isApproving}
          onClick={() => submitApprove()}
        >
          {isApproving ? <Trans>Approving</Trans> : <Trans>Approve</Trans>}
        </Button>
      );
    if (!new BigNumber(isReverseRouting ? toAmt : fromAmt).gt(0))
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled
          data-testid={swapAlertEnterAmountBtn}
        >
          <Trans>Enter an amount</Trans>
        </Button>
      );

    if (
      isBridge
        ? bridgeRouteStatus === RoutePriceStatus.Loading || isGetApproveLoading
        : resPriceStatus === RoutePriceStatus.Loading
    )
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled
          data-testid={swapAlertFetchPriceBtn}
        >
          <Trans>Fetching Price...</Trans>
        </Button>
      );

    let routeFailed = false;
    if (isBridge) {
      routeFailed =
        !bridgeRouteList.length ||
        bridgeRouteStatus === RoutePriceStatus.Failed;
    } else {
      routeFailed = !resAmount || resPriceStatus === RoutePriceStatus.Failed;
    }
    if (routeFailed)
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled
        >
          <Trans>Quote not available</Trans>
        </Button>
      );
    if (insufficientBalance)
      // balance need to greater than reserved gas!
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
          disabled
          data-testid={swapAlertInsufficientBalanceBtn}
        >
          <Trans>Insufficient balance</Trans>
        </Button>
      );

    if (isBridge) {
      return (
        <Button
          fullWidth
          size={Button.Size.big}
          variant={Button.Variant.darken}
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
    return (
      <Button
        fullWidth
        size={Button.Size.big}
        variant={Button.Variant.darken}
        onClick={() => setIsReviewDialogOpen(true)}
        data-testid={swapReviewBtn}
      >
        <Trans>Review Swap</Trans>
      </Button>
    );
  }, [
    account,
    toAmt,
    fromAmt,
    toToken,
    resAmount,
    fromToken,
    isInflight,
    executeSwap,
    submitApprove,
    resPriceStatus,
    basicTokenAddress,
    isReverseRouting,
    isBridge,
    bridgeRouteStatus,
    bridgeRouteList,
    sendRouteLoading,
    fromEtherTokenQuery.data?.balance,
    insufficientBalance,
    isApproving,
    isGetApproveLoading,
    needApprove,
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
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 12,
          [theme.breakpoints.up('desktop')]: {
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 28,
            px: 16,
            py: 24,
            borderRadius: 20,
            backgroundColor: '#C9EB62',
            backgroundImage: `url(${backgroundSvg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'top',
            [theme.breakpoints.up('desktop')]: {
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          }}
        >
          <Box
            sx={{
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              p: 16,
              borderRadius: 16,
              backgroundColor: alpha('#000', 0.1),
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                backgroundColor: '#000',
              }}
            >
              <SwapIcon />
            </Box>
            <Box
              sx={{
                typography: 'caption',
                color: theme.palette.text.primary,
              }}
            >
              Swap
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 4,
              position: 'relative',
              [theme.breakpoints.up('desktop')]: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              },
            }}
          >
            <TokenCard
              sx={{
                flex: 1,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 20,
                padding: theme.spacing(20, 36, 24, 20),
              }}
              title="Sell"
              token={fromToken}
              side="from"
              amt={fromFinalAmt}
              defaultLoadBalance
              onMaxClick={handleMaxClick}
              onInputChange={updateFromAmt}
              onInputFocus={onFromTokenInputFocus}
              showMaxBtn={!isReverseRouting && !displayingFromAmt}
              occupiedAddrs={[toToken?.address ?? '']}
              occupiedChainId={toToken?.chainId}
              fiatPriceTxt={
                displayFromFiatPrice
                  ? `$${formatReadableNumber({
                      input: displayFromFiatPrice,
                      showDecimals: 1,
                    })}`
                  : '-'
              }
              onTokenChange={onFromTokenChange}
              readOnly={isReverseRouting}
              showChainLogo={!onlyChainId}
              showChainName={!onlyChainId}
            />
            <Box
              component={ButtonBase}
              sx={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                [theme.breakpoints.up('desktop')]: {
                  transform: 'translate(-50%, -50%) rotate(0deg)',
                },
                color: 'text.secondary',
                ...(disabledSwitch
                  ? {
                      cursor: 'inherit',
                    }
                  : {
                      '&:hover': {
                        color: 'text.primary',
                      },
                      '&:focus-visible': {
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          display: 'block',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '50%',
                          width: 36 - 8,
                          height: 36 - 8,
                          border: 'solid 1px',
                          borderColor: 'text.primary',
                        },
                      },
                    }),
              }}
              disabled={disabledSwitch}
              onClick={() => {
                if (disabledSwitch) return;
                if (switchTokens) {
                  switchTokens();
                }
              }}
            >
              <Box
                component={ArrowRight}
                sx={{
                  width: 36,
                  height: 36,
                }}
              />
            </Box>
            <TokenCard
              sx={{
                flex: 1,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 20,
                padding: theme.spacing(20, 36, 24, 20),
              }}
              title="Buy"
              token={toToken}
              side="to"
              amt={toFinalAmt}
              onInputChange={updateToAmt}
              onInputFocus={onToTokenInputFocus}
              occupiedAddrs={[fromToken?.address ?? '']}
              occupiedChainId={fromToken?.chainId}
              fiatPriceTxt={
                displayToFiatPrice
                  ? `$${formatReadableNumber({
                      input: displayToFiatPrice,
                      showDecimals: 1,
                    })}(${displayPriceImpact}%)`
                  : '-'
              }
              onTokenChange={onToTokenChange}
              readOnly={isBridge || !isReverseRouting}
              showChainLogo={!onlyChainId}
              showChainName={!onlyChainId}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {priceInfo}
            </Box>
            <Box
              sx={{
                alignSelf: 'stretch',
                [theme.breakpoints.up('desktop')]: {
                  alignSelf: 'center',
                  width: '100%',
                  maxWidth: 480,
                },
              }}
            >
              {swapButton}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            [theme.breakpoints.up('desktop')]: {
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
              width: 330,
            },
          }}
        >
          <SwapInfoCard
            path={
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.8002 7.99998C12.8002 8.21998 12.7869 8.42664 12.7602 8.62664L14.1002 9.67998C14.2269 9.77331 14.2602 9.93998 14.1802 10.0866L12.9002 12.3C12.8202 12.4466 12.6536 12.5 12.5069 12.4466L10.9136 11.8066C10.5869 12.06 10.2269 12.2733 9.83357 12.4333L9.59357 14.1266C9.57357 14.2866 9.44024 14.4 9.28024 14.4H6.72024C6.56024 14.4 6.43357 14.2866 6.40024 14.1266L6.16024 12.4333C5.7669 12.2733 5.41357 12.06 5.08024 11.8066L3.4869 12.4466C3.34024 12.4933 3.17357 12.4466 3.09357 12.3L1.81357 10.0866C1.74024 9.95331 1.77357 9.77331 1.89357 9.67998L3.2469 8.62664C3.21357 8.42664 3.20024 8.20664 3.20024 7.99998C3.20024 7.79331 3.2269 7.57331 3.26024 7.37331L1.9069 6.31998C1.77357 6.22664 1.7469 6.05331 1.8269 5.91331L3.10024 3.69998C3.18024 3.55331 3.3469 3.49998 3.49357 3.55331L5.0869 4.19331C5.41357 3.94664 5.77357 3.72664 6.1669 3.56664L6.4069 1.87331C6.43357 1.71331 6.56024 1.59998 6.72024 1.59998H9.28024C9.44024 1.59998 9.57357 1.71331 9.60024 1.87331L9.84024 3.56664C10.2336 3.72664 10.5869 3.93998 10.9202 4.19331L12.5136 3.55331C12.6602 3.50664 12.8269 3.55331 12.9069 3.69998L14.1869 5.91331C14.2602 6.04664 14.2269 6.22664 14.1069 6.31998L12.7536 7.37331C12.7869 7.57331 12.8002 7.78664 12.8002 7.99998ZM5.60034 7.99998C5.60034 9.31998 6.68034 10.4 8.00034 10.4C9.32034 10.4 10.4003 9.31998 10.4003 7.99998C10.4003 6.67998 9.32034 5.59998 8.00034 5.59998C6.68034 5.59998 5.60034 6.67998 5.60034 7.99998Z"
                fill="currentColor"
              />
            }
            title={'Slippage'}
            value={`${slippageSwap}%`}
            description={
              'The dynamic slippage is provide through analyzing historical transactions'
            }
            onClick={() => setIsSettingsDialogOpen(true)}
          />
          <SwapInfoCard
            path={
              <path
                d="M8.66667 4.66669H2V6.66669H14L8.66667 1.66669V4.66669ZM7 14.3334V11.3334H14V9.33335H2L7 14.3334Z"
                fill="currentColor"
              />
            }
            title={'Rate'}
            value={
              priceToggle.rightAmount
                ? formatReadableNumber({
                    input: priceToggle.rightAmount,
                    showDecimals: 4,
                  })
                : '-'
            }
            description={`${priceToggle.leftSymbol}/${priceToggle.rightSymbol}`}
            descriptionVisibleInMobile
            onClick={priceToggle.handleSwitch}
          />
        </Box>
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
      />
      {isBridge ? (
        <SettingsDialog
          open={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          isBridge
        />
      ) : (
        <SwapSettingsDialog
          open={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          fromToken={fromToken}
          toToken={toToken}
        />
      )}
      <SelectBridgeDialog
        open={switchBridgeRouteShow}
        onClose={() => setSwitchBridgeRouteShow(false)}
        selectedRouteId={selectedRouteId}
        setSelectRouteId={setSelectRouteId}
        bridgeRouteList={bridgeRouteList}
      />
      <BridgeSummaryDialog
        open={bridgeSummaryShow}
        onClose={() => setBridgeSummaryShow(false)}
        route={selectedRoute}
        bridgeOrderTxRequest={bridgeOrderTxRequest}
        clearFromAmt={() => updateFromAmt('')}
        clearToAmt={() => updateToAmt('')}
      />
      <ErrorMessageDialog
        message={sendRouteError}
        onClose={() => setSendRouteError('')}
      />
    </>
  );
}

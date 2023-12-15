import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import {
  Box,
  Button,
  BaseButton,
  useTheme,
  RotatingIcon,
  Tooltip,
} from '@dodoex/components';
import { formatTokenAmountNumber, isETHChain } from '../../utils';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Setting, Dodo, Warn, DoubleRight } from '@dodoex/icons';
import { Trans, t } from '@lingui/macro';
import { TokenCard } from './components/TokenCard';
import { QuestionTooltip } from '../Tooltip';
import { SwitchBox } from './components/SwitchBox';
import { ReviewDialog } from './components/ReviewDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { RoutePriceStatus } from '../../hooks/Swap';
import { TokenPairPriceWithToggle } from './components/TokenPairPriceWithToggle';
import ConnectWallet from './components/ConnectWallet';
import useGetBalance from '../../hooks/Token/useGetBalance';
import { useGetTokenStatus } from '../../hooks/Token/useGetTokenStatus';
import { TokenInfo, ApprovalState } from '../../hooks/Token/type';
import {
  useMarginAmount,
  useFetchFiatPrice,
  useFetchRoutePrice,
} from '../../hooks/Swap';
import { formatReadableNumber } from '../../utils/formatter';
import { useWeb3React } from '@web3-react/core';
import { getDefaultChainId } from '../../store/selectors/wallet';
import { AppUrl } from '../../constants/api';
import { ChainId, basicTokenMap } from '../../constants/chains';
import { PRICE_IMPACT_THRESHOLD } from '../../constants/swap';
import TokenLogo from '../TokenLogo';
import {
  swapAlertEnterAmountBtn,
  swapAlertFetchPriceBtn,
  swapAlertInsufficientBalanceBtn,
  swapAlertSelectTokenBtn,
  swapReviewBtn,
} from '../../constants/testId';
import useInflights from '../../hooks/Submission/useInflights';
import { getGlobalProps } from '../../store/selectors/globals';
import { setGlobalProps } from '../../store/actions/globals';
import { AppThunkDispatch } from '../../store/actions';
import { useFetchRoutePriceBridge } from '../../hooks/Bridge/useFetchRoutePriceBridge';
import SelectBridgeDialog from '../Bridge/SelectBridgeDialog';
import BridgeRouteShortCard from '../Bridge/BridgeRouteShortCard';
import { useSendRoute } from '../../hooks/Bridge/useSendRoute';
import BridgeSummaryDialog from '../Bridge/BridgeSummaryDialog';
import ErrorMessageDialog from '../ErrorMessageDialog';
import { useSwitchBridgeOrSwapSlippage } from '../../hooks/Bridge/useSwitchBridgeOrSwapSlippage';
import { useInitDefaultToken } from '../../hooks/Swap/useInitDefaultToken';
import { setLastToken } from '../../constants/localstorage';
import {
  maxSlippageWarning,
  useSlippageLimit,
} from '../../hooks/Swap/useSlippageLimit';
import { useDisabledTokenSwitch } from '../../hooks/Token/useDisabledTokenSwitch';
import {
  GetAutoSlippage,
  useSetAutoSlippage,
} from '../../hooks/setting/useSetAutoSlippage';
import { setFromTokenChainId } from '../../store/actions/wallet';

export interface SwapProps {
  /** Higher priority setting slippage */
  getAutoSlippage?: GetAutoSlippage;
}

export function Swap({ getAutoSlippage }: SwapProps = {}) {
  const theme = useTheme();
  const { isInflight } = useInflights();
  const { chainId, account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { isReverseRouting, noPowerBy } = useSelector(getGlobalProps);
  const defaultChainId = useSelector(getDefaultChainId);
  const { isETH } = useMemo(() => isETHChain(chainId), [chainId]);
  const basicTokenAddress = useMemo(
    () => basicTokenMap[(chainId ?? defaultChainId) as ChainId]?.address,
    [chainId],
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
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
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
    chainId,
    toToken,
    fromToken,
  });
  const getBalance = useGetBalance();
  const fromEtherTokenBalance = useMemo(() => {
    const fromChainId = fromToken?.chainId;
    if (!isBridge || !fromChainId) return null;
    const etherToken = basicTokenMap[fromChainId as ChainId];
    if (!etherToken) {
      return null;
    }
    return getBalance({
      ...etherToken,
      chainId: fromChainId,
    });
  }, [isBridge, fromToken?.chainId, getBalance]);

  const { marginAmount } = useMarginAmount({
    token: isReverseRouting ? toToken : fromToken,
    fiatPrice: isReverseRouting ? toFiatPrice : fromFiatPrice,
  });

  useSetAutoSlippage({
    fromToken,
    toToken,
    getAutoSlippage,
  });
  const {
    resAmount,
    priceImpact,
    executeSwap,
    baseFeeAmount,
    additionalFeeAmount,
    resPricePerToToken,
    resPricePerFromToken,
    status: resPriceStatus,
  } = useFetchRoutePrice({
    toToken,
    fromToken,
    marginAmount,
    fromAmount: fromAmt,
    toAmount: toAmt,
  });
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
    () => bridgeRouteList.find((route) => route.id === selectedRouteId),
    [bridgeRouteList, selectedRouteId],
  );
  useEffect(() => {
    if (!selectedRoute && selectedRouteIdOrigin) {
      setSelectRouteId('');
    }
  }, [selectedRoute]);
  const {
    sendRouteLoading,
    sendRouteError,
    setSendRouteError,
    bridgeOrderTxRequest,

    handleClickSend: handleSendBridgeRoute,
  } = useSendRoute();
  const [bridgeSummaryShow, setBridgeSummaryShow] = useState(false);

  const showSwitchSlippageTooltip = useSwitchBridgeOrSwapSlippage(isBridge);

  const { getApprovalState, submitApprove, getPendingRest, getMaxBalance } =
    useGetTokenStatus({
      account,
      chainId: fromToken?.chainId ?? chainId,
      contractAddress: selectedRoute?.spenderContractAddress,
    });
  const pendingReset = useMemo(
    () => getPendingRest(isReverseRouting ? toToken : fromToken),
    [fromToken?.address, toToken?.address, getPendingRest, isReverseRouting],
  );

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
        // sync redux
        if (typeof value === 'function') {
          return setFromTokenOrigin((prev) => {
            const newValue = value(prev);
            dispatch(
              setFromTokenChainId(
                (newValue?.chainId ?? undefined) as ChainId | undefined,
              ),
            );
            return newValue;
          });
        }
        dispatch(
          setFromTokenChainId(
            (value?.chainId ?? undefined) as ChainId | undefined,
          ),
        );
        return setFromTokenOrigin(value);
      },
      [dispatch, setFromTokenChainId],
    );

  useInitDefaultToken({
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    updateFromAmt,
    updateToAmt,
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

  const handleMaxClick = useCallback(
    (max: string) =>
      isReverseRouting
        ? updateToAmt(getMaxBalance(toToken))
        : updateFromAmt(getMaxBalance(fromToken)),
    [
      updateFromAmt,
      updateToAmt,
      getMaxBalance,
      fromToken,
      toToken,
      isReverseRouting,
    ],
  );

  const isSlippageExceedLimit = useSlippageLimit(isBridge);

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
  }, [displayPriceImpact]);

  const tokenPairPrice = useMemo(() => {
    return (
      <TokenPairPriceWithToggle
        toToken={toToken}
        fromToken={fromToken}
        priceStatus={resPriceStatus}
        pricePerToToken={resPricePerToToken}
        pricePerFromToken={resPricePerFromToken}
      />
    );
  }, [
    toToken,
    fromToken,
    resPriceStatus,
    resPricePerToToken,
    resPricePerFromToken,
  ]);

  const isUnSupportChain = useMemo(() => !ChainId[chainId || 1], [chainId]);
  const isNotCurrentChain = useMemo(
    () => chainId && !!fromToken?.chainId && fromToken?.chainId !== chainId,
    [chainId, fromToken?.chainId],
  );

  const insufficientBalance = useMemo(() => {
    const token = isReverseRouting ? toToken : fromToken;
    const isBasicToken = basicTokenAddress === token?.address;
    const keepChanges = isETH ? 0.1 : 0.02;
    const balance = new BigNumber(token ? getBalance(token) || 0 : 0);
    return (
      balance.lt(isReverseRouting ? resAmount ?? 0 : fromAmt) ||
      (isBasicToken && balance.lte(keepChanges))
    );
  }, [isReverseRouting, fromToken, toToken, fromAmt, resAmount, getBalance]);

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
    const approvalState = getApprovalState(
      fromToken,
      isReverseRouting ? resAmount || 0 : fromAmt,
    );
    const isApproving = approvalState === ApprovalState.Approving;
    const needApprove =
      approvalState === ApprovalState.Insufficient && !pendingReset;

    if (!account || (fromToken?.chainId && chainId !== fromToken.chainId))
      return <ConnectWallet />;
    if (isInflight) {
      return (
        <Button fullWidth isLoading disabled>
          <Trans>Transaction Pending</Trans>
        </Button>
      );
    }
    if (!fromToken || !toToken)
      return (
        <Button fullWidth disabled data-testid={swapAlertSelectTokenBtn}>
          <Trans>Select Tokens</Trans>
        </Button>
      );
    if (needApprove)
      return (
        <Button
          fullWidth
          disabled={isApproving}
          onClick={() => submitApprove(fromToken)}
        >
          {isApproving ? <Trans>Approving</Trans> : <Trans>Approve</Trans>}
        </Button>
      );
    if (!new BigNumber(isReverseRouting ? toAmt : fromAmt).gt(0))
      return (
        <Button fullWidth disabled data-testid={swapAlertEnterAmountBtn}>
          <Trans>Enter an amount</Trans>
        </Button>
      );

    if (
      isBridge
        ? bridgeRouteStatus === RoutePriceStatus.Loading ||
          approvalState === ApprovalState.Loading
        : resPriceStatus === RoutePriceStatus.Loading
    )
      return (
        <Button fullWidth disabled data-testid={swapAlertFetchPriceBtn}>
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
        <Button fullWidth disabled>
          <Trans>Quote not available</Trans>
        </Button>
      );
    if (insufficientBalance)
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

    if (isBridge) {
      return (
        <Button
          fullWidth
          onClick={() =>
            handleSendBridgeRoute({
              selectedRoute,
              fromEtherTokenBalance,
              goNext: () => setBridgeSummaryShow(true),
            })
          }
          data-testid={swapReviewBtn}
          isLoading={sendRouteLoading}
        >
          <Trans>Review Cross Chain</Trans>
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
    account,
    toAmt,
    fromAmt,
    toToken,
    resAmount,
    fromToken,
    isInflight,
    executeSwap,
    pendingReset,
    submitApprove,
    resPriceStatus,
    getApprovalState,
    basicTokenAddress,
    isReverseRouting,
    isBridge,
    bridgeRouteStatus,
    bridgeRouteList,
    sendRouteLoading,
    fromEtherTokenBalance,
    insufficientBalance,
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
          sx={{
            width: 16,
            height: 16,
            mr: 6,
          }}
          chainId={fromToken.chainId}
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
          sx={{
            width: 16,
            height: 16,
            mr: 6,
          }}
          chainId={toToken.chainId}
        />
        {`${formatTokenAmountNumber({
          input: isReverseRouting ? toAmt : resAmount,
          decimals: toToken?.decimals,
        })} ${toToken?.symbol}`}
      </Box>
    );
  }, [fromToken, toToken, fromAmt, toAmt, resAmount, isReverseRouting]);

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          typography: 'caption',
          margin: 20,
        }}
      >
        <Trans>Swap</Trans>
        <Tooltip
          open={showSwitchSlippageTooltip}
          title={
            isBridge ? (
              <Trans>The setting has been switched to cross chain mode</Trans>
            ) : (
              <Trans>The setting has been switched to swap mode</Trans>
            )
          }
          placement="bottom-end"
        >
          <Box component={BaseButton}>
            <Box
              component={Setting}
              onClick={() => setIsSettingsDialogOpen(true)}
              sx={{
                width: 19,
                height: 19,
                color: 'text.primary',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Tooltip>
      </Box>

      {/* Scroll Container */}
      <Box sx={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        {/* Swap Module */}
        <Box>
          {/* First Token Card  */}
          <TokenCard
            sx={{ mb: 4 }}
            token={fromToken}
            side="from"
            amt={fromFinalAmt}
            defaultLoadBalance
            onlyCurrentChain
            onMaxClick={handleMaxClick}
            onInputChange={updateFromAmt}
            onInputFocus={() => {
              if (isReverseRouting) {
                updateFromAmt('');
              }
              dispatch(setGlobalProps({ isReverseRouting: false }));
            }}
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
            onTokenChange={(token: TokenInfo, isOccupied: boolean) => {
              if (isOccupied) return switchTokens();
              updateFromAmt('');
              updateToAmt('');
              setFromToken(token);
              setSelectRouteId('');
              setLastToken('from', token);
            }}
            readOnly={isReverseRouting}
            showChainLogo
          />

          {/* Switch Icon */}
          <SwitchBox onClick={switchTokens} disabled={disabledSwitch} />

          {/* Second Token Card  */}
          <TokenCard
            token={toToken}
            side="to"
            amt={toFinalAmt}
            onInputChange={updateToAmt}
            onInputFocus={() => {
              if (!isReverseRouting) {
                updateToAmt('');
              }
              dispatch(setGlobalProps({ isReverseRouting: true }));
            }}
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
            onTokenChange={(token: TokenInfo, isOccupied: boolean) => {
              if (isOccupied) return switchTokens();
              updateFromAmt('');
              updateToAmt('');
              setToToken(token);
              setSelectRouteId('');
              setLastToken('to', token);
            }}
            readOnly={isBridge || !isReverseRouting}
            showChainLogo
          />

          {/* Price Disp or Warnings  */}
          <Box
            sx={{
              py: 12,
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
                width: 24,
                typography: 'body2',
                transform: 'translate(1px, 2px)',
                '& path': {
                  fill: theme.palette.text.disabled,
                },
              }}
              component={Dodo}
            />
            <Trans>Powered by DODO protocol</Trans>
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
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        isBridge={isBridge}
      />
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

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
import { Trans, t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppUrl } from '../../constants/api';
import { basicTokenMap } from '../../constants/chains';
import { setLastToken } from '../../constants/localstorage';
import { PRICE_IMPACT_THRESHOLD } from '../../constants/swap';
import {
  swapAlertEnterAmountBtn,
  swapAlertFetchPriceBtn,
  swapAlertInsufficientBalanceBtn,
  swapAlertSelectTokenBtn,
  swapReviewBtn,
} from '../../constants/testId';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
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
import {
  GetAutoSlippage,
  useSetAutoSlippage,
} from '../../hooks/setting/useSetAutoSlippage';
import { AppThunkDispatch } from '../../store/actions';
import { setFromTokenChainId } from '../../store/actions/wallet';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../utils/formatter';
import TokenLogo from '../TokenLogo';
import { QuestionTooltip } from '../Tooltip';
import { useUserOptions } from '../UserOptionsProvider';
import ConnectWallet from './components/ConnectWallet';
import { ReviewDialog } from './components/ReviewDialog';
import { SwapSettingsDialog } from './components/SwapSettingsDialog';
import { SwitchBox } from './components/SwitchBox';
import { TokenCard } from './components/TokenCard';
import { TokenPairPriceWithToggle } from './components/TokenPairPriceWithToggle';

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
  const { chainId, account } = useWalletInfo();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { defaultChainId, noPowerBy, onlyChainId, onlySolana } =
    useUserOptions();
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

  const {
    isApproving,
    isGetApproveLoading,
    needApprove,
    insufficientBalance,
    submitApprove,
    getMaxBalance,
  } = useTokenStatus(fromToken, {
    amount: fromAmt,
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
  } = useFetchRoutePrice({
    toToken,
    fromToken,
    fromAmount: fromAmt,
    slippage: slippageSwap,
  });
  const {
    resAmount,
    priceImpact,
    baseFeeAmount,
    additionalFeeAmount,
    resPricePerToToken,
    resPricePerFromToken,
  } = useMemo(() => {
    if (!rawBrief) {
      return {
        resAmount: null,
        priceImpact: null,
        baseFeeAmount: null,
        additionalFeeAmount: null,
        resPricePerToToken: null,
        resPricePerFromToken: null,
      };
    }

    const resPricePerToToken = new BigNumber(rawBrief.inAmount)
      .dividedBy(rawBrief.outAmount)
      .toNumber();
    const resPricePerFromToken = new BigNumber(rawBrief.outAmount)
      .dividedBy(rawBrief.inAmount)
      .toNumber();
    return {
      resAmount: rawBrief.resAmount,
      priceImpact: rawBrief.priceImpact,
      baseFeeAmount: 0,
      additionalFeeAmount: 0,
      resPricePerToToken,
      resPricePerFromToken,
    };
  }, [rawBrief]);

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
  }, [isReverseRouting, updateFromAmt, dispatch]);
  const onToTokenInputFocus = useCallback(() => {
    if (!isReverseRouting) {
      updateToAmt('');
    }
    setIsReverseRouting(true);
  }, [isReverseRouting, updateToAmt, dispatch]);

  const isSlippageExceedLimit = useSlippageLimit(slippageSwap);

  const displayPriceImpact = useMemo(
    () =>
      priceImpact
        ? new BigNumber(priceImpact)
            .multipliedBy(100)
            .dp(4, BigNumber.ROUND_DOWN)
            .toString()
        : null,
    [priceImpact],
  );

  const displayFromFiatPrice = useMemo(() => {
    const fromAmount = isReverseRouting ? resAmount : fromAmt;
    return fromAmount && fromFiatPrice
      ? new BigNumber(fromFiatPrice).multipliedBy(fromAmount)
      : null;
  }, [fromFiatPrice, fromAmt, isReverseRouting, resAmount]);

  const displayToFiatPrice = useMemo(() => {
    if (!toFiatPrice) return null;

    const toAmount = isReverseRouting ? toAmt : resAmount;
    return toAmount ? new BigNumber(toFiatPrice).multipliedBy(toAmount) : null;
  }, [toFiatPrice, toAmt, isReverseRouting, resAmount]);

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
      />
    );
  }, [
    toToken,
    fromToken,
    resPriceStatus,
    resPricePerToToken,
    resPricePerFromToken,
  ]);

  const isUnSupportChain = useMemo(
    () => !ChainId[chainId || 1] && (!onlyChainId || onlyChainId !== chainId),
    [chainId],
  );
  const isNotCurrentChain = useMemo(
    () =>
      !onlySolana &&
      !!chainId &&
      !!fromToken?.chainId &&
      fromToken?.chainId !== chainId,
    [chainId, fromToken?.chainId, onlySolana],
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
      resPriceStatus !== RoutePriceStatus.Success
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
  }, [isSlippageExceedLimit, isReverseRouting, fromAmt, toAmt, resPriceStatus]);

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
    if (resPriceStatus === RoutePriceStatus.Loading) {
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
      displayingFromAmt &&
      displayPriceImpact &&
      new BigNumber(displayPriceImpact).gt(PRICE_IMPACT_THRESHOLD)
    ) {
      return priceImpactWarning;
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
  ]);

  const swapButton = useMemo(() => {
    if (!account || (fromToken?.chainId && chainId !== fromToken.chainId))
      return <ConnectWallet needSwitchChain={fromToken?.chainId} />;
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
          onClick={() => submitApprove()}
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

    if (resPriceStatus === RoutePriceStatus.Loading)
      return (
        <Button fullWidth disabled data-testid={swapAlertFetchPriceBtn}>
          <Trans>Fetching Price...</Trans>
        </Button>
      );

    const routeFailed =
      !resAmount || resPriceStatus === RoutePriceStatus.Failed;
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
    fromToken,
    chainId,
    isInflight,
    toToken,
    needApprove,
    isApproving,
    isReverseRouting,
    toAmt,
    fromAmt,
    resPriceStatus,
    resAmount,
    insufficientBalance,
    submitApprove,
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
          open={undefined}
          title={<Trans>The setting has been switched to swap mode</Trans>}
          placement="bottom-end"
        >
          <Box component={ButtonBase}>
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
      <Box sx={{ flex: 1, padding: '0 16px 12px', overflowY: 'auto' }}>
        {/* Swap Module */}
        <Box>
          {/* First Token Card  */}
          <TokenCard
            sx={{ mb: 4 }}
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
            notTokenPickerModal
          />

          {/* Switch Icon */}
          <SwitchBox onClick={switchTokens} disabled={disabledSwitch} />

          {/* Second Token Card  */}
          <TokenCard
            token={toToken}
            side="to"
            amt={toFinalAmt}
            onInputChange={updateToAmt}
            // onInputFocus={onToTokenInputFocus}
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
            readOnly
            showChainLogo={!onlyChainId}
            showChainName={!onlyChainId}
            notTokenPickerModal
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
                width: 18,
                height: 18,
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
        onClose={() => setIsReviewDialogOpen(false)}
        loading={resPriceStatus === RoutePriceStatus.Loading}
        slippage={slippageSwap}
      />
      <SwapSettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        fromToken={fromToken}
        toToken={toToken}
      />
    </>
  );
}

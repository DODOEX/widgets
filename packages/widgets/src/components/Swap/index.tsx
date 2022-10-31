import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import {
  Box,
  Button,
  BaseButton,
  useTheme,
  RotatingIcon,
} from '@dodoex-io/components';
import { formatTokenAmountNumber, isETHChain } from '../../utils';
import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from 'react';
import { useSelector } from 'react-redux';
import { Setting, Dodo, Warn, DoubleRight } from '@dodoex-io/icons';
import { Trans } from '@lingui/macro';
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
import {
  getDefaultToToken,
  getDefaultFromToken,
} from '../../store/selectors/token';
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

export function Swap() {
  const theme = useTheme();
  const { isInflight } = useInflights();
  const { chainId, account } = useWeb3React();
  const defaultChainId = useSelector(getDefaultChainId);
  const defaultToToken = useSelector(getDefaultToToken);
  const defaultFromToken = useSelector(getDefaultFromToken);
  const { isETH } = useMemo(() => isETHChain(chainId), [chainId]);
  const basicTokenAddress = useMemo(
    () => basicTokenMap[(chainId ?? defaultChainId) as ChainId]?.address,
    [chainId],
  );

  const [displayingFromAmt, setDisplayingFromAmt] = useState<string>('');
  const [fromAmt, setFromAmt] = useState<string>('');
  const debouncedSetFromAmt = useMemo(
    () => debounce((amt) => setFromAmt(amt), 600),
    [],
  );

  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState<boolean>(false);
  const { toFiatPrice, fromFiatPrice } = useFetchFiatPrice({
    chainId,
    toToken,
    fromToken,
  });
  const getBalance = useGetBalance();
  const fromTokenBalance = useMemo(
    () => (fromToken ? getBalance(fromToken) : null),
    [fromToken, getBalance],
  );
  const { getApprovalState, submitApprove, getPendingRest, getMaxBalance } =
    useGetTokenStatus({
      account,
      chainId,
    });
  const pendingReset = useMemo(
    () => getPendingRest(fromToken),
    [fromToken?.address, getPendingRest],
  );
  const { marginAmount } = useMarginAmount({
    fromToken,
    fromFiatPrice,
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
  });

  const updateFromAmt = useCallback(
    (v: string | number) => {
      const val = v.toString();
      setDisplayingFromAmt(val);
      debouncedSetFromAmt(val);
    },
    [setDisplayingFromAmt, debouncedSetFromAmt],
  );

  useEffect(() => {
    if (chainId) {
      setToToken(null);
      setFromToken(null);
      updateFromAmt('');
    }
    if (defaultToToken && defaultToToken.chainId === chainId) {
      setToToken(defaultToToken);
    }
    if (defaultFromToken && defaultFromToken.chainId === chainId) {
      setFromToken(defaultFromToken);
    }
  }, [defaultToToken, defaultFromToken, chainId, updateFromAmt]);

  const switchTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    updateFromAmt('');
  }, [setFromToken, toToken, setToToken, fromToken, updateFromAmt]);

  const handleMaxClick = useCallback(
    (max: string) => updateFromAmt(getMaxBalance(fromToken)),
    [updateFromAmt, getMaxBalance, fromToken],
  );

  const displayPriceImpact = useMemo(
    () => (Number(priceImpact) * 100).toFixed(2),
    [priceImpact],
  );

  const displayFromFiatPrice = useMemo(
    () =>
      fromAmt && fromFiatPrice
        ? new BigNumber(fromFiatPrice).multipliedBy(fromAmt)
        : null,
    [fromFiatPrice, fromAmt],
  );

  const displayToFiatPrice = useMemo(
    () =>
      resAmount && toFiatPrice
        ? new BigNumber(toFiatPrice).multipliedBy(resAmount)
        : null,
    [toFiatPrice, resAmount],
  );

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

  const priceInfo = useMemo(() => {
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
      new BigNumber(displayPriceImpact).gt(PRICE_IMPACT_THRESHOLD)
    ) {
      return priceImpactWarning;
    }
    return tokenPairPrice;
  }, [
    resPriceStatus,
    tokenPairPrice,
    displayingFromAmt,
    priceImpactWarning,
    displayPriceImpact,
    isUnSupportChain,
  ]);

  const swapButton = useMemo(() => {
    const approvalState = getApprovalState(fromToken, fromAmt);
    const isApproving = approvalState === ApprovalState.Approving;
    const needApprove =
      approvalState === ApprovalState.Insufficient && !pendingReset;

    const keepChanges = isETH ? 0.1 : 0.02;
    const isBasicToken = basicTokenAddress === fromToken?.address;
    const balance = new BigNumber(fromTokenBalance || 0);

    if (!account) return <ConnectWallet />;
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
    if (!new BigNumber(fromAmt).gt(0))
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

    if (!resAmount)
      return (
        <Button fullWidth disabled>
          <Trans>Quote not available</Trans>
        </Button>
      );
    if (balance.lt(fromAmt) || (isBasicToken && balance.lte(keepChanges)))
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
    isETH,
    account,
    fromAmt,
    toToken,
    resAmount,
    fromToken,
    isInflight,
    executeSwap,
    pendingReset,
    submitApprove,
    resPriceStatus,
    fromTokenBalance,
    getApprovalState,
    basicTokenAddress,
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
        />
        {`${fromAmt} ${fromToken.symbol}`}
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
        />
        {`${formatTokenAmountNumber({
          input: resAmount,
          decimals: toToken?.decimals,
        })} ${toToken.symbol}`}
      </Box>
    );
  }, [fromToken, toToken, fromAmt, resAmount]);

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
      </Box>

      {/* Scroll Container */}
      <Box sx={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        {/* Swap Module */}
        <Box>
          {/* First Token Card  */}
          <TokenCard
            sx={{ mb: 4 }}
            token={fromToken}
            amt={displayingFromAmt}
            onMaxClick={handleMaxClick}
            onInputChange={updateFromAmt}
            showMaxBtn={!displayingFromAmt}
            occupiedAddrs={[toToken?.address ?? '']}
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
              setFromToken(token);
              updateFromAmt('');
            }}
          />

          {/* Switch Icon */}
          <SwitchBox onClick={switchTokens} />

          {/* Second Token Card  */}
          <TokenCard
            token={toToken}
            amt={
              new BigNumber(displayingFromAmt).gt(0)
                ? formatTokenAmountNumber({
                    input: resAmount as number,
                    decimals: toToken?.decimals,
                  })
                : '-'
            }
            occupiedAddrs={[fromToken?.address ?? '']}
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
              setToToken(token);
            }}
            readOnly
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
      </Box>

      {/* Dialogs */}
      <ReviewDialog
        toToken={toToken}
        fromToken={fromToken}
        fromAmount={fromAmt}
        toAmount={resAmount}
        open={isReviewDialogOpen}
        baseFeeAmount={baseFeeAmount}
        priceImpact={displayPriceImpact}
        additionalFeeAmount={additionalFeeAmount}
        curToFiatPrice={displayToFiatPrice}
        execute={() => executeSwap(subtitle)}
        clearFromAmt={() => updateFromAmt('')}
        curFromFiatPrice={displayFromFiatPrice}
        pricePerFromToken={resPricePerFromToken}
        onClose={() => setIsReviewDialogOpen(false)}
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />
    </>
  );
}

import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { ReviewModal } from './components/ReviewModal';
import { getNonfungiblePositionManagerAlgebraContractAddressByChainId } from '@dodoex/dodo-contract-request';
import { DynamicSection, YellowCard } from './components/widgets';
import { useAlgebraAmounts } from './hooks/useAlgebraAmounts';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import React from 'react';
import { useAddAlgebraLiquidity } from './hooks/useAddAlgebraLiquidity';
import { useAlgebraPair } from './hooks/useAlgebraPair';
import { toSlippagePercent } from './utils/slippage';
import { mintAmountsWithSlippage } from './utils/getPositionAmountWithSlippage';
import { parseUnits } from '@dodoex/contract-request';
import { tokenApi } from '../../../constants/api';
import { PageType, useRouterStore } from '../../../router';
import { PoolTab } from '../PoolList/hooks/usePoolListTabs';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import TokenSelect from '../../../components/TokenSelect';
import { RateToggle } from './components/RateToggle';
import { RangeSelector } from './components/RangeSelector';
import { useSetRange } from './hooks/useSetRange';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import { TickMath } from './utils/tickMath';
import LiquidityChartRangeInput from './components/LiquidityChartRangeInput';
import {
  FetchTicks,
  usePoolActiveLiquidityChartData,
} from './hooks/usePoolActiveLiquidityChartData';

export default function AddLiquidity({
  params,
  border,
  fetchTicks,
  onBaseTokenChange,
  onQuoteTokenChange,
}: {
  params?: {
    from?: string;
    to?: string;
    fee?: string;
  };
  border?: boolean;
  fetchTicks?: FetchTicks;
  ticksErrorRefetch?: () => void;
  onBaseTokenChange?: (token: TokenInfo | undefined) => void;
  onQuoteTokenChange?: (token: TokenInfo | undefined) => void;
}) {
  const { chainId: connectChainId, account } = useWalletInfo();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const defaultBaseTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(connectChainId, params?.from, account),
  });
  const defaultQuoteTokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(connectChainId, params?.to, account),
  });
  const [baseToken, setBaseToken] = React.useState<TokenInfo | undefined>();
  const [quoteToken, setQuoteToken] = React.useState<TokenInfo | undefined>();
  const [startPriceTypedValue, setStartPriceTypedValue] = React.useState('');

  const chainId = baseToken?.chainId;
  const algebraPair = useAlgebraPair({
    baseToken,
    quoteToken,
    startPriceTypedValue,
  });
  const {
    isRearTokenA,
    address: poolAddress,
    currentTick: tickCurrent,
    price,
  } = algebraPair;
  const sorted = !isRearTokenA;
  const token0 = algebraPair.token0Wrapped as TokenInfo;
  const token1 = algebraPair.token1Wrapped as TokenInfo;
  const tokenA = sorted ? token0 : token1;
  const tokenB = sorted ? token1 : token0;

  let liquidity: number | undefined;

  const {
    ticksAtLimit,
    priceLower,
    priceUpper,
    invalidRange,
    outOfRange,
    tickLower,
    tickUpper,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    handleSetFullRange,
    onLeftRangeInput,
    onRightRangeInput,
    ...range
  } = useSetRange({
    tickCurrent,
    tickSpacing: 60,
    token0,
    token1,
    sorted,
    price,
  });

  const amounts = useAlgebraAmounts({
    baseToken,
    quoteToken,
    sqrtRatioX96: tickCurrent
      ? TickMath.getSqrtRatioAtTick(tickCurrent)
      : undefined,
    tickCurrent,
    tickLower,
    tickUpper,
  });
  const addAmount0 = sorted ? amounts.baseAmount : amounts.quoteAmount;
  const addAmount1 = !sorted ? amounts.baseAmount : amounts.quoteAmount;

  const handleSetBaseToken = (token: TokenInfo | undefined) => {
    amounts.reset();
    onBaseTokenChange?.(token);
    setBaseToken(token);
  };
  const handleSetQuoteToken = (token: TokenInfo | undefined) => {
    amounts.reset();
    onQuoteTokenChange?.(token);
    setQuoteToken(token);
  };
  React.useEffect(() => {
    if (!defaultBaseTokenQuery.data) {
      return;
    }
    handleSetBaseToken(defaultBaseTokenQuery.data);
  }, [defaultBaseTokenQuery.data]);
  React.useEffect(() => {
    if (!defaultQuoteTokenQuery.data) {
      return;
    }
    setQuoteToken(defaultQuoteTokenQuery.data);
  }, [defaultQuoteTokenQuery.data]);

  const switchTokens = () => {
    handleSetBaseToken(quoteToken);
    handleSetQuoteToken(baseToken);
  };

  const handleRateToggle = () => {
    range.handleRateToggle();
    handleSetBaseToken(quoteToken);
    handleSetQuoteToken(baseToken);
    amounts.reset();
  };

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: undefined,
    type: 'AMMV3',
  });

  const isInvalidPair =
    !baseToken ||
    !quoteToken ||
    baseToken.chainId !== quoteToken.chainId ||
    baseToken.address === quoteToken.address ||
    !poolAddress;

  let errorMessage: React.ReactNode | undefined;
  if (!account) {
    errorMessage = t`Connect to a wallet`;
  }

  if (isInvalidPair) {
    errorMessage = errorMessage ?? t`Invalid pair`;
  }
  if (!amounts.readonly && (!amounts.baseAmount || !amounts.quoteAmount)) {
    errorMessage = errorMessage ?? t`Enter an amount`;
  }

  // if (invalidPrice) {
  //   errorMessage = errorMessage ?? t`Invalid price input`;
  // }

  const proxyContract = chainId
    ? getNonfungiblePositionManagerAlgebraContractAddressByChainId(chainId)
    : undefined;
  const baseTokenStatus = useTokenStatus(baseToken, {
    amount: amounts.baseAmount,
    contractAddress: proxyContract,
  });
  const quoteTokenStatus = useTokenStatus(quoteToken, {
    amount: amounts.quoteAmount,
    contractAddress: proxyContract,
  });

  const [showConfirm, setShowConfirm] = React.useState(false);

  const onAddMutation = useAddAlgebraLiquidity();

  const successBack = () => {
    resetSlipper();
    amounts.reset();
    setShowConfirm(false);
    setTimeout(() => {
      useRouterStore.getState().push({
        type: PageType.Pool,
        params: {
          tab: PoolTab.myLiquidity,
        },
      });
    }, 100);
  };

  const formattedPrice = price
    ? sorted
      ? price.toSignificant()
      : price.invert().toSignificant()
    : undefined;

  const chartData = usePoolActiveLiquidityChartData({
    token0,
    token1,
    tickCurrent,
    liquidity,
    fetchTicks,
  });

  const disabled =
    !baseToken ||
    !quoteToken ||
    !amounts.baseAmount ||
    !amounts.quoteAmount ||
    !!isInvalidPair;

  return (
    <>
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
            typography: 'body1',
            fontWeight: 600,
            color: theme.palette.text.primary,
            textAlign: 'left',
          }}
        >
          {t`Select pair`}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          <TokenSelect
            borderBold={border}
            border
            highlightDefault
            chainId={chainId}
            token={baseToken}
            readonly={!!params?.from}
            onTokenChange={(token, isOccupied) => {
              if (isOccupied) {
                switchTokens();
              } else {
                handleSetBaseToken(token);
                // setBaseAmount('');
              }
            }}
            occupiedToken={quoteToken}
          />
          <TokenSelect
            borderBold={border}
            border
            highlightDefault
            chainId={chainId}
            token={quoteToken}
            readonly={!!params?.to}
            onTokenChange={(token, isOccupied) => {
              if (isOccupied) {
                switchTokens();
              } else {
                handleSetQuoteToken(token);
              }
            }}
            occupiedToken={baseToken}
          />
        </Box>
      </Box>

      <DynamicSection disabled={isInvalidPair}>
        <Box
          sx={{
            mt: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: 'left',
            }}
          >
            {t`Set price range`}
          </Box>
          {Boolean(baseToken && quoteToken) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                [theme.breakpoints.up('tablet')]: {
                  ml: 'auto',
                  width: 'auto',
                },
              }}
            >
              <Button
                size={Button.Size.small}
                variant={Button.Variant.outlined}
                onClick={handleSetFullRange}
                sx={{
                  py: 4,
                  px: 12,
                  height: 26,
                  typography: 'h6',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.border.main,
                  ...(isMobile
                    ? {
                        flexGrow: 0,
                        flexShrink: 1,
                        flexBasis: '50%',
                      }
                    : undefined),
                }}
              >{t`Full range`}</Button>
              <RateToggle
                baseToken={baseToken}
                quoteToken={quoteToken}
                handleRateToggle={handleRateToggle}
                sx={
                  isMobile
                    ? {
                        flexGrow: 0,
                        flexShrink: 1,
                        flexBasis: '50%',
                      }
                    : undefined
                }
              />
            </Box>
          )}
        </Box>
        <RangeSelector
          priceLower={priceLower}
          priceUpper={priceUpper}
          getDecrementLower={getDecrementLower}
          getIncrementLower={getIncrementLower}
          getDecrementUpper={getDecrementUpper}
          getIncrementUpper={getIncrementUpper}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          tokenA={tokenA}
          tokenB={tokenB}
          ticksAtLimit={ticksAtLimit}
          isSorted={sorted}
          border={border}
        />
        {outOfRange && (
          <YellowCard>
            {t`Your position will not earn fees or be used in trades until the market price moves into your range.`}
          </YellowCard>
        )}
        {invalidRange && (
          <YellowCard>
            {t`Invalid range selected. The min price must be lower than the max price.`}
          </YellowCard>
        )}
      </DynamicSection>
      {!algebraPair.isExists && !isInvalidPair ? (
        <DynamicSection>
          <Box
            sx={{
              mt: 16,
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: 'left',
            }}
          >
            {t`Starting price`}
          </Box>
          <Box
            sx={{
              p: 8,
              borderRadius: 8,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              typography: 'h6',
              color: theme.palette.primary.main,
            }}
          >
            {t`This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.`}
          </Box>
          <Box
            sx={{
              px: 16,
              py: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.palette.border.main,
              borderStyle: 'solid',
            }}
          >
            <NumberInput
              sx={{
                backgroundColor: 'transparent',
              }}
              value={startPriceTypedValue}
              onChange={setStartPriceTypedValue}
            />
          </Box>
        </DynamicSection>
      ) : (
        <DynamicSection disabled={isInvalidPair}>
          <Box
            sx={{
              mt: 16,
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: 'left',
            }}
          >
            {t`Current price`}
            <Box>
              {formattedPrice}&nbsp;{t`per`}&nbsp;
              {baseToken?.symbol ?? ''}
            </Box>
          </Box>
          <LiquidityChartRangeInput
            currencyA={baseToken ?? undefined}
            currencyB={quoteToken ?? undefined}
            ticksAtLimit={ticksAtLimit}
            isSorted={sorted}
            price={
              price
                ? parseFloat(
                    (!sorted ? price.invert() : price).toSignificant(8),
                  )
                : undefined
            }
            priceLower={priceLower}
            priceUpper={priceUpper}
            onLeftRangeInput={onLeftRangeInput}
            onRightRangeInput={onRightRangeInput}
            interactive={true}
            chartData={chartData}
          />
        </DynamicSection>
      )}
      <DynamicSection disabled={isInvalidPair}>
        <Box
          sx={{
            mt: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 12,
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textAlign: 'left',
            }}
          >
            {t`Deposit amounts`}
          </Box>
          <Box>
            <TokenCard
              sx={{
                pb: 28,
                minHeight: 'auto',
                borderWidth: border ? 3 : 0,
                borderColor: theme.palette.text.primary,
              }}
              token={baseToken}
              amt={amounts.baseAmount}
              defaultLoadBalance
              onInputChange={amounts.handleChangeBaseAmount}
              onInputBlur={amounts.handleBlurBaseAmount}
              showMaxBtn
              showPercentage
              notTokenPickerModal
              readOnly={amounts.readonly}
            />
            <CardPlusConnected
              sx={
                border
                  ? {
                      borderWidth: 3,
                      borderColor: theme.palette.text.primary,
                      color: theme.palette.text.primary,
                    }
                  : undefined
              }
            />
            <TokenCard
              sx={{
                pb: 28,
                minHeight: 'auto',
                borderWidth: border ? 3 : 0,
                borderColor: theme.palette.text.primary,
              }}
              token={quoteToken}
              amt={amounts.quoteAmount}
              defaultLoadBalance
              onInputChange={amounts.handleChangeQuoteAmount}
              onInputBlur={amounts.handleBlurQuoteAmount}
              showMaxBtn
              showPercentage
              notTokenPickerModal
              readOnly={amounts.readonly}
            />
          </Box>
          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            disabled={false}
            type="AMMV3"
          />
        </Box>
      </DynamicSection>

      <Box
        sx={{
          pt: 16,
        }}
      >
        <NeedConnectButton
          fullWidth
          includeButton
          size={Button.Size.big}
          chainId={chainId}
          sx={
            border
              ? {
                  borderWidth: 3,
                  borderStyle: 'solid',
                  borderColor: 'text.primary',
                }
              : undefined
          }
        >
          <TokenPairStatusButton
            statuses={[baseTokenStatus, quoteTokenStatus]}
            buttonProps={{
              size: Button.Size.big,
              fullWidth: true,
              sx: border
                ? {
                    borderWidth: 3,
                    borderStyle: 'solid',
                    borderColor: 'text.primary',
                  }
                : undefined,
            }}
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={disabled}
              onClick={() => setShowConfirm(true)}
              sx={
                border && !disabled
                  ? {
                      borderWidth: 3,
                      borderStyle: 'solid',
                      borderColor: 'text.primary',
                    }
                  : undefined
              }
            >
              {errorMessage ?? <Trans>Preview</Trans>}
            </Button>
          </TokenPairStatusButton>
        </NeedConnectButton>
      </Box>

      <ReviewModal
        token0={token0}
        token1={token1}
        tickLower={tickLower}
        tickUpper={tickUpper}
        liquidity={Number(liquidity)}
        price={price?.toSignificant()}
        amount0={addAmount0}
        amount1={addAmount1}
        on={showConfirm}
        onClose={() => {
          setShowConfirm(false);
        }}
        onConfirm={() => {
          if (
            !tickCurrent ||
            !tickLower ||
            !tickUpper ||
            !baseToken ||
            !quoteToken
          )
            return;
          const addAmount0Wei = parseUnits(
            addAmount0,
            token0.decimals,
          ).toString();
          const addAmount1Wei = parseUnits(
            addAmount1,
            token1.decimals,
          ).toString();
          const slippageTolerance = toSlippagePercent(slipperValue * 100);
          const minimumAmounts = mintAmountsWithSlippage(
            tickCurrent,
            slippageTolerance,
            tickLower,
            tickUpper,
            baseToken,
            quoteToken,
            addAmount0Wei,
            addAmount1Wei,
          );
          onAddMutation.mutate({
            pool: algebraPair,
            successBack,
            amount0: addAmount0Wei,
            amount1: addAmount1Wei,
            amount0Min: String(minimumAmounts.amount0),
            amount1Min: String(minimumAmounts.amount1),
            recipient: account,
            createPool: !algebraPair.isExists,
            tickLower,
            tickUpper,
          });
        }}
        loading={onAddMutation.isPending}
        inRange
      />
    </>
  );
}

import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import React from 'react';
import { parseUnits } from '@dodoex/contract-request';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { usePoolActiveLiquidityChartData } from './hooks/usePoolActiveLiquidityChartData';
import { useVe33V3Pair } from './hooks/useVe33V3Pair';
import { Ve33PoolInfoI } from '../types';
import { useSetRange } from './hooks/useSetRange';
import { TickMath } from './utils/tickMath';
import { useVe33V3Amounts } from './hooks/useVe33V3Amounts';
import SlippageSetting, {
  useSlipper,
} from '../Ve33V2PoolOperate/components/SlippageSetting';
import {
  getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions,
  getVE33NonfungiblePositionManagerContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { DynamicSection, YellowCard } from './components/widgets';
import { RateToggle } from './components/RateToggle';
import { RangeSelector } from './components/RangeSelector';
import LiquidityChartRangeInput from './components/LiquidityChartRangeInput';
import { toSlippagePercent } from './utils/slippage';
import { mintAmountsWithSlippage } from './utils/getPositionAmountWithSlippage';
import { useAddVe33V3Liquidity } from './hooks/useAddVe33V3Liquidity';
import { ReviewModal } from './components/ReviewModal';
import { formatReadableNumber } from '../../../utils';
import RangeRatioSelect from './components/RangeRatioSelect';
import { useQuery } from '@tanstack/react-query';

export default function Ve33V3AddLiquidity({
  pool,
}: {
  pool: Ve33PoolInfoI | undefined;
}) {
  const { account } = useWalletInfo();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const fetchTicksQuery = useQuery({
    queryKey: ['test'],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '0x37afbad94db04a96f9fbe86cb4048664941f6233#-887270',
              poolAddress: '0x2f63a87bf42dc4c021af8be085cece16269e3b67',
              tickIdx: '-887270',
              liquidityNet: '6049724999999999999',
              price0: '0.99980002999600049994000699920009',
              price1: '1.00020001',
            },
            {
              id: '0x37afbad94db04a96f9fbe86cb4048664941f6233#887270',
              poolAddress: '0x2f63a87bf42dc4c021af8be085cece16269e3b67',
              tickIdx: '887270',
              liquidityNet: '-6049724999999999999',
              price0: '1.00020001',
              price1: '0.99980002999600049994000699920009',
            },
          ]);
        }, 1000);
      });
    },
  });
  const fetchTicks = {
    ticks: fetchTicksQuery.data,
    ...fetchTicksQuery,
  };

  const [switchToken, setSwitchToken] = React.useState(false);
  const baseToken = switchToken ? pool?.quoteToken : pool?.baseToken;
  const quoteToken = switchToken ? pool?.baseToken : pool?.quoteToken;
  const address = pool?.id;

  const handleRateToggle = () => {
    range.handleRateToggle();
    setSwitchToken((prev) => !prev);
    amounts.reset();
  };

  const chainId = baseToken?.chainId;
  const pair = useVe33V3Pair({
    address,
    baseToken,
    quoteToken,
  });
  const {
    isRearTokenA,
    address: poolAddress,
    currentTick: tickCurrent,
    price,
  } = pair;
  const sorted = !isRearTokenA;
  const token0 = pair.token0Wrapped as TokenInfo;
  const token1 = pair.token1Wrapped as TokenInfo;
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
    tickSpacing: pair.tickSpacing,
    token0,
    token1,
    sorted,
    price,
  });

  const amounts = useVe33V3Amounts({
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

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: pool?.type,
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
    ? getVE33NonfungiblePositionManagerContractAddressByChainId(chainId)
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

  const onAddMutation = useAddVe33V3Liquidity();

  const successBack = () => {
    resetSlipper();
    amounts.reset();
    setShowConfirm(false);
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
      <DynamicSection disabled={isInvalidPair}>
        <Box
          sx={{
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
        <Box
          sx={{
            p: 8,
            textAlign: 'center',
            border: 'solid 1px',
            borderColor: 'border.main',
            borderRadius: 8,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            {t`Current price`}
            <Box
              sx={{
                mt: 4,
                typography: 'h5',
                color: theme.palette.text.primary,
              }}
            >
              {formatReadableNumber({ input: formattedPrice ?? '' })}&nbsp;
              {t`per`}
              &nbsp;
              {baseToken?.symbol ?? ''}
            </Box>
          </Box>
        </Box>
        <RangeRatioSelect />
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
      <DynamicSection disabled={isInvalidPair}>
        <LiquidityChartRangeInput
          currencyA={baseToken ?? undefined}
          currencyB={quoteToken ?? undefined}
          ticksAtLimit={ticksAtLimit}
          isSorted={sorted}
          price={
            price
              ? parseFloat((!sorted ? price.invert() : price).toSignificant(8))
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
      <DynamicSection
        disabled={
          isInvalidPair || priceLower === undefined || priceUpper === undefined
        }
      >
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
              color: theme.palette.text.primary,
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
            <CardPlusConnected />
            <TokenCard
              sx={{
                pb: 28,
                minHeight: 'auto',
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
            type={pool?.type}
          />
        </Box>
      </DynamicSection>

      <Box
        sx={{
          pt: 16,
          pb: 20,
        }}
      >
        <NeedConnectButton
          fullWidth
          includeButton
          size={Button.Size.big}
          chainId={chainId}
        >
          <TokenPairStatusButton
            statuses={[baseTokenStatus, quoteTokenStatus]}
            buttonProps={{
              size: Button.Size.big,
              fullWidth: true,
            }}
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={disabled}
              onClick={() => setShowConfirm(true)}
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
            tickCurrent === undefined ||
            tickLower === undefined ||
            tickUpper === undefined ||
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
            pool: pair,
            successBack,
            amount0: addAmount0Wei,
            amount1: addAmount1Wei,
            amount0Min: String(minimumAmounts.amount0),
            amount1Min: String(minimumAmounts.amount1),
            recipient: account,
            tickLower,
            tickUpper,
            tickSpacing: pair.tickSpacing,
            // If not 0, a pool will be created
            sqrtPriceX96: '0',
          });
        }}
        loading={onAddMutation.isPending}
        inRange
      />
    </>
  );
}

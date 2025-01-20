import {
  Box,
  Button,
  LoadingSkeleton,
  Skeleton,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import TokenLogo from '../../../components/TokenLogo';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { byWei, formatTokenAmountNumber } from '../../../utils';
import { SliderPercentageCard } from '../PoolOperate/components/SliderPercentageCard';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { initSliderPercentage } from '../PoolOperate/hooks/usePercentageRemove';
import { ClaimButton } from './components/ClaimButton';
import { PositionSelectedRangePreview } from './components/PositionSelectedRangePreview';
import { RemoveButton } from './components/RemoveButton';
import { ReviewModal } from './components/ReviewModal';
import { OperateType } from './types';
import { useFetchPositionFromTokenId } from './hooks/useFetchPositionFromTokenId';
import {
  getFetchAlgebraPoolGlobalStateQueryOptions,
  getNonfungiblePositionManagerAlgebraContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import {
  getPositionAmount0,
  getPositionAmount1,
} from './utils/getPositionAmount';
import { useAlgebraAmounts } from './hooks/useAlgebraAmounts';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import React from 'react';
import { useAddAlgebraLiquidity } from './hooks/useAddAlgebraLiquidity';
import { useAlgebraPair } from './hooks/useAlgebraPair';
import { toSlippagePercent } from './utils/slippage';
import { getTickToPrice } from './utils/getTickToPrice';
import {
  burnAmountsWithSlippage,
  mintAmountsWithSlippage,
} from './utils/getPositionAmountWithSlippage';
import { formatUnits, parseUnits } from '@dodoex/contract-request';
import JSBI from 'jsbi';
import { increaseArray } from '../../../utils/utils';
import BigNumber from 'bignumber.js';
import { useRemoveAlgebraLiquidity } from './hooks/useRemoveAlgebraLiquidity';
import { useAlgebraPositionFees } from './hooks/useAlgebraPositionFees';
import { FailedList } from '../../../components/List/FailedList';
import { useClaimAlgebraFees } from './hooks/useClaimAlgebraFees';
import MyLiquidity from './components/MyLiquidity';
import { ChainId } from '@dodoex/api';
import { TickMath } from './utils/tickMath';

const RewardItem = ({
  token,
  amount,
  loading,
}: {
  token: TokenInfo | undefined;
  amount: bigint | undefined;
  loading?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        typography: 'h5',
        color: theme.palette.text.primary,
      }}
    >
      <TokenLogo
        address={token?.address ?? ''}
        chainId={token?.chainId}
        noShowChain
        width={24}
        height={24}
        marginRight={0}
      />
      <Box>{token?.symbol}</Box>
      <LoadingSkeleton
        loading={loading}
        loadingProps={{
          width: 100,
        }}
        sx={{
          ml: 'auto',
        }}
      >
        {amount !== undefined &&
          !!token &&
          formatTokenAmountNumber({
            input: formatUnits(amount, token?.decimals),
            decimals: token.decimals,
          })}
      </LoadingSkeleton>
    </Box>
  );
};

export interface AlgebraPositionManageProps {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  tokenId: string;
  border?: boolean;
  successBack?: () => void;
}

export const AlgebraPositionManage = ({
  chainId,
  baseToken,
  quoteToken,
  tokenId,
  border,
  successBack: successBackProps,
}: AlgebraPositionManageProps) => {
  const theme = useTheme();

  const algebraPair = useAlgebraPair({
    baseToken,
    quoteToken,
  });
  const { isRearTokenA, address: poolAddress } = algebraPair;
  const sorted = !isRearTokenA;
  const token0 = algebraPair.token0 as TokenInfo;
  const token1 = algebraPair.token1 as TokenInfo;

  const { account } = useWalletInfo();
  const fetchPositions = useFetchPositionFromTokenId({
    chainId,
    tokenId,
  });
  const existingPositionDetails = fetchPositions.position;
  const globalState = useQuery(
    getFetchAlgebraPoolGlobalStateQueryOptions(chainId, poolAddress),
  );
  const price = globalState.data
    ? getTickToPrice(token0, token1, globalState.data.tick)
    : undefined;
  const tickCurrent = globalState.data
    ? Number(globalState.data.tick)
    : undefined;
  let existsPoolAmount0: JSBI | undefined;
  let existsPoolAmount1: JSBI | undefined;
  let tickLower: number | undefined;
  let tickUpper: number | undefined;
  if (tickCurrent && existingPositionDetails) {
    tickLower = Number(existingPositionDetails.tickLower);
    tickUpper = Number(existingPositionDetails.tickUpper);
    existsPoolAmount0 = getPositionAmount0({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity: existingPositionDetails.liquidity,
    });
    existsPoolAmount1 = getPositionAmount1({
      tickCurrent,
      tickLower,
      tickUpper,
      liquidity: existingPositionDetails.liquidity,
    });
  }

  const amounts = useAlgebraAmounts({
    baseToken,
    quoteToken,
    sqrtRatioX96: tickCurrent
      ? TickMath.getSqrtRatioAtTick(tickCurrent)
      : undefined,
    tickCurrent,
    tickLower: existingPositionDetails?.tickLower,
    tickUpper: existingPositionDetails?.tickUpper,
  });
  const addAmount0 = sorted ? amounts.baseAmount : amounts.quoteAmount;
  const addAmount1 = !sorted ? amounts.baseAmount : amounts.quoteAmount;

  const [sliderPercentage, setSliderPercentage] =
    React.useState(initSliderPercentage);
  let removeAmount0Bg: BigNumber | undefined;
  let removeAmount1Bg: BigNumber | undefined;
  if (sliderPercentage === 100) {
    removeAmount0Bg = existsPoolAmount0
      ? new BigNumber(existsPoolAmount0.toString())
      : undefined;
    removeAmount1Bg = existsPoolAmount1
      ? new BigNumber(existsPoolAmount1.toString())
      : undefined;
  } else {
    removeAmount0Bg = existsPoolAmount0
      ? new BigNumber(existsPoolAmount0.toString())
          .times(sliderPercentage / 100)
          .dp(0, BigNumber.ROUND_DOWN)
      : undefined;
    removeAmount1Bg = existsPoolAmount1
      ? new BigNumber(existsPoolAmount1.toString())
          .times(sliderPercentage / 100)
          .dp(0, BigNumber.ROUND_DOWN)
      : undefined;
  }
  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: undefined,
    type: 'AMMV3',
  });
  const removed = existingPositionDetails?.liquidity === BigInt(0);

  const [operateType, setOperateType] = React.useState<OperateType>('stake');
  const operateTypes = [
    { key: 'stake', value: t`Stake` },
    { key: 'unstake', value: t`Unstake` },
    { key: 'claim', value: t`Claim` },
  ];

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
  const onRemoveMutation = useRemoveAlgebraLiquidity();
  const onClaimMutation = useClaimAlgebraFees();

  const loading = globalState.isLoading || fetchPositions.isLoading;

  const fetchFees = useAlgebraPositionFees({
    chainId,
    tokenId,
  });

  const successBack = () => {
    resetSlipper();
    amounts.reset();
    setShowConfirm(false);
    successBackProps?.();
  };

  let errorRefetch: undefined | (() => void);
  if (fetchPositions.isError) {
    errorRefetch = fetchPositions.refetch;
  } else if (globalState.isError) {
    errorRefetch = globalState.refetch;
  } else if (algebraPair.fetchTickSpacing.isError) {
    errorRefetch = algebraPair.fetchTickSpacing.refetch;
  } else if (algebraPair.fetchLiquidity.isError) {
    errorRefetch = algebraPair.fetchLiquidity.refetch;
  }

  return (
    <Tabs
      value={operateType}
      onChange={(_, value) => {
        setOperateType(value as OperateType);
      }}
    >
      <TabsButtonGroup tabs={operateTypes} variant="inPaper" />
      <TabPanel value="stake">
        {!!errorRefetch && <FailedList refresh={errorRefetch} />}
        <Box sx={{ mt: 16 }}>
          <PositionSelectedRangePreview
            title={t`Selected Range`}
            token0={token0}
            token1={token1}
            token0Price={price}
            tickLower={existingPositionDetails?.tickLower}
            tickUpper={existingPositionDetails?.tickUpper}
            border={border}
          />
        </Box>

        <MyLiquidity
          sx={{ mt: 16 }}
          token0={token0}
          token1={token1}
          amount0={existsPoolAmount0?.toString()}
          amount1={existsPoolAmount1?.toString()}
        />

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
            {t`Add more liquidity`}
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
              notTokenPickerModal
              showPercentage
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
              notTokenPickerModal
              showPercentage
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
                disabled={
                  !baseToken ||
                  !quoteToken ||
                  !amounts.baseAmount ||
                  !amounts.quoteAmount ||
                  !!isInvalidPair ||
                  loading
                }
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
          liquidity={Number(existingPositionDetails?.liquidity)}
          price={price}
          amount0={addAmount0}
          amount1={addAmount1}
          on={showConfirm}
          onClose={() => {
            setShowConfirm(false);
          }}
          onConfirm={() => {
            if (!tickCurrent || !tickLower || !tickUpper) return;
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
              sorted,
              slippageTolerance,
              tickLower,
              tickUpper,
              addAmount0Wei,
              addAmount1Wei,
            );
            onAddMutation.mutate({
              pool: algebraPair,
              tokenId,
              successBack,
              amount0: addAmount0Wei,
              amount1: addAmount1Wei,
              amount0Min: String(minimumAmounts.amount0),
              amount1Min: String(minimumAmounts.amount1),
              tickLower,
              tickUpper,
            });
          }}
          loading={onAddMutation.isPending}
          inRange
        />
      </TabPanel>
      <TabPanel value="unstake">
        <MyLiquidity
          sx={{ mt: 16 }}
          token0={token0}
          token1={token1}
          amount0={existsPoolAmount0?.toString()}
          amount1={existsPoolAmount1?.toString()}
        />
        <Box
          sx={{
            mt: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 12,
          }}
        >
          {fetchPositions.isLoading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 12,
              }}
            >
              {increaseArray(4).map((_, i) => (
                <Skeleton key={i} height={20} />
              ))}
            </Box>
          ) : fetchPositions.isError ? (
            <FailedList refresh={fetchPositions.refetch} />
          ) : (
            <SliderPercentageCard
              disabled={false}
              value={sliderPercentage}
              onChange={(v) => setSliderPercentage(v)}
            />
          )}
          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            disabled={false}
            type="AMMV3"
          />
        </Box>
        <Box
          sx={{
            mt: 16,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.secondary,
            }}
          >
            Receive
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                {removeAmount0Bg
                  ? formatTokenAmountNumber({
                      input: byWei(removeAmount0Bg, token0.decimals),
                      decimals: token0.decimals,
                    })
                  : '-'}
              </Box>
              &nbsp;{token0?.symbol}
            </Box>
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                {removeAmount1Bg
                  ? formatTokenAmountNumber({
                      input: byWei(removeAmount1Bg, token1.decimals),
                      decimals: token1.decimals,
                    })
                  : '-'}
              </Box>
              &nbsp;{token1?.symbol}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 20,
          }}
        >
          <RemoveButton
            chainId={chainId}
            disabled={removed || sliderPercentage === 0 || !removeAmount0Bg}
            removed={removed}
            onConfirm={() => {
              if (
                !existingPositionDetails ||
                !tickCurrent ||
                !tickLower ||
                !tickUpper ||
                !removeAmount0Bg ||
                !removeAmount1Bg ||
                !account
              )
                return;
              const newLiquidity =
                sliderPercentage === 100
                  ? existingPositionDetails.liquidity.toString()
                  : new BigNumber(existingPositionDetails.liquidity.toString())
                      .times(sliderPercentage / 100)
                      .toFixed(0, BigNumber.ROUND_DOWN);
              const slippageTolerance = toSlippagePercent(slipperValue * 100);
              const minimumAmounts = burnAmountsWithSlippage(
                tickCurrent,
                sorted,
                slippageTolerance,
                tickLower,
                tickUpper,
                newLiquidity,
              );
              onRemoveMutation.mutate({
                chainId,
                tokenId,
                successBack,
                amount0Min: String(minimumAmounts.amount0),
                amount1Min: String(minimumAmounts.amount1),
                newLiquidity,
                collectOptions: {
                  expectedCurrencyOwed0: removeAmount0Bg,
                  expectedCurrencyOwed1: removeAmount1Bg,
                  recipient: account,
                },
              });
            }}
            isLoading={onRemoveMutation.isPending}
          />
        </Box>
      </TabPanel>
      <TabPanel value="claim">
        <Box
          sx={{
            mt: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.border.main,
          }}
        >
          <Box
            sx={{
              py: 12,
              px: 20,
              typography: 'body1',
              color: theme.palette.text.primary,
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              borderBottomColor: theme.palette.border.main,
            }}
          >
            {t`Claim fees`}
          </Box>
          <Box
            sx={{
              p: 20,
            }}
          >
            {fetchFees.isError && (
              <FailedList refresh={fetchFees.errorRefetch} />
            )}
            <RewardItem
              token={token0}
              amount={fetchFees.data?.amount0}
              loading={fetchFees.isLoading}
            />
            <RewardItem
              token={token1}
              amount={fetchFees.data?.amount1}
              loading={fetchFees.isLoading}
            />
          </Box>
        </Box>
        <Box
          sx={{
            mt: 16,
            typography: 'h6',
            color: theme.palette.text.secondary,
          }}
        >
          {t`*Collecting fees will withdraw currently available fees for you.`}
        </Box>
        <Box
          sx={{
            mt: 20,
          }}
        >
          <ClaimButton
            chainId={chainId}
            disabled={
              onClaimMutation.isPending ||
              !fetchFees.data ||
              (!fetchFees.data.amount0 && !fetchFees.data.amount1)
            }
            onConfirm={() => {
              if (
                !existingPositionDetails ||
                !tickCurrent ||
                !tickLower ||
                !tickUpper ||
                !fetchFees.data ||
                !account
              )
                return;
              const expectedCurrencyOwed0 = new BigNumber(
                fetchFees.data?.amount0?.toString(),
              );
              const expectedCurrencyOwed1 = new BigNumber(
                fetchFees.data?.amount1?.toString(),
              );
              onClaimMutation.mutate({
                chainId,
                tokenId,
                successBack,
                collectOptions: {
                  expectedCurrencyOwed0,
                  expectedCurrencyOwed1,
                  recipient: account,
                },
              });
            }}
            isLoading={onClaimMutation.isPending}
          />
        </Box>
      </TabPanel>
    </Tabs>
  );
};

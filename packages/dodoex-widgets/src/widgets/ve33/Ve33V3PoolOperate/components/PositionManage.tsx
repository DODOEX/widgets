import { ChainId } from '@dodoex/api';
import {
  Box,
  Button,
  Skeleton,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo, useReducer, useState } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useSubmission } from '../../../../hooks/Submission';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { initSliderPercentage } from '../../Ve33V2PoolOperate/hooks/usePercentageRemove';
import SlippageSetting, {
  useSlipper,
} from '../../Ve33V2PoolOperate/components/SlippageSetting';
import { PoolTypeE, Ve33PoolInfoI } from '../../types';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import Dialog from '../../../../components/Dialog';
import { RemoveButton } from './RemoveButton';
import { PoolHead } from '../../components/PoolHead';
import { useVe33V3Pair } from '../hooks/useVe33V3Pair';
import { useSetRange } from '../hooks/useSetRange';
import {
  getFetchVE33NonfungiblePositionManagerPositionsQueryOptions,
  getFetchVE33V3PairSlot0QueryOptions,
  getVE33NonfungiblePositionManagerContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { convertPositionData } from '../../Ve33PoolDetail/useVe33V3Positions';
import JSBI from 'jsbi';
import {
  getPositionAmount0,
  getPositionAmount1,
} from '../utils/getPositionAmount';
import { useVe33V3Amounts } from '../hooks/useVe33V3Amounts';
import { TickMath } from '../utils/tickMath';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { useAddVe33V3Liquidity } from '../hooks/useAddVe33V3Liquidity';
import { useRemoveVe33V3Liquidity } from '../hooks/useRemoveVe33V3Liquidity';
import { FailedList } from '../../../../components/List/FailedList';
import { PositionSelectedRangePreview } from './PositionSelectedRangePreview';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../../components/Swap/components/TokenCard';
import TokenPairStatusButton from '../../../../components/TokenPairStatusButton';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import { ReviewModal } from './ReviewModal';
import { parseUnits } from '@dodoex/contract-request';
import { toSlippagePercent } from '../utils/slippage';
import {
  burnAmountsWithSlippage,
  mintAmountsWithSlippage,
} from '../utils/getPositionAmountWithSlippage';
import { increaseArray } from '../../../../utils/utils';
import { SliderPercentageCard } from '../../Ve33V2PoolOperate/components/SliderPercentageCard';
import { byWei, formatTokenAmountNumber } from '../../../../utils/formatter';

export interface AMMV3PositionManageProps {
  poolInfo?: Ve33PoolInfoI;
  tokenId: string | number | undefined;
  onClose: (() => void) | undefined;
  dialog?: boolean;
}

enum OperateType {
  Add = 1,
  Remove,
}

export default function PositionManage({
  dialog,
  ...props
}: AMMV3PositionManageProps) {
  const { isMobile } = useWidgetDevice();

  if (dialog || isMobile) {
    return (
      <Dialog
        open={!!props.poolInfo}
        onClose={props.onClose}
        modal
        id="pool-operate"
      >
        <Box
          sx={{
            width: isMobile ? '100%' : 420,
          }}
        >
          <PositionManageInner {...props} />
        </Box>
      </Dialog>
    );
  }

  return <PositionManageInner {...props} />;
}

function PositionManageInner({
  poolInfo,
  tokenId,
  onClose,
}: AMMV3PositionManageProps) {
  const theme = useTheme();
  const { chainId, baseToken, quoteToken } = poolInfo || {};

  const { account } = useWalletInfo();

  const [operateType, setOperateType] = useState<OperateType>(OperateType.Add);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    type: PoolTypeE.CLPool,
  });

  const pair = useVe33V3Pair({
    address: poolInfo?.id,
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
  const fetchPosition = useQuery(
    getFetchVE33NonfungiblePositionManagerPositionsQueryOptions(
      chainId,
      tokenId ? Number(tokenId) : undefined,
    ),
  );
  const existingPositionDetails = convertPositionData(fetchPosition.data);
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

  const [sliderPercentage, setSliderPercentage] =
    useState(initSliderPercentage);
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
  const removed = existingPositionDetails?.liquidity === BigInt(0);
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

  const onAddMutation = useAddVe33V3Liquidity();

  const onRemoveMutation = useRemoveVe33V3Liquidity();

  const operateTypes = [
    { key: OperateType.Add, value: t`Add` },
    { key: OperateType.Remove, value: t`Remove` },
  ];

  const loading =
    pair.fetchGlobalState.isLoading ||
    fetchPosition.isLoading ||
    pair.fetchLiquidity.isLoading ||
    pair.fetchTickSpacing.isLoading;

  const successBack = () => {
    resetSlipper();
    amounts.reset();
    setShowConfirm(false);
  };

  let errorRefetch: undefined | (() => void);
  if (fetchPosition.isError) {
    errorRefetch = fetchPosition.refetch;
  } else if (pair.fetchGlobalState.isError) {
    errorRefetch = pair.fetchGlobalState.refetch;
  } else if (pair.fetchTickSpacing.isError) {
    errorRefetch = pair.fetchTickSpacing.refetch;
  } else if (pair.fetchLiquidity.isError) {
    errorRefetch = pair.fetchLiquidity.refetch;
  }

  const disabledStake =
    !baseToken ||
    !quoteToken ||
    !amounts.baseAmount ||
    !amounts.quoteAmount ||
    !!isInvalidPair ||
    loading;

  return (
    <Box
      sx={{
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 20,
          py: 24,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {poolInfo && (
          <PoolHead
            chainId={poolInfo.chainId}
            poolInfo={poolInfo}
            size="small"
          />
        )}

        {onClose ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              borderWidth: 1,
              color: 'text.secondary',
              cursor: 'pointer',
            }}
          >
            <Box
              component={Error}
              sx={{
                width: 16,
                height: 16,
              }}
              onClick={() => {
                onClose();
              }}
            />
          </Box>
        ) : undefined}
      </Box>

      <Tabs
        value={operateType}
        onChange={(_, value) => {
          setOperateType(value as OperateType);
        }}
      >
        <TabsButtonGroup
          tabs={operateTypes}
          variant="inPaper"
          tabsListSx={{
            mx: 20,
          }}
        />
        <TabPanel value={OperateType.Add}>
          {!!errorRefetch && <FailedList refresh={errorRefetch} />}
          <Box sx={{ mt: 16, px: 20 }}>
            <PositionSelectedRangePreview
              title={t`Selected Range`}
              token0={token0}
              token1={token1}
              token0Price={price?.toSignificant()}
              tickLower={tickLower}
              tickUpper={tickUpper}
            />
          </Box>

          <Box
            sx={{
              mt: 16,
              mx: 20,
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
                notTokenPickerModal
                showPercentage
                readOnly={amounts.readonly}
              />
            </Box>
            <SlippageSetting
              value={slipper}
              onChange={setSlipper}
              disabled={false}
              type={PoolTypeE.CLPool}
            />
          </Box>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              px: 20,
              py: 16,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              backgroundColor: theme.palette.background.paper,
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
                  disabled={disabledStake}
                  onClick={() => setShowConfirm(true)}
                >
                  {errorMessage ?? <Trans>Add</Trans>}
                </Button>
              </TokenPairStatusButton>
            </NeedConnectButton>
          </Box>

          <ReviewModal
            token0={token0}
            token1={token1}
            tickLower={tickLower}
            tickUpper={tickUpper}
            liquidity={pair.fetchLiquidity?.data?.toString()}
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
        </TabPanel>
        <TabPanel value={OperateType.Remove}>
          <Box
            sx={{
              mt: 16,
              mx: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
            }}
          >
            {fetchPosition.isLoading ? (
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
            ) : fetchPosition.isError ? (
              <FailedList refresh={fetchPosition.refetch} />
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
              type={PoolTypeE.CLPool}
            />
          </Box>
          <Box
            sx={{
              mt: 16,
              mx: 20,
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
              position: 'sticky',
              bottom: 0,
              mt: 20,
              display: 'flex',
              alignItems: 'center',
              px: 20,
              py: 16,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <RemoveButton
              chainId={chainId!}
              disabled={removed || sliderPercentage === 0 || !removeAmount0Bg}
              removed={removed}
              onConfirm={() => {
                if (
                  !existingPositionDetails ||
                  tickCurrent === undefined ||
                  tickLower === undefined ||
                  tickUpper === undefined ||
                  !removeAmount0Bg ||
                  !removeAmount1Bg ||
                  !account
                )
                  return;
                const newLiquidity =
                  sliderPercentage === 100
                    ? existingPositionDetails.liquidity.toString()
                    : new BigNumber(
                        existingPositionDetails.liquidity.toString(),
                      )
                        .times(sliderPercentage / 100)
                        .toFixed(0, BigNumber.ROUND_DOWN);
                const slippageTolerance = toSlippagePercent(slipperValue * 100);
                const minimumAmounts = burnAmountsWithSlippage(
                  tickCurrent,
                  slippageTolerance,
                  tickLower,
                  tickUpper,
                  newLiquidity,
                  baseToken!,
                  quoteToken!,
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
      </Tabs>
    </Box>
  );
}

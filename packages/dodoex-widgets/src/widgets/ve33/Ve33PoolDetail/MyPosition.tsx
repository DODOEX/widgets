import {
  alpha,
  Box,
  Button,
  ButtonBase,
  LoadingSkeleton,
  useTheme,
} from '@dodoex/components';
import { Ve33PoolInfoI } from '../types';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchVE33V3GaugeEarnedQueryOptions,
  getFetchVE33V3PairTickSpacingQueryOptions,
} from '@dodoex/dodo-contract-request';
import { tickToPrice } from '../Ve33V3PoolOperate/utils/getTickToPrice';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../hooks/Token/type';
import TokenLogo from '../../../components/TokenLogo';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../utils/formatter';
import { basicTokenMap } from '@dodoex/api';
import { QuestionTooltip } from '../../../components/Tooltip';
import { useVe33V3Positions } from './useVe33V3Positions';
import { FailedList } from '../../../components/List/FailedList';
import React from 'react';
import { Bound } from '../Ve33V3PoolOperate/types';
import { nearestUsableTick } from '../Ve33V3PoolOperate/utils/nearestUsableTick';
import { TickMath } from '../Ve33V3PoolOperate/utils/tickMath';
import PositionManage from '../Ve33V3PoolOperate/components/PositionManage';
import Ve33StakeDialog, {
  OperateType as StakeOperateType,
} from '../Ve33StakeDialog';
import { useFetchFiatPriceBatch } from '../../../hooks/useFetchFiatPriceBatch';
import { useVe33V3ClaimEmissions } from '../hooks/useVe33V3ClaimEmissions';
import { useVe33V3ClaimTradingFees } from '../hooks/useVe33V3ClaimTradingFees';
import { Loading } from '@dodoex/icons';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';

export default function MyPosition({
  poolInfo,
  account,
}: {
  poolInfo?: Ve33PoolInfoI;
  account: string;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { fetchBalance, positionsQuery, fetchStakedValues } =
    useVe33V3Positions({
      poolInfo,
      account,
    });
  const usdLoading =
    fetchBalance.isLoading ||
    positionsQuery.some((item) => item.isLoading) ||
    fetchStakedValues.isLoading;
  let unStakedUSD = 0,
    stakedUSD = 0;
  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: poolInfo ? [poolInfo.baseToken, poolInfo.quoteToken] : [],
  });
  if (fetchFiatPrice.data?.size === 2 && fetchStakedValues.data) {
    positionsQuery.forEach((item) => {
      if (item.data) {
        const usd = new BigNumber(item.data.amount0)
          .times(fetchFiatPrice.data?.get(poolInfo?.baseToken.address!) ?? 0)
          .plus(
            new BigNumber(item.data.amount1).times(
              fetchFiatPrice.data?.get(poolInfo?.quoteToken.address!) ?? 0,
            ),
          )
          .toNumber();
        if (fetchStakedValues.data.includes(BigInt(item.data.tokenId))) {
          stakedUSD += usd;
        } else {
          unStakedUSD += usd;
        }
      }
    });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        p: 20,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? undefined : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 20,
        }}
      >
        <Box sx={{ py: 8, pr: 20 }}>
          <Box sx={{ typography: 'h5' }}>
            <LoadingSkeleton
              component="span"
              loading={fetchBalance.isLoading || fetchStakedValues.isLoading}
              loadingProps={{
                width: 40,
              }}
            >
              {fetchBalance.data !== undefined &&
              fetchStakedValues.data !== undefined
                ? Number(fetchBalance.data) + fetchStakedValues.data?.length ||
                  0
                : 0}
            </LoadingSkeleton>{' '}
            <Trans>Position</Trans>
          </Box>
          <LoadingSkeleton
            loadingProps={{
              width: 100,
            }}
            loading={usdLoading}
            sx={{
              mt: 4,
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            (${formatReadableNumber({ input: unStakedUSD + stakedUSD })})
          </LoadingSkeleton>
        </Box>
        <Box
          sx={{
            py: 8,
            ...(!isMobile && {
              px: 20,
              borderLeft: `1px solid ${theme.palette.border.main}`,
            }),
          }}
        >
          <Box sx={{ typography: 'h5' }}>
            <LoadingSkeleton
              component="span"
              loading={fetchBalance.isLoading}
              loadingProps={{
                width: 40,
              }}
            >
              {fetchBalance.data?.toString() || 0}
            </LoadingSkeleton>{' '}
            <Trans>Unstake position</Trans>
          </Box>
          <LoadingSkeleton
            loadingProps={{
              width: 100,
            }}
            loading={usdLoading}
            sx={{
              mt: 4,
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            (${formatReadableNumber({ input: unStakedUSD })})
          </LoadingSkeleton>
        </Box>
        <Box
          sx={{
            py: 8,
            ...(!isMobile && {
              px: 20,
              borderLeft: `1px solid ${theme.palette.border.main}`,
            }),
          }}
        >
          <Box sx={{ typography: 'h5' }}>
            <LoadingSkeleton
              component="span"
              loading={fetchStakedValues.isLoading}
              loadingProps={{
                width: 40,
              }}
            >
              {fetchStakedValues.data?.length || 0}
            </LoadingSkeleton>{' '}
            <Trans>Stake position</Trans>
          </Box>
          <LoadingSkeleton
            loadingProps={{
              width: 100,
            }}
            loading={usdLoading}
            sx={{
              mt: 4,
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            (${formatReadableNumber({ input: stakedUSD })})
          </LoadingSkeleton>
        </Box>
      </Box>

      {/* position */}
      {fetchBalance.isLoading || fetchStakedValues.isLoading ? (
        <PositionItem poolInfo={poolInfo} account={account} />
      ) : (
        positionsQuery.map((positionQuery, i) => {
          if (positionQuery.errorRefetch)
            return <FailedList refresh={positionQuery.errorRefetch} />;
          if (positionQuery.isLoading)
            return (
              <PositionItem key={i} poolInfo={poolInfo} account={account} />
            );

          const isStaked = positionQuery.data
            ? fetchStakedValues.data?.includes(
                BigInt(positionQuery.data?.tokenId),
              )
            : false;
          return (
            <PositionItem
              key={(positionQuery.data?.tokenId ?? i) + (isStaked ? '1' : '0')}
              poolInfo={poolInfo}
              account={account}
              position={positionQuery?.data}
              isStaked={isStaked}
              refetchPosition={async () => {
                fetchStakedValues.refetch();
                fetchBalance.refetch();
                await positionQuery.refetch();
              }}
            />
          );
        })
      )}
    </Box>
  );
}

function PositionItem({
  poolInfo,
  account,
  position,
  isStaked,
  refetchPosition,
}: {
  poolInfo?: Ve33PoolInfoI;
  account: string;
  position?: ReturnType<typeof useVe33V3Positions>['positionsQuery'][0]['data'];
  isStaked?: boolean;
  refetchPosition?: () => void | Promise<void>;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const [showManage, setManage] = React.useState(false);
  const [showStakeType, setShowStakeType] =
    React.useState<StakeOperateType | null>(null);
  const basicToken = poolInfo ? basicTokenMap[poolInfo?.chainId] : undefined;
  const tokenId = position?.tokenId;
  const emissionsQuery = useQuery(
    getFetchVE33V3GaugeEarnedQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
      tokenId,
    ),
  );
  const fetchTickSpacing = useQuery(
    getFetchVE33V3PairTickSpacingQueryOptions(poolInfo?.chainId, poolInfo?.id),
  );
  const [priceLower, priceUpper] = React.useMemo(() => {
    const tickSpaceLimits = {
      [Bound.LOWER]: fetchTickSpacing.data
        ? nearestUsableTick(TickMath.MIN_TICK, Number(fetchTickSpacing.data))
        : undefined,
      [Bound.UPPER]: fetchTickSpacing.data
        ? nearestUsableTick(TickMath.MAX_TICK, Number(fetchTickSpacing.data))
        : undefined,
    };
    const priceLower = poolInfo
      ? tickToPrice(
          poolInfo.baseToken,
          poolInfo.quoteToken,
          position?.tickLower ?? 0,
        )
      : null;
    const priceUpper = poolInfo
      ? tickToPrice(
          poolInfo.baseToken,
          poolInfo.quoteToken,
          position?.tickUpper ?? 0,
        )
      : null;

    return [
      Number(position?.tickLower) === tickSpaceLimits[Bound.LOWER]
        ? '0'
        : priceLower?.toSignificant(),
      Number(position?.tickUpper) === tickSpaceLimits[Bound.UPPER]
        ? '∞'
        : priceUpper?.toSignificant(),
    ];
  }, [fetchTickSpacing.data]);

  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: poolInfo ? [poolInfo.baseToken, poolInfo.quoteToken] : [],
  });
  const usd = new BigNumber(position?.amount0 ?? 0)
    .times(fetchFiatPrice.data?.get(poolInfo?.baseToken.address!) ?? 0)
    .plus(
      new BigNumber(position?.amount1 ?? 0).times(
        fetchFiatPrice.data?.get(poolInfo?.quoteToken.address!) ?? 0,
      ),
    )
    .toNumber();

  const claimEmissionsMutation = useVe33V3ClaimEmissions({
    tokenId,
    gaugeAddress: poolInfo?.gaugeAddress,
    refetch: async () => {
      await emissionsQuery.refetch();
    },
  });
  const claimTradingFeesMutation = useVe33V3ClaimTradingFees({
    tokenId,
    refetch: async () => {
      await refetchPosition?.();
    },
  });

  return (
    <>
      <Box
        sx={{
          borderRadius: 12,
          border: `1px solid ${theme.palette.border.main}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : undefined,
            gap: 20,
            p: 20,
            borderRadius: theme.spacing(12, 12, 0, 0),
            backgroundColor: theme.palette.background.paperContrast,
          }}
        >
          <Box>
            <Box sx={{ typography: isMobile ? 'body1' : 'caption' }}>
              <Trans>Position</Trans>
              {tokenId ? ` #${tokenId}` : ''}
              <LoadingSkeleton
                component="span"
                loading={!position || !tokenId || fetchFiatPrice.isLoading}
                loadingProps={{
                  width: 100,
                }}
              >{` - $${usd}`}</LoadingSkeleton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 4,
                flexDirection: isMobile ? 'column' : undefined,
                mt: isMobile ? 8 : 0,
              }}
            >
              <Box
                sx={{
                  px: 8,
                  py: 2,
                  borderRadius: 20,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  typography: 'h6',
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                  },
                }}
              >
                <Trans>In Range</Trans>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <LoadingSkeleton
                  loading={!position || fetchTickSpacing.isLoading}
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {priceLower}
                </LoadingSkeleton>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11.5C1.72386 11.5 1.5 11.7239 1.5 12C1.5 12.2761 1.72386 12.5 2 12.5V11.5ZM8.35355 12.3536C8.54882 12.1583 8.54882 11.8417 8.35355 11.6464L5.17157 8.46447C4.97631 8.2692 4.65973 8.2692 4.46447 8.46447C4.2692 8.65973 4.2692 8.97631 4.46447 9.17157L7.29289 12L4.46447 14.8284C4.2692 15.0237 4.2692 15.3403 4.46447 15.5355C4.65973 15.7308 4.97631 15.7308 5.17157 15.5355L8.35355 12.3536ZM2 12.5H8V11.5H2V12.5Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                  <path
                    d="M12 6V18"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M22 12.5C22.2761 12.5 22.5 12.2761 22.5 12C22.5 11.7239 22.2761 11.5 22 11.5L22 12.5ZM15.6464 11.6464C15.4512 11.8417 15.4512 12.1583 15.6464 12.3536L18.8284 15.5355C19.0237 15.7308 19.3403 15.7308 19.5355 15.5355C19.7308 15.3403 19.7308 15.0237 19.5355 14.8284L16.7071 12L19.5355 9.17157C19.7308 8.97631 19.7308 8.65973 19.5355 8.46447C19.3403 8.2692 19.0237 8.2692 18.8284 8.46447L15.6464 11.6464ZM22 11.5L16 11.5L16 12.5L22 12.5L22 11.5Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                </svg>
                <LoadingSkeleton
                  loading={!position || fetchTickSpacing.isLoading}
                  sx={{
                    typography: 'body2',
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {priceUpper}
                </LoadingSkeleton>
              </Box>
            </Box>
          </Box>
          <Button
            variant={Button.Variant.second}
            size={Button.Size.small}
            onClick={() => setManage(true)}
          >
            <Trans>Manage</Trans>
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : undefined,
            gap: 16,
            p: isMobile ? theme.spacing(20, 12) : 20,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
            }}
          >
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.9403 3.23553C20.1955 2.99914 20.5305 2.8678 20.8783 2.8678C21.2262 2.8678 21.5612 2.99914 21.8163 3.23553C22.143 3.53653 22.9013 4.2762 23.5862 5.24687C24.25 6.18953 24.9617 7.5102 24.9617 8.9522C24.9617 11.2552 23.2257 13.2945 20.8783 13.2945C18.5322 13.2945 16.795 11.2552 16.795 8.9522C16.795 7.51137 17.5067 6.18953 18.1717 5.24687C18.6917 4.51833 19.2843 3.84443 19.9403 3.23553ZM5.95434 6.71803C6.2075 6.48881 6.53682 6.36187 6.87834 6.36187C7.21985 6.36187 7.54918 6.48881 7.80234 6.71803C8.04267 6.93503 8.51167 7.38653 8.92934 7.96987C9.32834 8.52637 9.795 9.35937 9.795 10.3125C9.795 11.919 8.52917 13.2945 6.87834 13.2945C5.2275 13.2945 3.96167 11.9179 3.96167 10.3125C3.96167 9.35937 4.42834 8.52637 4.82734 7.96987C5.245 7.38653 5.714 6.93503 5.95434 6.71803ZM12.3745 11.3824C12.6277 11.1561 12.9554 11.031 13.295 11.031C13.6346 11.031 13.9623 11.1561 14.2155 11.3824C14.6402 11.7604 15.8372 12.8734 16.9362 14.369C18.013 15.832 19.1283 17.8375 19.1283 19.9702C19.1283 23.2952 16.5897 26.1279 13.295 26.1279C10.0003 26.1279 7.46167 23.2964 7.46167 19.9702C7.46167 17.8375 8.577 15.832 9.65384 14.369C10.4592 13.2855 11.3706 12.285 12.3745 11.3824Z"
                fill="currentColor"
              />
            </svg>
          </Box>
          <div>
            <Box
              sx={{
                color: 'text.secondary',
                typography: 'body2',
                textAlign: isMobile ? 'center' : undefined,
              }}
            >
              <Trans>Total liquidity</Trans>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 8,
                flexDirection: isMobile ? 'column' : undefined,
              }}
            >
              <TokenAndAmount
                token={poolInfo?.baseToken}
                amount={position?.amount0}
                loading={!position}
                logoSize={18}
              />
              {!isMobile && <SplitLine />}
              <TokenAndAmount
                token={poolInfo?.quoteToken}
                amount={position?.amount1}
                loading={!position}
                logoSize={18}
              />
            </Box>
          </div>
        </Box>

        {/* detail */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            p: 12,
            mx: 12,
            mb: 20,
            borderRadius: 12,
            backgroundColor: 'background.paperContrast',
          }}
        >
          <DetailItem
            label={t`Unstake`}
            singleLine
            operate={
              <OperateBtn
                sx={{ ml: 20 }}
                onClick={() => setShowStakeType(StakeOperateType.Stake)}
                disabled={isStaked || !position?.liquidity}
              >
                <Trans>Stake</Trans>
              </OperateBtn>
            }
          >
            <TokenAndAmount
              token={poolInfo?.baseToken}
              amount={isStaked ? 0 : position?.amount0}
              loading={!position}
              logoSize={14}
            />
            {!isMobile && <SplitLine />}
            <TokenAndAmount
              token={poolInfo?.quoteToken}
              amount={isStaked ? 0 : position?.amount1}
              loading={!position}
              logoSize={14}
            />
          </DetailItem>
          <DetailItem
            label={t`Staked`}
            singleLine
            operate={
              <OperateBtn
                sx={{ ml: 20 }}
                disabled={!isStaked || !position?.liquidity}
                onClick={() => setShowStakeType(StakeOperateType.UnStake)}
              >
                <Trans>UnStake</Trans>
              </OperateBtn>
            }
          >
            <TokenAndAmount
              token={poolInfo?.baseToken}
              amount={!isStaked ? 0 : position?.amount0}
              loading={!position}
              logoSize={14}
            />
            {!isMobile && <SplitLine />}
            <TokenAndAmount
              token={poolInfo?.quoteToken}
              amount={!isStaked ? 0 : position?.amount1}
              loading={!position}
              logoSize={14}
            />
          </DetailItem>
          <DetailItem
            label={t`Trading Fees`}
            singleLine
            operate={
              <OperateBtn
                sx={{ ml: 20 }}
                disabled={!position?.tokensOwed1 || isStaked}
                isLoading={claimTradingFeesMutation.isPending}
                onClick={() => claimTradingFeesMutation.mutate()}
              >
                <Trans>Claim</Trans>
              </OperateBtn>
            }
          >
            <TokenAndAmount
              token={poolInfo?.baseToken}
              amount={position?.tokensOwed0?.toString()}
              loading={!position}
            />
            {!isMobile && <SplitLine />}
            <TokenAndAmount
              token={poolInfo?.quoteToken}
              amount={position?.tokensOwed1?.toString()}
              loading={!position}
            />
          </DetailItem>
          <DetailItem
            label={t`Emissions`}
            singleLine
            operate={
              <OperateBtn
                sx={{ ml: 20 }}
                disabled={!emissionsQuery.data}
                isLoading={claimEmissionsMutation.isPending}
                onClick={() => claimEmissionsMutation.mutate()}
              >
                <Trans>Claim</Trans>
              </OperateBtn>
            }
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!!basicToken && (
                <TokenAndAmount
                  token={{
                    ...basicToken,
                    chainId: poolInfo?.chainId as number,
                  }}
                  amount={emissionsQuery.data?.toString() || 0}
                  loading={emissionsQuery.isLoading}
                />
              )}
              <QuestionTooltip
                title={
                  <Box sx={{ typography: 'h6', lineHeight: '14px' }}>
                    {t`Lock ${basicToken?.symbol} to get ve${basicToken?.symbol}. You can use ve${basicToken?.symbol} to vote for more rewards.`}
                    <br />
                    <br />
                    <Box
                      component="a"
                      target="_blank"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          opacity: 0.7,
                        },
                      }}
                    >{t`Lock ${basicToken?.symbol} >`}</Box>
                  </Box>
                }
                sx={{
                  ml: 4,
                }}
              />
            </Box>
          </DetailItem>
        </Box>
      </Box>
      {showManage && (
        <PositionManage
          poolInfo={poolInfo}
          tokenId={tokenId}
          onClose={() => setManage(false)}
          dialog
        />
      )}
      {showStakeType && (
        <Ve33StakeDialog
          poolInfo={poolInfo}
          tokenId={tokenId}
          operateType={showStakeType}
          onClose={() => {
            setShowStakeType(null);
            refetchPosition?.();
          }}
        />
      )}
    </>
  );
}

function DetailItem({
  label,
  children,
  singleLine,
  operate,
}: React.PropsWithChildren<{
  label: React.ReactNode;
  singleLine?: boolean;
  operate?: React.ReactNode;
}>) {
  const { isMobile } = useWidgetDevice();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: !isMobile && singleLine ? 'center' : undefined,
        gap: 8,
        flexDirection: isMobile ? 'column' : undefined,
      }}
    >
      <Box sx={{ color: 'text.secondary', typography: 'h6' }}>{label}</Box>
      {singleLine ? (
        <DetailItemSingleContent operate={operate}>
          {children}
        </DetailItemSingleContent>
      ) : (
        children
      )}
    </Box>
  );
}

function DetailItemSingleContent({
  children,
  operate,
}: React.PropsWithChildren<{
  operate?: React.ReactNode;
}>) {
  const { isMobile } = useWidgetDevice();

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {children}
        </Box>
        {operate}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        typography: 'body2',
        fontWeight: 600,
      }}
    >
      {children}
      {operate}
    </Box>
  );
}

function OperateBtn({
  sx,
  disabled,
  children,
  isLoading,
  ...props
}: Parameters<typeof ButtonBase>[0] & {
  isLoading?: boolean;
}) {
  const theme = useTheme();

  return (
    <ButtonBase
      sx={{
        typography: 'h6',
        px: 8,
        py: 4,
        minWidth: 72,
        borderRadius: 8,
        '&:not(:disabled)': {
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
          boxShadow: `0px 0 4px 4px ${alpha(theme.palette.secondary.main, 0.2)}`,
          '&:hover': {
            opacity: 0.7,
          },
        },
        '&:disabled': {
          border: `solid 1px ${alpha(theme.palette.text.primary, 0.3)}`,
          color: theme.palette.text.disabled,
          cursor: 'default',
        },
        ...sx,
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Box
          component={Loading}
          sx={{
            mr: 8,
            '& path': {
              fill: theme.palette.text.disabled,
            },
            animation: 'loadingRotate 1.1s infinite linear',
            '@keyframes loadingRotate': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(359deg)',
              },
            },
          }}
        />
      )}
      {children}
    </ButtonBase>
  );
}

function TokenAndAmount({
  amount,
  token,
  loading,
  logoSize,
}: {
  amount: string | number | BigNumber | null | undefined;
  token: TokenInfo | undefined;
  loading?: boolean;
  logoSize?: number;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {!!logoSize && (
        <TokenLogo
          address={token?.address}
          chainId={token?.chainId}
          width={logoSize}
          height={logoSize}
          marginRight={4}
        />
      )}
      <LoadingSkeleton
        loading={loading}
        loadingProps={{
          width: 40,
        }}
      >
        {formatTokenAmountNumber({
          input: amount,
          decimals: token?.decimals,
        })}
      </LoadingSkeleton>
      <Box sx={{ color: 'text.secondary', ml: 4 }}>{token?.symbol}</Box>
    </Box>
  );
}

function SplitLine() {
  return (
    <Box
      sx={{
        mx: 8,
        width: '1px',
        height: '12px',
        backgroundColor: 'border.main',
      }}
    />
  );
}

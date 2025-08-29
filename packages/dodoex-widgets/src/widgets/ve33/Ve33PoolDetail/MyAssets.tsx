import {
  alpha,
  Box,
  ButtonBase,
  LoadingSkeleton,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import TokenLogo from '../../../components/TokenLogo';
import { Ve33PoolInfoI } from '../types';
import { formatTokenAmountNumber } from '../../../utils';
import React from 'react';
import { QuestionTooltip } from '../../../components/Tooltip';
import { basicTokenMap } from '@dodoex/api';
import { useVe33V2BalanceInfo } from '../Ve33V2PoolOperate/hooks/useVe33V2BalanceInfo';
import { FailedList } from '../../../components/List/FailedList';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchVE33V2GaugeBalanceOfQueryOptions,
  getFetchVE33V2GaugeEarnedQueryOptions,
  getFetchVE33V2PairClaimable0QueryOptions,
  getFetchVE33V2PairClaimable1QueryOptions,
} from '@dodoex/dodo-contract-request';
import { TokenInfo } from '../../../hooks/Token';
import BigNumber from 'bignumber.js';
import Ve33StakeDialog, {
  OperateType as StakeOperateType,
} from '../Ve33StakeDialog';
import { useVe33V2ClaimEmissions } from '../hooks/useVe33V2ClaimEmissions';
import { useVe33V2ClaimTradingFees } from '../hooks/useVe33V2ClaimTradingFees';
import { Loading } from '@dodoex/icons';
import { formatUnits } from '@dodoex/contract-request';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';

export default function MyAssets({
  poolInfo,
  account,
}: {
  poolInfo?: Ve33PoolInfoI;
  account?: string;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const basicToken = poolInfo ? basicTokenMap[poolInfo.chainId] : undefined;
  const [showStakeType, setShowStakeType] =
    React.useState<StakeOperateType | null>(null);
  const balanceInfo = useVe33V2BalanceInfo({
    pool: poolInfo,
    account,
  });
  const fetchStakedBalance = useQuery(
    getFetchVE33V2GaugeBalanceOfQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
    ),
  );

  const lpDecimals = 18;
  const stakedBalance = fetchStakedBalance.data
    ? formatUnits(fetchStakedBalance.data, lpDecimals)
    : undefined;
  const tradingFeeToken0Query = useQuery(
    getFetchVE33V2PairClaimable0QueryOptions(
      poolInfo?.chainId,
      poolInfo?.id,
      account,
    ),
  );
  const tradingFeeToken1Query = useQuery(
    getFetchVE33V2PairClaimable1QueryOptions(
      poolInfo?.chainId,
      poolInfo?.id,
      account,
    ),
  );
  const emissionsQuery = useQuery(
    getFetchVE33V2GaugeEarnedQueryOptions(
      poolInfo?.chainId,
      poolInfo?.gaugeAddress,
      account,
    ),
  );

  const claimEmissionsMutation = useVe33V2ClaimEmissions({
    gaugeAddress: poolInfo?.gaugeAddress,
    refetch: async () => {
      await emissionsQuery.refetch();
    },
  });
  const claimTradingFeesMutation = useVe33V2ClaimTradingFees({
    address: poolInfo?.id,
    refetch: async () => {
      tradingFeeToken0Query.refetch();
      tradingFeeToken1Query.refetch();
    },
  });

  if (balanceInfo.userLpToTokenBalanceErrorRefetch) {
    return (
      <FailedList
        refresh={() => {
          balanceInfo.userLpToTokenBalanceErrorRefetch?.();
        }}
        sx={{
          my: 40,
          height: '100%',
        }}
      />
    );
  }

  return (
    <Box sx={{ p: 20 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : undefined,
          gap: 16,
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
              textAlign: isMobile ? 'center' : undefined,
              typography: 'body2',
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
              amount={balanceInfo.userLpToToken0}
              loading={balanceInfo.userLpToTokenBalanceLoading}
              logoSize={18}
            />
            {!isMobile && <SplitLine />}
            <TokenAndAmount
              token={poolInfo?.quoteToken}
              amount={balanceInfo.userLpToToken1}
              loading={balanceInfo.userLpToTokenBalanceLoading}
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
          mt: 20,
          p: 12,
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
            >
              <Trans>Stake</Trans>
            </OperateBtn>
          }
        >
          <TokenAndAmount
            token={poolInfo?.baseToken}
            amount={balanceInfo.userLpToToken0}
            loading={balanceInfo.userLpToTokenBalanceLoading}
            logoSize={14}
          />
          {!isMobile && <SplitLine />}
          <TokenAndAmount
            token={poolInfo?.quoteToken}
            amount={balanceInfo.userLpToToken1}
            loading={balanceInfo.userLpToTokenBalanceLoading}
            logoSize={14}
          />
        </DetailItem>
        <DetailItem
          label={t`Staked`}
          singleLine
          operate={
            <OperateBtn
              sx={{ ml: 20 }}
              disabled={!fetchStakedBalance.data}
              onClick={() => setShowStakeType(StakeOperateType.UnStake)}
            >
              <Trans>UnStake</Trans>
            </OperateBtn>
          }
        >
          <TokenAndAmount
            token={poolInfo?.baseToken}
            amount={
              stakedBalance && balanceInfo.baseLpToTokenProportion
                ? new BigNumber(stakedBalance).times(
                    balanceInfo.baseLpToTokenProportion,
                  )
                : 0
            }
            loading={
              fetchStakedBalance.isLoading ||
              balanceInfo.userLpToTokenBalanceLoading
            }
            logoSize={14}
          />
          {!isMobile && <SplitLine />}
          <TokenAndAmount
            token={poolInfo?.quoteToken}
            amount={
              stakedBalance && balanceInfo.quoteLpToTokenProportion
                ? new BigNumber(stakedBalance).times(
                    balanceInfo.quoteLpToTokenProportion,
                  )
                : 0
            }
            loading={
              fetchStakedBalance.isLoading ||
              balanceInfo.userLpToTokenBalanceLoading
            }
            logoSize={14}
          />
        </DetailItem>
        <DetailItem
          label={t`Trading Fees`}
          singleLine
          operate={
            <OperateBtn
              sx={{ ml: 20 }}
              disabled={
                !tradingFeeToken0Query.data && !tradingFeeToken1Query.data
              }
              isLoading={claimTradingFeesMutation.isPending}
              onClick={() => claimTradingFeesMutation.mutate()}
            >
              <Trans>Claim</Trans>
            </OperateBtn>
          }
        >
          <TokenAndAmount
            token={poolInfo?.baseToken}
            amount={tradingFeeToken0Query.data?.toString() || 0}
            loading={tradingFeeToken0Query.isLoading}
          />
          {!isMobile && <SplitLine />}
          <TokenAndAmount
            token={poolInfo?.quoteToken}
            amount={tradingFeeToken1Query.data?.toString() || 0}
            loading={tradingFeeToken1Query.isLoading}
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
      {showStakeType && (
        <Ve33StakeDialog
          poolInfo={poolInfo}
          operateType={showStakeType}
          onClose={() => {
            setShowStakeType(null);
            balanceInfo.refetch();
            fetchStakedBalance.refetch();
          }}
        />
      )}
    </Box>
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

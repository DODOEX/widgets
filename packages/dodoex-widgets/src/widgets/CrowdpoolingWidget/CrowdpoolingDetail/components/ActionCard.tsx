import {
  Box,
  BoxProps,
  Button,
  LoadingSkeleton,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  useState,
  useMemo,
  ReactNode,
  PropsWithChildren,
  useEffect,
} from 'react';
import { CP_STATUS, CPDetail, CPStatusType } from '../../types';
import { Timeline } from './Timeline';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import { QuestionTooltip } from '../../../../components/Tooltip';
import { TokenCard } from '../../../../components/Swap/components/TokenCard';
import { basicTokenMap, ChainId } from '@dodoex/api';
import { TokenInfo } from '../../../../hooks/Token';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchCP_IS_OVERCAP_STOPQueryOptions,
  getFetchCPGetCpInfoHelperQueryOptions,
  getFetchCPGetSharesQueryOptions,
  getFetchFeeRateDIP3ImplGetCPInfoByUserQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import TokenStatusButton from '../../../../components/TokenStatusButton';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import {
  getExpectedReceiveFromCP,
  getRealTimePrice,
  isCPV2,
} from '../../helper';
import { useBidCp } from '../hooks/useBidCp';
import { formatUnits } from '@dodoex/contract-request';
import CountdownTime from '../../../../components/CountdownTime';
import { useClaimCp } from '../hooks/useClaimCp';
import { useSettleCp } from '../hooks/useSettleCp';
import SettleConfirmDialog from './SettleConfirmDialog';
import { useRemoveCp } from '../hooks/useRemoveCp';
import RemoveDialog from './RemoveDialog';

interface ActionCardProps {
  detail: CPDetail | undefined;
  status: CPStatusType;
  refetch: () => void;
}

export function ActionCard({
  detail,
  status,
  refetch: refetchDetail,
}: ActionCardProps) {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const notAmount = !Number(amount);
  const notDetail = !detail;
  const { baseToken, quoteToken } = detail ?? {};

  const { account } = useWalletInfo();

  const fetchFeeInfo = useQuery(
    getFetchFeeRateDIP3ImplGetCPInfoByUserQueryOptions(
      detail?.chainId,
      detail?.id,
      account,
    ),
  );

  const isV2 = isCPV2(detail?.version);
  const fetchIsOverflowLimit = useQuery(
    getFetchCP_IS_OVERCAP_STOPQueryOptions(
      detail?.chainId,
      !isV2 ? undefined : detail?.id,
    ),
  );
  const isRaised =
    fetchIsOverflowLimit.data &&
    new BigNumber(detail?.poolQuoteCap ?? 0).minus(detail?.totalShares)?.eq(0);

  const fetchUserShares = useQuery(
    getFetchCPGetSharesQueryOptions(detail?.chainId, detail?.id, account),
  );

  const fetchCpInfoHelper = useQuery(
    getFetchCPGetCpInfoHelperQueryOptions(
      detail?.chainId,
      !isV2 ? undefined : detail?.id,
      account,
    ),
  );
  const settledTime = Number(fetchCpInfoHelper.data?.settledTime) * 1000;
  const isSettled = !!fetchCpInfoHelper.data?.isSettled;
  const claimableBaeToken = fetchCpInfoHelper.data?.claimableBaseToken
    ? Number(
        formatUnits(
          fetchCpInfoHelper.data.claimableBaseToken,
          detail?.baseToken.decimals,
        ),
      )
    : 0;
  const claimedBaseToken = fetchCpInfoHelper.data?.claimedBaseToken
    ? Number(
        formatUnits(
          fetchCpInfoHelper.data.claimedBaseToken,
          detail?.baseToken.decimals,
        ),
      )
    : 0;
  const isClaimed = useMemo(
    () =>
      !fetchCpInfoHelper.data?.claimableBaseToken &&
      (fetchCpInfoHelper.data?.claimedBaseToken ?? BigInt(0)) > BigInt(0),
    [fetchCpInfoHelper.data],
  );

  const baseTokenPosition = useMemo(
    () =>
      fetchUserShares.data
        ? new BigNumber(
            formatUnits(fetchUserShares.data, detail?.baseToken.decimals),
          )
        : new BigNumber(0),
    [fetchUserShares.data, detail],
  );
  const isParticipated = useMemo(
    () => baseTokenPosition.gt(0),
    [baseTokenPosition],
  );
  const [baseTokenAmount, quoteTokenAmount] = useMemo(() => {
    let baseAmt = new BigNumber(0),
      quoteAmt = new BigNumber(0);
    if (detail) {
      const { price, poolQuote, poolQuoteCap } = detail;
      [baseAmt, quoteAmt] = getExpectedReceiveFromCP({
        investedQuote: baseTokenPosition,
        price,
        poolQuote,
        poolQuoteCap,
      });
    }

    return [baseAmt, quoteAmt];
  }, [detail, baseTokenPosition]);
  const [baseTokenAmountAfter, quoteTokenAmountAfter] = useMemo(() => {
    if (!detail || !amount) return [baseTokenAmount, quoteTokenAmount];

    const baseTokenPosition = fetchUserShares.data
      ? new BigNumber(
          formatUnits(fetchUserShares.data, detail?.baseToken.decimals),
        )
      : new BigNumber(0);
    const { price, poolQuote, poolQuoteCap, isEscalation } = detail;
    const amountRes =
      status !== CP_STATUS.CALMING
        ? new BigNumber(amount)
        : new BigNumber(amount).times(-1);
    return getExpectedReceiveFromCP({
      investedQuote: baseTokenPosition.plus(amountRes).toString(),
      price: isEscalation ? getRealTimePrice(detail, amountRes) : price,
      poolQuote: new BigNumber(poolQuote ?? 0).plus(amountRes).toString(),
      poolQuoteCap,
    });
  }, [
    detail,
    amount,
    status,
    baseTokenAmount,
    quoteTokenAmount,
    fetchUserShares.data,
  ]);

  const [qtToken, setQtToken] = useState<TokenInfo | null>(null);
  const qtTokenStatus = useTokenStatus(qtToken, {
    amount,
  });
  useEffect(() => {
    if (!qtToken && detail?.quoteToken) {
      const basicToken = basicTokenMap[detail.quoteToken.chainId as ChainId];
      if (
        detail.quoteToken.address.toLowerCase() ===
        basicToken.wrappedTokenAddress.toLowerCase()
      ) {
        setQtToken({
          chainId: detail.quoteToken.chainId,
          ...basicToken,
        });
      } else {
        setQtToken(detail.quoteToken);
      }
    }
  }, [detail]);

  const [showSettleConfirm, setShowSettleConfirm] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const refetch = () => {
    refetchDetail();
    fetchCpInfoHelper.refetch();
    fetchUserShares.refetch();
    fetchFeeInfo.refetch();
  };
  const claimMutation = useClaimCp({
    detail,
    successBack: () => {
      refetch();
    },
  });
  const bidMutation = useBidCp({
    detail,
    qtToken,
    quoteAmount: amount,
    submittedBack: () => {
      setAmount('');
    },
    successBack: () => {
      refetch();
    },
  });
  const settleMutation = useSettleCp({
    address: detail?.id,
    successBack: () => {
      refetch();
      setShowSettleConfirm(false);
    },
  });
  const removeMutation = useRemoveCp({
    detail,
    successBack: () => {
      refetch();
      setShowRemoveDialog(false);
    },
  });

  const renderActionButton = () => {
    if (!detail) return null;
    switch (status) {
      case CP_STATUS.SETTLING:
        return (
          <Button fullWidth onClick={() => setShowSettleConfirm(true)}>
            <Trans>Settle</Trans>
          </Button>
        );
      case CP_STATUS.ENDED:
        if (isParticipated && !isClaimed) {
          return (
            <Button
              fullWidth
              onClick={() => claimMutation.mutate()}
              isLoading={claimMutation.isPending}
              disabled={
                (claimableBaeToken === 0 && claimedBaseToken === 0) ||
                new BigNumber(settledTime ?? 0)
                  .plus(new BigNumber(detail.tokenClaimDuration).times(1000))
                  .gt(Date.now())
              }
            >
              <Trans>Claim</Trans>
            </Button>
          );
        }
        break;
      case CP_STATUS.WAITING:
      case CP_STATUS.PROCESSING:
        return (
          <TokenStatusButton status={qtTokenStatus}>
            <Button
              disabled={
                !!errorMessage || status === CP_STATUS.WAITING || isRaised
              }
              isLoading={bidMutation.isPending}
              onClick={() => bidMutation.mutate()}
            >
              {isRaised ? t`Raised` : t`Add`}
            </Button>
          </TokenStatusButton>
        );
      case CP_STATUS.CALMING:
        return (
          <Button
            fullWidth
            disabled={!!errorMessage}
            onClick={() => setShowRemoveDialog(true)}
          >
            <Trans>Remove</Trans>
          </Button>
        );
    }
    return null;
  };
  const buttonAction = renderActionButton();

  const overflowUserCap = useMemo(
    () =>
      !!(
        status !== CP_STATUS.CALMING &&
        fetchFeeInfo.data?.isHaveCap &&
        Number(amount) &&
        new BigNumber(amount).gt(Number(fetchFeeInfo.data?.curQuota))
      ),
    [amount, fetchFeeInfo.data],
  );

  let errorMessage = '';
  if (!Number(amount)) {
    errorMessage = t`Please provide amount of token`;
  }
  if (overflowUserCap) {
    errorMessage = t`Your participation amount must be less than or equal to your allocation`;
  }

  return (
    <Box
      sx={{
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
      }}
    >
      <Timeline status={status} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <RowItem label={<Trans>Swap Price</Trans>} loading={notDetail}>
          1 {baseToken?.symbol} ={' '}
          {formatTokenAmountNumber({
            input: detail?.price,
            decimals: quoteToken?.decimals,
          })}{' '}
          {quoteToken?.symbol}
        </RowItem>

        {(status === CP_STATUS.WAITING || status === CP_STATUS.PROCESSING) && (
          <>
            <TokenCard
              amt={amount}
              onInputChange={setAmount}
              token={qtToken}
              onTokenChange={setQtToken}
              onlyChangeEtherToken
              showPercentage
              canClickBalance
              readOnly={!qtToken}
            />
            {!!errorMessage && (
              <Box
                sx={{
                  backgroundColor: 'background.paperContrast',
                  color: 'error.main',
                  typography: 'h6',
                  height: 48,
                  lineHeight: '48px',
                  textAlign: 'center',
                  borderRadius: 8,
                }}
              >
                {errorMessage}
              </Box>
            )}
          </>
        )}

        {!!buttonAction && (
          <NeedConnectButton fullWidth chainId={detail?.chainId} includeButton>
            {buttonAction}
          </NeedConnectButton>
        )}

        {status !== CP_STATUS.ENDED &&
          status !== CP_STATUS.SETTLING &&
          !notAmount && (
            <RowItem label={t`Total Expected Gain`} loading={notDetail}>
              {formatTokenAmountNumber({
                input: baseTokenAmountAfter.abs(),
                decimals: detail?.baseToken.decimals,
              })}
              {` ${detail?.baseToken.symbol}`}
            </RowItem>
          )}
        {!notAmount && quoteTokenAmountAfter.gt(0) && (
          <RowItem loading={notDetail}>
            {formatTokenAmountNumber({
              input: quoteTokenAmountAfter.abs(),
              decimals: detail?.quoteToken.decimals,
            })}
            {` ${detail?.quoteToken.symbol}`}
          </RowItem>
        )}
        {status !== CP_STATUS.ENDED && status !== CP_STATUS.SETTLING && (
          <RowItem
            label={t`Fee`}
            question={t`Participating in crowdfunding pool construction will charge a certain percentage of the amount of participation fee`}
            loading={fetchFeeInfo.isLoading}
          >
            {!fetchFeeInfo.data?.userFee
              ? t`Free`
              : `${formatReadableNumber({
                  input: new BigNumber(
                    Number(fetchFeeInfo.data?.userFee),
                  ).times(100),
                  showDecimals: 2,
                })}%`}
          </RowItem>
        )}
        <RowItem
          label={t`Your Allocation`}
          question={t`This is the maximum allocation amount you are allowed to spend for this campaign`}
          loading={fetchFeeInfo.isLoading}
        >
          {fetchFeeInfo?.data?.isHaveCap
            ? `${formatTokenAmountNumber({ input: Number(fetchFeeInfo.data.curQuota), decimals: detail?.quoteToken.decimals })}`
            : fetchFeeInfo?.data
              ? t`Unlimited`
              : '-'}
        </RowItem>
        <RowItem
          label={t`You Have Paid`}
          loading={!detail || fetchUserShares.isLoading}
        >
          {`${formatTokenAmountNumber({ input: fetchUserShares.data ? formatUnits(fetchUserShares.data, detail!.quoteToken.decimals) : 0, decimals: detail?.quoteToken.decimals })} ${detail?.quoteToken.symbol}`}
        </RowItem>

        {status === CP_STATUS.PROCESSING && account && (
          <Box
            sx={{
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            <Box
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
              component="span"
              onClick={() => setShowRemoveDialog(true)}
            >
              <Trans>Remove</Trans>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            p: 12,
            typography: 'h6',
            borderRadius: 8,
            color: 'text.disabled',
            backgroundColor: theme.palette.background.paperDarkContrast,
          }}
        >
          <Trans>
            When the Crowdpooling campaign has exceeded 100% hard cap, your
            share will be allocated according to the proportion of your
            investment. Any excess funds will be returned to you.
          </Trans>
        </Box>

        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 8,
              borderRadius: 8,
              backgroundColor: theme.palette.background.input,
            }}
          >
            <Box sx={{ typography: 'h6' }}>
              <Trans>Claimable Amounts</Trans>
            </Box>
            <LoadingSkeleton
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                mt: 4,
                typography: 'h5',
                color: 'primary.main',
              }}
              loading={fetchCpInfoHelper.isLoading}
              loadingProps={{ width: 100 }}
            >
              {`${formatTokenAmountNumber({ input: claimableBaeToken, decimals: detail?.baseToken.decimals })} ${detail?.baseToken.symbol}`}
              <QuestionTooltip
                title={
                  <Box sx={{ typography: 'h6' }}>
                    <Box>
                      <Box sx={{ color: 'text.secondary' }}>
                        <Trans>Tokens you have claimed</Trans>
                      </Box>
                      <Box
                        sx={{ mt: 4, color: 'text.primary' }}
                      >{`${formatTokenAmountNumber({ input: claimedBaseToken, decimals: detail?.baseToken.decimals })} ${detail?.baseToken.symbol}`}</Box>

                      <Box sx={{ mt: 12, color: 'text.secondary' }}>
                        <Trans>Tokens to be released</Trans>
                      </Box>
                      <Box
                        sx={{ mt: 4, color: 'text.primary' }}
                      >{`${formatTokenAmountNumber({ input: baseTokenAmount?.minus(claimableBaeToken ?? 0).minus(claimedBaseToken ?? 0) || 0, decimals: detail?.baseToken.decimals })} ${detail?.baseToken.symbol}`}</Box>
                    </Box>
                  </Box>
                }
                sx={{
                  color: 'text.primary',
                }}
              />
            </LoadingSkeleton>
          </Box>
          <CountdownWrapper
            detail={detail}
            status={status}
            isClaimed={isClaimed}
            isSettled={isSettled}
            settledTime={settledTime}
          />
        </Box>
      </Box>
      <SettleConfirmDialog
        open={showSettleConfirm}
        onClose={() => setShowSettleConfirm(false)}
        chainId={detail?.chainId}
        onConfirm={() => settleMutation.mutate()}
        loading={settleMutation.isPending}
      />
      <RemoveDialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        token={detail?.quoteToken}
        baseTokenPosition={baseTokenPosition}
        balanceLoading={fetchUserShares.isLoading}
        chainId={detail?.chainId}
        onConfirm={removeMutation.mutate}
      />
    </Box>
  );
}

function RowItem({
  label,
  question,
  loading,
  children,
  sx,
}: PropsWithChildren<{
  label?: ReactNode;
  question?: ReactNode;
  loading?: boolean;
  sx?: BoxProps['sx'];
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        typography: 'body2',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          gap: 4,
        }}
      >
        {label}
        {!!question && <QuestionTooltip title={question} />}
      </Box>
      <LoadingSkeleton loading={loading} loadingProps={{ width: 80 }}>
        {children}
      </LoadingSkeleton>
    </Box>
  );
}

function CountdownWrapper({
  detail,
  status,
  isClaimed,
  isSettled,
  settledTime,
}: {
  detail: CPDetail | undefined;
  status: CPStatusType;
  isClaimed: boolean;
  isSettled: boolean;
  settledTime: number;
}) {
  const theme = useTheme();
  if (!detail) return null;

  let label = '';
  let claimEndTime: string | number = '';
  switch (status) {
    case CP_STATUS.WAITING:
      label = t`Start in`;
      claimEndTime = detail?.bidStartTime;
      break;
    case CP_STATUS.PROCESSING:
      label = t`Sale Ends In`;
      claimEndTime = detail?.bidEndTime;
      break;
    case CP_STATUS.CALMING:
      label = t`Cooling-off Period`;
      claimEndTime = detail?.calmEndTime;
      break;
    case CP_STATUS.ENDED:
      if (isSettled) {
        const time = new BigNumber(settledTime ?? 0)
          .plus(new BigNumber(detail.tokenClaimDuration).times(1000))
          .plus(new BigNumber(detail.tokenVestingDuration).times(1000))
          .toNumber();
        if (!isClaimed && time > Date.now()) {
          label = t`Full Release In`;
          claimEndTime = time;
        }
      }
  }

  if (!label || !claimEndTime) return null;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 8,
        borderRadius: 8,
        backgroundColor: theme.palette.background.paperDarkContrast,
      }}
    >
      <Box sx={{ typography: 'h6' }}>{label}</Box>
      <Box sx={{ mt: 4, typography: 'h5', color: 'primary.main' }}>
        <CountdownTime endTime={claimEndTime} />
      </Box>
    </Box>
  );
}

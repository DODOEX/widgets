import {
  alpha,
  Box,
  Input,
  LoadingSkeleton,
  Switch,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import Dialog from '../../../components/Dialog';
import { Lock, Point } from './hooks/useFetchUserLocks';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
  toWei,
} from '../../../utils';
import {
  getLockDurationByPointHistory,
  getLockDurationRemainder,
  getUnlockTimeText,
  getUnlockTimeTextShort,
  getVotingPowerByPointHistory,
  iMAXTIME,
} from '../Ve33LockOperate/utils';
import React from 'react';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import BigNumber from 'bignumber.js';
import { useFetchFiatPriceBatch } from '../../../hooks/useFetchFiatPriceBatch';
import { useIncreaesLock } from './hooks/useIncreaseLock';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFetchVE33VotingEscrowBalanceOfNFTQueryOptions,
  getFetchVE33VotingEscrowUserPointEpochQueryOptions,
  getFetchVE33VotingEscrowUserPointHistoryQueryOptions,
} from '@dodoex/dodo-contract-request';
import { useExtendLock } from './hooks/useExtendLock';
import LockSlider, { MAX_LOCK_DURATION } from '../components/LockSlider';
import { useTransferLock } from './hooks/useTransferLock';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';

export default function LockManageDialog({
  open,
  onClose,
  lock: lockProps,
  refetch: refetchProps,
}: {
  open: boolean;
  onClose: () => void;
  lock?: Lock | null;
  refetch?: () => void;
}) {
  const [manageTab, setManageTab] = React.useState(ManageTab.Increase);
  const lock = { ...lockProps } as Lock | undefined;
  const fetchPointEpoch = useQuery(
    getFetchVE33VotingEscrowUserPointEpochQueryOptions(
      lock?.chainId,
      lock?.tokenId,
    ),
  );
  const fetchPointHistory = useQuery(
    getFetchVE33VotingEscrowUserPointHistoryQueryOptions(
      lock?.chainId,
      lock?.tokenId,
      fetchPointEpoch.data !== undefined
        ? Number(fetchPointEpoch.data)
        : undefined,
    ),
  );
  const token = lock?.token;
  if (fetchPointHistory.data && lock) {
    const nowTime = Math.floor(Date.now() / 1000);
    const { bias, slope, permanent } = fetchPointHistory.data;
    lock.isPermanent = !!permanent;
    if (!lock.isPermanent) {
      const lockDuration = getLockDurationByPointHistory(bias, slope);
      lock.lockedEnd = (nowTime + lockDuration.toNumber()) * 1000;
    }
    if (token) {
      lock.votingPower = getVotingPowerByPointHistory(
        fetchPointHistory.data,
        nowTime,
      )
        .div(10 ** token?.decimals)
        .toString();
      lock.value = lock.isPermanent
        ? lock.votingPower
        : new BigNumber(slope.toString())
            .times(iMAXTIME)
            .div(10 ** token.decimals)
            .toString();
    }
  }
  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: token ? [token] : [],
  });
  const tokenUsd = token ? fetchFiatPrice.data?.get(token?.address) : undefined;
  const tokenUsdBg = tokenUsd !== undefined ? new BigNumber(tokenUsd) : null;

  const tabs = [
    { key: ManageTab.Increase, value: t`Increase` },
    { key: ManageTab.Extend, value: t`Extend` },
    { key: ManageTab.Transfer, value: t`Transfer` },
  ];
  const queryClient = useQueryClient();
  const refetch = () => {
    onClose();
    queryClient.invalidateQueries({
      queryKey: getFetchVE33VotingEscrowBalanceOfNFTQueryOptions(
        lock?.chainId,
        lock?.tokenId,
      ).queryKey,
    });
    fetchPointEpoch.refetch();
    refetchProps?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      modal
      pcWidth={420}
      title={<Box>{t`Lock #${lock?.tokenId ?? ''}`}</Box>}
      headerSx={{
        pb: 8,
      }}
    >
      <Box
        sx={{
          px: 20,
        }}
      >
        <Box
          sx={{
            mb: 20,
            typography: 'body2',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          <div>
            {`${formatTokenAmountNumber({ input: lock?.value, decimals: lock?.token?.decimals })} ${lock?.token?.symbol} ${t`Locked Until`}`}{' '}
            {lock ? (
              lock.isPermanent ? (
                `Max-Lock`
              ) : (
                <Tooltip title={getUnlockTimeText(lock?.lockedEnd)}>
                  <span>{getUnlockTimeTextShort(lock?.lockedEnd)}</span>
                </Tooltip>
              )
            ) : (
              ''
            )}
          </div>
          <div>
            <Tooltip
              title={formatReadableNumber({
                input: tokenUsdBg?.times(lock?.votingPower ?? 0) ?? '',
              })}
            >
              <LoadingSkeleton
                loading={!lock}
                loadingProps={{
                  display: 'inline-block',
                  width: 20,
                }}
                component="span"
                sx={{
                  mx: 4,
                  color: 'success.main',
                }}
              >
                {formatTokenAmountNumber({
                  input: lock?.votingPower,
                  decimals: token?.decimals,
                })}
              </LoadingSkeleton>
            </Tooltip>
            {` ve${lock?.token?.symbol} ${t`Voting Power Granted`}`}
          </div>
        </Box>
        <Tabs
          value={manageTab}
          onChange={(_, v) => setManageTab(v as ManageTab)}
        >
          <TabsButtonGroup variant="inPaper" tabs={tabs} />
          {!!lock && (
            <>
              <TabPanel value={ManageTab.Increase}>
                <IncreaseLock lock={lock} refetch={refetch} />
              </TabPanel>
              <TabPanel value={ManageTab.Extend}>
                <ExtendLock
                  lock={lock}
                  refetch={refetch}
                  point={fetchPointHistory.data}
                />
              </TabPanel>
              <TabPanel value={ManageTab.Transfer}>
                <TransferLock lock={lock} refetch={refetch} />
              </TabPanel>
            </>
          )}
        </Tabs>
      </Box>
    </Dialog>
  );
}

enum ManageTab {
  Increase = 1,
  Extend,
  Transfer,
}

function IncreaseLock({ lock, refetch }: { lock: Lock; refetch: () => void }) {
  const theme = useTheme();
  const [amount, setAmount] = React.useState('');
  const token = lock.token;
  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: token ? [token] : [],
  });
  const tokenUsd = token ? fetchFiatPrice.data?.get(token?.address) : undefined;
  const tokenUsdBg = tokenUsd !== undefined ? new BigNumber(tokenUsd) : null;
  const fiatPrice = tokenUsdBg && amount ? tokenUsdBg.times(amount) : 0;
  const increaesMutation = useIncreaesLock({
    refetch,
  });

  return (
    <Box
      sx={{
        pt: 20,
      }}
    >
      <Box
        sx={{
          mb: 8,
          typography: 'body2',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >{t`Add To Lock`}</Box>
      <TokenCard
        token={lock.token}
        amt={amount}
        onInputChange={setAmount}
        fiatPriceTxt={
          fetchFiatPrice.isError ? (
            '-'
          ) : (
            <LoadingSkeleton
              loading={fetchFiatPrice.isLoading}
              loadingProps={{
                display: 'inline-block',
                width: 40,
              }}
            >
              {`$${formatReadableNumber({
                input: fiatPrice,
                showDecimals: 1,
              })}`}
            </LoadingSkeleton>
          )
        }
      />
      <Box
        sx={{
          mt: 20,
          px: 20,
          py: 8,
          typography: 'h6',
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          textAlign: 'center',
        }}
      >{t`Depositing into the lock will increase your voting power. You can also extend the lock time.`}</Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          pt: 8,
          pb: 20,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NeedConnectButton
          chainId={lock.chainId}
          fullWidth
          disabled={!amount || !lock.tokenId || !token}
          isLoading={increaesMutation.isPending}
          onClick={() => {
            if (!token) return;
            increaesMutation.mutate({
              tokenId: lock.tokenId,
              amount: toWei(amount, token?.decimals).toS,
            });
          }}
        >{t`Increase`}</NeedConnectButton>
      </Box>
    </Box>
  );
}

function ExtendLock({
  lock,
  refetch,
  point,
}: {
  lock: Lock;
  refetch: () => void;
  point: Point | undefined;
}) {
  const theme = useTheme();
  const [isAutoMax, setIsAutoMax] = React.useState(false);
  const [lockDurationWeek, setLockDurationWeek] = React.useState(0);
  const token = lock.token;
  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: token ? [token] : [],
  });
  const tokenUsd = token ? fetchFiatPrice.data?.get(token?.address) : undefined;
  const tokenUsdBg = tokenUsd !== undefined ? new BigNumber(tokenUsd) : null;
  const lockData = React.useMemo(() => {
    const decimals = lock.token?.decimals;
    if (decimals == undefined || !point) return null;
    const lockDuration = getLockDurationByPointHistory(
      point?.bias.toString(),
      point?.slope.toString(),
    );
    const ts = new BigNumber(point?.ts.toString());
    return {
      lockDuration,
      ts,
      unlockTime: lockDuration.plus(ts),
      isPermanent: !!point.permanent,
    };
  }, [lock.token?.decimals, point]);
  const nowTime = Math.floor(Date.now() / 1000);
  const minLockDuration = React.useRef(0);
  React.useEffect(() => {
    if (lockData?.lockDuration && lockData?.lockDuration.gt(lockDurationWeek)) {
      const toNowTimeDuration = nowTime - lockData.ts.toNumber();
      const newLockDuration = lockData.lockDuration.minus(toNowTimeDuration);
      minLockDuration.current = newLockDuration
        .plus(
          getLockDurationRemainder(newLockDuration.plus(nowTime).toNumber()),
        )
        .toNumber();
      setLockDurationWeek(minLockDuration.current);
    }
  }, [lockData]);
  const isLoading = !point || !lockData?.lockDuration;
  const lockDuration = lockDurationWeek;
  const unlockTime = (nowTime + lockDuration) * 1000;
  const nftPowerBg =
    point && token
      ? new BigNumber(point.slope.toString())
          .times(lockDuration)
          .div(10 ** token?.decimals)
      : null;

  const extendMutation = useExtendLock({
    refetch,
  });
  const isPermanent = lock.isPermanent || lockData?.isPermanent;

  return (
    <Box
      sx={{
        pt: 20,
      }}
    >
      <Box
        sx={{
          p: 20,
          borderRadius: 8,
          typography: 'h6',
          backgroundColor: theme.palette.background.paperContrast,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
          }}
        >
          {t`Auto Max-Lock Mode`}
          <Switch
            size={16}
            checked={isAutoMax || isPermanent}
            onChange={(_, v) => {
              setIsAutoMax(v);
              if (v) {
                setLockDurationWeek(MAX_LOCK_DURATION);
              }
            }}
            disabled={isLoading || isPermanent}
          />
        </Box>
        <Box
          sx={{
            mt: 8,
            typography: 'body2',
            color: 'text.secondary',
          }}
        >{t`When activated, it sets the lock to maximum unlock time, until disabled. Once disabled, the regular vesting unlock time will apply. Maximum unlock time gives a 1-to-1 voting power to the amount of locked tokens.`}</Box>
      </Box>

      {!lock.isPermanent && (
        <Box
          sx={{
            mt: 20,
            px: 18,
            py: 16,
            typography: 'h6',
            borderRadius: 12,
            backgroundColor: theme.palette.background.input,
            border: `solid 1px ${theme.palette.border.main}`,
          }}
        >
          <Box
            sx={{
              mb: 16,
              textAlign: 'center',
            }}
          >
            <Trans>Extend to</Trans>
            <Tooltip title={getUnlockTimeText(unlockTime)}>
              <LoadingSkeleton
                loading={isLoading}
                loadingProps={{
                  display: 'inline-block',
                  width: 20,
                }}
                component="span"
                sx={{
                  mx: 4,
                  color: 'success.main',
                }}
              >
                {getUnlockTimeTextShort(unlockTime)}
              </LoadingSkeleton>
            </Tooltip>
            <br />
            <Trans>for</Trans>
            <Tooltip
              title={formatReadableNumber({
                input: tokenUsdBg?.times(nftPowerBg ?? 0) ?? '',
              })}
            >
              <LoadingSkeleton
                loading={isLoading}
                loadingProps={{
                  display: 'inline-block',
                  width: 20,
                }}
                component="span"
                sx={{
                  mx: 4,
                  color: 'success.main',
                }}
              >
                {formatTokenAmountNumber({
                  input: nftPowerBg,
                  decimals: token?.decimals,
                })}
              </LoadingSkeleton>
            </Tooltip>
             {`ve${token?.symbol} `}
            <Trans>voting power</Trans>
          </Box>
          <LockSlider
            value={lockDurationWeek}
            disabled={isLoading || isPermanent}
            onChange={(_, v) => {
              const value = v as number;
              if (value < minLockDuration.current) {
                setLockDurationWeek(minLockDuration.current);
              } else {
                setLockDurationWeek(value);
              }
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          mt: 20,
          px: 20,
          py: 8,
          typography: 'h6',
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          textAlign: 'center',
        }}
      >{t`You can extend the lock or increase the lock amount. These actions will increase your voting power. The maximum lock time is 1 years!`}</Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          pt: 8,
          pb: 20,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NeedConnectButton
          chainId={lock.chainId}
          fullWidth
          disabled={
            !lockDurationWeek || !lock.tokenId || isLoading || isPermanent
          }
          isLoading={extendMutation.isPending}
          onClick={() => {
            extendMutation.mutate({
              tokenId: lock.tokenId,
              lockDuration: isAutoMax ? 0 : lockDurationWeek,
            });
          }}
        >
          {isAutoMax ? t`Enable Auto Max-Lock` : t`Extend`}
        </NeedConnectButton>
      </Box>
    </Box>
  );
}

function TransferLock({ lock, refetch }: { lock: Lock; refetch: () => void }) {
  const theme = useTheme();
  const { account } = useWalletInfo();
  const [address, setAddress] = React.useState('');

  const transferMutation = useTransferLock({
    refetch,
  });

  return (
    <Box>
      <Box
        sx={{
          mt: 20,
          typography: 'h6',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >{t`Wallet address where the lock will be transferred`}</Box>
      <Input
        value={address}
        onChange={(evt) => setAddress(evt.target.value)}
        height={48}
        fullWidth
        placeholder="0x"
        sx={{
          mt: 8,
        }}
      />
      <Box
        sx={{
          mt: 20,
          px: 20,
          py: 8,
          typography: 'h6',
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          textAlign: 'center',
        }}
      >{t`Transferring a lock will also transfer any rewards and rebases! Before continuing, please make sure you have claimed all available rewards`}</Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          pt: 8,
          pb: 20,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NeedConnectButton
          chainId={lock.chainId}
          fullWidth
          disabled={!lock.tokenId || !address}
          isLoading={transferMutation.isPending}
          onClick={() => {
            transferMutation.mutate({
              tokenId: lock.tokenId,
              fromAddress: account ?? '',
              toAddress: address,
            });
          }}
        >
          {t`Transfer`}
        </NeedConnectButton>
      </Box>
    </Box>
  );
}
